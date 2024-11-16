"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const request_ip_1 = __importDefault(require("request-ip"));
const ErrorHelper_1 = __importDefault(require("../utils/ErrorHelper"));
const jwt_1 = require("../utils/jwt");
const Session_1 = require("../models/Session");
const User_1 = require("../models/User");
const CookierHelper_1 = __importDefault(require("../utils/CookierHelper"));
const UserAgentParser_1 = require("../utils/UserAgentParser");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenCookie = CookierHelper_1.default.getCookie(req)[`${process.env.JWT_ACCESS_COOKIE_NAME}`];
    const refreshTokenCookie = CookierHelper_1.default.getCookie(req)[`${process.env.JWT_REFRESH_COOKIE_NAME}`];
    let jwtAccessCookieDecoded;
    if (!refreshTokenCookie) {
        res.clearCookie(`${process.env.JWT_ACCESS_COOKIE_NAME}`);
        res.clearCookie(`${process.env.JWT_REFRESH_COOKIE_NAME}`);
        return next(new ErrorHelper_1.default('You are not logged in!', 401));
    }
    if (accessTokenCookie) {
        jwtAccessCookieDecoded = yield (0, jwt_1.decodeJWTToken)(accessTokenCookie, `${process.env.JWT_ACCESS_TOKEN_SECRET}`);
    }
    const jwtRefreshCookieDecoded = yield (0, jwt_1.decodeJWTToken)(refreshTokenCookie, `${process.env.JWT_REFRESH_TOKEN_SECRET}`);
    // check if session is expired
    const activeSession = (yield Session_1.Session.findOne({
        where: {
            token: jwtRefreshCookieDecoded === null || jwtRefreshCookieDecoded === void 0 ? void 0 : jwtRefreshCookieDecoded.token,
        },
    }));
    if (!activeSession) {
        res.clearCookie(`${process.env.JWT_ACCESS_COOKIE_NAME}`);
        res.clearCookie(`${process.env.JWT_REFRESH_COOKIE_NAME}`);
        return next(new ErrorHelper_1.default('You are not logged in!', 401));
    }
    const dbDate = new Date(activeSession.expiresAt);
    const sysDate = new Date();
    if (sysDate > dbDate) {
        res.clearCookie(`${process.env.JWT_ACCESS_COOKIE_NAME}`);
        res.clearCookie(`${process.env.JWT_REFRESH_COOKIE_NAME}`);
        return next(new ErrorHelper_1.default('You are not logged in!', 401));
    }
    // Check if user still exists
    const userExists = yield User_1.User.findOne({
        where: {
            id: activeSession === null || activeSession === void 0 ? void 0 : activeSession.userId,
        },
    });
    if (!userExists) {
        res.clearCookie(`${process.env.JWT_ACCESS_COOKIE_NAME}`);
        res.clearCookie(`${process.env.JWT_REFRESH_COOKIE_NAME}`);
        return next(new ErrorHelper_1.default('You are not logged in!', 401));
    }
    // renew refresh token
    const jwtAccessToken = (0, jwt_1.createJWTAccessToken)({
        id: userExists === null || userExists === void 0 ? void 0 : userExists.id,
        username: userExists === null || userExists === void 0 ? void 0 : userExists.username,
    });
    req.user = userExists;
    res.locals.user = userExists;
    if (!accessTokenCookie) {
        CookierHelper_1.default.createCookie(res, `${process.env.JWT_ACCESS_COOKIE_NAME}`, jwtAccessToken, {
            expires: new Date(Date.now() + 6 + 3600 * 1000), // 1 hour
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        });
    }
    // create a new refresh token if old token is invalid
    if (!refreshTokenCookie) {
        if (accessTokenCookie) {
            jwtAccessCookieDecoded = yield (0, jwt_1.decodeJWTToken)(accessTokenCookie, `${process.env.JWT_ACCESS_TOKEN_SECRET}`);
            const user = yield User_1.User.findOne({
                where: {
                    id: jwtAccessCookieDecoded === null || jwtAccessCookieDecoded === void 0 ? void 0 : jwtAccessCookieDecoded.id,
                },
            });
            if (!user) {
                res.clearCookie(`${process.env.JWT_ACCESS_COOKIE_NAME}`);
                res.clearCookie(`${process.env.JWT_REFRESH_COOKIE_NAME}`);
                return next(new ErrorHelper_1.default('You are not logged in!', 401));
            }
            const sessionPayload = {
                userId: user === null || user === void 0 ? void 0 : user.id,
                token: (0, uuid_1.v4)(),
                sessionIP: request_ip_1.default.getClientIp(req),
                sessionUserAgent: req.header('user-agent'),
                sessionOS: (0, UserAgentParser_1.UserAgentParser)(req.header('user-agent')),
                expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            };
            const sessionCreated = yield Session_1.Session.create(sessionPayload);
            if (!sessionCreated) {
                return next(new ErrorHelper_1.default('An internal error occured', 500));
            }
            const jwtRefreshToken = (0, jwt_1.createJWTRefreshToken)({
                token: sessionCreated === null || sessionCreated === void 0 ? void 0 : sessionCreated.token,
            });
            CookierHelper_1.default.createCookie(res, `${process.env.JWT_REFRESH_COOKIE_NAME}`, jwtRefreshToken, {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            });
            req.user = user;
            res.locals.user = user;
        }
    }
    next();
});

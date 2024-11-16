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
const request_ip_1 = __importDefault(require("request-ip"));
const uuid_1 = require("uuid");
const AuthValidation_1 = require("../validators/AuthValidation");
const jwt_1 = require("../utils/jwt");
const UserAgentParser_1 = require("../utils/UserAgentParser");
const User_1 = require("../models/User");
const Session_1 = require("../models/Session");
const Hashlib_1 = require("../utils/Hashlib");
const CookierHelper_1 = __importDefault(require("../utils/CookierHelper"));
const ErrorHelper_1 = __importDefault(require("../utils/ErrorHelper"));
const ValidationConfig_1 = __importDefault(require("../validators/ValidationConfig"));
class AuthController {
    /**
     * Static function to create a new session and send auth cookies
     * @param user Instance of user
     * @param req Express.req
     * @param res Express.res
     * @param next Express.next
     * @returns {Promise<void | Response<any | Record<string, any>>>}
     */
    static createSession(user, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const jwtAccessToken = (0, jwt_1.createJWTAccessToken)({
                id: user === null || user === void 0 ? void 0 : user.id,
                username: user === null || user === void 0 ? void 0 : user.username,
            });
            const jwtRefreshToken = (0, jwt_1.createJWTRefreshToken)({
                token: sessionCreated === null || sessionCreated === void 0 ? void 0 : sessionCreated.token,
            });
            CookierHelper_1.default.createCookie(res, `${process.env.JWT_ACCESS_COOKIE_NAME}`, jwtAccessToken, {
                expires: new Date(Date.now() + 6 + 3600 * 1000), // 1 hour
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            });
            CookierHelper_1.default.createCookie(res, `${process.env.JWT_REFRESH_COOKIE_NAME}`, jwtRefreshToken, {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            });
            return res.status(200).json({
                status: 'success',
                user: {
                    username: user === null || user === void 0 ? void 0 : user.username,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    avatar: `${process.env.APP_URL}/images/user/${user === null || user === void 0 ? void 0 : user.avatar}`,
                    rfid: jwtRefreshToken,
                    token: jwtAccessToken,
                },
            });
        });
    }
    /**
     * Static function to register an new user
     * @param req Request
     * @param res Response
     * @param next NextFunction
     * @returns {Promise<void | Response<string, any>>}
     */
    static Signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const signupValidation = AuthValidation_1.signupSchema.validate(req.body, ValidationConfig_1.default);
            if (signupValidation.error) {
                return next(new ErrorHelper_1.default(signupValidation.error.message, 400));
            }
            const userCreated = (yield User_1.User.create(req.body));
            if (!userCreated) {
                return next(new ErrorHelper_1.default('An internal error occured!', 500));
            }
            AuthController.createSession(userCreated, req, res, next);
        });
    }
    /**
     * Authenticate and login a user
     * @param req Request
     * @param res Response
     * @param next NextFunction
     * @returns {Promise<void | Record<string, any>>}
     */
    static Login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginValidation = AuthValidation_1.loginSchema.validate(req.body, ValidationConfig_1.default);
            if (loginValidation.error) {
                return next(new ErrorHelper_1.default(loginValidation.error.message, 400));
            }
            const { email, password } = req.body;
            const getUser = yield User_1.User.findOne({
                where: {
                    email,
                },
            });
            const thePassword = (0, Hashlib_1.bcryptCompare)(password, `${getUser === null || getUser === void 0 ? void 0 : getUser.password}`);
            if (!getUser || !thePassword) {
                return next(new ErrorHelper_1.default('Invalid user credentials', 401));
            }
            if (!(getUser === null || getUser === void 0 ? void 0 : getUser.isEnabled)) {
                return next(new ErrorHelper_1.default('Account disabled', 401));
            }
            AuthController.createSession(getUser, req, res, next);
        });
    }
    /**
     * Logout user from session
     * @param req Request
     * @param res Response
     * @param next NextFunction
     * @returns {Promise<void | Record<string, any>>}
     */
    static Logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtRefreshCookie = CookierHelper_1.default.getCookie(req)[`${process.env.JWT_REFRESH_COOKIE_NAME}`];
            const decodedItem = (yield (0, jwt_1.decodeJWTToken)(jwtRefreshCookie, `${process.env.JWT_REFRESH_TOKEN_SECRET}`));
            yield Session_1.Session.destroy({
                where: {
                    token: decodedItem === null || decodedItem === void 0 ? void 0 : decodedItem.token,
                },
            });
            // Invalidate cookies
            res.clearCookie(`${process.env.JWT_ACCESS_COOKIE_NAME}`);
            res.clearCookie(`${process.env.JWT_REFRESH_COOKIE_NAME}`);
            return res.status(200).json({
                status: 'success',
                message: 'Logout success',
            });
        });
    }
}
exports.default = AuthController;

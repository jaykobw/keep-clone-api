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
const Session_1 = require("../models/Session");
const ErrorHelper_1 = __importDefault(require("../utils/ErrorHelper"));
class SessionController {
    /**
     * Get all user sessions
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const allSessions = yield Session_1.Session.findAll({
                attributes: {
                    exclude: [
                        'id',
                        'userId',
                        'name',
                        'sessionUserAgent',
                        'expiresAt',
                        'updatedAt',
                    ],
                },
                where: {
                    userId,
                },
            });
            if (!allSessions) {
                return next(new ErrorHelper_1.default('An internal error occured', 400));
            }
            return res.status(200).json({
                status: 'success',
                data: allSessions,
            });
        });
    }
    /**
     * Destroy a single instance of a session
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static destory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const sessionId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
            if (!sessionId) {
                return next(new ErrorHelper_1.default('Session token is invalid', 400));
            }
            const destorySession = yield Session_1.Session.destroy({
                where: {
                    token: sessionId,
                },
            });
            if (!destorySession) {
                return next(new ErrorHelper_1.default('An internal error occured', 400));
            }
            return res.status(204).json({
                status: 'success',
                message: 'Session terminated succesfully',
            });
        });
    }
}
exports.default = SessionController;

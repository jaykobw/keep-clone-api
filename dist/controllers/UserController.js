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
const sharp_1 = __importDefault(require("sharp"));
const User_1 = require("../models/User");
const ErrorHelper_1 = __importDefault(require("../utils/ErrorHelper"));
const AuthValidation_1 = require("../validators/AuthValidation");
const ValidationConfig_1 = __importDefault(require("../validators/ValidationConfig"));
const Hashlib_1 = require("../utils/Hashlib");
class UserController {
    /**
     * Get current logged in user profile
     * @param req Express.Request
     * @param res Express.Response
     * @param next Express.NextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const user = yield User_1.User.findOne({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                return next(new ErrorHelper_1.default('User not found', 401));
            }
            return res.status(200).json({
                status: 'success',
                data: {
                    email: user === null || user === void 0 ? void 0 : user.email,
                    username: user === null || user === void 0 ? void 0 : user.username,
                    avatar: `${process.env.APP_URL}/images/user/${user === null || user === void 0 ? void 0 : user.avatar}`,
                },
            });
        });
    }
    /**
     * Update username
     * @param req Express.Request
     * @param res Express.Response
     * @param next Express.NextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static updateUsername(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const usernameValidation = AuthValidation_1.updateUsernameSchema.validate(req.body, ValidationConfig_1.default);
            if (usernameValidation.error) {
                return next(new ErrorHelper_1.default(usernameValidation.error.message, 400));
            }
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const updateUsername = yield User_1.User.update({
                username: (_b = req.body) === null || _b === void 0 ? void 0 : _b.username,
            }, {
                where: {
                    id: userId,
                },
            });
            if (!updateUsername) {
                return next(new ErrorHelper_1.default('An internal error occured', 400));
            }
            return res.status(200).json({
                status: 'success',
                message: 'Username updated succesfully',
                data: {
                    username: (_c = req.body) === null || _c === void 0 ? void 0 : _c.username,
                },
            });
        });
    }
    /**
     * Update password
     * @param req Express.Request
     * @param res Express.Response
     * @param next Express.NextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const passwordValidation = AuthValidation_1.updatePasswordSchema.validate(req.body, ValidationConfig_1.default);
            if (passwordValidation.error) {
                return next(new ErrorHelper_1.default(passwordValidation.error.message, 400));
            }
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const currentUser = yield User_1.User.findOne({
                where: {
                    id: userId,
                },
            });
            if (!currentUser) {
                return next(new ErrorHelper_1.default('An internal error occured!', 400));
            }
            const comparePwd = (0, Hashlib_1.bcryptCompare)(req.body.currentPassword, currentUser === null || currentUser === void 0 ? void 0 : currentUser.password);
            if (!comparePwd) {
                return next(new ErrorHelper_1.default('Current password does not match', 400));
            }
            const updatePassword = yield User_1.User.update({
                password: (_b = req.body) === null || _b === void 0 ? void 0 : _b.password,
                passwordLastUpdatedAt: Date.now(),
            }, {
                where: {
                    id: userId,
                },
            });
            if (!updatePassword) {
                return next(new ErrorHelper_1.default('An internal error occured', 400));
            }
            return res.status(200).json({
                status: 'success',
                message: 'Password updated succesfully',
            });
        });
    }
    /**
     * Update user avatar
     * @param req Express.Request
     * @param res Express.Response
     * @param next Express.NextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static updateAvatar(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!req.file)
                return next(new ErrorHelper_1.default('No file uploaded', 400));
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            req.file.filename = `user-${(_b = req.user) === null || _b === void 0 ? void 0 : _b.username}-${Date.now()}.jpeg`;
            yield (0, sharp_1.default)(req.file.buffer)
                .resize(500, 500)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/images/user/${req.file.filename}`);
            const updateAvatar = yield User_1.User.update({
                avatar: req.file.filename,
            }, {
                where: {
                    id: userId,
                },
            });
            if (!updateAvatar) {
                return next(new ErrorHelper_1.default('An internal error occured', 400));
            }
            return res.status(200).json({
                status: 'success',
                message: 'Avatar updated succesfully',
                data: {
                    avatar: `${process.env.APP_URL}/images/user/${(_c = req.file) === null || _c === void 0 ? void 0 : _c.filename}`,
                },
            });
        });
    }
}
exports.default = UserController;

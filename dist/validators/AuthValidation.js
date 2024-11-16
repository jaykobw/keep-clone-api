"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsernameSchema = exports.updatePasswordSchema = exports.isValidEmailSchema = exports.loginSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().min(3).max(15).required(),
    password: joi_1.default.string().min(3).max(60).required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).max(60).required(),
});
exports.isValidEmailSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.updatePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(3).max(60).required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('newPassword')).required(),
});
exports.updateUsernameSchema = joi_1.default.object({
    username: joi_1.default.string().min(2).max(15).required(),
});

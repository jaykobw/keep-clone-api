"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWTToken = exports.createJWTResetToken = exports.createJWTRefreshToken = exports.createJWTAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWTAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, `${process.env.JWT_ACCESS_TOKEN_SECRET}`, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
};
exports.createJWTAccessToken = createJWTAccessToken;
const createJWTRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, `${process.env.JWT_REFRESH_TOKEN_SECRET}`, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
};
exports.createJWTRefreshToken = createJWTRefreshToken;
const createJWTResetToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, `${process.env.JWT_RESET_TOKEN_SECRET}`, {
        expiresIn: process.env.JWT_RESET_TOKEN_EXPIRES_IN,
    });
};
exports.createJWTResetToken = createJWTResetToken;
const decodeJWTToken = (token, signingKey, options = {}) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, signingKey, options, function (onError, onSuccess) {
            if (onError)
                return reject(onError);
            resolve(onSuccess);
        });
    });
};
exports.decodeJWTToken = decodeJWTToken;

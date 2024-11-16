"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const useRateLimiter = (app) => {
    const limiter = (0, express_rate_limit_1.default)({
        limit: Number(process.env.RATE_LIMIT_MAX) || 100,
        windowMs: 60 * 60 * 1000,
        statusCode: 429,
        message: {
            status: 429,
            message: 'Too many requests from this IP',
        },
    });
    app.use('/api', limiter);
};
exports.default = useRateLimiter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: './.env',
});
const useCors = (app) => {
    const corsConfig = {
        origin: process.env.APP_ORIGIN_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    };
    app.use((0, cors_1.default)(corsConfig));
};
exports.default = useCors;

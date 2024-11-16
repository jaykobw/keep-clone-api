"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const AsyncHelper_1 = __importDefault(require("../utils/AsyncHelper"));
const router = (0, express_1.Router)();
router.post('/login', (0, AsyncHelper_1.default)(AuthController_1.default.Login));
router.post('/signup', (0, AsyncHelper_1.default)(AuthController_1.default.Signup));
router.post('/logout', (0, AsyncHelper_1.default)(AuthController_1.default.Logout));
exports.default = router;

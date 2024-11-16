"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const MulterFileHelper_1 = require("../utils/MulterFileHelper");
const AsyncHelper_1 = __importDefault(require("../utils/AsyncHelper"));
const router = (0, express_1.Router)();
router.use(AuthMiddleware_1.default);
router.get('/me', (0, AsyncHelper_1.default)(UserController_1.default.getUser));
router.patch('/update-username', (0, AsyncHelper_1.default)(UserController_1.default.updateUsername));
router.patch('/update-password', (0, AsyncHelper_1.default)(UserController_1.default.updatePassword));
router.patch('/update-avatar', MulterFileHelper_1.uploadProfilePhoto, (0, AsyncHelper_1.default)(UserController_1.default.updateAvatar));
exports.default = router;

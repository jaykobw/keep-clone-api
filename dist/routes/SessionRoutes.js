"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionController_1 = __importDefault(require("../controllers/SessionController"));
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const AsyncHelper_1 = __importDefault(require("../utils/AsyncHelper"));
const router = (0, express_1.Router)();
router.use(AuthMiddleware_1.default);
router.get('/', (0, AsyncHelper_1.default)(SessionController_1.default.index));
router.delete('/:id', (0, AsyncHelper_1.default)(SessionController_1.default.destory));
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const AsyncHelper_1 = __importDefault(require("../utils/AsyncHelper"));
const ArchiveController_1 = __importDefault(require("../controllers/ArchiveController"));
const router = (0, express_1.Router)();
router.use(AuthMiddleware_1.default);
router.route('/').get((0, AsyncHelper_1.default)(ArchiveController_1.default.index));
router.route('/:id').patch((0, AsyncHelper_1.default)(ArchiveController_1.default.update));
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const LabelController_1 = __importDefault(require("../controllers/LabelController"));
const AsyncHelper_1 = __importDefault(require("../utils/AsyncHelper"));
const router = (0, express_1.Router)();
router.use(AuthMiddleware_1.default);
router
    .route('/')
    .get((0, AsyncHelper_1.default)(LabelController_1.default.index))
    .post((0, AsyncHelper_1.default)(LabelController_1.default.store));
router
    .route('/:id')
    .get((0, AsyncHelper_1.default)(LabelController_1.default.show))
    .patch((0, AsyncHelper_1.default)(LabelController_1.default.update))
    .delete((0, AsyncHelper_1.default)(LabelController_1.default.destroy));
exports.default = router;

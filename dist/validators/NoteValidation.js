"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.noteSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).max(255).required(),
    content: joi_1.default.string().optional(),
    labelId: joi_1.default.string().optional(),
    tileColor: joi_1.default.string().optional(),
});

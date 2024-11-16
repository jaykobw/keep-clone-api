"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompression = void 0;
const compression_1 = __importDefault(require("compression"));
const useCompression = (app) => {
    app.use((0, compression_1.default)());
};
exports.useCompression = useCompression;
exports.default = exports.useCompression;

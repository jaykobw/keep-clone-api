"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHpp = void 0;
const hpp_1 = __importDefault(require("hpp"));
const useHpp = (app) => {
    app.use((0, hpp_1.default)());
};
exports.useHpp = useHpp;
exports.default = exports.useHpp;

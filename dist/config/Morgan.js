"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const DateHelper_1 = require("../utils/DateHelper");
dotenv_1.default.config({
    path: './.env',
});
const useMorgan = (app, filename = 'morgan') => {
    if (process.env.LOG_REQUEST === 'enabled' ||
        process.env.LOG_REQUEST === undefined) {
        const qualifiedFileName = `${filename}-${process.env.NODE_ENV}-${(0, DateHelper_1.getFullYear)()}-${(0, DateHelper_1.getMonth)()}-${(0, DateHelper_1.getDate)()}`;
        const writeLogStream = fs_1.default.createWriteStream(`${path_1.default.resolve(`./storage/logs/${qualifiedFileName}.log`)}`, {
            flags: 'a',
        });
        app.use((0, morgan_1.default)('combined', { stream: writeLogStream }));
    }
};
exports.default = useMorgan;

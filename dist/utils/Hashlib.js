"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomHexString = exports.resolveHashedToken = exports.createHashedToken = exports.bcryptCompare = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const bcryptCompare = (actualString, hashedString) => bcryptjs_1.default.compareSync(actualString, hashedString);
exports.bcryptCompare = bcryptCompare;
const createHashedToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
exports.createHashedToken = createHashedToken;
const resolveHashedToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
exports.resolveHashedToken = resolveHashedToken;
const randomHexString = (length) => {
    return crypto_1.default
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};
exports.randomHexString = randomHexString;

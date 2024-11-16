"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const Helmet_1 = __importDefault(require("./config/Helmet"));
const Cors_1 = __importDefault(require("./config/Cors"));
const RateLimiter_1 = __importDefault(require("./config/RateLimiter"));
const CookieParser_1 = __importDefault(require("./config/CookieParser"));
const Compression_1 = __importDefault(require("./config/Compression"));
const Morgan_1 = __importDefault(require("./config/Morgan"));
const Hpp_1 = __importDefault(require("./config/Hpp"));
const routes_1 = __importDefault(require("./routes"));
const ErrorController_1 = __importDefault(require("./controllers/ErrorController"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
(0, Helmet_1.default)(app);
(0, Cors_1.default)(app);
(0, RateLimiter_1.default)(app);
(0, CookieParser_1.default)(app);
(0, Compression_1.default)(app);
(0, Morgan_1.default)(app);
(0, Hpp_1.default)(app);
(0, routes_1.default)(app);
app.use(ErrorController_1.default);
exports.default = app;

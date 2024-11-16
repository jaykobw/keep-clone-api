"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthRoutes_1 = __importDefault(require("./AuthRoutes"));
const UserRoutes_1 = __importDefault(require("./UserRoutes"));
const SessionRoutes_1 = __importDefault(require("./SessionRoutes"));
const LabelRoutes_1 = __importDefault(require("./LabelRoutes"));
const NoteRoutes_1 = __importDefault(require("./NoteRoutes"));
const ArchiveRoutes_1 = __importDefault(require("./ArchiveRoutes"));
const RoutesRegister = (app) => {
    app.use('/api/auth/', AuthRoutes_1.default);
    app.use('/api/v1/user', UserRoutes_1.default);
    app.use('/api/v1/session', SessionRoutes_1.default);
    app.use('/api/v1/note', NoteRoutes_1.default);
    app.use('/api/v1/label', LabelRoutes_1.default);
    app.use('/api/v1/archive', ArchiveRoutes_1.default);
};
exports.default = RoutesRegister;

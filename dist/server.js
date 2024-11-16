"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Logger_1 = __importDefault(require("./utils/Logger"));
const app_1 = __importDefault(require("./app"));
const db_config_1 = __importDefault(require("./config/database/db.config"));
process.env.TZ = 'Africa/Nairobi';
process.on('uncaughtException', (err) => {
    Logger_1.default.info('UNCAUGHT EXCEPTION!');
    Logger_1.default.info(err.message);
    process.exit(1);
});
dotenv_1.default.config({
    path: './.env',
});
(0, db_config_1.default)();
const SERVER_PORT = process.env.APP_PORT || 3000;
const server = app_1.default.listen(SERVER_PORT, () => {
    Logger_1.default.info(`App is running on http://localhost:${SERVER_PORT}/`);
});
process.on('unhandledRejection', (err) => {
    Logger_1.default.info('UNHANDLED REJECTION! Shutting down...');
    Logger_1.default.info(err.name);
    console.error(err);
    server.close(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    Logger_1.default.info('SIGTERM RECEIVED. Shutting down');
    server.close(() => {
        Logger_1.default.info('Process terminated!');
        process.exit(1);
    });
});

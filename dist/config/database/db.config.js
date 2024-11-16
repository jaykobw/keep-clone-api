"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSequelizeConnection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
const config_json_1 = __importDefault(require("./config.json"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: './.env',
});
const env = process.env.NODE_ENV || 'development';
const config = config_json_1.default[env];
const DB_HOST = process.env.DB_HOST || config.host;
const DB_NAME = process.env.DB_DATABASE || config.database;
const DB_USERNAME = process.env.DB_USERNAME || config.username;
const DB_PASSWORD = process.env.DB_PASSWORD || `${config.password}`;
const DB_PORT = Number(process.env.DB_PORT) || config.port;
exports.useSequelizeConnection = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: '127.0.0.1',
    username: DB_USERNAME,
    password: 'postgres',
    database: DB_NAME,
    port: DB_PORT,
    logging: process.env.NODE_ENV === 'development' ? (msg) => Logger_1.default.debug(msg) : false,
    models: [path_1.default.join(__dirname, '../..', '/models')],
    dialectOptions: {},
    timezone: '+03:00',
});
const initializeDBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.useSequelizeConnection.authenticate();
        yield exports.useSequelizeConnection.sync({
            force: false,
            alter: false,
        });
        Logger_1.default.info('Database connected succesfully!');
    }
    catch (e) {
        Logger_1.default.info(`Failed to sync database connection with error : ${e === null || e === void 0 ? void 0 : e.message}`);
    }
});
exports.default = initializeDBConnection;

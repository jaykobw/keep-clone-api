"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHelper_1 = __importDefault(require("../utils/ErrorHelper"));
const handleDuplicateFieldsDB = (err) => {
    const value = err.original.sqlMessage.match(/(["'])(\\?.)*?\1/)[0];
    const message = `${value} is already in use. Please use another value!`;
    return new ErrorHelper_1.default(message, 400);
};
const handleJWTError = () => new ErrorHelper_1.default('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new ErrorHelper_1.default('Your token has expired! Please log in again.', 401);
const handleMulterUploadError = () => new ErrorHelper_1.default('Max is 4 files', 400);
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    res
        .status(err.statusCode)
        .render('error', { title: 'Something went wrong!', msg: err.message });
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }
};
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err);
        error.message = err.message;
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        if (error.name === 'SequelizeUniqueConstraintError')
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'MulterError')
            error = handleMulterUploadError();
        sendErrorProd(error, req, res);
    }
};

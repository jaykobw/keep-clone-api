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
const Label_1 = require("../models/Label");
const ErrorHelper_1 = __importDefault(require("../utils/ErrorHelper"));
const LabelValidation_1 = require("../validators/LabelValidation");
const ValidationConfig_1 = __importDefault(require("../validators/ValidationConfig"));
class LabelController {
    /**
     * Get all user labels
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const allLabels = yield Label_1.Label.findAll({
                attributes: {
                    exclude: ['userId', 'createdAt', 'updatedAt'],
                },
                where: {
                    userId,
                },
            });
            if (!allLabels) {
                return next(new ErrorHelper_1.default('An internal error occured', 400));
            }
            return res.status(200).json({
                status: 'success',
                data: allLabels,
            });
        });
    }
    /**
     * Get single label by ID
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static show(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const labelId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
            const labelItem = yield Label_1.Label.findOne({
                attributes: {
                    exclude: ['userId', 'createdAt', 'updatedAt'],
                },
                where: {
                    id: labelId,
                    userId: userId,
                },
            });
            if (!labelItem) {
                return next(new ErrorHelper_1.default('Label not found', 400));
            }
            return res.status(200).json({
                status: 'success',
                data: labelItem,
            });
        });
    }
    /**
     * Create new label
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const labelValidation = LabelValidation_1.labelSchema.validate(req.body, ValidationConfig_1.default);
            if (labelValidation.error) {
                return next(new ErrorHelper_1.default(labelValidation.error.message, 400));
            }
            const newLabel = (yield Label_1.Label.create(Object.assign(Object.assign({}, req.body), { userId })));
            if (!newLabel) {
                return next(new ErrorHelper_1.default('Failed to create label', 400));
            }
            const labelResponse = yield Label_1.Label.findByPk(newLabel.id, {
                attributes: {
                    exclude: ['userId', 'updatedAt', 'createdAt'],
                },
            });
            if (!labelResponse) {
                return next(new ErrorHelper_1.default('An internal error occured', 400));
            }
            return res.status(201).json({
                status: 'success',
                data: labelResponse,
            });
        });
    }
    /**
     * Update label by ID
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const labelId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            if (!labelId) {
                return next(new ErrorHelper_1.default('Label id is required', 400));
            }
            const labelValidation = LabelValidation_1.labelSchema.validate(req.body, ValidationConfig_1.default);
            if (labelValidation.error) {
                return next(new ErrorHelper_1.default(labelValidation.error.message, 400));
            }
            const idExists = yield Label_1.Label.findByPk(labelId);
            if (!idExists) {
                return next(new ErrorHelper_1.default('Label not found', 400));
            }
            const updateLabel = yield Label_1.Label.update({
                title: (_b = req.body) === null || _b === void 0 ? void 0 : _b.title,
            }, {
                where: {
                    id: labelId,
                },
            });
            if (!updateLabel) {
                return next(new ErrorHelper_1.default('Failed to update label', 400));
            }
            return res.status(200).json({
                status: 'success',
                message: 'Label update succesfully',
                data: {
                    title: (_c = req.body) === null || _c === void 0 ? void 0 : _c.title,
                },
            });
        });
    }
    /**
     * Destroy label by ID
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const labelId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            if (!labelId) {
                return next(new ErrorHelper_1.default('Label id is required', 400));
            }
            const deleteLabel = yield Label_1.Label.destroy({
                where: {
                    id: labelId,
                },
            });
            if (!deleteLabel) {
                return next(new ErrorHelper_1.default('Failed to delete label', 400));
            }
            return res.status(204).json({
                status: 'success',
                message: 'Label delete succesfully',
            });
        });
    }
}
exports.default = LabelController;

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
const ErrorHelper_1 = __importDefault(require("../utils/ErrorHelper"));
const Note_1 = require("../models/Note");
const Label_1 = require("../models/Label");
const ArchiveValidation_1 = require("../validators/ArchiveValidation");
const ValidationConfig_1 = __importDefault(require("../validators/ValidationConfig"));
class ArchiveController {
    /**
     * Get all user archived notes
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const allArchivedNotes = yield Note_1.Note.findAll({
                attributes: {
                    exclude: ['userId', 'createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: Label_1.Label,
                        as: 'label',
                        attributes: ['title'],
                    },
                ],
                where: {
                    userId,
                    isArchived: true,
                },
            });
            if (!allArchivedNotes) {
                return next(new ErrorHelper_1.default('Failed to get archived notes', 400));
            }
            return res.status(200).json({
                status: 'success',
                data: allArchivedNotes,
            });
        });
    }
    /**
     * Update note archive status
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const noteId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            if (!noteId) {
                return next(new ErrorHelper_1.default('Note Id is required', 400));
            }
            const acrhiveValidation = ArchiveValidation_1.acrhiveSchema.validate(req.body, ValidationConfig_1.default);
            if (acrhiveValidation.error) {
                return next(new ErrorHelper_1.default(acrhiveValidation.error.message, 400));
            }
            const noteIdExists = yield Note_1.Note.findByPk(noteId);
            if (!noteIdExists) {
                return next(new ErrorHelper_1.default('Note does not exist', 400));
            }
            const updateNote = yield Note_1.Note.update({
                isArchived: (_b = req.body) === null || _b === void 0 ? void 0 : _b.status,
                updatedAt: Date.now(),
            }, {
                where: {
                    id: noteId,
                },
            });
            if (!updateNote) {
                return next(new ErrorHelper_1.default('Failed to update note archive status', 400));
            }
            return res.status(200).json({
                status: 'success',
                data: {
                    isArchived: (_c = req.body) === null || _c === void 0 ? void 0 : _c.status,
                },
            });
        });
    }
}
exports.default = ArchiveController;

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
const NoteValidation_1 = require("../validators/NoteValidation");
const ValidationConfig_1 = __importDefault(require("../validators/ValidationConfig"));
const ErrorHelper_1 = __importDefault(require("../utils/ErrorHelper"));
const Note_1 = require("../models/Note");
const Label_1 = require("../models/Label");
class NoteController {
    /**
     * Get all user notes
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const allNotes = yield Note_1.Note.findAll({
                attributes: {
                    exclude: ['userId', 'createdAt', 'updatedAt'],
                },
                where: {
                    userId,
                },
                include: [
                    {
                        model: Label_1.Label,
                        as: 'label',
                        attributes: ['title'],
                    },
                ],
            });
            if (!allNotes) {
                return next(new ErrorHelper_1.default('Failed to fetch notes', 400));
            }
            return res.status(200).json({
                status: 'success',
                data: allNotes,
            });
        });
    }
    /**
     * Get single note by ID
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static show(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const noteId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
            if (!noteId) {
                return next(new ErrorHelper_1.default('Note Id is required', 400));
            }
            const findNote = yield Note_1.Note.findOne({
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
                    id: noteId,
                    userId,
                },
            });
            if (!findNote) {
                return next(new ErrorHelper_1.default('Failed to find note', 400));
            }
            return res.status(200).json({
                status: 'success',
                data: findNote,
            });
        });
    }
    /**
     * Create new note
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const noteValidation = NoteValidation_1.noteSchema.validate(req.body, ValidationConfig_1.default);
            if (noteValidation.error) {
                return next(new ErrorHelper_1.default(noteValidation.error.message, 400));
            }
            const newNote = (yield Note_1.Note.create(Object.assign(Object.assign({}, req.body), { userId })));
            if (!newNote) {
                return next(new ErrorHelper_1.default('Failed to create note', 400));
            }
            const noteResponse = yield Note_1.Note.findByPk(newNote.id, {
                attributes: {
                    exclude: ['userId', 'isArchived', 'createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: Label_1.Label,
                        as: 'label',
                        attributes: ['title'],
                    },
                ],
            });
            if (!noteResponse) {
                return next(new ErrorHelper_1.default('An internal error occured', 400));
            }
            return res.status(201).json({
                status: 'success',
                data: noteResponse,
            });
        });
    }
    /**
     * Update note by ID
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const noteId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            if (!noteId) {
                return next(new ErrorHelper_1.default('Note Id is required', 400));
            }
            const noteValidation = NoteValidation_1.noteSchema.validate(req.body, ValidationConfig_1.default);
            if (noteValidation.error) {
                return next(new ErrorHelper_1.default(noteValidation.error.message, 400));
            }
            const updateNote = yield Note_1.Note.update(Object.assign({}, req.body), {
                where: {
                    id: noteId,
                },
            });
            if (!updateNote) {
                return next(new ErrorHelper_1.default('Failed to update note', 400));
            }
            return res.status(200).json({
                status: 'success',
                message: 'Note updated succesfully',
            });
        });
    }
    /**
     * Destroy note by ID
     * @param req Express.request
     * @param res Express.response
     * @param next Express.nextFunction
     * @returns {Promise<void | Response<void | Record<string, any>>>}
     */
    static destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const noteId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
            if (!noteId) {
                return next(new ErrorHelper_1.default('Note Id is required', 400));
            }
            const deleteNote = yield Note_1.Note.destroy({
                where: {
                    id: noteId,
                    userId,
                },
            });
            if (!deleteNote) {
                return next(new ErrorHelper_1.default('Failed to delete note', 400));
            }
            return res.status(204).json({
                status: 'success',
                message: 'Note deleted succesfully',
            });
        });
    }
}
exports.default = NoteController;

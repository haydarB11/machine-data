const Joi = require('joi');
const i18next = require("../util/i18n/config");
const { ValidationError } = require('../util/customError');

class NoteValidation {
    static createNote = async (req, res, next) => {
        const Schema = Joi.object({
            text: Joi.string()
                .min(5)
                .max(2000)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Text" }),
                    'string.min': i18next.t('validation.min_message', { field: "Text", limit: '{{#limit}}' }),
                    'string.max': i18next.t('validation.max_message', { field: "Text", limit: '{{#limit}}' }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Text" }),
                    'any.required': i18next.t('validation.required_message', { field: "Text" }),
                }),
            well_no: Joi.string()
                .max(50)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Well No" }),
                    'string.max': i18next.t('validation.max_message', { field: "Well No", limit: '{{#limit}}' }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Well No" }),
                    'any.required': i18next.t('validation.required_message', { field: "Well No" }),
                }),
        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };
    static updateNote = async (req, res, next) => {
        const Schema = Joi.object({
            text: Joi.string()
                .min(5)
                .max(2000)
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Text" }),
                    'string.min': i18next.t('validation.min_message', { field: "Text", limit: '{{#limit}}' }),
                    'string.max': i18next.t('validation.max_message', { field: "Text", limit: '{{#limit}}' }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Text" }),
                }),
        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };
}

module.exports = NoteValidation;



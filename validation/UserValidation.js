const Joi = require('joi');
const i18next = require("../util/i18n/config");
const { ValidationError } = require('../util/customError');

class UserValidation {
    static createUser = async (req, res, next) => {
        const Schema = Joi.object({
            email: Joi.string()
                .email()
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Email" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Email" }),
                    'string.email': i18next.t('validation.email_message'),
                    'any.required': i18next.t('validation.required_message', { field: "Email" }),
                }),
            user_name: Joi.string()
                .min(3)
                .max(50)
                .required()
                .messages({
                    'string.min': i18next.t('validation.min_message', { field: "User Name", limit: '{{#limit}}' }),
                    'string.max': i18next.t('validation.max_message', { field: "User Name", limit: '{{#limit}}' }),
                    'string.base': i18next.t('validation.string_message', { field: "User Name" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "User Name" }),
                    'any.required': i18next.t('validation.required_message', { field: "User Name" }),
                }),
            name: Joi.string()
                .min(3)
                .max(50)
                .required()
                .messages({
                    'string.min': i18next.t('validation.min_message', { field: "Name", limit: '{{#limit}}' }),
                    'string.max': i18next.t('validation.max_message', { field: "Name", limit: '{{#limit}}' }),
                    'string.base': i18next.t('validation.string_message', { field: "Name" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Name" }),
                    'any.required': i18next.t('validation.required_message', { field: "Name" }),
                }),
            password: Joi.string()
                .min(8)
                .max(50)
                .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/))
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Password" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Password" }),
                    'string.min': i18next.t('validation.min_message', { field: "Password", limit: '{{#limit}}' }),
                    'string.max': i18next.t('validation.max_message', { field: "Password", limit: '{{#limit}}' }),
                    'any.required': i18next.t('validation.required_message', { field: "Password" }),
                    'string.pattern.base': i18next.t('validation.pattern_message'),
                }),
        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };

    static login = async (req, res, next) => {
        const Schema = Joi.object({
            input: Joi.string()
                .min(3)
                .max(50)
                .required()
                .messages({
                    'string.min': i18next.t('validation.min_message', { field: "Input", limit: '{{#limit}}' }),
                    'string.max': i18next.t('validation.max_message', { field: "Input", limit: '{{#limit}}' }),
                    'string.base': i18next.t('validation.string_message', { field: "Input" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Input" }),
                    'any.required': i18next.t('validation.required_message', { field: "Input" }),
                }),
            password: Joi.string()
                .min(8)
                .max(50)
                .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/))
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Password" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Password" }),
                    'string.min': i18next.t('validation.min_message', { field: "Password", limit: '{{#limit}}' }),
                    'string.max': i18next.t('validation.max_message', { field: "Password", limit: '{{#limit}}' }),
                    'any.required': i18next.t('validation.required_message', { field: "Password" }),
                    'string.pattern.base': i18next.t('validation.pattern_message'),
                }),
        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };
}

module.exports = UserValidation;



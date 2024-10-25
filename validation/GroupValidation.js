const Joi = require('joi');
const i18next = require("../util/i18n/config");
const { ValidationError, NotFoundError } = require('../util/customError');
const MachineService = require('../services/MachineService');
const UserService = require('../services/UserService');

class GroupValidation {
    static createGroup = async (req, res, next) => {
        const Schema = Joi.object({
            name: Joi.string()
                .max(50)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Name" }),
                    'string.max': i18next.t('validation.max_message', { field: "Name", limit: '{{#limit}}' }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Name" }),
                    'any.required': i18next.t('validation.required_message', { field: "Name" }),
                }),
        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };

    static order = async (req, res, next) => {
        const Schema = Joi.object({
            machines: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number()
                            .integer()
                            .positive()
                            .required()
                            .custom(async (value, helpers) => {
                                const machine = await MachineService.findModel(value);
                                if (!machine) {
                                    next(new NotFoundError(i18next.t("validation.not_found_message", { field: "Machine" })));
                                }
                                return value;
                            })
                            .messages({
                                'number.base': i18next.t('validation.number_message', { field: "ID" }),
                                'number.integer': i18next.t('validation.integer_message', { field: "ID" }),
                                'number.positive': i18next.t('validation.positive_message', { field: "ID" }),
                                'any.required': i18next.t('validation.required_message', { field: "ID" }),
                            })
                    }).unknown(true)
                )
                .min(1)
                .required()
                .messages({
                    'array.base': i18next.t('validation.array_message', { field: "Machines" }),
                    'array.min': i18next.t('validation.min_array_message', { field: "Machines", limit: '{{#limit}}' }),
                    'any.required': i18next.t('validation.required_message', { field: "Machines" }),
                }),
        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };

    static subscribe = async (req, res, next) => {
        const Schema = Joi.object({
            users:
                Joi.array().items(
                    Joi.number()
                        .integer()
                        .positive()
                        .messages({
                            'number.base': i18next.t('validation.number_message', { field: "User ID" }),
                            'number.integer': i18next.t('validation.integer_message', { field: "User ID" }),
                            'number.positive': i18next.t('validation.positive_message', { field: "User ID" }),
                        })
                ).messages({
                    'array.base': i18next.t('validation.array_message', { field: "Users" }),
                }),

            machines:
                Joi.array().items(
                    Joi.number()
                        .integer()
                        .positive()
                        .messages({
                            'number.base': i18next.t('validation.number_message', { field: "Machine ID" }),
                            'number.integer': i18next.t('validation.integer_message', { field: "Machine ID" }),
                            'number.positive': i18next.t('validation.positive_message', { field: "Machine ID" }),
                        })
                ).messages({
                    'array.base': i18next.t('validation.array_message', { field: "Machines" }),
                })
        });
        const { error, value } = Schema.validate(req.body, { abortEarly: false });

        if (error) {
            return next(new ValidationError(null, error));
        }

        const { users, machines } = value;
        if ((users === undefined || users.length === 0) && (machines === undefined || machines.length === 0)) {
            return next(new ValidationError(i18next.t('validation.xor_message', { field1: "Users", field2: "Machines" })));
        }
        next();
    };
}

module.exports = GroupValidation;



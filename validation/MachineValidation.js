const Joi = require('joi');
const i18next = require("../util/i18n/config");
const { ValidationError, NotFoundError } = require('../util/customError');
const GroupService = require('../services/GroupService');

class MachineValidation {
    static createMachine = async (req, res, next) => {
        const Schema = Joi.object({
            well_no: Joi.string()
                .max(50)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Well No" }),
                    'string.max': i18next.t('validation.max_message', { field: "Well No", limit: '{{#limit}}' }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Well No" }),
                    'any.required': i18next.t('validation.required_message', { field: "Well No" }),
                }),
            group_id: Joi.number()
                .integer()
                .positive()
                .required()
                .custom(async (value, helpers) => {
                    const group = await GroupService.findModel(value);
                    if (!group) {
                        next(new NotFoundError(i18next.t("validation.not_found_message", { field: "Group" })));
                    }
                    return value;
                })
                .messages({
                    'number.base': i18next.t('validation.number_message', { field: "ID" }),
                    'number.integer': i18next.t('validation.integer_message', { field: "ID" }),
                    'number.positive': i18next.t('validation.positive_message', { field: "ID" }),
                    'any.required': i18next.t('validation.required_message', { field: "ID" }),
                })
        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };
}

module.exports = MachineValidation;



const MachineService = require("../services/MachineService");
const { NotFoundError, ValidationError } = require("../util/customError");
const NoteValidation = require("./NoteValidation");
const Joi = require('joi');
const i18next = require("../util/i18n/config");

class ManagerNoteValidation extends NoteValidation {
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
            machine_id: Joi.number()
                .integer()
                .positive()
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

        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };
}

module.exports = ManagerNoteValidation;
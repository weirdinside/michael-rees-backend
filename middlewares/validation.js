const { Joi, celebrate } = require("celebrate");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCategory = (value, helpers) => {
  if (value === "personal" || value === "client") return value;
  return helpers.error("string.invalid");
};

const validateRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
    secret: Joi.string().required().messages({
      "string.empty": "The secret needs to be filled in",
    }),
  }),
});

const validateProjectBody = celebrate({
  body: Joi.object().keys({
    category: Joi.string().required().custom(validateCategory).messages({
      "string.invalid": "The category is invalid",
    }),
    description: Joi.string(),
    title: Joi.string().required().min(2).max(100).messages({
      "string.min": 'The minimum length of the "title" field is 2',
      "string.max": 'The maximum length of the "title" field is 30',
      "string.empty": 'The "title" field must be filled in',
    }),
    showTitle: Joi.boolean().required().messages({
      "boolean.base": "This field needs to be a boolean",
      "any.required": "This field needes to be populated",
      "boolean.empty": "This field cannot be empty",
    }),
    link: Joi.string().required().custom(validateURL).messages({
      "string.uri": "The 'link' field must be a valid URL",
      "string.empty": "The 'link' field must be filled in",
    }),
    role: Joi.string().required().min(2).max(50).messages({
      "string.min": 'The minimum length of the "role" field is 2',
      "string.max": 'The maximum length of the "role" field is 30',
      "string.empty": 'The "role" field must be filled in',
    }),
    thumbnail: Joi.string(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "name" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateId,
  validateLogin,
  validateRegister,
  validateProjectBody,
};

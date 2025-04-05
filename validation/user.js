const Joi = require('joi');

const registerValidation = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  userName: Joi.string().alphanum().min(3).max(30).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin')
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registerValidation,
  loginValidation
};

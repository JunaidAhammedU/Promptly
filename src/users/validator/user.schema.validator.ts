import * as Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    role: Joi.string().valid('user', 'admin'),
}).min(1);

export const getUserSchema = Joi.object({
    id: Joi.string().uuid().required(),
});

export const deleteUserSchema = Joi.object({
    id: Joi.string().uuid().required(),
});
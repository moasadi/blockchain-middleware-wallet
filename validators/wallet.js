const Joi = require("joi");

const retrieve = {
	body: {
    network:Joi.string().required(),
		token:Joi.string().optional(),
	},
	
};
const getMaster = {
	query: {
		network: Joi.string().required(),
	},
};

module.exports = {retrieve,getMaster};

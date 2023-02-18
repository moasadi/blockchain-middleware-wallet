const Joi = require("joi");

const smsVerification = {
	body: {},
	query: {
		phone:Joi.string().required()
	}
};
const login = {
	body: {
		username:Joi.string().required(),
		password:Joi.string().required()
	},
	query: {}
};

module.exports = {smsVerification,login};

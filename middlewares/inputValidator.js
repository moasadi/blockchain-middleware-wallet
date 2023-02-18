const Joi = require("joi");
const { mtc } = require("../services/message");
const pick  = require("../utils/pick");
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (error) {
    let errorMessage = "";
    for (const err of error.details) {
      errorMessage += " [ " + err.path.join(" > ") + err.message.slice(err.message.lastIndexOf('"') + 1) + " ] ";
    }
    return res.status(400).json(mtc(false, 'bad_request', { error: errorMessage }));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;

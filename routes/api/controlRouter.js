const createError = require("http-errors");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");
const Joi = require("joi");

const schemaPost = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
}).required();

const schemaPut = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).required();

const schemaPatch = Joi.object({
  favorite: Joi.boolean().required(),
});

async function get(req, res, next) {
  try {
    const data = await listContacts();
    res.json({ data: data, status: "success", code: 200 });
  } catch (err) {
    next(createError(err));
  }
}

async function getContact(req, res, next) {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.json({ data: contact, status: "success", code: 200 });
    } else res.json({ massage: "Not found", status: 404 });
  } catch (err) {
    next(createError(err));
  }
}

async function post(req, res, next) {
  try {
    const body = schemaPost.validate(req.body);
    if (body.error) {
      return res.json({
        massage: body.error.message,
        status: "failed",
        code: 400,
      });
    }
    const newContact = await addContact(body.value);
    res.json({ data: newContact, status: 200 });
  } catch (err) {
    next(createError(err));
  }
}

async function remove(req, res, next) {
  try {
    const deleteContact = await removeContact(req.params.contactId);
    if (deleteContact)
      res.json({ message: "contact deleted", status: "success", code: 200 });
    else res.json({ message: "Not found", status: "failed", code: 404 });
  } catch (err) {
    next(createError(err));
  }
}

async function put(req, res, next) {
  try {
    const validator = schemaPut.validate(req.body);
    if (Object.keys(req.body).length === 0) {
      return res.json({
        message: "missing fields",
        status: "failed",
        code: 400,
      });
    } else if (validator.error) {
      return res.json({
        message: validator.error.message,
        status: "failed",
        code: 400,
      });
    }
    const data = await updateContact(req.params.contactId, validator.value);
    if (data) res.json({ data: data, status: "success", code: 200 });
    else res.json({ message: "not found", status: "failed", code: 404 });
  } catch (err) {
    next(createError(err));
  }
}

async function patch(req, res, next) {
  try {
    const favorite = schemaPatch.validate(req.body);

    if (Object.keys(req.body).length === 0) {
      return res.json({
        message: "missing field favorite",
        status: "failed",
        code: 400,
      });
    } else if (favorite.error) {
      return res.json({
        message: favorite.error.message,
        status: "failed",
        code: 400,
      });
    }
    const data = await updateStatusContact(
      req.params.contactId,
      favorite.value
    );

    if (data) res.json({ data: data, status: "success", code: 200 });
    else res.json({ message: "not found", status: "failed", code: 404 });
  } catch (err) {
    next(createError(err));
  }
}

module.exports = { get, getContact, post, remove, put, patch };

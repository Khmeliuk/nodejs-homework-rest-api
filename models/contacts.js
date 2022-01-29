const contacts = require("../models/shema.js");

async function listContacts() {
  return await contacts.find();
}

async function getContactById(contactId) {
  return await contacts.findOne({ _id: contactId });
}

async function removeContact(contactId) {
  return await contacts.findByIdAndRemove({ _id: contactId });
}

async function addContact({ name, email, phone, favorite }) {
  return await contacts.create({ name, email, phone, favorite });
}

async function updateContact(id, patch) {
  return await contacts.findByIdAndUpdate({ _id: id }, patch, { new: true });
}

async function updateStatusContact(id, body) {
  return await contacts.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

const mongoose = require('mongoose');

const legacyApplicationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nameofApp: { type: String, required: true },
    url: { type: String, required: true }
});

module.exports = mongoose.model('LegacyApplication', legacyApplicationSchema);
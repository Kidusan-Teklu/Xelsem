const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true,
        set: function(filePath) {
            // Normalize file path for storage
            return filePath.replace(/\\/g, '/');
        }
    },
    uploadTime: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema); 
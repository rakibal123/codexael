const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
        },
        description: {
            type: String,
        },
        techStack: [
            {
                type: String,
            },
        ],
        image: {
            type: String, // URL or path
        },
        liveLink: {
            type: String,
        },
        githubLink: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', projectSchema);

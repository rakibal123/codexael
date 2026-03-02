import mongoose from 'mongoose';

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

const Project = mongoose.model('Project', projectSchema);
export default Project;

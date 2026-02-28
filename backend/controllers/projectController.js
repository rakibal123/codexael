const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    try {
        const { title, description, liveLink, githubLink, techStack } = req.body;

        const projectData = {
            title,
            description,
            liveLink,
            githubLink,
            // If techStack is sent via FormData it might be a string
            techStack: typeof techStack === 'string'
                ? techStack.split(',').map(s => s.trim())
                : techStack,
        };

        if (req.file) {
            projectData.image = req.file.path;
        } else if (req.body.image) {
            projectData.image = req.body.image;
        }

        const project = new Project(projectData);
        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const { title, description, liveLink, githubLink, techStack } = req.body;

        const updateData = {
            title,
            description,
            liveLink,
            githubLink,
            techStack: typeof techStack === 'string'
                ? techStack.split(',').map(s => s.trim())
                : techStack,
        };

        if (req.file) {
            updateData.image = req.file.path;
        } else if (req.body.image) {
            updateData.image = req.body.image;
        }

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (project) {
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};

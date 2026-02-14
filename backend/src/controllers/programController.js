const Program = require('../models/Program');

exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.findAll();
        res.json(programs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch programs' });
    }
};

exports.getProgramById = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        if (!program) return res.status(404).json({ error: 'Program not found' });
        res.json(program);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch program' });
    }
};

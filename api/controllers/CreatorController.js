const Creator = require('../models/Creator');

const CreatorController = () => {
    const create = async (req, res) => {
        const {body} = req;
        console.log(body);
    }

    return {
        create,
    };
};


module.exports = CreatorController;
const messageModal = require("../modal/messageModal");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await messageModal.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        })
        if(data) return res.json({msg: "message added successfully."});
        return res.json({ msg: "Failed to add message to the database"})
    } catch (ex) {
        next(ex);
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const {from, to} = req.body;
        const messages = await messageModal.find({
            users: {
                $all: [from, to],
            },
        })
        .sort({ updatedAt: 1})
        const projectMessages = messages.map((msg) => {
            return{
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        })
        res.json(projectMessages)
    } catch (ex) {
        next(ex);
    }
}

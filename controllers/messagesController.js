const Conversation = require("../models/conversation");
const Message = require("../models/message");



const createMessage = async (req, res) => {
    const { sender, receiver, message } = req.body;
    let convo_id = null;
    let convo_exist_id = null;

    await Conversation.find({
        "$or": [{
            participants: [sender, receiver]
        },
        {
            participants: [receiver, sender]
        }]
    })
        .then((convo) => {
            convo_exist_id = convo[0]._id;
        })
        .catch(err => console.log(err));


    if (convo_exist_id !== null) {

        await Conversation.findOneAndUpdate({ _id: convo_exist_id }, { lastMessage: message });
        convo_id = convo_exist_id;
    } else {
        try {
            await Conversation.create({
                participants: [sender, receiver],
                lastMessage: message
            })
                .then((convo) => {
                    convo_id = convo._id;
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (error) {
            console.log(error);
        }
    }


    try {
        await Message.create({
            sender: sender,
            receiver: receiver,
            message: message,
            conversation: convo_id
        })
            .then((message) => {
                res.json(message);
            })
            .catch((err) => {
                res.send(err);
            })
    } catch (error) {
        console.log(error);
    }


}


const fetchConversations = async (req, res) => {
    const receiver_id = req.params.id;
    await Conversation.find({ participants: { "$in": [receiver_id] } })
        .sort({ 'updatedAt': -1 })
        .populate("participants")
        .then((convos) => {
            res.json(convos);
        })
        .catch(err => {
            console.log(err);
        })

}


const fetchConvoMessages = async (req, res) => {
    const convo_id = req.params.id;

    await Message.find({ conversation: convo_id })
        .populate("receiver")
        .then((messages) => {
            res.json(messages);
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    createMessage,
    fetchConversations,
    fetchConvoMessages
}
// for conversation chat 
import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageModels.js";
import { getReceiverSocketId } from "../Socket/socket.js";
import { io } from "../Socket/socket.js"; // Make sure to import your io instance

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        console.log("Receiver ID is", receiverId);
        const { message } = req.body;

        // Find the conversation or create a new one
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });

        
        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId] });
        }

        // Create a new message
        const newMessage = await Message.create({ sender_id: senderId, receiver_id: receiverId, message });
        
        // Push the new message to the conversation's messages
        conversation.messages.push(newMessage._id);
        await conversation.save(); // Only save the conversation

        // Emit the new message to the receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({ newMessage, success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        // Check if any conversation was found
        if (!conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }

        // Return messages from the found conversation
        return res.status(200).json({ messages: conversation?.messages, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

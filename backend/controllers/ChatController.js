import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Child from "../models/Child.js";

/**
 * Get or create conversation for a child
 */
export const getConversation = async (req, res) => {
  try {
    const { childId } = req.params;

    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ msg: "Child not found" });

    const parentId = child.parentId;

    // For now, assign first counsellor (simple CA logic)
    const counsellorId = req.user.role === "counsellor"
      ? req.user._id
      : req.query.counsellorId;

    let convo = await Conversation.findOne({ childId });

    if (!convo) {
      convo = await Conversation.create({
        childId,
        parentId,
        counsellorId
      });
    }

    res.json({ conversation: convo });
  } catch (err) {
    console.error("getConversation:", err);
    res.status(500).json({ msg: "Failed to load conversation" });
  }
};

/**
 * Get messages
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ msg: "Failed to load messages" });
  }
};

/**
 * Send message
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ msg: "Message required" });

    const msg = await Message.create({
      conversationId,
      senderId: req.user._id,
      senderRole: req.user.role,
      text
    });

    res.status(201).json({ message: msg });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send message" });
  }
};

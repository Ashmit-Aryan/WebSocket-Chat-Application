import User from "../Model/User.js";
import Message from "../Model/Message.js";
import cloudinary from "../lib/cloudinary.js";
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const otherUserId = req.params.id;
    // Fetch messages where the logged-in user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: loggedInUserId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const sender = req.user._id;
    const receiver = req.params.id;

    let imageUrl;
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
        resource_type: "image",
      });
      imageUrl = uploadResult.secure_url;
    }

    const newMessage = new Message({
      sender,
      receiver,
      text,
      image: imageUrl,
    });

    // todo: Socket - IO Implementation
    
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: loggedInUserId }, { receiver: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId
            : msg.senderId,
        ),
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error fetching chat partners:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

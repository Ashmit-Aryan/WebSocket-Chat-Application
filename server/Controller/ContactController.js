import User from "../Model/User.js";

export const addContact = async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if(senderId.toString() === receiverId) {
        return res.status(400).json({ message: "You cannot add yourself as a contact." });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(404).json({ message: "User not found." });
    }

    
    const sender = await User.findById(senderId);

    if (sender.contacts.includes(senderId)) {
        return res.status(400).json({ message: "You are already contacts." });
    }

    if(sender.addContactReferences.sent.includes(receiverId)) {
        return res.status(400).json({ message: "Contact request already sent." });
    }

    sender.addContactReferences.sent.push(receiverId);
    receiver.addContactReferences.received.push(senderId);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Contact request sent." });

}

export const acceptContact = async (req, res) => {
    const receiverId = req.user._id;
    const senderId = req.params.id

    const me = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if(!me.addContactReferences.received.includes(senderId)) {
        return res.status(400).json({ message: "No Request Found" });
    }

    me.contacts.push(senderId);
    sender.contacts.push(receiverId);

    me.addContactReferences.received = me.addContactReferences.received.filter(id => id.toString() !== senderId);
    sender.addContactReferences.sent = sender.addContactReferences.sent.filter(id => id.toString() !== receiverId);

    await me.save();
    await sender.save();
    
    res.status(200).json({ message: "Contact request accepted." });
}

export const rejectContact = async (req, res) => {
    const receiverId = req.user._id;
    const senderId = req.params.id

    const me = await User.findById(receiverId); 
    const sender = await User.findById(senderId);

    me.addContactReferences.received = me.addContactReferences.received.filter(id => id.toString() !== senderId);
    sender.addContactReferences.sent = sender.addContactReferences.sent.filter(id => id.toString() !== receiverId);

    await me.save();
    await sender.save();

    res.status(200).json({ message: "Contact request rejected." });
}

export const getAllContacts = async (req, res) => {
  try {
   const user = await User.findById(req.user._id)
    .populate("contacts", "-password");
  res.json(user.contacts).status(200);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
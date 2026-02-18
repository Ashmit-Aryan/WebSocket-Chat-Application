import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim:true,
      maxlength:2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);


// Optimize frequent queries
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });

// Require at least one of text or image
messageSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    return next(new Error("Either text or image is required"));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
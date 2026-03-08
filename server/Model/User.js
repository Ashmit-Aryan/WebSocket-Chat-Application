import mongoose, { Schema } from "mongoose";

const User = mongoose.model(
  "User",
  new Schema(
    {
      fullName: {
        type: String,
        default: "",
        required: false,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },
      profilePicture: {
        type: String,
        default: "",
      },
      contacts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      addContactReferences: {
        sent: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        received: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    },
    { timestamps: true },
  ),
);

export default User;

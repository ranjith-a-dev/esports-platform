const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,
    },

    logo: {
      type: String,
      default: "",
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxMembers: {
      type: Number,
      default: 5,
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", teamSchema);
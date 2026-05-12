const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    game: {
      type: String,
      default: "Free Fire Max",
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    prizePool: {
      type: Number,
      required: true,
    },

    entryFee: {
      type: Number,
      required: true,
    },

    slots: {
      type: Number,
      default: 12,
    },

    numberOfMaps: {
      type: Number,
      required: true,
    },

    selectedMaps: [
      {
        type: String,
        enum: [
          "Bermuda",
          "Kalahari",
          "Purgatory",
          "Alpine",
          "Nexterra",
          "Solara",
        ],
      },
    ],

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    rules: [
      {
        type: String,
      },
    ],

    roomDetails: {
      roomId: {
        type: String,
        default: "",
      },

      roomPassword: {
        type: String,
        default: "",
      },
    },

    registeredTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],

    matchResults: [
      {
        matchNumber: Number,
        mapName: String,
        leaderboard: [
          {
            team: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Team",
            },

            kills: {
              type: Number,
              default: 0,
            },

            placementPoints: {
              type: Number,
              default: 0,
            },

            totalPoints: {
              type: Number,
              default: 0,
            },

            matchWins: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Tournament",
  tournamentSchema
);
const Team = require("../models/Team");
const User = require("../models/User");
const Tournament = require("../models/Tournament");

const createTeam = async (req, res) => {
  try {
    const { teamName } = req.body;

    const teamExists = await Team.findOne({
      teamName,
    });

    if (teamExists) {
      return res.status(400).json({
        message: "Team already exists",
      });
    }

    const existingCaptainTeam = await Team.findOne({
      captain: req.user._id,
    });

    if (existingCaptainTeam) {
      return res.status(400).json({
        message: "You already own a team",
      });
    }

    const team = await Team.create({
      teamName,
      captain: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("captain", "inGameName email")
      .populate("members", "inGameName");

    res.json(teams);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const invitePlayer = async (req, res) => {
  try {
    const { teamId, inGameName } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (
      team.captain.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only captain can invite players",
      });
    }

    const player = await User.findOne({
      inGameName,
    });

    if (!player) {
      return res.status(404).json({
        message: "Player not found",
      });
    }

    const alreadyInTeam = await Team.findOne({
      $or: [
        { captain: player._id },
        { members: player._id },
      ],
    });

    if (alreadyInTeam) {
      return res.status(400).json({
        message:
          "Player already belongs to a team",
      });
    }

    const existingInvite =
      player.teamInvites.find(
        (invite) =>
          invite.team.toString() === teamId &&
          invite.status === "pending"
      );

    if (existingInvite) {
      return res.status(400).json({
        message: "Invite already sent",
      });
    }

    player.teamInvites.push({
      team: team._id,
      invitedBy: req.user._id,
    });

    await player.save();

    res.json({
      message: "Invite sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      $or: [
        { captain: req.user._id },
        { members: req.user._id },
      ],
    })
      .populate("captain", "inGameName email")
      .populate("members", "inGameName email");

    res.json(team);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const acceptInvite = async (req, res) => {
  try {
    const { teamId } = req.body;

    const user = await User.findById(req.user._id);
    const team = await Team.findById(teamId);

    if (!user || !team) {
      return res.status(404).json({
        message: "User or Team not found",
      });
    }

    const existingTeam = await Team.findOne({
      $or: [
        { captain: user._id },
        { members: user._id },
      ],
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "You already belong to a team",
      });
    }

    const invite = user.teamInvites.find(
      (invite) =>
        invite.team.toString() === teamId &&
        invite.status === "pending"
    );

    if (!invite) {
      return res.status(404).json({
        message: "No pending invite found",
      });
    }

    invite.status = "accepted";

    team.members.push(user._id);

    await user.save();
    await team.save();

    res.json({
      message: "Joined team successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const rejectInvite = async (req, res) => {
  try {
    const { teamId } = req.body;

    const user = await User.findById(req.user._id);

    const invite = user.teamInvites.find(
      (invite) =>
        invite.team.toString() === teamId &&
        invite.status === "pending"
    );

    if (!invite) {
      return res.status(404).json({
        message: "No pending invite found",
      });
    }

    invite.status = "rejected";

    await user.save();

    res.json({
      message: "Invite rejected",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInvites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("teamInvites.team", "teamName")
      .populate(
        "teamInvites.invitedBy",
        "inGameName"
      );

    const pendingInvites = user.teamInvites.filter(
      (invite) => invite.status === "pending"
    );

    res.json(pendingInvites);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const searchPlayers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json([]);
    }

    const players = await User.find({
      inGameName: {
        $regex: query,
        $options: "i",
      },
      role: "user",
    }).select("inGameName email");

    res.json(players);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const team = await Team.findOne({
      captain: req.user._id,
    });

    if (!team) {
      return res.status(403).json({
        message: "Only captain can remove players",
      });
    }

    const memberId = req.params.memberId;

    team.members = team.members.filter(
      (m) => m.toString() !== memberId
    );

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate("captain", "inGameName")
      .populate("members", "inGameName");

    res.json({
      message: "Player removed successfully",
      team: updatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const disbandTeam = async (req, res) => {
  try {
    const userId = req.user._id;
 
    const team = await Team.findOne({ captain: userId }).populate("members", "_id");
 
    if (!team) {
      return res.status(404).json({ message: "Team not found or you are not the captain" });
    }
 
    // Guard: disband only if captain is the sole remaining member
    if (team.members.length > 1) {
      return res.status(400).json({
        message: "You cannot disband a team with other members. Transfer captaincy first, or remove all members.",
      });
    }
 
    const memberIds = team.members.map((m) => m._id);
 
    // Clear team reference from all members (adjust field name to match your User schema)
    await User.updateMany({ _id: { $in: memberIds } }, { $unset: { team: "" } });
 
    await Team.findByIdAndDelete(team._id);
 
    return res.status(200).json({ message: "Team disbanded successfully" });
  } catch (error) {
    console.error("disbandTeam error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const transferCaptain = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newCaptainId } = req.body;
 
    if (!newCaptainId) {
      return res.status(400).json({ message: "newCaptainId is required" });
    }
 
    // Prevent transferring to yourself
    if (newCaptainId.toString() === userId.toString()) {
      return res.status(400).json({ message: "You are already the captain" });
    }
 
    const team = await Team.findOne({ captain: userId })
      .populate("captain", "_id inGameName")
      .populate("members", "_id inGameName");
 
    if (!team) {
      return res.status(404).json({ message: "Team not found or you are not the captain" });
    }
 
    // Ensure new captain is actually a member of this team
    const isMember = team.members.some((m) => m._id.toString() === newCaptainId.toString());
    if (!isMember) {
      return res.status(400).json({ message: "Selected player is not a member of this team" });
    }
 
    // Transfer captaincy
    team.captain = newCaptainId;
    await team.save();
 
    // Re-populate for response
    const updatedTeam = await Team.findById(team._id)
      .populate("captain", "_id inGameName")
      .populate("members", "_id inGameName");
 
    return res.status(200).json({
      message: "Captaincy transferred successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("transferCaptain error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const leaveTeam = async (req, res) => {
  try {
    const userId = req.user._id; // set by JWT auth middleware
 
    const team = await Team.findOne({ members: userId }).populate("captain", "_id");
 
    if (!team) {
      return res.status(404).json({ message: "You are not in a team" });
    }
 
    // Prevent captain from using this route
    if (team.captain._id.toString() === userId.toString()) {
      return res.status(400).json({
        message:
          team.members.length === 1
            ? "You are the only member. Use disband instead."
            : "You are the captain. Transfer captaincy before leaving.",
      });
    }
 
    // Remove user from members array
    team.members = team.members.filter((m) => m.toString() !== userId.toString());
    await team.save();
 
    // Clear team reference on the user document (adjust field name to match your schema)
    await User.findByIdAndUpdate(userId, { $unset: { team: "" } });
 
    return res.status(200).json({ message: "You have left the team" });
  } catch (error) {
    console.error("leaveTeam error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTeam,
  getTeams,
  invitePlayer,
  getMyTeam,
  acceptInvite,
  rejectInvite,
  getInvites,
  searchPlayers,
  removeMember,
  disbandTeam,
  leaveTeam,
  transferCaptain,
};
const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/teamController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.post("/create", protect, createTeam);

router.get("/all", protect, getTeams);
router.get("/my-team", protect, getMyTeam);

router.post("/invite", protect, invitePlayer);
router.get("/invites", protect, getInvites);
router.post("/accept-invite", protect, acceptInvite);
router.post("/reject-invite", protect, rejectInvite);
router.get("/search-players", protect, searchPlayers);

router.delete("/remove-member/:memberId", protect, removeMember);
router.delete("/disband", protect, disbandTeam);

router.post("/leave", protect, leaveTeam);
router.post("/transfer-captain", protect, transferCaptain);
router.delete("/disband", protect, disbandTeam);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createTournament,
  getTournaments,
  registerTeam,
  getTournamentById,
  deleteTournament,
  updateTournament,
  updateMatchResults,
  getMyTournaments,
  withdrawTournament,
} = require("../controllers/tournamentController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  protect,
  adminOnly,
  createTournament
);

router.get(
  "/all",
  protect,
  getTournaments
);

router.get(
  "/my-tournaments",
  protect,
  getMyTournaments
);

router.post(
  "/register",
  protect,
  registerTeam
);

router.post(
  "/withdraw",
  protect,
  withdrawTournament
);

router.put(
  "/:id/match/:matchNumber",
  protect,
  adminOnly,
  updateMatchResults
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTournament
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateTournament
);

router.get(
  "/:id",
  protect,
  getTournamentById
);

module.exports = router;
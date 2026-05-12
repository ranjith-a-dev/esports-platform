const Tournament = require("../models/Tournament");
const Team = require("../models/Team");

const updateTournamentStatus = async (tournament) => {
  const now = new Date();

  if (now < tournament.startTime) {
    tournament.status = "upcoming";
  } else if (
    now >= tournament.startTime &&
    now <= tournament.endTime
  ) {
    tournament.status = "ongoing";
  } else if (now > tournament.endTime) {
    tournament.status = "completed";
  }

  await tournament.save();
};

const createTournament = async (req, res) => {
  try {
    const {
      name,
      game,
      prizePool,
      entryFee,
      slots,
      numberOfMaps,
      selectedMaps,
      startTime,
      endTime,
      roomId,
      roomPassword,
    } = req.body;

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    const matchResults = selectedMaps.map((map, index) => ({
      matchNumber: index + 1,
      mapName: map,
      leaderboard: [],
    }));

    const generatedMatches = selectedMaps.map(
  (mapName, index) => ({
    matchNumber: index + 1,
    mapName,
    leaderboard: [],
  })
);

const tournament = await Tournament.create({
  name,
  game,
  prizePool,
  entryFee,
  slots,
  numberOfMaps,
  selectedMaps,
  startTime,
  endTime,
  matchResults: generatedMatches,
});

    res.status(201).json(tournament);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate("registeredTeams", "teamName");

    for (const tournament of tournaments) {
      await updateTournamentStatus(tournament);
    }

    res.json(tournaments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const registerTeam = async (req, res) => {
  try {
    const { tournamentId } = req.body;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    await updateTournamentStatus(tournament);

    if (tournament.status !== "upcoming") {
      return res.status(400).json({
        message: "Registration closed",
      });
    }

    const team = await Team.findOne({
      captain: req.user._id,
    });

    if (!team) {
      return res.status(404).json({
        message: "Create a team first",
      });
    }

    const totalPlayers = 1 + (team.members?.length || 0);

    if (totalPlayers < 4) {
      return res.status(400).json({
        message: "Minimum 4 players required to register",
      });
    }

    const alreadyRegistered = tournament.registeredTeams.some(
      (teamId) => teamId.toString() === team._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "Team already registered",
      });
    }

    if (tournament.registeredTeams.length >= tournament.slots) {
      return res.status(400).json({
        message: "Tournament full",
      });
    }

    tournament.registeredTeams.push(team._id);

    await tournament.save();

    res.json({
      message: "Tournament registration successful",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate({
        path: "registeredTeams",
        populate: [
          {
            path: "captain",
            select: "inGameName",
          },
          {
            path: "members",
            select: "inGameName",
          },
        ],
      });

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    await updateTournamentStatus(tournament);

    const userTeam = await Team.findOne({
      $or: [
        { captain: req.user._id },
        { members: req.user._id }
      ]
    });

    const isRegistered = userTeam
      ? tournament.registeredTeams.some(
          (team) => team._id.toString() === userTeam._id.toString()
        )
      : false;

      let responseData = tournament.toObject();

      if (req.user.role !== "admin" && !isRegistered) {
        responseData.roomDetails = {
          roomId: "",
          roomPassword: "",
        };
      }

    res.json(responseData);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    await tournament.deleteOne();

    res.json({
      message: "Tournament deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    tournament.name = req.body.name || tournament.name;
    tournament.prizePool = req.body.prizePool || tournament.prizePool;
    tournament.entryFee = req.body.entryFee || tournament.entryFee;
    tournament.slots = req.body.slots || tournament.slots;
    tournament.startTime = req.body.startTime || tournament.startTime;
    tournament.endTime = req.body.endTime || tournament.endTime;

    if (
      req.body.numberOfMaps &&
      req.body.selectedMaps
    ) {
      tournament.numberOfMaps = req.body.numberOfMaps;
      tournament.selectedMaps = req.body.selectedMaps;

      const updatedMatchResults = req.body.selectedMaps.map(
        (mapName, index) => {
          const existingMatch =
            tournament.matchResults.find(
              (m) => m.matchNumber === index + 1
            );

          return {
            matchNumber: index + 1,
            mapName,
            leaderboard:
              existingMatch?.leaderboard || [],
          };
        }
      );

      tournament.matchResults = updatedMatchResults;
    }

    if (req.body.roomId !== undefined) {
      tournament.roomDetails.roomId = req.body.roomId;
    }

    if (req.body.roomPassword !== undefined) {
      tournament.roomDetails.roomPassword = req.body.roomPassword;
    }

    const updatedTournament = await tournament.save();

    res.json(updatedTournament);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMatchResults = async (req, res) => {
  try {
    const { id, matchNumber } = req.params;
    const { leaderboard } = req.body;

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    let match = tournament.matchResults.find(
      (m) => m.matchNumber === Number(matchNumber)
    );

    if (!match) {
      const mapName =
        tournament.selectedMaps[Number(matchNumber) - 1];

      tournament.matchResults.push({
        matchNumber: Number(matchNumber),
        mapName,
        leaderboard: [],
      });

      match =
        tournament.matchResults[
          tournament.matchResults.length - 1
        ];
    }

    match.leaderboard = leaderboard.map((entry) => ({
      team: entry.team,
      kills: Number(entry.kills) || 0,
      placementPoints: Number(entry.placementPoints) || 0,
      totalPoints:
        (Number(entry.kills) || 0) +
        (Number(entry.placementPoints) || 0),

      matchWins:
        Number(entry.placementPoints) === 12 ? 1 : 0,
    }));

    await tournament.save();

    res.json({
      message: "Match results updated successfully",
      tournament,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyTournaments = async (req, res) => {
  try {
    const Team = require("../models/Team");

    const myTeam = await Team.findOne({
      $or: [
        { captain: req.user._id },
        { members: req.user._id },
      ],
    });

    if (!myTeam) {
      return res.json([]);
    }

    const tournaments = await Tournament.find({
      registeredTeams: myTeam._id,
    })
      .populate("registeredTeams", "teamName")
      .sort({ createdAt: -1 });

    res.json(tournaments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const withdrawTournament = async (req, res) => {
  try {
    const { tournamentId } = req.body;

    const myTeam = await Team.findOne({
      $or: [
        { captain: req.user._id },
        { members: req.user._id },
      ],
    });

    if (!myTeam) {
      return res.status(404).json({
        message: "No team found",
      });
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    if (tournament.status !== "upcoming") {
      return res.status(400).json({
        message: "Cannot withdraw after tournament starts",
      });
    }

    tournament.registeredTeams =
      tournament.registeredTeams.filter(
        (teamId) => teamId.toString() !== myTeam._id.toString()
      );

    await tournament.save();

    res.json({
      message: "Withdrawn successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTournament,
  getTournaments,
  registerTeam,
  getTournamentById,
  deleteTournament,
  updateTournament,
  updateMatchResults,
  getMyTournaments,
  withdrawTournament,
};
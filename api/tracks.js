import express from "express";
import { getTracks, getTrackById, createTrack } from "#db/queries/tracks";

const router = express.Router();
export default router;

// GET /tracks → all tracks
router.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.status(200).send(tracks);
  } catch (err) {
    next(err);
  }
});

// GET /tracks/:id → get track by id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).send("Track id must be a number");

    const track = await getTrackById(id);
    if (!track) return res.status(404).send("Track not found");

    res.status(200).send(track);
  } catch (err) {
    next(err);
  }
});

// POST /tracks → create a new track
router.post("/", async (req, res, next) => {
  try {
    const { name, duration_ms } = req.body;
    if (!name || !duration_ms)
      return res.status(400).send("name and duration_ms are required");
    if (isNaN(duration_ms))
      return res.status(400).send("duration_ms must be a number");

    const track = await createTrack({ name, duration_ms });
    res.status(201).send(track);
  } catch (err) {
    next(err);
  }
});

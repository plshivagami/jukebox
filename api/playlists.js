import express from "express";
import {
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  getTracksForPlaylist,
  addTrackToPlaylist,
} from "#db/queries/playlists";
import { getTrackById } from "#db/queries/tracks";

const router = express.Router();
export default router;

// GET all playlists
router.get("/", async (req, res) => {
  const playlists = await getPlaylists();
  res.status(200).send(playlists);
});

// POST new playlist
router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body required");
  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("name and description required");

  const playlist = await createPlaylist({ name, description });
  res.status(201).send(playlist);
});

// GET playlist by id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).send("id must be a number");

  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found");

  res.status(200).send(playlist);
});

// GET all tracks in playlist
router.get("/:id/tracks", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).send("id must be a number");

  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found");

  const tracks = await getTracksForPlaylist(id);
  res.status(200).send(tracks);
});

// POST add track to playlist
router.post("/:id/tracks", async (req, res, next) => {
  const playlistId = Number(req.params.id);
  if (isNaN(playlistId))
    return res.status(400).send("playlist id must be number");
  if (!req.body) return res.status(400).send("Request body required");

  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("trackId required");
  if (isNaN(trackId)) return res.status(400).send("trackId must be number");

  const playlist = await getPlaylistById(playlistId);
  if (!playlist) return res.status(404).send("Playlist not found");

  const track = await getTrackById(trackId);
  if (!track) return res.status(400).send("Track not found");

  try {
    const playlistTrack = await addTrackToPlaylist(playlistId, trackId);
    res.status(201).send(playlistTrack);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).send("Track already in playlist");
    }
    next(err);
  }
});

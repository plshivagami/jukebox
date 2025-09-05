import express from "express";
import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";

const app = express();
export default app;

// Parse JSON bodies
app.use(express.json());

// Routers
app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

// Handle Postgres unique constraint (track already in playlist)
app.use((err, req, res, next) => {
  if (err.code === "23505") {
    return res.status(400).send("Duplicate entry");
  }
  next(err);
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

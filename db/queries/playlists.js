import db from "#db/client";

// Get all playlists
export async function getPlaylists() {
  const { rows } = await db.query(`SELECT * FROM playlists`);
  return rows;
}

// Get playlist by ID
export async function getPlaylistById(id) {
  const {
    rows: [playlist],
  } = await db.query(`SELECT * FROM playlists WHERE id = $1`, [id]);
  return playlist || null;
}

// Create a playlist
export async function createPlaylist({ name, description }) {
  const {
    rows: [playlist],
  } = await db.query(
    `INSERT INTO playlists (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );
  return playlist;
}

// Get all tracks in a playlist
export async function getTracksForPlaylist(playlistId) {
  const { rows } = await db.query(
    `SELECT t.*
     FROM tracks t
     JOIN playlists_tracks pt ON t.id = pt.track_id
     WHERE pt.playlist_id = $1`,
    [playlistId]
  );
  return rows;
}

// Add track to playlist
export async function addTrackToPlaylist(playlistId, trackId) {
  const {
    rows: [playlistTrack],
  } = await db.query(
    `INSERT INTO playlists_tracks (playlist_id, track_id)
     VALUES ($1, $2)
     RETURNING *`,
    [playlistId, trackId]
  );
  return playlistTrack;
}

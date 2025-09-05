import db from "#db/client";

// Add a track to a playlist
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

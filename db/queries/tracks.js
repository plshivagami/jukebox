import db from "#db/client";

// Get all tracks
export async function getTracks() {
  const { rows } = await db.query(`SELECT * FROM tracks`);
  return rows;
}

// Get track by ID
export async function getTrackById(id) {
  const {
    rows: [track],
  } = await db.query(`SELECT * FROM tracks WHERE id = $1`, [id]);
  return track || null;
}

// Create a track
export async function createTrack({ name, duration_ms }) {
  const {
    rows: [track],
  } = await db.query(
    `INSERT INTO tracks (name, duration_ms)
     VALUES ($1, $2)
     RETURNING *`,
    [name, duration_ms]
  );
  return track;
}

import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createTrack } from "./queries/tracks.js";
import { createPlaylist, addTrackToPlaylist } from "./queries/playlists.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  console.log("Seeding jukebox...");

  // Clear existing data
  await db.query("DELETE FROM playlists_tracks;");
  await db.query("DELETE FROM tracks;");
  await db.query("DELETE FROM playlists;");

  // Create 20 tracks
  const tracks = [];
  for (let i = 0; i < 20; i++) {
    const track = await createTrack({
      name: faker.music.songName(),
      duration_ms: faker.number.int({ min: 60000, max: 300000 }),
    });
    tracks.push(track);
  }

  // Create 10 playlists
  const playlists = [];
  for (let i = 0; i < 10; i++) {
    const playlist = await createPlaylist({
      name: faker.word.words({ count: { min: 1, max: 3 } }),
      description: faker.lorem.sentence(),
    });
    playlists.push(playlist);
  }

  // Add at least 15 playlist-track links
  for (let i = 0; i < 15; i++) {
    const playlist = playlists[Math.floor(Math.random() * playlists.length)];
    const track = tracks[Math.floor(Math.random() * tracks.length)];

    try {
      await addTrackToPlaylist(playlist.id, track.id);
    } catch (err) {
      if (err.code !== "23505") throw err; // ignore duplicates
    }
  }

  console.log(
    `Inserted ${tracks.length} tracks, ${playlists.length} playlists, 15+ playlist-track links.`
  );
}

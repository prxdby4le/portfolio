/**
 * One source for the outbound links. They were duplicated inline in About and
 * are now needed in the footer too, and a wrong handle in one place only is
 * worse than no link at all.
 */
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/alethiasongs/" },
  { label: "Twitter", href: "https://x.com/alethiasongs" },
  { label: "Discord", href: "https://discord.gg/prJAME5pwx" },
] as const;

export const SPOTIFY_PLAYLIST_ID = "4KvJJ8syMbCHDoGLTz1MAY";

export const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;

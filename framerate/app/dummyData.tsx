import { ReviewKind } from "@/types";

export const homepageData = {
  title: "FrameRate",
  subtitle: "",
  description: `
FrameRate helps you decide what’s worth your time.
We review movies, series, and games with a focus on what actually matters — quality, experience, and whether it’s worth watching or playing.

Explore top reviews, discover new titles, or share your own recommendations.
Because your time is limited, and good entertainment shouldn’t be a gamble.
  `,
};

export const cardData: {
  id: string;
  title: string;
  type: ReviewKind;
  rating: number;
  tags: string[];
  publishedAt: string;
  youtubeId?: string;
  trailerUrl?: string;
  content: string[];
}[] = [
  {
    id: "1",
    title: "Elden Ring",
    type: "game",
    youtubeId: "4UKk6VhP6l8",
    rating: 9.5,
    tags: ["RPG", "Open World", "Soulslike"],
    publishedAt: "2022-02-25",
    trailerUrl: "https://www.youtube.com/watch?v=E3Huy2cdih0",
    content: [
      "Elden Ring is a breathtaking journey through a vast, open-world landscape filled with danger, mystery, and discovery. From the moment you step into the Lands Between, the game establishes an overwhelming sense of scale and atmosphere. Rolling plains, crumbling ruins, and towering castles blend seamlessly into a world that feels ancient and alive.",

      "Combat is precise and unforgiving, demanding patience, experimentation, and mastery. Every enemy encounter matters, and boss fights are often terrifying yet immensely satisfying. The freedom to approach battles using different weapons, magic builds, or stealth tactics gives players a strong sense of ownership over their playstyle.",

      "Narrative storytelling is subtle and environmental. Instead of lengthy cutscenes, the lore is scattered across NPC interactions, item descriptions, and world design. This encourages curiosity and exploration, rewarding players who take the time to observe and connect the dots.",

      "With its haunting soundtrack, meticulous world design, and sense of discovery, Elden Ring doesn’t just challenge players — it immerses them. It is a landmark title that redefines open-world design and sets a new standard for modern action RPGs.",
    ],
  },

  {
    id: "2",
    title: "Severance",
    type: "series",
    youtubeId: "RV0G1kH9ZcI",
    rating: 8,
    tags: ["Thriller", "Drama", "Sci-Fi"],
    publishedAt: "2022-02-18",
    trailerUrl: "https://www.youtube.com/watch?v=RV0G1kH9ZcI",
    content: [
      "Severance presents a chillingly original concept: employees who undergo a procedure that separates their work memories from their personal lives. This simple idea becomes the foundation for a deeply unsettling exploration of identity, autonomy, and corporate control.",

      "The series excels in atmosphere. The sterile office spaces, endless white hallways, and rigid routines create a sense of claustrophobia that mirrors the characters’ psychological imprisonment. The visual design is minimalist yet deeply expressive.",

      "Performances are consistently strong, with each character revealing layers of vulnerability and conflict over time. The slow pacing works in the show’s favor, allowing tension to build organically while keeping viewers constantly uneasy.",

      "Severance is not just entertaining — it’s thought-provoking. It lingers long after each episode ends, prompting questions about work culture, consent, and what truly defines a person.",
    ],
  },

  {
    id: "3",
    title: "Constance",
    type: "game",
    youtubeId: "dQw4w9WgXcQ",
    rating: 9.5,
    tags: ["Indie", "Platformer", "Metroidvania"],
    publishedAt: "2023-08-12",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: [
      "Constance is a striking indie action-adventure that blends challenging platforming with deep exploration. The world feels handcrafted, filled with hidden paths, secret rooms, and environmental storytelling that rewards careful observation.",

      "Movement and combat are tight and responsive. Every jump, dash, and attack feels intentional, giving players confidence even in the most demanding sections. The difficulty is challenging but fair, encouraging mastery rather than frustration.",

      "What truly sets Constance apart is its atmosphere. The art direction and soundtrack work together to create a world that feels melancholic, mysterious, and alive. Each area has a distinct identity that stays memorable.",

      "While comparisons to genre staples are inevitable, Constance establishes its own voice through thoughtful design and emotional depth. It’s a standout title for fans of exploration-driven games.",
    ],
  },
];

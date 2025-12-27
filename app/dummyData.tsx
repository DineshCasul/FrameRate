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
  backgroundUrl?: string;
}[] = [
  {
    id: "1",
    title: "Elden Ring",
    type: "game",
    rating: 9.5,
    tags: ["RPG", "Open World", "Soulslike"],
    publishedAt: "2022-02-25",
    youtubeId: "4UKk6VhP6l8",
    trailerUrl: "https://www.youtube.com/watch?v=E3Huy2cdih0",
    backgroundUrl: "/images/eldenRing.webp",
    content: [
      "Elden Ring is a breathtaking journey through a vast, open-world landscape...",
      "Combat is precise and unforgiving...",
      "Narrative storytelling is subtle and environmental...",
      "With its haunting soundtrack, meticulous world design, Elden Ring immerses players in a landmark title...",
    ],
  },
  {
    id: "2",
    title: "Severance",
    type: "series",
    rating: 8,
    tags: ["Thriller", "Drama", "Sci-Fi"],
    publishedAt: "2022-02-18",
    youtubeId: "RV0G1kH9ZcI",
    trailerUrl: "https://www.youtube.com/watch?v=RV0G1kH9ZcI",
    backgroundUrl: "/images/severance.jpg",
    content: [
      "Severance presents a chillingly original concept...",
      "The series excels in atmosphere...",
      "Performances are consistently strong...",
      "Severance is thought-provoking and unforgettable...",
    ],
  },
  {
    id: "3",
    title: "Constance",
    type: "game",
    rating: 9.5,
    tags: ["Indie", "Platformer", "Metroidvania"],
    publishedAt: "2023-08-12",
    youtubeId: "dQw4w9WgXcQ",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    backgroundUrl: "/images/constance.jpg",
    content: [
      "Constance is a striking indie action-adventure...",
      "Movement and combat are tight and responsive...",
      "Atmosphere and design make this game unforgettable...",
      "Constance establishes its own voice through thoughtful design...",
    ],
  },
  {
    id: "4",
    title: "Horizon Forbidden West",
    type: "game",
    rating: 9,
    tags: ["RPG", "Open World"],
    publishedAt: "2022-02-15",
    backgroundUrl: "/images/horizon.jpg",
    content: [
      "A breathtaking open-world adventure filled with mechanical beasts and stunning landscapes.",
      "Combat requires strategy and mastery of various weapons.",
      "Storytelling combines emotional depth with exploration.",
    ],
  },
  {
    id: "5",
    title: "Stranger Things",
    type: "series",
    rating: 8.5,
    tags: ["Sci-Fi", "Horror", "Drama"],
    publishedAt: "2021-07-15",
    backgroundUrl: "/images/stranger-things.jpg",
    content: [
      "A nostalgic sci-fi series with heart, suspense, and memorable characters.",
      "The balance of supernatural horror and coming-of-age drama is excellent.",
      "Seasonal arcs keep viewers engaged and invested in the story.",
    ],
  },
  {
    id: "6",
    title: "God of War: Ragnarok",
    type: "game",
    rating: 9.7,
    tags: ["Action", "RPG", "Mythology"],
    publishedAt: "2022-11-09",
    backgroundUrl: "/images/gow-ragnarok.jpg",
    content: [
      "An epic Norse mythology journey with deep combat mechanics.",
      "Storytelling is emotionally resonant with compelling father-son dynamics.",
      "Visually stunning with cinematic set pieces.",
    ],
  },
  {
    id: "7",
    title: "The Witcher 3",
    type: "game",
    rating: 9.8,
    tags: ["RPG", "Open World", "Story-driven"],
    publishedAt: "2015-05-18",
    backgroundUrl: "/images/witcher3.jpg",
    content: [
      "A vast fantasy world rich with lore, characters, and morally complex choices.",
      "Gameplay is deeply immersive with monster hunting and exploration.",
      "The storylines are compelling and memorable.",
    ],
  },
  {
    id: "8",
    title: "The Last of Us Part II",
    type: "game",
    rating: 9.6,
    tags: ["Action", "Adventure", "Story-driven"],
    publishedAt: "2020-06-19",
    backgroundUrl: "/images/tlou2.jpg",
    content: [
      "A gripping emotional journey that pushes video game storytelling forward.",
      "Combat is tactical and survival-oriented.",
      "Characters are complex and emotionally layered.",
    ],
  },
  {
    id: "9",
    title: "Breaking Bad",
    type: "series",
    rating: 9.9,
    tags: ["Crime", "Drama", "Thriller"],
    publishedAt: "2008-01-20",
    backgroundUrl: "/images/breaking-bad.jpg",
    content: [
      "A masterclass in character transformation and narrative tension.",
      "Walt and Jesse’s journey is both thrilling and morally ambiguous.",
      "The show builds tension with meticulous pacing and storytelling.",
    ],
  },
  {
    id: "10",
    title: "Cyberpunk 2077",
    type: "game",
    rating: 8.2,
    tags: ["RPG", "Open World", "Sci-Fi"],
    publishedAt: "2020-12-10",
    backgroundUrl: "/images/cyberpunk2077.jpg",
    content: [
      "A futuristic open-world RPG with visually stunning cityscapes.",
      "Combat and story had a rocky launch but improved with patches.",
      "The game offers deep customization and exploration.",
    ],
  },
  {
    id: "11",
    title: "The Mandalorian",
    type: "series",
    rating: 8.7,
    tags: ["Sci-Fi", "Action", "Adventure"],
    publishedAt: "2019-11-12",
    backgroundUrl: "/images/mandalorian.jpg",
    content: [
      "A Star Wars series with cinematic production and compelling characters.",
      "Adventures are self-contained but build a larger universe.",
      "The visual effects and storylines are high quality.",
    ],
  },
  {
    id: "12",
    title: "Hades",
    type: "game",
    rating: 9.4,
    tags: ["Rogue-like", "Action", "Indie"],
    publishedAt: "2020-09-17",
    backgroundUrl: "/images/hades.jpg",
    content: [
      "A roguelike with tight combat mechanics and gorgeous art style.",
      "The story unfolds gradually with each run, deepening player attachment.",
      "Highly replayable with engaging systems.",
    ],
  },
  {
    id: "13",
    title: "Arcane",
    type: "series",
    rating: 9.2,
    tags: ["Animation", "Action", "Fantasy"],
    publishedAt: "2021-11-06",
    backgroundUrl: "/images/arcane.jpg",
    content: [
      "A visually stunning animated series set in the League of Legends universe.",
      "Engaging story with deep character arcs.",
      "Animations, music, and pacing make it stand out.",
    ],
  },
  {
    id: "14",
    title: "God of War (2018)",
    type: "game",
    rating: 9.5,
    tags: ["Action", "Adventure", "Mythology"],
    publishedAt: "2018-04-20",
    backgroundUrl: "/images/gow2018.jpg",
    content: [
      "Kratos returns in a Norse mythology adventure with deep father-son story.",
      "Combat is methodical, tactical, and satisfying.",
      "World-building and visuals are top-notch.",
    ],
  },
  {
    id: "15",
    title: "The Legend of Zelda: Breath of the Wild",
    type: "game",
    rating: 9.9,
    tags: ["RPG", "Open World", "Adventure"],
    publishedAt: "2017-03-03",
    backgroundUrl: "/images/zelda-botw.jpg",
    content: [
      "A vast open-world adventure with endless possibilities and exploration.",
      "Environmental puzzles, combat, and story are deeply integrated.",
      "The game redefined open-world design for modern gaming.",
    ],
  },
  {
    id: "16",
    title: "Stranger Things Season 4",
    type: "series",
    rating: 8.9,
    tags: ["Sci-Fi", "Horror", "Drama"],
    publishedAt: "2022-05-27",
    backgroundUrl: "/images/stranger-things-s4.jpg",
    content: [
      "The stakes are higher, and the story darker, expanding the Upside Down mythology.",
      "Character arcs deepen with thrilling tension and horror elements.",
      "Visuals and suspense make it a standout season.",
    ],
  },
  {
    id: "17",
    title: "Hollow Knight",
    type: "game",
    rating: 9.3,
    tags: ["Indie", "Platformer", "Metroidvania"],
    publishedAt: "2017-02-24",
    backgroundUrl: "/images/HollowKnight.png",
    content: [
      "A beautifully hand-drawn metroidvania with tight controls and challenging bosses.",
      "Exploration is rewarding with secrets and lore scattered across the world.",
      "Atmosphere and soundtrack enhance the immersive experience.",
    ],
  },
  {
    id: "18",
    title: "The Expanse",
    type: "series",
    rating: 8.8,
    tags: ["Sci-Fi", "Drama", "Political"],
    publishedAt: "2015-12-14",
    backgroundUrl: "/images/the-expanse.jpg",
    content: [
      "A space opera series with deep political intrigue and realistic science.",
      "Characters are multi-dimensional, and conflicts feel grounded.",
      "The show balances story, action, and world-building excellently.",
    ],
  },
  {
    id: "19",
    title: "Persona 5",
    type: "game",
    rating: 9.4,
    tags: ["JRPG", "Story-driven", "Stylish"],
    publishedAt: "2016-09-15",
    backgroundUrl: "/images/persona5.jpg",
    content: [
      "A stylish JRPG with memorable characters and life-sim mechanics.",
      "Combat is turn-based with deep strategy and persona fusion systems.",
      "The story, music, and visuals create a lasting impression.",
    ],
  },
  {
    id: "20",
    title: "Squid Game",
    type: "series",
    rating: 8.6,
    tags: ["Thriller", "Drama", "Survival"],
    publishedAt: "2021-09-17",
    backgroundUrl: "/images/squid-game.jpg",
    content: [
      "A high-stakes survival drama with social commentary woven in.",
      "Characters and tension are well-crafted, keeping viewers on edge.",
      "Visual design and pacing make it unforgettable.",
    ],
  },
];

import { ReviewKind } from "@/types";

export type Review = {
  id: string;
  slug: string;

  title: string;
  type: ReviewKind; // game | movie | series

  rating: number; // overall (0–10)

  aspectRatings?: {
    gameplay?: number;
    story?: number;
    visuals?: number;
    soundtrack?: number;
    acting?: number;
    direction?: number;
    levelDesign?: number;
    replayValue?: number;
  };

  tags: string[];

  publishedAt: string;

  youtubeId?: string;
  trailerUrl?: string;

  backgroundUrl?: string;
  coverUrl?: string;

  // Short intro / TLDR
  summary: string;

  // Main long-form review (markdown later)
  content: string[];

  pros: string[];
  cons: string[];

  verdict: string;

  playtime?: string; // "45 hours"
  platform?: string[]; // ["PC", "PS5"]

  recommendedFor?: string[]; // "Souls fans", "Hardcore players"

  status: "draft" | "published";
};

export const homepageData = {
  title: "FrameRate",
  subtitle: "FrameRate",
  description: `
I play it. I watch it. I rate it.
  `,
};

export const cardData: Review[] = [
  {
    id: "1",
    slug: "elden-ring",
    title: "Elden Ring",
    type: "game",
    rating: 9.5,
    tags: ["RPG", "Open World", "Soulslike"],
    publishedAt: "2022-02-25",
    youtubeId: "4UKk6VhP6l8",
    trailerUrl: "https://www.youtube.com/watch?v=E3Huy2cdih0",
    backgroundUrl: "/images/eldenRing.webp",
    coverUrl: "/images/eldenRing-cover.webp",
    summary:
      "A breathtaking open-world masterpiece that redefines the Soulslike genre with vast exploration, precise combat, and an immersive world.",
    content: [
      "Elden Ring is a breathtaking journey through a vast, open-world landscape...",
      "Combat is precise and unforgiving...",
      "Narrative storytelling is subtle and environmental...",
      "With its haunting soundtrack, meticulous world design, Elden Ring immerses players in a landmark title...",
    ],
    pros: [
      "Stunning open-world design with exploration rewards",
      "Engaging combat system with boss fights",
      "Beautiful soundtrack and visuals",
      "High replayability",
    ],
    cons: [
      "Steep learning curve for newcomers",
      "Performance issues at launch",
      "Story requires interpretation",
    ],
    verdict:
      "A genre-defining masterpiece that stands as one of the greatest games ever made.",
    playtime: "60 hours",
    platform: ["PC", "PlayStation 5", "Xbox Series X/S"],
    recommendedFor: [
      "Souls fans",
      "Open-world enthusiasts",
      "Challenge seekers",
    ],
    aspectRatings: {
      gameplay: 9.5,
      story: 8.5,
      visuals: 9.5,
      soundtrack: 9.5,
      levelDesign: 9.5,
      replayValue: 9.5,
    },
    status: "published",
  },
  {
    id: "2",
    slug: "severance",
    title: "Severance",
    type: "series",
    rating: 8,
    tags: ["Thriller", "Drama", "Sci-Fi"],
    publishedAt: "2022-02-18",
    youtubeId: "RV0G1kH9ZcI",
    trailerUrl: "https://www.youtube.com/watch?v=RV0G1kH9ZcI",
    backgroundUrl: "/images/severance.jpg",
    coverUrl: "/images/severance-cover.jpg",
    summary:
      "A chillingly original sci-fi thriller exploring themes of identity and corporate control through atmospheric storytelling and stellar performances.",
    content: [
      "Severance presents a chillingly original concept...",
      "The series excels in atmosphere...",
      "Performances are consistently strong...",
      "Severance is thought-provoking and unforgettable...",
    ],
    pros: [
      "Unique premise and world-building",
      "Exceptional performances by the cast",
      "Atmospheric cinematography",
      "Compelling character development",
    ],
    cons: [
      "Slow pacing can feel deliberate at times",
      "Ending leaves many questions unanswered",
      "Second season took years to arrive",
    ],
    verdict:
      "A thought-provoking thriller that captivates with originality and stellar execution.",
    platform: ["Apple TV+"],
    recommendedFor: ["Mystery lovers", "Sci-Fi fans", "Drama enthusiasts"],
    aspectRatings: {
      story: 8.5,
      acting: 8.5,
      direction: 8.5,
      visuals: 8,
    },
    status: "published",
  },
  {
    id: "3",
    slug: "constance",
    title: "Constance",
    type: "game",
    rating: 9.5,
    tags: ["Indie", "Platformer", "Metroidvania"],
    publishedAt: "2023-08-12",
    youtubeId: "dQw4w9WgXcQ",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    backgroundUrl: "/images/constance.jpg",
    coverUrl: "/images/constance-cover.jpg",
    summary:
      "A striking indie action-adventure with tight movement, responsive combat, and an atmospheric world that establishes its own voice.",
    content: [
      "Constance is a striking indie action-adventure...",
      "Movement and combat are tight and responsive...",
      "Atmosphere and design make this game unforgettable...",
      "Constance establishes its own voice through thoughtful design...",
    ],
    pros: [
      "Tight, responsive controls",
      "Excellent level design and pacing",
      "Strong visual and audio design",
      "Rewarding exploration",
    ],
    cons: [
      "Relatively short playtime",
      "Niche appeal for indie fans",
      "Can be challenging for some players",
    ],
    verdict:
      "An exceptional indie gem that proves smaller teams can create unforgettable experiences.",
    playtime: "8 hours",
    platform: ["PC", "Nintendo Switch"],
    recommendedFor: [
      "Indie enthusiasts",
      "Metroidvania fans",
      "Exploration lovers",
    ],
    aspectRatings: {
      gameplay: 9,
      visuals: 9,
      levelDesign: 9.5,
      replayValue: 8.5,
    },
    status: "published",
  },
  {
    id: "4",
    slug: "horizon-forbidden-west",
    title: "Horizon Forbidden West",
    type: "game",
    rating: 9,
    tags: ["RPG", "Open World"],
    publishedAt: "2022-02-15",
    backgroundUrl: "/images/horizon.jpg",
    coverUrl: "/images/horizon-cover.jpg",
    summary:
      "A breathtaking open-world adventure filled with mechanical beasts, stunning landscapes, and strategic combat.",
    content: [
      "A breathtaking open-world adventure filled with mechanical beasts and stunning landscapes.",
      "Combat requires strategy and mastery of various weapons.",
      "Storytelling combines emotional depth with exploration.",
    ],
    pros: [
      "Stunning visuals and open world",
      "Strategic combat with diverse weapon types",
      "Engaging story and characters",
      "Excellent exploration mechanics",
    ],
    cons: [
      "Performance optimization issues at launch",
      "Combat can feel repetitive",
      "Some dialogue feels forced",
    ],
    verdict:
      "An excellent open-world adventure that delivers on scope, beauty, and engaging gameplay.",
    playtime: "50 hours",
    platform: ["PlayStation 5", "PC"],
    recommendedFor: ["Open-world fans", "Action RPG lovers", "Action gamers"],
    aspectRatings: {
      gameplay: 8.5,
      story: 8.5,
      visuals: 9.5,
      levelDesign: 9,
      replayValue: 8,
    },
    status: "published",
  },
  {
    id: "5",
    slug: "stranger-things",
    title: "Stranger Things",
    type: "series",
    rating: 8.5,
    tags: ["Sci-Fi", "Horror", "Drama"],
    publishedAt: "2021-07-15",
    backgroundUrl: "/images/stranger-things.jpg",
    coverUrl: "/images/stranger-things-cover.jpg",
    summary:
      "A nostalgic sci-fi series with heart, suspense, and memorable characters balancing supernatural horror with coming-of-age drama.",
    content: [
      "A nostalgic sci-fi series with heart, suspense, and memorable characters.",
      "The balance of supernatural horror and coming-of-age drama is excellent.",
      "Seasonal arcs keep viewers engaged and invested in the story.",
    ],
    pros: [
      "Excellent ensemble cast",
      "Strong nostalgic 80s atmosphere",
      "Compelling character relationships",
      "Well-executed horror elements",
    ],
    cons: [
      "Pacing slows in some seasons",
      "Some plot threads feel underdeveloped",
      "Final season felt rushed for some",
    ],
    verdict:
      "A beloved series that captures nostalgia, wonder, and genuine scares with an unforgettable cast.",
    platform: ["Netflix"],
    recommendedFor: [
      "80s nostalgia fans",
      "Horror lovers",
      "Sci-Fi enthusiasts",
    ],
    aspectRatings: {
      story: 8.5,
      acting: 8.5,
      direction: 8,
      visuals: 8,
    },
    status: "published",
  },
  {
    id: "6",
    slug: "god-of-war-ragnarok",
    title: "God of War: Ragnarok",
    type: "game",
    rating: 9.7,
    tags: ["Action", "RPG", "Mythology"],
    publishedAt: "2022-11-09",
    backgroundUrl: "/images/gow-ragnarok.jpg",
    coverUrl: "/images/gow-ragnarok-cover.jpg",
    summary:
      "An epic Norse mythology journey with deep combat mechanics, emotionally resonant storytelling, and visually stunning cinematic moments.",
    content: [
      "An epic Norse mythology journey with deep combat mechanics.",
      "Storytelling is emotionally resonant with compelling father-son dynamics.",
      "Visually stunning with cinematic set pieces.",
    ],
    pros: [
      "Engaging combat mechanics",
      "Powerful father-son narrative",
      "Stunning visuals and cinematics",
      "Epic scope and boss battles",
    ],
    cons: [
      "Can feel narratively predictable",
      "Performance compromises at launch",
      "Open world segments less polished",
    ],
    verdict:
      "A masterful action game that tells an emotionally powerful story with world-class combat and presentation.",
    playtime: "55 hours",
    platform: ["PlayStation 5"],
    recommendedFor: [
      "Action gamers",
      "Narrative enthusiasts",
      "Mythology fans",
    ],
    aspectRatings: {
      gameplay: 9.5,
      story: 9.5,
      visuals: 9.5,
      soundtrack: 9.5,
      levelDesign: 9,
    },
    status: "published",
  },
  {
    id: "7",
    slug: "the-witcher-3",
    title: "The Witcher 3",
    type: "game",
    rating: 9.8,
    tags: ["RPG", "Open World", "Story-driven"],
    publishedAt: "2015-05-18",
    backgroundUrl: "/images/witcher3.jpg",
    coverUrl: "/images/witcher3-cover.jpg",
    summary:
      "A vast fantasy world rich with lore, characters, and morally complex choices combined with immersive monster hunting and exploration.",
    content: [
      "A vast fantasy world rich with lore, characters, and morally complex choices.",
      "Gameplay is deeply immersive with monster hunting and exploration.",
      "The storylines are compelling and memorable.",
    ],
    pros: [
      "Incredible world-building and lore",
      "Morally complex choices matter",
      "Engaging monster hunting quests",
      "Exceptional DLC content",
    ],
    cons: [
      "Combat can feel clunky",
      "Character movement sometimes awkward",
      "Performance issues on some systems",
    ],
    verdict:
      "An RPG masterpiece that sets the standard for open-world storytelling and character development.",
    playtime: "100+ hours",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    recommendedFor: ["RPG enthusiasts", "Fantasy fans", "Story lovers"],
    aspectRatings: {
      gameplay: 8.5,
      story: 9.5,
      visuals: 9,
      levelDesign: 9,
      replayValue: 9,
    },
    status: "published",
  },
  {
    id: "8",
    slug: "the-last-of-us-part-2",
    title: "The Last of Us Part II",
    type: "game",
    rating: 9.6,
    tags: ["Action", "Adventure", "Story-driven"],
    publishedAt: "2020-06-19",
    backgroundUrl: "/images/tlou2.jpg",
    coverUrl: "/images/tlou2-cover.jpg",
    summary:
      "A gripping emotional journey that pushes video game storytelling forward with tactical combat and complex, layered characters.",
    content: [
      "A gripping emotional journey that pushes video game storytelling forward.",
      "Combat is tactical and survival-oriented.",
      "Characters are complex and emotionally layered.",
    ],
    pros: [
      "Powerful emotional narrative",
      "Tactical combat system",
      "Outstanding character development",
      "Stunning visuals and world design",
    ],
    cons: [
      "Controversial narrative choices",
      "Pacing issues in later sections",
      "Demanding game with dark themes",
    ],
    verdict:
      "A bold, emotionally devastating game that challenges player expectations and expands what gaming narratives can achieve.",
    playtime: "30 hours",
    platform: ["PlayStation 4", "PlayStation 5"],
    recommendedFor: [
      "Story enthusiasts",
      "Action gamers",
      "Narrative risk-takers",
    ],
    aspectRatings: {
      gameplay: 8.5,
      story: 9.5,
      visuals: 9.5,
      levelDesign: 9,
    },
    status: "published",
  },
  {
    id: "9",
    slug: "breaking-bad",
    title: "Breaking Bad",
    type: "series",
    rating: 9.9,
    tags: ["Crime", "Drama", "Thriller"],
    publishedAt: "2008-01-20",
    backgroundUrl: "/images/breaking-bad.jpg",
    coverUrl: "/images/breaking-bad-cover.jpg",
    summary:
      "A masterclass in character transformation and narrative tension where Walt and Jesse's journey is both thrilling and morally ambiguous.",
    content: [
      "A masterclass in character transformation and narrative tension.",
      "Walt and Jesse's journey is both thrilling and morally ambiguous.",
      "The show builds tension with meticulous pacing and storytelling.",
    ],
    pros: [
      "Exceptional character development",
      "Perfectly paced storytelling",
      "Outstanding performances",
      "Iconic writing and dialogue",
    ],
    cons: [
      "Slow first season can deter new viewers",
      "Some side characters feel underdeveloped",
      "Emotionally demanding to watch",
    ],
    verdict:
      "The gold standard of television, a show that redefined what TV drama could be.",
    platform: ["Netflix"],
    recommendedFor: ["Drama enthusiasts", "Crime fans", "Prestige TV lovers"],
    aspectRatings: {
      story: 9.9,
      acting: 9.9,
      direction: 9.9,
    },
    status: "published",
  },
  {
    id: "10",
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    type: "game",
    rating: 8.2,
    tags: ["RPG", "Open World", "Sci-Fi"],
    publishedAt: "2020-12-10",
    backgroundUrl: "/images/cyberpunk2077.jpg",
    coverUrl: "/images/cyberpunk2077-cover.jpg",
    summary:
      "A futuristic open-world RPG with visually stunning cityscapes, deep customization, and exploration that improved significantly through updates.",
    content: [
      "A futuristic open-world RPG with visually stunning cityscapes.",
      "Combat and story had a rocky launch but improved with patches.",
      "The game offers deep customization and exploration.",
    ],
    pros: [
      "Incredible world design and atmosphere",
      "Deep character customization",
      "Strong narrative quests",
      "Excellent soundtrack",
    ],
    cons: [
      "Notorious launch bugs and performance issues",
      "Some unfinished elements",
      "AI and NPC behavior limitations",
    ],
    verdict:
      "A visually stunning open-world that recovered from a rocky launch to become a solid RPG experience.",
    playtime: "40 hours",
    platform: ["PC", "PlayStation 5", "Xbox Series X/S"],
    recommendedFor: ["Cyberpunk fans", "Sci-Fi lovers", "RPG enthusiasts"],
    aspectRatings: {
      gameplay: 7.5,
      story: 8.5,
      visuals: 9,
      levelDesign: 7.5,
      replayValue: 7,
    },
    status: "published",
  },
  {
    id: "11",
    slug: "the-mandalorian",
    title: "The Mandalorian",
    type: "series",
    rating: 8.7,
    tags: ["Sci-Fi", "Action", "Adventure"],
    publishedAt: "2019-11-12",
    backgroundUrl: "/images/mandalorian.jpg",
    coverUrl: "/images/mandalorian-cover.jpg",
    summary:
      "A Star Wars series with cinematic production, compelling characters, and self-contained adventures that build a larger universe.",
    content: [
      "A Star Wars series with cinematic production and compelling characters.",
      "Adventures are self-contained but build a larger universe.",
      "The visual effects and storylines are high quality.",
    ],
    pros: [
      "Cinematic production quality",
      "Compelling protagonist and Grogu",
      "High-quality visual effects",
      "Expands Star Wars universe effectively",
    ],
    cons: [
      "Some episodes feel filler-like",
      "Slower pacing in season 2",
      "Movie crossover feels disruptive",
    ],
    verdict:
      "A visually stunning Star Wars adventure that brings the franchise back to its adventure roots.",
    platform: ["Disney+"],
    recommendedFor: ["Star Wars fans", "Action lovers", "Sci-Fi enthusiasts"],
    aspectRatings: {
      story: 8,
      acting: 8.5,
      direction: 8.5,
      visuals: 9,
    },
    status: "published",
  },
  {
    id: "12",
    slug: "hades",
    title: "Hades",
    type: "game",
    rating: 9.4,
    tags: ["Rogue-like", "Action", "Indie"],
    publishedAt: "2020-09-17",
    backgroundUrl: "/images/hades.jpg",
    coverUrl: "/images/hades-cover.jpg",
    summary:
      "A roguelike with tight combat mechanics and gorgeous art style where the story unfolds gradually, deepening player attachment with each run.",
    content: [
      "A roguelike with tight combat mechanics and gorgeous art style.",
      "The story unfolds gradually with each run, deepening player attachment.",
      "Highly replayable with engaging systems.",
    ],
    pros: [
      "Excellent roguelike mechanics",
      "Stunning hand-drawn visuals",
      "Engaging narrative progression",
      "Addictive gameplay loop",
    ],
    cons: [
      "Difficulty progression can spike",
      "Some boss patterns feel repetitive",
      "May feel grindy to completionists",
    ],
    verdict:
      "A indie masterpiece that proves roguelikes can have compelling narratives and beautiful presentation.",
    playtime: "30 hours",
    platform: ["PC", "Nintendo Switch", "PlayStation 4", "Xbox One"],
    recommendedFor: ["Roguelike fans", "Action gamers", "Indie lovers"],
    aspectRatings: {
      gameplay: 9.5,
      story: 9,
      visuals: 9.5,
      soundtrack: 9.5,
      replayValue: 9.5,
    },
    status: "published",
  },
  {
    id: "13",
    slug: "arcane",
    title: "Arcane",
    type: "series",
    rating: 9.2,
    tags: ["Animation", "Action", "Fantasy"],
    publishedAt: "2021-11-06",
    backgroundUrl: "/images/arcane.jpg",
    coverUrl: "/images/arcane-cover.jpg",
    summary:
      "A visually stunning animated series with engaging storylines, deep character arcs, and exceptional animation, music, and pacing.",
    content: [
      "A visually stunning animated series set in the League of Legends universe.",
      "Engaging story with deep character arcs.",
      "Animations, music, and pacing make it stand out.",
    ],
    pros: [
      "Groundbreaking animation style",
      "Compelling character development",
      "Excellent soundtrack",
      "Accessible to non-gamers",
    ],
    cons: [
      "Limited by League of Legends lore",
      "Second season release delay",
      "Some pacing issues in middle acts",
    ],
    verdict:
      "A breathtaking animated series that transcends its gaming origins to become prestige television.",
    platform: ["Netflix"],
    recommendedFor: [
      "Animation enthusiasts",
      "Action fans",
      "Gamers and non-gamers alike",
    ],
    aspectRatings: {
      story: 9,
      acting: 9,
      direction: 9.5,
      visuals: 9.5,
    },
    status: "published",
  },
  {
    id: "14",
    slug: "god-of-war-2018",
    title: "God of War (2018)",
    type: "game",
    rating: 9.5,
    tags: ["Action", "Adventure", "Mythology"],
    publishedAt: "2018-04-20",
    backgroundUrl: "/images/gow2018.jpg",
    coverUrl: "/images/gow2018-cover.jpg",
    summary:
      "Kratos returns in a Norse mythology adventure with a deep father-son story, methodical combat, and top-notch world-building.",
    content: [
      "Kratos returns in a Norse mythology adventure with deep father-son story.",
      "Combat is methodical, tactical, and satisfying.",
      "World-building and visuals are top-notch.",
    ],
    pros: [
      "Powerful father-son narrative",
      "Innovative camera and gameplay",
      "Beautiful Norse world design",
      "Satisfying melee combat",
    ],
    cons: [
      "Combat can feel slow for some",
      "Camera occasionally problematic",
      "Some boss fights feel similar",
    ],
    verdict:
      "A reinvention of a legendary franchise that honors the past while crafting something fresh and emotionally powerful.",
    playtime: "35 hours",
    platform: ["PlayStation 4", "PC"],
    recommendedFor: ["Action gamers", "Story enthusiasts", "Mythology fans"],
    aspectRatings: {
      gameplay: 9,
      story: 9.5,
      visuals: 9.5,
      levelDesign: 9,
    },
    status: "published",
  },
  {
    id: "15",
    slug: "zelda-breath-of-the-wild",
    title: "The Legend of Zelda: Breath of the Wild",
    type: "game",
    rating: 9.9,
    tags: ["RPG", "Open World", "Adventure"],
    publishedAt: "2017-03-03",
    backgroundUrl: "/images/zelda-botw.jpg",
    coverUrl: "/images/zelda-botw-cover.jpg",
    summary:
      "A vast open-world adventure with endless possibilities, environmental puzzles integrated with combat and story that redefined open-world design.",
    content: [
      "A vast open-world adventure with endless possibilities and exploration.",
      "Environmental puzzles, combat, and story are deeply integrated.",
      "The game redefined open-world design for modern gaming.",
    ],
    pros: [
      "Revolutionary open-world freedom",
      "Creative environmental puzzle solving",
      "Excellent exploration rewards",
      "Timeless gameplay design",
    ],
    cons: [
      "Story feels secondary",
      "Performance compromises on Switch",
      "Some weapon durability mechanics divisive",
    ],
    verdict:
      "A landmark game that fundamentally changed how developers approach open-world design and player freedom.",
    playtime: "60+ hours",
    platform: ["Nintendo Switch"],
    recommendedFor: [
      "Open-world fans",
      "Adventure seekers",
      "Puzzle enthusiasts",
    ],
    aspectRatings: {
      gameplay: 9.9,
      visuals: 9,
      levelDesign: 9.9,
      replayValue: 9.5,
    },
    status: "published",
  },
  {
    id: "16",
    slug: "stranger-things-season-4",
    title: "Stranger Things Season 4",
    type: "series",
    rating: 8.9,
    tags: ["Sci-Fi", "Horror", "Drama"],
    publishedAt: "2022-05-27",
    backgroundUrl: "/images/stranger-things-s4.jpg",
    coverUrl: "/images/stranger-things-s4-cover.jpg",
    summary:
      "The stakes and darkness escalate as the Upside Down mythology expands with thrilling tension and compelling character arcs.",
    content: [
      "The stakes are higher, and the story darker, expanding the Upside Down mythology.",
      "Character arcs deepen with thrilling tension and horror elements.",
      "Visuals and suspense make it a standout season.",
    ],
    pros: [
      "Darker, more mature tone",
      "Expanded world-building",
      "Strong character developments",
      "High-stakes tension throughout",
    ],
    cons: [
      "Pacing can drag in parts",
      "Some storylines feel stretched",
      "Release schedule was frustrating",
    ],
    verdict:
      "A darker, more ambitious season that deepens the mythology and raises the stakes to thrilling levels.",
    platform: ["Netflix"],
    recommendedFor: ["Series fans", "Horror enthusiasts", "Mystery lovers"],
    aspectRatings: {
      story: 8.5,
      acting: 9,
      direction: 9,
      visuals: 9,
    },
    status: "published",
  },
  {
    id: "17",
    slug: "hollow-knight",
    title: "Hollow Knight",
    type: "game",
    rating: 9.3,
    tags: ["Indie", "Platformer", "Metroidvania"],
    publishedAt: "2017-02-24",
    backgroundUrl: "/images/HollowKnight.png",
    coverUrl: "/images/HollowKnight-cover.png",
    summary:
      "A beautifully hand-drawn metroidvania with tight controls, challenging bosses, and rewarding exploration in an immersive atmosphere.",
    content: [
      "A beautifully hand-drawn metroidvania with tight controls and challenging bosses.",
      "Exploration is rewarding with secrets and lore scattered across the world.",
      "Atmosphere and soundtrack enhance the immersive experience.",
    ],
    pros: [
      "Excellent hand-drawn art style",
      "Tight, responsive controls",
      "Challenging, memorable boss fights",
      "Dense world full of secrets",
    ],
    cons: [
      "Can be frustratingly difficult",
      "Limited checkpoints",
      "Sequel took a long time",
    ],
    verdict:
      "A masterfully crafted indie gem that stands shoulder-to-shoulder with major studio releases.",
    playtime: "25 hours",
    platform: ["PC", "Nintendo Switch", "PlayStation 4", "Xbox One"],
    recommendedFor: ["Metroidvania fans", "Challenge seekers", "Indie lovers"],
    aspectRatings: {
      gameplay: 9.5,
      visuals: 9.5,
      levelDesign: 9,
      replayValue: 9,
    },
    status: "published",
  },
  {
    id: "18",
    slug: "the-expanse",
    title: "The Expanse",
    type: "series",
    rating: 8.8,
    tags: ["Sci-Fi", "Drama", "Political"],
    publishedAt: "2015-12-14",
    backgroundUrl: "/images/the-expanse.jpg",
    coverUrl: "/images/the-expanse-cover.jpg",
    summary:
      "A space opera with deep political intrigue and realistic science featuring multi-dimensional characters and grounded conflicts.",
    content: [
      "A space opera series with deep political intrigue and realistic science.",
      "Characters are multi-dimensional, and conflicts feel grounded.",
      "The show balances story, action, and world-building excellently.",
    ],
    pros: [
      "Intelligent, grounded sci-fi",
      "Complex political storytelling",
      "Excellent cast chemistry",
      "Strong world-building",
    ],
    cons: [
      "Can feel slow for action fans",
      "Budget limitations visible at times",
      "Streaming changes affected continuity",
    ],
    verdict:
      "A thoughtful, ambitious space opera that delivers intelligent storytelling and rich character dynamics.",
    platform: ["Amazon Prime Video"],
    recommendedFor: [
      "Sci-Fi enthusiasts",
      "Political drama fans",
      "Hard sci-fi lovers",
    ],
    aspectRatings: {
      story: 8.5,
      acting: 8.5,
      direction: 8.5,
      visuals: 8,
    },
    status: "published",
  },
  {
    id: "19",
    slug: "persona-5",
    title: "Persona 5",
    type: "game",
    rating: 9.4,
    tags: ["JRPG", "Story-driven", "Stylish"],
    publishedAt: "2016-09-15",
    backgroundUrl: "/images/persona5.jpg",
    coverUrl: "/images/persona5-cover.jpg",
    summary:
      "A stylish JRPG with memorable characters, life-sim mechanics, turn-based combat with deep strategy, and an unforgettable story.",
    content: [
      "A stylish JRPG with memorable characters and life-sim mechanics.",
      "Combat is turn-based with deep strategy and persona fusion systems.",
      "The story, music, and visuals create a lasting impression.",
    ],
    pros: [
      "Exceptional visual and audio style",
      "Engaging life-sim mechanics",
      "Strategic turn-based combat",
      "Memorable cast of characters",
    ],
    cons: [
      "Extremely long (100+ hours)",
      "Some gameplay repetition",
      "Social links can feel mandatory",
    ],
    verdict:
      "A stylish masterpiece that stands as one of the best JRPGs ever made.",
    playtime: "100+ hours",
    platform: ["PlayStation 4", "PC"],
    recommendedFor: ["JRPG fans", "Story enthusiasts", "Stylish game lovers"],
    aspectRatings: {
      gameplay: 9,
      story: 9.5,
      visuals: 9.5,
      soundtrack: 9.5,
      replayValue: 8.5,
    },
    status: "published",
  },
  {
    id: "20",
    slug: "squid-game",
    title: "Squid Game",
    type: "series",
    rating: 8.6,
    tags: ["Thriller", "Drama", "Survival"],
    publishedAt: "2021-09-17",
    backgroundUrl: "/images/squid-game.jpg",
    coverUrl: "/images/squid-game-cover.jpg",
    summary:
      "A high-stakes survival drama with social commentary featuring well-crafted characters and tension that keeps viewers on edge.",
    content: [
      "A high-stakes survival drama with social commentary woven in.",
      "Characters and tension are well-crafted, keeping viewers on edge.",
      "Visual design and pacing make it unforgettable.",
    ],
    pros: [
      "Compelling survival premise",
      "Strong social commentary",
      "Excellent character development",
      "Stunning visual design",
    ],
    cons: [
      "Intense violence may not be for everyone",
      "Criticisms of cultural representation",
      "Second season felt less impactful",
    ],
    verdict:
      "A gripping phenomenon that combined spectacle with social commentary for a genuinely engaging thriller.",
    platform: ["Netflix"],
    recommendedFor: [
      "Thriller fans",
      "Survival drama lovers",
      "Social commentary seekers",
    ],
    aspectRatings: {
      story: 8.5,
      acting: 8.5,
      direction: 8.5,
      visuals: 9,
    },
    status: "published",
  },
];

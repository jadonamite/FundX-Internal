export interface Campaign {
  id: string;
  title: string;
    tagline: string;
  description: string;
  category: string;
    projectStage: string;
  location: string;
  raised: number;
  goal: number;
    currency: "USDCx" | "STX";
  image: string;
  creator: string;
  creatorImage: string;
  creatorBio: string;
  twitter: string;
  github: string;
  portfolio: string;
  videoUrl: string;
  budgetBreakdown: string;
  roadmap: string;
  daysLeft: number;
  backers: number;
  isTrending?: boolean;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: "stacks-school",
    title: "Stacks School",
    tagline: "Teaching Clarity smart contracts to 10,000 developers worldwide.",
    description: "We are building the next generation of Bitcoin builders. Currently, the learning curve for Clarity is too steep. We are creating interactive, gamified tutorials that let developers write and deploy contracts in their browser.",
    category: "Education",
    projectStage: "MVP",
    location: "Global",
    raised: 12000,
    goal: 100000,
    currency: "USDCx",
    image: "/campaign-2.jpg",
    creator: "DeFi Academy",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Ex-educators and early Stacks adopters. We previously built a Web3 learning platform with 50k+ active users.",
    twitter: "@StacksSchool",
    github: "github.com/stacksschool",
    portfolio: "stacksschool.com",
    videoUrl: "https://youtube.com/watch?v=demo",
    budgetBreakdown: "50% Content Creation, 30% Platform Engineering, 20% Marketing",
    roadmap: "Month 1: Launch Beta. Month 3: 50+ Lessons. Month 6: Mainnet Certification Program.",
    daysLeft: 45,
    backers: 340,
    isTrending: false
  },
 {
    id: "defi-for-everyone",
    title: "DeFi for Everyone",
    tagline: "The first mobile-first yield aggregator on Stacks.",
    description: "Democratizing finance for the 99% with simple UX and trustless strategies. We abstract away the complex bridging and routing, letting users earn native Bitcoin yield with one tap.",
    category: "DeFi",
    projectStage: "Prototype",
    location: "Lagos, Nigeria",
    raised: 45000,
    goal: 50000,
    currency: "STX",
    image: "/campaign-1.jpg",
    creator: "Alex Smith",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Senior protocol engineer. 5 years building DeFi legos across Ethereum and Stacks.",
    twitter: "@AlexBuilds",
    github: "github.com/alexsmith",
    portfolio: "alexsmith.dev",
    videoUrl: "",
    budgetBreakdown: "70% Smart Contract Audits, 30% Frontend Development",
    roadmap: "Q1: Testnet Launch. Q2: Security Audit. Q3: Mainnet TGE.",
    daysLeft: 14,
    backers: 1240,
    isTrending: true 
  },
  {
    id: "green-mining",
    title: "Green Mining",
    tagline: "Solar-powered Bitcoin mining initiative.",
    description: "Carbon neutral production ensuring the future of sustainable POW. We are setting up a 5MW solar farm strictly dedicated to mining Bitcoin and securing the Stacks network.",
    category: "Mining",
    projectStage: "Idea",
    location: "Austin, TX",
    raised: 5000,
    goal: 25000,
    currency: "USDCx",
    image: "/campaign-3.jpg",
    creator: "EcoBit",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Renewable energy experts turning stranded solar power into hash rate.",
    twitter: "@EcoBit",
    github: "",
    portfolio: "ecobit.io",
    videoUrl: "https://vimeo.com/demo",
    budgetBreakdown: "80% Hardware Procurement, 20% Land Lease",
    roadmap: "Month 1: Secure Land. Month 2: Install Solar Array. Month 3: Deploy ASICs.",
    daysLeft: 21,
    backers: 85,
    isTrending: false
  }
  ,
  {
    id: "bitcoin-city",
    title: "Bitcoin City Initiative",
    tagline: 'Infrastructure for the Bitcoin Economy."
    description:  "Developing urban infrastructure powered by Bitcoin mining heat recycling. A model for sustainable cities.",
    category: "Social Impact",
    projectStage: "Idea",
    location: "El Salvador",
    raised: 12500,
    goal: 500000,
    currency: "USDCx",
    image: "/campaign-4.jpg", 
    creator: "CityDAO",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Renewable energy experts turning stranded solar power into hash rate.",
    twitter: "@CityDAO",
    github: "github.com/citydao",
    portfolio: "citydao.com",
    videoUrl: "https://vimeo.com/demo",
    budgetBreakdown: "80% Hardware Procurement, 20% Land Lease",
    roadmap: "Month 1: Secure Land. Month 2: Install Solar Array. Month 3: Deploy ASICs.",
    daysLeft: 120,
    backers: 450,
    isTrending: false
  },
  {
    id: "stacks-gaming",
    title: "Polyverse",
    tagline: "An MMORPG where every item is a Bitcoin NFT. Play, earn, and own your assets on the most secure chain.",
    description: "An MMORPG where every item is a Bitcoin NFT. Play, earn, and own your assets on the most secure chain.",
    category: "Gaming",
    location: "Seoul, South Korea",
    raised: 8000,
    goal: 60000,
    image: "/campaign-5.jpg",
    creator: "PolyLabs",
    creatorImage: "https://github.com/shadcn.png",
    daysLeft: 29,
    backers: 120,
    isTrending: false
  },
  {
    id: "liquid-ops",
    title: "Liquid Ops",
    description: "Decentralized dev-ops tooling for Clarity smart contracts. Automate your deployments with 100% uptime.",
    category: "Infrastructure",
    location: "Berlin, Germany",
    raised: 14200,
    goal: 30000,
    image: "/campaign-6.jpg",
    creator: "OpsTeam",
    creatorImage: "https://github.com/shadcn.png",
    daysLeft: 5,
    backers: 89,
    isTrending: false
  }
];

// Helper: Get the single trending campaign for the center slot
export function getHeroCampaign() {
  return CAMPAIGNS.find((c) => c.isTrending) || CAMPAIGNS[0];
}

// Helper: Get 2 other campaigns for the side slots
export function getSideCampaigns() {
  return CAMPAIGNS.filter((c) => !c.isTrending).slice(0, 2);
}

export function getCampaign(id: string) {
  return CAMPAIGNS.find((c) => c.id === id);
}
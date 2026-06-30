export type CampaignStatus = "active" | "successful" | "failed";
export type FundingModel = "Flexible Model" | "All-or-Nothing";

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
  // 🚨 NEW FIELDS ADDED HERE
  status: CampaignStatus;
  fundingModel: FundingModel;
}

export const CAMPAIGNS: Campaign[] = [
  // --- ACTIVE CAMPAIGNS (Will sort to top) ---
  {
    id: "stacks-school",
    title: "Stacks School",
    tagline: "Teaching Clarity smart contracts to 10,000 developers worldwide.",
    description: "We are building the next generation of Bitcoin builders. Currently, the learning curve for Clarity is too steep.",
    category: "Education",
    projectStage: "MVP",
    location: "Global",
    raised: 12000,
    goal: 100000,
    currency: "USDCx",
    image: "/campaign-2.jpg",
    creator: "DeFi Academy",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Ex-educators and early Stacks adopters.",
    twitter: "@StacksSchool",
    github: "github.com/stacksschool",
    portfolio: "stacksschool.com",
    videoUrl: "",
    budgetBreakdown: "50% Content Creation, 30% Platform Engineering, 20% Marketing",
    roadmap: "Month 1: Launch Beta. Month 3: 50+ Lessons.",
    daysLeft: 45,
    backers: 340,
    isTrending: false,
    status: "active",
    fundingModel: "Flexible Model"
  },
  {
    id: "bitcoin-city",
    title: "Bitcoin City Initiative",
    tagline: "Infrastructure for the Bitcoin Economy.",
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
    creatorBio: "Urban planners building on Bitcoin.",
    twitter: "@CityDAO",
    github: "github.com/citydao",
    portfolio: "citydao.com",
    videoUrl: "",
    budgetBreakdown: "80% Hardware Procurement, 20% Land Lease",
    roadmap: "Month 1: Secure Land.",
    daysLeft: 120,
    backers: 450,
    isTrending: false,
    status: "active",
    fundingModel: "All-or-Nothing"
  },
  {
    id: "stacks-gaming",
    title: "Polyverse",
    tagline: "An MMORPG where every item is a Bitcoin NFT.",
    description: "Play, earn, and own your assets on the most secure chain.",
    category: "Gaming",
    projectStage: "Idea",
    location: "Seoul, South Korea",
    raised: 8000,
    goal: 60000,
    currency: "USDCx",
    image: "/campaign-5.jpg",
    creator: "PolyLabs",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Game devs making the jump to Web3.",
    twitter: "@PolyLabs",
    github: "",
    portfolio: "",
    videoUrl: "",
    budgetBreakdown: "100% Development",
    roadmap: "Q1 Alpha.",
    daysLeft: 29,
    backers: 120,
    isTrending: false,
    status: "active",
    fundingModel: "Flexible Model"
  },
  {
    id: "zero-fee-dex",
    title: "Zero-Fee DEX",
    tagline: "Swap Stacks assets with zero protocol fees.",
    description: "A community-owned automated market maker prioritizing deep liquidity and zero rent-seeking.",
    category: "DeFi",
    projectStage: "Prototype",
    location: "Remote",
    raised: 5500,
    goal: 25000,
    currency: "STX",
    image: "/campaign-1.jpg",
    creator: "DEX DAO",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "DeFi maximalists.",
    twitter: "@ZeroFeeDex",
    github: "",
    portfolio: "",
    videoUrl: "",
    budgetBreakdown: "Audits and Liquidity",
    roadmap: "Launch Q3",
    daysLeft: 10,
    backers: 50,
    isTrending: true,
    status: "active",
    fundingModel: "All-or-Nothing"
  },
  {
    id: "stacks-lend",
    title: "StacksLend",
    tagline: "Non-custodial lending against sBTC collateral.",
    description: "Borrow stablecoins against your Bitcoin without giving up custody. Over-collateralized, audited, and governed by the community.",
    category: "DeFi",
    projectStage: "Prototype",
    location: "Singapore",
    raised: 18400,
    goal: 80000,
    currency: "USDCx",
    image: "/campaign-1.jpg",
    creator: "Lumen Labs",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Lending protocol veterans from the EVM ecosystem.",
    twitter: "@StacksLend",
    github: "github.com/stackslend",
    portfolio: "stackslend.fi",
    videoUrl: "",
    budgetBreakdown: "45% Smart Contract Audits, 35% Engineering, 20% Liquidity Incentives",
    roadmap: "Month 1: Testnet. Month 3: Audit. Month 5: Mainnet.",
    daysLeft: 38,
    backers: 210,
    isTrending: false,
    status: "active",
    fundingModel: "All-or-Nothing"
  },
  {
    id: "hashgrid-mining",
    title: "HashGrid Co-op",
    tagline: "Community-owned Bitcoin mining powered by stranded gas.",
    description: "A mining cooperative that captures flared natural gas to mine Bitcoin, turning waste emissions into hashrate and shared rewards.",
    category: "Mining",
    projectStage: "MVP",
    location: "Calgary, Canada",
    raised: 42000,
    goal: 150000,
    currency: "USDCx",
    image: "/campaign-3.jpg",
    creator: "HashGrid Collective",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Energy engineers and miners reducing methane flaring.",
    twitter: "@HashGridCoop",
    github: "",
    portfolio: "hashgrid.energy",
    videoUrl: "",
    budgetBreakdown: "70% Mining Hardware, 20% Gas Capture Rigs, 10% Operations",
    roadmap: "Q1: Site 1 online. Q3: 2 PH/s. Q4: Co-op dividends.",
    daysLeft: 64,
    backers: 305,
    isTrending: false,
    status: "active",
    fundingModel: "Flexible Model"
  },
  {
    id: "clarity-rpc",
    title: "OpenRPC for Stacks",
    tagline: "Free, decentralized RPC infrastructure for builders.",
    description: "Public good RPC nodes with global edge caching so any Stacks app can read chain state reliably without paying for centralized providers.",
    category: "Infrastructure",
    projectStage: "Prototype",
    location: "Remote",
    raised: 9800,
    goal: 40000,
    currency: "STX",
    image: "/campaign-6.jpg",
    creator: "NodeGuild",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Infra operators running validators across 4 continents.",
    twitter: "@OpenRPCStacks",
    github: "github.com/nodeguild",
    portfolio: "openrpc.dev",
    videoUrl: "",
    budgetBreakdown: "60% Node Hosting, 25% Edge CDN, 15% Monitoring",
    roadmap: "Month 1: 5 regions. Month 4: 99.99% SLA.",
    daysLeft: 21,
    backers: 142,
    isTrending: false,
    status: "active",
    fundingModel: "Flexible Model"
  },
  {
    id: "solar-schools-ng",
    title: "Solar Schools Nigeria",
    tagline: "Bitcoin-funded solar power for rural classrooms.",
    description: "Each milestone unlocks a solar installation in a Nigerian school, transparently funded on-chain so backers see exactly which classroom they powered.",
    category: "Social Impact",
    projectStage: "MVP",
    location: "Akure, Nigeria",
    raised: 27300,
    goal: 90000,
    currency: "USDCx",
    image: "/campaign-4.jpg",
    creator: "BrightFuture DAO",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Climate and education advocates based in West Africa.",
    twitter: "@SolarSchoolsNG",
    github: "",
    portfolio: "solarschools.ng",
    videoUrl: "",
    budgetBreakdown: "75% Solar Hardware & Install, 15% Training, 10% Monitoring",
    roadmap: "Phase 1: 10 schools. Phase 2: 50 schools.",
    daysLeft: 52,
    backers: 478,
    isTrending: false,
    status: "active",
    fundingModel: "Flexible Model"
  },

  // --- SUCCESSFUL CAMPAIGNS (Will sort to middle) ---
  {
    id: "defi-for-everyone",
    title: "DeFi for Everyone",
    tagline: "The first mobile-first yield aggregator on Stacks.",
    description: "Democratizing finance for the 99% with simple UX and trustless strategies.",
    category: "DeFi",
    projectStage: "Prototype",
    location: "Lagos, Nigeria",
    raised: 55000,
    goal: 50000,
    currency: "STX",
    image: "/campaign-1.jpg",
    creator: "Alex Smith",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Senior protocol engineer.",
    twitter: "@AlexBuilds",
    github: "github.com/alexsmith",
    portfolio: "alexsmith.dev",
    videoUrl: "",
    budgetBreakdown: "70% Smart Contract Audits, 30% Frontend",
    roadmap: "Mainnet TGE.",
    daysLeft: 0,
    backers: 1240,
    isTrending: false,
    status: "successful",
    fundingModel: "Flexible Model"
  },
  {
    id: "liquid-ops",
    title: "Liquid Ops",
    tagline: "Decentralized dev-ops tooling for Clarity.",
    description: "Automate your deployments with 100% uptime.",
    category: "Infrastructure",
    projectStage: "Idea",
    location: "Berlin, Germany",
    raised: 35000,
    goal: 30000,
    currency: "USDCx",
    image: "/campaign-6.jpg",
    creator: "OpsTeam",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Infrastructure nerds.",
    twitter: "@OpsTeam",
    github: "github.com/opsteam",
    portfolio: "opsteam.com",
    videoUrl: "",
    budgetBreakdown: "Server costs and Dev time",
    roadmap: "Beta live now",
    daysLeft: 0,
    backers: 89,
    isTrending: false,
    status: "successful",
    fundingModel: "All-or-Nothing"
  },
  {
    id: "chain-arena",
    title: "Chain Arena",
    tagline: "On-chain competitive card battler with real ownership.",
    description: "A skill-based PvP card game where decks, wins, and tournament prizes settle on Stacks. Fully funded and now in open beta.",
    category: "Gaming",
    projectStage: "MVP",
    location: "Tokyo, Japan",
    raised: 72000,
    goal: 65000,
    currency: "STX",
    image: "/campaign-5.jpg",
    creator: "Arena Studios",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Ex-mobile game studio shipping on Bitcoin.",
    twitter: "@ChainArena",
    github: "github.com/chainarena",
    portfolio: "chainarena.gg",
    videoUrl: "",
    budgetBreakdown: "55% Development, 25% Art, 20% Tournaments",
    roadmap: "Beta live. Season 1 ladder launching.",
    daysLeft: 0,
    backers: 1620,
    isTrending: false,
    status: "successful",
    fundingModel: "Flexible Model"
  },

  // --- FAILED CAMPAIGNS (Will sort to bottom) ---
  {
    id: "green-mining",
    title: "Green Mining",
    tagline: "Solar-powered Bitcoin mining initiative.",
    description: "Carbon neutral production ensuring the future of sustainable POW.",
    category: "Mining",
    projectStage: "Idea",
    location: "Austin, TX",
    raised: 5000,
    goal: 25000,
    currency: "USDCx",
    image: "/campaign-3.jpg",
    creator: "EcoBit",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Renewable energy experts.",
    twitter: "@EcoBit",
    github: "",
    portfolio: "ecobit.io",
    videoUrl: "",
    budgetBreakdown: "80% Hardware Procurement, 20% Land Lease",
    roadmap: "Project Suspended",
    daysLeft: 0,
    backers: 85,
    isTrending: false,
    status: "failed",
    fundingModel: "All-or-Nothing"
  },
  {
    id: "pixel-lords",
    title: "Pixel Lords NFT",
    tagline: "10,000 on-chain pixel warriors.",
    description: "A generative art project aiming to build a metaverse.",
    category: "Gaming",
    projectStage: "Idea",
    location: "Remote",
    raised: 1200,
    goal: 15000,
    currency: "STX",
    image: "/campaign-5.jpg",
    creator: "Pixel Studio",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Digital artists.",
    twitter: "@PixelLords",
    github: "",
    portfolio: "",
    videoUrl: "",
    budgetBreakdown: "Art creation",
    roadmap: "Mint failed",
    daysLeft: 0,
    backers: 12,
    isTrending: false,
    status: "failed",
    fundingModel: "All-or-Nothing"
  },
  {
    id: "meshnet-relay",
    title: "MeshNet Relay",
    tagline: "Decentralized mesh internet for off-grid regions.",
    description: "A relay network aiming to bring connectivity to remote areas. The hardware logistics proved too costly and the round did not reach its floor.",
    category: "Infrastructure",
    projectStage: "Idea",
    location: "Nairobi, Kenya",
    raised: 3100,
    goal: 45000,
    currency: "USDCx",
    image: "/campaign-6.jpg",
    creator: "MeshWorks",
    creatorImage: "https://github.com/shadcn.png",
    creatorBio: "Network engineers focused on the global south.",
    twitter: "@MeshNetRelay",
    github: "",
    portfolio: "",
    videoUrl: "",
    budgetBreakdown: "65% Relay Hardware, 35% Deployment",
    roadmap: "Round did not reach minimum.",
    daysLeft: 0,
    backers: 41,
    isTrending: false,
    status: "failed",
    fundingModel: "All-or-Nothing"
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

// Helper: Get all campaigns for the Explore Page
export function getAllCampaigns() {
  return CAMPAIGNS;
}
import { Guild } from '../types';

export const GUILDS: Guild[] = [
  {
    id: "magitek_innovators",
    name: "Magitek Innovators Guild",
    description: "The masters of steam, steel, and sorcery intertwined. This guild pushes the boundaries of what's possible with technology, viewing 'The Great Game' as the ultimate testing ground for their inventions.",
    ethos: ["Technology", "Progress", "Profit"],
    icon_tags: "gear-lightning",
    palette: ["#4682B4", "#FFD700", "#A9A9A9"], // Steel Blue, Gold, Dark Grey
    reputation: 0, // Neutral
    effects: {
      positive: "+10% Tech research speed.",
      negative: "Access to advanced tech schematics is restricted."
    },
    scenarioTemplates: [
      {
        subject: "Prototype Field Test",
        body: `Manager, we have developed a new prototype, the '[INVENTION]'. We require a field test under competitive conditions. Would you be willing to equip one of your players with it for the next match? The potential benefits are significant, but as it's experimental, there is a minor risk of malfunction.`,
        actions: [
          { label: "Accept the risk", description: "You agree to test the prototype. The Guild is pleased with your commitment to progress.", reputationChange: 10 },
          { label: "Decline politely", description: "You decide against risking your player's fitness. The Guild is disappointed but understands your caution.", reputationChange: -5 }
        ]
      },
      {
        minRep: 25,
        subject: "Exclusive Partnership Offer",
        body: "Your support for technological advancement has not gone unnoticed. We would like to offer [CLUB_NAME] an exclusive partnership, giving you first access to our newest innovations before they reach the open market. This requires a small investment, of course.",
        actions: [
          { label: "Invest in the future", description: "You invest in the partnership, securing cutting-edge technology for your team.", reputationChange: 15 },
          { label: "Too costly for now", description: "You decline the partnership, citing budget constraints. The Guild hopes you'll reconsider in the future.", reputationChange: 0 }
        ]
      }
    ]
  },
  {
    id: "alchemists_union",
    name: "The Alchemist's Union",
    description: "From performance-enhancing potions to enchanted equipment salves, the Union controls the supply of most consumable magical goods. They champion the purity of arcane ingredients and traditional methods.",
    ethos: ["Alchemy", "Purity", "Tradition"],
    icon_tags: "potion-leaf",
    palette: ["#8A2BE2", "#32CD32", "#FFFFFF"], // Blue Violet, Lime Green, White
    reputation: 0, // Neutral
    effects: {
      positive: "15% discount on all potions and enchantments.",
      negative: "Union-controlled suppliers may refuse to sell you high-grade materials."
    },
    scenarioTemplates: [
      {
        subject: "Rare Ingredient Shortage",
        body: "Salutations. A key ingredient for our next batch of fortitude elixirs, '[INGREDIENT]', is unexpectedly scarce. We've tracked a potential source, but the expedition is costly. Your financial assistance would guarantee [CLUB_NAME] a priority shipment upon success.",
        actions: [
          { label: "Fund the expedition", description: "You provide the funds. The Union appreciates your patronage and will remember this gesture.", reputationChange: 10 },
          { label: "Cannot assist", description: "You decline to fund the risky venture. The Union will have to seek other, less reliable, partners.", reputationChange: -5 }
        ]
      }
    ]
  },
  {
    id: "blackstone_syndicate",
    name: "The Blackstone Syndicate",
    description: "Operating in the shadows, the Syndicate deals in what is forbidden: illegal augmentations, forgotten spells, and off-the-books transfers. Engaging with them is a high-risk, high-reward endeavor.",
    ethos: ["Secrecy", "Power", "Risk"],
    icon_tags: "skull-coin",
    palette: ["#B22222", "#1C1C1C", "#C0C0C0"], // Firebrick, Near Black, Silver
    reputation: -25, // Wary
    effects: {
      positive: "Unlocks access to the Black Market for unique players and gear.",
      negative: "Increased scrutiny from the Ordo Wasit Abadi (Eternal Referees)."
    },
    scenarioTemplates: [
      {
        maxRep: 0,
        subject: "An Opportunity",
        body: "We've 'acquired' sensitive information regarding your next opponent's [TARGET]. For a reasonable fee, this information could find its way to your desk. It could provide a significant advantage. Interested?",
        actions: [
          { label: "Acquire the information", description: "You pay for the illicit data. Winning is what matters, and the Syndicate is a useful tool.", reputationChange: -10 },
          { label: "Refuse the offer", description: "You decline to engage in such underhanded tactics. The Syndicate shrugs; your loss is their gain.", reputationChange: 5 }
        ]
      }
    ]
  },
  {
    id: "chroniclers_society",
    name: "The Chroniclers' Society",
    description: "The keepers of history, lore, and, most importantly, the news that shapes public opinion. This society of scribes and scryers runs the 'Gazette of Gears' and can make or break a manager's reputation.",
    ethos: ["Knowledge", "Truth", "Influence"],
    icon_tags: "scroll-quill",
    palette: ["#8B4513", "#F5DEB3", "#000000"], // Saddle Brown, Wheat, Black
    reputation: 25, // Friendly
    effects: {
      positive: "Media outlets are more likely to publish favorable stories about you.",
      negative: "Rival managers may use their Society contacts to plant negative stories."
    },
    scenarioTemplates: [
      {
        subject: "Request for Comment",
        body: "Manager, the Gazette of Gears is running a story on [MEDIA_TOPIC]. A quote from you would add significant weight to the piece. How do you respond to the claims?",
        actions: [
          { label: "Give a candid quote", description: "You speak your mind, creating headlines. The Society appreciates your openness, though it may stir controversy.", reputationChange: 10 },
          { label: "Offer a diplomatic 'no comment'", description: "You provide a safe, neutral statement. The Society gets a less exciting story, but you avoid any potential backlash.", reputationChange: 0 }
        ]
      }
    ]
  },
];
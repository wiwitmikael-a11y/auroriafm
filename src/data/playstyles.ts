import { Playstyle } from '../types';

export const PLAYSTYLES: Playstyle[] = [
  {
    id: 'poacher',
    name: 'Poacher',
    description: 'A predatory striker who excels at finding space in the box and finishing clinically.',
    effects: {
      shooting: 1.1, // 10% bonus
      strength: 0.9, // 10% penalty
      composure: 1.05,
    },
  },
  {
    id: 'aether_weaver',
    name: 'Aether-Weaver',
    description: 'A creative midfielder who weaves magical passes and controls the tempo with arcane arts.',
    effects: {
      passing: 1.1,
      vision: 1.1,
      tackling: 0.9,
      arcane_dribble: 1.05,
    },
  },
  {
    id: 'cogwork_defender',
    name: 'Cogwork Defender',
    description: 'A stoic and powerful defender who relies on strength, timing, and mechanical efficiency.',
    effects: {
      tackling: 1.1,
      strength: 1.1,
      speed: 0.9,
      consistency: 1.1,
    },
  },
  {
    id: 'ball_winner',
    name: 'Ball-Winning Midfielder',
    description: 'A midfield destroyer whose main job is to win the ball back through tackling and aggression.',
    effects: {
        tackling: 1.1,
        aggression: 1.1,
        stamina: 1.05,
        passing: 0.95,
    }
  },
  {
    id: 'versatile',
    name: 'Versatile',
    description: 'A well-rounded player without a specific specialization.',
    effects: {},
  },
];
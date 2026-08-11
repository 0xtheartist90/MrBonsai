export interface Article {
    id: string;
    title: string;
    level: 'beginner' | 'advanced';
    minutes: number;
    body: string[];
}

export const ARTICLES: Article[] = [
    {
        id: 'watering-basics',
        title: 'Watering: the skill that keeps bonsai alive',
        level: 'beginner',
        minutes: 4,
        body: [
            'More bonsai die from wrong watering than from anything else. The golden rule: water when the soil starts to dry, not on a fixed schedule. Check daily by feeling the top centimeter of soil.',
            'When you water, do it thoroughly — keep going until water runs out of the drainage holes, then repeat once. This ensures the whole root ball is wetted, not just the surface.',
            'Season matters enormously: a tree that needs water twice a day in July may need it once a week in January. The reminders in this app shift automatically with the seasons, but your finger in the soil is always the final judge.'
        ]
    },
    {
        id: 'choosing-first-tree',
        title: 'Choosing your first bonsai',
        level: 'beginner',
        minutes: 3,
        body: [
            'Start with a species that forgives mistakes. Ficus, Chinese Elm, Dwarf Jade and Zelkova all tolerate irregular watering and respond well to pruning.',
            'Decide where the tree will live first, then pick the species — not the other way round. A juniper on an indoor windowsill will slowly die, no matter how well you water it.',
            'Buy from a bonsai nursery rather than a supermarket if you can: the tree will be healthier, correctly potted and honestly labelled.'
        ]
    },
    {
        id: 'pruning-guide',
        title: 'Maintenance pruning vs. structural pruning',
        level: 'beginner',
        minutes: 5,
        body: [
            'Maintenance pruning keeps the silhouette: trim shoots back to one or two leaves once they extend past the canopy. Do this throughout the growing season.',
            'Structural pruning shapes the future of the tree: removing large branches, deciding the front, cutting back the apex. Do this once, in the right season for the species — usually early spring or late autumn.',
            'Always ask: does this branch serve the design? Crossing branches, bar branches (two at the same height) and straight-up growth are the usual first candidates to remove.'
        ]
    },
    {
        id: 'wiring',
        title: 'Wiring fundamentals',
        level: 'advanced',
        minutes: 6,
        body: [
            'Wiring lets you place every branch exactly where the design needs it. Use aluminium wire for deciduous species and copper for conifers, at roughly one third of the branch thickness.',
            'Wrap at a 45-degree angle, snug but never biting into the bark. Wire in the direction you plan to bend.',
            'Check wired branches every few weeks in the growing season — wire that cuts into a thickening branch scars it for years. Set a custom task in this app when you wire a branch.'
        ]
    },
    {
        id: 'repotting-deep-dive',
        title: 'Repotting without fear',
        level: 'advanced',
        minutes: 7,
        body: [
            'Repotting refreshes the soil and keeps the root system fine and compact. Most trees need it every two to three years; the app tracks this per tree.',
            'The window is short: just as buds swell in early spring. Repotting in the wrong season is the most common cause of losing an established tree.',
            'Remove no more than a third of the roots, work quickly in the shade, and keep the tree sheltered and slightly drier for a few weeks afterwards while new roots form.'
        ]
    },
    {
        id: 'seasonal-rhythm',
        title: 'The bonsai year: working with the seasons',
        level: 'advanced',
        minutes: 5,
        body: [
            'Spring: repot, start feeding, protect new growth from late frost. The busiest season.',
            'Summer: water vigilantly, pinch and trim constantly, give indoor species an outdoor holiday.',
            'Autumn: wire while branches are flexible, reduce feeding, enjoy and photograph the colours.',
            'Winter: rest for the tree, planning for you. Protect outdoor trees from hard frost and study your trees’ bare structure for next year’s decisions.'
        ]
    }
];

export interface Video {
    id: string;
    title: string;
    source: string;
    url: string;
    minutes: number;
}

export const VIDEOS: Video[] = [
    {
        id: 'be-beginners',
        title: 'Bonsai for beginners — full introduction',
        source: 'Bonsai Empire',
        url: 'https://www.youtube.com/@BonsaiEmpire',
        minutes: 12
    },
    {
        id: 'be-watering',
        title: 'How to water a bonsai tree',
        source: 'Bonsai Empire',
        url: 'https://www.bonsaiempire.com/basics/bonsai-care/watering',
        minutes: 6
    },
    {
        id: 'be-pruning',
        title: 'Pruning a bonsai — maintenance & styling',
        source: 'Bonsai Empire',
        url: 'https://www.bonsaiempire.com/basics/styling/pruning',
        minutes: 9
    },
    {
        id: 'be-repotting',
        title: 'Repotting bonsai step by step',
        source: 'Bonsai Empire',
        url: 'https://www.bonsaiempire.com/basics/bonsai-care/repotting',
        minutes: 8
    },
    {
        id: 'be-ficus',
        title: 'Ficus bonsai care guide',
        source: 'Bonsai Empire',
        url: 'https://www.bonsaiempire.com/tree-species/ficus',
        minutes: 7
    }
];

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
            'Start with a species that forgives mistakes and loves tropical heat. Ficus (Golden Spoon or Triangle Fig), Dwarf Jade, Orange Jasmine and Ixora all tolerate beginner errors and thrive outdoors here year-round.',
            'Decide where the tree will live first, then pick the species — not the other way round. Temperate species like maples and junipers are a running battle in lowland heat: they miss their winter rest, so treat them as advanced projects.',
            'Local plant markets are a great source — trees are already acclimated to your climate. Check the trunk base for firmness, look under the leaves for pests, and ask what soil it is potted in.'
        ]
    },
    {
        id: 'pruning-guide',
        title: 'Maintenance pruning vs. structural pruning',
        level: 'beginner',
        minutes: 5,
        body: [
            'Maintenance pruning keeps the silhouette: trim shoots back to one or two leaves once they extend past the canopy. Do this throughout the growing season.',
            'Structural pruning shapes the future of the tree: removing large branches, deciding the front, cutting back the apex. For tropical species do this during strong active growth so wounds close fast; for the temperate species in your collection, use the cool season.',
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
            'Time it for warm, active growth — the start of the hot season is ideal for tropical species, so roots regrow immediately. Temperate species (maple, fringe tree) get the end of the cool season instead, right at bud swell.',
            'Remove no more than a third of the roots, work quickly in the shade, and keep the tree sheltered and slightly drier for a few weeks afterwards while new roots form.'
        ]
    },
    {
        id: 'seasonal-rhythm',
        title: 'The bonsai year in Thailand: hot, rainy, cool',
        level: 'advanced',
        minutes: 5,
        body: [
            'Hot season (March-May): the busiest and riskiest months. Small pots can dry in hours — check every morning, shade sensitive species and the pots themselves from afternoon heat, and repot at the start of this window while growth is explosive.',
            'Rainy season (June-October): nature waters for you, which is the trap. Check drainage and saturation instead of watering on schedule, maximize airflow against fungus, and shelter rot-sensitive plants (Dwarf Jade, junipers) from days of nonstop rain.',
            'Late rains (September-October): vigorous growth — keep the trimming rhythm going, wire while branches are flexible, and check wired branches often because they thicken fast.',
            'Cool season (November-February): the closest thing to rest here. Temperate species (maple, fringe tree, junipers) need this pause — give them the coolest spot you have, reduce water and feeding, and use the calmer months for structural decisions and styling.'
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

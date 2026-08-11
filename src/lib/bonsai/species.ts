import type { Species } from './types';

export const SPECIES: Species[] = [
    {
        id: 'ficus-annulata',
        name: 'Golden Spoon Ficus',
        latin: 'Ficus annulata Blume',
        placement: 'outdoor',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: false,
        description:
            'Tropical fig ("Ringed Fig", Thai: ช้อนเงินช้อนทอง) with thick glossy spoon-like leaves. Responds strongly to pruning, can grow aerial roots in warm humid weather and suits banyan and informal upright styles.',
        care: {
            watering: 'Water fully (until it runs from the drainage holes) as soon as the top layer of soil starts to dry. Check daily in hot weather — checking is not the same as watering.',
            wateringIntervalDays: { spring: 1, summer: 2, autumn: 2, winter: 2 },
            fertilizing: 'Balanced feed every 2-4 weeks during active growth; a young tree building trunk may be fed well.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 21, winter: 21 },
            repotting: 'Check roots yearly; usually every 1-2 years while young, during warm active growth.',
            repotEveryYears: 1,
            pruning: 'Clip-and-grow: let a shoot make 6+ leaves, cut back to 2-3. For trunk thickening, let sacrifice shoots run.',
            sunlight: 'Very bright; morning sun plus several hours of direct sun after acclimating. Too little light = long internodes and big leaves.',
            temperature: 'Tropical — thrives in year-round warmth'
        },
        seasonalTips: {
            spring: 'Hot season: check water daily, small pots heat up fast. Shade fresh repots from the harshest afternoon sun.',
            summer: 'Rainy season: do not water on top of rain-soaked soil, keep drainage holes free and watch for fungus.',
            autumn: 'Late rains: strong growth — keep up the clip-and-grow rhythm and check wire often.',
            winter: 'Cool season: growth slows slightly; feed less and enjoy styling work.'
        }
    },
    {
        id: 'ficus-retusa',
        name: 'Ficus',
        latin: 'Ficus retusa / microcarpa',
        placement: 'indoor',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: false,
        description:
            'The most popular indoor bonsai. Very forgiving, tolerates low humidity and recovers well from pruning mistakes.',
        care: {
            watering: 'Water generously when the soil gets slightly dry, never let it dry out completely.',
            wateringIntervalDays: { spring: 3, summer: 2, autumn: 3, winter: 4 },
            fertilizing: 'Feed every two weeks in summer, monthly in winter if growth continues.',
            fertilizingIntervalDays: { spring: 14, summer: 14, autumn: 21, winter: 30 },
            repotting: 'Repot every two years in spring with a basic soil mixture.',
            repotEveryYears: 2,
            pruning: 'Prune back to 2 leaves after 6-8 leaves have grown. Large leaves can be defoliated in summer.',
            sunlight: 'Bright location, some direct morning sun. Can go outside above 15°C.',
            temperature: '15°C to 30°C, keep above 10°C in winter'
        },
        seasonalTips: {
            spring: 'Repot if needed and increase feeding as growth restarts.',
            summer: 'Place outside in a warm spot; watch watering on hot days.',
            autumn: 'Bring back inside before nights drop below 15°C.',
            winter: 'Keep away from cold drafts and radiators; consider a grow light.'
        }
    },
    {
        id: 'chinese-elm',
        name: 'Chinese Elm',
        latin: 'Ulmus parvifolia',
        placement: 'both',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: false,
        flowers: false,
        description:
            'A classic beginner species with fine branching and small leaves. Thrives indoors and outdoors and back-buds readily.',
        care: {
            watering: 'Keep evenly moist; water when the top layer of soil feels dry.',
            wateringIntervalDays: { spring: 2, summer: 1, autumn: 3, winter: 5 },
            fertilizing: 'Feed weekly to bi-weekly during the growing season.',
            fertilizingIntervalDays: { spring: 10, summer: 10, autumn: 21, winter: null },
            repotting: 'Repot every two years in early spring, prune roots moderately.',
            repotEveryYears: 2,
            pruning: 'Trim shoots back to 1-3 leaves once they extend 3-4 nodes.',
            sunlight: 'Full sun to partial shade; loves outdoor summers.',
            temperature: 'Hardy to light frost when kept outside year-round'
        },
        seasonalTips: {
            spring: 'Ideal repotting window just as buds swell.',
            summer: 'Vigorous growth — trim frequently to build ramification.',
            autumn: 'Enjoy the yellow autumn colour; reduce feeding.',
            winter: 'Outdoor trees need frost protection below -5°C.'
        }
    },
    {
        id: 'juniper',
        name: 'Juniper',
        latin: 'Juniperus chinensis',
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'scale',
        evergreen: true,
        flowers: false,
        description:
            'The archetypal outdoor bonsai with elegant deadwood potential. Must live outside — it will slowly die indoors.',
        care: {
            watering: 'Let the soil dry slightly between waterings; junipers hate wet feet.',
            wateringIntervalDays: { spring: 3, summer: 2, autumn: 4, winter: 7 },
            fertilizing: 'Feed monthly with organic fertilizer from early spring to autumn.',
            fertilizingIntervalDays: { spring: 30, summer: 30, autumn: 30, winter: null },
            repotting: 'Repot every 3-4 years in spring, do not bare-root.',
            repotEveryYears: 3,
            pruning: 'Pinch new shoots in the growing season; never cut all foliage from a branch.',
            sunlight: 'Full sun year-round.',
            temperature: 'Fully hardy; protect roots below -10°C'
        },
        seasonalTips: {
            spring: 'Start feeding and light wiring as growth begins.',
            summer: 'Pinch running shoots to keep pads compact.',
            autumn: 'Main wiring season — branches set over winter.',
            winter: 'Leave outside; shelter the pot from hard freezes.'
        }
    },
    {
        id: 'japanese-maple',
        name: 'Japanese Maple',
        latin: 'Acer palmatum',
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'broadleaf',
        evergreen: false,
        flowers: false,
        description:
            'Beloved for its delicate leaves and spectacular autumn colours. A deciduous outdoor species that rewards careful ramification work.',
        care: {
            watering: 'Water daily in summer; keep moist but well-drained.',
            wateringIntervalDays: { spring: 2, summer: 1, autumn: 3, winter: 6 },
            fertilizing: 'Feed every two weeks after the first leaves harden.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 14, winter: null },
            repotting: 'Repot every two years in early spring before bud break.',
            repotEveryYears: 2,
            pruning: 'Prune to two pairs of leaves; do major cuts in autumn to avoid bleeding.',
            sunlight: 'Morning sun, afternoon shade — leaves burn in hot sun.',
            temperature: 'Hardy, but protect from late spring frosts and drying wind'
        },
        seasonalTips: {
            spring: 'Protect fresh leaves from frost; pinch shoots early.',
            summer: 'Shade from afternoon sun to prevent leaf scorch.',
            autumn: 'Best colour of the year — take your seasonal photo!',
            winter: 'Structural pruning while the branches are bare.'
        }
    },
    {
        id: 'jade',
        name: 'Dwarf Jade',
        latin: 'Portulacaria afra',
        placement: 'indoor',
        difficulty: 'beginner',
        leafType: 'succulent',
        evergreen: true,
        flowers: false,
        description:
            'A succulent that is almost impossible to kill by underwatering. Great for busy owners and warm, bright windowsills.',
        care: {
            watering: 'Let the soil dry out completely between waterings.',
            wateringIntervalDays: { spring: 7, summer: 5, autumn: 10, winter: 21 },
            fertilizing: 'Feed monthly during the growing season.',
            fertilizingIntervalDays: { spring: 30, summer: 30, autumn: null, winter: null },
            repotting: 'Repot every two years in spring in very well-draining soil.',
            repotEveryYears: 2,
            pruning: 'Prune year-round; cuts heal without sealing.',
            sunlight: 'As much direct sun as possible.',
            temperature: 'Above 5°C at all times; loves summer outdoors'
        },
        seasonalTips: {
            spring: 'Repot and increase watering as days lengthen.',
            summer: 'Move outside to full sun for compact growth.',
            autumn: 'Bring inside before the first cold nights.',
            winter: 'Water very sparingly — once every few weeks is enough.'
        }
    },
    {
        id: 'carmona',
        name: 'Fukien Tea',
        latin: 'Ehretia microphylla (syn. Carmona retusa)',
        placement: 'indoor',
        difficulty: 'intermediate',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'A tropical indoor species with small white flowers and glossy dark leaves. Sensitive to cold and inconsistent watering.',
        care: {
            watering: 'Keep slightly moist at all times; never soggy, never bone dry.',
            wateringIntervalDays: { spring: 3, summer: 2, autumn: 3, winter: 4 },
            fertilizing: 'Feed every two weeks in the growing season with mild fertilizer.',
            fertilizingIntervalDays: { spring: 14, summer: 14, autumn: 30, winter: null },
            repotting: 'Repot every two years in spring; handle the fine roots gently.',
            repotEveryYears: 2,
            pruning: 'Trim regularly; flowers appear on new shoots.',
            sunlight: 'Very bright spot, ideally with morning sun.',
            temperature: 'Constant 18°C to 25°C; avoid drafts'
        },
        seasonalTips: {
            spring: 'Flowering starts — feed gently and keep humidity up.',
            summer: 'Can go outside in a sheltered warm spot.',
            autumn: 'Back indoors early; it dislikes cold nights.',
            winter: 'Keep warm and bright; mist to raise humidity.'
        }
    },
    {
        id: 'azalea',
        name: 'Satsuki Azalea',
        latin: 'Rhododendron indicum',
        placement: 'outdoor',
        difficulty: 'advanced',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'Famous for its overwhelming late-spring blooms. Needs acidic soil, rainwater and precise post-flowering pruning.',
        care: {
            watering: 'Use rainwater if possible; keep moist with lime-free water.',
            wateringIntervalDays: { spring: 2, summer: 1, autumn: 3, winter: 5 },
            fertilizing: 'Feed with azalea fertilizer, pausing during flowering.',
            fertilizingIntervalDays: { spring: 14, summer: 14, autumn: 30, winter: null },
            repotting: 'Repot every two years after flowering in kanuma soil.',
            repotEveryYears: 2,
            pruning: 'Prune immediately after flowering; buds for next year form in summer.',
            sunlight: 'Morning sun and afternoon shade.',
            temperature: 'Hardy to light frost; protect the pot in winter'
        },
        seasonalTips: {
            spring: 'Peak bloom — remove spent flowers promptly.',
            summer: 'Prune right after flowering, then let it grow.',
            autumn: 'Do not prune — you would cut next year’s flower buds.',
            winter: 'Shelter from hard frost and cold wind.'
        }
    },
    {
        id: 'black-pine',
        name: 'Japanese Black Pine',
        latin: 'Pinus thunbergii',
        placement: 'outdoor',
        difficulty: 'advanced',
        leafType: 'needle',
        evergreen: true,
        flowers: false,
        description:
            'The king of classical bonsai. Powerful bark and needle work techniques (decandling) make it a rewarding long-term project.',
        care: {
            watering: 'Water when the surface dries; pines prefer slightly dry over wet.',
            wateringIntervalDays: { spring: 3, summer: 2, autumn: 4, winter: 7 },
            fertilizing: 'Feed heavily from spring to autumn for strong candles.',
            fertilizingIntervalDays: { spring: 21, summer: 21, autumn: 21, winter: null },
            repotting: 'Repot every 3-5 years in spring; keep mycorrhiza in the root ball.',
            repotEveryYears: 4,
            pruning: 'Decandle in early summer for short needles; pull old needles in autumn.',
            sunlight: 'Full sun all day.',
            temperature: 'Fully hardy'
        },
        seasonalTips: {
            spring: 'Let candles extend; feed strongly.',
            summer: 'Decandling time (June) for refined trees.',
            autumn: 'Needle-pulling and wiring season.',
            winter: 'Leave outside; pines need the cold rest.'
        }
    },
    {
        id: 'serissa',
        name: 'Snow Rose',
        latin: 'Serissa japonica',
        placement: 'indoor',
        difficulty: 'advanced',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'A fine-leaved species covered in tiny white flowers. Notorious for dropping leaves when conditions change — keep everything constant.',
        care: {
            watering: 'Keep evenly moist; react quickly to dryness.',
            wateringIntervalDays: { spring: 2, summer: 2, autumn: 3, winter: 4 },
            fertilizing: 'Feed every two weeks in the growing season.',
            fertilizingIntervalDays: { spring: 14, summer: 14, autumn: 30, winter: null },
            repotting: 'Repot every two years in spring.',
            repotEveryYears: 2,
            pruning: 'Trim after each flush of flowers.',
            sunlight: 'Bright, no hot midday sun; hates being moved.',
            temperature: 'Stable 15°C to 24°C year-round'
        },
        seasonalTips: {
            spring: 'First flowering flush; keep the light constant.',
            summer: 'Can flower repeatedly with regular trimming.',
            autumn: 'Expect some leaf drop as light decreases — normal.',
            winter: 'Supplement light; keep away from heaters.'
        }
    },
    {
        id: 'olive',
        name: 'Olive',
        latin: 'Olea europaea',
        placement: 'outdoor',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: false,
        description:
            'A tough Mediterranean species with beautiful aged bark. Loves sun and tolerates hard pruning and dry spells.',
        care: {
            watering: 'Allow to dry between waterings; very drought-tolerant.',
            wateringIntervalDays: { spring: 4, summer: 2, autumn: 5, winter: 10 },
            fertilizing: 'Feed monthly from spring to autumn.',
            fertilizingIntervalDays: { spring: 30, summer: 30, autumn: 30, winter: null },
            repotting: 'Repot every 3 years in late spring.',
            repotEveryYears: 3,
            pruning: 'Hard prune in early spring; it back-buds on old wood.',
            sunlight: 'Full sun, the more the better.',
            temperature: 'Protect below -5°C; winter in a cold greenhouse or bright cool room'
        },
        seasonalTips: {
            spring: 'Hard pruning and repotting as it wakes up.',
            summer: 'Full sun outside; watch for fast-drying soil.',
            autumn: 'Reduce watering as growth slows.',
            winter: 'Cold but frost-free and bright is ideal.'
        }
    },
    {
        id: 'zelkova',
        name: 'Japanese Zelkova',
        latin: 'Zelkova serrata',
        placement: 'outdoor',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: false,
        flowers: false,
        description:
            'The classic broom-style species with a perfect fan of fine branches and lovely autumn colour.',
        care: {
            watering: 'Keep moist during the growing season; daily in summer heat.',
            wateringIntervalDays: { spring: 2, summer: 1, autumn: 3, winter: 6 },
            fertilizing: 'Feed every two weeks from spring through autumn.',
            fertilizingIntervalDays: { spring: 14, summer: 14, autumn: 14, winter: null },
            repotting: 'Repot every two years in early spring.',
            repotEveryYears: 2,
            pruning: 'Trim shoots to 1-2 leaves constantly to build the broom crown.',
            sunlight: 'Full sun; light shade in midsummer.',
            temperature: 'Hardy; protect the pot from deep frost'
        },
        seasonalTips: {
            spring: 'Repot and start the trimming rhythm early.',
            summer: 'Constant pinching keeps the silhouette tight.',
            autumn: 'Golden-orange colour — photo time.',
            winter: 'Fine-tune branch structure while bare.'
        }
    }
];

SPECIES.push(
    {
        id: 'creeping-juniper',
        name: 'Creeping Juniper',
        latin: 'Juniperus horizontalis Moench',
        placement: 'outdoor',
        difficulty: 'advanced',
        leafType: 'scale',
        evergreen: true,
        flowers: false,
        description:
            'A low, creeping North American conifer suited to cascade and semi-cascade styles. It is a temperate species, so in a tropical climate it needs extra observation: 100% outside, maximum sun and airflow, and never constantly wet roots.',
        care: {
            watering: 'Let the top layer dry slightly, then water fully and let the pot drain. Never keep the root ball constantly wet — "conifer = lots of water daily" is the biggest mistake.',
            wateringIntervalDays: { spring: 2, summer: 3, autumn: 3, winter: 3 },
            fertilizing: 'Balanced feed during active growth; a young developing plant may be fed generously.',
            fertilizingIntervalDays: { spring: 21, summer: 30, autumn: 21, winter: 30 },
            repotting: 'Only when needed (often every 2-3 years) — do not disturb the roots yearly. Drainage matters more than a fixed calendar.',
            repotEveryYears: 3,
            pruning: 'Do not shear like a hedge and do not pinch every tip. Cut back selected shoots with sharp scissors and always keep foliage on every branch — bare old wood rarely back-buds.',
            sunlight: 'Full sun, 6+ hours — never keep it indoors for long.',
            temperature: 'Temperate species: monitor extra closely in the hottest and wettest tropical periods'
        },
        seasonalTips: {
            spring: 'Hot season: keep the roots from overheating and never let the pot sit soggy.',
            summer: 'Rainy season is the danger zone — maximum airflow, very free-draining mix, shelter from days of nonstop rain.',
            autumn: 'Good time for wiring: young branches are flexible and set over the cooler months.',
            winter: 'Cool season: ideal period for styling work; keep it in full sun.'
        }
    },
    {
        id: 'wood-apple',
        name: 'Wood Apple (Ma-sang)',
        latin: 'Feroniella lucida (Scheff.) Swingle',
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'Thai มะสัง — a tropical citrus-family tree with compound leaves, thorny character branches and fragrant flowers. Native to monsoon Southeast Asia and a classic Thai bonsai subject. Not the same species as Limonia acidissima, which is also called "wood apple".',
        care: {
            watering: 'Let the top 2-3 cm dry slightly, then water deeply. Avoid bone dry, permanently soggy, and automatic daily watering in the rainy season.',
            wateringIntervalDays: { spring: 2, summer: 3, autumn: 3, winter: 3 },
            fertilizing: 'Balanced feed every 2-4 weeks in active growth, with enough nitrogen for trunk and branch development.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 21, winter: 30 },
            repotting: 'Young trees develop fast: assess roots yearly, repot roughly every 1-2 years in the warm growing period.',
            repotEveryYears: 1,
            pruning: 'Structural focus: trunk line, taper, primary branches. Correct competing leaders early and use sacrifice growth for thickness. Mind the thorns.',
            sunlight: 'Strong light to full sun after acclimating; several hours of direct sun for compact growth.',
            temperature: 'Tropical; established trees tolerate a drier spell'
        },
        seasonalTips: {
            spring: 'Hot season: acclimate slowly to the fiercest midday sun after any repot.',
            summer: 'Rainy season: check for fungus during long wet spells and skip watering after soaking rain.',
            autumn: 'Strong growth — guide the trunk line and let sacrifice branches run.',
            winter: 'Cool season: slightly less water and feed; good moment to review structure.'
        }
    },
    {
        id: 'blue-bell',
        name: 'Vietnamese Blue Bell',
        latin: 'Trifidacanthus unifoliolatus Merr.',
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'Linh Sam — a wet-tropical shrub loved as flowering bonsai for its small bright purple bell-like blooms. Old flower stalks lignify into characteristic three-pointed thorns.',
        care: {
            watering: 'Let the top 1-2 cm dry slightly, then water deeply. Never fully dry, never permanently soggy — small pots may need daily checks in hot weather.',
            wateringIntervalDays: { spring: 1, summer: 2, autumn: 2, winter: 2 },
            fertilizing: 'Regular balanced feeding in active growth; it still needs nitrogen for flowering — bloom-booster-only is not better.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 21, winter: 30 },
            repotting: 'Every 1-3 years depending on root growth, in the warm active period; shelter from extreme sun for a few days after.',
            repotEveryYears: 2,
            pruning: 'Built for ramification: let shoots extend, cut back, develop side shoots, repeat.',
            sunlight: 'A sun lover: 6+ hours of direct light outside. Too little sun = leaf drop, weak shoots, few flowers.',
            temperature: 'Wet-tropical species; thrives in year-round warmth'
        },
        seasonalTips: {
            spring: 'Hot season: daily water checks — flowering suffers quickly from drying out.',
            summer: 'Rainy season: strong growth, trim regularly for the flowering crown.',
            autumn: 'Keep feeding balanced to carry flowering into the cool season.',
            winter: 'Cool season: full sun all day and enjoy the purple blooms.'
        }
    },
    {
        id: 'tamarind',
        name: 'Tamarind',
        latin: 'Tamarindus indica L.',
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'A seasonally-dry tropical tree with fine feathery compound leaves that make beautiful pads. Slow to thicken but very long-lived; classic in Southeast Asian bonsai.',
        care: {
            watering: 'Established plants: let the top layer dry slightly, then water deeply. Unrooted cuttings/seedlings: keep evenly, lightly moist — never waterlogged.',
            wateringIntervalDays: { spring: 2, summer: 2, autumn: 2, winter: 3 },
            fertilizing: 'Feed only once rooted and growing; then balanced feed during active growth.',
            fertilizingIntervalDays: { spring: 21, summer: 30, autumn: 21, winter: 30 },
            repotting: 'Established trees every 2-3 years; young rootbound plants sooner. Do not repot fresh cuttings — build root mass first.',
            repotEveryYears: 2,
            pruning: 'Root first, grow second, thicken third — style only after that. Keep early pruning minimal.',
            sunlight: 'Full sun once established; bright indirect light while rooting.',
            temperature: 'Warmth speeds rooting and growth; fully tropical'
        },
        seasonalTips: {
            spring: 'Hot season: young plants in small pots can dry out in hours — check daily.',
            summer: 'Rainy season: high humidity helps cuttings, but keep the air moving to prevent rot.',
            autumn: 'Let shoots run for trunk thickness; wire young flexible branches.',
            winter: 'Cool season: slightly drier; plan next steps for developing trees.'
        }
    }
);

export const speciesById = (id: string): Species | undefined => SPECIES.find((s) => s.id === id);

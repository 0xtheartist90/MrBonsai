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
            'Beloved for its delicate hand-shaped leaves. A temperate deciduous species and the climate watchlist plant of the collection: in tropical lowland heat it misses its winter rest, so leaf scorch and gradual decline are the risks to manage.',
        care: {
            watering: 'Keep the small rootball moist — it can bake dry in hours of Thai heat. Check daily, water before it wilts.',
            wateringIntervalDays: { spring: 1, summer: 1, autumn: 1, winter: 2 },
            fertilizing: 'Moderate balanced feeding while it grows actively; nothing during a weak or leafless spell.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 21, winter: null },
            repotting: 'Every 1-2 years at bud swell in the coolest part of the year.',
            repotEveryYears: 1,
            pruning: 'Prune to two pairs of leaves; thin bark scars easily, so sharp clean tools and gentle wire.',
            sunlight: 'Morning sun only — afternoon tropical sun burns the leaves. Keep the pot itself cool and shaded.',
            temperature: 'Temperate: the cool season is its only rest here — the cooler its spot, the better'
        },
        seasonalTips: {
            spring: 'Hot season: highest scorch risk of the year — morning sun only, daily water, shade the pot.',
            summer: 'Rainy season: airflow against fungus; do not mistake heat-stress leaf drop for dormancy.',
            autumn: 'Late rains: if it held its leaves, let it build reserves — light feeding.',
            winter: 'Cool season: give it the coolest spot you have; structural pruning if it drops leaves.'
        }
    },
    {
        id: 'jade',
        name: 'Dwarf Jade',
        latin: 'Portulacaria afra',
        placement: 'outdoor',
        difficulty: 'beginner',
        leafType: 'succulent',
        evergreen: true,
        flowers: false,
        description:
            'A succulent that is almost impossible to kill by underwatering — and easy to kill by overwatering. The driest plant of the collection; in the tropics the rainy season is its enemy, not the cold.',
        care: {
            watering: 'Let the soil dry out almost completely between waterings, then soak and drain. Overwatering is far more dangerous than slightly too dry.',
            wateringIntervalDays: { spring: 5, summer: 7, autumn: 7, winter: 6 },
            fertilizing: 'Light feeder — use at least 50% less slow-release than the label indicates for normal plants.',
            fertilizingIntervalDays: { spring: 30, summer: 30, autumn: 30, winter: 30 },
            repotting: 'Every two years in very free-draining soil, during warm active growth.',
            repotEveryYears: 2,
            pruning: 'Clip-and-grow year-round; cuts heal without sealing. Wire bites fast — clip-and-grow is safer.',
            sunlight: 'As much direct sun as possible; full sun keeps growth compact.',
            temperature: 'Loves tropical heat; shelter from days of nonstop rain'
        },
        seasonalTips: {
            spring: 'Hot season: its favourite weather — full sun, water only when fully dry.',
            summer: 'Rainy season is the danger: shelter from long rain, never let the pot stay soggy.',
            autumn: 'Late rains: keep sheltering; check the trunk base for soft spots.',
            winter: 'Cool season: grows on happily — water when dry, enjoy the compact growth.'
        }
    },
    {
        id: 'carmona',
        name: 'Fukien Tea',
        latin: 'Ehretia microphylla (syn. Carmona retusa)',
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'A tropical species with small white flowers and glossy dark leaves — outdoors year-round in this climate, where it flowers repeatedly. Sensitive to inconsistent watering; leaf drop is a signal to check the soil, not automatically a reason to water.',
        care: {
            watering: 'Keep slightly moist at all times; water when the surface begins drying. Never soggy, never bone dry — small pots can need daily checks in hot weather.',
            wateringIntervalDays: { spring: 2, summer: 2, autumn: 2, winter: 3 },
            fertilizing: 'Regular mild feeding; organic pellets are gentle on the fine roots.',
            fertilizingIntervalDays: { spring: 14, summer: 14, autumn: 14, winter: 21 },
            repotting: 'Every 2-3 years in warm active growth; handle the fine roots gently, no heavy root work on a weakened plant.',
            repotEveryYears: 2,
            pruning: 'Clip-and-grow; flowers appear on new shoots, so trim after a flowering flush.',
            sunlight: 'Very bright with morning sun; light protection in the fiercest afternoon heat.',
            temperature: 'Thrives in tropical warmth outdoors'
        },
        seasonalTips: {
            spring: 'Hot season: daily soil checks — drying out triggers leaf drop.',
            summer: 'Rainy season: good airflow against fungus; skip watering after soaking rain.',
            autumn: 'Late rains: strong growth — keep trimming after each flower flush.',
            winter: 'Cool season: still flowering; slightly less water.'
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

// New collection — August 2026 (see public/new_bonsai_plant_knowledge_aug_2026.md)
SPECIES.push(
    {
        id: 'chinese-fringe',
        name: 'Chinese Fringe Tree',
        latin: 'Chionanthus retusus Lindl. & Paxton',
        placement: 'outdoor',
        difficulty: 'advanced',
        leafType: 'broadleaf',
        evergreen: false,
        flowers: true,
        description:
            'Temperate deciduous tree from East Asia with white fringe-like spring flowers. Needs a seasonal cycle, so in a tropical climate it is a watchlist plant: dormancy may be inadequate and flowering unreliable. Not the same as Chinese Fringe Flower (Loropetalum).',
        care: {
            watering: 'Keep moist: water fully when the top 1-2 cm starts to feel slightly dry, never bone dry. Less in the leafless period, but never let roots desiccate.',
            wateringIntervalDays: { spring: 1, summer: 2, autumn: 2, winter: 2 },
            fertilizing: 'Balanced feed every 2-4 weeks in active growth; avoid nitrogen-heavy feeding just before flowering.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 21, winter: 30 },
            repotting: 'Every 2-3 years while young, in the coolest period just before bud burst.',
            repotEveryYears: 2,
            pruning: 'Structural work in dormancy or right after flowering — pruning before bloom removes the flower buds. Clip-and-grow for ramification.',
            sunlight: '4-6+ hours of direct sun; afternoon protection during extreme tropical heat.',
            temperature: 'Temperate (USDA 5-9); needs seasonal cooling — tropical fit low to medium'
        },
        seasonalTips: {
            spring: 'Hot season: shade the pot from extreme afternoon heat and check moisture daily.',
            summer: 'Rainy season: keep drainage perfect and airflow high against mildew.',
            autumn: 'Feed moderately and let it slow down naturally.',
            winter: 'Cool season is its rest: reduce water, do structural pruning.'
        }
    },
    {
        id: 'dragon-juniper',
        name: 'Dragon Juniper',
        latin: "Juniperus chinensis 'Kaizuka'",
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'scale',
        evergreen: true,
        flowers: false,
        description:
            '"Dragon Pine" — not a true pine but the twisting Kaizuka form of Chinese Juniper (Hollywood Juniper). Better heat tolerance than most temperate conifers, but still: outdoor full sun only, maximum root oxygen, never permanently wet.',
        care: {
            watering: 'Let the upper substrate clearly begin drying, then water to runoff. Overwatering is the main killer — a juniper can stay green for weeks after root damage.',
            wateringIntervalDays: { spring: 2, summer: 3, autumn: 3, winter: 3 },
            fertilizing: 'Balanced feed regularly but not excessively during active growth.',
            fertilizingIntervalDays: { spring: 21, summer: 30, autumn: 21, winter: 30 },
            repotting: 'Every 2-3 years while young; never bare-root the whole tree.',
            repotEveryYears: 2,
            pruning: 'No hedge-shearing, no pinching every tip: prune selectively to side shoots and NEVER strip a wanted branch of all green — bare juniper wood rarely back-buds.',
            sunlight: 'Outdoor full sun, 6+ hours — never a permanent indoor tree.',
            temperature: 'Temperate with useful heat tolerance; protect roots from pot heat'
        },
        seasonalTips: {
            spring: 'Hot season: shield the pot from overheating; do not compensate heat with wet soil.',
            summer: 'Rainy season is the danger zone: maximum airflow and drainage, watch for tip blight.',
            autumn: 'Prime wiring season — its twisting habit rewards bold but staged bends.',
            winter: 'Cool season rest; full sun all day.'
        }
    },
    {
        id: 'orange-jasmine',
        name: 'Orange Jasmine',
        latin: 'Murraya paniculata (L.) Jack',
        placement: 'outdoor',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'Tropical evergreen (Kamuning) with glossy compound leaves, intensely fragrant white flowers and red berries. Citrus family, excellent tropical fit and an excellent bonsai subject.',
        care: {
            watering: 'Let the upper 1-2 cm begin drying, then water thoroughly. No constant saturation, no severe drought, no surface-only splashes.',
            wateringIntervalDays: { spring: 1, summer: 2, autumn: 2, winter: 2 },
            fertilizing: 'Regular balanced or citrus-type feed with micronutrients during active growth.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 14, winter: 30 },
            repotting: 'Every 1-2 years while young and vigorous, in warm active growth.',
            repotEveryYears: 1,
            pruning: 'Clip-and-grow; if the fragrant flowers matter, prune right after a bloom instead of before one.',
            sunlight: 'Full sun to partial shade; several hours direct sun for compact growth and flowers.',
            temperature: 'Tropical/subtropical; protect from cold'
        },
        seasonalTips: {
            spring: 'Hot season: daily checks; recently repotted trees get afternoon protection.',
            summer: 'Rainy season: strong growth and repeat flowering — trim after each flush.',
            autumn: 'Keep feeding; check wire, branches thicken fast.',
            winter: 'Cool season: slightly less water, enjoy the fragrance.'
        }
    },
    {
        id: 'triangle-fig',
        name: 'Triangle Fig',
        latin: 'Ficus natalensis subsp. leprieurii (syn. F. triangularis)',
        placement: 'outdoor',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: false,
        description:
            'Tropical fig with unmistakable triangular leaves. Sold as Ficus triangularis; Kew places it under Ficus natalensis subsp. leprieurii. Can build aerial roots in humid warmth. Mind the milky latex when pruning.',
        care: {
            watering: 'Water when the upper layer feels slightly dry. Leaf drop after a move or root work is normal — check the soil before reaching for the watering can.',
            wateringIntervalDays: { spring: 1, summer: 2, autumn: 2, winter: 2 },
            fertilizing: 'Regular balanced feed; generous during trunk development.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 14, winter: 30 },
            repotting: 'Every 1-2 years while young, in warm active growth.',
            repotEveryYears: 1,
            pruning: 'Clip-and-grow back to 2-3 nodes. No routine full defoliation — selective leaf removal on strong trees only.',
            sunlight: 'Bright outdoor light with morning sun; several hours direct sun after acclimating.',
            temperature: 'Tropical; protect from prolonged cold'
        },
        seasonalTips: {
            spring: 'Hot season: fast-draining pots can dry in hours — check daily.',
            summer: 'Rainy season humidity can trigger aerial roots; keep them moist until they reach soil.',
            autumn: 'Strong growth: wire now but check often, Ficus swells around wire quickly.',
            winter: 'Cool season: growth eases; a good moment for structural choices.'
        }
    },
    {
        id: 'red-maple',
        name: 'Red Maple',
        latin: 'Acer rubrum L.',
        placement: 'outdoor',
        difficulty: 'advanced',
        leafType: 'broadleaf',
        evergreen: false,
        flowers: true,
        description:
            'True North American Red Maple — the highest climate risk in the collection for a hot tropical lowland: it needs real winter dormancy. ID note: if the leaves are deeply hand-like it may actually be a red Acer palmatum cultivar.',
        care: {
            watering: 'Keep the rootball moist during leaf growth — water before it dries out, daily checks in heat. Less when leafless, never desiccated.',
            wateringIntervalDays: { spring: 1, summer: 1, autumn: 2, winter: 2 },
            fertilizing: 'Moderate balanced feed in active growth; no excess nitrogen on refined trees.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 21, winter: null },
            repotting: 'Every 1-2 years while young, at bud swell in the coolest period.',
            repotEveryYears: 1,
            pruning: 'Structural work while dormant; thin bark scars easily, so sharp clean tools and gentle wire.',
            sunlight: 'Strong morning sun, afternoon shade in heat; keep the roots cool.',
            temperature: 'Temperate — needs dormancy; alkaline soil causes chlorosis (target pH 5.0-6.8)'
        },
        seasonalTips: {
            spring: 'Hot season: leaf scorch danger — morning sun only, roots shaded, water before it wilts.',
            summer: 'Rainy season: drainage and airflow against fungus; do not confuse heat-induced leaf loss with dormancy.',
            autumn: 'Hope for colour; reduce feeding as it slows.',
            winter: 'Cool season is its only rest here — the cooler the spot, the better.'
        }
    },
    {
        id: 'ixora',
        name: 'Ixora (Dok Khem)',
        latin: 'Ixora coccinea L.',
        placement: 'outdoor',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'Thai ดอกเข็ม — a wet-tropical shrub native to Thailand with dense clusters of tubular flowers. Key care point: it insists on acidic, airy soil; alkaline water or substrate causes chlorosis.',
        care: {
            watering: 'Water when the upper 1-2 cm begins drying; no complete drought, no waterlogging.',
            wateringIntervalDays: { spring: 1, summer: 2, autumn: 2, winter: 2 },
            fertilizing: 'Balanced feed with micronutrients; use acid-loving fertilizer if leaves yellow with green veins.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 14, winter: 30 },
            repotting: 'Every 1-2 years while young in warm active growth; no aggressive bare-rooting.',
            repotEveryYears: 1,
            pruning: 'Flowers form on shoot tips, so hard pruning removes them: prune after a flowering flush, then let selected tips mature.',
            sunlight: 'Full sun after acclimating gives the best flowering; light shade in the fiercest afternoon heat.',
            temperature: 'Wet tropical; keep soil acidic (pH 5.0-6.5)'
        },
        seasonalTips: {
            spring: 'Hot season: full sun but daily water checks for nonstop flowering.',
            summer: 'Rainy season: airflow against leaf spot; check soil pH if leaves yellow.',
            autumn: 'Trim after each flower flush to keep the crown dense.',
            winter: 'Cool season: still flowering — keep it in the sun.'
        }
    },
    {
        id: 'loropetalum',
        name: 'Chinese Fringe Flower',
        latin: 'Loropetalum chinense',
        placement: 'outdoor',
        difficulty: 'beginner',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'Evergreen witch-hazel relative with purple-bronze foliage and pink ribbon-like fringe flowers — the exact plant the knowledge pack warned not to confuse with Chionanthus retusus. Far better suited to warm climates than the true Fringe Tree: no winter dormancy required.',
        care: {
            watering: 'Keep evenly moist but never soggy: water when the top 1-2 cm begins to dry, then soak and drain.',
            wateringIntervalDays: { spring: 1, summer: 2, autumn: 2, winter: 2 },
            fertilizing: 'Balanced feed during active growth; it colours and flowers best with steady, moderate nutrition.',
            fertilizingIntervalDays: { spring: 14, summer: 21, autumn: 21, winter: 30 },
            repotting: 'Every 1-2 years while young, in warm active growth; it prefers acidic, well-draining soil.',
            repotEveryYears: 2,
            pruning: 'Clip-and-grow right after a flowering flush — it blooms on shoot tips, so hard pruning before bloom removes the show.',
            sunlight: 'Full sun to light shade; the purple foliage colours deepest with several hours of direct sun.',
            temperature: 'Warm-climate tolerant; acidic soil (like Ixora) keeps the foliage rich'
        },
        seasonalTips: {
            spring: 'Hot season: main flowering flush — water checks daily, prune after the show.',
            summer: 'Rainy season: good drainage and airflow; foliage may green up with less sun.',
            autumn: 'Late rains: steady growth — keep trimming for density.',
            winter: 'Cool season: often a second flowering flush; enjoy the contrast of purple leaf and pink bloom.'
        }
    },
    {
        id: 'lemon-cypress',
        name: 'Lemon Cypress (Son Hom)',
        latin: "Cupressus macrocarpa 'Goldcrest'",
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'scale',
        evergreen: true,
        flowers: false,
        description:
            'Thai สนหอม — a lemon-scented golden conifer sold as a mosquito repeller (the scent is real, the repelling mostly marketing). A cool-coast native that manages in the tropics with airflow and restraint on water; soggy soil is what kills it.',
        care: {
            watering: 'Let the top layer clearly begin drying before watering, then soak and drain fully. Never leave it constantly wet — root rot is its number one killer.',
            wateringIntervalDays: { spring: 2, summer: 3, autumn: 3, winter: 3 },
            fertilizing: 'Light, regular feeding during active growth; overfeeding coarsens the fine foliage.',
            fertilizingIntervalDays: { spring: 30, summer: 30, autumn: 30, winter: 30 },
            repotting: 'Every 2-3 years in very free-draining mix; disturb the roots as little as possible.',
            repotEveryYears: 2,
            pruning: 'Pinch and scissor-trim green shoots only — never cut into bare wood, it does not back-bud there. Keep some green on every branch.',
            sunlight: 'Full sun to very bright; the golden colour fades in shade.',
            temperature: 'Cool-coast species: airflow and cool nights help; shelter from pounding rain'
        },
        seasonalTips: {
            spring: 'Hot season: shade the pot itself and check moisture daily — but only water once the top dries.',
            summer: 'Rainy season is the danger: maximum drainage, shelter from days of rain, watch for browning tips.',
            autumn: 'Late rains: keep the air moving; trim lightly to keep the cone dense.',
            winter: 'Cool season: its best months here — full sun and steady light trimming.'
        }
    },
    {
        id: 'khasi-pine',
        name: 'Khasi Pine (Son Sam Bai)',
        latin: 'Pinus kesiya',
        placement: 'outdoor',
        difficulty: 'advanced',
        leafType: 'needle',
        evergreen: true,
        flowers: false,
        description:
            'Thai สนสามใบ, the three-needle pine that grows wild on the mountains around Chiang Mai — a native conifer, so the climate fits better than any imported pine. Classic bonsai material with real pine bark and candle growth, but slow: a long-term project from seedling.',
        care: {
            watering: 'On the dry side: let the surface dry between waterings, then water thoroughly. Pines prefer slightly dry over wet, and mountain natives insist on drainage.',
            wateringIntervalDays: { spring: 2, summer: 3, autumn: 3, winter: 3 },
            fertilizing: 'Feed steadily through active growth to build the seedling; keep mycorrhiza happy with organic fertilizer.',
            fertilizingIntervalDays: { spring: 21, summer: 30, autumn: 21, winter: 30 },
            repotting: 'Every 2-3 years, keeping part of the old root ball and its mycorrhiza intact — never bare-root a pine.',
            repotEveryYears: 2,
            pruning: 'Seedling years: let it run and thicken. Later: shorten candles in the hot season and pull old needles; never leave a branch needle-less.',
            sunlight: 'Full sun all day — it grows on exposed mountain slopes.',
            temperature: 'Native to Thai highlands; loves sun, tolerates the lowlands with airflow'
        },
        seasonalTips: {
            spring: 'Hot season: candle growth — the moment to shorten candles on developed trees; seedlings just grow.',
            summer: 'Rainy season: perfect drainage and full sun between showers; watch for fungus on needles.',
            autumn: 'Late rains: wire young flexible shoots; growth slows toward the cool season.',
            winter: 'Cool season: its mountain weather — full sun, light water, plan next year.'
        }
    },
    {
        id: 'sweet-orange',
        name: 'Sweet Orange',
        latin: 'Citrus × sinensis (L.) Osbeck',
        placement: 'outdoor',
        difficulty: 'intermediate',
        leafType: 'broadleaf',
        evergreen: true,
        flowers: true,
        description:
            'Evergreen citrus with fragrant white flowers and orange fruit; often grafted. A heavy feeder that wants full sun. ID note: small fruit could mean calamondin, mandarin or kumquat instead.',
        care: {
            watering: 'Water deeply when the upper layer begins to dry while the core still holds moisture. Never standing water, never repeatedly bone dry.',
            wateringIntervalDays: { spring: 1, summer: 2, autumn: 2, winter: 2 },
            fertilizing: 'Heavy feeder: complete citrus fertilizer with magnesium, iron, manganese and zinc, regularly through active growth.',
            fertilizingIntervalDays: { spring: 14, summer: 14, autumn: 14, winter: 30 },
            repotting: 'Every 2-3 years in warm active growth; citrus hates suffocated roots.',
            repotEveryYears: 2,
            pruning: 'Remove rootstock suckers below the graft, dead wood and crossing branches; clip-and-grow for refinement. Thin excess fruit on young trees.',
            sunlight: 'Full sun, 6-8+ hours.',
            temperature: 'Subtropical/tropical; dislikes frost'
        },
        seasonalTips: {
            spring: 'Hot season: daily water checks; blossom time — enjoy the fragrance.',
            summer: 'Rainy season: watch for root rot and leafminer damage on fresh flushes.',
            autumn: 'Fruit development pulls energy — feed completely, thin if the tree is young.',
            winter: 'Cool season: fruit colours up; slightly less water.'
        }
    }
);

export const speciesById = (id: string): Species | undefined => SPECIES.find((s) => s.id === id);

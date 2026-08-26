# Fertilizer Schedule & App Logic

## Products

### Multitech Slow-Release 16-16-16
- **Type:** main NPK fertilizer
- **Purpose:** normal feeding for rooted, healthy, actively growing plants
- **Do not use:** on unrooted cuttings, immediately after major root pruning, or on severely stressed plants

### Nic-Spray EDTA Micronutrients
- **Type:** chelated trace elements
- **Purpose:** supplemental Fe, Mn, Zn, Cu, B, Mo and related micronutrients
- **Normal role:** supplement to 16-16-16, not a replacement for NPK

### BStart Root Booster
- **Type:** root-support / transplant-support product
- **Purpose:** use around repotting, transplanting, root disturbance and newly rooted cuttings
- **Normal role:** event-based support, not routine fertilizer

> **Dosage rule:** exact grams/ml must always follow the product label.  
> The app should manage **timing and conditions**, not invent dosage if label data has not been entered.

---

# Core states

Use these plant states:

- `ACTIVE_GROWTH`
- `SLOW_GROWTH`
- `DORMANT`
- `ESTABLISHED`
- `UNROOTED_CUTTING`
- `NEWLY_ROOTED_CUTTING`
- `RECENTLY_REPOTTED_LIGHT`
- `RECENTLY_REPOTTED_MODERATE`
- `RECENTLY_REPOTTED_HEAVY`
- `ROOT_STRESSED`
- `SICK_OR_STRESSED`
- `FLOWERING`
- `FRUITING`

---

# Universal rules

## Healthy + rooted + actively growing

If:
- healthy
- rooted
- established
- active growth
- no recent major root work

Then:
- **Multitech 16-16-16:** ON
- **Micronutrients:** every **4–6 weeks**
- **BStart:** OFF / not routinely needed

---

## Light repot

Definition:
- rootball mostly intact
- little or no root pruning
- mostly moved into fresh soil / new pot

### Day 0
- water thoroughly
- BStart may be used according to label
- no extra liquid fertilizer

### Day 7–14
If plant is healthy:
- resume 16-16-16
- resume micronutrients around day 14

---

## Moderate repot

Definition:
- roughly 20–40% root pruning
- meaningful root disturbance

### Day 0
- water thoroughly
- BStart may be used according to label
- pause 16-16-16
- pause micronutrients

### Day 14–21
If recovery is visible:
- restart 16-16-16 conservatively
- restart micronutrients

If not recovering:
- continue pause
- diagnose roots/watering/light first

---

## Heavy repot

Definition:
- >40% root pruning
- major rootball reduction
- heavy root disturbance / partial bare-rooting

### Day 0
- water thoroughly
- BStart may be used according to label
- **NO 16-16-16**
- **NO micronutrients**

### Days 1–21
- recovery only
- no normal fertilizer

### Around Day 21–28
Resume only if:
- healthy new growth appears
- leaves are firm
- roots are functioning
- soil drains normally

Then:
- restart 16-16-16 lightly
- resume micronutrients after recovery is established

---

# Root stress / root damage

If:
- root rot was treated
- major dehydration damaged roots
- roots were broken/damaged
- plant is wilting despite wet soil

Then:
- pause 16-16-16
- pause micronutrients
- BStart only if appropriate according to label
- resume normal feeding only after clear healthy recovery

**Fertilizer does not cure root rot.**

---

# Cuttings

## Unrooted cutting

State: `UNROOTED_CUTTING`

- 16-16-16: **NO**
- micronutrients: **NO**
- BStart: only if product label allows use on cuttings

Priority:
- rooting
- moisture control
- airflow
- correct light
- correct temperature

## Newly rooted cutting

State: `NEWLY_ROOTED_CUTTING`

When roots are confirmed and new growth is sustained:

### First 2–3 weeks
- begin nutrition lightly
- avoid heavy slow-release fertilizer directly against new roots
- micronutrients optional, not urgent

### Once established
- move to normal species fertilizer profile

---

# Sick or stressed plant

If status = `SICK_OR_STRESSED`

Examples:
- sudden leaf drop
- heat damage
- root rot
- severe pest attack
- major dehydration
- fungal disease

Then:
- pause automatic fertilizer reminders
- show: **“Resolve plant stress before fertilizing.”**
- resume only once healthy active growth returns

---

# Multitech 16-16-16 schedule

## Normal use

Use during:
- active vegetative growth
- trunk development
- branch development
- established root development

## App logic

Do not create weekly reminders.

Instead use:

`CHECK_SLOW_RELEASE_FERTILIZER`

The actual replacement interval must come from the product label.

```yaml
fertilizer:
  name: Multitech 16-16-16
  type: slow_release_npk
  npk: 16-16-16
  dosage_source: product_label
  application_interval_source: product_label
  require_active_growth: true
  prohibited_for_unrooted_cuttings: true
  pause_after_light_repot_days: 7
  pause_after_moderate_repot_days: 14
  pause_after_heavy_repot_days: 21
```

---

# Micronutrient schedule

## Nic-Spray EDTA

### Established healthy plants
Use approximately every **28–42 days**.

### Especially useful for
- Citrus / Orange
- Dok Khem / Ixora
- Red Maple
- Orange Jasmine
- Ficus
- Fukien Tea

### Deficiency logic

If app records:
- pale new leaves
- interveinal chlorosis
- persistent yellowing
- known high-pH water/substrate

Then show:

**“Check pH and root health before increasing micronutrients.”**

Do not use micronutrients to mask:
- root rot
- overwatering
- strongly alkaline substrate

```yaml
micronutrients:
  name: Nic-Spray EDTA
  type: chelated_trace_elements
  normal_interval_days_min: 28
  normal_interval_days_max: 42
  dosage_source: product_label
  require_established_roots: true
  pause_after_light_repot_days: 14
  pause_after_moderate_repot_days: 14
  pause_after_heavy_repot_days: 21
```

---

# BStart schedule

Treat BStart as **event-based**, not calendar-based.

## Trigger events
- `REPOTTED`
- `TRANSPLANTED`
- `ROOT_PRUNED`
- `NEWLY_ROOTED_CUTTING`
- `ROOT_STRESS_RECOVERY`

## Established healthy plant
No routine BStart reminder.

```yaml
root_booster:
  name: BStart
  type: root_support
  dosage_source: product_label
  routine_use: false
  triggers:
    - repot
    - transplant
    - root_pruning
    - newly_rooted_cutting
    - root_stress_recovery
```

---

# Species-specific fertilizer intensity

## Regular / stronger feeders

### Sweet Orange / Citrus
- 16-16-16: regular
- micronutrients: **important**
- BStart: after root disturbance
- important nutrients: Fe, Mg, Mn, Zn

### Orange Jasmine
- 16-16-16: regular
- micronutrients: useful
- BStart: after repotting

### Triangle Fig
- 16-16-16: regular during active growth
- micronutrients: useful
- BStart: after repotting

### Golden Spoon Ficus
- 16-16-16: regular during development
- micronutrients: useful
- BStart: after repotting

---

## Medium feeders

### Fukien Tea
- 16-16-16: moderate
- micronutrients: useful
- BStart: after root disturbance
- pause feeding if stressed / dropping leaves

### Vietnamese Blue Bell
- 16-16-16: moderate
- micronutrients: useful
- BStart: after repotting

### Wood Apple / Feroniella lucida
- 16-16-16: moderate
- micronutrients: useful
- BStart: after repotting

### Dok Khem / Ixora
- 16-16-16: moderate
- micronutrients: **important**
- BStart: after root disturbance
- check soil/water pH if leaves yellow

### Chinese Fringe Tree
- 16-16-16: moderate during active growth
- micronutrients: occasional
- stop/reduce during dormancy

---

## Conservative feeders

### Creeping Juniper
- 16-16-16: light to moderate
- micronutrients: occasional
- BStart: mainly after root work
- avoid heavy fertilizer on weak roots

### Dragon Juniper
- 16-16-16: light to moderate
- micronutrients: occasional
- BStart: mainly after root work

### Dwarf Jade
- 16-16-16: light
- micronutrients: occasional
- BStart: rarely needed
- overwatering is a bigger risk than underfeeding

### Red Maple
- 16-16-16: moderate during active growth
- reduce during refinement
- stop during genuine dormancy
- micronutrients useful when deficiency/pH indicates need

---

# Cutting profiles

## Tamarind cuttings

### Unrooted
- 16-16-16: NO
- micronutrients: NO
- BStart: label-dependent

### Newly rooted
- begin light nutrition only after sustained new growth
- gradually transition to normal Tamarind feeding

## Dwarf Jade cuttings

### Unrooted
- 16-16-16: NO
- micronutrients: NO
- BStart: generally unnecessary

### Rooted
- wait for active growth
- then use very light feeding

## Vietnamese Blue Bell cuttings

### Unrooted
- 16-16-16: NO
- micronutrients: NO
- BStart: label-dependent

### Rooted
- start weak feeding after stable new growth
- gradually transition to normal Blue Bell feeding

---

# Seasonal logic

## Tropical evergreens

Examples:
- Golden Spoon Ficus
- Triangle Fig
- Fukien Tea
- Dwarf Jade
- Orange Jasmine
- Dok Khem
- Vietnamese Blue Bell
- Citrus
- Wood Apple

In Thailand, use **active growth detection** instead of a simple spring/summer calendar.

If:
- new leaves/shoots are appearing
- plant is healthy

Then:
- normal fertilizer can remain active

If growth slows due to:
- extreme heat
- root stress
- prolonged saturation
- disease

Then:
- reduce or pause feeding

---

## Temperate species

Examples:
- Red Maple
- Chinese Fringe Tree
- Creeping Juniper
- Dragon Juniper

During genuine dormancy / strong seasonal slowdown:
- reduce or stop 16-16-16
- pause routine micronutrients
- resume with active growth

---

# Flowering logic

Relevant:
- Dok Khem
- Orange Jasmine
- Vietnamese Blue Bell
- Chinese Fringe Tree
- Fukien Tea

Do not stop balanced nutrition merely because the plant is flowering.

Do **not** automatically switch to high-phosphorus fertilizer.

Healthy roots + balanced nutrition are more important.

---

# Fruiting logic

## Citrus / Orange

During fruiting:
- continue normal nutrition
- continue micronutrients
- avoid excessive fruit load on small/weak tree

## Ficus / Orange Jasmine / Fukien Tea

Do not let weak young plants carry excessive fruit.

---

# Repot event workflow

When user logs:

`Plant repotted today`

App asks:

## Question 1
**How much root pruning?**
- none
- light (<20%)
- moderate (20–40%)
- heavy (>40%)

## Question 2
**How disturbed was the rootball?**
- intact
- partially disturbed
- heavily disturbed / bare-rooted

## Decision logic

### None / light disturbance
- BStart: today if label permits
- 16-16-16 resume: **7–14 days**
- micronutrients resume: **~14 days**

### Moderate disturbance
- BStart: today if label permits
- 16-16-16 pause: **14–21 days**
- micronutrients pause: **14–21 days**
- require visible recovery before resuming

### Heavy disturbance
- BStart: today if label permits
- 16-16-16 pause: **21–28 days**
- micronutrients pause: **~21 days**
- require healthy new growth before resuming

---

# Recovery checklist before restarting fertilizer

- [ ] New leaves or shoots appearing
- [ ] Existing leaves firm
- [ ] No major wilting
- [ ] Soil drains normally
- [ ] No sour/root-rot smell
- [ ] Plant appears to be taking up water normally

If most answers are **no**:
- do not restart fertilizer yet

---

# Newly purchased plant logic

For the first **7–14 days**:

Do not automatically add 16-16-16.

Ask:

**“Are fertilizer pellets already visible in the nursery pot?”**

If:
- yes → wait
- unknown → wait and acclimate
- no + plant healthy → begin normal feeding after acclimation

This prevents accidental double fertilization.

---

# Fertilizer burn logic

Possible signs:
- brown leaf tips
- sudden edge burn
- white salt crust
- wilt despite wet soil
- root injury after fertilizing

If suspected:

1. pause all fertilizer
2. flush substrate thoroughly with clean water if drainage is good
3. remove obvious excess pellets if practical
4. do not add BStart or micronutrients as a “cure”
5. monitor recovery

---

# Decision engine

```yaml
fertilizer_engine:

  unrooted_cutting:
    npk_16_16_16: false
    micronutrients: false
    bstart: product_label_dependent

  newly_rooted_cutting:
    npk_16_16_16: light_after_active_growth
    micronutrients: later
    bstart: optional

  healthy_active_established:
    npk_16_16_16: true
    micronutrients_every_days: 28-42
    bstart: false

  light_repot:
    bstart: optional_day_0
    npk_resume_days: 7-14
    micronutrients_resume_days: 14

  moderate_repot:
    bstart: optional_day_0
    npk_resume_days: 14-21
    micronutrients_resume_days: 14-21
    require_recovery: true

  heavy_repot:
    bstart: optional_day_0
    npk_resume_days: 21-28
    micronutrients_resume_days: 21
    require_new_growth: true

  sick_or_stressed:
    pause_npk: true
    pause_micronutrients: true
    diagnose_before_feeding: true

  dormant:
    npk: false
    routine_micronutrients: false

  fertilizer_burn_suspected:
    pause_all_fertilizer: true
    flush_if_drainage_good: true
```

---

# Simple reminder summary

## Multitech 16-16-16
**Use when:** healthy + rooted + actively growing  
**Pause when:** fresh cutting, recent major repot, sick/stressed, genuine dormancy

## Nic-Spray EDTA
**Use when:** established + actively growing  
**Normal interval:** every 4–6 weeks  
**Most important for:** Citrus, Ixora, Maple, Ficus, Orange Jasmine

## BStart
**Use when:** repotting, transplanting, root pruning, root recovery, newly rooted cutting  
**Do not use as:** routine monthly fertilizer

---

# Product-label fields the app still needs

The app should store:

- Multitech exact release duration
- Multitech dose by pot size
- Nic-Spray exact dilution
- Nic-Spray application method
- BStart exact dilution
- BStart maximum frequency

Until those values are entered, show:

**“Use manufacturer label dosage.”**

Never invent an exact fertilizer dose from the product name alone.

---

# Product-label data — ENTERED (26 Aug 2026)

## Multitech Slow-Release 16-16-16

- **Release duration:** 4 months (120 days) — implemented as the app's top-up cycle
- **Packaging:** 1,000 g resealable bag
- **Dose by pot size:**
  - 5-inch pot: 3-4 g
  - 10-inch pot: 6-8 g
- **Application:** at the bottom of the pot or sprinkled on the soil surface, every 4 months or per plant health
- **Note:** for cacti/succulent-style plants use at least 50% less than indicated (relevant for Dwarf Jade)

Still to be entered: Nic-Spray exact dilution and application method; BStart exact dilution and maximum frequency.

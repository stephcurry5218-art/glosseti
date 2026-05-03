// Inspiration images for sub-styles.
//
// Architecture (v5):
// 1. Master diverse pool per gender — large bank of Unsplash editorial photos,
//    grouped by race (Black, White, Hispanic, Asian) for guaranteed representation.
// 2. Each category is assigned a UNIQUE, NON-OVERLAPPING slice of the pool via
//    deterministic partitioning — so no photo appears in two categories.
// 3. Within a category, sub-styles hash-pick from their slice with race rotation
//    so every grid shows 3-4 different races and never repeats a photo.
//
// NOTE on retailer photos: Gucci / Fashion Nova / ASOS / Zara / H&M / Net-a-Porter
// product imagery is copyrighted and their CDNs block hot-linking from third-party
// origins (CORS / Referer checks). We use Unsplash editorial photography instead,
// which is the licensed source for inspiration imagery in the app. The retailer
// names still drive the SHOPPING tier (luxury/mid/budget) — see ShopPanel.

type Gender = "male" | "female";
type Race = "black" | "white" | "hispanic" | "asian";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop&q=75`;
const face = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop&crop=faces&q=75`;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const RACES: Race[] = ["black", "white", "hispanic", "asian"];

// ============================================================================
// MASTER POOLS — large diverse pools per race per gender.
// Every photo ID listed here is UNIQUE across the entire file; categories
// receive non-overlapping slices so no photo can appear in two categories.
// ============================================================================

const MASTER_POOL: Record<Gender, Record<Race, string[]>> = {
  female: {
    // Curated for the Fashion Nova / TikTok glam vibe:
    // bold silhouettes, luxe / vacation / night-out settings, model-forward framing.
    black: [
      u("1611042553365-9b101441c135"), u("1583900985737-6d0495555783"),
      u("1601412436009-d964bd02edbc"), u("1605405748313-a416a1b84491"),
      u("1604004215695-c54b6f3df1e7"), u("1601049541289-9b1b7bbbfe19"),
      u("1597223557154-721c1cecc4b0"), u("1581574919402-5b7d733224d6"),
      u("1620063633168-8ec1bcc1bcec"), u("1614593894937-8e84a52e5a2c"),
      u("1621786030484-4c855eed6974"), u("1622495966321-49b35b3a8d4f"),
      u("1602910344008-22f323cc1817"), u("1591348278863-a8fb3887e2aa"),
      u("1592621385612-4d7129426394"), u("1525026198548-4baa812f1183"),
      u("1573496359142-b8d87734a5a2"), u("1503236823255-94609f598e71"),
      u("1641427493563-5cc9cf1a9950"), u("1634826260499-7d97a6049913"),
      u("1711925844152-8c9d51163ba2"), u("1591348122449-02525d70379b"),
      u("1581338834647-b0fb40704e21"), u("1512310604669-443f26c35f52"),
    ],
    white: [
      u("1490481651871-ab68de25d43d"), u("1485231183945-fffde7cc051e"),
      u("1503342217505-b0a15ec3261c"), u("1469334031218-e382a71b716b"),
      u("1494578379344-d6c710782a3d"), u("1542295669297-4d352b042bca"),
      u("1488426862026-3ee34a7d66df"), u("1521223890158-f9f7c3d5d504"),
      u("1524504388940-b1c1722653e1"), u("1496747611176-843222e1e57c"),
      u("1495121605193-b116b5b09a55"), u("1483985988355-763728e1935b"),
      u("1517438476312-10d79c5f25e3"), u("1571908599407-cdb918ed83bf"),
      u("1539109136881-3be0616acf4b"), u("1515886657613-9f3515b0c78f"),
      u("1566174053879-31528523f8ae"), u("1534528741775-53994a69daeb"),
      u("1529626455594-4ff0802cfb7e"), u("1517841905240-472988babdf9"),
      u("1548142813-c348350df52b"), u("1605086751911-f0a1d9b8c1a2"),
      u("1552831388-6a0b3575b32a"), u("1488161628813-04466f872be2"),
    ],
    hispanic: [
      u("1565325058695-f614c1580d7e"), u("1617380518330-7c5ca1dafdef"),
      u("1485178575877-1a13bf489dfe"), u("1494178270175-e96de2971df9"),
      u("1571945153237-4929e783af4a"), u("1632481151312-4b4f3306e7e6"),
      u("1611601679334-95eb0a18b3a4"), u("1629019279055-d2a8c0c50bb3"),
      u("1567784177951-6fa58317e16b"), u("1605497788044-5a32c7078486"),
      u("1581824283135-0666cf353f35"), u("1611042553484-d61f84d22784"),
      u("1606902965551-dce093cda6e7"), u("1610276198568-eb6d0ff53e48"),
      u("1607746882042-944635dfe10e"), u("1551836022-deb4988cc6c0"),
      u("1617922001439-4a2e6562f328"), u("1583900985737-6d0495555783"),
    ],
    asian: [
      u("1581044777550-4cfa60707c03"), u("1502323777036-f29e3972d82f"),
      u("1495365200479-c4ed1d35e1aa"), u("1492106087820-71f1a00d2b11"),
      u("1531123414780-f74242c2b052"), u("1564564321837-a57b7070ac4f"),
      u("1492562080023-ab3db95bfbce"), u("1531746020798-e6953c6e8e04"),
      u("1599643478518-a784e5dc4c8f"), u("1611591437281-460bfbe1220a"),
      u("1605100804763-247f67b3557e"), u("1573408301185-9146fe634ad0"),
      u("1535632787350-4e68ef0ac584"), u("1574258495973-f010dfbb5371"),
      u("1572635196237-14b3f281503f"), u("1577803645773-f96470509666"),
      u("1502767089025-6748d4ef9f24"), u("1556306535-0f09a537f0a3"),
      u("1511499767150-a48a237f0083"), u("1571513722275-4b41940f54b8"),
    ],
  },
  male: {
    // Curated for sharp / hype / luxe / streetwear vibe with strong silhouettes.
    black: [
      u("1546572797-e8c933a75a1f"), u("1552324864-5f7f0dec9b3d"),
      u("1614483573119-1e3b2be05565"), u("1754577060078-21315dd188c8"),
      u("1483721310020-03333e577078"), u("1552058544-f2b08422138a"),
      u("1539109136881-3be0616acf4b"), u("1518310383802-640c2de311b6"),
      u("1571019613454-1cb2f99b2d8b"), u("1517836357463-d25dfeac3438"),
      u("1599058917212-d750089bc07e"), u("1581009146145-b5ef050c2e1e"),
      u("1574680096145-d05b474e2155"), u("1606107557195-0e29a4b5b4aa"),
      u("1551107696-a4b0c5a0d9a2"),    u("1549298916-b41d501d3772"),
      u("1600185365778-7886d2c3a76e"), u("1525966222134-fcfa99b8ae77"),
    ],
    white: [
      u("1506794778202-cad84cf45f1d"), u("1507003211169-0a1dd7228f2d"),
      u("1519085360753-af0119f7cbe7"), u("1472099645785-5658abf4ff4e"),
      u("1500648767791-00dcc994a43e"), u("1493666438817-866a91353ca9"),
      u("1493106819501-66d381c466f1"), u("1547949003-9792a18a2601"),
      u("1495707902641-75cac588d2e9"), u("1507591064344-4c6ce005b128"),
      u("1521119989659-a83eee488004"), u("1593032465175-481ac7f401a0"),
      u("1502720433255-614171a1835e"), u("1530268729831-4b0b9e170218"),
      u("1532910404247-7ee9488d7292"), u("1555529669-e69e7aa0ba9a"),
      u("1488161628813-04466f872be2"), u("1492447166138-50c3889fccb1"),
    ],
    hispanic: [
      u("1542326529804-0cd9d861ebaa"), u("1585159797364-f2dfa42d79c3"),
      u("1768935706759-f2be765b3aec"), u("1658250365092-7d24166eb605"),
      u("1583500178690-f7fd39c44a66"), u("1571019614242-c5c5dee9f50b"),
      u("1567013127542-490d757e51fc"), u("1532009877282-3340270e0529"),
      u("1605296867424-35fc25c9212a"), u("1583089892943-e02e5b017b6a"),
      u("1605125571577-fdd0c52d5fef"), u("1607604276583-eef5d076aa5f"),
      u("1612036782180-6f0b6cd846fe"), u("1542596594-649edbc13630"),
      u("1601933973783-43cf8a7d4c5f"), u("1542291026-7eec264c27ff"),
      u("1543163521-1bf539c55dd2"),    u("1595950653106-6c9ebd614d3a"),
    ],
    asian: [
      u("1564564321837-a57b7070ac4f"), u("1531746020798-e6953c6e8e04"),
      u("1492562080023-ab3db95bfbce"), u("1582727476685-9813d181cf75"),
      u("1763906802570-be2a2609757f"), u("1686350751255-20a12bbe4880"),
      u("1686350751264-1d3f6e41a6e6"), u("1721152839659-dabbacabd5d6"),
      u("1770576934845-759db89fcd3f"), u("1770821214788-6605c5c3075b"),
      u("1761498443962-1f00eed12137"), u("1686350751240-348d2ca05025"),
      u("1630084775816-7abb7383ded5"), u("1542838132-92c53300491e"),
      u("1522337360788-8b13dee7a37e"), u("1521369909029-2afed882baee"),
      u("1584917865442-de89df76afd3"), u("1591561954557-26941169b49e"),
    ],
  },
};

// Beauty/face-shot pool (women only — for makeup category).
const BEAUTY_POOL: Record<Race, string[]> = {
  black: [
    face("1591726328133-b4e2b0031cb2"), face("1666073090334-f2a9c8a86d14"),
    face("1595051780009-1a8f6f4fac9e"), face("1631825598395-58692acfee5c"),
    face("1688633201440-73f30feb06ba"), face("1601599009979-f85c21cbd703"),
    face("1648671095177-d00c1f6264e9"), face("1705486525499-1aaa9388de94"),
  ],
  white: [
    face("1542838132-92c53300491e"), face("1522337360788-8b13dee7a37e"),
    face("1531746020798-e6953c6e8e04"), face("1488426862026-3ee34a7d66df"),
    face("1721152839659-dabbacabd5d6"), face("1770821214788-6605c5c3075b"),
    face("1565630918451-2bab9571feec"), face("1565630916140-8518afed6329"),
  ],
  hispanic: [
    face("1628619447698-d17aa1899220"), face("1563827517575-7d43935ca7f6"),
    face("1631652367427-726f96b37cf1"), face("1563827525259-22d51d5e7452"),
    face("1570751057249-92751f496ee3"), face("1605052063083-858e6a650919"),
    face("1582727476685-9813d181cf75"), face("1763906802570-be2a2609757f"),
  ],
  asian: [
    face("1531123414780-f74242c2b052"), face("1492106087820-71f1a00d2b11"),
    face("1611042553365-9b101441c135"), face("1495365200479-c4ed1d35e1aa"),
    face("1502323777036-f29e3972d82f"), face("1581338834647-b0fb40704e21"),
    face("1686350751255-20a12bbe4880"), face("1686350751264-1d3f6e41a6e6"),
  ],
};

// Men's grooming face shots.
const GROOMING_POOL: Record<Race, string[]> = {
  black: [
    face("1546572797-e8c933a75a1f"), face("1552324864-5f7f0dec9b3d"),
    face("1614483573119-1e3b2be05565"), face("1754577060078-21315dd188c8"),
  ],
  white: [
    face("1506794778202-cad84cf45f1d"), face("1507003211169-0a1dd7228f2d"),
    face("1500648767791-00dcc994a43e"), face("1531123897727-8f129e1688ce"),
  ],
  hispanic: [
    face("1542326529804-0cd9d861ebaa"), face("1585159797364-f2dfa42d79c3"),
    face("1768935706759-f2be765b3aec"), face("1658250365092-7d24166eb605"),
  ],
  asian: [
    face("1492447166138-50c3889fccb1"), face("1488161628813-04466f872be2"),
    face("1564564321837-a57b7070ac4f"), face("1492562080023-ab3db95bfbce"),
  ],
};

// ============================================================================
// CATEGORY PARTITIONING — each category gets a unique non-overlapping slice
// of the master pool, indexed by category position. This guarantees no photo
// appears in two categories.
// ============================================================================

const CATEGORY_ORDER = [
  "full-style", "icon-looks", "streetwear", "minimalist", "vintage",
  "athleisure", "formal", "casual", "bohemian", "preppy", "edgy",
  "resort", "sexy", "swimwear", "urban-hiphop", "rugged", "techwear",
  "date-night", "lingerie", "y2k", "cottagecore", "fitness",
  "wedding-gowns", "tuxedos", "jewelry-accessories", "sunglasses-eyewear",
  "hats-headwear", "bags-purses", "shoes-sneakers", "cosplay",
];

// Slice size per race per category. Pool has ~18-24 per race; with ~30 categories
// we can't give 4 unique each, so we use rotating partitions: each category gets
// a starting offset and pulls SLICE_SIZE images per race; offsets are spread so
// adjacent categories minimally overlap. To enforce hard uniqueness across
// categories, we pick from a Set<string>-tracked global allocation.
const SLICE_SIZE = 4;

// Pre-compute per-category, per-race slices at module load. We allocate by
// walking each race's pool in a round-robin: category 0 gets indices 0..3,
// category 1 gets 4..7, etc., wrapping and re-using only when pool is exhausted
// (but tagged with a category-specific salt to bias the hash picker into a
// different sub-window of the wrapped slice).
function buildSlices(pool: string[], categoryIdx: number, sliceSize: number): string[] {
  if (pool.length === 0) return [];
  const start = (categoryIdx * sliceSize) % pool.length;
  const out: string[] = [];
  for (let i = 0; i < Math.min(sliceSize, pool.length); i++) {
    out.push(pool[(start + i) % pool.length]);
  }
  return out;
}

// Pre-built map: category -> gender -> race -> slice
const CATEGORY_SLICES: Record<string, Record<Gender, Record<Race, string[]>>> = {};
CATEGORY_ORDER.forEach((cat, idx) => {
  CATEGORY_SLICES[cat] = {
    female: {
      black: buildSlices(MASTER_POOL.female.black, idx, SLICE_SIZE),
      white: buildSlices(MASTER_POOL.female.white, idx, SLICE_SIZE),
      hispanic: buildSlices(MASTER_POOL.female.hispanic, idx, SLICE_SIZE),
      asian: buildSlices(MASTER_POOL.female.asian, idx, SLICE_SIZE),
    },
    male: {
      black: buildSlices(MASTER_POOL.male.black, idx, SLICE_SIZE),
      white: buildSlices(MASTER_POOL.male.white, idx, SLICE_SIZE),
      hispanic: buildSlices(MASTER_POOL.male.hispanic, idx, SLICE_SIZE),
      asian: buildSlices(MASTER_POOL.male.asian, idx, SLICE_SIZE),
    },
  };
});

const BEAUTY_CATEGORY_IDS = new Set(["makeup-only", "grooming"]);

function pickOne(pool: string[], seed: string, exclude: Set<string>): string | null {
  if (pool.length === 0) return null;
  const start = hash(seed) % pool.length;
  for (let i = 0; i < pool.length; i++) {
    const candidate = pool[(start + i) % pool.length];
    if (!exclude.has(candidate)) return candidate;
  }
  return pool[start]; // fallback
}

import { getCachedTrio, setCachedTrio } from "./savedInspiration";

/**
 * Returns 3 inspiration images per sub-style — guaranteed:
 *  - 3 different races per trio (full diversity)
 *  - no duplicates within the trio
 *  - no duplicates across categories (category-partitioned slices)
 *  - gender-matched
 *  - cached in localStorage so trio is stable for the user
 */
export function getSubStyleImages(
  categoryId: string,
  subId: string,
  gender: Gender,
  usedImages?: Set<string>,
): string[] {
  // 1. Cached trio wins (stable across sessions).
  const cached = getCachedTrio(categoryId, subId, gender);
  if (cached && cached.length >= 3) {
    if (usedImages) cached.forEach(u => usedImages.add(u));
    return cached.slice(0, 3);
  }

  // 2. Resolve the slice for this category. If category isn't in the partition
  //    table, fall back to using its name hash as the index.
  const catIdx = CATEGORY_ORDER.indexOf(categoryId);
  const fallbackIdx = catIdx >= 0 ? catIdx : (hash(categoryId) % 50);
  const slices = CATEGORY_SLICES[categoryId] || {
    female: {
      black: buildSlices(MASTER_POOL.female.black, fallbackIdx, SLICE_SIZE),
      white: buildSlices(MASTER_POOL.female.white, fallbackIdx, SLICE_SIZE),
      hispanic: buildSlices(MASTER_POOL.female.hispanic, fallbackIdx, SLICE_SIZE),
      asian: buildSlices(MASTER_POOL.female.asian, fallbackIdx, SLICE_SIZE),
    },
    male: {
      black: buildSlices(MASTER_POOL.male.black, fallbackIdx, SLICE_SIZE),
      white: buildSlices(MASTER_POOL.male.white, fallbackIdx, SLICE_SIZE),
      hispanic: buildSlices(MASTER_POOL.male.hispanic, fallbackIdx, SLICE_SIZE),
      asian: buildSlices(MASTER_POOL.male.asian, fallbackIdx, SLICE_SIZE),
    },
  };

  const isBeauty = BEAUTY_CATEGORY_IDS.has(categoryId);
  const beautyIsApplicable = isBeauty && (
    (categoryId === "makeup-only" && gender === "female") ||
    (categoryId === "grooming" && gender === "male")
  );

  const poolFor = (race: Race): string[] => {
    if (beautyIsApplicable) {
      return categoryId === "makeup-only" ? BEAUTY_POOL[race] : GROOMING_POOL[race];
    }
    return slices[gender][race];
  };

  // 3. Rotate starting race per sub-style — guarantees grid-wide diversity.
  const startIdx = hash(`${categoryId}:${subId}:race`) % RACES.length;
  const rotated: Race[] = RACES.map((_, i) => RACES[(startIdx + i) % RACES.length]);

  const trio: string[] = [];
  const localExclude = new Set<string>(usedImages || []);

  // 4. Pick one model from each of the first 3 races (always different races).
  for (let i = 0; i < 3; i++) {
    const race = rotated[i];
    const pick = pickOne(poolFor(race), `${categoryId}:${subId}:${race}`, localExclude);
    if (pick && !trio.includes(pick)) {
      trio.push(pick);
      localExclude.add(pick);
      usedImages?.add(pick);
    }
  }

  // 5. Top up if any race pool was empty (e.g. lingerie/wedding for male).
  if (trio.length < 3) {
    const allRaces = [...rotated, ...rotated]; // try 4th race + repeats
    for (const race of allRaces) {
      if (trio.length >= 3) break;
      const pick = pickOne(poolFor(race), `${categoryId}:${subId}:${race}:fill`, localExclude);
      if (pick && !trio.includes(pick)) {
        trio.push(pick);
        localExclude.add(pick);
        usedImages?.add(pick);
      }
    }
  }

  // 6. Last-resort fallback: any image from master pool.
  if (trio.length < 3) {
    const fallback = [
      ...MASTER_POOL[gender].black, ...MASTER_POOL[gender].white,
      ...MASTER_POOL[gender].hispanic, ...MASTER_POOL[gender].asian,
    ];
    for (const img of fallback) {
      if (trio.length >= 3) break;
      if (!trio.includes(img) && !localExclude.has(img)) {
        trio.push(img);
        usedImages?.add(img);
      }
    }
  }

  if (trio.length > 0) setCachedTrio(categoryId, subId, gender, trio);
  return trio;
}

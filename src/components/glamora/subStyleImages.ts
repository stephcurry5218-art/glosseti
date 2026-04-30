// Inspiration images for sub-styles.
// Strategy: large diverse image bank per category + deterministic hash-based picker
// so EVERY sub-style gets a unique trio. Mixes Black, Asian, Latina/o, White,
// South-Asian, Middle-Eastern models, gender-matched.

type Gender = "male" | "female";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop&q=75`;
const face = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop&crop=faces&q=75`;

// Deterministic string hash so the same sub-id always picks the same trio.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// Pick distinct images from a bank, seeded by the sub id.
function pickTrio(bank: string[], seed: string, count = 3): string[] {
  if (bank.length === 0) return [];
  if (bank.length <= count) return bank.slice(0, count);
  const start = hash(seed) % bank.length;
  const stride = (hash(seed + "x") % (bank.length - 1)) + 1;
  const used = new Set<number>();
  const out: string[] = [];
  let i = start;
  for (let attempts = 0; attempts < bank.length && out.length < count; attempts++) {
    if (!used.has(i)) {
      used.add(i);
      out.push(bank[i]);
    }
    i = (i + stride) % bank.length;
  }
  for (let offset = 0; offset < bank.length && out.length < count; offset++) {
    const next = (start + offset) % bank.length;
    if (!used.has(next)) out.push(bank[next]);
  }
  return out;
}

function uniqueByFirstSeen(images: string[]): string[] {
  return images.filter((img, idx, arr) => arr.indexOf(img) === idx);
}

function addUnique(target: string[], candidates: string[], used?: Set<string>, limit = 3) {
  for (const img of candidates) {
    if (target.length >= limit) break;
    if (!img || target.includes(img) || used?.has(img)) continue;
    target.push(img);
    used?.add(img);
  }
}

// ============================================================================
// IMAGE BANKS — Large diverse pools per category (10-20 photos each).
// Hash picker selects 3 unique images per sub-style from these banks.
// ============================================================================

const DEFAULT_FEMALE = [
  u("1529626455594-4ff0802cfb7e"), u("1524504388940-b1c1722653e1"),
  u("1488426862026-3ee34a7d66df"), u("1534528741775-53994a69daeb"),
  u("1495121605193-b116b5b09a55"), u("1517841905240-472988babdf9"),
  u("1496747611176-843222e1e57c"), u("1483985988355-763728e1935b"),
];
const DEFAULT_MALE = [
  u("1506794778202-cad84cf45f1d"), u("1507003211169-0a1dd7228f2d"),
  u("1519085360753-af0119f7cbe7"), u("1472099645785-5658abf4ff4e"),
  u("1500648767791-00dcc994a43e"), u("1531123897727-8f129e1688ce"),
  u("1488161628813-04466f872be2"), u("1492447166138-50c3889fccb1"),
];

// Required representation anchors: every inspiration trio includes Black and
// Hispanic/Latina/Latino models, then one style-specific image for context.
const REPRESENTATION_POOLS: Record<Gender, { black: string[]; hispanic: string[]; beautyBlack: string[]; beautyHispanic: string[] }> = {
  female: {
    black: [
      u("1634826260499-7d97a6049913"), u("1766193228857-e6e82a6c367c"),
      u("1641427493563-5cc9cf1a9950"), u("1711925844152-8c9d51163ba2"),
      u("1775259038056-298d0819cb45"), u("1542838132-92c53300491e"),
      u("1503236823255-94609f598e71"), u("1525026198548-4baa812f1183"),
    ],
    hispanic: [
      u("1565325058695-f614c1580d7e"), u("1617380518330-7c5ca1dafdef"),
      u("1488426862026-3ee34a7d66df"), u("1485178575877-1a13bf489dfe"),
      u("1495121605193-b116b5b09a55"), u("1496747611176-843222e1e57c"),
      u("1524504388940-b1c1722653e1"), u("1517841905240-472988babdf9"),
    ],
    beautyBlack: [
      u("1770283553838-769c5f97d55c"), u("1766465525389-2c817a267fbf"),
      u("1503236823255-94609f598e71"), u("1542838132-92c53300491e"),
      u("1765991735465-eae91b52065e"), u("1526045478516-99145907023c"),
    ],
    beautyHispanic: [
      u("1630084775816-7abb7383ded5"), u("1646335940131-0e25ade32348"),
      u("1565325058695-f614c1580d7e"), u("1617380518330-7c5ca1dafdef"),
      u("1488426862026-3ee34a7d66df"), u("1522337360788-8b13dee7a37e"),
    ],
  },
  male: {
    black: [
      u("1546572797-e8c933a75a1f"), u("1552324864-5f7f0dec9b3d"),
      u("1614483573119-1e3b2be05565"), u("1754577060078-21315dd188c8"),
      u("1492447166138-50c3889fccb1"), u("1483721310020-03333e577078"),
      u("1552058544-f2b08422138a"), u("1531123897727-8f129e1688ce"),
    ],
    hispanic: [
      u("1542326529804-0cd9d861ebaa"), u("1585159797364-f2dfa42d79c3"),
      u("1774542583509-a4471c0af45f"), u("1768935706759-f2be765b3aec"),
      u("1658250365092-7d24166eb605"), u("1500648767791-00dcc994a43e"),
      u("1521119989659-a83eee488004"), u("1593032465175-481ac7f401a0"),
    ],
    beautyBlack: [
      u("1546572797-e8c933a75a1f"), u("1552324864-5f7f0dec9b3d"),
      u("1614483573119-1e3b2be05565"), u("1754577060078-21315dd188c8"),
    ],
    beautyHispanic: [
      u("1542326529804-0cd9d861ebaa"), u("1585159797364-f2dfa42d79c3"),
      u("1768935706759-f2be765b3aec"), u("1658250365092-7d24166eb605"),
    ],
  },
};

const BEAUTY_CATEGORY_IDS = new Set(["makeup-only", "grooming"]);

const FEMALE_MAKEUP_FACE_SHOTS = [
  u("1591726328133-b4e2b0031cb2"), u("1666073090334-f2a9c8a86d14"),
  u("1595051780009-1a8f6f4fac9e"), u("1631825598395-58692acfee5c"),
  u("1688633201440-73f30feb06ba"), u("1601599009979-f85c21cbd703"),
  u("1648671095177-d00c1f6264e9"), u("1705486525499-1aaa9388de94"),
  u("1628619447698-d17aa1899220"), u("1563827517575-7d43935ca7f6"),
  u("1631652367427-726f96b37cf1"), u("1563827525259-22d51d5e7452"),
  u("1570751057249-92751f496ee3"), u("1605052063083-858e6a650919"),
  u("1565630918451-2bab9571feec"), u("1565630916140-8518afed6329"),
  u("1582727476685-9813d181cf75"), u("1763906802570-be2a2609757f"),
  u("1686350751255-20a12bbe4880"), u("1686350751264-1d3f6e41a6e6"),
  u("1721152839659-dabbacabd5d6"), u("1770576934845-759db89fcd3f"),
  u("1770821214788-6605c5c3075b"), u("1761498443962-1f00eed12137"),
  u("1686350751240-348d2ca05025"), u("1630084775816-7abb7383ded5"),
  u("1542838132-92c53300491e"), u("1522337360788-8b13dee7a37e"),
  u("1531746020798-e6953c6e8e04"), u("1488426862026-3ee34a7d66df"),
];

function pickOne(pool: string[], seed: string): string | null {
  if (pool.length === 0) return null;
  return pool[hash(seed) % pool.length];
}

// Each category has a wide pool — picker rotates through to give each sub a unique trio.
const CATEGORY_BANKS: Record<string, { female: string[]; male: string[] }> = {
  "full-style": {
    female: [
      u("1483985988355-763728e1935b"), u("1496747611176-843222e1e57c"),
      u("1551803091-e20673f15770"),    u("1539109136881-3be0616acf4b"),
      u("1485178575877-1a13bf489dfe"), u("1517841905240-472988babdf9"),
      u("1524504388940-b1c1722653e1"), u("1495121605193-b116b5b09a55"),
      u("1529626455594-4ff0802cfb7e"), u("1488426862026-3ee34a7d66df"),
      u("1517438476312-10d79c5f25e3"), u("1534528741775-53994a69daeb"),
    ],
    male: [
      u("1488161628813-04466f872be2"), u("1492447166138-50c3889fccb1"),
      u("1539109136881-3be0616acf4b"), u("1506794778202-cad84cf45f1d"),
      u("1507003211169-0a1dd7228f2d"), u("1519085360753-af0119f7cbe7"),
      u("1472099645785-5658abf4ff4e"), u("1500648767791-00dcc994a43e"),
      u("1521119989659-a83eee488004"), u("1593032465175-481ac7f401a0"),
      u("1483721310020-03333e577078"), u("1531123897727-8f129e1688ce"),
    ],
  },
  "icon-looks": {
    female: [
      u("1483985988355-763728e1935b"), u("1485178575877-1a13bf489dfe"),
      u("1496747611176-843222e1e57c"), u("1566174053879-31528523f8ae"),
      u("1490481651871-ab68de25d43d"), u("1525026198548-4baa812f1183"),
      u("1495121605193-b116b5b09a55"), u("1517841905240-472988babdf9"),
      u("1539109136881-3be0616acf4b"), u("1571908599407-cdb918ed83bf"),
      u("1524504388940-b1c1722653e1"), u("1517438476312-10d79c5f25e3"),
    ],
    male: [
      u("1507003211169-0a1dd7228f2d"), u("1521119989659-a83eee488004"),
      u("1593032465175-481ac7f401a0"), u("1488161628813-04466f872be2"),
      u("1492447166138-50c3889fccb1"), u("1483721310020-03333e577078"),
      u("1552058544-f2b08422138a"),    u("1531123897727-8f129e1688ce"),
      u("1500648767791-00dcc994a43e"), u("1519085360753-af0119f7cbe7"),
    ],
  },
  "streetwear": {
    female: [
      u("1539109136881-3be0616acf4b"), u("1488161628813-04466f872be2"),
      u("1517438476312-10d79c5f25e3"), u("1525026198548-4baa812f1183"),
      u("1485178575877-1a13bf489dfe"), u("1551803091-e20673f15770"),
      u("1496747611176-843222e1e57c"), u("1534528741775-53994a69daeb"),
    ],
    male: [
      u("1483721310020-03333e577078"), u("1552058544-f2b08422138a"),
      u("1492447166138-50c3889fccb1"), u("1531123897727-8f129e1688ce"),
      u("1488161628813-04466f872be2"), u("1539109136881-3be0616acf4b"),
      u("1507003211169-0a1dd7228f2d"), u("1519085360753-af0119f7cbe7"),
    ],
  },
  "minimalist": {
    female: [
      u("1496747611176-843222e1e57c"), u("1524504388940-b1c1722653e1"),
      u("1517841905240-472988babdf9"), u("1495121605193-b116b5b09a55"),
      u("1483985988355-763728e1935b"), u("1485178575877-1a13bf489dfe"),
      u("1488426862026-3ee34a7d66df"), u("1534528741775-53994a69daeb"),
    ],
    male: [
      u("1488161628813-04466f872be2"), u("1519085360753-af0119f7cbe7"),
      u("1593032465175-481ac7f401a0"), u("1521119989659-a83eee488004"),
      u("1506794778202-cad84cf45f1d"), u("1500648767791-00dcc994a43e"),
      u("1507003211169-0a1dd7228f2d"), u("1531123897727-8f129e1688ce"),
    ],
  },
  "vintage": {
    female: [
      u("1495121605193-b116b5b09a55"), u("1485178575877-1a13bf489dfe"),
      u("1515886657613-9f3515b0c78f"), u("1483985988355-763728e1935b"),
      u("1517841905240-472988babdf9"), u("1496747611176-843222e1e57c"),
      u("1488426862026-3ee34a7d66df"), u("1524504388940-b1c1722653e1"),
    ],
    male: [
      u("1521119989659-a83eee488004"), u("1488161628813-04466f872be2"),
      u("1500648767791-00dcc994a43e"), u("1593032465175-481ac7f401a0"),
      u("1506794778202-cad84cf45f1d"), u("1492447166138-50c3889fccb1"),
      u("1507003211169-0a1dd7228f2d"), u("1531123897727-8f129e1688ce"),
    ],
  },
  "athleisure": {
    female: [
      u("1518310383802-640c2de311b6"), u("1571019613454-1cb2f99b2d8b"),
      u("1517836357463-d25dfeac3438"), u("1599058917212-d750089bc07e"),
      u("1483721310020-03333e577078"), u("1571945153237-4929e783af4a"),
      u("1581009146145-b5ef050c2e1e"), u("1574680096145-d05b474e2155"),
    ],
    male: [
      u("1571019614242-c5c5dee9f50b"), u("1583500178690-f7fd39c44a66"),
      u("1567013127542-490d757e51fc"), u("1581009146145-b5ef050c2e1e"),
      u("1532009877282-3340270e0529"), u("1605296867424-35fc25c9212a"),
      u("1517836357463-d25dfeac3438"), u("1574680096145-d05b474e2155"),
    ],
  },
  "formal": {
    female: [
      u("1566174053879-31528523f8ae"), u("1490481651871-ab68de25d43d"),
      u("1571908599407-cdb918ed83bf"), u("1583900985737-6d0495555783"),
      u("1494178270175-e96de2971df9"), u("1485178575877-1a13bf489dfe"),
      u("1525026198548-4baa812f1183"), u("1483985988355-763728e1935b"),
    ],
    male: [
      u("1507003211169-0a1dd7228f2d"), u("1521119989659-a83eee488004"),
      u("1593032465175-481ac7f401a0"), u("1488161628813-04466f872be2"),
      u("1506794778202-cad84cf45f1d"), u("1492447166138-50c3889fccb1"),
      u("1519085360753-af0119f7cbe7"), u("1500648767791-00dcc994a43e"),
    ],
  },
  "casual": {
    female: [
      u("1524504388940-b1c1722653e1"), u("1488426862026-3ee34a7d66df"),
      u("1495121605193-b116b5b09a55"), u("1517841905240-472988babdf9"),
      u("1496747611176-843222e1e57c"), u("1534528741775-53994a69daeb"),
      u("1529626455594-4ff0802cfb7e"), u("1483985988355-763728e1935b"),
    ],
    male: [
      u("1506794778202-cad84cf45f1d"), u("1519085360753-af0119f7cbe7"),
      u("1472099645785-5658abf4ff4e"), u("1488161628813-04466f872be2"),
      u("1531123897727-8f129e1688ce"), u("1500648767791-00dcc994a43e"),
      u("1507003211169-0a1dd7228f2d"), u("1521119989659-a83eee488004"),
    ],
  },
  "bohemian": {
    female: [
      u("1485178575877-1a13bf489dfe"), u("1515886657613-9f3515b0c78f"),
      u("1517841905240-472988babdf9"), u("1495121605193-b116b5b09a55"),
      u("1488426862026-3ee34a7d66df"), u("1483985988355-763728e1935b"),
      u("1524504388940-b1c1722653e1"), u("1496747611176-843222e1e57c"),
    ],
    male: [
      u("1531123897727-8f129e1688ce"), u("1500648767791-00dcc994a43e"),
      u("1488161628813-04466f872be2"), u("1472099645785-5658abf4ff4e"),
      u("1506794778202-cad84cf45f1d"), u("1519085360753-af0119f7cbe7"),
    ],
  },
  "preppy": {
    female: [
      u("1495121605193-b116b5b09a55"), u("1517841905240-472988babdf9"),
      u("1524504388940-b1c1722653e1"), u("1483985988355-763728e1935b"),
      u("1496747611176-843222e1e57c"), u("1488426862026-3ee34a7d66df"),
    ],
    male: [
      u("1593032465175-481ac7f401a0"), u("1521119989659-a83eee488004"),
      u("1507003211169-0a1dd7228f2d"), u("1488161628813-04466f872be2"),
      u("1506794778202-cad84cf45f1d"), u("1500648767791-00dcc994a43e"),
    ],
  },
  "edgy": {
    female: [
      u("1539109136881-3be0616acf4b"), u("1525026198548-4baa812f1183"),
      u("1517438476312-10d79c5f25e3"), u("1485178575877-1a13bf489dfe"),
      u("1551803091-e20673f15770"),    u("1496747611176-843222e1e57c"),
    ],
    male: [
      u("1483721310020-03333e577078"), u("1552058544-f2b08422138a"),
      u("1531123897727-8f129e1688ce"), u("1488161628813-04466f872be2"),
      u("1492447166138-50c3889fccb1"), u("1500648767791-00dcc994a43e"),
    ],
  },
  "resort": {
    female: [
      u("1570976447640-ac859d960c4b"), u("1502323777036-f29e3972d82f"),
      u("1515886657613-9f3515b0c78f"), u("1485178575877-1a13bf489dfe"),
      u("1488426862026-3ee34a7d66df"), u("1517841905240-472988babdf9"),
    ],
    male: [
      u("1530268729831-4b0b9e170218"), u("1502720433255-614171a1835e"),
      u("1532910404247-7ee9488d7292"), u("1500648767791-00dcc994a43e"),
      u("1531123897727-8f129e1688ce"), u("1472099645785-5658abf4ff4e"),
    ],
  },
  // ===== Makeup & Beauty (women) — distinct shots per sub-style =====
  "makeup-only": {
    female: [
      ...FEMALE_MAKEUP_FACE_SHOTS,
    ],
    male: [
      u("1500648767791-00dcc994a43e"), u("1581824283135-0666cf353f35"),
      u("1605497788044-5a32c7078486"), u("1492562080023-ab3db95bfbce"),
      u("1519085360753-af0119f7cbe7"), u("1521119989659-a83eee488004"),
      u("1507003211169-0a1dd7228f2d"), u("1593032465175-481ac7f401a0"),
    ],
  },
  "grooming": {
    female: [],
    male: [
      u("1605497788044-5a32c7078486"), u("1581824283135-0666cf353f35"),
      u("1500648767791-00dcc994a43e"), u("1492562080023-ab3db95bfbce"),
      u("1519085360753-af0119f7cbe7"), u("1521119989659-a83eee488004"),
      u("1593032465175-481ac7f401a0"), u("1507003211169-0a1dd7228f2d"),
      u("1488161628813-04466f872be2"), u("1531123897727-8f129e1688ce"),
    ],
  },
  "sexy": {
    female: [
      u("1525026198548-4baa812f1183"), u("1539109136881-3be0616acf4b"),
      u("1485178575877-1a13bf489dfe"), u("1566174053879-31528523f8ae"),
      u("1490481651871-ab68de25d43d"), u("1571908599407-cdb918ed83bf"),
      u("1517438476312-10d79c5f25e3"), u("1496747611176-843222e1e57c"),
    ],
    male: [
      u("1531123897727-8f129e1688ce"), u("1492447166138-50c3889fccb1"),
      u("1488161628813-04466f872be2"), u("1483721310020-03333e577078"),
      u("1552058544-f2b08422138a"),    u("1500648767791-00dcc994a43e"),
    ],
  },
  "swimwear": {
    female: [
      u("1570976447640-ac859d960c4b"), u("1502323777036-f29e3972d82f"),
      u("1515886657613-9f3515b0c78f"), u("1485178575877-1a13bf489dfe"),
      u("1488426862026-3ee34a7d66df"), u("1483985988355-763728e1935b"),
    ],
    male: [
      u("1530268729831-4b0b9e170218"), u("1532910404247-7ee9488d7292"),
      u("1502720433255-614171a1835e"), u("1500648767791-00dcc994a43e"),
      u("1531123897727-8f129e1688ce"), u("1488161628813-04466f872be2"),
    ],
  },
  "urban-hiphop": {
    female: [
      u("1525026198548-4baa812f1183"), u("1539109136881-3be0616acf4b"),
      u("1485178575877-1a13bf489dfe"), u("1517438476312-10d79c5f25e3"),
      u("1496747611176-843222e1e57c"), u("1551803091-e20673f15770"),
    ],
    male: [
      u("1492447166138-50c3889fccb1"), u("1483721310020-03333e577078"),
      u("1552058544-f2b08422138a"), u("1488161628813-04466f872be2"),
      u("1531123897727-8f129e1688ce"), u("1539109136881-3be0616acf4b"),
    ],
  },
  "rugged": {
    female: [
      u("1495121605193-b116b5b09a55"), u("1485178575877-1a13bf489dfe"),
      u("1488426862026-3ee34a7d66df"), u("1517841905240-472988babdf9"),
    ],
    male: [
      u("1488161628813-04466f872be2"), u("1593032465175-481ac7f401a0"),
      u("1500648767791-00dcc994a43e"), u("1605497788044-5a32c7078486"),
      u("1521119989659-a83eee488004"), u("1531123897727-8f129e1688ce"),
      u("1492447166138-50c3889fccb1"), u("1483721310020-03333e577078"),
    ],
  },
  "techwear": {
    female: [
      u("1517438476312-10d79c5f25e3"), u("1539109136881-3be0616acf4b"),
      u("1517841905240-472988babdf9"), u("1485178575877-1a13bf489dfe"),
      u("1525026198548-4baa812f1183"), u("1496747611176-843222e1e57c"),
    ],
    male: [
      u("1483721310020-03333e577078"), u("1552058544-f2b08422138a"),
      u("1531123897727-8f129e1688ce"), u("1488161628813-04466f872be2"),
      u("1492447166138-50c3889fccb1"), u("1500648767791-00dcc994a43e"),
    ],
  },
  "date-night": {
    female: [
      u("1566174053879-31528523f8ae"), u("1490481651871-ab68de25d43d"),
      u("1525026198548-4baa812f1183"), u("1571908599407-cdb918ed83bf"),
      u("1485178575877-1a13bf489dfe"), u("1483985988355-763728e1935b"),
    ],
    male: [
      u("1507003211169-0a1dd7228f2d"), u("1521119989659-a83eee488004"),
      u("1593032465175-481ac7f401a0"), u("1488161628813-04466f872be2"),
      u("1492447166138-50c3889fccb1"), u("1500648767791-00dcc994a43e"),
    ],
  },
  "lingerie": {
    female: [
      u("1566174053879-31528523f8ae"), u("1525026198548-4baa812f1183"),
      u("1485178575877-1a13bf489dfe"), u("1571908599407-cdb918ed83bf"),
      u("1490481651871-ab68de25d43d"), u("1517438476312-10d79c5f25e3"),
    ],
    male: [],
  },
  "y2k": {
    female: [
      u("1517438476312-10d79c5f25e3"), u("1485178575877-1a13bf489dfe"),
      u("1539109136881-3be0616acf4b"), u("1525026198548-4baa812f1183"),
      u("1496747611176-843222e1e57c"), u("1551803091-e20673f15770"),
    ],
    male: [
      u("1483721310020-03333e577078"), u("1552058544-f2b08422138a"),
      u("1531123897727-8f129e1688ce"), u("1488161628813-04466f872be2"),
    ],
  },
  "cottagecore": {
    female: [
      u("1495121605193-b116b5b09a55"), u("1517841905240-472988babdf9"),
      u("1515886657613-9f3515b0c78f"), u("1485178575877-1a13bf489dfe"),
      u("1488426862026-3ee34a7d66df"), u("1483985988355-763728e1935b"),
    ],
    male: DEFAULT_MALE,
  },
  "fitness": {
    female: [
      u("1518310383802-640c2de311b6"), u("1571019613454-1cb2f99b2d8b"),
      u("1599058917212-d750089bc07e"), u("1517836357463-d25dfeac3438"),
      u("1581009146145-b5ef050c2e1e"), u("1574680096145-d05b474e2155"),
      u("1571945153237-4929e783af4a"), u("1483721310020-03333e577078"),
    ],
    male: [
      u("1567013127542-490d757e51fc"), u("1583500178690-f7fd39c44a66"),
      u("1571019614242-c5c5dee9f50b"), u("1532009877282-3340270e0529"),
      u("1605296867424-35fc25c9212a"), u("1581009146145-b5ef050c2e1e"),
      u("1517836357463-d25dfeac3438"), u("1574680096145-d05b474e2155"),
    ],
  },
  "wedding-gowns": {
    female: [
      u("1519225421980-715cb0215aed"), u("1494178270175-e96de2971df9"),
      u("1583900985737-6d0495555783"), u("1566174053879-31528523f8ae"),
      u("1490481651871-ab68de25d43d"), u("1571908599407-cdb918ed83bf"),
    ],
    male: [],
  },
  "tuxedos": {
    female: [],
    male: [
      u("1507003211169-0a1dd7228f2d"), u("1593032465175-481ac7f401a0"),
      u("1521119989659-a83eee488004"), u("1488161628813-04466f872be2"),
      u("1506794778202-cad84cf45f1d"), u("1500648767791-00dcc994a43e"),
    ],
  },
  "jewelry-accessories": {
    female: [
      u("1515562141207-7a88fb7ce338"), u("1611591437281-460bfbe1220a"),
      u("1535632787350-4e68ef0ac584"), u("1599643478518-a784e5dc4c8f"),
      u("1605100804763-247f67b3557e"), u("1573408301185-9146fe634ad0"),
    ],
    male: [
      u("1611591437281-460bfbe1220a"), u("1599643478518-a784e5dc4c8f"),
      u("1535632787350-4e68ef0ac584"), u("1605100804763-247f67b3557e"),
    ],
  },
  "sunglasses-eyewear": {
    female: [
      u("1556306535-0f09a537f0a3"), u("1572635196237-14b3f281503f"),
      u("1577803645773-f96470509666"), u("1502767089025-6748d4ef9f24"),
      u("1574258495973-f010dfbb5371"), u("1511499767150-a48a237f0083"),
    ],
    male: [
      u("1556306535-0f09a537f0a3"), u("1502767089025-6748d4ef9f24"),
      u("1577803645773-f96470509666"), u("1572635196237-14b3f281503f"),
      u("1574258495973-f010dfbb5371"), u("1511499767150-a48a237f0083"),
    ],
  },
  "hats-headwear": {
    female: [
      u("1571513722275-4b41940f54b8"), u("1521369909029-2afed882baee"),
      u("1517841905240-472988babdf9"), u("1485178575877-1a13bf489dfe"),
      u("1495121605193-b116b5b09a55"), u("1488426862026-3ee34a7d66df"),
    ],
    male: [
      u("1521369909029-2afed882baee"), u("1488161628813-04466f872be2"),
      u("1492447166138-50c3889fccb1"), u("1500648767791-00dcc994a43e"),
      u("1506794778202-cad84cf45f1d"), u("1531123897727-8f129e1688ce"),
    ],
  },
  "bags-purses": {
    female: [
      u("1584917865442-de89df76afd3"), u("1591561954557-26941169b49e"),
      u("1548036328-c9fa89d128fa"),    u("1566150905458-1bf1fc113f0d"),
      u("1590874103328-eac38a683ce7"), u("1576566588028-4147f3842f27"),
    ],
    male: [
      u("1548036328-c9fa89d128fa"), u("1591561954557-26941169b49e"),
      u("1584917865442-de89df76afd3"), u("1547949003-9792a18a2601"),
    ],
  },
  "shoes-sneakers": {
    female: [
      u("1542291026-7eec264c27ff"), u("1543163521-1bf539c55dd2"),
      u("1595950653106-6c9ebd614d3a"), u("1525966222134-fcfa99b8ae77"),
      u("1600185365778-7886d2c3a76e"), u("1549298916-b41d501d3772"),
      u("1551107696-a4b0c5a0d9a2"),    u("1606107557195-0e29a4b5b4aa"),
    ],
    male: [
      u("1542291026-7eec264c27ff"), u("1525966222134-fcfa99b8ae77"),
      u("1600185365778-7886d2c3a76e"), u("1549298916-b41d501d3772"),
      u("1551107696-a4b0c5a0d9a2"),    u("1606107557195-0e29a4b5b4aa"),
      u("1543163521-1bf539c55dd2"), u("1595950653106-6c9ebd614d3a"),
    ],
  },
  "cosplay": {
    female: [
      u("1612036782180-6f0b6cd846fe"), u("1542596594-649edbc13630"),
      u("1607604276583-eef5d076aa5f"), u("1583089892943-e02e5b017b6a"),
      u("1605125571577-fdd0c52d5fef"), u("1601933973783-43cf8a7d4c5f"),
    ],
    male: [
      u("1542596594-649edbc13630"), u("1607604276583-eef5d076aa5f"),
      u("1612036782180-6f0b6cd846fe"), u("1583089892943-e02e5b017b6a"),
      u("1605125571577-fdd0c52d5fef"), u("1601933973783-43cf8a7d4c5f"),
    ],
  },
};

import { getCachedTrio, setCachedTrio } from "./savedInspiration";

/**
 * Returns 3 inspiration images per sub-style. Picks deterministically via hash,
 * then locks the result in localStorage so the user always sees the same trio
 * across sessions, refreshes, and even if image bank is later updated.
 */
export function getSubStyleImages(
  categoryId: string,
  subId: string,
  gender: Gender,
  usedImages?: Set<string>,
): string[] {
  // 1. Cached trio wins — guarantees stability across sessions
  const cached = getCachedTrio(categoryId, subId, gender);
  if (cached && cached.length > 0) {
    const trio: string[] = [];
    addUnique(trio, cached, usedImages);
    if (trio.length < 3) {
      const bank = CATEGORY_BANKS[categoryId];
      const arr = bank ? (gender === "male" ? bank.male : bank.female) : [];
      const fallback = categoryId === "makeup-only" && gender === "female"
        ? FEMALE_MAKEUP_FACE_SHOTS
        : [...arr, ...(gender === "male" ? DEFAULT_MALE : DEFAULT_FEMALE)];
      addUnique(trio, pickTrio(uniqueByFirstSeen(fallback), `${categoryId}:${subId}:cache-fill`, 12), usedImages);
    }
    return trio;
  }

  // 2. Compute fresh and cache. Each trio intentionally includes a Black model,
  // a Hispanic/Latina/Latino model, and one style/category-specific image.
  const bank = CATEGORY_BANKS[categoryId];
  let stylePick: string[];
  if (bank) {
    const arr = gender === "male" ? bank.male : bank.female;
    if (arr && arr.length > 0) {
      stylePick = pickTrio(arr, `${categoryId}:${subId}:style`);
    } else {
      const defaults = gender === "male" ? DEFAULT_MALE : DEFAULT_FEMALE;
      stylePick = pickTrio(defaults, `${categoryId}:${subId}:style`);
    }
  } else {
    const defaults = gender === "male" ? DEFAULT_MALE : DEFAULT_FEMALE;
    stylePick = pickTrio(defaults, `${categoryId}:${subId}:style`);
  }
  const representation = REPRESENTATION_POOLS[gender];
  const blackPool = BEAUTY_CATEGORY_IDS.has(categoryId) ? representation.beautyBlack : representation.black;
  const hispanicPool = BEAUTY_CATEGORY_IDS.has(categoryId) ? representation.beautyHispanic : representation.hispanic;
  const trio: string[] = [];
  addUnique(trio, [pickOne(blackPool, `${categoryId}:${subId}:black`)].filter(Boolean) as string[], usedImages);
  addUnique(trio, [pickOne(hispanicPool, `${categoryId}:${subId}:hispanic`)].filter(Boolean) as string[], usedImages);
  addUnique(trio, stylePick, usedImages);
  const fallbackPool = categoryId === "makeup-only" && gender === "female"
    ? FEMALE_MAKEUP_FACE_SHOTS
    : [...blackPool, ...hispanicPool, ...stylePick, ...(gender === "male" ? DEFAULT_MALE : DEFAULT_FEMALE)];
  addUnique(trio, pickTrio(uniqueByFirstSeen(fallbackPool), `${categoryId}:${subId}:fallback`, 20), usedImages);
  if (trio.length > 0) setCachedTrio(categoryId, subId, gender, trio);
  return trio;
}

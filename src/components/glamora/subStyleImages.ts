// Curated Unsplash inspiration images for sub-styles.
// Each entry returns 3 photos showing diverse races, gender-matched.
// Photos come from Unsplash (free to use, no attribution required for our use case).

type Gender = "male" | "female";

// Helper: build small Unsplash thumbnail URL
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop&q=75`;

// Default fallback pools — diverse mix used when a specific sub-style has no curated set.
// Each pool intentionally mixes Black, Asian, Latina/o, White, and South-Asian models.
const DEFAULT_FEMALE = [
  u("1529626455594-4ff0802cfb7e"), // Black woman fashion
  u("1524504388940-b1c1722653e1"), // Asian woman fashion
  u("1488426862026-3ee34a7d66df"), // Latina woman style
  u("1534528741775-53994a69daeb"), // Mixed race fashion
  u("1495121605193-b116b5b09a55"), // White woman style
  u("1517841905240-472988babdf9"), // South-Asian woman
];

const DEFAULT_MALE = [
  u("1506794778202-cad84cf45f1d"), // White man portrait
  u("1507003211169-0a1dd7228f2d"), // Black man fashion
  u("1519085360753-af0119f7cbe7"), // Asian man style
  u("1472099645785-5658abf4ff4e"), // Latino man portrait
  u("1500648767791-00dcc994a43e"), // Middle-Eastern man
  u("1531123897727-8f129e1688ce"), // Mixed-race man
];

// Category-level themed pools — used when sub-style has no specific curation.
// Keys match category ids in StylePickerScreen.
const CATEGORY_POOLS: Record<string, { female: string[]; male: string[] }> = {
  "full-style": {
    female: [
      u("1483985988355-763728e1935b"), // Editorial woman
      u("1496747611176-843222e1e57c"), // Black woman full outfit
      u("1551803091-e20673f15770"),     // Asian street style
    ],
    male: [
      u("1488161628813-04466f872be2"), // Man full outfit
      u("1492447166138-50c3889fccb1"), // Black man fashion
      u("1539109136881-3be0616acf4b"), // Asian man street
    ],
  },
  "streetwear": {
    female: [
      u("1539109136881-3be0616acf4b"),
      u("1488161628813-04466f872be2"),
      u("1517438476312-10d79c5f25e3"),
    ],
    male: [
      u("1483721310020-03333e577078"),
      u("1552058544-f2b08422138a"),
      u("1492447166138-50c3889fccb1"),
    ],
  },
  "formal": {
    female: [
      u("1566174053879-31528523f8ae"), // Black woman in gown
      u("1490481651871-ab68de25d43d"), // Asian woman elegant
      u("1571908599407-cdb918ed83bf"), // Formal dress
    ],
    male: [
      u("1507003211169-0a1dd7228f2d"), // Black man suit
      u("1521119989659-a83eee488004"), // Asian man suit
      u("1593032465175-481ac7f401a0"), // White man suit
    ],
  },
  "casual": {
    female: DEFAULT_FEMALE.slice(0, 3),
    male: DEFAULT_MALE.slice(0, 3),
  },
  "makeup-only": {
    female: [
      u("1503236823255-94609f598e71"), // Black woman makeup
      u("1487412720507-e7ab37603c6f"), // Asian beauty
      u("1526045478516-99145907023c"), // Editorial makeup
    ],
    male: [
      u("1500648767791-00dcc994a43e"), // Skincare man
      u("1581824283135-0666cf353f35"), // Grooming
      u("1605497788044-5a32c7078486"), // Beard care
    ],
  },
  "grooming": {
    female: [], // not applicable
    male: [
      u("1605497788044-5a32c7078486"),
      u("1581824283135-0666cf353f35"),
      u("1500648767791-00dcc994a43e"),
    ],
  },
  "sexy": {
    female: [
      u("1525026198548-4baa812f1183"), // Bodycon Black woman
      u("1539109136881-3be0616acf4b"), // Sultry editorial
      u("1485178575877-1a13bf489dfe"), // Latina sultry
    ],
    male: [
      u("1531123897727-8f129e1688ce"),
      u("1492447166138-50c3889fccb1"),
      u("1488161628813-04466f872be2"),
    ],
  },
  "swimwear": {
    female: [
      u("1570976447640-ac859d960c4b"), // Black woman beach
      u("1502323777036-f29e3972d82f"), // Asian woman swim
      u("1515886657613-9f3515b0c78f"), // Latina swim
    ],
    male: [
      u("1530268729831-4b0b9e170218"),
      u("1532910404247-7ee9488d7292"),
      u("1502720433255-614171a1835e"),
    ],
  },
  "athleisure": {
    female: [
      u("1518310383802-640c2de311b6"),
      u("1571019613454-1cb2f99b2d8b"),
      u("1517836357463-d25dfeac3438"),
    ],
    male: [
      u("1571019614242-c5c5dee9f50b"),
      u("1583500178690-f7fd39c44a66"),
      u("1567013127542-490d757e51fc"),
    ],
  },
  "fitness": {
    female: [
      u("1518310383802-640c2de311b6"),
      u("1571019613454-1cb2f99b2d8b"),
      u("1599058917212-d750089bc07e"),
    ],
    male: [
      u("1567013127542-490d757e51fc"),
      u("1583500178690-f7fd39c44a66"),
      u("1571019614242-c5c5dee9f50b"),
    ],
  },
  "vintage": {
    female: [
      u("1495121605193-b116b5b09a55"),
      u("1485178575877-1a13bf489dfe"),
      u("1515886657613-9f3515b0c78f"),
    ],
    male: [
      u("1521119989659-a83eee488004"),
      u("1488161628813-04466f872be2"),
      u("1500648767791-00dcc994a43e"),
    ],
  },
  "minimalist": {
    female: [
      u("1496747611176-843222e1e57c"),
      u("1524504388940-b1c1722653e1"),
      u("1517841905240-472988babdf9"),
    ],
    male: [
      u("1488161628813-04466f872be2"),
      u("1519085360753-af0119f7cbe7"),
      u("1593032465175-481ac7f401a0"),
    ],
  },
  "bohemian": {
    female: [
      u("1485178575877-1a13bf489dfe"),
      u("1515886657613-9f3515b0c78f"),
      u("1517841905240-472988babdf9"),
    ],
    male: DEFAULT_MALE.slice(0, 3),
  },
  "preppy": {
    female: [
      u("1495121605193-b116b5b09a55"),
      u("1517841905240-472988babdf9"),
      u("1524504388940-b1c1722653e1"),
    ],
    male: [
      u("1593032465175-481ac7f401a0"),
      u("1521119989659-a83eee488004"),
      u("1507003211169-0a1dd7228f2d"),
    ],
  },
  "edgy": {
    female: [
      u("1539109136881-3be0616acf4b"),
      u("1525026198548-4baa812f1183"),
      u("1517438476312-10d79c5f25e3"),
    ],
    male: [
      u("1483721310020-03333e577078"),
      u("1552058544-f2b08422138a"),
      u("1531123897727-8f129e1688ce"),
    ],
  },
  "resort": {
    female: [
      u("1570976447640-ac859d960c4b"),
      u("1502323777036-f29e3972d82f"),
      u("1515886657613-9f3515b0c78f"),
    ],
    male: [
      u("1530268729831-4b0b9e170218"),
      u("1502720433255-614171a1835e"),
      u("1532910404247-7ee9488d7292"),
    ],
  },
  "urban-hiphop": {
    female: [
      u("1525026198548-4baa812f1183"),
      u("1539109136881-3be0616acf4b"),
      u("1485178575877-1a13bf489dfe"),
    ],
    male: [
      u("1492447166138-50c3889fccb1"),
      u("1483721310020-03333e577078"),
      u("1552058544-f2b08422138a"),
    ],
  },
  "rugged": {
    female: DEFAULT_FEMALE.slice(0, 3),
    male: [
      u("1488161628813-04466f872be2"),
      u("1593032465175-481ac7f401a0"),
      u("1500648767791-00dcc994a43e"),
    ],
  },
  "techwear": {
    female: [
      u("1517438476312-10d79c5f25e3"),
      u("1539109136881-3be0616acf4b"),
      u("1517841905240-472988babdf9"),
    ],
    male: [
      u("1483721310020-03333e577078"),
      u("1552058544-f2b08422138a"),
      u("1531123897727-8f129e1688ce"),
    ],
  },
  "date-night": {
    female: [
      u("1566174053879-31528523f8ae"),
      u("1490481651871-ab68de25d43d"),
      u("1525026198548-4baa812f1183"),
    ],
    male: [
      u("1507003211169-0a1dd7228f2d"),
      u("1521119989659-a83eee488004"),
      u("1593032465175-481ac7f401a0"),
    ],
  },
  "lingerie": {
    female: [
      u("1566174053879-31528523f8ae"),
      u("1525026198548-4baa812f1183"),
      u("1485178575877-1a13bf489dfe"),
    ],
    male: [],
  },
  "y2k": {
    female: [
      u("1517438476312-10d79c5f25e3"),
      u("1485178575877-1a13bf489dfe"),
      u("1539109136881-3be0616acf4b"),
    ],
    male: DEFAULT_MALE.slice(0, 3),
  },
  "cottagecore": {
    female: [
      u("1495121605193-b116b5b09a55"),
      u("1517841905240-472988babdf9"),
      u("1515886657613-9f3515b0c78f"),
    ],
    male: DEFAULT_MALE.slice(0, 3),
  },
  "icon-looks": {
    female: [
      u("1483985988355-763728e1935b"),
      u("1485178575877-1a13bf489dfe"),
      u("1496747611176-843222e1e57c"),
    ],
    male: [
      u("1488161628813-04466f872be2"),
      u("1492447166138-50c3889fccb1"),
      u("1521119989659-a83eee488004"),
    ],
  },
  "wedding-gowns": {
    female: [
      u("1519225421980-715cb0215aed"),
      u("1494178270175-e96de2971df9"),
      u("1583900985737-6d0495555783"),
    ],
    male: [],
  },
  "tuxedos": {
    female: [],
    male: [
      u("1507003211169-0a1dd7228f2d"),
      u("1593032465175-481ac7f401a0"),
      u("1521119989659-a83eee488004"),
    ],
  },
  "jewelry-accessories": {
    female: [
      u("1515562141207-7a88fb7ce338"),
      u("1611591437281-460bfbe1220a"),
      u("1535632787350-4e68ef0ac584"),
    ],
    male: [
      u("1611591437281-460bfbe1220a"),
      u("1599643478518-a784e5dc4c8f"),
      u("1535632787350-4e68ef0ac584"),
    ],
  },
  "sunglasses-eyewear": {
    female: [
      u("1556306535-0f09a537f0a3"),
      u("1572635196237-14b3f281503f"),
      u("1577803645773-f96470509666"),
    ],
    male: [
      u("1556306535-0f09a537f0a3"),
      u("1502767089025-6748d4ef9f24"),
      u("1577803645773-f96470509666"),
    ],
  },
  "hats-headwear": {
    female: [
      u("1571513722275-4b41940f54b8"),
      u("1521369909029-2afed882baee"),
      u("1517841905240-472988babdf9"),
    ],
    male: [
      u("1521369909029-2afed882baee"),
      u("1488161628813-04466f872be2"),
      u("1492447166138-50c3889fccb1"),
    ],
  },
  "bags-purses": {
    female: [
      u("1584917865442-de89df76afd3"),
      u("1591561954557-26941169b49e"),
      u("1548036328-c9fa89d128fa"),
    ],
    male: [
      u("1548036328-c9fa89d128fa"),
      u("1591561954557-26941169b49e"),
      u("1584917865442-de89df76afd3"),
    ],
  },
  "shoes-sneakers": {
    female: [
      u("1542291026-7eec264c27ff"),
      u("1543163521-1bf539c55dd2"),
      u("1595950653106-6c9ebd614d3a"),
    ],
    male: [
      u("1542291026-7eec264c27ff"),
      u("1525966222134-fcfa99b8ae77"),
      u("1600185365778-7886d2c3a76e"),
    ],
  },
  "cosplay": {
    female: [
      u("1612036782180-6f0b6cd846fe"),
      u("1542596594-649edbc13630"),
      u("1607604276583-eef5d076aa5f"),
    ],
    male: [
      u("1542596594-649edbc13630"),
      u("1607604276583-eef5d076aa5f"),
      u("1612036782180-6f0b6cd846fe"),
    ],
  },
};

/**
 * Returns up to 3 inspiration image URLs for a given category + gender.
 * Falls back to a diverse default pool when no curated set exists.
 */
export function getSubStyleImages(
  categoryId: string,
  _subId: string,
  gender: Gender,
): string[] {
  const pool = CATEGORY_POOLS[categoryId];
  if (pool) {
    const arr = gender === "male" ? pool.male : pool.female;
    if (arr && arr.length > 0) return arr.slice(0, 3);
  }
  // Fallback: rotate the default pool deterministically by sub id length
  const defaults = gender === "male" ? DEFAULT_MALE : DEFAULT_FEMALE;
  const offset = (_subId.length * 7) % defaults.length;
  return [
    defaults[offset % defaults.length],
    defaults[(offset + 1) % defaults.length],
    defaults[(offset + 2) % defaults.length],
  ];
}

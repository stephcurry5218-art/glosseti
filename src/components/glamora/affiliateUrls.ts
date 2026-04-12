// Centralized affiliate URL builder with tracking tags

const AFFILIATE_TAG = "glamora0e-20"; // Amazon Associates tag
const UTM = "utm_source=glamora&utm_medium=app&utm_campaign=stylist";

const storeConfigs: Record<string, { base: (q: string) => string; affiliateParam?: string }> = {
  "Amazon": { base: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`, affiliateParam: `tag=${AFFILIATE_TAG}` },
  "Sephora": { base: (q) => `https://www.sephora.com/search?keyword=${encodeURIComponent(q)}` },
  "Ulta": { base: (q) => `https://www.ulta.com/search?search=${encodeURIComponent(q)}` },
  "Nordstrom": { base: (q) => `https://www.nordstrom.com/sr?keyword=${encodeURIComponent(q)}` },
  "Target": { base: (q) => `https://www.target.com/s?searchTerm=${encodeURIComponent(q)}` },
  "Zara": { base: (q) => `https://www.zara.com/us/en/search?searchTerm=${encodeURIComponent(q)}` },
  "H&M": { base: (q) => `https://www2.hm.com/en_us/search-results.html?q=${encodeURIComponent(q)}` },
  "Net-a-Porter": { base: (q) => `https://www.net-a-porter.com/en-us/shop/search/${encodeURIComponent(q)}` },
  "Mango": { base: (q) => `https://shop.mango.com/us/search?kw=${encodeURIComponent(q)}` },
  "DSW": { base: (q) => `https://www.dsw.com/en/us/search/${encodeURIComponent(q)}/` },
  "J.Crew": { base: (q) => `https://www.jcrew.com/r/search/?N=0&Nloc=en&Ntrm=${encodeURIComponent(q)}` },
  "Free People": { base: (q) => `https://www.freepeople.com/search/?q=${encodeURIComponent(q)}` },
  "Anthropologie": { base: (q) => `https://www.anthropologie.com/search?q=${encodeURIComponent(q)}` },
  "Madewell": { base: (q) => `https://www.madewell.com/search?q=${encodeURIComponent(q)}` },
  "Uniqlo": { base: (q) => `https://www.uniqlo.com/us/en/search/?q=${encodeURIComponent(q)}` },
  "Everlane": { base: (q) => `https://www.everlane.com/search?q=${encodeURIComponent(q)}` },
  "Reformation": { base: (q) => `https://www.thereformation.com/search?q=${encodeURIComponent(q)}` },
  "Ralph Lauren": { base: (q) => `https://www.ralphlauren.com/search?q=${encodeURIComponent(q)}` },
  "Cole Haan": { base: (q) => `https://www.colehaan.com/search?q=${encodeURIComponent(q)}` },
  "Coach Outlet": { base: (q) => `https://www.coachoutlet.com/search?q=${encodeURIComponent(q)}` },
  "Banana Republic": { base: (q) => `https://bananarepublic.gap.com/browse/search.do?searchText=${encodeURIComponent(q)}` },
  "AllSaints": { base: (q) => `https://www.allsaints.com/search?q=${encodeURIComponent(q)}` },
  "Urban Outfitters": { base: (q) => `https://www.urbanoutfitters.com/search?q=${encodeURIComponent(q)}` },
  "Levi's": { base: (q) => `https://www.levi.com/US/en_US/search?q=${encodeURIComponent(q)}` },
  "Brooks Brothers": { base: (q) => `https://www.brooksbrothers.com/search?q=${encodeURIComponent(q)}` },
  "& Other Stories": { base: (q) => `https://www.stories.com/en/search.html?q=${encodeURIComponent(q)}` },
  "Mejuri": { base: (q) => `https://www.mejuri.com/search?q=${encodeURIComponent(q)}` },
  "Gorjana": { base: (q) => `https://gorjana.com/search?q=${encodeURIComponent(q)}` },
  "Rebecca Minkoff": { base: (q) => `https://www.rebeccaminkoff.com/search?q=${encodeURIComponent(q)}` },
  "Filson": { base: (q) => `https://www.filson.com/catalogsearch/result/?q=${encodeURIComponent(q)}` },
  "Carhartt": { base: (q) => `https://www.carhartt.com/search?q=${encodeURIComponent(q)}` },
  "Bonobos": { base: (q) => `https://bonobos.com/search?q=${encodeURIComponent(q)}` },
  "Sperry": { base: (q) => `https://www.sperry.com/en/search?q=${encodeURIComponent(q)}` },
  "L.L.Bean": { base: (q) => `https://www.llbean.com/llb/search/?freeText=${encodeURIComponent(q)}` },
  // Athletic & Sneaker Brands
  "Nike": { base: (q) => `https://www.nike.com/w?q=${encodeURIComponent(q)}` },
  "Adidas": { base: (q) => `https://www.adidas.com/us/search?q=${encodeURIComponent(q)}` },
  "New Balance": { base: (q) => `https://www.newbalance.com/search/?q=${encodeURIComponent(q)}` },
  "Puma": { base: (q) => `https://us.puma.com/us/en/search?q=${encodeURIComponent(q)}` },
  "Reebok": { base: (q) => `https://www.reebok.com/us/search?q=${encodeURIComponent(q)}` },
  "Under Armour": { base: (q) => `https://www.underarmour.com/en-us/search?q=${encodeURIComponent(q)}` },
  "ASICS": { base: (q) => `https://www.asics.com/us/en-us/search?q=${encodeURIComponent(q)}` },
  "Converse": { base: (q) => `https://www.converse.com/search?q=${encodeURIComponent(q)}` },
  "Vans": { base: (q) => `https://www.vans.com/search?q=${encodeURIComponent(q)}` },
  // Luxury & Designer
  "Gucci": { base: (q) => `https://www.gucci.com/us/en/search?search=${encodeURIComponent(q)}` },
  "Louis Vuitton": { base: (q) => `https://us.louisvuitton.com/eng-us/search/${encodeURIComponent(q)}` },
  "Prada": { base: (q) => `https://www.prada.com/us/en/search.html?q=${encodeURIComponent(q)}` },
  "Versace": { base: (q) => `https://www.versace.com/us/en/search/?q=${encodeURIComponent(q)}` },
  "Burberry": { base: (q) => `https://us.burberry.com/search?q=${encodeURIComponent(q)}` },
  "Michael Kors": { base: (q) => `https://www.michaelkors.com/search?q=${encodeURIComponent(q)}` },
  "Kate Spade": { base: (q) => `https://www.katespade.com/search?q=${encodeURIComponent(q)}` },
  "Tory Burch": { base: (q) => `https://www.toryburch.com/en-us/search?q=${encodeURIComponent(q)}` },
  // Beauty Brands
  "MAC": { base: (q) => `https://www.maccosmetics.com/search?q=${encodeURIComponent(q)}` },
  "Fenty Beauty": { base: (q) => `https://fentybeauty.com/search?q=${encodeURIComponent(q)}` },
  "Glossier": { base: (q) => `https://www.glossier.com/search?q=${encodeURIComponent(q)}` },
  "Rare Beauty": { base: (q) => `https://www.rarebeauty.com/search?q=${encodeURIComponent(q)}` },
  "Charlotte Tilbury": { base: (q) => `https://www.charlottetilbury.com/us/search?q=${encodeURIComponent(q)}` },
  "NARS": { base: (q) => `https://www.narscosmetics.com/USA/search?q=${encodeURIComponent(q)}` },
  "Urban Decay": { base: (q) => `https://www.urbandecay.com/search?q=${encodeURIComponent(q)}` },
  "Too Faced": { base: (q) => `https://www.toofaced.com/search?q=${encodeURIComponent(q)}` },
  "Benefit": { base: (q) => `https://www.benefitcosmetics.com/en-us/search?q=${encodeURIComponent(q)}` },
  "Anastasia Beverly Hills": { base: (q) => `https://www.anastasiabeverlyhills.com/search?q=${encodeURIComponent(q)}` },
  "Clinique": { base: (q) => `https://www.clinique.com/search?q=${encodeURIComponent(q)}` },
  "Estée Lauder": { base: (q) => `https://www.esteelauder.com/search?q=${encodeURIComponent(q)}` },
  "Lancôme": { base: (q) => `https://www.lancome-usa.com/search?q=${encodeURIComponent(q)}` },
  "Bobbi Brown": { base: (q) => `https://www.bobbibrowncosmetics.com/search?q=${encodeURIComponent(q)}` },
  "Laura Mercier": { base: (q) => `https://www.lauramercier.com/search?q=${encodeURIComponent(q)}` },
  "Tarte": { base: (q) => `https://tartecosmetics.com/search?q=${encodeURIComponent(q)}` },
  "NYX": { base: (q) => `https://www.nyxcosmetics.com/search?q=${encodeURIComponent(q)}` },
  "Milk Makeup": { base: (q) => `https://www.milkmakeup.com/search?q=${encodeURIComponent(q)}` },
  "Pat McGrath": { base: (q) => `https://www.patmcgrath.com/search?q=${encodeURIComponent(q)}` },
  "Hourglass": { base: (q) => `https://www.hourglasscosmetics.com/search?q=${encodeURIComponent(q)}` },
  "Kosas": { base: (q) => `https://kfrfrcosmetics.com/search?q=${encodeURIComponent(q)}` },
  "Morphe": { base: (q) => `https://www.morphe.com/search?q=${encodeURIComponent(q)}` },
  "ColourPop": { base: (q) => `https://colourpop.com/search?q=${encodeURIComponent(q)}` },
  "e.l.f.": { base: (q) => `https://www.elfcosmetics.com/search?q=${encodeURIComponent(q)}` },
  // Fitness & Activewear Brands
  "Gymshark": { base: (q) => `https://www.gymshark.com/search?q=${encodeURIComponent(q)}` },
  "Lululemon": { base: (q) => `https://shop.lululemon.com/search?Ntt=${encodeURIComponent(q)}` },
  "Alo Yoga": { base: (q) => `https://www.aloyoga.com/search?q=${encodeURIComponent(q)}` },
  "Athleta": { base: (q) => `https://athleta.gap.com/browse/search.do?searchText=${encodeURIComponent(q)}` },
  "Fabletics": { base: (q) => `https://www.fabletics.com/search?q=${encodeURIComponent(q)}` },
  "Vuori": { base: (q) => `https://vuori.com/search?q=${encodeURIComponent(q)}` },
  "Dick's Sporting Goods": { base: (q) => `https://www.dickssportinggoods.com/search?searchTerm=${encodeURIComponent(q)}` },
  "REI": { base: (q) => `https://www.rei.com/search?q=${encodeURIComponent(q)}` },
  "Venum": { base: (q) => `https://www.venum.com/search?q=${encodeURIComponent(q)}` },
  "Hayabusa": { base: (q) => `https://www.hayabusafight.com/search?q=${encodeURIComponent(q)}` },
  "Rogue Fitness": { base: (q) => `https://www.roguefitness.com/search?q=${encodeURIComponent(q)}` },
  "On Running": { base: (q) => `https://www.on.com/en-us/search?q=${encodeURIComponent(q)}` },
  "HOKA": { base: (q) => `https://www.hoka.com/en/us/search?q=${encodeURIComponent(q)}` },
  "Everlast": { base: (q) => `https://www.everlast.com/search?q=${encodeURIComponent(q)}` },
  "Title Boxing": { base: (q) => `https://www.titleboxing.com/search?q=${encodeURIComponent(q)}` },
  // Bridal & Formalwear Brands
  "David's Bridal": { base: (q) => `https://www.davidsbridal.com/search?q=${encodeURIComponent(q)}` },
  "BHLDN": { base: (q) => `https://www.bhldn.com/search?q=${encodeURIComponent(q)}` },
  "Vera Wang": { base: (q) => `https://www.verawang.com/search?q=${encodeURIComponent(q)}` },
  "Men's Wearhouse": { base: (q) => `https://www.menswearhouse.com/search?q=${encodeURIComponent(q)}` },
  "Jos. A. Bank": { base: (q) => `https://www.josbank.com/search?q=${encodeURIComponent(q)}` },
  "Hugo Boss": { base: (q) => `https://www.hugoboss.com/us/search?q=${encodeURIComponent(q)}` },
  "SuitSupply": { base: (q) => `https://suitsupply.com/en-us/search?q=${encodeURIComponent(q)}` },
  "The Black Tux": { base: (q) => `https://theblacktux.com/search?q=${encodeURIComponent(q)}` },
  "Indochino": { base: (q) => `https://www.indochino.com/search?q=${encodeURIComponent(q)}` },
  // Other Popular Brands
  "Patagonia": { base: (q) => `https://www.patagonia.com/search/?q=${encodeURIComponent(q)}` },
  // Cosplay & Costume Stores
  "Spirit Halloween": { base: (q) => `https://www.spirithalloween.com/search?q=${encodeURIComponent(q)}` },
  "EZCosplay": { base: (q) => `https://www.ezcosplay.com/catalogsearch/result/?q=${encodeURIComponent(q)}` },
  "Miccostumes": { base: (q) => `https://www.miccostumes.com/search?q=${encodeURIComponent(q)}` },
  "CosplayShopper": { base: (q) => `https://www.cosplayshopper.com/search?q=${encodeURIComponent(q)}` },
  "Party City": { base: (q) => `https://www.partycity.com/search?q=${encodeURIComponent(q)}` },
  "Hot Topic": { base: (q) => `https://www.hottopic.com/search?q=${encodeURIComponent(q)}` },
  "The North Face": { base: (q) => `https://www.thenorthface.com/en-us/search?q=${encodeURIComponent(q)}` },
  "ASOS": { base: (q) => `https://www.asos.com/us/search/?q=${encodeURIComponent(q)}` },
  "SHEIN": { base: (q) => `https://us.shein.com/pdsearch/${encodeURIComponent(q)}/` },
  "Fashion Nova": { base: (q) => `https://www.fashionnova.com/search?q=${encodeURIComponent(q)}` },
  // Baby & Kids Stores
  "Carter's": { base: (q) => `https://www.carters.com/search?q=${encodeURIComponent(q)}` },
  "Old Navy": { base: (q) => `https://oldnavy.gap.com/browse/search.do?searchText=${encodeURIComponent(q)}` },
  "H&M Kids": { base: (q) => `https://www2.hm.com/en_us/search-results.html?q=${encodeURIComponent(q)}+kids` },
  "Zara Kids": { base: (q) => `https://www.zara.com/us/en/search?searchTerm=${encodeURIComponent(q)}+kids` },
  "Gap Kids": { base: (q) => `https://www.gap.com/browse/search.do?searchText=${encodeURIComponent(q)}+kids` },
  "Primary": { base: (q) => `https://www.primary.com/search?q=${encodeURIComponent(q)}` },
  "PatPat": { base: (q) => `https://us.patpat.com/search?q=${encodeURIComponent(q)}` },
  "BabyGap": { base: (q) => `https://www.gap.com/browse/search.do?searchText=${encodeURIComponent(q)}+baby` },
  "Revolve": { base: (q) => `https://www.revolve.com/r/Search?query=${encodeURIComponent(q)}` },
  "Steve Madden": { base: (q) => `https://www.stevemadden.com/search?q=${encodeURIComponent(q)}` },
  "Dr. Martens": { base: (q) => `https://www.drmartens.com/us/en/search?q=${encodeURIComponent(q)}` },
  "Birkenstock": { base: (q) => `https://www.birkenstock.com/us/search?q=${encodeURIComponent(q)}` },
  "UGG": { base: (q) => `https://www.ugg.com/search?q=${encodeURIComponent(q)}` },
};

export const getShopUrl = (store: string, item: string): string => {
  const config = storeConfigs[store];
  if (!config) {
    return `https://www.google.com/search?q=${encodeURIComponent(`${store} ${item}`)}&${UTM}`;
  }
  const baseUrl = config.base(item);
  const separator = baseUrl.includes("?") ? "&" : "?";
  const params = [config.affiliateParam, UTM].filter(Boolean).join("&");
  return `${baseUrl}${separator}${params}`;
};

export const getAmazonSearchUrl = (searchTerm: string): string => {
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}&tag=${AFFILIATE_TAG}&${UTM}`;
};

export const getGoogleShoppingUrl = (store: string, item: string): string => {
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`${item} ${store}`)}&${UTM}`;
};

/** Detect a known store/brand name inside free-text and return { store, query } */
const storeNames = Object.keys(storeConfigs);
export const detectStoreFromText = (text: string): { store: string; query: string } | null => {
  const lower = text.toLowerCase();
  // Sort by length descending so "Under Armour" matches before "Armour"
  for (const name of storeNames.sort((a, b) => b.length - a.length)) {
    if (lower.includes(name.toLowerCase())) {
      // Remove the brand name from the query to get the product term
      const query = text.replace(new RegExp(name, "i"), "").trim() || text;
      return { store: name, query };
    }
  }
  return null;
};

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
  // Other Popular Brands
  "Lululemon": { base: (q) => `https://shop.lululemon.com/search?Ntt=${encodeURIComponent(q)}` },
  "Patagonia": { base: (q) => `https://www.patagonia.com/search/?q=${encodeURIComponent(q)}` },
  "The North Face": { base: (q) => `https://www.thenorthface.com/en-us/search?q=${encodeURIComponent(q)}` },
  "ASOS": { base: (q) => `https://www.asos.com/us/search/?q=${encodeURIComponent(q)}` },
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

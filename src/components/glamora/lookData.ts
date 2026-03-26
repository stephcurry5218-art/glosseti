export type Category = "makeup" | "top" | "bottom" | "shoes" | "accessories";
export type PriceTier = "luxury" | "mid" | "budget";
export type ShopOption = { store: string; item: string; price: string };
export type Step = {
  title: string;
  detail: string;
  tip?: string;
  shop?: Record<PriceTier, ShopOption>;
};

export const categoryLabels: Record<Category, { label: string; icon: string }> = {
  makeup: { label: "Makeup", icon: "💄" },
  top: { label: "Top & Layers", icon: "👔" },
  bottom: { label: "Bottoms", icon: "👖" },
  shoes: { label: "Shoes & Socks", icon: "👟" },
  accessories: { label: "Accessories", icon: "⌚" },
};

export const categoryOrder: Category[] = ["makeup", "top", "bottom", "shoes", "accessories"];

export const tierInfo: Record<PriceTier, { label: string; icon: string; color: string; bg: string }> = {
  luxury: { label: "Luxury", icon: "👑", color: "hsl(var(--glamora-gold))", bg: "hsla(var(--glamora-gold) / 0.1)" },
  mid: { label: "Moderate", icon: "✨", color: "hsl(var(--glamora-rose-dark))", bg: "hsla(var(--glamora-rose) / 0.1)" },
  budget: { label: "Budget", icon: "💰", color: "hsl(var(--glamora-success))", bg: "hsla(var(--glamora-success) / 0.1)" },
};

export const lookData: Record<string, Record<Category, Step[]>> = {
  "Soft Glam": {
    makeup: [
      { title: "Prep & Prime", detail: "Apply a hydrating primer with a dewy finish. Focus on T-zone for a natural glow.", tip: "Use a beauty sponge for even application", shop: { luxury: { store: "Sephora", item: "Charlotte Tilbury Wonderglow Primer", price: "$55" }, mid: { store: "Ulta", item: "NYX Marshmallow Primer", price: "$16" }, budget: { store: "Amazon", item: "e.l.f. Jelly Pop Dew Primer", price: "$10" } } },
      { title: "Soft Rose Base", detail: "Blend a light-coverage foundation matched to your skin tone. Conceal under eyes with a shade lighter.", shop: { luxury: { store: "Nordstrom", item: "Armani Luminous Silk Foundation", price: "$65" }, mid: { store: "Ulta", item: "L'Oréal True Match Serum Foundation", price: "$17" }, budget: { store: "Target", item: "Maybelline Fit Me Dewy Foundation", price: "$9" } } },
      { title: "Blush & Highlight", detail: "Sweep a rose-pink blush on the apples of your cheeks. Add a champagne highlighter to cheekbones and nose bridge.", tip: "Smile to find the apples of your cheeks", shop: { luxury: { store: "Sephora", item: "NARS Orgasm Blush + Highlighter Duo", price: "$40" }, mid: { store: "Ulta", item: "Milani Baked Blush in Luminoso", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. Baked Highlighter + Blush Duo", price: "$8" } } },
      { title: "Soft Eye Look", detail: "Apply a matte nude on the lid, rose shimmer on the center, and blend a soft brown in the crease.", shop: { luxury: { store: "Sephora", item: "Charlotte Tilbury Pillow Talk Palette", price: "$53" }, mid: { store: "Ulta", item: "Anastasia Soft Glam Palette", price: "$29" }, budget: { store: "Amazon", item: "Maybelline The Nudes Palette", price: "$11" } } },
      { title: "Lips & Set", detail: "Line lips with a nude-rose liner. Apply a satin rose lipstick. Set everything with a dewy setting spray.", shop: { luxury: { store: "Nordstrom", item: "Tom Ford Lip Color in Pink Dusk", price: "$58" }, mid: { store: "Ulta", item: "MAC Matte Lipstick in Velvet Teddy", price: "$22" }, budget: { store: "Target", item: "Revlon Super Lustrous in Pink in the Afternoon", price: "$8" } } },
    ],
    top: [
      { title: "Base Layer", detail: "Choose a fitted silk or satin camisole in blush, champagne, or soft cream.", tip: "Silk reflects light and elevates the soft glam vibe", shop: { luxury: { store: "Net-a-Porter", item: "Vince Silk Camisole in Blush", price: "$225" }, mid: { store: "Nordstrom", item: "Topshop Satin Cowl Neck Cami", price: "$45" }, budget: { store: "H&M", item: "Satin V-Neck Camisole Top", price: "$18" } } },
      { title: "Mid Layer", detail: "Layer with a tailored blazer in dusty rose, camel, or soft beige. Opt for relaxed shoulders.", shop: { luxury: { store: "Farfetch", item: "Stella McCartney Oversized Blazer", price: "$1,495" }, mid: { store: "Zara", item: "Double-Breasted Blazer in Dusty Pink", price: "$90" }, budget: { store: "Shein", item: "Lapel Collar Single Button Blazer", price: "$28" } } },
      { title: "Alternative: Blouse", detail: "A flowy wrap blouse in muted florals or solid rose pairs beautifully with this look.", shop: { luxury: { store: "Reformation", item: "Kelsey Wrap Top in Rose", price: "$148" }, mid: { store: "Mango", item: "Floral Print Wrap Blouse", price: "$50" }, budget: { store: "Amazon", item: "VIISHOW Chiffon V-Neck Wrap Blouse", price: "$22" } } },
    ],
    bottom: [
      { title: "Trousers", detail: "High-waisted wide-leg trousers in cream, tan, or soft grey. Clean lines complement the softness.", tip: "A crease down the front adds polish", shop: { luxury: { store: "Net-a-Porter", item: "The Row Gala Wide-Leg Pants", price: "$890" }, mid: { store: "Aritzia", item: "Effortless Wide-Leg Pant", price: "$110" }, budget: { store: "H&M", item: "Wide-Leg Dress Pants", price: "$30" } } },
      { title: "Alternative: Skirt", detail: "A midi satin slip skirt in champagne or blush. Keep the silhouette fluid and elegant.", shop: { luxury: { store: "Nordstrom", item: "Vince Satin Slip Skirt", price: "$265" }, mid: { store: "& Other Stories", item: "Satin Midi Skirt in Champagne", price: "$79" }, budget: { store: "Amazon", item: "SheIn Satin High Waist Midi Skirt", price: "$18" } } },
    ],
    shoes: [
      { title: "Heels", detail: "Strappy nude or rose-gold heeled sandals. 2-3 inch block heels for comfort and elegance.", shop: { luxury: { store: "Nordstrom", item: "Stuart Weitzman Nudist Block Sandal", price: "$425" }, mid: { store: "DSW", item: "Sam Edelman Yaro Block Heel Sandal", price: "$120" }, budget: { store: "Target", item: "A New Day Strappy Block Heel Sandal", price: "$30" } } },
      { title: "Socks", detail: "Skip visible socks with heels. If wearing closed-toe pumps, go with sheer nude no-show socks.", tip: "Sheer socks keep things polished", shop: { luxury: { store: "Nordstrom", item: "Wolford Sheer 15 Knee-High Socks", price: "$28" }, mid: { store: "Nordstrom", item: "Calvin Klein Sheer No-Show Socks 3pk", price: "$16" }, budget: { store: "Amazon", item: "VERO MONTE No-Show Liner Socks 6pk", price: "$9" } } },
      { title: "Alternative: Flats", detail: "Pointed-toe ballet flats in metallic rose gold or soft suede nude.", shop: { luxury: { store: "Nordstrom", item: "Jimmy Choo Romy Ballet Flat", price: "$595" }, mid: { store: "Nordstrom", item: "Sam Edelman Jillie Flat", price: "$100" }, budget: { store: "Target", item: "A New Day Pointed Toe Ballet Flat", price: "$22" } } },
    ],
    accessories: [
      { title: "Watch", detail: "A slim rose-gold watch with a mesh band. Keep the face minimal and elegant.", shop: { luxury: { store: "Nordstrom", item: "Daniel Wellington Petite 28mm Rose Gold", price: "$189" }, mid: { store: "Amazon", item: "Fossil Jacqueline Rose Gold Watch", price: "$90" }, budget: { store: "Amazon", item: "CIVO Women's Rose Gold Mesh Watch", price: "$24" } } },
      { title: "Jewelry", detail: "Dainty gold layered necklaces. Small hoop or pearl stud earrings. A thin bangle or two.", shop: { luxury: { store: "Mejuri", item: "Bold Link Chain + Pendant Set", price: "$230" }, mid: { store: "Nordstrom", item: "Gorjana Layered Necklace Set", price: "$65" }, budget: { store: "Amazon", item: "PAVOI 14K Layered Chain Necklace Set", price: "$14" } } },
      { title: "Bag", detail: "A structured mini crossbody or clutch in nude leather or soft pink.", tip: "Match metals — rose gold watch with rose gold bag hardware", shop: { luxury: { store: "Nordstrom", item: "Saint Laurent Kate Chain Bag", price: "$2,150" }, mid: { store: "Coach Outlet", item: "Mini Skinny Crossbody in Blush", price: "$89" }, budget: { store: "Amazon", item: "CLUCI Small Crossbody Bag Nude", price: "$22" } } },
      { title: "Finishing Touches", detail: "A silk scarf tied loosely around the neck or hair. Soft fragrance with notes of peony and vanilla.", shop: { luxury: { store: "Sephora", item: "Miss Dior Blooming Bouquet EDT", price: "$110" }, mid: { store: "Ulta", item: "Ariana Grande Cloud EDP", price: "$45" }, budget: { store: "Amazon", item: "Body Fantasies Cherry Blossom Body Spray", price: "$5" } } },
    ],
  },
  "Golden Hour": {
    makeup: [
      { title: "Bronzed Base", detail: "Use a luminous foundation. Warm up the complexion with a golden bronzer on cheekbones, temples, and jawline.", shop: { luxury: { store: "Sephora", item: "Tom Ford Shade & Illuminate Glow", price: "$90" }, mid: { store: "Ulta", item: "Physician's Formula Butter Bronzer", price: "$16" }, budget: { store: "Amazon", item: "e.l.f. Putty Bronzer", price: "$7" } } },
      { title: "Golden Eyes", detail: "Apply a warm copper shadow on lids with gold shimmer in the center. Blend a warm brown into the crease.", tip: "Wet your brush for maximum gold payoff", shop: { luxury: { store: "Sephora", item: "Pat McGrath Mothership V Bronze Seduction", price: "$128" }, mid: { store: "Ulta", item: "Urban Decay Naked Honey Palette", price: "$27" }, budget: { store: "Amazon", item: "Maybelline The 24K Nudes Palette", price: "$10" } } },
      { title: "Sun-Kissed Cheeks", detail: "A warm peach blush blended upward. Top with a gold liquid highlighter on the high points.", shop: { luxury: { store: "Sephora", item: "Rare Beauty Warm Wishes Bronzer Stick", price: "$30" }, mid: { store: "Ulta", item: "Milani Baked Blush in Bellissimo Bronze", price: "$10" }, budget: { store: "Target", item: "e.l.f. Liquid Highlighter in Golden Glow", price: "$5" } } },
      { title: "Warm Lips", detail: "A terracotta or warm nude lip liner with a glossy caramel lip gloss.", shop: { luxury: { store: "Nordstrom", item: "Gucci Rouge à Lèvres in Goldie Red", price: "$42" }, mid: { store: "Ulta", item: "NYX Butter Gloss in Madeleine", price: "$6" }, budget: { store: "Amazon", item: "Revlon Super Lustrous Lip Gloss in Rosy Future", price: "$5" } } },
    ],
    top: [
      { title: "Statement Piece", detail: "A rust, burnt orange, or golden-mustard satin blouse. Flowy sleeves add movement.", tip: "Earth tones mirror the golden hour palette", shop: { luxury: { store: "Net-a-Porter", item: "Ulla Johnson Ruched Satin Blouse Rust", price: "$395" }, mid: { store: "Zara", item: "Satin Effect Shirt in Mustard", price: "$50" }, budget: { store: "Shein", item: "Lantern Sleeve Satin Top in Rust", price: "$15" } } },
      { title: "Layer Option", detail: "A camel or cognac suede jacket. Or a lightweight linen blazer in warm sand.", shop: { luxury: { store: "Nordstrom", item: "AllSaints Suede Moto Jacket Tan", price: "$549" }, mid: { store: "Mango", item: "Suede Effect Jacket in Cognac", price: "$120" }, budget: { store: "Amazon", item: "Levi's Faux Suede Moto Jacket", price: "$45" } } },
    ],
    bottom: [
      { title: "Denim", detail: "High-waisted straight-leg jeans in a warm medium wash. Slightly cropped to show ankle.", shop: { luxury: { store: "Nordstrom", item: "Citizens of Humanity Daphne Crop Jeans", price: "$228" }, mid: { store: "Aritzia", item: "Abercrombie 90s Straight Jean", price: "$90" }, budget: { store: "Target", item: "Universal Thread High-Rise Straight Jeans", price: "$28" } } },
      { title: "Alternative: Linen", detail: "Wide-leg linen pants in terracotta or warm beige for a breezy elevated feel.", shop: { luxury: { store: "Reformation", item: "Petites Linen Wide Leg in Sand", price: "$148" }, mid: { store: "Zara", item: "Linen Blend Wide Leg Trousers", price: "$50" }, budget: { store: "H&M", item: "Linen-Blend Pull-On Pants", price: "$25" } } },
    ],
    shoes: [
      { title: "Boots", detail: "Suede ankle boots in cognac or tan. A western-inspired heel adds character.", shop: { luxury: { store: "Nordstrom", item: "Isabel Marant Dicker Suede Boot", price: "$690" }, mid: { store: "DSW", item: "Dolce Vita Silma Western Boot", price: "$130" }, budget: { store: "Target", item: "Universal Thread Western Ankle Boot", price: "$35" } } },
      { title: "Socks", detail: "Ribbed cotton socks in cream or tan that peek above the boot.", tip: "Visible socks with boots is a styling move — lean into it", shop: { luxury: { store: "Nordstrom", item: "Hansel from Basel Ribbed Crew Socks", price: "$18" }, mid: { store: "Madewell", item: "Ribbed Ankle Socks 2-Pack", price: "$14" }, budget: { store: "Amazon", item: "Hanes Women's Ribbed Crew Socks 6pk", price: "$9" } } },
      { title: "Alternative: Sandals", detail: "Leather flat sandals with gold buckle details for a warmer day.", shop: { luxury: { store: "Nordstrom", item: "Ancient Greek Sandals Desmos Gold", price: "$230" }, mid: { store: "DSW", item: "Steve Madden Travel Flat Sandal", price: "$60" }, budget: { store: "Amazon", item: "Amazon Essentials Flat Strap Sandal", price: "$18" } } },
    ],
    accessories: [
      { title: "Watch", detail: "A gold-tone watch with a leather strap in cognac or honey brown.", shop: { luxury: { store: "Nordstrom", item: "Shinola Canfield 38mm Gold", price: "$550" }, mid: { store: "Amazon", item: "Fossil Heritage Automatic Gold", price: "$175" }, budget: { store: "Amazon", item: "Timex Weekender 38mm Leather Strap", price: "$35" } } },
      { title: "Jewelry", detail: "Chunky gold hoops. Stacked gold rings. A bold chain necklace or pendant.", shop: { luxury: { store: "Mejuri", item: "Croissant Dome Hoops in Gold", price: "$125" }, mid: { store: "Nordstrom", item: "BaubleBar Dalilah Hoop Earrings", price: "$42" }, budget: { store: "Amazon", item: "PAVOI 14K Gold Chunky Hoops", price: "$14" } } },
      { title: "Bag", detail: "A woven straw tote or structured saddle bag in tan leather.", tip: "Woven textures scream golden hour", shop: { luxury: { store: "Net-a-Porter", item: "Loewe Basket Bag Small", price: "$690" }, mid: { store: "Madewell", item: "The Sydney Straw Crossbody", price: "$78" }, budget: { store: "Amazon", item: "Straw Woven Tote Beach Bag", price: "$20" } } },
      { title: "Extras", detail: "Tortoiseshell sunglasses. A woven belt in warm leather. A light scent with amber and sandalwood.", shop: { luxury: { store: "Sephora", item: "Le Labo Santal 33 EDP", price: "$310" }, mid: { store: "Ulta", item: "Sol de Janeiro Cheirosa '62 Body Mist", price: "$35" }, budget: { store: "Amazon", item: "Raw Spirit Wild Fire EDP Rollerball", price: "$15" } } },
    ],
  },
  "Berry Chic": {
    makeup: [
      { title: "Flawless Base", detail: "A matte full-coverage foundation. Set with translucent powder for a porcelain finish.", shop: { luxury: { store: "Sephora", item: "Lancôme Teint Idole Ultra Foundation", price: "$52" }, mid: { store: "Ulta", item: "Fenty Beauty Pro Filt'r Matte Foundation", price: "$40" }, budget: { store: "Target", item: "Maybelline SuperStay Full Coverage", price: "$12" } } },
      { title: "Minimal Eyes", detail: "A wash of mauve on the lids. Tight-line upper lash with dark brown. Lots of mascara.", tip: "Keep eyes minimal to let the lip be the star", shop: { luxury: { store: "Sephora", item: "Chanel Les 4 Ombres in Douceur", price: "$65" }, mid: { store: "Ulta", item: "ColourPop Lilac You A Lot Palette", price: "$14" }, budget: { store: "Amazon", item: "e.l.f. Bite Size Eyeshadow Rose Water", price: "$3" } } },
      { title: "Sculpted Cheeks", detail: "A cool-toned mauve blush. Subtle highlight on the cheekbones only.", shop: { luxury: { store: "Sephora", item: "Hourglass Ambient Lighting Blush in Mood Exposure", price: "$42" }, mid: { store: "Ulta", item: "Tarte Amazonian Clay Blush in Exposed", price: "$29" }, budget: { store: "Amazon", item: "Wet n Wild Color Icon Blush in Mellow Wine", price: "$4" } } },
      { title: "Bold Berry Lip", detail: "Line with a deep berry liner. Fill with a matte berry or plum lipstick. Blot and reapply for intensity.", shop: { luxury: { store: "Nordstrom", item: "YSL Tatouage Couture in Berry Cult", price: "$40" }, mid: { store: "Ulta", item: "MAC Retro Matte in Flat Out Fabulous", price: "$22" }, budget: { store: "Target", item: "NYX Suede Matte in Girl, Bye", price: "$8" } } },
    ],
    top: [
      { title: "Statement Top", detail: "A black fitted turtleneck or a deep plum silk button-up. Clean lines, rich tones.", tip: "Black lets the berry lip and accessories pop", shop: { luxury: { store: "Net-a-Porter", item: "The Row Funnel-Neck Top in Black", price: "$490" }, mid: { store: "Zara", item: "Fitted Turtleneck Knit in Black", price: "$36" }, budget: { store: "Uniqlo", item: "Heattech Turtleneck Long-Sleeve", price: "$15" } } },
      { title: "Layer", detail: "A structured black blazer or a deep burgundy leather jacket for edge.", shop: { luxury: { store: "Nordstrom", item: "Saint Laurent Double Breasted Blazer", price: "$2,890" }, mid: { store: "Zara", item: "Faux Leather Biker Jacket Burgundy", price: "$80" }, budget: { store: "Amazon", item: "Fahsyee Faux Leather Moto Jacket", price: "$40" } } },
    ],
    bottom: [
      { title: "Tailored Pants", detail: "Black high-waisted cigarette trousers or tailored straight-leg pants.", shop: { luxury: { store: "Nordstrom", item: "Theory Demitria Good Wool Trousers", price: "$295" }, mid: { store: "Aritzia", item: "Babaton Cohen Pant in Black", price: "$120" }, budget: { store: "H&M", item: "Slim-Fit Tailored Trousers", price: "$28" } } },
      { title: "Alternative: Skirt", detail: "A black leather midi skirt or a plum-toned pencil skirt for a bold silhouette.", shop: { luxury: { store: "Net-a-Porter", item: "Totême Leather Midi Skirt", price: "$1,100" }, mid: { store: "Zara", item: "Faux Leather Midi Skirt in Black", price: "$50" }, budget: { store: "Amazon", item: "EXCHIC Faux Leather Pencil Skirt", price: "$18" } } },
    ],
    shoes: [
      { title: "Heels", detail: "Black pointed-toe stilettos or kitten heels. Patent leather adds drama.", shop: { luxury: { store: "Nordstrom", item: "Christian Louboutin So Kate Patent Pump", price: "$795" }, mid: { store: "DSW", item: "Nine West Tatiana Pump Patent", price: "$89" }, budget: { store: "Amazon", item: "DREAM PAIRS Pointed Toe Stiletto Pump", price: "$30" } } },
      { title: "Socks", detail: "Sheer black socks with subtle pattern or lace trim for a fashion-forward touch.", shop: { luxury: { store: "Nordstrom", item: "Wolford Lace Knee-High Socks", price: "$38" }, mid: { store: "Nordstrom", item: "FALKE Sheer Dot Ankle Socks", price: "$16" }, budget: { store: "Amazon", item: "VIVILADY Sheer Lace Ankle Socks 5pk", price: "$10" } } },
      { title: "Alternative: Boots", detail: "Black leather knee-high boots. Sleek silhouette, minimal hardware.", shop: { luxury: { store: "Nordstrom", item: "Khaite Marfa Knee-High Boot", price: "$1,490" }, mid: { store: "DSW", item: "Vince Camuto Phranzie Knee Boot", price: "$180" }, budget: { store: "Amazon", item: "DREAM PAIRS Knee-High Riding Boot", price: "$40" } } },
    ],
    accessories: [
      { title: "Watch", detail: "A silver or gunmetal watch with a black face. Bold and architectural.", shop: { luxury: { store: "Nordstrom", item: "TAG Heuer Carrera 29mm Silver/Black", price: "$2,350" }, mid: { store: "Amazon", item: "MVMT Boulevard Gunmetal Watch", price: "$128" }, budget: { store: "Amazon", item: "Casio Classic Women's Silver Watch", price: "$18" } } },
      { title: "Jewelry", detail: "Silver geometric earrings. A single statement ring. Minimal but impactful.", tip: "Silver and berry tones are a power combination", shop: { luxury: { store: "Mejuri", item: "Sculptural Hoops in Silver", price: "$95" }, mid: { store: "Nordstrom", item: "Jenny Bird Ada Earrings Silver", price: "$50" }, budget: { store: "Amazon", item: "PAVOI Sterling Silver Geometric Studs", price: "$12" } } },
      { title: "Bag", detail: "A structured black leather envelope clutch or a mini top-handle bag.", shop: { luxury: { store: "Nordstrom", item: "Bottega Veneta Cassette Bag Black", price: "$3,200" }, mid: { store: "Coach Outlet", item: "Mini Top Handle Bag in Black", price: "$120" }, budget: { store: "Amazon", item: "CHARMING TAILOR Envelope Clutch Black", price: "$17" } } },
      { title: "Finishing", detail: "A dark berry nail polish. A bold, moody perfume with black cherry and cedar notes.", shop: { luxury: { store: "Sephora", item: "Tom Ford Lost Cherry EDP", price: "$190" }, mid: { store: "Ulta", item: "Viktor & Rolf Bon Bon EDP", price: "$65" }, budget: { store: "Amazon", item: "Zara Red Temptation EDP", price: "$20" } } },
    ],
  },
  // ═══ NEW LOOKS ═══
  "Urban Edge": {
    makeup: [
      { title: "Clean Base", detail: "Skip heavy foundation. Use a tinted moisturizer or BB cream for a natural, unfussy base.", shop: { luxury: { store: "Sephora", item: "Laura Mercier Tinted Moisturizer", price: "$49" }, mid: { store: "Ulta", item: "Maybelline Dream Fresh BB Cream", price: "$9" }, budget: { store: "Amazon", item: "e.l.f. Camo CC Cream", price: "$7" } } },
      { title: "Bold Brows", detail: "Fill in brows with a pencil or pomade for a strong, defined arch. Brush up with clear gel.", tip: "Strong brows anchor the whole streetwear look", shop: { luxury: { store: "Sephora", item: "Anastasia Brow Wiz + Clear Gel Set", price: "$44" }, mid: { store: "Ulta", item: "NYX Micro Brow Pencil", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. Wow Brow Gel", price: "$4" } } },
      { title: "Subtle Eyes", detail: "A matte brown shadow in the crease. Tight-line with dark liner. Waterproof mascara for all-day wear.", shop: { luxury: { store: "Sephora", item: "MAC Eye Kohl in Teddy", price: "$23" }, mid: { store: "Ulta", item: "Maybelline Lash Sensational Mascara", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. No Budge Retractable Liner", price: "$4" } } },
      { title: "Lip Balm & Go", detail: "A tinted lip balm in a nude or berry shade. Keep it low-key — the outfit does the talking.", shop: { luxury: { store: "Sephora", item: "Dior Lip Glow Balm in Rose", price: "$40" }, mid: { store: "Ulta", item: "Burt's Bees Tinted Lip Balm", price: "$6" }, budget: { store: "Amazon", item: "Chapstick Total Hydration Tinted", price: "$4" } } },
    ],
    top: [
      { title: "Graphic Tee", detail: "An oversized vintage-wash graphic tee. Band tees, retro logos, or abstract prints.", tip: "Size up 1-2 sizes for the right oversized drape", shop: { luxury: { store: "SSENSE", item: "Balenciaga Oversized Logo Tee", price: "$695" }, mid: { store: "Urban Outfitters", item: "BDG Washed Graphic Tee", price: "$39" }, budget: { store: "H&M", item: "Oversized Printed T-Shirt", price: "$15" } } },
      { title: "Hoodie Layer", detail: "A heavyweight hoodie in black, charcoal, or earth tone. Zip-up or pullover — both work.", shop: { luxury: { store: "SSENSE", item: "Fear of God Essentials Hoodie", price: "$160" }, mid: { store: "Nike", item: "Nike Sportswear Club Fleece Hoodie", price: "$60" }, budget: { store: "Amazon", item: "Hanes EcoSmart Pullover Hoodie", price: "$16" } } },
      { title: "Outerwear", detail: "A puffer vest or oversized bomber jacket. Go for black, olive, or a bold color pop.", shop: { luxury: { store: "Nordstrom", item: "The North Face 1996 Retro Nuptse Vest", price: "$220" }, mid: { store: "Zara", item: "Oversized Bomber Jacket", price: "$70" }, budget: { store: "Amazon", item: "Amazon Essentials Puffer Vest", price: "$28" } } },
    ],
    bottom: [
      { title: "Cargo Pants", detail: "Relaxed-fit cargo pants in black, olive, or khaki. Multiple pockets are key.", shop: { luxury: { store: "SSENSE", item: "Stone Island Cargo Pants", price: "$425" }, mid: { store: "Urban Outfitters", item: "BDG Y2K Low-Rise Cargo Pant", price: "$59" }, budget: { store: "Amazon", item: "Match Men's Wild Cargo Pants", price: "$28" } } },
      { title: "Alternative: Baggy Jeans", detail: "Wide-leg or baggy jeans in medium or light wash. Stacked or cuffed at the ankle.", tip: "Stack jeans over your sneakers for the authentic look", shop: { luxury: { store: "Nordstrom", item: "AGOLDE Criss Cross Wide Leg Jeans", price: "$228" }, mid: { store: "Levi's", item: "Levi's Baggy Dad Jean", price: "$80" }, budget: { store: "Target", item: "Wild Fable High Rise Baggy Jeans", price: "$25" } } },
    ],
    shoes: [
      { title: "Sneakers", detail: "Chunky sneakers or retro runners. Air Force 1s, New Balance 550s, or Dunks.", shop: { luxury: { store: "Nike", item: "Nike Dunk Low Retro", price: "$115" }, mid: { store: "New Balance", item: "New Balance 550", price: "$110" }, budget: { store: "Amazon", item: "Reebok Classic Club C 85", price: "$55" } } },
      { title: "Socks", detail: "Crew-length white or black athletic socks. Visible above the sneaker is the move.", tip: "Nike or branded crew socks are a statement piece in streetwear", shop: { luxury: { store: "Nordstrom", item: "Nike Everyday Cushion Crew 6pk", price: "$24" }, mid: { store: "Nike", item: "Nike Dri-FIT Crew Socks 3pk", price: "$16" }, budget: { store: "Amazon", item: "Fruit of the Loom Crew Socks 12pk", price: "$12" } } },
      { title: "Alternative: Boots", detail: "Tactical-style boots or Chelsea boots in black. Dr. Martens or military-inspired.", shop: { luxury: { store: "Nordstrom", item: "Bottega Veneta Tire Chelsea Boot", price: "$1,200" }, mid: { store: "Dr. Martens", item: "Dr. Martens 1460 Boot Black", price: "$150" }, budget: { store: "Amazon", item: "Bruno Marc Military Combat Boots", price: "$35" } } },
    ],
    accessories: [
      { title: "Cap", detail: "A fitted or snapback cap. Dad hats in neutral tones or branded caps.", shop: { luxury: { store: "SSENSE", item: "Acne Studios Logo Cap", price: "$150" }, mid: { store: "Urban Outfitters", item: "New Era 9FORTY Cap", price: "$30" }, budget: { store: "Amazon", item: "Nike Heritage86 Cap", price: "$18" } } },
      { title: "Chain & Jewelry", detail: "A silver or gold Cuban link chain. Simple stud earrings or a signet ring.", shop: { luxury: { store: "Mejuri", item: "Bold Cuban Link Chain 18K", price: "$290" }, mid: { store: "Amazon", item: "PROSTEEL Cuban Link Chain 18K Plated", price: "$25" }, budget: { store: "Amazon", item: "HZMAN Stainless Steel Cuban Chain", price: "$12" } } },
      { title: "Backpack / Bag", detail: "A mini backpack or crossbody sling bag. Black nylon or tech fabric.", shop: { luxury: { store: "Nordstrom", item: "Prada Re-Nylon Mini Backpack", price: "$1,350" }, mid: { store: "Nike", item: "Nike Heritage Crossbody Bag", price: "$35" }, budget: { store: "Amazon", item: "Carhartt Crossbody Bag", price: "$20" } } },
      { title: "Watch", detail: "A digital watch or a G-Shock in black. Functional and rugged.", shop: { luxury: { store: "Nordstrom", item: "G-Shock Full Metal GMW-B5000", price: "$550" }, mid: { store: "Amazon", item: "Casio G-Shock DW5600", price: "$50" }, budget: { store: "Amazon", item: "Casio F-91W Classic Digital Watch", price: "$15" } } },
    ],
  },
  "Clean Slate": {
    makeup: [
      { title: "Skin-First Base", detail: "A tinted serum or light skin tint. Focus on skincare so you need minimal coverage.", tip: "Glass skin starts with hydration — layer serums before makeup", shop: { luxury: { store: "Sephora", item: "Kosas Tinted Face Oil", price: "$42" }, mid: { store: "Ulta", item: "Glossier Stretch Concealer", price: "$22" }, budget: { store: "Amazon", item: "CeraVe Hydrating Tinted SPF Cream", price: "$16" } } },
      { title: "Clean Brows & Lashes", detail: "Groom brows with a clear gel. One coat of brown or clear mascara for definition.", shop: { luxury: { store: "Sephora", item: "Chanel Boy de Chanel Brow Gel", price: "$38" }, mid: { store: "Ulta", item: "Benefit Gimme Brow+", price: "$26" }, budget: { store: "Amazon", item: "e.l.f. Brow Lift Gel", price: "$5" } } },
      { title: "Natural Flush", detail: "A cream blush in peach or soft rose. Apply with fingers for a natural, dewy finish.", shop: { luxury: { store: "Sephora", item: "Rare Beauty Soft Pinch Liquid Blush", price: "$23" }, mid: { store: "Ulta", item: "Milk Makeup Lip + Cheek Stick", price: "$18" }, budget: { store: "Amazon", item: "Flower Beauty Blush Bomb in Pinch Me", price: "$10" } } },
      { title: "Lip Treatment", detail: "A clear or tinted lip oil for a glossy, effortless finish.", shop: { luxury: { store: "Sephora", item: "Dior Lip Oil in Rosewood", price: "$38" }, mid: { store: "Ulta", item: "NYX Fat Oil Lip Drip", price: "$9" }, budget: { store: "Amazon", item: "Burt's Bees Lip Shimmer", price: "$5" } } },
    ],
    top: [
      { title: "Essential Tee", detail: "A perfectly fitted crewneck tee in white, black, oatmeal, or navy. Premium cotton with a clean neckline.", tip: "The whole minimalist look depends on fit — nothing baggy, nothing tight", shop: { luxury: { store: "Nordstrom", item: "The Row Wesler Cotton Tee", price: "$280" }, mid: { store: "Everlane", item: "The Organic Cotton Crew", price: "$30" }, budget: { store: "Uniqlo", item: "Uniqlo U Crew Neck Short Sleeve", price: "$15" } } },
      { title: "Structured Layer", detail: "A relaxed-fit wool coat or unstructured blazer in camel, grey, or black. No logos, no fuss.", shop: { luxury: { store: "Net-a-Porter", item: "Totême Signature Wool Coat Camel", price: "$1,190" }, mid: { store: "COS", item: "Relaxed-Fit Wool Blazer", price: "$175" }, budget: { store: "H&M", item: "Single-Breasted Coat in Beige", price: "$50" } } },
    ],
    bottom: [
      { title: "Tailored Trousers", detail: "High-waisted straight or wide-leg trousers in black, grey, or cream. Clean press lines.", shop: { luxury: { store: "Net-a-Porter", item: "Totême Pleated Wide-Leg Trousers", price: "$450" }, mid: { store: "COS", item: "Pleated Wide-Leg Trousers", price: "$115" }, budget: { store: "Uniqlo", item: "Smart Ankle Pants 2-Way Stretch", price: "$40" } } },
      { title: "Alternative: Clean Denim", detail: "Dark indigo or black straight-leg jeans with no distressing. Simple and refined.", shop: { luxury: { store: "Nordstrom", item: "TOTEME Original Denim in Dark Blue", price: "$280" }, mid: { store: "Everlane", item: "The Way-High Jean in Black", price: "$78" }, budget: { store: "Uniqlo", item: "Slim Straight High Rise Jeans", price: "$40" } } },
    ],
    shoes: [
      { title: "Clean Sneakers", detail: "All-white leather sneakers. Simple silhouette — Common Projects, Stan Smiths, or similar.", shop: { luxury: { store: "Nordstrom", item: "Common Projects Original Achilles Low", price: "$435" }, mid: { store: "Adidas", item: "Stan Smith White/Green", price: "$100" }, budget: { store: "Amazon", item: "Amazon Essentials Casual Lace-Up Sneaker", price: "$25" } } },
      { title: "Socks", detail: "No-show socks in white or nude. Invisible is the goal.", shop: { luxury: { store: "Nordstrom", item: "Falke Cool Kick No-Show Socks", price: "$20" }, mid: { store: "Uniqlo", item: "Short No-Show Socks 3pk", price: "$10" }, budget: { store: "Amazon", item: "WANDER No Show Socks 8pk", price: "$12" } } },
      { title: "Alternative: Loafers", detail: "Black or tan leather loafers. Penny or horsebit style for quiet sophistication.", shop: { luxury: { store: "Nordstrom", item: "The Row Adam Loafer", price: "$990" }, mid: { store: "Mango", item: "Leather Penny Loafers", price: "$90" }, budget: { store: "Amazon", item: "Amazon Essentials Penny Loafer", price: "$30" } } },
    ],
    accessories: [
      { title: "Watch", detail: "An ultra-thin watch with a clean face. White or black dial, leather or mesh band.", shop: { luxury: { store: "Nordstrom", item: "Junghans Max Bill 34mm", price: "$795" }, mid: { store: "Amazon", item: "Skagen Signatur Slim Watch", price: "$95" }, budget: { store: "Amazon", item: "BUREI Ultra Thin Minimalist Watch", price: "$30" } } },
      { title: "Bag", detail: "A structured tote or minimal leather crossbody in black, tan, or grey.", tip: "One bag, one color, zero logos — that's minimalism", shop: { luxury: { store: "Net-a-Porter", item: "The Row N/S Park Tote", price: "$1,790" }, mid: { store: "COS", item: "Leather Crossbody Bag", price: "$120" }, budget: { store: "Amazon", item: "Madewell Transport Tote Dupe", price: "$30" } } },
      { title: "Jewelry", detail: "A single thin gold chain or small studs. Less is more — one piece at a time.", shop: { luxury: { store: "Mejuri", item: "Box Chain Necklace 14K Gold", price: "$175" }, mid: { store: "Nordstrom", item: "Gorjana Parker Chain Necklace", price: "$48" }, budget: { store: "Amazon", item: "PAVOI 14K Gold Thin Chain Necklace", price: "$14" } } },
      { title: "Sunglasses", detail: "Simple rectangular or oval frames in black or tortoise. Clean and timeless.", shop: { luxury: { store: "Nordstrom", item: "Celine Triomphe Oval Sunglasses", price: "$460" }, mid: { store: "Amazon", item: "Ray-Ban RB2140 Wayfarer", price: "$163" }, budget: { store: "Amazon", item: "SOJOS Classic Rectangular Sunglasses", price: "$15" } } },
    ],
  },
  "Retro Revival": {
    makeup: [
      { title: "Retro Base", detail: "A satin-finish medium coverage foundation. Set with pressed powder for a vintage matte look.", shop: { luxury: { store: "Sephora", item: "Charlotte Tilbury Airbrush Flawless Foundation", price: "$46" }, mid: { store: "Ulta", item: "L'Oréal Infallible 24H Fresh Wear", price: "$16" }, budget: { store: "Target", item: "Covergirl Clean Fresh Skin Milk", price: "$10" } } },
      { title: "Cat Eye", detail: "A sharp winged liner in jet black. Start thin at inner corner, flick out at the end.", tip: "Use tape as a guide for a perfect wing", shop: { luxury: { store: "Sephora", item: "Stila Stay All Day Waterproof Liner", price: "$24" }, mid: { store: "Ulta", item: "NYX Epic Ink Liner", price: "$9" }, budget: { store: "Amazon", item: "Maybelline Hyper Easy Liquid Liner", price: "$8" } } },
      { title: "Warm Blush", detail: "A peachy-coral powder blush high on the cheekbones for a 70s sun-kissed look.", shop: { luxury: { store: "Sephora", item: "NARS Blush in Orgasm", price: "$34" }, mid: { store: "Ulta", item: "Milani Baked Blush in Corallina", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. Primer-Infused Blush in Always Rosy", price: "$6" } } },
      { title: "Red Lip", detail: "A classic red lipstick — warm red for warm undertones, blue-red for cool.", shop: { luxury: { store: "Nordstrom", item: "MAC Ruby Woo Retro Matte Lipstick", price: "$22" }, mid: { store: "Ulta", item: "Revlon Super Lustrous in Certainly Red", price: "$9" }, budget: { store: "Amazon", item: "Maybelline Color Sensational in Red Revival", price: "$6" } } },
    ],
    top: [
      { title: "Vintage Blouse", detail: "A floral or paisley print blouse with bell sleeves or a pussybow collar. Rich, saturated colors.", tip: "Thrift stores are gold mines for authentic vintage blouses", shop: { luxury: { store: "Reformation", item: "Valentina Blouse in Florals", price: "$178" }, mid: { store: "Free People", item: "Printed Peasant Blouse", price: "$68" }, budget: { store: "Amazon", item: "Romwe Floral Print Blouse Boho", price: "$18" } } },
      { title: "Corduroy Jacket", detail: "A cropped corduroy jacket in mustard, rust, or forest green. Wide-wale for authentic 70s feel.", shop: { luxury: { store: "Nordstrom", item: "MOTHER The Bruiser Corduroy Jacket", price: "$325" }, mid: { store: "Madewell", item: "Corduroy Crop Jacket", price: "$128" }, budget: { store: "Amazon", item: "Wrangler Corduroy Trucker Jacket", price: "$35" } } },
    ],
    bottom: [
      { title: "Flare Jeans", detail: "High-waisted flare or bootcut jeans in medium or dark wash. The signature 70s silhouette.", shop: { luxury: { store: "Nordstrom", item: "Citizens of Humanity Lilah Flare", price: "$228" }, mid: { store: "Levi's", item: "Levi's 726 High Rise Flare", price: "$80" }, budget: { store: "Target", item: "Wild Fable High Rise Flare Jeans", price: "$25" } } },
      { title: "Alternative: A-Line Skirt", detail: "A high-waisted corduroy or plaid A-line mini skirt. Very 60s mod.", shop: { luxury: { store: "Net-a-Porter", item: "Miu Miu Plaid Wool Mini Skirt", price: "$890" }, mid: { store: "Urban Outfitters", item: "BDG Corduroy Mini Skirt", price: "$49" }, budget: { store: "Amazon", item: "SheIn Plaid A-Line Mini Skirt", price: "$18" } } },
    ],
    shoes: [
      { title: "Platform Shoes", detail: "Platform boots, clogs, or chunky-heeled sandals. 70s-inspired height and texture.", shop: { luxury: { store: "Nordstrom", item: "Celine Platform Chelsea Boot", price: "$1,250" }, mid: { store: "Free People", item: "Harlow Platform Clog", price: "$168" }, budget: { store: "Amazon", item: "Soda Lug Sole Platform Chelsea Boot", price: "$35" } } },
      { title: "Socks", detail: "Patterned knee-high socks or colorful tights under skirts. Argyle or striped for extra retro.", shop: { luxury: { store: "Nordstrom", item: "Ganni Recycled Wool Knee-High Socks", price: "$45" }, mid: { store: "Urban Outfitters", item: "Patterned Knee-High Socks", price: "$12" }, budget: { store: "Amazon", item: "ANECO Vintage Knee-High Socks 4pk", price: "$13" } } },
      { title: "Alternative: Mary Janes", detail: "Chunky-soled Mary Janes in patent black or burgundy. Retro schoolgirl meets mod.", shop: { luxury: { store: "Nordstrom", item: "Prada Brushed Leather Mary Jane", price: "$1,050" }, mid: { store: "DSW", item: "Steve Madden Darci Platform Mary Jane", price: "$90" }, budget: { store: "Amazon", item: "DREAM PAIRS Platform Mary Jane Shoes", price: "$35" } } },
    ],
    accessories: [
      { title: "Oversized Sunglasses", detail: "Big round or square frames in tortoiseshell, amber, or colored lenses.", shop: { luxury: { store: "Nordstrom", item: "Gucci Round Oversized Sunglasses", price: "$420" }, mid: { store: "Amazon", item: "Ray-Ban RB4171 Erika Vintage", price: "$139" }, budget: { store: "Amazon", item: "FEISEDY Retro Round Oversized Sunglasses", price: "$13" } } },
      { title: "Headscarf / Bandana", detail: "A silk scarf worn as a headband, wrapped around the head, or tied in the hair.", shop: { luxury: { store: "Nordstrom", item: "Gucci GG Silk Scarf", price: "$350" }, mid: { store: "Free People", item: "Printed Silk Bandana", price: "$28" }, budget: { store: "Amazon", item: "LOHUKA Satin Silk Head Scarf 4pk", price: "$10" } } },
      { title: "Fringe Bag", detail: "A suede crossbody with fringe detail. Or a woven macramé bag for boho vibes.", shop: { luxury: { store: "Net-a-Porter", item: "Saint Laurent Kate Fringe Bag", price: "$2,490" }, mid: { store: "Free People", item: "Suede Fringe Crossbody", price: "$78" }, budget: { store: "Amazon", item: "Western Fringe Crossbody Bag", price: "$22" } } },
      { title: "Watch & Jewelry", detail: "A vintage-style gold watch. Layered gold medallion necklaces. Hoop earrings.", shop: { luxury: { store: "Nordstrom", item: "Cartier Tank Must Watch", price: "$2,720" }, mid: { store: "Amazon", item: "Timex Marlin Hand-Wind 34mm", price: "$189" }, budget: { store: "Amazon", item: "Casio Vintage A168WG Gold Watch", price: "$25" } } },
    ],
  },
  "Sport Luxe": {
    makeup: [
      { title: "Sweat-Proof Base", detail: "A mattifying primer + a waterproof tinted moisturizer. Skip heavy foundation.", shop: { luxury: { store: "Sephora", item: "Nars Pore & Shine Control Primer", price: "$36" }, mid: { store: "Ulta", item: "NYX Professional Pore Filler Primer", price: "$14" }, budget: { store: "Amazon", item: "e.l.f. Power Grip Primer", price: "$10" } } },
      { title: "Brows & Lashes", detail: "Brush and set brows with tinted gel. Waterproof mascara in brown or black.", shop: { luxury: { store: "Sephora", item: "Glossier Boy Brow + Lash Slick Set", price: "$34" }, mid: { store: "Ulta", item: "Maybelline Brow Fast Sculpt Gel", price: "$9" }, budget: { store: "Amazon", item: "e.l.f. Wow Brow + Big Mood Mascara", price: "$9" } } },
      { title: "Healthy Glow", detail: "Skip blush. Use a cream bronzer on cheeks and nose for a just-worked-out flush.", shop: { luxury: { store: "Sephora", item: "Chanel Les Beiges Bronzing Cream", price: "$58" }, mid: { store: "Ulta", item: "Physicians Formula Butter Bronzer", price: "$16" }, budget: { store: "Target", item: "e.l.f. Putty Bronzer in Tan Lines", price: "$6" } } },
      { title: "Lip Balm", detail: "A hydrating clear or tinted lip balm. Nothing else — keep it fresh.", shop: { luxury: { store: "Sephora", item: "La Mer The Lip Balm", price: "$65" }, mid: { store: "Ulta", item: "Fresh Sugar Lip Treatment SPF 15", price: "$26" }, budget: { store: "Amazon", item: "Aquaphor Lip Repair", price: "$5" } } },
    ],
    top: [
      { title: "Performance Tee", detail: "A fitted moisture-wicking tee or crop top in black, white, or a bold color.", tip: "Look for seamless construction for a sleek silhouette", shop: { luxury: { store: "Nordstrom", item: "Alo Yoga Alosoft Crop Tee", price: "$68" }, mid: { store: "Nike", item: "Nike Dri-FIT One Fitted Crop Top", price: "$35" }, budget: { store: "Amazon", item: "CRZ YOGA Pima Cotton Crop Tee", price: "$20" } } },
      { title: "Track Jacket", detail: "A zip-up track jacket with contrast piping or a cropped puffer. Sporty but elevated.", shop: { luxury: { store: "SSENSE", item: "Adidas x Wales Bonner Track Jacket", price: "$350" }, mid: { store: "Adidas", item: "Adidas Originals Firebird Track Jacket", price: "$80" }, budget: { store: "Amazon", item: "Amazon Essentials Full-Zip Track Jacket", price: "$22" } } },
      { title: "Alternative: Sports Bra as Top", detail: "A longline sports bra with a high neckline, worn solo or under an open jacket.", shop: { luxury: { store: "Nordstrom", item: "Girlfriend Collective Paloma Bra", price: "$48" }, mid: { store: "Nike", item: "Nike Indy Longline Sports Bra", price: "$40" }, budget: { store: "Amazon", item: "CRZ YOGA Longline Sports Bra", price: "$18" } } },
    ],
    bottom: [
      { title: "Joggers", detail: "Tapered joggers in black or grey with a clean cuff. Not sweatpants — joggers with structure.", shop: { luxury: { store: "Nordstrom", item: "Lululemon ABC Jogger", price: "$128" }, mid: { store: "Nike", item: "Nike Sportswear Tech Fleece Jogger", price: "$110" }, budget: { store: "Amazon", item: "Amazon Essentials Fleece Jogger", price: "$18" } } },
      { title: "Alternative: Bike Shorts", detail: "High-waisted bike shorts in black. Paired with an oversized tee or hoodie.", shop: { luxury: { store: "Nordstrom", item: "Alo Yoga High-Waist Biker Short", price: "$62" }, mid: { store: "Nike", item: "Nike One High-Rise Bike Shorts", price: "$45" }, budget: { store: "Amazon", item: "BALEAF High Waist Biker Shorts", price: "$16" } } },
    ],
    shoes: [
      { title: "Running-Inspired Sneakers", detail: "Technical running shoes worn casually. New Balance, On Cloud, ASICS Gel. Neutral or bold colors.", shop: { luxury: { store: "SSENSE", item: "New Balance 2002R Protection Pack", price: "$150" }, mid: { store: "New Balance", item: "New Balance 574 Classic", price: "$90" }, budget: { store: "Amazon", item: "ASICS Gel-Contend 8 Running Shoe", price: "$50" } } },
      { title: "Socks", detail: "Matching athletic crew socks. White on white shoes, black on black.", shop: { luxury: { store: "Nordstrom", item: "On Running Performance Crew Socks", price: "$18" }, mid: { store: "Nike", item: "Nike Everyday Plus Cushion Crew 6pk", price: "$24" }, budget: { store: "Amazon", item: "Saucony Performance Crew Socks 6pk", price: "$15" } } },
      { title: "Alternative: Slides", detail: "Sporty slides for a more casual take. Worn with or without socks.", shop: { luxury: { store: "Nordstrom", item: "Balenciaga Pool Slide", price: "$325" }, mid: { store: "Nike", item: "Nike Victori One Slide", price: "$30" }, budget: { store: "Amazon", item: "Adidas Adilette Shower Slide", price: "$22" } } },
    ],
    accessories: [
      { title: "Smart Watch", detail: "An Apple Watch or fitness tracker. Functional and sporty — the ultimate athleisure accessory.", shop: { luxury: { store: "Apple", item: "Apple Watch Ultra 2", price: "$799" }, mid: { store: "Amazon", item: "Apple Watch SE (2nd Gen)", price: "$249" }, budget: { store: "Amazon", item: "Fitbit Inspire 3", price: "$80" } } },
      { title: "Gym Bag / Belt Bag", detail: "A sleek belt bag or mini duffle. Worn crossbody or at the waist.", tip: "Belt bags keep you hands-free while looking intentional", shop: { luxury: { store: "Nordstrom", item: "Lululemon Everywhere Belt Bag", price: "$38" }, mid: { store: "Nike", item: "Nike Heritage Hip Pack", price: "$25" }, budget: { store: "Amazon", item: "ZORFIN Fanny Pack Crossbody", price: "$12" } } },
      { title: "Cap / Visor", detail: "A performance cap or visor. Clean, unbranded or minimal logo.", shop: { luxury: { store: "Nordstrom", item: "Lululemon Fast & Free Run Hat", price: "$38" }, mid: { store: "Nike", item: "Nike Dri-FIT AeroBill Cap", price: "$28" }, budget: { store: "Amazon", item: "Under Armour Blitzing Hat", price: "$18" } } },
      { title: "Jewelry", detail: "Minimal — small studs or a thin chain that won't snag. Or skip it entirely.", shop: { luxury: { store: "Mejuri", item: "Tiny Studs 14K Gold", price: "$78" }, mid: { store: "Amazon", item: "PAVOI 14K Gold Plated Studs", price: "$12" }, budget: { store: "Amazon", item: "Amazon Essentials Sterling Silver Studs", price: "$8" } } },
    ],
  },
};

// Metadata for saved looks display
export const lookMeta: Record<string, { emoji: string; match: number; desc: string }> = {
  "Soft Glam": { emoji: "🌸", match: 96, desc: "Elegant & refined — silk, rose gold, satin" },
  "Golden Hour": { emoji: "🌅", match: 93, desc: "Warm earth tones — suede, bronze, cognac" },
  "Berry Chic": { emoji: "🍇", match: 89, desc: "Bold & polished — black, berry, silver" },
  "Urban Edge": { emoji: "🔥", match: 94, desc: "Streetwear staples — sneakers, cargos, hoodies" },
  "Clean Slate": { emoji: "🤍", match: 95, desc: "Minimalist essentials — neutrals, clean lines, no logos" },
  "Retro Revival": { emoji: "🕺", match: 91, desc: "Vintage vibes — flares, prints, platforms" },
  "Sport Luxe": { emoji: "🏃", match: 92, desc: "Athletic meets fashion — joggers, sneakers, tech" },
};

// Recommended looks per style category
export const styleLooks: Record<string, { name: string; desc: string; emoji: string; match: number }[]> = {
  "full-style": [
    { name: "Soft Glam", desc: "Elegant & refined — silk, rose gold, satin", emoji: "🌸", match: 96 },
    { name: "Golden Hour", desc: "Warm earth tones — suede, bronze, cognac", emoji: "🌅", match: 93 },
    { name: "Berry Chic", desc: "Bold & polished — black, berry, silver", emoji: "🍇", match: 89 },
  ],
  streetwear: [
    { name: "Urban Edge", desc: "Cargos, sneakers, graphic tees — street ready", emoji: "🔥", match: 94 },
    { name: "Berry Chic", desc: "Dark-toned street style with edge", emoji: "🍇", match: 87 },
    { name: "Sport Luxe", desc: "Athletic streetwear crossover", emoji: "🏃", match: 85 },
  ],
  minimalist: [
    { name: "Clean Slate", desc: "Neutrals, clean lines, zero logos", emoji: "🤍", match: 95 },
    { name: "Soft Glam", desc: "Soft tones with minimal jewelry", emoji: "🌸", match: 90 },
    { name: "Golden Hour", desc: "Warm minimalism with earthy neutrals", emoji: "🌅", match: 88 },
  ],
  vintage: [
    { name: "Retro Revival", desc: "70s flares, prints, platforms, cat-eye", emoji: "🕺", match: 91 },
    { name: "Golden Hour", desc: "Warm vintage-inspired bohemian style", emoji: "🌅", match: 89 },
    { name: "Berry Chic", desc: "90s dark-toned retro with edge", emoji: "🍇", match: 86 },
  ],
  athleisure: [
    { name: "Sport Luxe", desc: "Joggers, sneakers, belt bags — gym to street", emoji: "🏃", match: 92 },
    { name: "Urban Edge", desc: "Sporty streetwear with sneaker culture", emoji: "🔥", match: 88 },
    { name: "Clean Slate", desc: "Minimal athletic — clean sneakers, neutral tones", emoji: "🤍", match: 85 },
  ],
  formal: [
    { name: "Soft Glam", desc: "Soft sophistication for events", emoji: "🌸", match: 97 },
    { name: "Berry Chic", desc: "Power dressing in dark tones", emoji: "🍇", match: 90 },
    { name: "Clean Slate", desc: "Modern minimalist business wear", emoji: "🤍", match: 88 },
  ],
  casual: [
    { name: "Golden Hour", desc: "Relaxed earthy casual look", emoji: "🌅", match: 93 },
    { name: "Clean Slate", desc: "Effortless everyday minimalism", emoji: "🤍", match: 91 },
    { name: "Urban Edge", desc: "Casual streetwear for the weekend", emoji: "🔥", match: 87 },
  ],
  "makeup-only": [
    { name: "Soft Glam", desc: "Natural glow with rose tones", emoji: "🌸", match: 96 },
    { name: "Golden Hour", desc: "Warm bronze with gold highlights", emoji: "🌅", match: 93 },
    { name: "Berry Chic", desc: "Deep berry lips, minimal eyes", emoji: "🍇", match: 89 },
  ],
};

export type Category = "makeup" | "top" | "bottom" | "shoes" | "accessories" | "swimwear" | "lingerie" | "bags";
export type PriceTier = "luxury" | "mid" | "budget";
export type ShopOption = { store: string; item: string; price: string };
export type Step = {
  title: string;
  detail: string;
  tip?: string;
  technique?: string[];
  tools?: string[];
  videoUrl?: string;
  videoLabel?: string;
  shop?: Record<PriceTier, ShopOption>;
};

export const makeupToolsChecklist = [
  { name: "Beauty Sponge", desc: "Dampen & squeeze out water before use — bouncing motion blends foundation seamlessly" },
  { name: "Flat Foundation Brush", desc: "Alternative to sponge — use for fuller coverage; paint in downward strokes" },
  { name: "Fluffy Blending Brush", desc: "For eyeshadow — use windshield-wiper motions in the crease" },
  { name: "Flat Shader Brush", desc: "Pack color onto eyelids — press & pat, don't swipe" },
  { name: "Angled Brush", desc: "For brows, contour, and precise blush placement" },
  { name: "Lip Brush or Finger", desc: "For precise lip application — fingers work great for a natural stain" },
  { name: "Lash Curler", desc: "Clamp at the base of lashes for 10 seconds before mascara" },
  { name: "Setting Spray", desc: "Hold 8 inches away, mist in an X and T pattern over your face" },
];

export const categoryLabels: Record<Category, { label: string }> = {
  makeup: { label: "Makeup" },
  top: { label: "Top & Layers" },
  bottom: { label: "Bottoms" },
  shoes: { label: "Shoes & Socks" },
  accessories: { label: "Accessories" },
  swimwear: { label: "Swimwear" },
  lingerie: { label: "Lingerie & Intimates" },
  bags: { label: "Bags & Purses" },
};

export const categoryOrder: Category[] = ["makeup", "top", "bottom", "shoes", "accessories", "bags", "swimwear", "lingerie"];

export const tierInfo: Record<PriceTier, { label: string; color: string; bg: string }> = {
  luxury: { label: "Luxury", color: "hsl(var(--glamora-gold))", bg: "hsla(var(--glamora-gold) / 0.1)" },
  mid: { label: "Moderate", color: "hsl(var(--glamora-rose-dark))", bg: "hsla(var(--glamora-rose) / 0.1)" },
  budget: { label: "Budget", color: "hsl(var(--glamora-success))", bg: "hsla(var(--glamora-success) / 0.1)" },
};

export const lookData: Record<string, Partial<Record<Category, Step[]>>> = {
  "Soft Glam": {
    makeup: [
      { title: "Prep & Prime", detail: "Apply a hydrating primer with a dewy finish. Focus on T-zone for a natural glow.", tip: "Use a beauty sponge for even application", tools: ["Beauty Sponge", "Clean fingers"], videoUrl: "https://www.youtube.com/results?search_query=how+to+apply+primer+for+beginners", videoLabel: "How to Apply Primer", technique: [
        "Start with a clean, moisturized face — wait 2 minutes after moisturizer so it absorbs",
        "Squeeze a pea-sized amount of primer onto your fingertips",
        "Dot the primer on your forehead, nose, both cheeks, and chin (5 dots)",
        "Gently spread outward from each dot using your fingertips in upward strokes",
        "Pay extra attention to the T-zone (forehead + nose) — this is where you get oily first",
        "Wait 60 seconds for the primer to set before moving to the next step"
      ], shop: { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Wonderglow Primer", price: "$55" }, mid: { store: "Ulta", item: "NYX Marshmallow Primer", price: "$16" }, budget: { store: "Amazon", item: "e.l.f. Jelly Pop Dew Primer", price: "$10" } } },
      { title: "Soft Rose Base", detail: "Blend a light-coverage foundation matched to your skin tone. Conceal under eyes with a shade lighter.", tools: ["Beauty Sponge or Foundation Brush"], videoUrl: "https://www.youtube.com/results?search_query=how+to+apply+foundation+with+beauty+sponge+beginner", videoLabel: "Foundation Application 101", technique: [
        "Match your foundation by testing on your jawline — it should disappear into your skin",
        "Pump one dot of foundation onto the back of your hand",
        "Dip a damp beauty sponge into the product (dampen the sponge first — squeeze out all water)",
        "Bounce (don't drag!) the sponge starting from the center of your face outward",
        "Build coverage where needed — add tiny amounts under eyes, around nose, on any redness",
        "For concealer: dot a small amount in an upside-down triangle under each eye",
        "Bounce the sponge to blend concealer — never rub or drag"
      ], shop: { luxury: { store: "Nordstrom", item: "Armani Luminous Silk Foundation", price: "$65" }, mid: { store: "Ulta", item: "L'Oréal True Match Serum Foundation", price: "$17" }, budget: { store: "Target", item: "Maybelline Fit Me Dewy Foundation", price: "$9" } } },
      { title: "Blush & Highlight", detail: "Sweep a rose-pink blush on the apples of your cheeks. Add a champagne highlighter to cheekbones and nose bridge.", tip: "Smile to find the apples of your cheeks", tools: ["Fluffy Blush Brush", "Fan Brush or Finger"], videoUrl: "https://www.youtube.com/results?search_query=how+to+apply+blush+and+highlighter+beginner", videoLabel: "Blush & Highlight Placement", technique: [
        "Smile wide — see those round parts that pop up? Those are the 'apples' of your cheeks",
        "Tap your brush into the blush, then tap off excess on the back of your hand (less is more!)",
        "Sweep the blush onto the apples in a gentle circular motion, blending upward toward your ear",
        "For highlighter: dab a tiny amount on your fingertip",
        "Press it onto the top of your cheekbones (the bone you feel when you press), the bridge of your nose, and your cupid's bow (the dip above your top lip)",
        "Blend gently — highlighter should look like a natural glow, not a stripe"
      ], shop: { luxury: { store: "Sephora", item: "NARS Orgasm Blush + Highlighter Duo", price: "$40" }, mid: { store: "Ulta", item: "Milani Baked Blush in Luminoso", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. Baked Highlighter + Blush Duo", price: "$8" } } },
      { title: "Soft Eye Look", detail: "Apply a matte nude on the lid, rose shimmer on the center, and blend a soft brown in the crease.", tools: ["Flat Shader Brush", "Fluffy Blending Brush"], videoUrl: "https://www.youtube.com/results?search_query=easy+eyeshadow+tutorial+for+beginners+soft+glam", videoLabel: "Easy Eyeshadow for Beginners", technique: [
        "The 'lid' is your eyelid from lash line to the crease (the fold where your eye socket starts)",
        "The 'crease' is the natural fold above your eyelid — close one eye and feel for the indent",
        "Step 1: Use a flat brush to press the lightest (nude/beige) shade all over your lid",
        "Step 2: With a fluffy brush, pick up the medium brown shade and sweep back and forth in your crease using small windshield-wiper motions",
        "Step 3: Pat the shimmer shade onto the center of your lid with your fingertip for maximum sparkle",
        "Step 4: Blend everything together by sweeping the fluffy brush where colors meet — no harsh lines!",
        "Step 5: Apply mascara — wiggle the wand at the base of your lashes and pull upward"
      ], shop: { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Pillow Talk Palette", price: "$53" }, mid: { store: "Ulta", item: "Anastasia Soft Glam Palette", price: "$29" }, budget: { store: "Amazon", item: "Maybelline The Nudes Palette", price: "$11" } } },
      { title: "Lips & Set", detail: "Line lips with a nude-rose liner. Apply a satin rose lipstick. Set everything with a dewy setting spray.", tools: ["Lip Liner", "Lipstick or Lip Brush"], videoUrl: "https://www.youtube.com/results?search_query=how+to+apply+lipstick+and+lip+liner+beginner", videoLabel: "Lip Liner & Lipstick Guide", technique: [
        "Start with lip liner: begin at the cupid's bow (the V-shape of your upper lip)",
        "Draw small strokes following your natural lip line — don't try to draw one continuous line",
        "Connect the outline all the way around both lips",
        "Fill in with lipstick: start at the center of your lips and press outward",
        "Blot with a tissue — press lips onto tissue once to remove excess",
        "For setting spray: close your eyes, hold 8 inches away, and mist in an X then a T pattern",
        "Let the spray dry naturally — don't touch your face!"
      ], shop: { luxury: { store: "Nordstrom", item: "Tom Ford Lip Color in Pink Dusk", price: "$58" }, mid: { store: "MAC", item: "MAC Matte Lipstick in Velvet Teddy", price: "$22" }, budget: { store: "Target", item: "Revlon Super Lustrous in Pink in the Afternoon", price: "$8" } } },
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
      { title: "Bronzed Base", detail: "Use a luminous foundation. Warm up the complexion with a golden bronzer on cheekbones, temples, and jawline.", tools: ["Beauty Sponge", "Fluffy Bronzer Brush"], videoUrl: "https://www.youtube.com/results?search_query=how+to+apply+bronzer+beginner+natural", videoLabel: "Bronzer Application Guide", technique: [
        "Apply luminous foundation the same way as regular foundation — dot on face, bounce with damp sponge",
        "For bronzer: suck in your cheeks slightly — the hollow is where bronzer goes",
        "Sweep bronzer in a '3' shape on each side: forehead hairline → cheek hollow → jawline",
        "Use a big fluffy brush and tap off excess first — bronzer is very easy to overdo!",
        "Blend in circular motions so there are no harsh lines"
      ], shop: { luxury: { store: "Sephora", item: "Tom Ford Shade & Illuminate Glow", price: "$90" }, mid: { store: "Ulta", item: "Physician's Formula Butter Bronzer", price: "$16" }, budget: { store: "Amazon", item: "e.l.f. Putty Bronzer", price: "$7" } } },
      { title: "Golden Eyes", detail: "Apply a warm copper shadow on lids with gold shimmer in the center. Blend a warm brown into the crease.", tip: "Wet your brush for maximum gold payoff", tools: ["Flat Shader Brush", "Fluffy Blending Brush"], videoUrl: "https://www.youtube.com/results?search_query=gold+copper+eyeshadow+tutorial+beginner", videoLabel: "Gold & Copper Eye Tutorial", technique: [
        "Start by applying eyeshadow primer or concealer on your lids so color sticks better",
        "With a flat brush, press (don't swipe) the copper shade onto your entire eyelid",
        "For the gold shimmer: wet your fingertip, pick up the gold shade, and pat it onto the center of your lid",
        "With a clean fluffy brush, sweep the warm brown shade back and forth in your crease (the fold above your lid)",
        "Keep blending until there's a smooth gradient — no harsh edges",
        "Finish with mascara: wiggle the wand at the base of your lashes and pull upward slowly"
      ], shop: { luxury: { store: "Sephora", item: "Pat McGrath Mothership V Bronze Seduction", price: "$128" }, mid: { store: "Ulta", item: "Urban Decay Naked Honey Palette", price: "$27" }, budget: { store: "Amazon", item: "Maybelline The 24K Nudes Palette", price: "$10" } } },
      { title: "Sun-Kissed Cheeks", detail: "A warm peach blush blended upward. Top with a gold liquid highlighter on the high points.", tools: ["Blush Brush", "Fingertip"], videoUrl: "https://www.youtube.com/results?search_query=peach+blush+liquid+highlighter+tutorial+beginner", videoLabel: "Peach Blush & Glow Guide", technique: [
        "Smile and apply peach blush to the rounded part of your cheeks",
        "Blend upward toward your temples — this lifts the face",
        "For liquid highlighter: put one tiny drop on your fingertip",
        "Tap it onto the tops of your cheekbones, bridge of nose, and center of forehead",
        "Use gentle tapping motions to blend — liquid highlighter looks most natural when sheered out"
      ], shop: { luxury: { store: "Rare Beauty", item: "Rare Beauty Warm Wishes Bronzer Stick", price: "$30" }, mid: { store: "Ulta", item: "Milani Baked Blush in Bellissimo Bronze", price: "$10" }, budget: { store: "Target", item: "e.l.f. Liquid Highlighter in Golden Glow", price: "$5" } } },
      { title: "Warm Lips", detail: "A terracotta or warm nude lip liner with a glossy caramel lip gloss.", tools: ["Lip Liner", "Lip Gloss"], videoUrl: "https://www.youtube.com/results?search_query=glossy+lip+tutorial+beginner+easy", videoLabel: "Easy Glossy Lip Tutorial", technique: [
        "Line your lips starting from the center of the upper lip (the V-shape / cupid's bow)",
        "Use short, feathery strokes following your natural lip line",
        "Don't worry about perfection — you can always blend with your finger",
        "Apply gloss starting from the center and pressing lips together to spread evenly",
        "For beginners: skip the liner and just apply gloss — it's forgiving and gorgeous!"
      ], shop: { luxury: { store: "Nordstrom", item: "Gucci Rouge à Lèvres in Goldie Red", price: "$42" }, mid: { store: "Ulta", item: "NYX Butter Gloss in Madeleine", price: "$6" }, budget: { store: "Amazon", item: "Revlon Super Lustrous Lip Gloss in Rosy Future", price: "$5" } } },
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
      { title: "Flawless Base", detail: "A matte full-coverage foundation. Set with translucent powder for a porcelain finish.", videoUrl: "https://www.youtube.com/results?search_query=full+coverage+foundation+tutorial+beginner", videoLabel: "Full Coverage Foundation", shop: { luxury: { store: "Sephora", item: "Lancôme Teint Idole Ultra Foundation", price: "$52" }, mid: { store: "Ulta", item: "Fenty Beauty Pro Filt'r Matte Foundation", price: "$40" }, budget: { store: "Target", item: "Maybelline SuperStay Full Coverage", price: "$12" } } },
      { title: "Minimal Eyes", detail: "A wash of mauve on the lids. Tight-line upper lash with dark brown. Lots of mascara.", tip: "Keep eyes minimal to let the lip be the star", videoUrl: "https://www.youtube.com/results?search_query=simple+one+color+eyeshadow+tutorial+beginner", videoLabel: "Simple One-Shadow Eye", shop: { luxury: { store: "Sephora", item: "Chanel Les 4 Ombres in Douceur", price: "$65" }, mid: { store: "Ulta", item: "ColourPop Lilac You A Lot Palette", price: "$14" }, budget: { store: "Amazon", item: "e.l.f. Bite Size Eyeshadow Rose Water", price: "$3" } } },
      { title: "Sculpted Cheeks", detail: "A cool-toned mauve blush. Subtle highlight on the cheekbones only.", videoUrl: "https://www.youtube.com/results?search_query=contour+and+blush+beginner+tutorial", videoLabel: "Sculpted Cheeks Tutorial", shop: { luxury: { store: "Sephora", item: "Hourglass Ambient Lighting Blush in Mood Exposure", price: "$42" }, mid: { store: "Ulta", item: "Tarte Amazonian Clay Blush in Exposed", price: "$29" }, budget: { store: "Amazon", item: "Wet n Wild Color Icon Blush in Mellow Wine", price: "$4" } } },
      { title: "Bold Berry Lip", detail: "Line with a deep berry liner. Fill with a matte berry or plum lipstick. Blot and reapply for intensity.", videoUrl: "https://www.youtube.com/results?search_query=how+to+apply+bold+dark+lipstick+beginner", videoLabel: "Bold Lip Application", shop: { luxury: { store: "Nordstrom", item: "YSL Tatouage Couture in Berry Cult", price: "$40" }, mid: { store: "Ulta", item: "MAC Retro Matte in Flat Out Fabulous", price: "$22" }, budget: { store: "Target", item: "NYX Suede Matte in Girl, Bye", price: "$8" } } },
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
  "Urban Edge": {
    makeup: [
      { title: "Clean Base", detail: "Skip heavy foundation. Use a tinted moisturizer or BB cream for a natural, unfussy base.", videoUrl: "https://www.youtube.com/results?search_query=tinted+moisturizer+bb+cream+application+beginner", videoLabel: "BB Cream & Tinted Moisturizer", shop: { luxury: { store: "Sephora", item: "Laura Mercier Tinted Moisturizer", price: "$49" }, mid: { store: "Ulta", item: "Maybelline Dream Fresh BB Cream", price: "$9" }, budget: { store: "Amazon", item: "e.l.f. Camo CC Cream", price: "$7" } } },
      { title: "Bold Brows", detail: "Fill in brows with a pencil or pomade for a strong, defined arch. Brush up with clear gel.", tip: "Strong brows anchor the whole streetwear look", videoUrl: "https://www.youtube.com/results?search_query=how+to+fill+in+eyebrows+beginner+tutorial", videoLabel: "Brow Filling Tutorial", shop: { luxury: { store: "Sephora", item: "Anastasia Brow Wiz + Clear Gel Set", price: "$44" }, mid: { store: "Ulta", item: "NYX Micro Brow Pencil", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. Wow Brow Gel", price: "$4" } } },
      { title: "Subtle Eyes", detail: "A matte brown shadow in the crease. Tight-line with dark liner. Waterproof mascara for all-day wear.", videoUrl: "https://www.youtube.com/results?search_query=tight+lining+eyeliner+beginner+tutorial", videoLabel: "Tight-Lining Eyeliner", shop: { luxury: { store: "MAC", item: "MAC Eye Kohl in Teddy", price: "$23" }, mid: { store: "Ulta", item: "Maybelline Lash Sensational Mascara", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. No Budge Retractable Liner", price: "$4" } } },
      { title: "Lip Balm & Go", detail: "A tinted lip balm in a nude or berry shade. Keep it low-key — the outfit does the talking.", videoUrl: "https://www.youtube.com/results?search_query=tinted+lip+balm+natural+look", videoLabel: "Easy Tinted Lip Look", shop: { luxury: { store: "Sephora", item: "Dior Lip Glow Balm in Rose", price: "$40" }, mid: { store: "Ulta", item: "Burt's Bees Tinted Lip Balm", price: "$6" }, budget: { store: "Amazon", item: "Chapstick Total Hydration Tinted", price: "$4" } } },
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
      { title: "Sneakers", detail: "Chunky sneakers or retro runners. Air Force 1s, New Balance 550s, or Dunks.", shop: { luxury: { store: "Nike", item: "Nike Dunk Low Retro", price: "$115" }, mid: { store: "New Balance", item: "New Balance 550", price: "$110" }, budget: { store: "Reebok", item: "Reebok Classic Club C 85", price: "$55" } } },
      { title: "Socks", detail: "Crew-length white or black athletic socks. Visible above the sneaker is the move.", tip: "Nike or branded crew socks are a statement piece in streetwear", shop: { luxury: { store: "Nike", item: "Nike Everyday Cushion Crew 6pk", price: "$24" }, mid: { store: "Nike", item: "Nike Dri-FIT Crew Socks 3pk", price: "$16" }, budget: { store: "Amazon", item: "Fruit of the Loom Crew Socks 12pk", price: "$12" } } },
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
      { title: "Skin-First Base", detail: "A tinted serum or light skin tint. Focus on skincare so you need minimal coverage.", tip: "Glass skin starts with hydration — layer serums before makeup", videoUrl: "https://www.youtube.com/results?search_query=glass+skin+no+makeup+makeup+tutorial+beginner", videoLabel: "Glass Skin No-Makeup Look", shop: { luxury: { store: "Sephora", item: "Kosas Tinted Face Oil", price: "$42" }, mid: { store: "Ulta", item: "Glossier Stretch Concealer", price: "$22" }, budget: { store: "Amazon", item: "CeraVe Hydrating Tinted SPF Cream", price: "$16" } } },
      { title: "Clean Brows & Lashes", detail: "Groom brows with a clear gel. One coat of brown or clear mascara for definition.", videoUrl: "https://www.youtube.com/results?search_query=natural+brow+grooming+tutorial+clear+gel", videoLabel: "Natural Brow Grooming", shop: { luxury: { store: "Sephora", item: "Chanel Boy de Chanel Brow Gel", price: "$38" }, mid: { store: "Ulta", item: "Benefit Gimme Brow+", price: "$26" }, budget: { store: "Amazon", item: "e.l.f. Brow Lift Gel", price: "$5" } } },
      { title: "Natural Flush", detail: "A cream blush in peach or soft rose. Apply with fingers for a natural, dewy finish.", videoUrl: "https://www.youtube.com/results?search_query=cream+blush+application+fingers+beginner", videoLabel: "Cream Blush with Fingers", shop: { luxury: { store: "Rare Beauty", item: "Rare Beauty Soft Pinch Liquid Blush", price: "$23" }, mid: { store: "Ulta", item: "Milk Makeup Lip + Cheek Stick", price: "$18" }, budget: { store: "Amazon", item: "Flower Beauty Blush Bomb in Pinch Me", price: "$10" } } },
      { title: "Lip Treatment", detail: "A clear or tinted lip oil for a glossy, effortless finish.", videoUrl: "https://www.youtube.com/results?search_query=lip+oil+application+natural+look", videoLabel: "Lip Oil Application", shop: { luxury: { store: "Sephora", item: "Dior Lip Oil in Rosewood", price: "$38" }, mid: { store: "Ulta", item: "NYX Fat Oil Lip Drip", price: "$9" }, budget: { store: "Amazon", item: "Burt's Bees Lip Shimmer", price: "$5" } } },
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
      { title: "Clean Sneakers", detail: "All-white leather sneakers. Simple silhouette — Common Projects, Stan Smiths, or similar.", shop: { luxury: { store: "Nordstrom", item: "Common Projects Original Achilles Low", price: "$435" }, mid: { store: "Adidas", item: "Adidas Stan Smith White/Green", price: "$100" }, budget: { store: "Amazon", item: "Amazon Essentials Casual Lace-Up Sneaker", price: "$25" } } },
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
      { title: "Retro Base", detail: "A full-coverage satin foundation for a porcelain-doll finish. Set with a finely milled powder.", videoUrl: "https://www.youtube.com/results?search_query=vintage+retro+makeup+base+tutorial+beginner", videoLabel: "Retro Satin Base Tutorial", shop: { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Airbrush Flawless Foundation", price: "$46" }, mid: { store: "Ulta", item: "L'Oréal Infallible Pro-Matte Foundation", price: "$13" }, budget: { store: "Amazon", item: "Revlon Candid Glow Foundation", price: "$8" } } },
      { title: "Cat Eye", detail: "A sharp winged liner in jet black. Start thin at inner corner, flick out at the end.", tip: "Use tape as a guide for a perfect wing", videoUrl: "https://www.youtube.com/results?search_query=winged+eyeliner+cat+eye+tutorial+beginner+easy", videoLabel: "Easy Winged Liner Tutorial", shop: { luxury: { store: "Sephora", item: "Stila Stay All Day Waterproof Liner", price: "$24" }, mid: { store: "Ulta", item: "NYX Epic Ink Liner", price: "$9" }, budget: { store: "Amazon", item: "Maybelline Hyper Easy Liquid Liner", price: "$8" } } },
      { title: "Warm Blush", detail: "A peachy-coral powder blush high on the cheekbones for a 70s sun-kissed look.", videoUrl: "https://www.youtube.com/results?search_query=powder+blush+cheekbone+placement+beginner", videoLabel: "Cheekbone Blush Placement", shop: { luxury: { store: "Sephora", item: "NARS Blush in Orgasm", price: "$34" }, mid: { store: "Ulta", item: "Milani Baked Blush in Corallina", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. Primer-Infused Blush in Always Rosy", price: "$6" } } },
      { title: "Red Lip", detail: "A classic red lipstick — warm red for warm undertones, blue-red for cool.", videoUrl: "https://www.youtube.com/results?search_query=how+to+apply+red+lipstick+perfectly+beginner", videoLabel: "Perfect Red Lip Guide", shop: { luxury: { store: "MAC", item: "MAC Ruby Woo Retro Matte Lipstick", price: "$22" }, mid: { store: "Ulta", item: "Revlon Super Lustrous in Certainly Red", price: "$9" }, budget: { store: "Amazon", item: "Maybelline Color Sensational in Red Revival", price: "$6" } } },
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
      { title: "Sweat-Proof Base", detail: "A mattifying primer + a waterproof tinted moisturizer. Skip heavy foundation.", videoUrl: "https://www.youtube.com/results?search_query=sweat+proof+makeup+tutorial+gym+workout", videoLabel: "Sweat-Proof Makeup Base", shop: { luxury: { store: "Sephora", item: "Nars Pore & Shine Control Primer", price: "$36" }, mid: { store: "Ulta", item: "NYX Professional Pore Filler Primer", price: "$14" }, budget: { store: "Amazon", item: "e.l.f. Power Grip Primer", price: "$10" } } },
      { title: "Brows & Lashes", detail: "Brush and set brows with tinted gel. Waterproof mascara in brown or black.", videoUrl: "https://www.youtube.com/results?search_query=brow+gel+waterproof+mascara+tutorial+beginner", videoLabel: "Quick Brows & Lashes", shop: { luxury: { store: "Glossier", item: "Glossier Boy Brow + Lash Slick Set", price: "$34" }, mid: { store: "Ulta", item: "Maybelline Brow Fast Sculpt Gel", price: "$9" }, budget: { store: "Amazon", item: "e.l.f. Wow Brow + Big Mood Mascara", price: "$9" } } },
      { title: "Healthy Glow", detail: "Skip blush. Use a cream bronzer on cheeks and nose for a just-worked-out flush.", videoUrl: "https://www.youtube.com/results?search_query=cream+bronzer+natural+glow+tutorial+beginner", videoLabel: "Cream Bronzer Glow", shop: { luxury: { store: "Sephora", item: "Chanel Les Beiges Bronzing Cream", price: "$58" }, mid: { store: "Ulta", item: "Physicians Formula Butter Bronzer", price: "$16" }, budget: { store: "Target", item: "e.l.f. Putty Bronzer in Tan Lines", price: "$6" } } },
      { title: "Lip Balm", detail: "A hydrating clear or tinted lip balm. Nothing else — keep it fresh.", videoUrl: "https://www.youtube.com/results?search_query=best+lip+balm+application+tips", videoLabel: "Lip Care Essentials", shop: { luxury: { store: "Sephora", item: "La Mer The Lip Balm", price: "$65" }, mid: { store: "Ulta", item: "Fresh Sugar Lip Treatment SPF 15", price: "$26" }, budget: { store: "Amazon", item: "Aquaphor Lip Repair", price: "$5" } } },
    ],
    top: [
      { title: "Performance Tee", detail: "A fitted moisture-wicking tee or crop top in black, white, or a bold color.", tip: "Look for seamless construction for a sleek silhouette", shop: { luxury: { store: "Nordstrom", item: "Alo Yoga Alosoft Crop Tee", price: "$68" }, mid: { store: "Nike", item: "Nike Dri-FIT One Fitted Crop Top", price: "$35" }, budget: { store: "Amazon", item: "CRZ YOGA Pima Cotton Crop Tee", price: "$20" } } },
      { title: "Track Jacket", detail: "A zip-up track jacket with contrast piping or a cropped puffer. Sporty but elevated.", shop: { luxury: { store: "SSENSE", item: "Adidas x Wales Bonner Track Jacket", price: "$350" }, mid: { store: "Adidas", item: "Adidas Originals Firebird Track Jacket", price: "$80" }, budget: { store: "Amazon", item: "Amazon Essentials Full-Zip Track Jacket", price: "$22" } } },
      { title: "Alternative: Sports Bra as Top", detail: "A longline sports bra with a high neckline, worn solo or under an open jacket.", shop: { luxury: { store: "Nordstrom", item: "Girlfriend Collective Paloma Bra", price: "$48" }, mid: { store: "Nike", item: "Nike Indy Longline Sports Bra", price: "$40" }, budget: { store: "Amazon", item: "CRZ YOGA Longline Sports Bra", price: "$18" } } },
    ],
    bottom: [
      { title: "Joggers", detail: "Tapered joggers in black or grey with a clean cuff. Not sweatpants — joggers with structure.", shop: { luxury: { store: "Lululemon", item: "Lululemon ABC Jogger", price: "$128" }, mid: { store: "Nike", item: "Nike Sportswear Tech Fleece Jogger", price: "$110" }, budget: { store: "Amazon", item: "Amazon Essentials Fleece Jogger", price: "$18" } } },
      { title: "Alternative: Bike Shorts", detail: "High-waisted bike shorts in black. Paired with an oversized tee or hoodie.", shop: { luxury: { store: "Nordstrom", item: "Alo Yoga High-Waist Biker Short", price: "$62" }, mid: { store: "Nike", item: "Nike One High-Rise Bike Shorts", price: "$45" }, budget: { store: "Amazon", item: "BALEAF High Waist Biker Shorts", price: "$16" } } },
    ],
    shoes: [
      { title: "Running-Inspired Sneakers", detail: "Technical running shoes worn casually. New Balance, On Cloud, ASICS Gel. Neutral or bold colors.", shop: { luxury: { store: "SSENSE", item: "New Balance 2002R Protection Pack", price: "$150" }, mid: { store: "New Balance", item: "New Balance 574 Classic", price: "$90" }, budget: { store: "ASICS", item: "ASICS Gel-Contend 8 Running Shoe", price: "$50" } } },
      { title: "Socks", detail: "Matching athletic crew socks. White on white shoes, black on black.", shop: { luxury: { store: "Nordstrom", item: "On Running Performance Crew Socks", price: "$18" }, mid: { store: "Nike", item: "Nike Everyday Plus Cushion Crew 6pk", price: "$24" }, budget: { store: "Under Armour", item: "Under Armour Performance Crew Socks 6pk", price: "$15" } } },
      { title: "Alternative: Slides", detail: "Sporty slides for a more casual take. Worn with or without socks.", shop: { luxury: { store: "Nordstrom", item: "Balenciaga Pool Slide", price: "$325" }, mid: { store: "Nike", item: "Nike Victori One Slide", price: "$30" }, budget: { store: "Adidas", item: "Adidas Adilette Shower Slide", price: "$22" } } },
    ],
    accessories: [
      { title: "Smart Watch", detail: "An Apple Watch or fitness tracker. Functional and sporty — the ultimate athleisure accessory.", shop: { luxury: { store: "Apple", item: "Apple Watch Ultra 2", price: "$799" }, mid: { store: "Amazon", item: "Apple Watch SE (2nd Gen)", price: "$249" }, budget: { store: "Amazon", item: "Fitbit Inspire 3", price: "$80" } } },
      { title: "Gym Bag / Belt Bag", detail: "A sleek belt bag or mini duffle. Worn crossbody or at the waist.", tip: "Belt bags keep you hands-free while looking intentional", shop: { luxury: { store: "Lululemon", item: "Lululemon Everywhere Belt Bag", price: "$38" }, mid: { store: "Nike", item: "Nike Heritage Hip Pack", price: "$25" }, budget: { store: "Amazon", item: "ZORFIN Fanny Pack Crossbody", price: "$12" } } },
      { title: "Cap / Visor", detail: "A performance cap or visor. Clean, unbranded or minimal logo.", shop: { luxury: { store: "Lululemon", item: "Lululemon Fast & Free Run Hat", price: "$38" }, mid: { store: "Nike", item: "Nike Dri-FIT AeroBill Cap", price: "$28" }, budget: { store: "Under Armour", item: "Under Armour Blitzing Hat", price: "$18" } } },
      { title: "Jewelry", detail: "Minimal — small studs or a thin chain that won't snag. Or skip it entirely.", shop: { luxury: { store: "Mejuri", item: "Tiny Studs 14K Gold", price: "$78" }, mid: { store: "Amazon", item: "PAVOI 14K Gold Plated Studs", price: "$12" }, budget: { store: "Amazon", item: "Amazon Essentials Sterling Silver Studs", price: "$8" } } },
    ],
  },
  "Desert Wanderer": {
    makeup: [
      { title: "Sun-Kissed Base", detail: "Use a tinted moisturizer for a natural, dewy finish. Dust bronzer across cheeks and nose.", videoUrl: "https://www.youtube.com/results?search_query=dewy+sun+kissed+makeup+tutorial+beginner", videoLabel: "Sun-Kissed Dewy Base", shop: { luxury: { store: "Sephora", item: "NARS Pure Radiant Tinted Moisturizer", price: "$47" }, mid: { store: "Ulta", item: "Maybelline Dream Fresh BB Cream", price: "$10" }, budget: { store: "Amazon", item: "e.l.f. Camo CC Cream", price: "$7" } } },
      { title: "Earthy Eyes", detail: "Sweep a warm terracotta shade across lids. Add gold shimmer to inner corners.", videoUrl: "https://www.youtube.com/results?search_query=warm+terracotta+eyeshadow+tutorial+beginner", videoLabel: "Warm Earthy Eye Look", shop: { luxury: { store: "Sephora", item: "Natasha Denona Bronze Palette", price: "$65" }, mid: { store: "Ulta", item: "ColourPop Going Coconuts Palette", price: "$14" }, budget: { store: "Amazon", item: "Maybelline Nudes of New York Palette", price: "$10" } } },
      { title: "Nude Lips", detail: "A warm nude lip balm or tinted gloss. Keep it natural and hydrated.", videoUrl: "https://www.youtube.com/results?search_query=nude+lip+balm+natural+look+tutorial", videoLabel: "Natural Nude Lip", shop: { luxury: { store: "Sephora", item: "Dior Lip Glow in Nude", price: "$38" }, mid: { store: "Ulta", item: "Burt's Bees Tinted Lip Balm", price: "$7" }, budget: { store: "Amazon", item: "Nivea Shimmer Lip Care", price: "$3" } } },
    ],
    top: [
      { title: "Flowy Blouse", detail: "A loose, embroidered peasant top in cream, rust, or sage. Bell sleeves add movement.", tip: "Look for crochet or embroidery details", shop: { luxury: { store: "Free People", item: "Embroidered Peasant Top", price: "$128" }, mid: { store: "Anthropologie", item: "Embroidered Swing Top", price: "$58" }, budget: { store: "Amazon", item: "KIRUNDO Boho Embroidered Blouse", price: "$22" } } },
      { title: "Kimono Layer", detail: "A printed kimono or duster in earthy florals. Perfect for layering over tanks.", shop: { luxury: { store: "Free People", item: "Spell Oasis Kimono", price: "$189" }, mid: { store: "Zara", item: "Printed Long Kimono", price: "$50" }, budget: { store: "Amazon", item: "SweatyRocks Floral Kimono", price: "$18" } } },
    ],
    bottom: [
      { title: "Wide-Leg Pants", detail: "Flowy wide-leg pants in linen or rayon. Earthy tones — olive, sand, terracotta.", shop: { luxury: { store: "Reformation", item: "Petites Linen Wide Leg", price: "$148" }, mid: { store: "Zara", item: "Flowing Wide Leg Trousers", price: "$46" }, budget: { store: "Amazon", item: "Dokotoo Wide Leg Linen Pants", price: "$25" } } },
      { title: "Alternative: Maxi Skirt", detail: "A tiered maxi skirt in a warm print or solid earth tone.", shop: { luxury: { store: "Free People", item: "Lydia Tiered Maxi Skirt", price: "$128" }, mid: { store: "Anthropologie", item: "Tiered Maxi Skirt in Rust", price: "$68" }, budget: { store: "Amazon", item: "MEROKEETY Boho Tiered Maxi Skirt", price: "$28" } } },
    ],
    shoes: [
      { title: "Gladiator Sandals", detail: "Leather gladiator sandals in tan or cognac. Flat or low block heel.", shop: { luxury: { store: "Nordstrom", item: "Stuart Weitzman Gladiator Sandal", price: "$395" }, mid: { store: "DSW", item: "Sam Edelman Gladiator Sandal", price: "$90" }, budget: { store: "Amazon", item: "DREAM PAIRS Gladiator Flat Sandal", price: "$25" } } },
      { title: "Alternative: Ankle Boots", detail: "Suede ankle boots in tan with western-inspired stitching.", shop: { luxury: { store: "Nordstrom", item: "Isabel Marant Dicker Boot", price: "$690" }, mid: { store: "DSW", item: "Dolce Vita Silma Boot", price: "$130" }, budget: { store: "Target", item: "Universal Thread Western Boot", price: "$35" } } },
    ],
    accessories: [
      { title: "Layered Jewelry", detail: "Turquoise pendant necklaces layered with gold chains. Stacked bangles and rings.", shop: { luxury: { store: "Gorjana", item: "Turquoise Layering Set", price: "$175" }, mid: { store: "Nordstrom", item: "BaubleBar Layered Necklace Set", price: "$48" }, budget: { store: "Amazon", item: "FIBO STEEL Boho Jewelry Set", price: "$16" } } },
      { title: "Woven Bag", detail: "A rattan crossbody or woven straw tote with leather trim.", shop: { luxury: { store: "Net-a-Porter", item: "Loewe Basket Bag", price: "$690" }, mid: { store: "Madewell", item: "Straw Crossbody Bag", price: "$78" }, budget: { store: "Amazon", item: "Handwoven Rattan Crossbody", price: "$22" } } },
      { title: "Hat & Scarf", detail: "A floppy wide-brim hat in natural straw. A lightweight printed scarf for the hair or neck.", shop: { luxury: { store: "Lack of Color", item: "Rancher Straw Hat", price: "$120" }, mid: { store: "Free People", item: "Wide Brim Straw Hat", price: "$48" }, budget: { store: "Amazon", item: "Lanzom Wide Brim Straw Hat", price: "$16" } } },
    ],
  },
  "Ivy League": {
    makeup: [
      { title: "Polished Base", detail: "Even-toned matte foundation with a light powder. Clean, groomed brows.", videoUrl: "https://www.youtube.com/results?search_query=polished+matte+foundation+tutorial+beginner", videoLabel: "Polished Matte Base", shop: { luxury: { store: "Sephora", item: "Laura Mercier Flawless Lumière Foundation", price: "$48" }, mid: { store: "Ulta", item: "IT Cosmetics CC+ Cream", price: "$22" }, budget: { store: "Amazon", item: "Covergirl Clean Matte BB Cream", price: "$7" } } },
      { title: "Classic Eyes", detail: "Neutral matte shadow, defined brows, one coat of black mascara. Clean and sharp.", videoUrl: "https://www.youtube.com/results?search_query=classic+neutral+eyeshadow+tutorial+beginner", videoLabel: "Classic Neutral Eye", shop: { luxury: { store: "Sephora", item: "Tom Ford Eye Color Quad in Nude Dip", price: "$90" }, mid: { store: "Ulta", item: "Too Faced Natural Eyes Palette", price: "$38" }, budget: { store: "Amazon", item: "Maybelline The Nudes Palette", price: "$11" } } },
      { title: "Nude Lip", detail: "A classic nude or soft pink lipstick. Satin finish for a polished look.", videoUrl: "https://www.youtube.com/results?search_query=nude+pink+lipstick+satin+finish+tutorial", videoLabel: "Classic Nude Lip", shop: { luxury: { store: "Nordstrom", item: "Chanel Rouge Coco in Mademoiselle", price: "$42" }, mid: { store: "Ulta", item: "Clinique Almost Lipstick in Black Honey", price: "$24" }, budget: { store: "Target", item: "Revlon Super Lustrous in Pink in the Afternoon", price: "$8" } } },
    ],
    top: [
      { title: "Oxford Shirt", detail: "A crisp button-down oxford in white, light blue, or pink stripe.", tip: "Roll sleeves twice for a relaxed prep look", shop: { luxury: { store: "Ralph Lauren", item: "Classic Fit Oxford Shirt", price: "$110" }, mid: { store: "J.Crew", item: "Slim-Fit Oxford Shirt", price: "$60" }, budget: { store: "Amazon", item: "Amazon Essentials Oxford Shirt", price: "$20" } } },
      { title: "Blazer", detail: "A navy or camel single-breasted blazer with gold buttons. Structured shoulders.", shop: { luxury: { store: "Ralph Lauren", item: "Knit Double-Breasted Blazer", price: "$398" }, mid: { store: "J.Crew", item: "Schoolboy Blazer in Navy", price: "$168" }, budget: { store: "Amazon", item: "Allegra K Notched Lapel Blazer", price: "$40" } } },
      { title: "V-Neck Sweater", detail: "A cable-knit V-neck sweater in navy, burgundy, or forest green.", shop: { luxury: { store: "Brooks Brothers", item: "Merino Wool V-Neck Sweater", price: "$128" }, mid: { store: "J.Crew", item: "Cotton Cable-Knit V-Neck", price: "$78" }, budget: { store: "Amazon", item: "Amazon Essentials V-Neck Sweater", price: "$22" } } },
    ],
    bottom: [
      { title: "Chinos", detail: "Well-fitted chinos in khaki, navy, or olive. Tapered leg, no break.", shop: { luxury: { store: "Ralph Lauren", item: "Stretch Straight Fit Chino", price: "$98" }, mid: { store: "J.Crew", item: "484 Slim-Fit Stretch Chino", price: "$80" }, budget: { store: "Amazon", item: "Amazon Essentials Slim-Fit Chino", price: "$25" } } },
      { title: "Alternative: Pleated Trousers", detail: "High-waisted pleated trousers in charcoal or navy for a dressier prep look.", shop: { luxury: { store: "Brooks Brothers", item: "Milano Fit Gabardine Trousers", price: "$198" }, mid: { store: "Banana Republic", item: "Slim Italian Wool Suit Trouser", price: "$120" }, budget: { store: "H&M", item: "Slim Fit Dress Pants", price: "$28" } } },
    ],
    shoes: [
      { title: "Loafers", detail: "Penny loafers or tassel loafers in brown leather or burgundy suede.", shop: { luxury: { store: "Nordstrom", item: "Gucci Horsebit Loafer", price: "$890" }, mid: { store: "Cole Haan", item: "Pinch Grand Penny Loafer", price: "$130" }, budget: { store: "Amazon", item: "Bruno Marc Penny Loafers", price: "$30" } } },
      { title: "Socks", detail: "Patterned dress socks — argyle, stripes, or dots in complementary colors.", tip: "Fun socks are the preppy secret weapon", shop: { luxury: { store: "Nordstrom", item: "Pantherella Merino Wool Socks", price: "$30" }, mid: { store: "J.Crew", item: "Patterned Dress Socks 3-Pack", price: "$24" }, budget: { store: "Amazon", item: "Marino Avenue Patterned Socks 6pk", price: "$15" } } },
      { title: "Alternative: Boat Shoes", detail: "Classic leather boat shoes in tan or navy for a casual prep look.", shop: { luxury: { store: "Nordstrom", item: "Sperry Gold Cup Authentic Original", price: "$150" }, mid: { store: "Sperry", item: "Authentic Original Boat Shoe", price: "$95" }, budget: { store: "Amazon", item: "Amazon Essentials Canvas Boat Shoe", price: "$30" } } },
    ],
    accessories: [
      { title: "Watch", detail: "A classic round-face watch with a leather strap — brown or navy.", shop: { luxury: { store: "Nordstrom", item: "TAG Heuer Carrera Calibre 5", price: "$2,750" }, mid: { store: "Amazon", item: "Seiko Presage Automatic", price: "$325" }, budget: { store: "Amazon", item: "Timex Weekender Fairfield", price: "$40" } } },
      { title: "Belt", detail: "A woven or leather belt in brown with a classic brass or silver buckle.", shop: { luxury: { store: "Ralph Lauren", item: "Braided Leather Belt", price: "$95" }, mid: { store: "J.Crew", item: "Braided Leather Belt", price: "$50" }, budget: { store: "Amazon", item: "Braided Stretch Belt", price: "$14" } } },
      { title: "Bag", detail: "A structured leather tote or briefcase in cognac or navy.", shop: { luxury: { store: "Nordstrom", item: "Tumi Harrison Briefcase", price: "$495" }, mid: { store: "Banana Republic", item: "Italian Leather Tote", price: "$198" }, budget: { store: "Amazon", item: "Estarer Canvas Messenger Bag", price: "$28" } } },
    ],
  },
  "Rebel Noir": {
    makeup: [
      { title: "Matte Base", detail: "Full-coverage matte foundation. Contour sharply under cheekbones and jawline.", shop: { luxury: { store: "Fenty Beauty", item: "Fenty Beauty Pro Filt'r Matte Foundation", price: "$40" }, mid: { store: "Ulta", item: "NYX Can't Stop Won't Stop Foundation", price: "$15" }, budget: { store: "Amazon", item: "Maybelline Fit Me Matte Foundation", price: "$8" } } },
      { title: "Smoky Eyes", detail: "Black and charcoal smoky eye. Smudge liner along upper and lower lash lines. Heavy mascara.", tip: "Use a small brush to smoke out the lower lash line", shop: { luxury: { store: "Sephora", item: "Urban Decay Naked Smoky Palette", price: "$54" }, mid: { store: "Ulta", item: "NYX Ultimate Shadow Palette Smokey", price: "$18" }, budget: { store: "Amazon", item: "Rimmel Magnif'Eyes Smoke Edition", price: "$7" } } },
      { title: "Dark Lip", detail: "Matte black, deep oxblood, or dark plum lip. Line and fill with precision.", shop: { luxury: { store: "MAC", item: "MAC Matte Lipstick in Diva", price: "$22" }, mid: { store: "Ulta", item: "NYX Suede Matte in Alien", price: "$8" }, budget: { store: "Amazon", item: "Wet n Wild MegaLast in Vamp It Up", price: "$3" } } },
    ],
    top: [
      { title: "Leather Jacket", detail: "A fitted moto leather jacket in black. Silver hardware, asymmetrical zip.", shop: { luxury: { store: "AllSaints", item: "Balfern Leather Biker Jacket", price: "$499" }, mid: { store: "Zara", item: "Faux Leather Biker Jacket", price: "$70" }, budget: { store: "Amazon", item: "Fahsyee Faux Leather Moto Jacket", price: "$40" } } },
      { title: "Band Tee or Black Tank", detail: "A vintage band tee or ribbed black tank top. Slightly oversized or cropped.", shop: { luxury: { store: "Nordstrom", item: "R13 Vintage Band Tee", price: "$195" }, mid: { store: "Urban Outfitters", item: "Graphic Band Tee", price: "$39" }, budget: { store: "Amazon", item: "Goodthreads Vintage Wash Tee", price: "$12" } } },
    ],
    bottom: [
      { title: "Ripped Skinny Jeans", detail: "Black skinny jeans with distressed knees. High-waisted for a sharp silhouette.", shop: { luxury: { store: "Nordstrom", item: "AGOLDE Riley High Rise in Paradigm", price: "$188" }, mid: { store: "Levi's", item: "Mile High Super Skinny in Black", price: "$70" }, budget: { store: "Amazon", item: "Levi's 721 High Rise Skinny", price: "$35" } } },
      { title: "Alternative: Leather Pants", detail: "Faux leather straight-leg pants in black for maximum edge.", shop: { luxury: { store: "Nordstrom", item: "Stand Studio Leather Pants", price: "$495" }, mid: { store: "Zara", item: "Faux Leather Straight Pants", price: "$50" }, budget: { store: "Amazon", item: "HDE Faux Leather Pants", price: "$28" } } },
    ],
    shoes: [
      { title: "Combat Boots", detail: "Black leather combat boots with chunky soles. Lace-up, silver hardware.", shop: { luxury: { store: "Dr. Martens", item: "Dr. Martens Jadon Platform Boot", price: "$200" }, mid: { store: "Steve Madden", item: "Steve Madden Troopa Combat Boot", price: "$90" }, budget: { store: "Amazon", item: "DREAM PAIRS Combat Ankle Boots", price: "$35" } } },
      { title: "Alternative: Platform Creepers", detail: "Black platform creepers or chunky sole loafers for a punk edge.", shop: { luxury: { store: "Nordstrom", item: "Prada Monolith Loafer", price: "$1,250" }, mid: { store: "Dr. Martens", item: "Dr. Martens 1461 Quad Platform Oxford", price: "$140" }, budget: { store: "Amazon", item: "T.U.K. Creeper Sneaker", price: "$45" } } },
    ],
    accessories: [
      { title: "Chain Jewelry", detail: "Chunky silver chains, layered chokers, safety-pin earrings, stacked rings.", shop: { luxury: { store: "Nordstrom", item: "Alexander McQueen Skull Chain Necklace", price: "$490" }, mid: { store: "Nordstrom", item: "AllSaints Layered Chain Necklace", price: "$78" }, budget: { store: "Amazon", item: "MOROTOLE Punk Chain Necklace Set", price: "$14" } } },
      { title: "Studded Belt", detail: "A black leather belt with silver studs or pyramid hardware.", shop: { luxury: { store: "Nordstrom", item: "Saint Laurent Studded Belt", price: "$595" }, mid: { store: "Urban Outfitters", item: "Studded Leather Belt", price: "$39" }, budget: { store: "Amazon", item: "Punk Studded Leather Belt", price: "$12" } } },
      { title: "Bag", detail: "A black crossbody with chain strap or a studded clutch.", shop: { luxury: { store: "Nordstrom", item: "Saint Laurent Kate Chain Bag", price: "$2,150" }, mid: { store: "Rebecca Minkoff", item: "Mini MAC Crossbody", price: "$198" }, budget: { store: "Amazon", item: "CLUCI Chain Crossbody Bag", price: "$24" } } },
    ],
  },
  "Coastal Luxe": {
    makeup: [
      { title: "Glowing Base", detail: "Light, dewy tinted sunscreen or skin tint. A touch of cream bronzer on the cheeks.", shop: { luxury: { store: "Sephora", item: "Saie Slip Tint Dewy Foundation", price: "$36" }, mid: { store: "Ulta", item: "Supergoop Glowscreen SPF 40", price: "$22" }, budget: { store: "Amazon", item: "CeraVe Tinted Sunscreen SPF 30", price: "$12" } } },
      { title: "Beach-Ready Eyes", detail: "Champagne shimmer on lids. Waterproof brown mascara. Brushed-up brows.", shop: { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Eyes to Mesmerize in Champagne", price: "$34" }, mid: { store: "Ulta", item: "Maybelline Color Tattoo in Barely Branded", price: "$8" }, budget: { store: "Amazon", item: "e.l.f. Liquid Glitter Eyeshadow", price: "$5" } } },
      { title: "Glossy Lips", detail: "A sheer coral or peach lip gloss. Hydrating and beachy.", shop: { luxury: { store: "Sephora", item: "Dior Addict Lip Maximizer in Coral", price: "$38" }, mid: { store: "Ulta", item: "NYX Butter Gloss in Tiramisu", price: "$6" }, budget: { store: "Amazon", item: "Burt's Bees Lip Shimmer in Peony", price: "$5" } } },
    ],
    top: [
      { title: "Linen Shirt", detail: "A relaxed-fit linen shirt in white, sky blue, or sand. Roll the sleeves up.", tip: "Leave a couple buttons undone for resort ease", shop: { luxury: { store: "Net-a-Porter", item: "Loro Piana Linen Shirt", price: "$695" }, mid: { store: "Banana Republic", item: "Oversized Linen Shirt", price: "$80" }, budget: { store: "H&M", item: "Linen-Blend Resort Shirt", price: "$20" } } },
      { title: "Breezy Tank", detail: "A silk or linen camisole in cream or coral for layering under a cover-up.", shop: { luxury: { store: "Vince", item: "Silk Satin Camisole", price: "$195" }, mid: { store: "Mango", item: "Linen Blend Strappy Top", price: "$36" }, budget: { store: "Amazon", item: "Amazon Essentials Relaxed Fit Tank", price: "$12" } } },
    ],
    bottom: [
      { title: "Linen Pants", detail: "Wide-leg linen trousers in white, sand, or seafoam. Elastic waist for comfort.", shop: { luxury: { store: "Reformation", item: "Olina Linen Wide Leg Pant", price: "$148" }, mid: { store: "Zara", item: "Linen Blend Palazzo Pants", price: "$46" }, budget: { store: "Amazon", item: "ANRABESS Linen Wide Leg Pants", price: "$28" } } },
      { title: "Alternative: Midi Skirt", detail: "A flowy midi skirt in a tropical print or solid white.", shop: { luxury: { store: "Zimmermann", item: "Printed Midi Skirt", price: "$450" }, mid: { store: "& Other Stories", item: "Printed Midi Wrap Skirt", price: "$79" }, budget: { store: "Amazon", item: "Floerns Floral Print Midi Skirt", price: "$22" } } },
    ],
    shoes: [
      { title: "Espadrilles", detail: "Leather or canvas espadrille wedges or flats in tan or white.", shop: { luxury: { store: "Nordstrom", item: "Castañer Carina Espadrille Wedge", price: "$165" }, mid: { store: "DSW", item: "Marc Fisher Alida Espadrille Wedge", price: "$80" }, budget: { store: "Amazon", item: "VISCATA Canvas Espadrille Flat", price: "$30" } } },
      { title: "Alternative: Flat Sandals", detail: "Minimalist leather sandals with a thin sole in gold or nude.", shop: { luxury: { store: "Nordstrom", item: "Ancient Greek Sandals Eleftheria", price: "$200" }, mid: { store: "Madewell", item: "The Boardwalk Post Slide Sandal", price: "$55" }, budget: { store: "Amazon", item: "Amazon Essentials Flat Strap Sandal", price: "$18" } } },
    ],
    accessories: [
      { title: "Straw Hat", detail: "A wide-brim straw sun hat for beach or brunch. Natural or cream color.", shop: { luxury: { store: "Lack of Color", item: "Palma Wide Fedora", price: "$130" }, mid: { store: "J.Crew", item: "Packable Straw Hat", price: "$48" }, budget: { store: "Amazon", item: "Lanzom Straw Sun Hat", price: "$16" } } },
      { title: "Sunglasses", detail: "Oversized cat-eye or aviator sunglasses. Tortoiseshell or gold frame.", shop: { luxury: { store: "Nordstrom", item: "Ray-Ban Aviator Classic", price: "$163" }, mid: { store: "Nordstrom", item: "Quay Australia Cat Eye", price: "$55" }, budget: { store: "Amazon", item: "SOJOS Cat Eye Sunglasses", price: "$15" } } },
      { title: "Tote Bag", detail: "An oversized woven tote or raffia bag in natural fibers.", shop: { luxury: { store: "Net-a-Porter", item: "Loewe Basket Bag", price: "$690" }, mid: { store: "Anthropologie", item: "Straw Circle Tote", price: "$68" }, budget: { store: "Amazon", item: "Straw Woven Beach Tote", price: "$20" } } },
    ],
  },
  "Sharp & Clean": {
    makeup: [
      { title: "Fresh Face", detail: "Clean, moisturized skin. Mattifying primer on T-zone. Concealer only where needed.", shop: { luxury: { store: "Sephora", item: "Lab Series Daily Moisturizer SPF 35", price: "$48" }, mid: { store: "Ulta", item: "Cetaphil Daily Moisturizer SPF 30", price: "$16" }, budget: { store: "Amazon", item: "CeraVe AM Facial Moisturizer SPF 30", price: "$12" } } },
      { title: "Groomed Brows", detail: "Trim and brush brows into shape. Use a clear brow gel to set.", shop: { luxury: { store: "Glossier", item: "Boy Brow by Glossier", price: "$18" }, mid: { store: "Ulta", item: "NYX Control Freak Clear Brow Gel", price: "$6" }, budget: { store: "Amazon", item: "e.l.f. Brow Lift Gel", price: "$4" } } },
      { title: "Lip Care", detail: "Exfoliate and apply a quality lip balm. Keep lips hydrated and clean.", shop: { luxury: { store: "Sephora", item: "Laneige Lip Sleeping Mask", price: "$24" }, mid: { store: "Ulta", item: "Jack Black Lip Balm SPF 25", price: "$8" }, budget: { store: "Amazon", item: "Burt's Bees Original Lip Balm", price: "$4" } } },
    ],
    top: [
      { title: "Crisp Dress Shirt", detail: "A perfectly fitted white or light blue dress shirt. Pressed, no wrinkles.", tip: "Invest in tailoring — fit is everything", shop: { luxury: { store: "Nordstrom", item: "Charles Tyrwhitt Slim Fit Shirt", price: "$90" }, mid: { store: "Banana Republic", item: "Slim-Fit Non-Iron Dress Shirt", price: "$65" }, budget: { store: "Amazon", item: "Amazon Essentials Slim-Fit Dress Shirt", price: "$20" } } },
      { title: "Fitted Crew Tee", detail: "A premium fitted crew-neck tee in black, white, or navy.", shop: { luxury: { store: "Nordstrom", item: "James Perse Short Sleeve Crew", price: "$60" }, mid: { store: "Nordstrom", item: "Reigning Champ Ringspun Jersey Tee", price: "$45" }, budget: { store: "Amazon", item: "Amazon Essentials Slim-Fit Crew Tee", price: "$10" } } },
    ],
    bottom: [
      { title: "Slim Chinos", detail: "Tailored slim-fit chinos in navy, charcoal, or khaki.", shop: { luxury: { store: "Bonobos", item: "Stretch Washed Chinos Slim", price: "$98" }, mid: { store: "J.Crew", item: "484 Slim-Fit Stretch Chino", price: "$80" }, budget: { store: "Amazon", item: "Amazon Essentials Slim-Fit Chino", price: "$25" } } },
      { title: "Dark Denim", detail: "Dark indigo slim or straight jeans. No distressing, clean finish.", shop: { luxury: { store: "Nordstrom", item: "A.P.C. Petit Standard Jean", price: "$220" }, mid: { store: "Levi's", item: "511 Slim Fit in Clean Dark", price: "$70" }, budget: { store: "Amazon", item: "Levi's 511 Slim Fit Dark Wash", price: "$35" } } },
    ],
    shoes: [
      { title: "Clean Sneakers", detail: "White leather minimalist sneakers. No logos, clean sole.", shop: { luxury: { store: "Nordstrom", item: "Common Projects Original Achilles Low", price: "$425" }, mid: { store: "Vans", item: "Vans Old Skool Premium Leather White", price: "$85" }, budget: { store: "New Balance", item: "New Republic Kurt Leather Sneaker", price: "$88" } } },
      { title: "Alternative: Oxford Shoes", detail: "Brown or black leather cap-toe oxfords for a sharper look.", shop: { luxury: { store: "Nordstrom", item: "Allen Edmonds Park Avenue", price: "$395" }, mid: { store: "Cole Haan", item: "Cole Haan Grand Ambition Cap Toe Oxford", price: "$160" }, budget: { store: "Amazon", item: "Bruno Marc Oxford Dress Shoes", price: "$30" } } },
    ],
    accessories: [
      { title: "Watch", detail: "A clean-dial dress watch in silver or black with a leather strap.", shop: { luxury: { store: "Nordstrom", item: "Tissot PRX 35mm", price: "$350" }, mid: { store: "Amazon", item: "Seiko Presage Cocktail Time", price: "$295" }, budget: { store: "Amazon", item: "Timex Marlin Automatic", price: "$130" } } },
      { title: "Belt", detail: "A slim leather belt in dark brown or black. Simple brushed buckle.", shop: { luxury: { store: "Nordstrom", item: "Anderson's Leather Belt", price: "$180" }, mid: { store: "Banana Republic", item: "Italian Leather Belt", price: "$55" }, budget: { store: "Amazon", item: "Amazon Essentials Classic Belt", price: "$15" } } },
      { title: "Fragrance", detail: "A fresh, clean fragrance — citrus and white musk notes.", shop: { luxury: { store: "Sephora", item: "Bleu de Chanel EDT", price: "$105" }, mid: { store: "Ulta", item: "Versace Pour Homme", price: "$65" }, budget: { store: "Amazon", item: "Nautica Voyage EDT", price: "$15" } } },
    ],
  },
  "Rugged Refined": {
    makeup: [
      { title: "Beard Care", detail: "Trim beard to a clean shape. Apply beard oil for softness and sheen.", shop: { luxury: { store: "Nordstrom", item: "Aesop Shine Hair & Beard Oil", price: "$40" }, mid: { store: "Amazon", item: "Honest Amish Classic Beard Oil", price: "$13" }, budget: { store: "Amazon", item: "Viking Revolution Beard Oil", price: "$8" } } },
      { title: "Skincare", detail: "Cleanse, moisturize, and apply SPF. Use an eye cream if needed.", shop: { luxury: { store: "Sephora", item: "Kiehl's Facial Fuel Moisturizer", price: "$38" }, mid: { store: "Ulta", item: "Bulldog Original Moisturizer", price: "$8" }, budget: { store: "Amazon", item: "Nivea Men Creme", price: "$5" } } },
      { title: "Hair Styling", detail: "Use a matte clay or paste for textured, natural-looking hold.", shop: { luxury: { store: "Nordstrom", item: "Baxter of California Clay Pomade", price: "$23" }, mid: { store: "Amazon", item: "Hanz de Fuko Claymation", price: "$18" }, budget: { store: "Amazon", item: "Every Man Jack Matte Fiber Cream", price: "$8" } } },
    ],
    top: [
      { title: "Flannel Shirt", detail: "A heavyweight flannel in plaid — red/black, green/navy, or earth tones.", shop: { luxury: { store: "Nordstrom", item: "Filson Vintage Flannel Shirt", price: "$145" }, mid: { store: "L.L.Bean", item: "Scotch Plaid Flannel Shirt", price: "$55" }, budget: { store: "Amazon", item: "Amazon Essentials Slim-Fit Flannel", price: "$20" } } },
      { title: "Henley", detail: "A waffle-knit henley in charcoal, olive, or burgundy. Roll sleeves up.", shop: { luxury: { store: "Nordstrom", item: "Rag & Bone Classic Henley", price: "$125" }, mid: { store: "J.Crew", item: "Garment-Dyed Henley", price: "$45" }, budget: { store: "Amazon", item: "Hanes Beefy-T Long Sleeve Henley", price: "$12" } } },
    ],
    bottom: [
      { title: "Rugged Jeans", detail: "Straight-fit dark wash jeans. Heavyweight denim, minimal distressing.", shop: { luxury: { store: "Nordstrom", item: "Iron Heart 21oz Selvedge Denim", price: "$375" }, mid: { store: "Levi's", item: "501 Original Fit in Dark Wash", price: "$70" }, budget: { store: "Amazon", item: "Wrangler Authentics Classic Regular Fit", price: "$22" } } },
      { title: "Alternative: Canvas Pants", detail: "Heavy canvas work pants in khaki or olive.", shop: { luxury: { store: "Filson", item: "Dry Tin Cloth Work Pants", price: "$195" }, mid: { store: "Carhartt", item: "Rugged Flex Canvas Work Pant", price: "$50" }, budget: { store: "Amazon", item: "Wrangler Workwear Canvas Pant", price: "$25" } } },
    ],
    shoes: [
      { title: "Work Boots", detail: "Leather work boots in brown or tan. Goodyear welt, quality sole.", shop: { luxury: { store: "Nordstrom", item: "Red Wing Iron Ranger", price: "$350" }, mid: { store: "Amazon", item: "Thursday Boot Company Captain", price: "$199" }, budget: { store: "Amazon", item: "EVER BOOTS Tank Work Boot", price: "$45" } } },
      { title: "Alternative: Chelsea Boots", detail: "Suede or leather Chelsea boots in dark brown.", shop: { luxury: { store: "Nordstrom", item: "R.M. Williams Comfort Craftsman", price: "$495" }, mid: { store: "Birkenstock", item: "Birkenstock Stalon Chelsea Boot", price: "$200" }, budget: { store: "Amazon", item: "Bruno Marc Chelsea Boot", price: "$35" } } },
    ],
    accessories: [
      { title: "Watch", detail: "A field watch or diver with a canvas or leather strap.", shop: { luxury: { store: "Nordstrom", item: "Hamilton Khaki Field Mechanical", price: "$495" }, mid: { store: "Amazon", item: "Seiko 5 Sports Field Watch", price: "$275" }, budget: { store: "Amazon", item: "Casio Duro Diver MDV-106", price: "$45" } } },
      { title: "Belt & Wallet", detail: "A thick leather belt with brass buckle. Matching leather bi-fold wallet.", shop: { luxury: { store: "Nordstrom", item: "Filson Bridle Leather Belt", price: "$95" }, mid: { store: "Amazon", item: "Carhartt Saddle Leather Belt", price: "$30" }, budget: { store: "Amazon", item: "Dickies Industrial Belt", price: "$12" } } },
      { title: "Fragrance", detail: "Woody, leathery scent — cedarwood, sandalwood, vetiver notes.", shop: { luxury: { store: "Sephora", item: "Tom Ford Oud Wood EDP", price: "$160" }, mid: { store: "Ulta", item: "Dolce & Gabbana The One EDP", price: "$80" }, budget: { store: "Amazon", item: "Guess Seductive Homme EDT", price: "$20" } } },
    ],
  },
  "Modern Minimal": {
    makeup: [
      { title: "Basic Skincare", detail: "Gentle cleanser, lightweight moisturizer, SPF. Nothing more, nothing less.", shop: { luxury: { store: "Sephora", item: "Aesop In Two Minds Facial Cleanser", price: "$43" }, mid: { store: "Ulta", item: "CeraVe Foaming Facial Cleanser", price: "$15" }, budget: { store: "Amazon", item: "Cetaphil Gentle Skin Cleanser", price: "$8" } } },
      { title: "Brow & Lip", detail: "Trim stray brow hairs. Apply a simple lip balm. Keep things clean.", shop: { luxury: { store: "Sephora", item: "Kiehl's Lip Balm #1", price: "$12" }, mid: { store: "Amazon", item: "Jack Black Lip Balm SPF 25", price: "$8" }, budget: { store: "Amazon", item: "Aquaphor Lip Repair", price: "$4" } } },
    ],
    top: [
      { title: "Essential Tee", detail: "A quality crew or V-neck tee in black, white, grey, or navy. Zero logos.", shop: { luxury: { store: "Nordstrom", item: "Sunspel Classic Crew Neck Tee", price: "$75" }, mid: { store: "Everlane", item: "The Organic Cotton Crew Tee", price: "$30" }, budget: { store: "Amazon", item: "Goodthreads Slim-Fit Cotton Tee", price: "$10" } } },
      { title: "Lightweight Jacket", detail: "A minimal harrington or bomber in black or navy. Clean zippers, no patches.", shop: { luxury: { store: "Nordstrom", item: "A.P.C. Sutherland Bomber Jacket", price: "$495" }, mid: { store: "Uniqlo", item: "Harrington Jacket", price: "$60" }, budget: { store: "Amazon", item: "Amazon Essentials Lightweight Bomber", price: "$30" } } },
    ],
    bottom: [
      { title: "Slim Trousers", detail: "Tailored slim trousers in black, charcoal, or navy. Minimal design.", shop: { luxury: { store: "Nordstrom", item: "Theory Zaine Precision Pant", price: "$245" }, mid: { store: "Uniqlo", item: "Smart Ankle Pants", price: "$40" }, budget: { store: "Amazon", item: "Amazon Essentials Slim-Fit Dress Pant", price: "$25" } } },
      { title: "Dark Jeans", detail: "Slim dark indigo jeans with no distressing. Raw or clean finish.", shop: { luxury: { store: "Nordstrom", item: "A.P.C. Petit New Standard", price: "$220" }, mid: { store: "Levi's", item: "512 Slim Taper in Clean Dark", price: "$70" }, budget: { store: "Amazon", item: "Lee Extreme Motion Slim Jean", price: "$30" } } },
    ],
    shoes: [
      { title: "White Sneakers", detail: "Minimal white leather sneakers. No branding, clean silhouette.", shop: { luxury: { store: "Nordstrom", item: "Common Projects Original Achilles", price: "$425" }, mid: { store: "Vans", item: "Veja Campo Chromefree Leather", price: "$160" }, budget: { store: "Converse", item: "Converse Chuck Taylor All Star Low White", price: "$60" } } },
      { title: "Alternative: Black Derbies", detail: "Sleek black leather derby shoes for a slightly dressier minimal look.", shop: { luxury: { store: "Nordstrom", item: "Church's Shannon Derby", price: "$620" }, mid: { store: "Cole Haan", item: "Cole Haan Original Grand Plain Oxford", price: "$140" }, budget: { store: "Amazon", item: "Bruno Marc Oxford Derby Shoes", price: "$30" } } },
    ],
    accessories: [
      { title: "Watch", detail: "A thin, clean-dial watch with a mesh or leather strap.", shop: { luxury: { store: "Nordstrom", item: "Junghans Max Bill Automatic", price: "$1,195" }, mid: { store: "Amazon", item: "Skagen Signatur Slim Watch", price: "$95" }, budget: { store: "Amazon", item: "CIVO Ultra Thin Watch", price: "$20" } } },
      { title: "Bag", detail: "A simple black or grey backpack with minimal branding.", shop: { luxury: { store: "Nordstrom", item: "Troubadour Apex Backpack", price: "$475" }, mid: { store: "Everlane", item: "The Modern Zip Backpack", price: "$68" }, budget: { store: "Amazon", item: "Matein Slim Laptop Backpack", price: "$25" } } },
    ],
  },
  "Beach Goddess": {
    makeup: [
      { title: "Waterproof Base", detail: "Use a tinted SPF moisturizer for a natural, sun-kissed glow. Skip heavy foundation.", shop: { luxury: { store: "Sephora", item: "Supergoop Glowscreen SPF 40", price: "$38" }, mid: { store: "Ulta", item: "Australian Gold Botanical Tinted SPF 50", price: "$16" }, budget: { store: "Target", item: "CeraVe Tinted Sunscreen SPF 30", price: "$12" } } },
      { title: "Waterproof Mascara & Brows", detail: "One coat of waterproof mascara and a clear brow gel to keep everything in place poolside.", shop: { luxury: { store: "Sephora", item: "Too Faced Better Than Sex Waterproof Mascara", price: "$29" }, mid: { store: "Ulta", item: "Essence Lash Princess Waterproof", price: "$5" }, budget: { store: "Amazon", item: "Maybelline Lash Sensational Waterproof", price: "$8" } } },
      { title: "Bronzer & Lip", detail: "Dust bronzer on cheeks and shoulders. Apply a tinted lip balm with SPF.", shop: { luxury: { store: "Sephora", item: "Tom Ford Soleil Glow Bronzer", price: "$68" }, mid: { store: "Ulta", item: "Physician's Formula Butter Bronzer", price: "$15" }, budget: { store: "Amazon", item: "e.l.f. Putty Bronzer", price: "$7" } } },
    ],
    swimwear: [
      { title: "Bikini Top", detail: "Triangle or balconette bikini top. Look for adjustable straps and removable padding for a custom fit.", tip: "Underwire styles provide extra support for larger busts", shop: { luxury: { store: "Net-a-Porter", item: "Zimmermann Floral Triangle Bikini Top", price: "$195" }, mid: { store: "Nordstrom", item: "Seafolly Wrap Front Bikini Top", price: "$78" }, budget: { store: "Target", item: "Shade & Shore Textured Triangle Top", price: "$22" } } },
      { title: "Bikini Bottom", detail: "High-cut or Brazilian-cut bottom for an elongated leg line. Match or mix with your top.", shop: { luxury: { store: "Net-a-Porter", item: "Frankies Bikinis Jenna High-Leg Bottom", price: "$95" }, mid: { store: "Nordstrom", item: "Seafolly High Waist Bikini Bottom", price: "$62" }, budget: { store: "Target", item: "Shade & Shore High Leg Cheeky Bottom", price: "$18" } } },
      { title: "One-Piece Alternative", detail: "A plunging V-neck or cutout one-piece for a sophisticated beach look.", shop: { luxury: { store: "Net-a-Porter", item: "Norma Kamali Marissa Swimsuit", price: "$175" }, mid: { store: "Nordstrom", item: "Good American Always Fits One-Piece", price: "$99" }, budget: { store: "Amazon", item: "CUPSHE Cutout One Piece Swimsuit", price: "$32" } } },
    ],
    accessories: [
      { title: "Cover-Up", detail: "A sheer crochet or linen cover-up dress for transitioning from beach to bar.", shop: { luxury: { store: "Revolve", item: "Cult Gaia Kaia Knit Cover-Up", price: "$298" }, mid: { store: "Nordstrom", item: "Elan Crochet Cover-Up Dress", price: "$58" }, budget: { store: "Amazon", item: "Bsubseach Crochet Beach Cover Up", price: "$22" } } },
      { title: "Sunglasses & Hat", detail: "Oversized cat-eye sunglasses and a wide-brim straw hat complete the beach look.", shop: { luxury: { store: "Nordstrom", item: "Gucci Oversized Sunglasses", price: "$380" }, mid: { store: "Nordstrom", item: "Quay Australia After Hours Sunnies", price: "$55" }, budget: { store: "Amazon", item: "SOJOS Retro Oversized Sunglasses", price: "$15" } } },
      { title: "Beach Bag", detail: "An oversized straw tote that fits towels, sunscreen, and your essentials.", shop: { luxury: { store: "Net-a-Porter", item: "Loewe Basket Bag in Raffia", price: "$550" }, mid: { store: "Nordstrom", item: "BTB Los Angeles Straw Tote", price: "$68" }, budget: { store: "Target", item: "A New Day Straw Circle Tote", price: "$25" } } },
    ],
    shoes: [
      { title: "Sandals", detail: "Strappy flat sandals or elevated slide sandals. Waterproof materials preferred.", shop: { luxury: { store: "Nordstrom", item: "Ancient Greek Sandals Eleftheria", price: "$230" }, mid: { store: "Nordstrom", item: "Steve Madden Knox Slide Sandal", price: "$60" }, budget: { store: "Target", item: "A New Day Braided Slide Sandal", price: "$20" } } },
    ],
  },
  "Silk & Lace": {
    makeup: [
      { title: "Romantic Glow", detail: "Dewy primer, light coverage base, and a flush of rose blush for a bedroom-ready glow.", shop: { luxury: { store: "Sephora", item: "Charlotte Tilbury Flawless Filter", price: "$49" }, mid: { store: "Ulta", item: "Glossier Futuredew Serum", price: "$26" }, budget: { store: "Amazon", item: "e.l.f. Halo Glow Setting Powder", price: "$9" } } },
      { title: "Sultry Eye & Lip", detail: "Smudged eyeliner, mascara, and a berry or nude lip stain for a hint of allure.", shop: { luxury: { store: "Sephora", item: "YSL Tatouage Couture Lip Stain", price: "$39" }, mid: { store: "Ulta", item: "Revlon Kiss Cloud Lip Tint", price: "$10" }, budget: { store: "Target", item: "Maybelline Vinyl Ink Lip Color", price: "$9" } } },
    ],
    lingerie: [
      { title: "Bralette or Bra", detail: "Delicate lace bralette or underwired plunge bra. Look for scalloped edges and mesh details.", tip: "Bralettes work best for A-C cups; plunge bras offer more support for D+", shop: { luxury: { store: "Nordstrom", item: "Fleur du Mal Lily Lace Bralette", price: "$128" }, mid: { store: "Nordstrom", item: "Free People Adella Lace Bralette", price: "$38" }, budget: { store: "Amazon", item: "DOBREVA Lace Bralette with Padding", price: "$18" } } },
      { title: "Matching Bottom", detail: "High-waist lace thong, cheeky, or Brazilian cut. Match the lace pattern to your top.", shop: { luxury: { store: "Nordstrom", item: "Agent Provocateur Mercy Thong", price: "$95" }, mid: { store: "Nordstrom", item: "Natori Feathers Hipster", price: "$36" }, budget: { store: "Amazon", item: "Avidlove Lace Cheeky Panties 3-Pack", price: "$16" } } },
      { title: "Corset or Bustier", detail: "A satin or lace corset with boning for a structured, sculpted silhouette. Can double as a top.", shop: { luxury: { store: "Net-a-Porter", item: "Dion Lee Lace-Up Corset Top", price: "$490" }, mid: { store: "Nordstrom", item: "Good American Lace Corset Top", price: "$89" }, budget: { store: "Amazon", item: "Houseables Satin Corset Bustier", price: "$24" } } },
      { title: "Silk Robe or Slip", detail: "A mid-thigh silk robe or satin chemise for an elegant layering piece.", tip: "Kimono-style robes add drama; wrap robes are more classic", shop: { luxury: { store: "Net-a-Porter", item: "Olivia von Halle Issa Silk Robe", price: "$495" }, mid: { store: "Nordstrom", item: "Flora Nikrooz Showstopper Robe", price: "$68" }, budget: { store: "Amazon", item: "Ekouaer Satin Kimono Robe", price: "$20" } } },
      { title: "Bodysuit", detail: "Sheer mesh or lace bodysuit — can be worn alone or styled under jeans/blazers.", shop: { luxury: { store: "Net-a-Porter", item: "Kiki de Montparnasse Allover Lace Bodysuit", price: "$295" }, mid: { store: "Nordstrom", item: "Free People Intimately Lace Bodysuit", price: "$48" }, budget: { store: "Amazon", item: "SheIn Mesh Lace Bodysuit", price: "$15" } } },
    ],
    accessories: [
      { title: "Hosiery", detail: "Sheer thigh-highs with lace tops or fishnet stockings for an extra sultry touch.", shop: { luxury: { store: "Nordstrom", item: "Wolford Satin Touch Stay-Up Stockings", price: "$52" }, mid: { store: "Nordstrom", item: "Commando Sheer Thigh-Highs", price: "$28" }, budget: { store: "Amazon", item: "Berkshire Sheer Thigh-Highs 2-Pack", price: "$10" } } },
      { title: "Fragrance", detail: "A warm, sensual scent with notes of vanilla, amber, or musk.", shop: { luxury: { store: "Sephora", item: "Tom Ford Black Orchid EDP", price: "$180" }, mid: { store: "Sephora", item: "YSL Black Opium EDP", price: "$98" }, budget: { store: "Amazon", item: "Ariana Grande Cloud EDP", price: "$30" } } },
    ],
    shoes: [
      { title: "Heeled Mules or Slippers", detail: "Feather-trimmed heeled mules or satin bedroom slippers for the finishing touch.", shop: { luxury: { store: "Net-a-Porter", item: "Aquazzura Pom Pom Mules", price: "$750" }, mid: { store: "Nordstrom", item: "Steve Madden Feather Sandal", price: "$80" }, budget: { store: "Amazon", item: "The Drop Feather Heel Sandal", price: "$35" } } },
    ],
  },
  "Tropical Paradise": {
    makeup: [
      { title: "Island Glow Base", detail: "Tinted moisturizer with coconut-scented SPF. Add coral cream blush to cheeks.", shop: { luxury: { store: "Sephora", item: "Tatcha Silk Canvas Primer + Rare Beauty Blush", price: "$62" }, mid: { store: "Ulta", item: "Tarte Amazonian Clay Blush in Captivating", price: "$32" }, budget: { store: "Target", item: "Milani Baked Blush in Corallina", price: "$9" } } },
      { title: "Tropical Eyes & Lips", detail: "Turquoise eyeliner accent with waterproof mascara. Glossy coral lip.", shop: { luxury: { store: "Sephora", item: "Pat McGrath Lip Gloss in Sunset Rose", price: "$29" }, mid: { store: "Ulta", item: "NYX Epic Wear Liner in Turquoise Storm", price: "$10" }, budget: { store: "Amazon", item: "Maybelline Lifter Gloss in Reef", price: "$8" } } },
    ],
    swimwear: [
      { title: "Tropical Print Bikini", detail: "Bold tropical or floral print bikini in vibrant greens, pinks, or oranges. High-cut leg for a flattering line.", tip: "Mix prints — pair a tropical top with solid bottoms", shop: { luxury: { store: "Net-a-Porter", item: "Zimmermann Tropicana Triangle Set", price: "$350" }, mid: { store: "Revolve", item: "Agua Bendita Tropical Bikini Set", price: "$168" }, budget: { store: "Amazon", item: "CUPSHE Tropical Floral Bikini Set", price: "$28" } } },
      { title: "Wrap Sarong", detail: "Lightweight chiffon or cotton sarong in coordinating tropical print. Wear as skirt, dress, or halter.", shop: { luxury: { store: "Net-a-Porter", item: "Johanna Ortiz Silk Wrap Sarong", price: "$295" }, mid: { store: "Nordstrom", item: "ViX Paula Hermanny Printed Sarong", price: "$88" }, budget: { store: "Amazon", item: "SHU-SHI Sarong Beach Cover Up", price: "$16" } } },
      { title: "String Bikini Alternative", detail: "Micro string bikini in neon or sunset ombré for maximum tan lines.", shop: { luxury: { store: "Revolve", item: "Frankies Bikinis Tia String Set", price: "$180" }, mid: { store: "Nordstrom", item: "L*Space Bowie String Bikini", price: "$95" }, budget: { store: "Amazon", item: "Zaful String Triangle Bikini", price: "$18" } } },
    ],
    accessories: [
      { title: "Shell & Bead Jewelry", detail: "Layered shell necklaces, anklets, and beaded bracelets for island vibes.", shop: { luxury: { store: "Net-a-Porter", item: "Tohum Design Puka Shell Necklace", price: "$195" }, mid: { store: "Nordstrom", item: "BaubleBar Shell Layered Necklace Set", price: "$44" }, budget: { store: "Amazon", item: "FIBO STEEL Shell Necklace Set", price: "$14" } } },
      { title: "Straw Bucket Hat & Sunnies", detail: "Woven straw bucket hat with colorful oversized sunglasses.", shop: { luxury: { store: "Nordstrom", item: "Lack of Color Palma Bucket Hat", price: "$89" }, mid: { store: "Nordstrom", item: "Free People Riviera Straw Bucket", price: "$38" }, budget: { store: "Target", item: "A New Day Straw Bucket Hat", price: "$15" } } },
    ],
    shoes: [
      { title: "Platform Espadrilles", detail: "Woven platform espadrille sandals with ankle ties — beach to brunch ready.", shop: { luxury: { store: "Nordstrom", item: "Castañer Carina Wedge Espadrille", price: "$155" }, mid: { store: "DSW", item: "Marc Fisher Adalyn Espadrille", price: "$80" }, budget: { store: "Amazon", item: "DREAM PAIRS Platform Espadrille", price: "$30" } } },
    ],
  },
  "Poolside Glam": {
    makeup: [
      { title: "Waterproof Glam Base", detail: "Full-coverage waterproof foundation with setting spray. Bold lashes with waterproof liner.", shop: { luxury: { store: "Sephora", item: "Lancôme Teint Idole Ultra Wear + Setting Spray", price: "$52" }, mid: { store: "Ulta", item: "MAC Studio Fix + All Nighter Spray", price: "$38" }, budget: { store: "Target", item: "Maybelline SuperStay + e.l.f. Setting Spray", price: "$16" } } },
      { title: "Statement Lip & Contour", detail: "Sharp contour, blinding highlight, and a bold red or hot pink lip that won't budge.", shop: { luxury: { store: "Sephora", item: "Fenty Beauty Stunna Lip Paint in Uncensored", price: "$28" }, mid: { store: "Ulta", item: "Maybelline SuperStay Ink in Pioneer", price: "$11" }, budget: { store: "Amazon", item: "Revlon ColorStay Satin Ink in My Own Boss", price: "$8" } } },
    ],
    swimwear: [
      { title: "Glam One-Piece", detail: "Plunging neckline one-piece with gold hardware, mesh inserts, or metallic finish. Think resort runway.", shop: { luxury: { store: "Net-a-Porter", item: "Versace Medusa Studded One-Piece", price: "$550" }, mid: { store: "Revolve", item: "BEACH RIOT Reese Gold Chain Swimsuit", price: "$168" }, budget: { store: "Amazon", item: "BALEAF V-Neck Mesh Panel Swimsuit", price: "$35" } } },
      { title: "Metallic Bikini", detail: "Gold or silver metallic bikini set with chain details for poolside main-character energy.", shop: { luxury: { store: "Net-a-Porter", item: "Oséree Lumière Metallic Bikini", price: "$280" }, mid: { store: "Revolve", item: "Luli Fama Gold Rush Bikini Set", price: "$150" }, budget: { store: "Amazon", item: "ZAFUL Metallic Gold Bikini Set", price: "$24" } } },
      { title: "Cut-Out Monokini", detail: "Asymmetric cut-out monokini that shows skin in all the right places.", shop: { luxury: { store: "Revolve", item: "Norma Kamali Snake Mesh One-Piece", price: "$195" }, mid: { store: "Nordstrom", item: "Good American Sculptress Cut-Out Swimsuit", price: "$99" }, budget: { store: "Amazon", item: "CUPSHE Cut-Out Monokini", price: "$30" } } },
    ],
    accessories: [
      { title: "Oversized Pool Shades", detail: "Dramatic oversized or shield sunglasses with gold or tortoise frames.", shop: { luxury: { store: "Nordstrom", item: "Saint Laurent SL1 Shield Sunglasses", price: "$420" }, mid: { store: "Nordstrom", item: "Quay High Key Shield Sunnies", price: "$65" }, budget: { store: "Amazon", item: "SOJOS Oversized Shield Sunglasses", price: "$16" } } },
      { title: "Gold Body Chain & Anklet", detail: "Layered gold body chain or belly chain plus a dainty anklet for poolside bling.", shop: { luxury: { store: "Net-a-Porter", item: "Jacquemus La Chaîne Necklace / Body Chain", price: "$330" }, mid: { store: "Revolve", item: "8 Other Reasons Body Chain", price: "$44" }, budget: { store: "Amazon", item: "Dremcoue Layered Body Chain", price: "$12" } } },
      { title: "Luxury Towel & Pool Slides", detail: "Oversized designer-print towel draped over a lounger. Logo pool slides.", shop: { luxury: { store: "Nordstrom", item: "Versace Medusa Beach Towel", price: "$350" }, mid: { store: "Nordstrom", item: "Tory Burch Printed Beach Towel", price: "$78" }, budget: { store: "Target", item: "Sun Squad Oversized Beach Towel", price: "$15" } } },
    ],
    shoes: [
      { title: "Designer Slides", detail: "Elevated pool slides in metallic, padded, or logo style.", shop: { luxury: { store: "Nordstrom", item: "Bottega Veneta Padded Slide Sandal", price: "$620" }, mid: { store: "Nordstrom", item: "Steve Madden Soulful Slide", price: "$60" }, budget: { store: "Target", item: "Shade & Shore Puffy Slide Sandal", price: "$18" } } },
    ],
  },
  "Midnight Lace": {
    makeup: [
      { title: "Dark Glam Base", detail: "Matte full-coverage foundation, sharp contour, and a dark berry or wine lip.", shop: { luxury: { store: "Sephora", item: "Charlotte Tilbury Matte Revolution in Walk of No Shame", price: "$37" }, mid: { store: "Ulta", item: "MAC Matte Lipstick in Diva", price: "$22" }, budget: { store: "Amazon", item: "Revlon Super Lustrous in Black Cherry", price: "$8" } } },
      { title: "Smoky Eye", detail: "Deep smoky eye with black and plum tones. Winged liner and dramatic lashes.", shop: { luxury: { store: "Sephora", item: "Tom Ford Eye Color Quad in Disco Dust", price: "$90" }, mid: { store: "Ulta", item: "Urban Decay Naked3 Palette", price: "$30" }, budget: { store: "Amazon", item: "NYX Ultimate Shadow Palette Smokey", price: "$14" } } },
    ],
    lingerie: [
      { title: "Black Lace Set", detail: "Matching black lace bra and thong with geometric or floral lace patterns. Underwire for structure.", shop: { luxury: { store: "Nordstrom", item: "Agent Provocateur Mercy Bra + Brief Set", price: "$295" }, mid: { store: "Nordstrom", item: "Savage X Fenty Black Lace Unlined Set", price: "$65" }, budget: { store: "Amazon", item: "Avidlove Lace Bra and Panty Set", price: "$18" } } },
      { title: "Garter Belt & Stockings", detail: "A lace garter belt paired with sheer black thigh-high stockings for a classic seductive silhouette.", shop: { luxury: { store: "Net-a-Porter", item: "Bordelle Art Deco Suspender Belt", price: "$185" }, mid: { store: "Nordstrom", item: "Hanky Panky Lace Garter Belt", price: "$38" }, budget: { store: "Amazon", item: "Dreamgirl Garter Belt + Stockings Set", price: "$16" } } },
      { title: "Sheer Robe", detail: "Floor-length sheer black robe with lace trim. Dramatic and elegant layering piece.", shop: { luxury: { store: "Net-a-Porter", item: "Carine Gilson Long Lace-Trimmed Robe", price: "$890" }, mid: { store: "Nordstrom", item: "Rya Collection Darling Robe", price: "$120" }, budget: { store: "Amazon", item: "Avidlove Long Sheer Lace Robe", price: "$22" } } },
    ],
    accessories: [
      { title: "Choker & Jewelry", detail: "Velvet or lace choker necklace with dangling charm. Black lace gloves optional for drama.", shop: { luxury: { store: "Net-a-Porter", item: "Fallon Monarch Velvet Choker", price: "$125" }, mid: { store: "Nordstrom", item: "Ettika Velvet Choker Set", price: "$35" }, budget: { store: "Amazon", item: "Mudder Velvet Choker Set 6pcs", price: "$10" } } },
      { title: "Dark Fragrance", detail: "Deep, intoxicating scent with oud, dark rose, or black orchid notes.", shop: { luxury: { store: "Sephora", item: "Tom Ford Black Orchid EDP", price: "$180" }, mid: { store: "Sephora", item: "Viktor&Rolf Flowerbomb Midnight", price: "$105" }, budget: { store: "Amazon", item: "Pacifica Dream Moon EDP", price: "$22" } } },
    ],
    shoes: [
      { title: "Strappy Stilettos", detail: "Black strappy stiletto heels with ankle wrap for a dramatic silhouette.", shop: { luxury: { store: "Nordstrom", item: "Aquazzura Tequila Sandal", price: "$950" }, mid: { store: "Nordstrom", item: "Schutz Cadey Lee Sandal", price: "$118" }, budget: { store: "Amazon", item: "DREAM PAIRS Strappy Stiletto Sandal", price: "$32" } } },
    ],
  },
  "Velvet Boudoir": {
    makeup: [
      { title: "Soft & Sultry Base", detail: "Luminous foundation, peach blush, champagne highlight. Soft, romantic, and touchable.", shop: { luxury: { store: "Sephora", item: "Armani Luminous Silk + Becca Highlighter", price: "$72" }, mid: { store: "Ulta", item: "L'Oréal Lumi Glotion + Milani Baked Highlight", price: "$22" }, budget: { store: "Target", item: "e.l.f. Halo Glow + Flower Beauty Highlight", price: "$14" } } },
      { title: "Nude Lip & Soft Lashes", detail: "Nude-pink lip liner filled in with gloss. Natural-looking false lash strips.", shop: { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Pillow Talk Lip Kit", price: "$45" }, mid: { store: "Ulta", item: "NYX Lip Liner + Butter Gloss Duo", price: "$14" }, budget: { store: "Amazon", item: "Revlon Lip Liner + e.l.f. Lip Lacquer", price: "$10" } } },
    ],
    lingerie: [
      { title: "Velvet Bralette Set", detail: "Crushed velvet bralette with matching high-waist brief in jewel tones — emerald, burgundy, or sapphire.", shop: { luxury: { store: "Net-a-Porter", item: "Fleur du Mal Velvet Triangle Bralette Set", price: "$198" }, mid: { store: "Nordstrom", item: "Savage X Fenty Velvet Unlined Set", price: "$55" }, budget: { store: "Amazon", item: "SheIn Velvet Bralette & Brief Set", price: "$16" } } },
      { title: "Satin Slip Dress", detail: "Bias-cut satin mini slip dress in champagne or blush. Works as nightwear or styled out with heels.", shop: { luxury: { store: "Net-a-Porter", item: "Reformation Satin Silk Slip Dress", price: "$198" }, mid: { store: "Nordstrom", item: "BP. Satin Slip Dress", price: "$45" }, budget: { store: "Amazon", item: "The Drop Ana Satin Slip Dress", price: "$35" } } },
      { title: "Feather-Trim Robe", detail: "Satin robe with marabou feather cuffs in pastel pink or champagne. Old Hollywood glamour.", tip: "Pair with matching satin slippers for the full look", shop: { luxury: { store: "Net-a-Porter", item: "Gilda & Pearl Feather Robe", price: "$545" }, mid: { store: "Nordstrom", item: "Rya Collection Swan Feather Robe", price: "$165" }, budget: { store: "Amazon", item: "Boudoir by D'Lish Feather Robe", price: "$40" } } },
    ],
    accessories: [
      { title: "Satin Slippers", detail: "Marabou-trimmed satin slippers or kitten heel mules in matching tones.", shop: { luxury: { store: "Net-a-Porter", item: "Aquazzura Pom Pom Mule", price: "$750" }, mid: { store: "Nordstrom", item: "Steve Madden Feather Sandal", price: "$80" }, budget: { store: "Amazon", item: "The Drop Feather Heel Sandal", price: "$35" } } },
      { title: "Vanity Fragrance", detail: "A warm, powdery scent with notes of rose, vanilla, and sandalwood.", shop: { luxury: { store: "Sephora", item: "Diptyque Eau Rose EDP", price: "$175" }, mid: { store: "Sephora", item: "Sol de Janeiro Brazilian Bum Bum Cream", price: "$48" }, budget: { store: "Amazon", item: "Ariana Grande Cloud EDP", price: "$30" } } },
    ],
  },
  "Butterfly Babe": {
    makeup: [
      { title: "Frosted Glam", detail: "Shimmery pastel eyeshadow (baby blue, pink, or lilac), thin arched brows, frosted lip gloss, and body glitter on collarbones.", shop: { luxury: { store: "Sephora", item: "Pat McGrath Mothership Palette in Subliminal", price: "$128" }, mid: { store: "Ulta", item: "ColourPop Y2K Baby Palette", price: "$14" }, budget: { store: "Amazon", item: "NYX Glitter Goals Liquid Eyeshadow", price: "$7" } } },
      { title: "Glossy Lips & Highlights", detail: "Clear or pink-tinted lip gloss with maximum shine. Highlight on cheekbones and inner corners.", shop: { luxury: { store: "Sephora", item: "Dior Lip Maximizer Gloss", price: "$38" }, mid: { store: "Ulta", item: "NYX Butter Gloss in Crème Brûlée", price: "$5" }, budget: { store: "Amazon", item: "essence Extreme Shine Lip Gloss", price: "$3" } } },
    ],
    top: [
      { title: "Y2K Crop Top", detail: "Sparkly butterfly or rhinestone halter top, mesh baby tee, or bandana top. Low neckline, midriff-baring.", shop: { luxury: { store: "Revolve", item: "Retrofête Crystal Halter Top", price: "$295" }, mid: { store: "Urban Outfitters", item: "BDG Mesh Baby Tee", price: "$29" }, budget: { store: "Amazon", item: "SheIn Butterfly Print Halter Crop Top", price: "$12" } } },
      { title: "Velour Zip-Up", detail: "Fitted velour track jacket in pink, baby blue, or lavender. Zip halfway for the iconic look.", shop: { luxury: { store: "Revolve", item: "Juicy Couture OG Velour Jacket", price: "$128" }, mid: { store: "Urban Outfitters", item: "Juicy Couture UO Exclusive Track Jacket", price: "$69" }, budget: { store: "Amazon", item: "Made By Johnny Velour Track Jacket", price: "$25" } } },
    ],
    bottom: [
      { title: "Low-Rise Jeans or Mini", detail: "Low-rise bootcut jeans with a studded belt, or a pleated plaid mini skirt.", shop: { luxury: { store: "Revolve", item: "AGOLDE Low-Rise Baggy Jeans", price: "$198" }, mid: { store: "Urban Outfitters", item: "BDG Low-Rise Flare Jean", price: "$79" }, budget: { store: "Amazon", item: "ZMPSIISA Low-Rise Wide Leg Jeans", price: "$35" } } },
    ],
    shoes: [
      { title: "Platform Shoes", detail: "Chunky platform sneakers, clear jelly sandals, or platform flip-flops.", shop: { luxury: { store: "Nordstrom", item: "Naked Wolfe Slingback Platform", price: "$280" }, mid: { store: "DSW", item: "Steve Madden Charge Platform Sneaker", price: "$90" }, budget: { store: "Amazon", item: "DREAM PAIRS Chunky Platform Sneaker", price: "$35" } } },
    ],
    accessories: [
      { title: "Butterfly & Bling", detail: "Butterfly hair clips, tinted rectangular sunglasses, layered belly chains, and a tiny baguette bag.", shop: { luxury: { store: "Revolve", item: "FENDI Baguette Bag Mini", price: "$1,590" }, mid: { store: "Urban Outfitters", item: "UO Mini Baguette Bag + Butterfly Clips Set", price: "$38" }, budget: { store: "Amazon", item: "Y2K Butterfly Clip + Belly Chain + Baguette Set", price: "$18" } } },
      { title: "Phone Charms & Chokers", detail: "Beaded phone charms, tattoo chokers, and plastic bead bracelets for full Y2K energy.", shop: { luxury: { store: "Revolve", item: "Swarovski Crystal Phone Charm", price: "$65" }, mid: { store: "Urban Outfitters", item: "UO Beaded Phone Charm Pack", price: "$14" }, budget: { store: "Amazon", item: "FROG SAC Tattoo Choker + Phone Charm Set", price: "$10" } } },
    ],
  },
  "Meadow Dream": {
    makeup: [
      { title: "Dewy Natural Glow", detail: "Tinted moisturizer, cream blush in soft peach, fluffy natural brows, and a tinted lip balm in berry or rose.", shop: { luxury: { store: "Glossier", item: "Glossier Cloud Paint in Dusk + Boy Brow", price: "$36" }, mid: { store: "Rare Beauty", item: "Rare Beauty Soft Pinch Blush in Joy", price: "$23" }, budget: { store: "Target", item: "Flower Beauty Blush Bomb in Pinched", price: "$10" } } },
      { title: "Freckles & Fresh Skin", detail: "Fake freckles with a brow pencil, dewy setting spray, and minimal mascara for a fresh-from-the-garden look.", shop: { luxury: { store: "Sephora", item: "MILK Makeup Hydro Grip Setting Spray", price: "$36" }, mid: { store: "Ulta", item: "e.l.f. Power Grip Dewy Setting Spray", price: "$10" }, budget: { store: "Amazon", item: "NYX Dewy Finish Setting Spray", price: "$8" } } },
    ],
    top: [
      { title: "Floral Blouse or Dress", detail: "Puff-sleeve floral blouse in a ditsy print, or a smocked milkmaid top in cream or sage.", shop: { luxury: { store: "Reformation", item: "Julianna Puff Sleeve Top in Floral", price: "$148" }, mid: { store: "& Other Stories", item: "Puff Sleeve Smocked Blouse", price: "$69" }, budget: { store: "Amazon", item: "Milumia Floral Puff Sleeve Blouse", price: "$22" } } },
      { title: "Linen Pinafore", detail: "A linen apron dress or pinafore in natural, mustard, or sage green over a white cotton tee.", shop: { luxury: { store: "Net-a-Porter", item: "Zimmermann Linen Midi Dress", price: "$495" }, mid: { store: "& Other Stories", item: "Linen Pinafore Midi Dress", price: "$99" }, budget: { store: "Amazon", item: "YESNO Linen Pinafore Dress", price: "$28" } } },
    ],
    bottom: [
      { title: "Flowy Midi Skirt", detail: "A tiered prairie skirt in floral, gingham, or solid linen. High waist, soft movement.", shop: { luxury: { store: "Reformation", item: "Petites Naya Skirt in Flora", price: "$178" }, mid: { store: "Mango", item: "Floral Midi Skirt with Ruffles", price: "$60" }, budget: { store: "Amazon", item: "Afibi Floral A-Line Midi Skirt", price: "$22" } } },
    ],
    shoes: [
      { title: "Mary Janes or Boots", detail: "Brown leather Mary Jane shoes, lace-up ankle boots, or woven espadrilles.", shop: { luxury: { store: "Nordstrom", item: "Loeffler Randall Leather Mary Jane", price: "$350" }, mid: { store: "DSW", item: "Dr. Martens Mary Jane", price: "$120" }, budget: { store: "Amazon", item: "DREAM PAIRS Mary Jane Flats", price: "$28" } } },
    ],
    accessories: [
      { title: "Straw Hat & Wicker Bag", detail: "A wide-brim straw sun hat and a woven wicker or rattan basket bag. Ribbon tied around the hat.", shop: { luxury: { store: "Net-a-Porter", item: "Lack of Color The Spencer Wide Brim", price: "$120" }, mid: { store: "Nordstrom", item: "Brixton Joanna Straw Hat", price: "$55" }, budget: { store: "Amazon", item: "Lanzom Wide Brim Straw Hat", price: "$16" } } },
      { title: "Daisy Chain Jewelry", detail: "Dainty daisy pendant necklace, pearl studs, and a woven friendship bracelet.", shop: { luxury: { store: "Nordstrom", item: "Tory Burch Kira Pearl Studs", price: "$78" }, mid: { store: "Nordstrom", item: "Madewell Daisy Pendant Necklace", price: "$32" }, budget: { store: "Amazon", item: "PAVOI Daisy Necklace + Pearl Studs Set", price: "$14" } } },
      { title: "Hair Ribbon", detail: "Satin or gingham hair ribbon tied in a bow, or fresh flowers tucked behind the ear.", shop: { luxury: { store: "Net-a-Porter", item: "Jennifer Behr Silk Hair Ribbon", price: "$48" }, mid: { store: "Free People", item: "Bow Hair Ribbon Set", price: "$18" }, budget: { store: "Amazon", item: "Satin Hair Ribbon 6-Pack", price: "$8" } } },
    ],
  },
};

export const lookMeta: Record<string, { match: number; desc: string }> = {
  "Soft Glam": { match: 96, desc: "Elegant & refined — silk, rose gold, satin" },
  "Golden Hour": { match: 93, desc: "Warm earth tones — suede, bronze, cognac" },
  "Berry Chic": { match: 89, desc: "Bold & polished — black, berry, silver" },
  "Urban Edge": { match: 94, desc: "Streetwear staples — sneakers, cargos, hoodies" },
  "Clean Slate": { match: 95, desc: "Minimalist essentials — neutrals, clean lines, no logos" },
  "Retro Revival": { match: 91, desc: "Vintage vibes — flares, prints, platforms" },
  "Sport Luxe": { match: 92, desc: "Athletic meets fashion — joggers, sneakers, tech" },
  "Desert Wanderer": { match: 95, desc: "Free-spirited boho — earthy layers, turquoise accents" },
  "Ivy League": { match: 96, desc: "Preppy polish — blazers, loafers, clean patterns" },
  "Rebel Noir": { match: 95, desc: "Dark & edgy — leather, studs, combat boots" },
  "Coastal Luxe": { match: 96, desc: "Resort elegance — linen, sandals, straw" },
  "Sharp & Clean": { match: 96, desc: "Precision grooming — clean skin, quality basics" },
  "Rugged Refined": { match: 92, desc: "Textured beard, work boots, woodsy scent" },
  "Modern Minimal": { match: 88, desc: "No-fuss grooming — essentials only" },
  "Beach Goddess": { match: 95, desc: "Sun-kissed bikini looks — bronzed, effortless, beach-ready" },
  "Silk & Lace": { match: 96, desc: "Luxe intimate wear — lace, silk, sultry elegance" },
  "Tropical Paradise": { match: 94, desc: "Bold tropical prints — island vibes, shell jewelry, sarongs" },
  "Poolside Glam": { match: 95, desc: "Main-character pool energy — metallic swim, gold chains, bold lip" },
  "Midnight Lace": { match: 93, desc: "Dark, dramatic intimates — black lace, garters, smoky eyes" },
  "Velvet Boudoir": { match: 94, desc: "Old Hollywood intimates — velvet, feathers, champagne tones" },
  "Butterfly Babe": { match: 94, desc: "Y2K nostalgia — butterfly tops, low-rise, frosted gloss, baguette bags" },
  "Meadow Dream": { match: 95, desc: "Cottagecore romance — florals, linen, straw hats, wicker baskets" },
  "Bag Edit": { match: 95, desc: "The perfect bag to complete any look — totes, clutches, crossbodies" },
  "Shoe Edit": { match: 95, desc: "Designer kicks and heels — the focal point of your fit" },
};

// Shoe-specific look data for shopping
export const shoeLookData: Record<string, Step[]> = {
  "Shoe Edit": [
    { title: "Retro Sneakers", detail: "Heritage silhouettes like Air Jordan 1, Nike Dunk Low, New Balance 550, or Adidas Samba. Timeless designs that pair with everything from jeans to tailored trousers.", tip: "White/neutral colorways are the most versatile", shop: { luxury: { store: "SSENSE", item: "Golden Goose Super-Star Sneakers", price: "$530" }, mid: { store: "Nike", item: "Nike Dunk Low Retro", price: "$115" }, budget: { store: "New Balance", item: "New Balance 480 Classic", price: "$75" } } },
    { title: "Running Sneakers", detail: "Performance-meets-style runners — Nike Air Max 90, Asics Gel-Kayano 14, Adidas Ultra Boost, or On Cloud. Tech fabrics and cushioned soles.", shop: { luxury: { store: "SSENSE", item: "Salomon XT-6 Advanced", price: "$195" }, mid: { store: "Nike", item: "Nike Air Max 90", price: "$130" }, budget: { store: "Adidas", item: "Adidas Ultraboost 1.0", price: "$95" } } },
    { title: "Designer Sneakers", detail: "Luxury sneakers from Balenciaga Triple S, Alexander McQueen Oversized, Maison Margiela Replica, or Common Projects Achilles. Statement pieces that elevate any casual look.", shop: { luxury: { store: "Nordstrom", item: "Alexander McQueen Oversized Sneaker", price: "$590" }, mid: { store: "Nordstrom", item: "Common Projects Original Achilles", price: "$411" }, budget: { store: "Converse", item: "Converse Chuck 70 Hi", price: "$90" } } },
    { title: "Stiletto Heels", detail: "Pointed-toe stilettos from Christian Louboutin So Kate, Manolo Blahnik BB, or Jimmy Choo Anouk. The ultimate power shoe for evening and formal occasions.", tip: "Red soles = instant confidence boost", shop: { luxury: { store: "Nordstrom", item: "Christian Louboutin So Kate 120mm", price: "$795" }, mid: { store: "Steve Madden", item: "Steve Madden Daisie Pointed Toe Pump", price: "$90" }, budget: { store: "Amazon", item: "DREAM PAIRS Pointed Toe Stiletto", price: "$35" } } },
    { title: "Block Heels", detail: "Comfortable height with chunky stability — great for day-to-night transitions. Look for square toes and architectural shapes.", shop: { luxury: { store: "Nordstrom", item: "Bottega Veneta Stretch Sandal", price: "$1,100" }, mid: { store: "Steve Madden", item: "Steve Madden Airy Block Heel Sandal", price: "$90" }, budget: { store: "Amazon", item: "Ankis Chunky Block Heel Sandal", price: "$40" } } },
    { title: "Ankle Boots", detail: "Chelsea boots, combat boots, or pointed-toe booties. Dr. Martens, Blundstone, or designer options. Year-round wardrobe staple.", shop: { luxury: { store: "Nordstrom", item: "Gianvito Rossi Leather Ankle Boot", price: "$1,195" }, mid: { store: "Dr. Martens", item: "Dr. Martens 2976 Chelsea Boot", price: "$170" }, budget: { store: "Amazon", item: "Thursday Boot Co. Duchess Chelsea", price: "$149" } } },
    { title: "Knee-High Boots", detail: "Over-the-knee or knee-high in leather, suede, or stretch. Stuart Weitzman 5050, Paris Texas, or Isabel Marant. Statement boot season essential.", shop: { luxury: { store: "Nordstrom", item: "Stuart Weitzman 5050 Over-the-Knee", price: "$795" }, mid: { store: "Steve Madden", item: "Steve Madden Showbiz Knee High Boot", price: "$130" }, budget: { store: "Amazon", item: "DREAM PAIRS Over The Knee Boot", price: "$45" } } },
    { title: "Cowboy Boots", detail: "Western-inspired with embroidery, pointed toes, and stacked heels. Pairs with dresses, jeans, or skirts.", shop: { luxury: { store: "Nordstrom", item: "Isabel Marant Duerto Western Boot", price: "$1,290" }, mid: { store: "Free People", item: "Free People Brayden Western Boot", price: "$198" }, budget: { store: "Amazon", item: "IUV Cowboy Boots for Women", price: "$50" } } },
    { title: "Loafers", detail: "Gucci Horsebit, Prada Triangle, or classic penny loafers. Versatile enough for office, brunch, or weekend wear. Platform versions add edge.", shop: { luxury: { store: "Gucci", item: "Gucci Horsebit Loafer", price: "$920" }, mid: { store: "Cole Haan", item: "Cole Haan Lux Pinch Penny Loafer", price: "$150" }, budget: { store: "Amazon", item: "DREAM PAIRS Platform Loafers", price: "$40" } } },
    { title: "Oxfords & Derbies", detail: "Classic lace-up dress shoes in polished leather or suede. Allen Edmonds, Church's, or Dr. Martens 1461 for a more casual take.", shop: { luxury: { store: "Nordstrom", item: "Church's Shannon Derby Shoe", price: "$620" }, mid: { store: "Dr. Martens", item: "Dr. Martens 1461 Smooth Oxford", price: "$130" }, budget: { store: "Amazon", item: "Bruno Marc Oxford Dress Shoes", price: "$35" } } },
    { title: "Sandals", detail: "Hermès Oran, Birkenstock Arizona, or strappy flat sandals. Essential warm-weather footwear from luxury to everyday.", shop: { luxury: { store: "Nordstrom", item: "Hermès Oran Sandal", price: "$680" }, mid: { store: "Birkenstock", item: "Birkenstock Arizona Soft Footbed", price: "$160" }, budget: { store: "Amazon", item: "CUSHIONAIRE Luna Cork Sandal", price: "$30" } } },
    { title: "Slides & Mules", detail: "Slip-on ease — Yeezy Slides, Bottega Veneta Padded, or simple leather mules. Effortless style for running errands or poolside.", shop: { luxury: { store: "Nordstrom", item: "Bottega Veneta Padded Flat Sandal", price: "$790" }, mid: { store: "Adidas", item: "Adidas Yeezy Slide", price: "$70" }, budget: { store: "Amazon", item: "Pillow Slides Cloud Slippers", price: "$20" } } },
    { title: "Ballet Flats", detail: "The Row, Repetto, or Sam Edelman Felicia. Minimalist elegance that works with everything from dresses to cropped pants.", shop: { luxury: { store: "Nordstrom", item: "The Row Elastic Ballet Flat", price: "$760" }, mid: { store: "Nordstrom", item: "Sam Edelman Felicia Ballet Flat", price: "$130" }, budget: { store: "Amazon", item: "Amazon Essentials Ballet Flat", price: "$22" } } },
    { title: "Work Boots", detail: "Timberland 6-inch, Red Wing Iron Ranger, or Dr. Martens 1460. Rugged, durable, and stylish — built for function and fashion.", shop: { luxury: { store: "Nordstrom", item: "Red Wing Iron Ranger Boot", price: "$350" }, mid: { store: "Dr. Martens", item: "Dr. Martens 1460 Smooth Boot", price: "$170" }, budget: { store: "Amazon", item: "EVER BOOTS Tank Work Boot", price: "$40" } } },
  ],
};

// Bag-specific look data for shopping
export const bagLookData: Record<string, Step[]> = {
  "Bag Edit": [
    { title: "Everyday Tote", detail: "A structured leather tote in a neutral tone — fits laptop, wallet, and essentials. Look for reinforced handles and interior pockets.", tip: "Saffiano leather resists scratches", shop: { luxury: { store: "Nordstrom", item: "Saint Laurent Shopping Tote", price: "$1,350" }, mid: { store: "Nordstrom", item: "Tory Burch Perry Triple-Compartment Tote", price: "$348" }, budget: { store: "Amazon", item: "Dreubea Soft Faux Leather Tote", price: "$18" } } },
    { title: "Crossbody Bag", detail: "Compact hands-free bag with adjustable strap. Perfect for errands, travel, or a night out.", shop: { luxury: { store: "Nordstrom", item: "Gucci GG Marmont Mini Crossbody", price: "$1,250" }, mid: { store: "Nordstrom", item: "Marc Jacobs The Snapshot Crossbody", price: "$295" }, budget: { store: "Amazon", item: "CLUCI Small Crossbody Bag", price: "$22" } } },
    { title: "Evening Clutch", detail: "Slim envelope or box clutch for formal events. Metallic hardware and chain strap options elevate the look.", shop: { luxury: { store: "Nordstrom", item: "Bottega Veneta Knot Clutch", price: "$3,200" }, mid: { store: "Nordstrom", item: "Ted Baker Satin Bow Clutch", price: "$95" }, budget: { store: "Amazon", item: "Charming Tailor Metallic Clutch", price: "$20" } } },
    { title: "Backpack", detail: "Leather or premium nylon backpack that transitions from work to weekend. Clean lines, minimal branding.", shop: { luxury: { store: "Nordstrom", item: "Prada Re-Nylon Backpack", price: "$1,790" }, mid: { store: "Nordstrom", item: "Longchamp Le Pliage Neo Backpack", price: "$245" }, budget: { store: "Amazon", item: "BROMEN Leather Laptop Backpack", price: "$40" } } },
    { title: "Shoulder Bag", detail: "Classic shoulder bag — hobo, baguette, or structured. Sits comfortably under the arm with room for daily essentials.", shop: { luxury: { store: "Nordstrom", item: "Fendi Baguette Bag", price: "$3,190" }, mid: { store: "Nordstrom", item: "Coach Pillow Tabby Shoulder Bag", price: "$395" }, budget: { store: "Amazon", item: "JW PEI Joy Shoulder Bag", price: "$70" } } },
    { title: "Belt Bag / Fanny Pack", detail: "Worn at the waist or crossbody for a modern hands-free silhouette. Leather or sport nylon.", shop: { luxury: { store: "Nordstrom", item: "Loewe Gate Bum Bag", price: "$1,550" }, mid: { store: "Nordstrom", item: "Lululemon Everywhere Belt Bag", price: "$38" }, budget: { store: "Amazon", item: "ZORFIN Fanny Pack Crossbody", price: "$16" } } },
    { title: "Mini Bag", detail: "Tiny statement piece — just enough for phone, cards, and lipstick. Maximum style, minimal space.", tip: "Pair with a larger bag for practicality", shop: { luxury: { store: "Nordstrom", item: "Jacquemus Le Chiquito Long", price: "$620" }, mid: { store: "Nordstrom", item: "Kate Spade Mini Flap Crossbody", price: "$179" }, budget: { store: "Amazon", item: "CATMICOO Mini Purse", price: "$15" } } },
    { title: "Weekend Duffle", detail: "Overnight travel bag in leather or coated canvas. Fits a change of clothes, toiletries, and a laptop.", shop: { luxury: { store: "Nordstrom", item: "Louis Vuitton Keepall Bandoulière 45", price: "$2,570" }, mid: { store: "Nordstrom", item: "Herschel Novel Duffle", price: "$90" }, budget: { store: "Amazon", item: "Weekender Overnight Bag for Women", price: "$30" } } },
    { title: "Bucket Bag", detail: "Slouchy drawstring silhouette — relaxed but refined. Great for casual-to-dressy transitions.", shop: { luxury: { store: "Nordstrom", item: "Mansur Gavriel Mini Bucket Bag", price: "$595" }, mid: { store: "Nordstrom", item: "Madewell The Transport Bucket Bag", price: "$168" }, budget: { store: "Amazon", item: "Montana West Bucket Bag", price: "$28" } } },
    { title: "Designer Classic", detail: "An investment piece that transcends trends — Chanel Flap, Hermès Birkin, or Dior Saddle.", tip: "Pre-owned luxury is a smart entry point", shop: { luxury: { store: "The RealReal", item: "Chanel Classic Double Flap (Pre-owned)", price: "$6,500" }, mid: { store: "Rebag", item: "Louis Vuitton Neverfull MM (Pre-owned)", price: "$1,200" }, budget: { store: "Amazon", item: "TIBES Classic Quilted Chain Bag", price: "$25" } } },
  ],
};
export const styleLooks: Record<string, { name: string; desc: string; match: number }[]> = {
  "full-style": [
    { name: "Soft Glam", desc: "Elegant & refined — silk, rose gold, satin", match: 96 },
    { name: "Golden Hour", desc: "Warm earth tones — suede, bronze, cognac", match: 93 },
    { name: "Berry Chic", desc: "Bold & polished — black, berry, silver", match: 89 },
  ],
  streetwear: [
    { name: "Urban Edge", desc: "Cargos, sneakers, graphic tees — street ready", match: 94 },
    { name: "Berry Chic", desc: "Dark-toned street style with edge", match: 87 },
    { name: "Sport Luxe", desc: "Athletic streetwear crossover", match: 85 },
  ],
  minimalist: [
    { name: "Clean Slate", desc: "Neutrals, clean lines, zero logos", match: 95 },
    { name: "Soft Glam", desc: "Soft tones with minimal jewelry", match: 90 },
    { name: "Golden Hour", desc: "Warm minimalism with earthy neutrals", match: 88 },
  ],
  vintage: [
    { name: "Retro Revival", desc: "70s flares, prints, platforms, cat-eye", match: 91 },
    { name: "Golden Hour", desc: "Warm vintage-inspired bohemian style", match: 89 },
    { name: "Berry Chic", desc: "90s dark-toned retro with edge", match: 86 },
  ],
  athleisure: [
    { name: "Sport Luxe", desc: "Joggers, sneakers, belt bags — gym to street", match: 92 },
    { name: "Urban Edge", desc: "Sporty streetwear with sneaker culture", match: 88 },
    { name: "Clean Slate", desc: "Minimal athletic — clean sneakers, neutral tones", match: 85 },
  ],
  formal: [
    { name: "Soft Glam", desc: "Soft sophistication for events", match: 97 },
    { name: "Berry Chic", desc: "Power dressing in dark tones", match: 90 },
    { name: "Clean Slate", desc: "Modern minimalist business wear", match: 88 },
  ],
  casual: [
    { name: "Golden Hour", desc: "Relaxed earthy casual look", match: 93 },
    { name: "Clean Slate", desc: "Effortless everyday minimalism", match: 91 },
    { name: "Urban Edge", desc: "Casual streetwear for the weekend", match: 87 },
  ],
  "makeup-only": [
    { name: "Soft Glam", desc: "Natural glow with rose tones", match: 96 },
    { name: "Golden Hour", desc: "Warm bronze with gold highlights", match: 93 },
    { name: "Berry Chic", desc: "Deep berry lips, minimal eyes", match: 89 },
  ],
  bohemian: [
    { name: "Desert Wanderer", desc: "Earthy layers, flowing fabrics, turquoise accents", match: 95 },
    { name: "Golden Hour", desc: "Warm boho tones with golden jewelry", match: 91 },
    { name: "Soft Glam", desc: "Romantic bohemian with soft makeup", match: 87 },
  ],
  preppy: [
    { name: "Ivy League", desc: "Blazers, loafers, clean patterns", match: 96 },
    { name: "Clean Slate", desc: "Polished minimalism with preppy edge", match: 90 },
    { name: "Soft Glam", desc: "Classic elegance with soft accents", match: 86 },
  ],
  edgy: [
    { name: "Rebel Noir", desc: "Leather, studs, dark palette, combat boots", match: 95 },
    { name: "Urban Edge", desc: "Streetwear with punk influence", match: 91 },
    { name: "Berry Chic", desc: "Dark berry tones with edgy styling", match: 87 },
  ],
  resort: [
    { name: "Coastal Luxe", desc: "Linen, sandals, straw — relaxed elegance", match: 96 },
    { name: "Golden Hour", desc: "Warm sunset tones for vacation vibes", match: 92 },
    { name: "Desert Wanderer", desc: "Earthy resort with boho touches", match: 87 },
  ],
  grooming: [
    { name: "Sharp & Clean", desc: "Precision cut, fresh skin, subtle fragrance", match: 96 },
    { name: "Rugged Refined", desc: "Textured beard, natural skincare, woodsy scent", match: 92 },
    { name: "Modern Minimal", desc: "No-fuss grooming with quality basics", match: 88 },
  ],
  swimwear: [
    { name: "Beach Goddess", desc: "Sun-kissed bikini perfection — bronzed & beachy", match: 96 },
    { name: "Tropical Paradise", desc: "Bold tropical prints with island accessories", match: 94 },
    { name: "Poolside Glam", desc: "Main-character energy — metallic swim & gold chains", match: 93 },
    { name: "Coastal Luxe", desc: "Resort-ready swimwear with elegant accessories", match: 91 },
  ],
  lingerie: [
    { name: "Silk & Lace", desc: "Luxe intimates — lace bralettes, silk robes, sultry layers", match: 96 },
    { name: "Velvet Boudoir", desc: "Old Hollywood glamour — velvet, feathers, champagne tones", match: 94 },
    { name: "Midnight Lace", desc: "Dark drama — black lace, garters, smoky seduction", match: 93 },
    { name: "Soft Glam", desc: "Romantic intimate styling with rose tones", match: 90 },
  ],
  y2k: [
    { name: "Butterfly Babe", desc: "Low-rise, butterfly tops, frosted lips — peak 2000s", match: 96 },
    { name: "Retro Revival", desc: "Retro glamour with Y2K edge", match: 89 },
    { name: "Urban Edge", desc: "Y2K streetwear — baggy jeans, baby tees, platforms", match: 87 },
  ],
  cottagecore: [
    { name: "Meadow Dream", desc: "Florals, linen, straw hats — countryside romance", match: 96 },
    { name: "Desert Wanderer", desc: "Earthy bohemian with cottagecore softness", match: 90 },
    { name: "Soft Glam", desc: "Romantic natural beauty with countryside charm", match: 87 },
  ],
  "bags-purses": [
    { name: "Bag Edit", desc: "The perfect bag to complete any look", match: 95 },
    { name: "Soft Glam", desc: "Elegant bags in blush and nude tones", match: 90 },
    { name: "Urban Edge", desc: "Statement bags with streetwear edge", match: 88 },
  ],
  "shoes-sneakers": [
    { name: "Shoe Edit", desc: "Designer kicks, heels, and boots — the ultimate footwear guide", match: 95 },
    { name: "Urban Edge", desc: "Sneakers and boots with street credibility", match: 90 },
    { name: "Soft Glam", desc: "Elegant heels and flats in neutral tones", match: 88 },
  ],
};
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, secondImageBase64, styleCategory, styleSubcategory, photoType, gender, generationMode, refinementContext, makeupPreference } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isMale = gender === "male";

    const stylePrompts: Record<string, { male: string; female: string }> = {
      "full-style": {
        female: "wearing an elegant outfit: silk blouse, tailored wide-leg trousers, strappy heels, dainty gold jewelry, and a structured crossbody bag. Soft glam makeup with rose tones.",
        male: "wearing a sharp outfit: fitted oxford shirt, tailored chinos, clean leather loafers, a sleek watch, and a leather messenger bag. Well-groomed with a clean fade haircut.",
      },
      streetwear: {
        female: "wearing trendy streetwear: oversized graphic tee, black cargo pants, chunky white sneakers, a snapback cap, silver chain necklace, and a black crossbody sling bag.",
        male: "wearing streetwear: oversized graphic hoodie, black joggers, high-top sneakers, a fitted cap, layered silver chains, and a crossbody bag.",
      },
      minimalist: {
        female: "wearing minimalist fashion: perfectly fitted white crewneck tee, black tailored trousers, clean white leather sneakers, thin gold chain necklace, and a structured black leather tote.",
        male: "wearing minimalist fashion: fitted black crew-neck tee, tailored grey trousers, clean white leather sneakers, a simple silver watch, and a slim black leather wallet.",
      },
      vintage: {
        female: "wearing vintage-inspired fashion: floral print blouse with bell sleeves, high-waisted flare jeans, platform boots, oversized round sunglasses, and layered gold medallion necklaces.",
        male: "wearing vintage-inspired fashion: retro patterned button-up shirt, high-waisted straight-leg trousers, leather boots, aviator sunglasses, and a leather belt with a vintage buckle.",
      },
      athleisure: {
        female: "wearing athleisure style: fitted black crop top, tapered grey joggers, white running sneakers, an Apple watch, and a belt bag worn crossbody.",
        male: "wearing athleisure style: fitted performance tee, tapered joggers, clean running sneakers, a sport watch, and a sling bag.",
      },
      formal: {
        female: "wearing formal attire: tailored blazer dress, pointed-toe pumps, pearl earrings, a clutch purse, and polished makeup with a bold lip.",
        male: "wearing formal attire: tailored navy suit, crisp white dress shirt, silk tie, polished oxford shoes, a silver watch, and a leather briefcase.",
      },
      casual: {
        female: "wearing casual everyday clothes: relaxed-fit crewneck sweater in oatmeal, straight-leg medium-wash jeans, clean white sneakers, and a canvas tote bag.",
        male: "wearing casual everyday clothes: relaxed henley shirt, well-fitted dark jeans, clean suede desert boots, a simple watch, and a canvas backpack.",
      },
      "makeup-only": {
        female: "with a complete glam makeup look: flawless dewy skin, soft rose eyeshadow, defined brows, winged eyeliner, volumizing mascara, highlighted cheekbones, and a satin rose lipstick.",
        male: "with a refined grooming look: even skin tone with light concealer, shaped and groomed brows, subtle lip balm, well-moisturized skin, and a clean, fresh appearance.",
      },
      sexy: {
        female: "wearing a sultry, body-confident outfit: a fitted bodycon mini dress with cut-out details, strappy stiletto heels, layered gold body chains, bold smoky eye makeup, and a sleek clutch.",
        male: "wearing a confident, alluring outfit: a fitted black V-neck shirt showing off physique, slim dark jeans, polished Chelsea boots, a statement watch, and styled hair with subtle cologne vibes.",
      },
      swimwear: {
        female: "in a luxury fashion editorial beach photoshoot, wearing a flattering coordinated two-piece bikini set — a structured bikini top with adjustable straps and matching high-cut bikini bottoms in a rich solid color or elegant print. The bikini top and bottom are clearly visible as separate coordinated pieces. Styled with a sheer sarong tied at the waist, strappy flat sandals, oversized designer sunglasses, gold layered body chains, and a wide-brim straw hat. Beautiful tropical beach resort setting with turquoise water and palm trees. Professional fashion magazine editorial photography, golden-hour lighting, full body shot showing the complete swimwear look.",
        male: "in a professional fashion editorial beach photoshoot, wearing tailored mid-length swim trunks in a bold print or solid color, paired with an open linen camp-collar shirt draped casually over shoulders, leather slide sandals, aviator sunglasses, a waterproof sport watch, and a woven beach tote. Tropical beach resort setting with clear blue water. Professional fashion photography, editorial lighting.",
      },
      "urban-hiphop": {
        female: "wearing urban hip-hop style: oversized graphic jersey, baggy low-rise jeans, chunky platform sneakers, layered gold chains, hoop earrings, and a designer belt bag.",
        male: "wearing urban hip-hop style: oversized designer tee or jersey, baggy distressed jeans, fresh high-top sneakers, heavy gold chains, a fitted cap, and a crossbody designer bag.",
      },
      rugged: {
        female: "wearing rugged workwear: fitted flannel shirt, high-waisted straight-leg jeans, leather ankle boots, a canvas belt, and minimal silver jewelry.",
        male: "wearing rugged workwear style: heavy flannel shirt layered over a henley, raw selvedge denim, leather work boots, a thick leather belt, and a field watch.",
      },
      techwear: {
        female: "wearing futuristic techwear: a black waterproof shell jacket, tapered cargo pants with straps, chunky trail running shoes, a tactical chest rig, and matte black accessories.",
        male: "wearing futuristic techwear: a modular black technical jacket, cargo joggers with utility straps, trail running shoes, a tactical sling bag, and all-black accessories.",
      },
      "date-night": {
        female: "wearing a date-night outfit: an elegant midi dress with a subtle slit, pointed-toe heels, delicate pendant necklace, a small clutch purse, and soft romantic makeup.",
        male: "wearing a date-night outfit: a slim-fit dark blazer over a crew-neck tee, tailored dark trousers, clean leather dress shoes, a sleek watch, and fresh cologne-ready grooming.",
      },
      lingerie: {
        female: "in a high-end fashion editorial for a luxury sleepwear and loungewear brand. Wearing an elegant lace-trimmed silk camisole set with a matching flowing silk robe, satin house slippers, and delicate gold jewelry. Luxurious bedroom setting with soft warm lighting, silk sheets, and velvet furnishings. Professional fashion photography, tasteful and sophisticated editorial style.",
        male: "in a high-end fashion editorial for a luxury loungewear brand. Wearing premium silk pajama set with an elegant open robe, leather house slippers, and a classic watch. Luxurious bedroom setting with warm ambient lighting and designer furnishings. Professional fashion photography, editorial style.",
      },
      y2k: {
        female: "wearing Y2K early-2000s fashion: low-rise flare jeans or a pleated mini skirt, a sparkly butterfly crop top or halter top, platform flip-flops or chunky sneakers, tinted rectangular sunglasses, layered belly chains, a tiny baguette bag, and frosted lip gloss with shimmery eyeshadow.",
        male: "wearing Y2K early-2000s fashion: baggy bootcut jeans with a studded belt, a fitted graphic baby tee or mesh tank, chunky skate shoes, frosted tips or spiky hair, layered chain necklaces, and a trucker hat.",
      },
      cottagecore: {
        female: "wearing cottagecore aesthetic: a flowing floral midi dress with puff sleeves and smocked bodice, a woven straw sun hat, brown leather mary-jane shoes, a wicker basket purse, dainty daisy chain jewelry, and natural dewy makeup with rosy cheeks. Countryside meadow setting with wildflowers.",
        male: "wearing cottagecore aesthetic: a relaxed linen button-up shirt in cream or sage, high-waisted brown corduroy trousers, brown leather boots, a woven straw hat, a canvas crossbody bag, and a simple leather-strap watch. Countryside setting with fields and greenery.",
      },
      "jewelry-accessories": {
        female: "styled with statement jewelry and accessories: layered gold necklaces, stacked rings including a diamond cocktail ring, a luxury bracelet stack, elegant drop earrings, and a designer watch. Close-up editorial styling with warm, luxurious lighting.",
        male: "styled with premium accessories: a luxury automatic watch, a signet ring, layered chain bracelets, a sleek pendant necklace, and subtle ear studs. Close-up editorial styling with sophisticated lighting.",
      },
      "sunglasses-eyewear": {
        female: "wearing stylish designer sunglasses or eyewear, perfectly framed for her face shape. Paired with a chic outfit that complements the eyewear. Fashion editorial lighting with reflections and details on the frames.",
        male: "wearing premium designer sunglasses or eyewear that suits his face shape perfectly. Paired with a stylish outfit. Fashion editorial lighting highlighting the frame details and lens quality.",
      },
      "hats-headwear": {
        female: "wearing a stylish hat or headpiece that perfectly complements her face shape and outfit. Styled with a coordinated look that elevates the headwear as the hero piece. Fashion editorial lighting.",
        male: "wearing a premium hat or cap that suits his face and style perfectly. Paired with a complementary outfit that makes the headwear the focal point. Fashion editorial lighting.",
      },
      "bags-purses": {
        female: "styled with a stunning designer bag as the focal point — perfectly coordinated with her outfit. The bag is prominently displayed and styled for a fashion editorial. Close-up details showing hardware, texture, and craftsmanship. Premium fashion photography.",
        male: "styled with a premium bag or carry — leather messenger, sleek backpack, or structured briefcase as the hero piece. Coordinated with a sharp outfit. Fashion editorial lighting highlighting bag details and craftsmanship.",
      },
      "shoes-sneakers": {
        female: "wearing stunning designer shoes as the hero piece — perfectly styled with a coordinated outfit that showcases the footwear. Full-body or knee-down editorial shot with dramatic lighting highlighting shoe details, materials, and silhouette. The shoes should be the clear focal point. Premium fashion photography.",
        male: "wearing premium designer shoes or sneakers as the hero piece — perfectly styled with a coordinated outfit that puts the footwear center stage. Full-body or knee-down editorial shot with dramatic lighting highlighting shoe details, construction, and colorway. Premium fashion photography.",
      },
      "icon-looks": {
        female: "in a high-fashion editorial photoshoot channeling an iconic style archetype. Wearing a signature head-to-toe look with statement pieces, perfectly coordinated accessories, and a confident, commanding presence. The styling should feel legendary — the kind of look that defines an era. Premium magazine photography with dramatic lighting.",
        male: "in a high-fashion editorial photoshoot channeling an iconic style archetype. Wearing a signature head-to-toe look with statement accessories, perfectly tailored fit, and effortless star power. The styling should feel legendary and era-defining. Premium magazine photography with dramatic lighting.",
      },
      fitness: {
        female: "wearing a stylish women's athletic outfit: a fitted sports bra or crop top in a bold color, high-waisted compression leggings, women's running sneakers, a sleek smartwatch, and a matching headband or hair tie. Feminine athletic build, gym or outdoor fitness setting. Women's activewear fashion editorial photography.",
        male: "wearing a men's performance workout outfit: fitted compression tee or muscle tank, athletic shorts or tapered joggers, men's training sneakers, a sport watch, and wireless earbuds. Athletic build, gym or outdoor fitness setting. Men's activewear fashion editorial photography.",
      },
      cosplay: {
        female: "wearing a detailed, high-quality women's cosplay costume with accurate character-inspired styling. Complete with themed wig or styled hair, character-appropriate makeup, props and accessories. Professional cosplay photoshoot with themed backdrop and dramatic lighting. The costume should be clearly feminine and tailored for a woman's body.",
        male: "wearing a detailed, high-quality men's cosplay costume with accurate character-inspired styling. Complete with themed wig or styled hair, character-appropriate grooming, props and accessories. Professional cosplay photoshoot with themed backdrop and dramatic lighting. The costume should be clearly masculine and tailored for a man's body.",
      },
      "baby-toddler": {
        female: "a cute baby girl or toddler wearing an adorable, age-appropriate outfit. The clothing should be soft, comfortable, and stylish — perfect for a children's fashion editorial. Bright, cheerful lighting with a clean, family-friendly setting. Professional kids' fashion photography.",
        male: "a cute baby boy or toddler wearing an adorable, age-appropriate outfit. The clothing should be soft, comfortable, and stylish — perfect for a children's fashion editorial. Bright, cheerful lighting with a clean, family-friendly setting. Professional kids' fashion photography.",
      },
      kids: {
        female: "a school-age girl wearing a stylish, age-appropriate outfit. The clothing should be fun, comfortable, and kid-friendly — bright colors, playful patterns, and practical for an active child. Professional children's fashion editorial photography with bright, cheerful lighting. Clean, wholesome, family-friendly setting.",
        male: "a school-age boy wearing a stylish, age-appropriate outfit. The clothing should be fun, comfortable, and kid-friendly — bold colors, cool patterns, and practical for an active child. Professional children's fashion editorial photography with bright, cheerful lighting. Clean, wholesome, family-friendly setting.",
      },
      teens: {
        female: "a teenage girl (age 13-17) wearing a trendy, age-appropriate outfit. The clothing should be stylish and on-trend — TikTok-worthy fashion that's fun yet modest. Professional teen fashion editorial photography with vibrant, youthful energy. Clean, wholesome setting.",
        male: "a teenage boy (age 13-17) wearing a trendy, age-appropriate outfit. The clothing should be stylish and on-trend — cool, confident fashion that's fun yet modest. Professional teen fashion editorial photography with vibrant, youthful energy. Clean, wholesome setting.",
      },
      "parent-child": {
        female: "a mother and her baby/toddler wearing beautifully coordinated matching outfits. The parent's outfit is stylish and age-appropriate, while the child's outfit is a miniature version or color-coordinated complement. Both are styled for a family fashion editorial with warm, natural lighting. The image shows both parent and child together, showcasing how their outfits coordinate. Professional family lifestyle photography.",
        male: "a father and his baby/toddler wearing beautifully coordinated matching outfits. The parent's outfit is stylish and age-appropriate, while the child's outfit is a miniature version or color-coordinated complement. Both are styled for a family fashion editorial with warm, natural lighting. The image shows both parent and child together, showcasing how their outfits coordinate. Professional family lifestyle photography.",
      },
      "couples": {
        female: "a stylish couple — a woman and her partner — wearing beautifully coordinated matching or complementary outfits. Both are dressed to impress with harmonized colors, fabrics, and styles. Professional couples fashion editorial photography with romantic, warm lighting. The image shows both people together, showcasing how their outfits complement each other.",
        male: "a stylish couple — a man and his partner — wearing beautifully coordinated matching or complementary outfits. Both are dressed to impress with harmonized colors, fabrics, and styles. Professional couples fashion editorial photography with romantic, warm lighting. The image shows both people together, showcasing how their outfits complement each other.",
      },
    };

    const styleDesc = stylePrompts[styleCategory]?.[isMale ? "male" : "female"] || stylePrompts["full-style"][isMale ? "male" : "female"];
    const genderWord = isMale ? "man" : "woman";

    const isMannequin = generationMode === "mannequin";

    const normalizeRefinementContext = (input: string) => {
      let normalized = input.slice(0, 800);

      if (styleCategory === "swimwear") {
        normalized = normalized
          .replace(/\bbikini\b/gi, "luxury coordinated two-piece swim set with structured bikini top and matching bikini bottoms")
          .replace(/\btwo-piece\b/gi, "coordinated two-piece bikini set with separate top and bottom pieces")
          .replace(/\bstring bikini\b/gi, "elegant minimal string two-piece swim set")
          .replace(/\bone-piece\b/gi, "sculpted designer one-piece swimsuit")
          .replace(/\bmonokini\b/gi, "designer cut-out one-piece swimsuit")
          .replace(/\bred\b/gi, "rich crimson")
          .replace(/\bnude\b/gi, "warm sand")
          .replace(/\bblack\b/gi, "jet black")
          .replace(/\bwhite\b/gi, "crisp ivory");
      }

      if (styleCategory === "lingerie") {
        normalized = normalized
          .replace(/\blingerie\b/gi, "luxury sleepwear")
          .replace(/\bbra\b/gi, "structured satin top")
          .replace(/\bpanties\b/gi, "matching satin bottoms")
          .replace(/\bred\b/gi, "deep ruby");
      }

      return normalized;
    };

    // Sub-style specific overrides for swimwear
    const swimwearSubStyleOverrides: Record<string, string> = {
      "beach-goddess": "IMPORTANT: Style as a luxurious one-piece swimsuit with plunging neckline OR a high-end matching bikini set. Add gold body chains, a flowing sheer sarong, strappy gold sandals, and oversized sunglasses. Goddess-like beach editorial aesthetic.",
      "sporty-swim": "IMPORTANT: Style as a sporty athletic swimsuit — racerback bikini top or high-neck crop top with matching boyshort or high-waist bottoms. Bold color blocking (neon, cobalt, coral). Sporty sandals and a visor cap. Active beachwear editorial.",
      "tropical-glam": "IMPORTANT: Style as a vibrant tropical-print two-piece bikini set — bold floral or palm print bikini top with matching bikini bottoms. Add a colorful sarong, platform espadrilles, shell jewelry, and a straw tote. Resort editorial style.",
      "two-piece-set": "CRITICAL: This MUST be a clearly visible coordinated two-piece bikini set showing BOTH a separate bikini top AND separate matching bikini bottoms as distinct pieces. The bikini top and bikini bottom must both be clearly visible. Classic triangle or bandeau bikini top with matching high-cut or brazilian-cut bikini bottoms. Solid color or simple elegant pattern. Styled with sandals and sunglasses. Fashion editorial beach photography.",
      "monokini": "IMPORTANT: Style as a designer cut-out one-piece swimsuit with strategic cutouts at the sides or waist, creating a modern sculpted silhouette. Bold solid color. Minimal accessories — just sunglasses and sandals. High-fashion editorial.",
      "swim-with-jewelry": "IMPORTANT: Style as a sleek solid-color two-piece bikini set accessorized with layered waterproof gold chains, body chains draped across the waist, anklets, stacking rings, and statement earrings. The jewelry is the focal point. Beach editorial with golden-hour lighting.",
    };

    const swimwearOverride = (styleCategory === "swimwear" && styleSubcategory && swimwearSubStyleOverrides[styleSubcategory])
      ? `\n\n${swimwearSubStyleOverrides[styleSubcategory]}`
      : "";

    // Icon Looks sub-style overrides — descriptive archetypes, no celebrity names
    const iconLooksSubStyleOverrides: Record<string, string> = {
      "old-hollywood-siren": "IMPORTANT: Channel vintage 1950s Hollywood glamour — a figure-hugging satin or silk gown, deep red lips, perfectly set finger waves or soft curls, fur stole or feather boa, diamond drop earrings, and a classic clutch. Old-money elegance with sultry confidence. Black-and-white movie-star energy brought to life in color.",
      "red-carpet-royalty": "IMPORTANT: Style as a modern red-carpet show-stopper — an architectural couture gown with dramatic silhouette (mermaid, ball gown, or sculptural), statement jewelry, flawless makeup, swept-up hair or sleek straight, and sky-high heels. The look should feel award-show-ready and camera-perfect.",
      "streetwear-mogul": "IMPORTANT: Style as a fashion-forward streetwear visionary — oversized designer pieces, earth tones or neutrals, chunky boots or rare sneakers, layered necklaces, statement outerwear (puffer, trench, or leather), and an air of creative direction. The look should feel expensive, intentional, and trendsetting.",
      "pop-diva": "IMPORTANT: Channel peak pop-star energy — a sequined or metallic bodysuit or mini dress, thigh-high boots, bold statement jewelry, dramatic eye makeup, voluminous styled hair, and an attitude of total confidence. Stage-ready glamour adapted for the street.",
      "minimalist-it-girl": "IMPORTANT: Style as the ultimate clean-girl aesthetic — slicked-back hair or effortless bun, neutral monochrome palette (beige, cream, black), perfectly tailored oversized blazer or matching set, minimal gold jewelry, clean white sneakers or pointed-toe mules, designer tote, and barely-there makeup. Quiet luxury perfected.",
      "rock-legend": "IMPORTANT: Channel rock-star rebellion — fitted leather pants or skinny jeans, a statement leather or velvet jacket, band-tee or sheer blouse, Chelsea boots or platform boots, layered silver rings and chains, smudged eyeliner, and tousled hair. Equal parts dangerous and glamorous.",
      "90s-supermodel": "IMPORTANT: Channel 90s off-duty supermodel style — a satin slip dress with a blazer thrown over, or high-waisted jeans with a simple bodysuit, minimal gold hoops, rectangular sunglasses, pointed-toe boots, and effortlessly tousled hair. The look should feel like paparazzi caught you looking incredible without trying.",
      "fashion-forward-icon": "IMPORTANT: Style as an avant-garde fashion pioneer — unexpected proportions, bold color or pattern mixing, sculptural accessories, architectural shoes, statement headwear or eyewear, and editorial-level makeup. This look should feel like it walked off a runway or a Vogue editorial spread.",
      "suave-gentleman": "IMPORTANT: Channel classic gentleman sophistication — an impeccably tailored double-breasted suit or three-piece in navy, charcoal, or cream, silk pocket square, polished oxford shoes, a luxury watch, subtle cologne vibes, slicked-back or perfectly parted hair, and an air of old-world charm and confidence.",
      "hip-hop-royalty": "IMPORTANT: Style as hip-hop royalty — heavy Cuban link chains, diamond-encrusted watch, designer tracksuit or oversized designer ensemble, pristine fresh sneakers or boots, statement sunglasses, and commanding presence. The look should feel like wealth, power, and cultural influence personified.",
      "bohemian-muse": "IMPORTANT: Channel the ultimate bohemian free-spirit — flowing maxi dress or wide-leg pants with a cropped top, layered turquoise and silver jewelry, fringe bag, embroidered boots or gladiator sandals, headband or flower crown, natural wavy hair, and dewy sun-kissed makeup. Festival headliner energy.",
      "athletic-icon": "IMPORTANT: Style as a global athletic icon off-duty — premium matching athletic set or track suit in a bold color, box-fresh limited-edition sneakers, sport watch, sleek sunglasses, perfectly styled hair, and an aura of peak physical confidence. The look bridges sport and high fashion effortlessly.",
      "disco-queen": "IMPORTANT: Channel 1970s disco royalty — a glittering sequined jumpsuit or halter mini dress, sky-high platform heels or gold boots, oversized hoop earrings, a metallic clutch, voluminous bouncy curls, and dramatic shimmery eye makeup. Studio 54 energy with modern polish. The outfit should sparkle and catch the light.",
      "parisian-chic": "IMPORTANT: Channel effortless Parisian elegance — a classic Breton striped top or silk blouse, tailored high-waisted trousers or a midi skirt, a perfectly draped trench coat, ballet flats or kitten heels, a leather beret, minimal gold jewelry, red lipstick, and a structured leather bag. The look should feel impossibly chic yet unstudied.",
      "kpop-star": "IMPORTANT: Style as a K-Pop idol — bold or pastel-colored hair, an oversized designer jacket or cropped blazer, high-waisted wide-leg pants or a plaid mini skirt, chunky platform sneakers, layered chains and rings, statement sunglasses, and editorial-level makeup with glass skin. The look should feel youthful, polished, and trendsetting with Korean fashion influence.",
      "mob-wife": "IMPORTANT: Channel mob-wife luxury — a full-length fur coat (faux) over a fitted black turtleneck dress, oversized gold hoop earrings, dark berry or wine lipstick, leopard print accents, pointed-toe stilettos, a large designer bag, gold chain jewelry, and blow-out voluminous hair. The aesthetic is unapologetically opulent and intimidating.",
      "coastal-cowgirl": "IMPORTANT: Style as coastal cowgirl — fringed suede jacket or vest over a flowy sundress, distressed denim cutoffs with a western belt, cowboy boots in tan or white, turquoise jewelry, a wide-brim cowboy hat, beachy waves in the hair, and sun-kissed natural makeup. Where the Wild West meets Malibu.",
      "dark-feminine": "IMPORTANT: Channel dark feminine mystique — an all-black ensemble featuring a corset top or structured bustier, a satin or lace midi skirt, sheer black stockings, pointed-toe heels, dark berry lips, smoky eye makeup, sleek straight hair or dark curls, delicate silver or black jewelry, and a small structured clutch. Elegant, mysterious, and powerful.",
      "golden-era-rapper": "IMPORTANT: Style as a 90s golden-era hip-hop icon — oversized Starter jacket or varsity bomber, baggy carpenter jeans or track pants, pristine Timberland boots or Air Force 1s, a heavy gold rope chain with a medallion, a fitted cap or Kangol, and a boombox-era swagger. The look should feel authentically retro and culturally iconic.",
      "modern-royal": "IMPORTANT: Style as modern royalty — a structured wool coat dress in a jewel tone (emerald, sapphire, or ruby), a small fascinator or pillbox hat, elbow-length gloves, pointed-toe pumps, a structured top-handle bag, pearl or diamond stud earrings, and perfectly coiffed hair. The look should feel regal, polished, and protocol-appropriate — like stepping out of a palace.",
    };

    const iconOverride = (styleCategory === "icon-looks" && styleSubcategory && iconLooksSubStyleOverrides[styleSubcategory])
      ? `\n\n${iconLooksSubStyleOverrides[styleSubcategory]}`
      : "";

    // Cosplay sub-style overrides — descriptive archetypes only
    const cosplaySubStyleOverrides: Record<string, string> = {
      // Anime & Manga
      "saiyan-warrior": "IMPORTANT: Style as a martial arts warrior in an orange and blue fighting gi with a dark undershirt, blue wristbands, blue boots, and spiky upswept hair. Powerful fighting stance with energy aura effects.",
      "magical-moon-guardian": "IMPORTANT: Style as a magical sailor-skirted heroine — white leotard with a navy sailor collar, pleated navy mini skirt, red bow on the chest, tiara with a gem, elbow-length white gloves, red knee-high boots, and long flowing blonde pigtails with bun accents.",
      "ninja-shinobi": "IMPORTANT: Style in an orange and black tracksuit-style ninja outfit with a metal headband (forehead protector), blue open-toe sandals, and spiky blonde hair. Determined expression, action-ready pose.",
      "demon-slayer-warrior": "IMPORTANT: Style in a black and green checkered haori jacket over a black uniform, white belt, straw sandals, and carrying a katana in a wooden sheath. Determined warrior expression.",
      "spirit-detective": "IMPORTANT: Style in a green school uniform jacket, white undershirt, and slicked-back dark hair with a confident, supernatural fighter's stance. Urban rooftop setting.",
      "magical-girl-wand": "IMPORTANT: Style in a frilly pastel magical girl transformation outfit with ribbons, bows, a star or heart-topped wand, knee-high boots, and flowing styled hair with magical sparkle effects.",
      "mecha-pilot": "IMPORTANT: Style in a form-fitting plugsuit or flight suit with bold color panels (white, blue, red, or purple), neural interface headpieces, and a futuristic cockpit or hangar setting.",
      "android-heroine": "IMPORTANT: Style in a black gothic-lolita inspired short dress with white accents, thigh-high boots, long white/silver hair, and a black fabric blindfold. Elegant yet warrior-like pose with a large sword.",
      "schoolgirl-anime": "IMPORTANT: Style in a classic Japanese school uniform — white sailor-collar blouse with colored trim, pleated skirt, knee-high socks, loafers, and a school bag. Cherry blossom or school campus setting.",
      "pirate-captain": "IMPORTANT: Style in a red vest or captain's coat, white shirt, sash belt, knee-length pants, sandals, and a straw hat with a red band. Adventurous ship deck or ocean setting.",
      "cat-girl-kawaii": "IMPORTANT: Style with cat ear headband or hair clips, a maid-style dress or kawaii outfit with apron, thigh-high stockings, mary-jane shoes, and a bell collar choker. Cute café or pastel setting.",
      "alchemist-hero": "IMPORTANT: Style in a long red coat with a flamel symbol on the back, black leather pants, black boots, white gloves, and braided blonde hair. Automail-inspired metallic arm detail. Determined, heroic pose.",
      "titan-fighter": "IMPORTANT: Style in a tan jacket with the Wings of Freedom emblem, white pants, knee-high brown boots, and ODM gear harness with blades. Green hooded cape. Dramatic action pose on a rooftop or wall setting.",
      // Classic Cartoon
      "retro-mouse-icon": "IMPORTANT: Style in a red polka-dot dress or skirt with white polka dots, a yellow high-heeled shoe, round black mouse ears with a bow, white gloves, and a cheerful pose. Classic cartoon character aesthetic.",
      "kung-fu-fighter": "IMPORTANT: Style in a blue qipao-style fighting dress with gold accents, brown tights, white boots, spiked metal bracelets, and ox-horn hair buns with silk covers. Athletic martial arts stance.",
      "mystery-sleuth": "IMPORTANT: Style in a purple mini dress, pink tights or go-go boots, a green scarf or headband, and flowing ginger/auburn hair. 70s retro detective aesthetic, confident investigative pose.",
      "electric-pocket-creature": "IMPORTANT: Style as a creature trainer — red and white baseball cap, blue and white jacket or vest, black t-shirt, jeans, and a belt with small spherical containers. Adventurous outdoor setting.",
      "plumber-hero": "IMPORTANT: Style in blue denim overalls over a red long-sleeve shirt, white gloves, brown shoes, and a red cap with a circular emblem. Cheerful, heroic stance.",
      // Disney Princess Archetypes
      "ice-queen": "IMPORTANT: Style in a shimmering ice-blue off-shoulder gown with a sheer cape encrusted with snowflake crystals, long platinum blonde braid over one shoulder, ice-crystal tiara, and pale sparkling makeup. Snowy mountain palace setting with aurora borealis.",
      "ocean-voyager": "IMPORTANT: Style in a red bandeau top and grass/tapa-cloth skirt or fitted tropical outfit, a turquoise heart-shaped necklace pendant, flowers in curly dark hair, and carrying a decorated oar. Tropical island ocean shore setting with waves.",
      "enchanted-rose-princess": "IMPORTANT: Style in a voluminous golden-yellow ball gown with off-shoulder sleeves, elbow-length white gloves, upswept brown hair with a few loose curls, and a single red rose accessory. Ornate castle ballroom setting with chandelier lighting.",
      "glass-slipper-belle": "IMPORTANT: Style in a sparkling pale blue ball gown with puffy sleeves and a full skirt, a black velvet choker, hair in an elegant updo with a blue headband, and glass/crystal slipper heels. Magical midnight garden with sparkle effects.",
      "desert-jewel-princess": "IMPORTANT: Style in a turquoise cropped top and flowing harem pants with gold trim, gold statement earrings, a jeweled headband in dark flowing hair, and an ornate gold cuff bracelet. Desert palace courtyard with starry night sky.",
      "forest-archer-princess": "IMPORTANT: Style in a forest-green medieval dress with gold trim and a leather belt, carrying a longbow and quiver of arrows, with wild voluminous curly red hair, a simple gold tiara, and leather boots. Misty Scottish highland forest setting.",
      "tower-dreamer": "IMPORTANT: Style in a lavender and pink medieval dress with laced bodice, and extremely long flowing golden-blonde hair adorned with flowers, carrying a cast-iron frying pan. Flower-filled tower balcony setting with lantern lights.",
      "underwater-princess": "IMPORTANT: Style in a seashell-inspired strapless top and a shimmering green/teal mermaid-tail-inspired fitted skirt, long flowing bright red hair, a starfish hair clip, and pearl jewelry. Coral reef or seaside grotto setting with iridescent lighting.",
      "sleeping-beauty-royal": "IMPORTANT: Style in an elegant color-shifting pink-to-blue medieval gown with pointed sleeves, a golden crown/tiara, long golden hair in soft waves, and a serene, regal pose. Enchanted castle rose garden setting.",
      // Video Game Characters
      "space-bounty-hunter": "IMPORTANT: Style in a full orange and red power suit of armor with a green visor helmet, arm cannon, and bulky shoulder pads. Sci-fi space station or alien planet setting.",
      "hylian-hero": "IMPORTANT: Style in a green tunic with a brown leather belt, a long green pointed cap, brown leather boots and gauntlets, carrying a glowing blue-hilted sword and a blue Hylian shield with a golden bird emblem. Hyrule-inspired fantasy meadow setting.",
      "hedgehog-speedster": "IMPORTANT: Style in a blue bodysuit or themed outfit inspired by a supersonic blue hedgehog — red sneakers with a white strap and gold buckle, white gloves, and a dynamic running pose. Green hills loop-de-loop setting with motion blur.",
      "battle-royale-soldier": "IMPORTANT: Style in colorful tactical/military-inspired armor or a bright character skin outfit, a backpack with a pickaxe, and a playful victory pose or dance. Vibrant island battlefield with a blue storm circle in the sky.",
      "block-builder": "IMPORTANT: Style in pixelated-looking diamond or iron armor, carrying a diamond pickaxe, with a blocky aesthetic and cubic accessories. Blocky landscape with grass blocks, trees, and a pixelated sun.",
      "street-fighter-warrior": "IMPORTANT: Style in a torn white karate gi with a black belt, a red headband tied around the forehead with flowing tails, red fighting gloves, and bare feet. Powerful martial arts stance with fists raised. Dojo or street fight arena setting.",
      "racing-plumber": "IMPORTANT: Style in a colorful racing jumpsuit or kart-racing outfit with helmet, gloves, and racing goggles pushed up on the forehead. Checkered flag accessories. Colorful racing track setting.",
      "goddess-of-war": "IMPORTANT: Style in ancient Spartan-inspired armor — leather skirt, chest plate with shoulder guards, arm wraps, and leg greaves. Red face and body war paint in a stripe pattern. Carrying twin chained blades. Ancient Greek temple ruins setting with dramatic stormy sky.",
      "vault-dweller": "IMPORTANT: Style in a blue jumpsuit with yellow trim and a large number on the back, a wrist-mounted Pip-Boy computer device, a utility belt, and a weathered leather backpack. Post-apocalyptic wasteland setting with ruins and dust.",
      // Comic Book & Superhero
      "superhero-classic": "IMPORTANT: Style in a generic superhero costume — form-fitting suit in bold primary colors (red, blue, yellow), a cape, boots, gloves, and a chest emblem. Heroic pose with city skyline backdrop.",
      "villain-dark-lord": "IMPORTANT: Style in dramatic dark villain attire — flowing black cape, dark armor or robes, a horned or crowned helmet, glowing accents, and an imposing stance. Dark throne room or volcanic setting.",
      "web-slinger": "IMPORTANT: Style in a full-body red and blue suit with a web pattern design, large white eye lenses on the mask, and a dynamic crouching pose with one arm extended forward. Urban city rooftop setting with skyscrapers.",
      "dark-knight-vigilante": "IMPORTANT: Style in a dark grey and black armored suit with a bat-shaped chest emblem, a pointed-eared cowl mask, a flowing dark cape, utility belt with gadgets, and armored gauntlets. Dark city rooftop at night with searchlight in the sky.",
      "amazonian-warrior": "IMPORTANT: Style in a red and blue armored corset-style top with a gold eagle emblem, a blue skirt with white stars, a golden tiara with a red star, silver bracers/gauntlets, and a golden glowing lasso at the hip. Dramatic warrior pose. Ancient Greek-inspired arena setting.",
      "cosmic-captain": "IMPORTANT: Style in a blue suit with red and white stripes on the torso, a star emblem on the chest, red gloves, red boots, a winged helmet or simple mask, and carrying a round red-white-and-blue shield with a star. Heroic patriotic stance. Battlefield or monument setting.",
      "thunder-god": "IMPORTANT: Style in silver and blue armor with red flowing cape, a winged silver helmet, arm bracers, and wielding a short-handled war hammer crackling with lightning. Powerful stance with storm clouds and lightning in the background. Asgardian palace or mountain peak setting.",
      "clawed-mutant": "IMPORTANT: Style in a yellow and blue or brown and tan skin-tight suit, a belt with an X buckle, wild sideburns and swept-back hair, and three metallic claws extending from each fist. Fierce snarling expression. Forest or military base setting.",
      "anti-hero-symbiote": "IMPORTANT: Style in an all-black organic-looking bodysuit with a large white spider emblem on the chest and back, white eye patches, tendrils and sharp teeth emerging from the suit. Menacing crouched pose. Dark alley or nighttime city setting.",
      // Fantasy & Horror
      "cyber-hacker": "IMPORTANT: Style in a long black leather trench coat, black fitted clothes underneath, slim dark sunglasses, and slicked-back hair. Dramatic green-tinted lighting, digital rain effects.",
      "elven-archer": "IMPORTANT: Style in a green or brown leather tunic, leaf-shaped brooch, leather bracers, tall boots, a cloak, and carrying an ornate longbow. Pointed ear prosthetics, enchanted forest setting.",
      "rpg-knight": "IMPORTANT: Style in full medieval fantasy plate armor — breastplate, pauldrons, gauntlets, greaves, a shield, and a longsword. Dramatic castle or battlefield setting with cinematic lighting.",
      "witch-sorceress": "IMPORTANT: Style in flowing dark robes or a witch's dress, a pointed hat, a magical staff or wand, mystical jewelry, and dramatic makeup. Enchanted library or moonlit forest setting.",
      "zombie-cosplay": "IMPORTANT: Style with SFX zombie makeup — pale skin, dark eye circles, faux wounds and blood effects, tattered and ripped everyday clothing, and a shambling undead pose. Dark, foggy graveyard setting.",
      "vampire-noble": "IMPORTANT: Style in a high-collared black and crimson velvet cape over a Victorian-era suit or gown, pale skin with subtle fangs, dark smoky eye makeup, slicked-back or flowing dark hair, a ruby pendant, and an aristocratic, menacing pose. Gothic castle interior with candlelight and mist.",
      "steampunk-explorer": "IMPORTANT: Style in a Victorian-inspired outfit with brass goggles on the forehead, a fitted corset or waistcoat with gear/cog details, high-waisted pants or layered skirts, leather boots with buckles, a utility belt with vials and tools, and a top hat with gears. Industrial workshop or airship deck setting with copper and steam elements.",
    };

    // Baby & Toddler sub-style overrides
    const babySubStyleOverrides: Record<string, string> = {
      "baby-formal": "IMPORTANT: Style the baby/toddler in a tiny formal outfit — a mini suit with bow tie for boys, or a tulle dress with headband for girls. Patent leather shoes. Clean, bright nursery or garden party setting.",
      "baby-casual": "IMPORTANT: Style the baby/toddler in comfortable everyday clothes — soft cotton graphic onesie or t-shirt, stretchy leggings or joggers, and soft-sole shoes. Playful, bright indoor or park setting.",
      "baby-matching-set": "IMPORTANT: Style the baby/toddler in a perfectly coordinated matching set — top and bottom in the same pattern/color family. Clean, modern styling. Bright lifestyle photography.",
      "baby-sporty": "IMPORTANT: Style the baby/toddler in mini athletic wear — tiny sneakers, joggers or shorts, and a sporty tee or hoodie. Team-inspired colors. Playful outdoor setting.",
      "baby-princess": "IMPORTANT: Style the baby/toddler girl in a fluffy tutu skirt, sparkly headband or tiara, ballet-style shoes, and a cute top. Whimsical, fairytale-inspired setting.",
      "baby-denim": "IMPORTANT: Style the baby/toddler in mini denim — tiny jeans or denim jacket, paired with a cute graphic tee and small sneakers. Casual, stylish kids' fashion editorial.",
      "baby-cozy": "IMPORTANT: Style the baby/toddler in cozy knitwear — chunky knit sweater, soft fleece onesie, fuzzy booties, and a knit beanie. Warm, cozy indoor setting with soft blankets.",
      "baby-summer": "IMPORTANT: Style the baby/toddler in bright summer clothes — a colorful romper or sunsuit, tiny sandals, a floppy sun hat, and sunglasses. Sunny outdoor garden or beach setting.",
      "baby-holiday": "IMPORTANT: Style the baby/toddler in a themed holiday outfit — Christmas elf/Santa outfit, Halloween costume, or Easter pastels. Festive, age-appropriate, and adorable.",
      "baby-boho": "IMPORTANT: Style the baby/toddler in earthy boho tones — floral print romper or dress, moccasin shoes, a flower headband, and natural fabric textures. Outdoor meadow setting.",
      "baby-streetwear": "IMPORTANT: Style the baby/toddler in mini streetwear — tiny Jordans or Nikes, a graphic tee, joggers or cargo pants, and a snapback cap. Cool-kid energy in a lifestyle editorial setting.",
      "baby-twin-matching": "IMPORTANT: Style the baby/toddler in a matching outfit designed for sibling or parent-child coordination — same colors, complementary patterns. Show coordinated styling.",
    };

    // Parent-Child matching sub-style overrides
    const parentChildSubStyleOverrides: Record<string, string> = {
      "pc-casual-match": "IMPORTANT: Show a parent and baby/toddler both wearing matching casual outfits — coordinated graphic tees or solid-color tops, matching jeans or joggers, and similar sneakers. Relaxed lifestyle setting.",
      "pc-denim-duo": "IMPORTANT: Show a parent and baby/toddler in coordinated denim — matching denim jackets, jeans, and white tees. Classic Americana family editorial photography.",
      "pc-sporty-match": "IMPORTANT: Show a parent and baby/toddler in matching athletic wear — coordinated Nike or Adidas sets, matching sneakers, and sporty accessories. Active lifestyle setting.",
      "pc-streetwear-mini": "IMPORTANT: Show a parent and baby/toddler in matching streetwear — coordinated Jordans or trendy sneakers, matching hoodies or graphic tees, and cool accessories. Urban lifestyle editorial.",
      "pc-cozy-match": "IMPORTANT: Show a parent and baby/toddler in matching cozy knitwear — coordinated chunky sweaters, beanies, and warm-toned outfits. Warm, cozy indoor setting.",
      "pc-formal-match": "IMPORTANT: Show a parent and baby/toddler in coordinated formal outfits — matching suits or dresses scaled to size. Elegant event-ready styling.",
      "pc-holiday-match": "IMPORTANT: Show a parent and baby/toddler in matching holiday-themed outfits — coordinated Christmas pajamas, Halloween costumes, or Easter pastels. Festive family setting.",
      "pc-wedding-match": "IMPORTANT: Show a parent and baby/toddler in coordinated wedding guest attire — elegant complementary outfits suitable for a ceremony. Beautiful venue setting.",
      "pc-birthday-match": "IMPORTANT: Show a parent and baby/toddler in matching birthday party outfits — coordinated theme colors, fun accessories, and celebratory styling.",
      "pc-boho-match": "IMPORTANT: Show a parent and baby/toddler in matching boho outfits — coordinated earthy tones, floral prints, and natural fabrics. Outdoor meadow setting.",
      "pc-monochrome-match": "IMPORTANT: Show a parent and baby/toddler in a single-color coordinated look — all-white, all-black, or single color palette. Clean, editorial styling.",
      "pc-pastel-match": "IMPORTANT: Show a parent and baby/toddler in matching soft pastel outfits — lavender, mint, or blush tones. Gentle, dreamy photography.",
      "pc-tropical-match": "IMPORTANT: Show a parent and baby/toddler in matching tropical prints — coordinated Hawaiian shirts/dresses and resort wear. Vacation/beach setting.",
      "pc-preppy-match": "IMPORTANT: Show a parent and baby/toddler in matching preppy outfits — coordinated polo shirts, khakis, and boat shoes. Country club aesthetic.",
      "pc-mommy-daughter": "IMPORTANT: Show a MOTHER and her DAUGHTER in beautifully matching feminine outfits — coordinated dresses, headbands, and accessories. Warm, loving mother-daughter lifestyle photography.",
      "pc-mommy-son": "IMPORTANT: Show a MOTHER and her SON in coordinated outfits — complementary colors and styles. The mother's outfit is chic and the son's is a mini-gentleman version. Warm lifestyle photography.",
      "pc-daddy-daughter": "IMPORTANT: Show a FATHER and his DAUGHTER in coordinated outfits — dad in a sharp look, daughter in a miniature feminine complement. Heartwarming family editorial.",
      "pc-daddy-son": "IMPORTANT: Show a FATHER and his SON in matching outfits — coordinated suits, sneakers, or jerseys. Like father like son energy. Family lifestyle photography.",
    };

    const cosplayOverride = (styleCategory === "cosplay" && styleSubcategory && cosplaySubStyleOverrides[styleSubcategory])
      ? `\n\n${cosplaySubStyleOverrides[styleSubcategory]}`
      : "";

    const babyOverride = (styleCategory === "baby-toddler" && styleSubcategory && babySubStyleOverrides[styleSubcategory])
      ? `\n\n${babySubStyleOverrides[styleSubcategory]}`
      : "";

    // Kids sub-style overrides
    const kidsSubStyleOverrides: Record<string, string> = {
      "kids-casual": "IMPORTANT: Style the child in comfortable everyday clothes — a graphic tee or hoodie, jeans or joggers, and clean sneakers. Bright, playful setting. Age-appropriate, wholesome children's fashion editorial.",
      "kids-school": "IMPORTANT: Style the child in neat back-to-school clothes — a polo or button-up, chinos or a skirt, clean shoes, and a backpack. Bright, cheerful school-themed setting.",
      "kids-sporty": "IMPORTANT: Style the child in athletic wear — matching sports set, sneakers, and a sporty watch or cap. Active outdoor or playground setting.",
      "kids-formal": "IMPORTANT: Style the child in formal attire — a mini suit with tie for boys, or an elegant dress with headband for girls. Patent shoes. Special event setting.",
      "kids-streetwear": "IMPORTANT: Style the child in cool kids' streetwear — Jordans or Nikes, a graphic tee, joggers or cargo pants, and a snapback. Urban lifestyle editorial.",
      "kids-preppy": "IMPORTANT: Style the child in preppy clothes — polo shirt, chinos or a pleated skirt, clean sneakers or loafers, and a neat hairstyle. Picture-day-ready setting.",
      "kids-boho": "IMPORTANT: Style the child in earthy boho tones — floral prints, natural fabrics, moccasins or sandals. Outdoor meadow setting.",
      "kids-summer": "IMPORTANT: Style the child in bright summer clothes — colorful shorts, a fun tank or tee, sandals, sunglasses, and a bucket hat. Sunny outdoor setting.",
      "kids-winter": "IMPORTANT: Style the child in cozy winter layers — a puffer jacket, beanie, boots, and warm scarf. Snowy or cold-weather outdoor setting.",
      "kids-holiday": "IMPORTANT: Style the child in a festive holiday outfit — Christmas sweater, Halloween costume, or Easter pastels. Themed celebratory setting.",
      "kids-matching-sibling": "IMPORTANT: Style the child in an outfit designed for sibling coordination — same colors, complementary patterns. Show coordinated kids' styling.",
      "kids-denim": "IMPORTANT: Style the child in denim pieces — a denim jacket, jeans, and a cool tee with sneakers. Casual, rugged-cute kids' fashion editorial.",
    };

    const kidsOverride = (styleCategory === "kids" && styleSubcategory && kidsSubStyleOverrides[styleSubcategory])
      ? `\n\n${kidsSubStyleOverrides[styleSubcategory]}`
      : "";

    const parentChildOverride = (styleCategory === "parent-child" && styleSubcategory && parentChildSubStyleOverrides[styleSubcategory])
      ? `\n\n${parentChildSubStyleOverrides[styleSubcategory]}`
      : "";

    // Couples sub-style overrides
    const couplesSubStyleOverrides: Record<string, string> = {
      "cp-casual-match": "IMPORTANT: Show a couple wearing coordinated casual outfits — matching or complementary tees, jeans, and sneakers. Relaxed lifestyle editorial.",
      "cp-athleisure": "IMPORTANT: Show a couple in matching athletic wear — coordinated workout sets, matching sneakers, sporty accessories. Gym or active lifestyle setting.",
      "cp-streetwear": "IMPORTANT: Show a couple in coordinated streetwear — matching Jordans, oversized hoodies, and hypebeast energy. Urban editorial.",
      "cp-cozy-couple": "IMPORTANT: Show a couple in matching cozy outfits — coordinated knit sweaters, beanies, and warm tones. Cozy indoor or autumn setting.",
      "cp-romantic-dinner": "IMPORTANT: Show a couple dressed elegantly for dinner — coordinated formal-casual looks, complementary colors. Candlelit restaurant ambiance.",
      "cp-rooftop-drinks": "IMPORTANT: Show a couple in trendy coordinated outfits for a night out — stylish, complementary looks. Rooftop bar setting.",
      "cp-club-night": "IMPORTANT: Show a couple in bold, coordinated outfits for clubbing — matching dark tones, statement pieces, and head-turning energy. Nightlife setting.",
      "cp-wedding-guest": "IMPORTANT: Show a couple in coordinated formal wedding guest attire — complementary dress and suit. Elegant venue setting.",
      "cp-gala-black-tie": "IMPORTANT: Show a couple in black-tie attire — stunning gown and tuxedo, perfectly coordinated. Red carpet editorial.",
      "cp-holiday-match": "IMPORTANT: Show a couple in matching holiday-themed outfits — Christmas sweaters, Valentine's red, or festive coordination.",
      "cp-vacation": "IMPORTANT: Show a couple in coordinated resort wear — linen, pastels, tropical prints. Beach or resort vacation setting.",
      "cp-monochrome": "IMPORTANT: Show a couple in monochrome coordinated outfits — all-black, all-white, or single-color palette. Clean editorial styling.",
      "cp-boho-couple": "IMPORTANT: Show a couple in coordinated boho outfits — earthy tones, flowing fabrics, natural textures. Outdoor meadow setting.",
      "cp-preppy-pair": "IMPORTANT: Show a couple in coordinated preppy outfits — polos, blazers, clean lines. Country club aesthetic.",
      "cp-edgy-couple": "IMPORTANT: Show a couple in coordinated edgy outfits — leather, chains, dark tones. Rebellious couple energy.",
      "cp-vintage-duo": "IMPORTANT: Show a couple in coordinated retro-inspired outfits — 70s, 80s, or 90s aesthetic. Vintage editorial photography.",
    };

    const couplesOverride = (styleCategory === "couples" && styleSubcategory && couplesSubStyleOverrides[styleSubcategory])
      ? `\n\n${couplesSubStyleOverrides[styleSubcategory]}`
      : "";

    const combinedOverride = swimwearOverride || iconOverride || cosplayOverride || babyOverride || kidsOverride || parentChildOverride || couplesOverride;

    // Add subcategory refinement context
    const subcategoryNote = styleSubcategory
      ? `\n\nSUB-STYLE DIRECTION: Apply a "${styleSubcategory.replace(/-/g, " ")}" aesthetic within the ${styleCategory.replace(/-/g, " ")} category. This should strongly influence the color palette, silhouettes, fabric choices, accessories, and overall mood of the look. Make it distinctly feel like this sub-style.${combinedOverride}`
      : combinedOverride;

    // Makeup preference for female users
    const makeupNote = (!isMale && makeupPreference)
      ? makeupPreference === "natural"
        ? "\n\nMAKEUP DIRECTION: Keep the look natural — minimal or no visible makeup. Clean, fresh skin with a barely-there beauty approach. No heavy foundation, bold lipstick, or dramatic eye makeup."
        : "\n\nMAKEUP DIRECTION: Apply full glam makeup — flawless base, sculpted contour, defined brows, lashes, statement lips, and polished beauty styling."
      : "";

    // Add Gio's refinement context if available
    const refinementNote = refinementContext
      ? `\n\nIMPORTANT REFINEMENT from stylist: Apply these specific changes to the look while keeping it tasteful, premium, and editorial: ${normalizeRefinementContext(refinementContext)}`
      : "";


    const requestImage = async (messages: any[]) => {
      const maxRetries = 3;
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        if (attempt > 0) {
          // Exponential backoff: 2s, 4s
          await new Promise((r) => setTimeout(r, 2000 * attempt));
        }

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image-preview",
            messages,
            modalities: ["image", "text"],
          }),
        });

        if (response.status === 429) {
          console.warn(`Rate limited on attempt ${attempt + 1}/${maxRetries}, retrying...`);
          lastError = new Error("RATE_LIMITED");
          continue;
        }

        if (response.status === 402) {
          throw new Error("CREDITS_EXHAUSTED");
        }

        if (!response.ok) {
          const errText = await response.text();
          console.error("AI gateway error:", response.status, errText);
          throw new Error("GENERATION_FAILED");
        }

        const data = await response.json();
        const firstImage = data.choices?.[0]?.message?.images?.[0];

        return {
          generatedImage: firstImage?.image_url?.url ?? firstImage?.url ?? null,
          textResponse: data.choices?.[0]?.message?.content || "",
        };
      }

      // All retries exhausted
      throw lastError || new Error("RATE_LIMITED");
    };

    // Strong gender enforcement (skip for baby, kids, parent-child, and couples categories)
    const isBaby = styleCategory === "baby-toddler";
    const isKids = styleCategory === "kids";
    const isParentChild = styleCategory === "parent-child";
    const isCouples = styleCategory === "couples";
    const isChildCategory = isBaby || isKids;
    const hasDualPhotos = (isParentChild || isCouples) && secondImageBase64;

    // Content safety for kids/baby categories
    const childSafetyDirective = isChildCategory
      ? "\n\nCONTENT SAFETY — MANDATORY: This image involves a child. ALL clothing MUST be age-appropriate, modest, and family-friendly. Do NOT generate anything revealing, suggestive, or inappropriate for children. No crop tops, no low-cut items, no swimwear, no lingerie, no adult-themed styling. Keep the tone wholesome, cheerful, and suitable for a children's fashion catalog. Only generate fully-clothed, modest, and tasteful children's outfits."
      : "";

    const genderEnforcement = isBaby
      ? `\n\nCRITICAL: This is a BABY/TODDLER styling request. The uploaded photo is of a baby or toddler. Style this baby/toddler in age-appropriate children's clothing. The result must show a cute, adorable baby/toddler — NOT an adult. All clothing must be baby/toddler sized. Preserve the child's EXACT face — same eyes, nose, mouth, skin tone, and hair.${childSafetyDirective}`
      : isKids
        ? `\n\nCRITICAL: This is a KIDS styling request. The uploaded photo is of a child (school-age). Style this child in age-appropriate, kid-friendly clothing. The result must show a child — NOT an adult or teenager. All clothing must be children's sized. Preserve the child's EXACT face — same eyes, nose, mouth, skin tone, and hair.${childSafetyDirective}`
      : isCouples && hasDualPhotos
        ? `\n\nCRITICAL COUPLES STYLING WITH DUAL PHOTOS: TWO photos have been provided — the FIRST image is one partner and the SECOND image is the other partner. Generate a single image showing BOTH people together wearing beautifully coordinated complementary outfits. You MUST preserve BOTH people's EXACT facial features with photographic accuracy — same eye shape, nose, lips, jawline, skin tone, hair color and texture. Each person must be immediately recognizable from their uploaded photo. Their outfits should harmonize in color, style, and vibe while each being flattering for the individual. Professional couples fashion editorial photography.`
        : isCouples
          ? `\n\nCRITICAL COUPLES STYLING: This is a couples outfit request. The uploaded photo is of one partner (a ${genderWord}). Generate an image showing this ${genderWord} alongside their partner, BOTH wearing beautifully coordinated complementary outfits. You MUST preserve the uploaded person's EXACT facial features — same eyes, nose, lips, jawline, skin tone, and hair. Show BOTH people together in the same image. Professional couples fashion editorial photography.`
          : isParentChild && hasDualPhotos
            ? `\n\nCRITICAL PARENT-CHILD MATCHING WITH DUAL PHOTOS: TWO photos have been provided — the FIRST image is the PARENT (a ${genderWord}) and the SECOND image is the CHILD. Generate a single image showing BOTH people together wearing beautifully coordinated matching outfits. You MUST preserve BOTH people's EXACT facial features with photographic accuracy — same eye shape, nose, lips, jawline, skin tone, hair. Each person must be immediately recognizable from their uploaded photo. The parent's outfit should be stylish and the child's should be a miniature complementary version. Professional family fashion editorial photography.`
            : isParentChild
              ? `\n\nCRITICAL PARENT-CHILD MATCHING: This is a parent-child matching outfit request. The uploaded photo is of the PARENT (a ${genderWord}). You MUST preserve the parent's EXACT facial features — same eyes, nose, lips, jawline, skin tone, hair color and texture. Generate an image showing this ${genderWord} parent alongside a baby/toddler, BOTH wearing beautifully coordinated matching outfits. Show BOTH the parent and child together in the same image. Professional family fashion editorial photography.`
              : `\n\nCRITICAL GENDER REQUIREMENT: This person is a ${genderWord}. The generated image MUST clearly depict a ${genderWord}. All clothing, styling, body proportions, and accessories MUST be ${isMale ? "masculine/men's" : "feminine/women's"} items specifically designed for a ${genderWord}. Do NOT generate ${isMale ? "women's" : "men's"} clothing or styling.`;

    let editPrompt: string;
    let messages: any[];

    if (isMannequin) {
      // Mannequin mode: generate clothes on a mannequin/dress form without a user photo
      const mannequinType = isChildCategory
        ? `a child-sized ${isMale ? "boy's" : "girl's"} mannequin`
        : `a ${isMale ? "male" : "female"} ${isMale ? "grey" : "white"} mannequin`;
      editPrompt = `Fashion photo of ${mannequinType} displaying: ${styleDesc} Clean studio backdrop, soft lighting, realistic fabric textures. High-end lookbook style.${subcategoryNote}${genderEnforcement}${childSafetyDirective}${refinementNote}`;

      messages = [
        {
          role: "user",
          content: [{ type: "text", text: editPrompt }],
        },
      ];
    } else {
      // On-me mode: restyle the user's photo
      const isSwimwear = styleCategory === "swimwear";
      const isLingerie = styleCategory === "lingerie";
      const isRevealing = isSwimwear || isLingerie || styleCategory === "sexy";

      // Strong facial identity preservation directive
      const facePreservation = "CRITICAL FACIAL IDENTITY PRESERVATION: You MUST preserve this person's EXACT facial features with photographic accuracy. This means their exact eye shape, eye color, nose shape and size, lip shape and fullness, jawline, chin shape, cheekbone structure, eyebrow shape, forehead size, skin tone, skin texture, freckles, moles, facial hair, hairline, and hair color/texture. The face in the generated image must be immediately recognizable as the SAME person from the uploaded photo — not a similar-looking person, but the EXACT same person. Do NOT idealize, smooth, reshape, or alter any facial features. Do NOT change their ethnicity, skin tone, or facial proportions. The person viewing the result should instantly say 'that's me.'";

      const keepNote = isSwimwear
        ? `${facePreservation} Keep the person's exact body shape and proportions. Restyle ONLY their clothing to match the described swimwear and resort fashion. Change the background to a beautiful beach or pool resort setting. Professional fashion editorial style.`
        : isLingerie
          ? `${facePreservation} Keep the person's exact body shape and proportions. Restyle ONLY their clothing to match the described luxury sleepwear and loungewear look. Change the background to an elegant bedroom or boudoir setting. Professional fashion editorial style.`
          : isRevealing
            ? `${facePreservation} Keep the person's exact body shape and proportions. Restyle ONLY their clothing to match the described outfit. Change the background to match the setting described. Professional fashion editorial style.`
            : `${facePreservation} Keep the person's exact body shape, proportions, and background. Change ONLY their clothing and accessories. Realistic clothing, warm lighting.`;
      editPrompt = photoType === "full-body"
        ? `Restyle this ${genderWord}'s outfit: ${styleDesc} ${keepNote}${subcategoryNote}${genderEnforcement}${makeupNote}${refinementNote}`
        : `Restyle this ${genderWord}'s look: ${styleDesc} ${keepNote}${subcategoryNote}${genderEnforcement}${makeupNote}${refinementNote}`;

      const contentParts: any[] = [
        { type: "text", text: editPrompt },
        { type: "image_url", image_url: { url: imageBase64 } },
      ];
      // Add second photo for dual-photo parent-child mode
      if (hasDualPhotos) {
        contentParts.push({ type: "image_url", image_url: { url: secondImageBase64 } });
      }

      messages = [
        {
          role: "user",
          content: contentParts,
        },
      ];
    }

    let { generatedImage, textResponse } = await requestImage(messages);

    if (!generatedImage) {
      const fallbackDescriptions: Record<string, string> = {
        swimwear: isMannequin
          ? `Fashion lookbook image of a ${isMale ? "male" : "female"} mannequin displaying a coordinated two-piece bikini set — a structured bikini top and matching high-cut bikini bottoms in an elegant solid color, styled with a sheer sarong, strappy sandals, and oversized sunglasses. Clean studio-quality editorial image with luxury beach accessories.`
          : `Restyle this ${genderWord} into a luxury swimwear editorial look. Dress them in a flattering coordinated two-piece bikini set with a structured top and matching bottoms, add a sarong, sandals, and beach accessories. Keep the person's identity and body shape. Change background to a beautiful tropical beach resort. Premium magazine photography with golden-hour lighting.`,
        lingerie: isMannequin
          ? `Fashion lookbook image of a ${isMale ? "male" : "female"} mannequin in luxury sleepwear and elegant loungewear, including a satin set and robe. Sophisticated editorial studio lighting.`
          : `Restyle this ${genderWord} into a luxury sleepwear editorial look. Keep the person's identity and body shape, dress them in elegant premium loungewear such as a satin set or silk robe, and make it polished, tasteful, and fashion-forward. Premium editorial photography.`,
        sexy: isMannequin
          ? `Fashion mannequin styled in glamorous eveningwear with a confident silhouette, refined accessories, and polished editorial lighting. Tasteful luxury campaign aesthetic.`
          : `Restyle this ${genderWord} into a glamorous eveningwear editorial look. Keep the person's identity and body shape, use a confident fitted silhouette with refined styling, and keep the result tasteful and high-fashion. Premium editorial photography.`,
      };

      const fallbackPrompt = fallbackDescriptions[styleCategory] || (isMannequin
        ? `High-end fashion mannequin editorial showing ${styleDesc}. Sophisticated styling, realistic fabrics, luxury studio lighting.`
        : `Restyle this ${genderWord} into a polished high-end fashion editorial look inspired by ${styleCategory.replace(/-/g, " ")}. CRITICAL: Preserve this person's EXACT facial features — same eye shape, eye color, nose, lips, jawline, skin tone, hair color and texture. The person must be immediately recognizable. Change ONLY their clothing. Premium magazine photography.`);

      const fallbackMessages = isMannequin
        ? [{ role: "user", content: [{ type: "text", text: `${fallbackPrompt}${refinementNote}` }] }]
        : [{
            role: "user",
            content: [
              { type: "text", text: `${fallbackPrompt}${refinementNote}` },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          }];

      const fallbackResult = await requestImage(fallbackMessages);
      generatedImage = fallbackResult.generatedImage;
      textResponse = fallbackResult.textResponse;
    }

    if (!generatedImage) {
      return new Response(
        JSON.stringify({ error: "No image could be generated for this look. Please try again." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ imageUrl: generatedImage || null, description: textResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    if (e instanceof Error && e.message === "RATE_LIMITED") {
      return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (e instanceof Error && e.message === "CREDITS_EXHAUSTED") {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.error("generate-styled-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error && e.message === "GENERATION_FAILED" ? "Failed to generate styled image" : e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, Coffee, Sparkles, Briefcase, Flame, Heart, Palmtree, Check, Dumbbell, Star, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StyleCategory, Gender } from "./GlamoraApp";
import FlowStepper from "./FlowStepper";
import { fetchVibePhotos, fetchVibePhotosByQuery, type VibeQuery } from "./pexelsPhotos";

interface Props {
  gender: Gender;
  onBack: () => void;
  onNext: (
    category: StyleCategory,
    subcategory: string,
    vibeLabel: string,
    inspirationImageUrl?: string,
    recreateMode?: "exact" | "inspired",
  ) => void;
}

type OccasionId = "casual" | "glam" | "formal" | "streetwear" | "date-night" | "vacation" | "swimwear" | "fitness" | "cosplay";

interface Vibe {
  id: string;
  label: string;
  /** Pexels search query — must visually match the label exactly. */
  query: string;
  /** Fallback static image (only used if Pexels fails entirely). */
  image: string;
  category: StyleCategory;
  subcategory: string;
}

interface Occasion {
  id: OccasionId;
  label: string;
  desc: string;
  Icon: LucideIcon;
  /** When true, fetch one targeted photo per vibe via per-query mode. */
  usePerVibePhotos: boolean;
  vibes: { female: Vibe[]; male: Vibe[] };
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=500&h=650&fit=crop&q=72&auto=format`;

// Rotate ethnicities across the 12 slots so every grid is racially diverse.
const ETHNICITIES = ["black", "white", "hispanic", "asian"];
const eth = (i: number) => ETHNICITIES[i % ETHNICITIES.length];

// ============================================================================
// Per-vibe queries — every label must match its photo exactly.
// ============================================================================

const FEMALE: Record<OccasionId, Vibe[]> = {
  swimwear: [
    { id: "f-swm-01", label: "String Bikini",    query: "string bikini swimsuit",                image: img("1570976447640-ac859d960c4b"), category: "swimwear", subcategory: "string-bikini" },
    { id: "f-swm-02", label: "High Waist Bikini",query: "high waisted bikini swimsuit",          image: img("1611042553484-d61f84d22784"), category: "swimwear", subcategory: "high-waist-bikini" },
    { id: "f-swm-03", label: "One Piece",        query: "one piece swimsuit beach",              image: img("1515886657613-9f3515b0c78f"), category: "swimwear", subcategory: "one-piece" },
    { id: "f-swm-04", label: "Cut Out Swim",     query: "cut out swimsuit fashion",              image: img("1539109136881-3be0616acf4b"), category: "swimwear", subcategory: "cutout-swim" },
    { id: "f-swm-05", label: "Tropical Print",   query: "tropical floral print bikini swimsuit", image: img("1606107557195-0e29a4b5b4aa"), category: "swimwear", subcategory: "tropical-print-bikini" },
    { id: "f-swm-06", label: "Coverup and Sarong", query: "beach coverup sarong",                image: img("1556306535-0f09a537f0a3"), category: "swimwear", subcategory: "swim-coverup" },
    { id: "f-swm-07", label: "Triangle Top",     query: "triangle bikini top",                   image: img("1502767089025-6748d4ef9f24"), category: "swimwear", subcategory: "triangle-top" },
    { id: "f-swm-08", label: "Sporty Swim",      query: "sporty athletic swimsuit",              image: img("1611591437281-460bfbe1220a"), category: "swimwear", subcategory: "sporty-swim" },
    { id: "f-swm-09", label: "Crochet Bikini",   query: "crochet bikini swimsuit",               image: img("1581824283135-0666cf353f35"), category: "swimwear", subcategory: "crochet-bikini" },
    { id: "f-swm-10", label: "Bandeau",          query: "bandeau bikini top strapless",          image: img("1511499767150-a48a237f0083"), category: "swimwear", subcategory: "bandeau" },
    { id: "f-swm-11", label: "Wrap Bikini",      query: "wrap bikini swimsuit",                  image: img("1521119989659-a83eee488004"), category: "swimwear", subcategory: "wrap-bikini" },
    { id: "f-swm-12", label: "Pool Lounge",      query: "woman lounging by pool swimsuit",       image: img("1512310604669-443f26c35f52"), category: "swimwear", subcategory: "pool-lounge" },
  ],
  casual: [
    { id: "f-cas-01", label: "Jeans and Tee",    query: "jeans t-shirt casual outfit",           image: img("1483985988355-763728e1935b"), category: "casual", subcategory: "denim-and-tee" },
    { id: "f-cas-02", label: "Casual Dress",     query: "casual everyday dress",                 image: img("1496747611176-843222e1e57c"), category: "casual", subcategory: "casual-dress" },
    { id: "f-cas-03", label: "Athleisure",       query: "athleisure activewear outfit",          image: img("1518310383802-640c2de311b6"), category: "athleisure", subcategory: "matching-set" },
    { id: "f-cas-04", label: "Denim on Denim",   query: "denim jacket and jeans outfit",         image: img("1469334031218-e382a71b716b"), category: "casual", subcategory: "denim-on-denim" },
    { id: "f-cas-05", label: "Oversized Fit",    query: "oversized clothing outfit",             image: img("1604004215695-c54b6f3df1e7"), category: "casual", subcategory: "oversized-fit" },
    { id: "f-cas-06", label: "Cargo Pants",      query: "cargo pants outfit fashion",            image: img("1565325058695-f614c1580d7e"), category: "casual", subcategory: "cargo-pants" },
    { id: "f-cas-07", label: "Loungewear",       query: "loungewear comfortable home outfit",    image: img("1490481651871-ab68de25d43d"), category: "casual", subcategory: "loungewear" },
    { id: "f-cas-08", label: "Sundress",         query: "sundress summer dress",                 image: img("1542295669297-4d352b042bca"), category: "casual", subcategory: "sundress" },
    { id: "f-cas-09", label: "Graphic Tee",      query: "graphic t-shirt outfit",                image: img("1591348278863-a8fb3887e2aa"), category: "casual", subcategory: "graphic-tee" },
    { id: "f-cas-10", label: "Hoodie Fit",       query: "hoodie outfit street fashion",          image: img("1517438476312-10d79c5f25e3"), category: "casual", subcategory: "hoodie-fit" },
    { id: "f-cas-11", label: "Linen Set",        query: "linen matching set outfit",             image: img("1485518882345-15568b007407"), category: "casual", subcategory: "linen-set" },
    { id: "f-cas-12", label: "Boho Casual",      query: "bohemian casual outfit",                image: img("1607746882042-944635dfe10e"), category: "bohemian", subcategory: "boho-casual" },
  ],
  glam: [
    { id: "f-glm-01", label: "Mini Dress",       query: "mini dress night out",                  image: img("1539109136881-3be0616acf4b"), category: "full-style", subcategory: "mini-dress" },
    { id: "f-glm-02", label: "Bodycon Dress",    query: "bodycon dress fashion",                 image: img("1571513722275-4b41940f54b8"), category: "sexy", subcategory: "bodycon-night" },
    { id: "f-glm-03", label: "Two Piece Set",    query: "two piece set outfit glam",             image: img("1605100804763-247f67b3557e"), category: "full-style", subcategory: "two-piece-set" },
    { id: "f-glm-04", label: "Sequin Look",      query: "sequin dress sparkle outfit",           image: img("1601412436009-d964bd02edbc"), category: "full-style", subcategory: "sequin-look" },
    { id: "f-glm-05", label: "All Black",        query: "all black glam outfit",                 image: img("1641427493563-5cc9cf1a9950"), category: "edgy", subcategory: "all-black-night" },
    { id: "f-glm-06", label: "Satin Slip",       query: "satin slip dress",                      image: img("1566174053879-31528523f8ae"), category: "full-style", subcategory: "satin-slip" },
    { id: "f-glm-07", label: "Cut Out Dress",    query: "cut out dress fashion",                 image: img("1620063633168-8ec1bcc1bcec"), category: "sexy", subcategory: "cutout-dress" },
    { id: "f-glm-08", label: "Corset Top",       query: "corset top outfit",                     image: img("1622495966321-49b35b3a8d4f"), category: "sexy", subcategory: "corset-top" },
    { id: "f-glm-09", label: "Jumpsuit",         query: "elegant jumpsuit night out",            image: img("1502323777036-f29e3972d82f"), category: "full-style", subcategory: "jumpsuit" },
    { id: "f-glm-10", label: "Blazer Dress",     query: "blazer dress fashion",                  image: img("1599643478518-a784e5dc4c8f"), category: "full-style", subcategory: "blazer-dress" },
    { id: "f-glm-11", label: "Feather Detail",   query: "feather dress trim outfit",             image: img("1617380518330-7c5ca1dafdef"), category: "full-style", subcategory: "feather-detail" },
    { id: "f-glm-12", label: "Statement Look",   query: "bold statement dress fashion",          image: img("1525026198548-4baa812f1183"), category: "full-style", subcategory: "statement-look" },
  ],
  formal: [
    { id: "f-fml-01", label: "Power Suit",        query: "women power suit business",             image: img("1487412720507-e7ab37603c6f"), category: "formal", subcategory: "power-suit" },
    { id: "f-fml-02", label: "Pencil Skirt",      query: "pencil skirt blazer office",            image: img("1485231183945-fffde7cc051e"), category: "formal", subcategory: "pencil-skirt" },
    { id: "f-fml-03", label: "Wrap Dress",        query: "wrap dress professional",               image: img("1551836022-deb4988cc6c0"), category: "formal", subcategory: "wrap-dress" },
    { id: "f-fml-04", label: "Tailored Pants",    query: "tailored dress pants women office",     image: img("1605405748313-a416a1b84491"), category: "formal", subcategory: "tailored-pants" },
    { id: "f-fml-05", label: "Blazer Set",        query: "matching blazer suit set women",        image: img("1581044777550-4cfa60707c03"), category: "formal", subcategory: "blazer-set" },
    { id: "f-fml-06", label: "Midi Dress",        query: "midi dress workwear professional",      image: img("1495365200479-c4ed1d35e1aa"), category: "formal", subcategory: "midi-dress" },
    { id: "f-fml-07", label: "Monochrome",        query: "monochrome outfit women business",      image: img("1485178575877-1a13bf489dfe"), category: "minimalist", subcategory: "monochrome" },
    { id: "f-fml-08", label: "Classic White Shirt", query: "white button shirt women office",     image: img("1503342217505-b0a15ec3261c"), category: "formal", subcategory: "classic-white-shirt" },
    { id: "f-fml-09", label: "Trench Coat",       query: "trench coat outfit women",              image: img("1571945153237-4929e783af4a"), category: "formal", subcategory: "trench-coat" },
    { id: "f-fml-10", label: "Turtleneck Set",    query: "turtleneck professional outfit women",  image: img("1601049541289-9b1b7bbbfe19"), category: "formal", subcategory: "turtleneck-set" },
    { id: "f-fml-11", label: "Feminine Blouse",   query: "feminine blouse office outfit",         image: img("1591348122449-02525d70379b"), category: "formal", subcategory: "feminine-blouse" },
    { id: "f-fml-12", label: "Bold Color",        query: "bold colored business suit women",      image: img("1531123414780-f74242c2b052"), category: "formal", subcategory: "bold-color" },
  ],
  streetwear: [
    { id: "f-str-01", label: "Oversized Hoodie", query: "oversized hoodie streetwear women",     image: img("1517438476312-10d79c5f25e3"), category: "streetwear", subcategory: "oversized-hoodie" },
    { id: "f-str-02", label: "Cargo Set",        query: "cargo pants streetwear set",            image: img("1602910344008-22f323cc1817"), category: "streetwear", subcategory: "cargo-set" },
    { id: "f-str-03", label: "Sneaker Fit",      query: "sneaker outfit streetwear",             image: img("1532910404247-7ee9488d7292"), category: "streetwear", subcategory: "sneaker-fit" },
    { id: "f-str-04", label: "Graphic Tee",      query: "graphic tee streetwear outfit",         image: img("1492106087820-71f1a00d2b11"), category: "streetwear", subcategory: "graphic-tee-stack" },
    { id: "f-str-05", label: "Track Suit",       query: "track suit outfit",                     image: img("1503236823255-94609f598e71"), category: "streetwear", subcategory: "track-suit" },
    { id: "f-str-06", label: "Biker Shorts",     query: "biker shorts streetwear outfit",        image: img("1571908599407-cdb918ed83bf"), category: "streetwear", subcategory: "biker-shorts" },
    { id: "f-str-07", label: "Baggy Jeans",      query: "baggy jeans streetwear outfit",         image: img("1583900985737-6d0495555783"), category: "streetwear", subcategory: "baggy-denim" },
    { id: "f-str-08", label: "Bomber Jacket",    query: "bomber jacket streetwear outfit",       image: img("1494178270175-e96de2971df9"), category: "streetwear", subcategory: "bomber-jacket" },
    { id: "f-str-09", label: "Crop and Cargo",   query: "crop top cargo pants outfit",           image: img("1611042553365-9b101441c135"), category: "streetwear", subcategory: "crop-cargo" },
    { id: "f-str-10", label: "Vintage Fit",      query: "vintage streetwear outfit",             image: img("1531746020798-e6953c6e8e04"), category: "vintage", subcategory: "vintage-streetwear" },
    { id: "f-str-11", label: "Dad Hat Fit",      query: "dad hat streetwear outfit",             image: img("1564564321837-a57b7070ac4f"), category: "streetwear", subcategory: "dad-hat" },
    { id: "f-str-12", label: "Layered Look",     query: "layered streetwear outfit",             image: img("1581338834647-b0fb40704e21"), category: "streetwear", subcategory: "layered-streetwear" },
  ],
  "date-night": [
    { id: "f-dat-01", label: "Little Black Dress",query: "little black dress LBD",                image: img("1597223557154-721c1cecc4b0"), category: "date-night", subcategory: "little-black-dress" },
    { id: "f-dat-02", label: "Floral Dress",      query: "floral dress romantic",                 image: img("1581574919402-5b7d733224d6"), category: "date-night", subcategory: "floral-dress" },
    { id: "f-dat-03", label: "Satin Set",         query: "satin two piece set outfit",            image: img("1614593894937-8e84a52e5a2c"), category: "date-night", subcategory: "satin-set" },
    { id: "f-dat-04", label: "Elegant Jumpsuit",  query: "elegant jumpsuit evening",              image: img("1621786030484-4c855eed6974"), category: "date-night", subcategory: "elegant-jumpsuit" },
    { id: "f-dat-05", label: "Wrap Dress",        query: "wrap dress romantic date",              image: img("1592621385612-4d7129426394"), category: "date-night", subcategory: "wrap-dress" },
    { id: "f-dat-06", label: "Lace Detail",       query: "lace dress outfit",                     image: img("1629019279055-d2a8c0c50bb3"), category: "date-night", subcategory: "lace-detail" },
    { id: "f-dat-07", label: "Off Shoulder",      query: "off shoulder dress",                    image: img("1632481151312-4b4f3306e7e6"), category: "date-night", subcategory: "off-shoulder" },
    { id: "f-dat-08", label: "Maxi Dress",        query: "romantic maxi dress",                   image: img("1605497788044-5a32c7078486"), category: "date-night", subcategory: "maxi-dress" },
    { id: "f-dat-09", label: "Blazer and Heels",  query: "blazer and heels outfit women",         image: img("1573496359142-b8d87734a5a2"), category: "date-night", subcategory: "blazer-heels" },
    { id: "f-dat-10", label: "Slip Dress",        query: "slip dress satin outfit",               image: img("1567784177951-6fa58317e16b"), category: "date-night", subcategory: "slip-dress" },
    { id: "f-dat-11", label: "Bodycon",           query: "bodycon dress night out",               image: img("1634826260499-7d97a6049913"), category: "date-night", subcategory: "bodycon-date" },
    { id: "f-dat-12", label: "Feminine Set",      query: "feminine two piece skirt set",          image: img("1535632787350-4e68ef0ac584"), category: "date-night", subcategory: "feminine-set" },
  ],
  vacation: [
    { id: "f-vac-01", label: "Sundress",          query: "sundress vacation summer",              image: img("1542295669297-4d352b042bca"), category: "resort", subcategory: "sundress" },
    { id: "f-vac-02", label: "Resort Wear",       query: "resort wear outfit women",              image: img("1494578379344-d6c710782a3d"), category: "resort", subcategory: "resort-wear" },
    { id: "f-vac-03", label: "Beach Look",        query: "beach outfit women fashion",            image: img("1521223890158-f9f7c3d5d504"), category: "resort", subcategory: "beach-look" },
    { id: "f-vac-04", label: "Linen Set",         query: "linen vacation set outfit women",       image: img("1524504388940-b1c1722653e1"), category: "resort", subcategory: "linen-set" },
    { id: "f-vac-05", label: "Maxi Dress",        query: "vacation maxi dress",                   image: img("1610276198568-eb6d0ff53e48"), category: "resort", subcategory: "vacation-maxi" },
    { id: "f-vac-06", label: "Swimsuit Cover",    query: "swimsuit with cover up beach",          image: img("1606902965551-dce093cda6e7"), category: "resort", subcategory: "swimsuit-cover" },
    { id: "f-vac-07", label: "Tropical Print",    query: "tropical print dress vacation",         image: img("1488426862026-3ee34a7d66df"), category: "resort", subcategory: "tropical-print" },
    { id: "f-vac-08", label: "Straw Hat Look",    query: "straw hat vacation outfit women",       image: img("1610276198568-eb6d0ff53e48"), category: "resort", subcategory: "straw-hat" },
    { id: "f-vac-09", label: "Co Ord Set",        query: "matching co ord set vacation women",    image: img("1617922001439-4a2e6562f328"), category: "resort", subcategory: "co-ord-set" },
    { id: "f-vac-10", label: "Boho Vacation",     query: "bohemian vacation outfit",              image: img("1607746882042-944635dfe10e"), category: "bohemian", subcategory: "boho-vacation" },
    { id: "f-vac-11", label: "City Travel",       query: "city travel chic outfit women airport", image: img("1574258495973-f010dfbb5371"), category: "resort", subcategory: "city-travel" },
    { id: "f-vac-12", label: "Casual Resort",     query: "casual resort outfit women",            image: img("1577803645773-f96470509666"), category: "resort", subcategory: "casual-resort" },
  ],
  fitness: [
    { id: "f-fit-01", label: "Yoga Set",          query: "yoga set leggings women",               image: img("1571019613454-1cb2f99b2d8b"), category: "fitness", subcategory: "yoga-pants-set" },
    { id: "f-fit-02", label: "Nike 2-Piece",      query: "nike two piece athletic women",         image: img("1517836357463-d25dfeac3438"), category: "fitness", subcategory: "nike-2piece-women" },
    { id: "f-fit-03", label: "Pilates",           query: "pilates outfit women",                  image: img("1599058917212-d750089bc07e"), category: "fitness", subcategory: "pilates-set" },
    { id: "f-fit-04", label: "Running",           query: "running outfit women",                  image: img("1581009146145-b5ef050c2e1e"), category: "fitness", subcategory: "running-kit" },
    { id: "f-fit-05", label: "Tennis",            query: "tennis outfit women",                   image: img("1574680096145-d05b474e2155"), category: "fitness", subcategory: "tennis-outfit" },
    { id: "f-fit-06", label: "Boxing",            query: "boxing workout outfit women",           image: img("1605296867424-35fc25c9212a"), category: "fitness", subcategory: "boxing-mma" },
    { id: "f-fit-07", label: "HIIT Set",          query: "hiit workout outfit women",             image: img("1583089892943-e02e5b017b6a"), category: "fitness", subcategory: "hiit-set" },
    { id: "f-fit-08", label: "Lifting Fit",       query: "weightlifting outfit women gym",        image: img("1605125571577-fdd0c52d5fef"), category: "fitness", subcategory: "lifting-fit" },
    { id: "f-fit-09", label: "Studio Pilates",    query: "studio pilates outfit women",           image: img("1612036782180-6f0b6cd846fe"), category: "fitness", subcategory: "studio-pilates" },
    { id: "f-fit-10", label: "Hot Girl Walk",     query: "athleisure walk outfit women",          image: img("1591726328133-b4e2b0031cb2"), category: "fitness", subcategory: "hot-girl-walk" },
    { id: "f-fit-11", label: "Spin Class",        query: "spin cycling class outfit women",       image: img("1631825598395-58692acfee5c"), category: "fitness", subcategory: "spin-class" },
    { id: "f-fit-12", label: "Outdoor Run",       query: "outdoor running outfit women",          image: img("1648671095177-d00c1f6264e9"), category: "fitness", subcategory: "outdoor-run" },
  ],
  cosplay: [
    { id: "f-cos-01", label: "Moon Guardian",     query: "moon guardian cosplay woman",           image: img("1542596594-649edbc13630"), category: "cosplay", subcategory: "magical-moon-guardian" },
    { id: "f-cos-02", label: "Magical Girl",      query: "magical girl cosplay woman",            image: img("1607604276583-eef5d076aa5f"), category: "cosplay", subcategory: "magical-girl-wand" },
    { id: "f-cos-03", label: "Ice Queen",         query: "ice queen cosplay woman",               image: img("1666073090334-f2a9c8a86d14"), category: "cosplay", subcategory: "ice-queen" },
    { id: "f-cos-04", label: "Amazonian Warrior", query: "amazon warrior cosplay woman",          image: img("1601933973783-43cf8a7d4c5f"), category: "cosplay", subcategory: "amazonian-warrior" },
    { id: "f-cos-05", label: "Witch Sorceress",   query: "witch cosplay woman",                   image: img("1595051780009-1a8f6f4fac9e"), category: "cosplay", subcategory: "witch-sorceress" },
    { id: "f-cos-06", label: "Vampire Noble",     query: "vampire cosplay woman",                 image: img("1688633201440-73f30feb06ba"), category: "cosplay", subcategory: "vampire-noble" },
    { id: "f-cos-07", label: "Anime Schoolgirl",  query: "anime schoolgirl cosplay",              image: img("1601599009979-f85c21cbd703"), category: "cosplay", subcategory: "anime-schoolgirl" },
    { id: "f-cos-08", label: "Cyber Punk",        query: "cyberpunk cosplay woman",               image: img("1705486525499-1aaa9388de94"), category: "cosplay", subcategory: "cyber-punk" },
    { id: "f-cos-09", label: "Fairy Princess",    query: "fairy princess cosplay woman",          image: img("1628619447698-d17aa1899220"), category: "cosplay", subcategory: "fairy-princess" },
    { id: "f-cos-10", label: "Steampunk",         query: "steampunk cosplay woman",               image: img("1563827517575-7d43935ca7f6"), category: "cosplay", subcategory: "steampunk" },
    { id: "f-cos-11", label: "Galaxy Heroine",    query: "space heroine cosplay woman",           image: img("1631652367427-726f96b37cf1"), category: "cosplay", subcategory: "galaxy-heroine" },
    { id: "f-cos-12", label: "Underwater Princess",query: "mermaid princess cosplay woman",       image: img("1570751057249-92751f496ee3"), category: "cosplay", subcategory: "underwater-princess" },
  ],
};

const MALE: Record<OccasionId, Vibe[]> = {
  casual: [
    { id: "m-cas-01", label: "Jeans and Tee",    query: "men jeans t-shirt casual outfit",       image: img("1506794778202-cad84cf45f1d"), category: "casual", subcategory: "tee-and-jeans" },
    { id: "m-cas-02", label: "Casual Button Up", query: "men casual button up shirt outfit",     image: img("1507003211169-0a1dd7228f2d"), category: "casual", subcategory: "casual-button-up" },
    { id: "m-cas-03", label: "Athleisure",       query: "men athleisure outfit",                 image: img("1517836357463-d25dfeac3438"), category: "athleisure", subcategory: "training-fit" },
    { id: "m-cas-04", label: "Cargo Pants",      query: "men cargo pants outfit",                image: img("1549298916-b41d501d3772"), category: "casual", subcategory: "cargo-pants-m" },
    { id: "m-cas-05", label: "Oversized Fit",    query: "men oversized clothing outfit",         image: img("1546572797-e8c933a75a1f"), category: "casual", subcategory: "oversized-fit-m" },
    { id: "m-cas-06", label: "Hoodie Fit",       query: "men hoodie outfit",                     image: img("1519085360753-af0119f7cbe7"), category: "casual", subcategory: "hoodie-fit" },
    { id: "m-cas-07", label: "Shorts Fit",       query: "men shorts summer outfit",              image: img("1542326529804-0cd9d861ebaa"), category: "casual", subcategory: "shorts-fit" },
    { id: "m-cas-08", label: "Linen Set",        query: "men linen matching set outfit",         image: img("1488161628813-04466f872be2"), category: "casual", subcategory: "linen-set-m" },
    { id: "m-cas-09", label: "Graphic Tee",      query: "men graphic t-shirt outfit",            image: img("1493106819501-66d381c466f1"), category: "casual", subcategory: "graphic-tee-m" },
    { id: "m-cas-10", label: "Denim Jacket",     query: "men denim jacket outfit",               image: img("1492447166138-50c3889fccb1"), category: "casual", subcategory: "denim-jacket" },
    { id: "m-cas-11", label: "Jogger Fit",       query: "men joggers outfit",                    image: img("1574680096145-d05b474e2155"), category: "casual", subcategory: "joggers-fit" },
    { id: "m-cas-12", label: "Polo Fit",         query: "men polo shirt outfit",                 image: img("1564564321837-a57b7070ac4f"), category: "casual", subcategory: "polo-fit" },
  ],
  glam: [
    { id: "m-glm-01", label: "Sharp Blazer",     query: "men sharp blazer outfit night",         image: img("1552324864-5f7f0dec9b3d"), category: "full-style", subcategory: "sharp-blazer" },
    { id: "m-glm-02", label: "All Black",        query: "men all black outfit",                  image: img("1483721310020-03333e577078"), category: "edgy", subcategory: "all-black-night-m" },
    { id: "m-glm-03", label: "Dress Shirt",      query: "men dress shirt outfit",                image: img("1493106819501-66d381c466f1"), category: "full-style", subcategory: "dress-shirt-m" },
    { id: "m-glm-04", label: "Turtleneck",       query: "men turtleneck outfit",                 image: img("1495707902641-75cac588d2e9"), category: "full-style", subcategory: "turtleneck-m" },
    { id: "m-glm-05", label: "Printed Shirt",    query: "men printed shirt outfit",              image: img("1547949003-9792a18a2601"), category: "full-style", subcategory: "printed-shirt" },
    { id: "m-glm-06", label: "Smart Casual",     query: "men smart casual outfit",               image: img("1532009877282-3340270e0529"), category: "full-style", subcategory: "smart-casual-glm" },
    { id: "m-glm-07", label: "Suit Up",          query: "men full suit outfit",                  image: img("1768935706759-f2be765b3aec"), category: "formal", subcategory: "suit-up" },
    { id: "m-glm-08", label: "Leather Jacket",   query: "men leather jacket outfit night",       image: img("1614483573119-1e3b2be05565"), category: "edgy", subcategory: "leather-jacket-night" },
    { id: "m-glm-09", label: "Statement Chain",  query: "men chain necklace outfit",             image: img("1754577060078-21315dd188c8"), category: "icon-looks", subcategory: "statement-chain" },
    { id: "m-glm-10", label: "Monochrome",       query: "men monochrome outfit",                 image: img("1495707902641-75cac588d2e9"), category: "full-style", subcategory: "monochrome-set" },
    { id: "m-glm-11", label: "Tailored Pants",   query: "men tailored dress pants outfit",       image: img("1763906802570-be2a2609757f"), category: "full-style", subcategory: "tailored-pants-m" },
    { id: "m-glm-12", label: "Velvet Look",      query: "men velvet blazer outfit",              image: img("1768935706759-f2be765b3aec"), category: "full-style", subcategory: "velvet-look" },
  ],
  formal: [
    { id: "m-fml-01", label: "Full Suit",        query: "men full suit business",                image: img("1552058544-f2b08422138a"), category: "formal", subcategory: "full-suit" },
    { id: "m-fml-02", label: "Business Casual",  query: "men business casual outfit",            image: img("1518310383802-640c2de311b6"), category: "formal", subcategory: "business-casual" },
    { id: "m-fml-03", label: "Dress Shirt Tie",  query: "men dress shirt and tie",               image: img("1571019613454-1cb2f99b2d8b"), category: "formal", subcategory: "shirt-tie" },
    { id: "m-fml-04", label: "Blazer Chinos",    query: "men blazer and chinos outfit",          image: img("1532009877282-3340270e0529"), category: "formal", subcategory: "blazer-chinos" },
    { id: "m-fml-05", label: "Turtleneck Suit",  query: "men turtleneck and suit pants",         image: img("1539109136881-3be0616acf4b"), category: "formal", subcategory: "turtleneck-suit" },
    { id: "m-fml-06", label: "Monochrome Suit",  query: "men monochrome suit",                   image: img("1500648767791-00dcc994a43e"), category: "formal", subcategory: "monochrome-suit" },
    { id: "m-fml-07", label: "Bold Suit",        query: "men bold colored suit",                 image: img("1571019614242-c5c5dee9f50b"), category: "formal", subcategory: "bold-suit" },
    { id: "m-fml-08", label: "Classic Navy",     query: "men navy suit business",                image: img("1583500178690-f7fd39c44a66"), category: "formal", subcategory: "classic-navy" },
    { id: "m-fml-09", label: "Pocket Square",    query: "men suit pocket square detail",         image: img("1542291026-7eec264c27ff"), category: "formal", subcategory: "pocket-square" },
    { id: "m-fml-10", label: "Three Piece",      query: "men three piece suit vest",             image: img("1543163521-1bf539c55dd2"), category: "formal", subcategory: "three-piece" },
    { id: "m-fml-11", label: "Slim Fit Suit",    query: "men slim fit suit",                     image: img("1567013127542-490d757e51fc"), category: "formal", subcategory: "slim-fit-suit" },
    { id: "m-fml-12", label: "Smart Casual",     query: "men smart casual office outfit",        image: img("1595950653106-6c9ebd614d3a"), category: "formal", subcategory: "smart-casual-fml" },
  ],
  streetwear: [
    { id: "m-str-01", label: "Oversized Hoodie", query: "men oversized hoodie streetwear",       image: img("1599058917212-d750089bc07e"), category: "streetwear", subcategory: "oversized-hoodie-m" },
    { id: "m-str-02", label: "Cargo Fit",        query: "men cargo pants streetwear",            image: img("1549298916-b41d501d3772"), category: "streetwear", subcategory: "cargo-fit" },
    { id: "m-str-03", label: "Sneaker Fit",      query: "men sneaker outfit streetwear",         image: img("1551107696-a4b0c5a0d9a2"), category: "streetwear", subcategory: "sneaker-fit-m" },
    { id: "m-str-04", label: "Track Suit",       query: "men track suit",                        image: img("1581009146145-b5ef050c2e1e"), category: "streetwear", subcategory: "track-suit-m" },
    { id: "m-str-05", label: "Graphic Tee",      query: "men graphic tee streetwear",            image: img("1606107557195-0e29a4b5b4aa"), category: "streetwear", subcategory: "graphic-tee-str-m" },
    { id: "m-str-06", label: "Baggy Jeans",      query: "men baggy jeans streetwear",            image: img("1600185365778-7886d2c3a76e"), category: "streetwear", subcategory: "baggy-jeans-m" },
    { id: "m-str-07", label: "Bomber Jacket",    query: "men bomber jacket streetwear",          image: img("1525966222134-fcfa99b8ae77"), category: "streetwear", subcategory: "bomber-jacket-m" },
    { id: "m-str-08", label: "Vintage Fit",      query: "men vintage streetwear outfit",         image: img("1686350751255-20a12bbe4880"), category: "vintage", subcategory: "vintage-fit-m" },
    { id: "m-str-09", label: "Layered Look",     query: "men layered streetwear outfit",         image: img("1686350751264-1d3f6e41a6e6"), category: "streetwear", subcategory: "layered-look-m" },
    { id: "m-str-10", label: "Fitted Cap Fit",   query: "men fitted cap streetwear outfit",      image: img("1721152839659-dabbacabd5d6"), category: "streetwear", subcategory: "fitted-cap" },
    { id: "m-str-11", label: "Jogger Fit",       query: "men joggers streetwear",                image: img("1770576934845-759db89fcd3f"), category: "streetwear", subcategory: "jogger-streetwear-m" },
    { id: "m-str-12", label: "Denim Jacket",     query: "men denim jacket streetwear",           image: img("1770821214788-6605c5c3075b"), category: "streetwear", subcategory: "denim-jacket-str-m" },
  ],
  "date-night": [
    { id: "m-dat-01", label: "Smart Casual",     query: "men smart casual date outfit",          image: img("1761498443962-1f00eed12137"), category: "date-night", subcategory: "smart-casual-dat" },
    { id: "m-dat-02", label: "Blazer Fit",       query: "men blazer outfit night",               image: img("1630084775816-7abb7383ded5"), category: "date-night", subcategory: "blazer-fit" },
    { id: "m-dat-03", label: "All Black",        query: "men all black date outfit",             image: img("1522337360788-8b13dee7a37e"), category: "date-night", subcategory: "all-black-dat" },
    { id: "m-dat-04", label: "Turtleneck",       query: "men turtleneck date outfit",            image: img("1492562080023-ab3db95bfbce"), category: "date-night", subcategory: "turtleneck-style" },
    { id: "m-dat-05", label: "Dress Shirt",      query: "men dress shirt outfit casual",         image: img("1521369909029-2afed882baee"), category: "date-night", subcategory: "dress-shirt-dat" },
    { id: "m-dat-06", label: "Leather Jacket",   query: "men leather jacket outfit",             image: img("1542838132-92c53300491e"), category: "date-night", subcategory: "leather-clean" },
    { id: "m-dat-07", label: "Fitted Jeans",     query: "men slim fitted jeans outfit",          image: img("1686350751240-348d2ca05025"), category: "date-night", subcategory: "fitted-jeans" },
    { id: "m-dat-08", label: "Casual Chic",      query: "men casual chic outfit",                image: img("1502720433255-614171a1835e"), category: "date-night", subcategory: "casual-chic" },
    { id: "m-dat-09", label: "Monochrome",       query: "men monochrome outfit date",            image: img("1530268729831-4b0b9e170218"), category: "date-night", subcategory: "monochrome-dat" },
    { id: "m-dat-10", label: "Printed Shirt",    query: "men printed shirt outfit",              image: img("1532910404247-7ee9488d7292"), category: "date-night", subcategory: "printed-shirt-dat" },
    { id: "m-dat-11", label: "Linen Fit",        query: "men linen outfit summer",               image: img("1591561954557-26941169b49e"), category: "date-night", subcategory: "linen-fit" },
    { id: "m-dat-12", label: "Statement Piece",  query: "men statement watch jewelry outfit",    image: img("1584917865442-de89df76afd3"), category: "date-night", subcategory: "statement-piece" },
  ],
  vacation: [
    { id: "m-vac-01", label: "Linen Shirt",      query: "men linen shirt vacation",              image: img("1531123897727-8f129e1688ce"), category: "resort", subcategory: "linen-shirt" },
    { id: "m-vac-02", label: "Resort Shorts",    query: "men resort shorts vacation",            image: img("1593032465175-481ac7f401a0"), category: "resort", subcategory: "resort-shorts" },
    { id: "m-vac-03", label: "Swim Trunks",      query: "men swim trunks beach",                 image: img("1583089892943-e02e5b017b6a"), category: "resort", subcategory: "swim-trunks" },
    { id: "m-vac-04", label: "Vacation Fit",     query: "men vacation outfit summer",            image: img("1604004215695-c54b6f3df1e7"), category: "resort", subcategory: "vacation-fit" },
    { id: "m-vac-05", label: "Tropical Print",   query: "men tropical print shirt",              image: img("1555529669-e69e7aa0ba9a"), category: "resort", subcategory: "tropical-print" },
    { id: "m-vac-06", label: "Casual Linen",     query: "men casual linen vacation outfit",      image: img("1542295669297-4d352b042bca"), category: "resort", subcategory: "casual-linen" },
    { id: "m-vac-07", label: "Beach Look",       query: "men beach outfit",                      image: img("1500648767791-00dcc994a43e"), category: "resort", subcategory: "beach-look-m" },
    { id: "m-vac-08", label: "Resort Casual",    query: "men resort casual outfit",              image: img("1507591064344-4c6ce005b128"), category: "resort", subcategory: "resort-casual" },
    { id: "m-vac-09", label: "Straw Hat Look",   query: "men straw hat vacation outfit",         image: img("1607604276583-eef5d076aa5f"), category: "resort", subcategory: "straw-hat-m" },
    { id: "m-vac-10", label: "Linen Set",        query: "men linen matching set vacation",       image: img("1495707902641-75cac588d2e9"), category: "resort", subcategory: "linen-set" },
    { id: "m-vac-11", label: "Vacation Chic",    query: "men chic vacation outfit",              image: img("1612036782180-6f0b6cd846fe"), category: "resort", subcategory: "vacation-chic" },
    { id: "m-vac-12", label: "City Travel",      query: "men city travel airport outfit",        image: img("1605125571577-fdd0c52d5fef"), category: "resort", subcategory: "city-travel-m" },
  ],
  swimwear: [
    { id: "m-swm-01", label: "Classic Trunks",   query: "men classic swim trunks beach",         image: img("1583089892943-e02e5b017b6a"), category: "swimwear", subcategory: "swim-shorts" },
    { id: "m-swm-02", label: "Board Shorts",     query: "men board shorts beach surf",           image: img("1605296867424-35fc25c9212a"), category: "swimwear", subcategory: "board-shorts" },
    { id: "m-swm-03", label: "Tailored Swim",    query: "men tailored swim shorts",              image: img("1567013127542-490d757e51fc"), category: "swimwear", subcategory: "tailored-swim" },
    { id: "m-swm-04", label: "Tropical Trunks",  query: "men tropical print swim trunks",        image: img("1532009877282-3340270e0529"), category: "swimwear", subcategory: "tropical-trunks" },
    { id: "m-swm-05", label: "Linen Shirt Combo",query: "men linen shirt swim trunks beach",     image: img("1583500178690-f7fd39c44a66"), category: "swimwear", subcategory: "swim-linen-combo" },
    { id: "m-swm-06", label: "Speedo Brief",     query: "men swim brief speedo",                 image: img("1571019614242-c5c5dee9f50b"), category: "swimwear", subcategory: "speedo-brief" },
    { id: "m-swm-07", label: "Beach Volley",     query: "men beach volleyball outfit",           image: img("1500648767791-00dcc994a43e"), category: "swimwear", subcategory: "beach-volley" },
    { id: "m-swm-08", label: "Surf Fit",         query: "men surf wetsuit beach",                image: img("1495707902641-75cac588d2e9"), category: "swimwear", subcategory: "surf-fit" },
    { id: "m-swm-09", label: "Pool Lounger",     query: "men lounging pool swim trunks",         image: img("1493666438817-866a91353ca9"), category: "swimwear", subcategory: "pool-lounger" },
    { id: "m-swm-10", label: "Retro Trunks",     query: "men retro vintage swim trunks",         image: img("1547949003-9792a18a2601"), category: "swimwear", subcategory: "retro-trunks" },
    { id: "m-swm-11", label: "Athletic Swim",    query: "men athletic swim shorts",              image: img("1521119989659-a83eee488004"), category: "swimwear", subcategory: "athletic-swim" },
    { id: "m-swm-12", label: "Vacay Trunks",     query: "men vacation swim trunks pool",         image: img("1593032465175-481ac7f401a0"), category: "swimwear", subcategory: "vacay-trunks" },
  ],
  fitness: [
    { id: "m-fit-01", label: "Nike 2-Piece",     query: "men nike two piece athletic outfit",    image: img("1551836022-deb4988cc6c0"), category: "fitness", subcategory: "nike-2piece-men" },
    { id: "m-fit-02", label: "Lifting Fit",      query: "men weightlifting gym outfit",          image: img("1502323777036-f29e3972d82f"), category: "fitness", subcategory: "gym-lifting" },
    { id: "m-fit-03", label: "Running",          query: "men running outfit",                    image: img("1572635196237-14b3f281503f"), category: "fitness", subcategory: "running-kit" },
    { id: "m-fit-04", label: "CrossFit",         query: "men crossfit gym outfit",               image: img("1573408301185-9146fe634ad0"), category: "fitness", subcategory: "crossfit-fit" },
    { id: "m-fit-05", label: "Boxing / MMA",     query: "men boxing mma outfit",                 image: img("1535632787350-4e68ef0ac584"), category: "fitness", subcategory: "boxing-mma" },
    { id: "m-fit-06", label: "Hiking",           query: "men hiking outfit outdoor",             image: img("1574258495973-f010dfbb5371"), category: "fitness", subcategory: "outdoor-hiking" },
    { id: "m-fit-07", label: "Basketball",       query: "men basketball outfit",                 image: img("1577803645773-f96470509666"), category: "fitness", subcategory: "basketball" },
    { id: "m-fit-08", label: "Soccer Kit",       query: "men soccer kit outfit",                 image: img("1502767089025-6748d4ef9f24"), category: "fitness", subcategory: "soccer-kit" },
    { id: "m-fit-09", label: "Tennis",           query: "men tennis outfit",                     image: img("1556306535-0f09a537f0a3"), category: "fitness", subcategory: "tennis-m" },
    { id: "m-fit-10", label: "Cycling",          query: "men cycling outfit",                    image: img("1511499767150-a48a237f0083"), category: "fitness", subcategory: "cycling-kit" },
    { id: "m-fit-11", label: "Yoga Flow",        query: "men yoga outfit",                       image: img("1512310604669-443f26c35f52"), category: "fitness", subcategory: "yoga-flow-m" },
    { id: "m-fit-12", label: "Trail Run",        query: "men trail running outfit",              image: img("1503236823255-94609f598e71"), category: "fitness", subcategory: "trail-run" },
  ],
  cosplay: [
    { id: "m-cos-01", label: "Saiyan Warrior",   query: "saiyan warrior cosplay man",            image: img("1641427493563-5cc9cf1a9950"), category: "cosplay", subcategory: "saiyan-warrior" },
    { id: "m-cos-02", label: "Ninja Shinobi",    query: "ninja shinobi cosplay man",             image: img("1634826260499-7d97a6049913"), category: "cosplay", subcategory: "ninja-shinobi" },
    { id: "m-cos-03", label: "Demon Slayer",     query: "demon slayer cosplay man",              image: img("1711925844152-8c9d51163ba2"), category: "cosplay", subcategory: "demon-slayer-warrior" },
    { id: "m-cos-04", label: "Hylian Hero",      query: "elf warrior cosplay man",               image: img("1620063633168-8ec1bcc1bcec"), category: "cosplay", subcategory: "hylian-hero" },
    { id: "m-cos-05", label: "Web Slinger",      query: "spider hero cosplay man",               image: img("1622495966321-49b35b3a8d4f"), category: "cosplay", subcategory: "web-slinger" },
    { id: "m-cos-06", label: "Dark Vigilante",   query: "dark knight cosplay man",               image: img("1602910344008-22f323cc1817"), category: "cosplay", subcategory: "dark-knight-vigilante" },
    { id: "m-cos-07", label: "Space Marine",     query: "space marine cosplay man",              image: img("1517438476312-10d79c5f25e3"), category: "cosplay", subcategory: "space-marine" },
    { id: "m-cos-08", label: "Pirate Captain",   query: "pirate captain cosplay man",            image: img("1571908599407-cdb918ed83bf"), category: "cosplay", subcategory: "pirate-captain" },
    { id: "m-cos-09", label: "Wizard Mage",      query: "wizard mage cosplay man",               image: img("1632481151312-4b4f3306e7e6"), category: "cosplay", subcategory: "wizard-mage" },
    { id: "m-cos-10", label: "Cyber Soldier",    query: "cyberpunk soldier cosplay man",         image: img("1629019279055-d2a8c0c50bb3"), category: "cosplay", subcategory: "cyber-soldier" },
    { id: "m-cos-11", label: "Vampire Lord",     query: "vampire cosplay man",                   image: img("1605497788044-5a32c7078486"), category: "cosplay", subcategory: "vampire-lord" },
    { id: "m-cos-12", label: "Samurai",          query: "samurai cosplay man",                   image: img("1617922001439-4a2e6562f328"), category: "cosplay", subcategory: "samurai" },
  ],
};

// ============================================================================
// EXTRA VIBE POOLS — additional sub-styles per occasion so users get an abundance
// of choices. Each visit randomly samples 12 vibes from base + extras combined,
// and "Show more" reshuffles to surface fresh ones.
// ============================================================================

const FEMALE_EXTRA: Partial<Record<OccasionId, Vibe[]>> = {
  swimwear: [
    { id: "f-swm-13", label: "Halter Bikini",     query: "halter bikini swimsuit",                image: img("1556306535-0f09a537f0a3"), category: "swimwear", subcategory: "halter-bikini" },
    { id: "f-swm-14", label: "Cheeky Bottoms",    query: "cheeky bikini bottoms beach",           image: img("1502767089025-6748d4ef9f24"), category: "swimwear", subcategory: "cheeky-bottoms" },
    { id: "f-swm-15", label: "Cut Out One-Piece", query: "cutout one piece swimsuit",             image: img("1611591437281-460bfbe1220a"), category: "swimwear", subcategory: "cutout-one-piece" },
    { id: "f-swm-16", label: "Neon Bikini",       query: "neon bright bikini swimsuit",           image: img("1620063633168-8ec1bcc1bcec"), category: "swimwear", subcategory: "neon-bikini" },
    { id: "f-swm-17", label: "Vintage Pinup",     query: "vintage pinup swimsuit retro",          image: img("1525026198548-4baa812f1183"), category: "swimwear", subcategory: "vintage-pinup-swim" },
    { id: "f-swm-18", label: "Body Chain Swim",   query: "swimsuit body chain jewelry",           image: img("1601412436009-d964bd02edbc"), category: "swimwear", subcategory: "body-chain-swim" },
    { id: "f-swm-19", label: "Boho Crochet",      query: "boho crochet bikini beach",             image: img("1581824283135-0666cf353f35"), category: "swimwear", subcategory: "boho-crochet" },
    { id: "f-swm-20", label: "Black Monokini",    query: "black monokini swimsuit",               image: img("1641427493563-5cc9cf1a9950"), category: "swimwear", subcategory: "black-monokini" },
    { id: "f-swm-21", label: "Ruffle Bikini",     query: "ruffle frill bikini",                   image: img("1605497788044-5a32c7078486"), category: "swimwear", subcategory: "ruffle-bikini" },
    { id: "f-swm-22", label: "Belted Swimsuit",   query: "belted swimsuit beach",                 image: img("1614593894937-8e84a52e5a2c"), category: "swimwear", subcategory: "belted-swim" },
    { id: "f-swm-23", label: "Tie-Dye Bikini",    query: "tie dye bikini swimsuit",               image: img("1606902965551-dce093cda6e7"), category: "swimwear", subcategory: "tie-dye-bikini" },
    { id: "f-swm-24", label: "Asymmetric Swim",   query: "asymmetric one shoulder swimsuit",      image: img("1539109136881-3be0616acf4b"), category: "swimwear", subcategory: "asymmetric-swim" },
  ],
  casual: [
    { id: "f-cas-13", label: "Mom Jeans",         query: "mom jeans outfit",                      image: img("1485231183945-fffde7cc051e"), category: "casual", subcategory: "mom-jeans" },
    { id: "f-cas-14", label: "Wide Leg Pants",    query: "wide leg pants outfit casual",          image: img("1542295669297-4d352b042bca"), category: "casual", subcategory: "wide-leg-pants" },
    { id: "f-cas-15", label: "Crop Top & Jeans",  query: "crop top jeans casual outfit",          image: img("1611042553365-9b101441c135"), category: "casual", subcategory: "crop-jeans" },
    { id: "f-cas-16", label: "Sweater Weather",   query: "oversized sweater outfit",              image: img("1490481651871-ab68de25d43d"), category: "casual", subcategory: "sweater-weather" },
    { id: "f-cas-17", label: "Skirt & Tee",       query: "midi skirt tshirt casual outfit",       image: img("1521223890158-f9f7c3d5d504"), category: "casual", subcategory: "skirt-tee" },
    { id: "f-cas-18", label: "Overalls",          query: "denim overalls outfit",                 image: img("1469334031218-e382a71b716b"), category: "casual", subcategory: "overalls" },
    { id: "f-cas-19", label: "Sweat Set",         query: "matching sweatsuit set outfit",         image: img("1517438476312-10d79c5f25e3"), category: "casual", subcategory: "sweat-set" },
    { id: "f-cas-20", label: "Flannel Layered",   query: "flannel shirt layered outfit",          image: img("1604004215695-c54b6f3df1e7"), category: "casual", subcategory: "flannel-layered" },
    { id: "f-cas-21", label: "Maxi Skirt",        query: "maxi skirt casual outfit",              image: img("1607746882042-944635dfe10e"), category: "casual", subcategory: "maxi-skirt-casual" },
    { id: "f-cas-22", label: "Vest Layered",      query: "vest layered outfit fall",              image: img("1485518882345-15568b007407"), category: "casual", subcategory: "vest-layered" },
    { id: "f-cas-23", label: "Cardigan Set",      query: "cardigan set outfit casual",            image: img("1591348278863-a8fb3887e2aa"), category: "casual", subcategory: "cardigan-set" },
    { id: "f-cas-24", label: "Slip Skirt Casual", query: "slip skirt casual everyday outfit",     image: img("1565325058695-f614c1580d7e"), category: "casual", subcategory: "slip-skirt-casual" },
  ],
  glam: [
    { id: "f-glm-13", label: "Velvet Gown",       query: "velvet gown elegant",                   image: img("1605100804763-247f67b3557e"), category: "full-style", subcategory: "velvet-gown" },
    { id: "f-glm-14", label: "Backless Dress",    query: "backless dress evening",                image: img("1620063633168-8ec1bcc1bcec"), category: "sexy", subcategory: "backless-dress" },
    { id: "f-glm-15", label: "Sheer Detail",      query: "sheer dress fashion outfit",            image: img("1622495966321-49b35b3a8d4f"), category: "sexy", subcategory: "sheer-detail" },
    { id: "f-glm-16", label: "Metallic Mini",     query: "metallic mini dress night",             image: img("1641427493563-5cc9cf1a9950"), category: "full-style", subcategory: "metallic-mini" },
    { id: "f-glm-17", label: "Asymmetric Hem",    query: "asymmetric hem dress outfit",           image: img("1539109136881-3be0616acf4b"), category: "full-style", subcategory: "asymmetric-hem" },
    { id: "f-glm-18", label: "Lace Bodysuit",     query: "lace bodysuit night out",               image: img("1601412436009-d964bd02edbc"), category: "sexy", subcategory: "lace-bodysuit" },
    { id: "f-glm-19", label: "Halter Gown",       query: "halter neck evening gown",              image: img("1599643478518-a784e5dc4c8f"), category: "full-style", subcategory: "halter-gown" },
    { id: "f-glm-20", label: "Plunge Neckline",   query: "plunging neckline dress glam",          image: img("1571513722275-4b41940f54b8"), category: "sexy", subcategory: "plunge-neckline" },
    { id: "f-glm-21", label: "Strapless Mini",    query: "strapless mini dress night",            image: img("1525026198548-4baa812f1183"), category: "full-style", subcategory: "strapless-mini" },
    { id: "f-glm-22", label: "Ruched Dress",      query: "ruched bodycon dress",                  image: img("1634826260499-7d97a6049913"), category: "sexy", subcategory: "ruched-dress" },
    { id: "f-glm-23", label: "Crystal Embellish", query: "crystal embellished dress glam",        image: img("1502323777036-f29e3972d82f"), category: "full-style", subcategory: "crystal-embellish" },
    { id: "f-glm-24", label: "Mesh Long Sleeve",  query: "mesh long sleeve dress glam",           image: img("1614593894937-8e84a52e5a2c"), category: "full-style", subcategory: "mesh-long-sleeve" },
  ],
  formal: [
    { id: "f-fml-13", label: "Pant Suit",         query: "women pant suit professional",          image: img("1487412720507-e7ab37603c6f"), category: "formal", subcategory: "pant-suit" },
    { id: "f-fml-14", label: "Sheath Dress",      query: "sheath dress office",                   image: img("1495365200479-c4ed1d35e1aa"), category: "formal", subcategory: "sheath-dress" },
    { id: "f-fml-15", label: "Pussybow Blouse",   query: "pussybow blouse office outfit",         image: img("1591348122449-02525d70379b"), category: "formal", subcategory: "pussybow-blouse" },
    { id: "f-fml-16", label: "Cape Blazer",       query: "cape blazer professional",              image: img("1581044777550-4cfa60707c03"), category: "formal", subcategory: "cape-blazer" },
    { id: "f-fml-17", label: "A-Line Skirt",      query: "a line skirt office outfit",            image: img("1485178575877-1a13bf489dfe"), category: "formal", subcategory: "a-line-skirt" },
    { id: "f-fml-18", label: "Knit Set Workwear", query: "knit set workwear",                     image: img("1601049541289-9b1b7bbbfe19"), category: "formal", subcategory: "knit-set-work" },
    { id: "f-fml-19", label: "Pleated Trousers",  query: "pleated trousers women office",         image: img("1531123414780-f74242c2b052"), category: "formal", subcategory: "pleated-trousers" },
    { id: "f-fml-20", label: "Belted Coat",       query: "belted coat outfit professional",       image: img("1571945153237-4929e783af4a"), category: "formal", subcategory: "belted-coat" },
  ],
  streetwear: [
    { id: "f-str-13", label: "Puffer Coat",       query: "puffer coat streetwear women",          image: img("1571908599407-cdb918ed83bf"), category: "streetwear", subcategory: "puffer-coat" },
    { id: "f-str-14", label: "Skater Skirt",      query: "skater skirt streetwear outfit",        image: img("1503236823255-94609f598e71"), category: "streetwear", subcategory: "skater-skirt" },
    { id: "f-str-15", label: "Y2K Streetwear",    query: "y2k streetwear outfit",                 image: img("1583900985737-6d0495555783"), category: "y2k", subcategory: "y2k-street" },
    { id: "f-str-16", label: "Mesh Top Layered",  query: "mesh top streetwear layered",           image: img("1492106087820-71f1a00d2b11"), category: "streetwear", subcategory: "mesh-layered" },
    { id: "f-str-17", label: "Wide Leg Cargo",    query: "wide leg cargo streetwear",             image: img("1602910344008-22f323cc1817"), category: "streetwear", subcategory: "wide-cargo" },
    { id: "f-str-18", label: "Crop Hoodie Set",   query: "crop hoodie streetwear set",            image: img("1517438476312-10d79c5f25e3"), category: "streetwear", subcategory: "crop-hoodie-set" },
    { id: "f-str-19", label: "Varsity Jacket",    query: "varsity jacket streetwear women",       image: img("1531746020798-e6953c6e8e04"), category: "streetwear", subcategory: "varsity-jacket" },
    { id: "f-str-20", label: "Combat Boots Fit",  query: "combat boots streetwear outfit women",  image: img("1581338834647-b0fb40704e21"), category: "streetwear", subcategory: "combat-boots-fit" },
  ],
  "date-night": [
    { id: "f-dat-13", label: "Mini Slip Dress",   query: "mini slip dress date night",            image: img("1567784177951-6fa58317e16b"), category: "date-night", subcategory: "mini-slip" },
    { id: "f-dat-14", label: "Corset Top Look",   query: "corset top date outfit",                image: img("1622495966321-49b35b3a8d4f"), category: "date-night", subcategory: "corset-date" },
    { id: "f-dat-15", label: "Velvet Mini",       query: "velvet mini dress date",                image: img("1597223557154-721c1cecc4b0"), category: "date-night", subcategory: "velvet-mini" },
    { id: "f-dat-16", label: "Romantic Skirt",    query: "romantic midi skirt date outfit",       image: img("1535632787350-4e68ef0ac584"), category: "date-night", subcategory: "romantic-skirt" },
    { id: "f-dat-17", label: "Mesh Sleeve Dress", query: "mesh sleeve mini dress date",           image: img("1605497788044-5a32c7078486"), category: "date-night", subcategory: "mesh-sleeve-date" },
    { id: "f-dat-18", label: "Cowl Neck Dress",   query: "cowl neck satin dress date",            image: img("1592621385612-4d7129426394"), category: "date-night", subcategory: "cowl-neck" },
    { id: "f-dat-19", label: "Halter Mini",       query: "halter mini dress date night",          image: img("1581574919402-5b7d733224d6"), category: "date-night", subcategory: "halter-mini-date" },
    { id: "f-dat-20", label: "Romantic Blouse",   query: "romantic ruffle blouse date outfit",    image: img("1629019279055-d2a8c0c50bb3"), category: "date-night", subcategory: "romantic-blouse" },
  ],
  vacation: [
    { id: "f-vac-13", label: "Crochet Set",       query: "crochet vacation set outfit",           image: img("1581824283135-0666cf353f35"), category: "resort", subcategory: "crochet-set" },
    { id: "f-vac-14", label: "Kaftan",            query: "kaftan beach cover up",                 image: img("1606902965551-dce093cda6e7"), category: "resort", subcategory: "kaftan" },
    { id: "f-vac-15", label: "Cutout Maxi",       query: "cutout maxi dress vacation",            image: img("1610276198568-eb6d0ff53e48"), category: "resort", subcategory: "cutout-maxi" },
    { id: "f-vac-16", label: "Wrap Skirt Set",    query: "wrap skirt vacation outfit",            image: img("1494578379344-d6c710782a3d"), category: "resort", subcategory: "wrap-skirt-set" },
    { id: "f-vac-17", label: "Beach Crochet",     query: "crochet beach outfit dress",            image: img("1521223890158-f9f7c3d5d504"), category: "resort", subcategory: "beach-crochet" },
    { id: "f-vac-18", label: "Tropical Maxi",     query: "tropical maxi dress vacation",          image: img("1488426862026-3ee34a7d66df"), category: "resort", subcategory: "tropical-maxi" },
    { id: "f-vac-19", label: "Resort Set",        query: "resort matching set outfit",            image: img("1617922001439-4a2e6562f328"), category: "resort", subcategory: "resort-matching-set" },
    { id: "f-vac-20", label: "Beach Romper",      query: "beach romper vacation outfit",          image: img("1574258495973-f010dfbb5371"), category: "resort", subcategory: "beach-romper" },
  ],
  fitness: [
    { id: "f-fit-13", label: "Crop Tank Set",     query: "crop tank legging set women gym",       image: img("1571019613454-1cb2f99b2d8b"), category: "fitness", subcategory: "crop-tank-set" },
    { id: "f-fit-14", label: "Bike Shorts Set",   query: "bike shorts matching set women",        image: img("1605125571577-fdd0c52d5fef"), category: "fitness", subcategory: "bike-shorts-set" },
    { id: "f-fit-15", label: "Hot Yoga",          query: "hot yoga outfit women",                 image: img("1599058917212-d750089bc07e"), category: "fitness", subcategory: "hot-yoga" },
    { id: "f-fit-16", label: "Dance Class",       query: "dance class outfit women",              image: img("1648671095177-d00c1f6264e9"), category: "fitness", subcategory: "dance-class" },
    { id: "f-fit-17", label: "Trail Hike",        query: "trail hiking outfit women",             image: img("1612036782180-6f0b6cd846fe"), category: "fitness", subcategory: "trail-hike-w" },
    { id: "f-fit-18", label: "Cardio Set",        query: "cardio gym outfit women",               image: img("1574680096145-d05b474e2155"), category: "fitness", subcategory: "cardio-set" },
    { id: "f-fit-19", label: "Outdoor Yoga",      query: "outdoor yoga outfit women",             image: img("1591726328133-b4e2b0031cb2"), category: "fitness", subcategory: "outdoor-yoga" },
    { id: "f-fit-20", label: "Color Block Set",   query: "color block athletic set women",        image: img("1517836357463-d25dfeac3438"), category: "fitness", subcategory: "color-block-set" },
  ],
  cosplay: [
    { id: "f-cos-13", label: "Demon Huntress",    query: "demon huntress cosplay woman",          image: img("1601933973783-43cf8a7d4c5f"), category: "cosplay", subcategory: "demon-huntress" },
    { id: "f-cos-14", label: "Forest Elf",        query: "elf cosplay woman forest",              image: img("1607604276583-eef5d076aa5f"), category: "cosplay", subcategory: "forest-elf" },
    { id: "f-cos-15", label: "Pirate Captain F",  query: "pirate captain cosplay woman",          image: img("1542596594-649edbc13630"), category: "cosplay", subcategory: "pirate-captain-f" },
    { id: "f-cos-16", label: "Cat Hero",          query: "cat hero cosplay woman",                image: img("1666073090334-f2a9c8a86d14"), category: "cosplay", subcategory: "cat-hero" },
    { id: "f-cos-17", label: "Royal Princess",    query: "royal princess cosplay woman",          image: img("1628619447698-d17aa1899220"), category: "cosplay", subcategory: "royal-princess" },
    { id: "f-cos-18", label: "Battle Goddess",    query: "battle goddess cosplay woman",          image: img("1631652367427-726f96b37cf1"), category: "cosplay", subcategory: "battle-goddess" },
    { id: "f-cos-19", label: "Phantom Thief",     query: "phantom thief cosplay woman",           image: img("1688633201440-73f30feb06ba"), category: "cosplay", subcategory: "phantom-thief" },
    { id: "f-cos-20", label: "Star Princess",     query: "star princess cosplay woman",           image: img("1570751057249-92751f496ee3"), category: "cosplay", subcategory: "star-princess" },
  ],
};

const MALE_EXTRA: Partial<Record<OccasionId, Vibe[]>> = {
  swimwear: [
    { id: "m-swm-13", label: "Color Block Trunk", query: "men color block swim trunks",           image: img("1605296867424-35fc25c9212a"), category: "swimwear", subcategory: "color-block-trunk" },
    { id: "m-swm-14", label: "Floral Trunks",     query: "men floral swim trunks",                image: img("1583089892943-e02e5b017b6a"), category: "swimwear", subcategory: "floral-trunks" },
    { id: "m-swm-15", label: "Striped Swim",      query: "men striped swim trunks beach",         image: img("1571019614242-c5c5dee9f50b"), category: "swimwear", subcategory: "striped-swim" },
    { id: "m-swm-16", label: "Resort Swim Set",   query: "men resort swim shirt trunks set",      image: img("1567013127542-490d757e51fc"), category: "swimwear", subcategory: "resort-swim-set" },
    { id: "m-swm-17", label: "Geo Print Swim",    query: "men geometric print swim trunks",       image: img("1532009877282-3340270e0529"), category: "swimwear", subcategory: "geo-print-swim" },
    { id: "m-swm-18", label: "Solid Black Trunk", query: "men solid black swim trunks",           image: img("1493666438817-866a91353ca9"), category: "swimwear", subcategory: "solid-black-trunk" },
    { id: "m-swm-19", label: "Pool Party",        query: "men pool party swim outfit",            image: img("1547949003-9792a18a2601"), category: "swimwear", subcategory: "pool-party-m" },
    { id: "m-swm-20", label: "Beach Bum Look",    query: "men beach bum casual swim",             image: img("1521119989659-a83eee488004"), category: "swimwear", subcategory: "beach-bum" },
  ],
  casual: [
    { id: "m-cas-13", label: "Crewneck Sweater",  query: "men crewneck sweater outfit",           image: img("1506794778202-cad84cf45f1d"), category: "casual", subcategory: "crewneck-sweater" },
    { id: "m-cas-14", label: "Henley Fit",        query: "men henley shirt outfit",               image: img("1507003211169-0a1dd7228f2d"), category: "casual", subcategory: "henley-fit" },
    { id: "m-cas-15", label: "Flannel Layered",   query: "men flannel layered outfit",            image: img("1542326529804-0cd9d861ebaa"), category: "casual", subcategory: "flannel-layered-m" },
    { id: "m-cas-16", label: "Cardigan Layer",    query: "men cardigan layered outfit",           image: img("1488161628813-04466f872be2"), category: "casual", subcategory: "cardigan-layer-m" },
    { id: "m-cas-17", label: "Vest & Tee",        query: "men vest layered tee outfit",           image: img("1493106819501-66d381c466f1"), category: "casual", subcategory: "vest-tee-m" },
    { id: "m-cas-18", label: "Slim Chinos",       query: "men slim chinos casual outfit",         image: img("1492447166138-50c3889fccb1"), category: "casual", subcategory: "slim-chinos" },
    { id: "m-cas-19", label: "Crewneck & Jeans",  query: "men crewneck jeans casual",             image: img("1519085360753-af0119f7cbe7"), category: "casual", subcategory: "crewneck-jeans" },
    { id: "m-cas-20", label: "Camp Collar Shirt", query: "men camp collar shirt outfit",          image: img("1564564321837-a57b7070ac4f"), category: "casual", subcategory: "camp-collar" },
  ],
  glam: [
    { id: "m-glm-13", label: "Silk Shirt",        query: "men silk shirt evening outfit",         image: img("1547949003-9792a18a2601"), category: "full-style", subcategory: "silk-shirt-m" },
    { id: "m-glm-14", label: "Double Breasted",   query: "men double breasted blazer",            image: img("1552324864-5f7f0dec9b3d"), category: "formal", subcategory: "double-breasted-m" },
    { id: "m-glm-15", label: "Velvet Blazer",     query: "men velvet blazer night",               image: img("1768935706759-f2be765b3aec"), category: "full-style", subcategory: "velvet-blazer-m" },
    { id: "m-glm-16", label: "Bomber Glam",       query: "men bomber jacket dressy outfit",       image: img("1614483573119-1e3b2be05565"), category: "edgy", subcategory: "bomber-glam-m" },
    { id: "m-glm-17", label: "Slim Tux Look",     query: "men slim tuxedo modern outfit",         image: img("1500648767791-00dcc994a43e"), category: "formal", subcategory: "slim-tux-m" },
    { id: "m-glm-18", label: "Statement Coat",    query: "men statement long coat outfit",        image: img("1495707902641-75cac588d2e9"), category: "edgy", subcategory: "statement-coat-m" },
    { id: "m-glm-19", label: "Embellished Shirt", query: "men embellished shirt night",           image: img("1763906802570-be2a2609757f"), category: "full-style", subcategory: "embellished-shirt-m" },
    { id: "m-glm-20", label: "Layered Chains",    query: "men layered chains outfit night",       image: img("1754577060078-21315dd188c8"), category: "icon-looks", subcategory: "layered-chains-m" },
  ],
  formal: [
    { id: "m-fml-13", label: "Pinstripe Suit",    query: "men pinstripe suit professional",       image: img("1543163521-1bf539c55dd2"), category: "formal", subcategory: "pinstripe-suit" },
    { id: "m-fml-14", label: "Charcoal Gray Suit",query: "men charcoal gray suit",                image: img("1567013127542-490d757e51fc"), category: "formal", subcategory: "charcoal-gray-suit" },
    { id: "m-fml-15", label: "Wedding Guest",     query: "men wedding guest outfit",              image: img("1500648767791-00dcc994a43e"), category: "formal", subcategory: "wedding-guest" },
    { id: "m-fml-16", label: "Bow Tie Black",     query: "men bow tie tuxedo",                    image: img("1571019614242-c5c5dee9f50b"), category: "formal", subcategory: "bow-tie-black" },
    { id: "m-fml-17", label: "Earth Tone Suit",   query: "men earth tone brown suit",             image: img("1532009877282-3340270e0529"), category: "formal", subcategory: "earth-tone-suit" },
    { id: "m-fml-18", label: "Linen Suit",        query: "men linen suit summer",                 image: img("1583500178690-f7fd39c44a66"), category: "formal", subcategory: "linen-suit-m" },
    { id: "m-fml-19", label: "Vest Layered Suit", query: "men three piece vest suit",             image: img("1542291026-7eec264c27ff"), category: "formal", subcategory: "vest-suit" },
    { id: "m-fml-20", label: "Modern Cropped",    query: "men cropped trouser suit modern",       image: img("1595950653106-6c9ebd614d3a"), category: "formal", subcategory: "modern-cropped-suit" },
  ],
  streetwear: [
    { id: "m-str-13", label: "Puffer Vest",       query: "men puffer vest streetwear",            image: img("1525966222134-fcfa99b8ae77"), category: "streetwear", subcategory: "puffer-vest-m" },
    { id: "m-str-14", label: "Skate Fit",         query: "men skate streetwear outfit",           image: img("1551107696-a4b0c5a0d9a2"), category: "streetwear", subcategory: "skate-fit" },
    { id: "m-str-15", label: "Tech Streetwear",   query: "men techwear streetwear outfit",        image: img("1686350751255-20a12bbe4880"), category: "techwear", subcategory: "tech-streetwear" },
    { id: "m-str-16", label: "Hype Sneakers",     query: "men hype sneakers streetwear",          image: img("1721152839659-dabbacabd5d6"), category: "streetwear", subcategory: "hype-sneakers" },
    { id: "m-str-17", label: "Distressed Denim",  query: "men distressed denim streetwear",       image: img("1770576934845-759db89fcd3f"), category: "streetwear", subcategory: "distressed-denim-m" },
    { id: "m-str-18", label: "Jersey Streetwear", query: "men sports jersey streetwear",          image: img("1606107557195-0e29a4b5b4aa"), category: "streetwear", subcategory: "jersey-street" },
    { id: "m-str-19", label: "Trench Coat",       query: "men trench coat streetwear",            image: img("1770821214788-6605c5c3075b"), category: "streetwear", subcategory: "trench-street" },
    { id: "m-str-20", label: "Quilted Jacket",    query: "men quilted jacket streetwear",         image: img("1599058917212-d750089bc07e"), category: "streetwear", subcategory: "quilted-jacket" },
  ],
  "date-night": [
    { id: "m-dat-13", label: "Polo & Chinos",     query: "men polo chinos date outfit",           image: img("1521369909029-2afed882baee"), category: "date-night", subcategory: "polo-chinos-date" },
    { id: "m-dat-14", label: "Cardigan Date",     query: "men cardigan date outfit",              image: img("1530268729831-4b0b9e170218"), category: "date-night", subcategory: "cardigan-date-m" },
    { id: "m-dat-15", label: "Bomber Date",       query: "men bomber jacket date outfit",         image: img("1492562080023-ab3db95bfbce"), category: "date-night", subcategory: "bomber-date" },
    { id: "m-dat-16", label: "Henley Date",       query: "men henley date outfit",                image: img("1542838132-92c53300491e"), category: "date-night", subcategory: "henley-date" },
    { id: "m-dat-17", label: "Knit Polo",         query: "men knit polo date outfit",             image: img("1761498443962-1f00eed12137"), category: "date-night", subcategory: "knit-polo" },
    { id: "m-dat-18", label: "Blazer Tee Jeans",  query: "men blazer tshirt jeans date outfit",   image: img("1502720433255-614171a1835e"), category: "date-night", subcategory: "blazer-tee-jeans" },
    { id: "m-dat-19", label: "Crewneck Date",     query: "men crewneck sweater date outfit",      image: img("1532910404247-7ee9488d7292"), category: "date-night", subcategory: "crewneck-date" },
    { id: "m-dat-20", label: "Bold Print Shirt",  query: "men bold print shirt date outfit",      image: img("1591561954557-26941169b49e"), category: "date-night", subcategory: "bold-print-shirt-m" },
  ],
  vacation: [
    { id: "m-vac-13", label: "Bermuda Shorts",    query: "men bermuda shorts vacation outfit",    image: img("1593032465175-481ac7f401a0"), category: "resort", subcategory: "bermuda-shorts" },
    { id: "m-vac-14", label: "Linen Pants",       query: "men linen pants vacation outfit",       image: img("1531123897727-8f129e1688ce"), category: "resort", subcategory: "linen-pants-m" },
    { id: "m-vac-15", label: "Hawaiian Shirt",    query: "men hawaiian shirt vacation",           image: img("1555529669-e69e7aa0ba9a"), category: "resort", subcategory: "hawaiian-shirt" },
    { id: "m-vac-16", label: "Boat Trip Look",    query: "men boat trip outfit nautical",         image: img("1500648767791-00dcc994a43e"), category: "resort", subcategory: "boat-trip" },
    { id: "m-vac-17", label: "Pool Side Shirt",   query: "men poolside shirt outfit",             image: img("1607604276583-eef5d076aa5f"), category: "resort", subcategory: "pool-side-m" },
    { id: "m-vac-18", label: "Vacation Polo",     query: "men polo vacation outfit",              image: img("1495707902641-75cac588d2e9"), category: "resort", subcategory: "vacation-polo" },
    { id: "m-vac-19", label: "Resort Linen Set",  query: "men resort linen matching set",         image: img("1612036782180-6f0b6cd846fe"), category: "resort", subcategory: "resort-linen-set" },
    { id: "m-vac-20", label: "Beach Walk",        query: "men beach walk outfit casual",          image: img("1605125571577-fdd0c52d5fef"), category: "resort", subcategory: "beach-walk" },
  ],
  fitness: [
    { id: "m-fit-13", label: "Compression Set",   query: "men compression workout set gym",       image: img("1551836022-deb4988cc6c0"), category: "fitness", subcategory: "compression-set" },
    { id: "m-fit-14", label: "Bodybuilding",      query: "men bodybuilding gym outfit",           image: img("1502323777036-f29e3972d82f"), category: "fitness", subcategory: "bodybuilding" },
    { id: "m-fit-15", label: "Trail Hike",        query: "men trail hiking outfit",               image: img("1574258495973-f010dfbb5371"), category: "fitness", subcategory: "trail-hike-m" },
    { id: "m-fit-16", label: "Sprint Outfit",     query: "men sprint running outfit",             image: img("1572635196237-14b3f281503f"), category: "fitness", subcategory: "sprint-outfit" },
    { id: "m-fit-17", label: "Climbing Gear",     query: "men rock climbing outfit gear",         image: img("1573408301185-9146fe634ad0"), category: "fitness", subcategory: "climbing-gear" },
    { id: "m-fit-18", label: "Mma Training",      query: "men mma boxing training outfit",        image: img("1535632787350-4e68ef0ac584"), category: "fitness", subcategory: "mma-training" },
    { id: "m-fit-19", label: "Sports Jersey Kit", query: "men sports jersey kit",                 image: img("1577803645773-f96470509666"), category: "fitness", subcategory: "sports-jersey-kit" },
    { id: "m-fit-20", label: "Court Sneakers",    query: "men court sneakers gym outfit",         image: img("1502767089025-6748d4ef9f24"), category: "fitness", subcategory: "court-sneakers" },
  ],
  cosplay: [
    { id: "m-cos-13", label: "Royal King",        query: "royal king cosplay man",                image: img("1641427493563-5cc9cf1a9950"), category: "cosplay", subcategory: "royal-king" },
    { id: "m-cos-14", label: "Bounty Hunter",     query: "bounty hunter cosplay man",             image: img("1620063633168-8ec1bcc1bcec"), category: "cosplay", subcategory: "bounty-hunter" },
    { id: "m-cos-15", label: "Demon Lord",        query: "demon lord cosplay man",                image: img("1622495966321-49b35b3a8d4f"), category: "cosplay", subcategory: "demon-lord" },
    { id: "m-cos-16", label: "Cyber Detective",   query: "cyber detective cosplay man",           image: img("1602910344008-22f323cc1817"), category: "cosplay", subcategory: "cyber-detective" },
    { id: "m-cos-17", label: "Forest Ranger",     query: "forest ranger cosplay man",             image: img("1571908599407-cdb918ed83bf"), category: "cosplay", subcategory: "forest-ranger" },
    { id: "m-cos-18", label: "Steampunk Inventor",query: "steampunk inventor cosplay man",        image: img("1632481151312-4b4f3306e7e6"), category: "cosplay", subcategory: "steampunk-inventor" },
    { id: "m-cos-19", label: "Arctic Explorer",   query: "arctic explorer cosplay man",           image: img("1605497788044-5a32c7078486"), category: "cosplay", subcategory: "arctic-explorer" },
    { id: "m-cos-20", label: "Royal Knight",      query: "royal knight cosplay man armor",        image: img("1617922001439-4a2e6562f328"), category: "cosplay", subcategory: "royal-knight" },
  ],
};

// Merge base + extras into combined pools
const FEMALE_FULL: Record<OccasionId, Vibe[]> = Object.fromEntries(
  (Object.keys(FEMALE) as OccasionId[]).map(k => [k, [...FEMALE[k], ...(FEMALE_EXTRA[k] || [])]])
) as Record<OccasionId, Vibe[]>;

const MALE_FULL: Record<OccasionId, Vibe[]> = Object.fromEntries(
  (Object.keys(MALE) as OccasionId[]).map(k => [k, [...MALE[k], ...(MALE_EXTRA[k] || [])]])
) as Record<OccasionId, Vibe[]>;

const PER_VIBE_OCCASIONS: ReadonlySet<OccasionId> = new Set([
  "swimwear", "casual", "glam", "formal", "streetwear", "date-night", "vacation",
]);


const OCCASION_META: Array<{ id: OccasionId; label: string; desc: string; Icon: LucideIcon }> = [
  { id: "casual",     label: "Casual",          desc: "Effortless everyday looks",        Icon: Coffee },
  { id: "glam",       label: "Glam · Night Out",desc: "Bold, sparkly, unforgettable",     Icon: Sparkles },
  { id: "formal",     label: "Formal · Work",   desc: "Polished, powerful, professional", Icon: Briefcase },
  { id: "streetwear", label: "Streetwear",      desc: "Urban, layered, statement-making", Icon: Flame },
  { id: "date-night", label: "Date Night",      desc: "Romantic, confident, magnetic",    Icon: Heart },
  { id: "vacation",   label: "Vacation",        desc: "Resort, beach, travel-ready",      Icon: Palmtree },
  { id: "swimwear",   label: "Swimwear",        desc: "Bikinis, one-pieces, poolside",    Icon: Waves },
  { id: "fitness",    label: "Fitness",         desc: "Gym, run, yoga, sport-ready",      Icon: Dumbbell },
  { id: "cosplay",    label: "Cosplay",         desc: "Become the character",             Icon: Star },
];

const OCCASIONS: Occasion[] = OCCASION_META.map(meta => ({
  ...meta,
  usePerVibePhotos: PER_VIBE_OCCASIONS.has(meta.id),
  vibes: { female: FEMALE_FULL[meta.id], male: MALE_FULL[meta.id] },
}));

const VISIBLE_PER_BATCH = 12;
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const OccasionPickerScreen = ({ gender, onBack, onNext }: Props) => {
  const [stage, setStage] = useState<"occasion" | "vibe">("occasion");
  const [selected, setSelected] = useState<Occasion | null>(null);
  const [perVibePhotos, setPerVibePhotos] = useState<Record<string, string> | null>(null);
  const [genericPhotos, setGenericPhotos] = useState<string[] | null>(null);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [page, setPage] = useState(1);
  const [shuffleNonce, setShuffleNonce] = useState(0);
  const [pendingVibe, setPendingVibe] = useState<{ vibe: Vibe; image: string } | null>(null);
  const isMale = gender === "male";
  const accent = isMale ? "--glamora-gold" : "--glamora-rose-dark";
  const vibeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === "vibe" && vibeRef.current) {
      vibeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stage]);

  // Randomize starting page + reset shuffle when entering a new occasion.
  useEffect(() => {
    if (stage === "vibe") {
      setPage(Math.floor(Math.random() * 5) + 1);
      setShuffleNonce(n => n + 1);
    }
  }, [stage, selected?.id]);

  // Randomized subset of vibes shown for this visit. Reshuffles whenever
  // the user taps "Show more" so they get a fresh batch from the larger pool.
  const visibleVibes = useMemo(() => {
    if (!selected) return [] as Vibe[];
    const all = selected.vibes[gender];
    if (all.length <= VISIBLE_PER_BATCH) return all;
    return shuffle(all).slice(0, VISIBLE_PER_BATCH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, gender, shuffleNonce]);

  // Fetch the right photos based on the selected occasion's mode + page.
  useEffect(() => {
    if (stage !== "vibe" || !selected) return;
    let cancelled = false;
    setPerVibePhotos(null);
    setGenericPhotos(null);
    setLoadingPhotos(true);

    const vibes = visibleVibes;

    if (selected.usePerVibePhotos) {
      const queries: VibeQuery[] = vibes.map((v, i) => ({
        id: v.id,
        query: v.query,
        ethnicity: eth(i + (page - 1)),
      }));
      fetchVibePhotosByQuery(selected.id, gender, queries, page)
        .then((map) => { if (!cancelled) setPerVibePhotos(map); })
        .finally(() => { if (!cancelled) setLoadingPhotos(false); });
    } else {
      fetchVibePhotos(selected.id, gender, page)
        .then((photos) => { if (!cancelled && photos.length > 0) setGenericPhotos(photos.map(p => p.url)); })
        .finally(() => { if (!cancelled) setLoadingPhotos(false); });
    }

    return () => { cancelled = true; };
  }, [stage, selected, gender, page, visibleVibes]);

  const handleOccasion = (o: Occasion) => {
    setSelected(o);
    setTimeout(() => setStage("vibe"), 180);
  };

  const handleVibe = (v: Vibe, image: string) => {
    setPendingVibe({ vibe: v, image });
  };

  const confirmChoice = (mode: "exact" | "inspired") => {
    if (!pendingVibe) return;
    const { vibe, image } = pendingVibe;
    setPendingVibe(null);
    onNext(vibe.category, vibe.subcategory, vibe.label, image, mode);
  };

  const photoFor = (v: Vibe, i: number): string => {
    if (selected?.usePerVibePhotos) return perVibePhotos?.[v.id] || v.image;
    return genericPhotos?.[i] || v.image;
  };

  return (
    <div className="screen" style={{ paddingBottom: 120 }}>
      <div className="screen-header">
        <button
          className="back-btn"
          onClick={() => (stage === "vibe" ? setStage("occasion") : onBack())}
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="header-title">
            {stage === "occasion" ? "What's the occasion?" : "Pick your vibe"}
          </div>
          <div className="header-sub">
            {stage === "occasion"
              ? "Tap one to see vibes"
              : selected?.label}
          </div>
        </div>
      </div>

      <FlowStepper current="style" gender={gender} />

      {stage === "occasion" && (
        <div
          className="anim-fadeUp"
          style={{
            padding: "16px 22px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {OCCASIONS.map((o, i) => {
            const isSel = selected?.id === o.id;
            return (
              <button
                key={o.id}
                onClick={() => handleOccasion(o)}
                className="anim-fadeUp"
                style={{
                  animationDelay: `${i * 60}ms`,
                  padding: "20px 14px",
                  borderRadius: 22,
                  border: `1.5px solid ${isSel ? `hsl(var(${accent}))` : "hsla(0 0% 100% / 0.08)"}`,
                  background: isSel
                    ? `linear-gradient(135deg, hsla(var(${accent}) / 0.18), hsla(var(--glamora-gold) / 0.08))`
                    : "hsl(var(--card))",
                  boxShadow: isSel
                    ? `0 0 24px hsla(var(${accent}) / 0.35), 0 4px 20px hsla(0 0% 0% / 0.3)`
                    : "0 2px 14px hsla(0 0% 0% / 0.22)",
                  color: "hsl(var(--glamora-char))",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                  textAlign: "left",
                  minHeight: 130,
                  transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `linear-gradient(135deg, hsl(var(${accent})), hsl(var(--glamora-gold-light)))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <o.Icon size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, lineHeight: 1.15 }}>
                    {o.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: "hsl(var(--glamora-gray))", marginTop: 4, lineHeight: 1.35 }}>
                    {o.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {stage === "vibe" && selected && (
        <div ref={vibeRef} className="anim-fadeUp" style={{ padding: "16px 18px 40px" }}>
          <div className="section-label" style={{ marginBottom: 10, paddingLeft: 4 }}>
            Tap the vibe that speaks to you · {visibleVibes.length} of {selected.vibes[gender].length} looks
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {visibleVibes.map((v, i) => (
              <button
                key={v.id}
                onClick={() => handleVibe(v, photoFor(v, i))}
                className="anim-scaleIn"
                style={{
                  animationDelay: `${i * 40}ms`,
                  position: "relative",
                  padding: 0,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid hsla(0 0% 100% / 0.06)",
                  background: "hsl(var(--card))",
                  cursor: "pointer",
                  aspectRatio: "3/4",
                  boxShadow: "0 4px 14px hsla(0 0% 0% / 0.32)",
                }}
              >
                <img
                  src={photoFor(v, i)}
                  alt={v.label}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: "center top",
                    display: "block",
                    opacity: loadingPhotos ? 0.55 : 1,
                    transition: "opacity 0.3s",
                  }}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (el.src !== v.image) el.src = v.image;
                  }}
                />
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, transparent 50%, hsla(0 0% 0% / 0.82) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute", left: 8, right: 8, bottom: 7,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4,
                    color: "white", fontWeight: 600, fontSize: 11,
                    fontFamily: "'Jost', sans-serif",
                  }}
                >
                  <span style={{
                    textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{v.label}</span>
                  <span
                    style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: `hsl(var(${accent}))`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 8px hsla(var(${accent}) / 0.6)`,
                      flexShrink: 0,
                    }}
                  >
                    <Check size={10} color="white" strokeWidth={3} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Show more options */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loadingPhotos}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: `1px solid hsla(var(${accent}) / 0.45)`,
                background: `linear-gradient(135deg, hsla(var(${accent}) / 0.12), hsla(var(--glamora-gold) / 0.06))`,
                color: "hsl(var(--glamora-char))",
                fontSize: 13,
                fontWeight: 600,
                cursor: loadingPhotos ? "wait" : "pointer",
                boxShadow: `0 0 14px hsla(var(${accent}) / 0.25)`,
                opacity: loadingPhotos ? 0.7 : 1,
              }}
            >
              {loadingPhotos ? "Loading…" : `Show more options${page > 1 ? ` · page ${page + 1}` : ""}`}
            </button>
          </div>
        </div>
      )}

      {/* ── Recreate vs Inspired modal ── */}
      {pendingVibe && (
        <div
          onClick={() => setPendingVibe(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 60,
            background: "hsla(0 0% 0% / 0.72)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="anim-slideUp"
            style={{
              width: "100%", maxWidth: 460,
              background: "hsl(var(--card))",
              border: "1px solid hsla(0 0% 100% / 0.08)",
              borderRadius: 24,
              padding: 20,
              boxShadow: "0 -10px 40px hsla(0 0% 0% / 0.5)",
              marginBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <img
                src={pendingVibe.image}
                alt={pendingVibe.vibe.label}
                style={{
                  width: 84, height: 112, borderRadius: 12,
                  objectFit: "cover", flexShrink: 0,
                  border: `1px solid hsla(var(${accent}) / 0.35)`,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 20, color: "hsl(var(--glamora-char))", lineHeight: 1.15 }}>
                  {pendingVibe.vibe.label}
                </div>
                <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>
                  How should we style you?
                </div>
              </div>
            </div>

            <button
              onClick={() => confirmChoice("exact")}
              style={{
                width: "100%", textAlign: "left",
                padding: "14px 16px", marginBottom: 10,
                borderRadius: 16,
                border: `1.5px solid hsla(var(${accent}) / 0.55)`,
                background: `linear-gradient(135deg, hsla(var(${accent}) / 0.18), hsla(var(--glamora-gold) / 0.08))`,
                color: "hsl(var(--glamora-char))",
                cursor: "pointer",
                boxShadow: `0 0 18px hsla(var(${accent}) / 0.3)`,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Recreate this exact look</div>
              <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))" }}>
                Put this exact outfit on me — same pieces, colors, and details.
              </div>
            </button>

            <button
              onClick={() => confirmChoice("inspired")}
              style={{
                width: "100%", textAlign: "left",
                padding: "14px 16px",
                borderRadius: 16,
                border: "1.5px solid hsla(0 0% 100% / 0.12)",
                background: "hsla(0 0% 100% / 0.04)",
                color: "hsl(var(--glamora-char))",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Inspired by this vibe</div>
              <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))" }}>
                Create a similar but original look tailored to me.
              </div>
            </button>

            <button
              onClick={() => setPendingVibe(null)}
              style={{
                width: "100%", marginTop: 10,
                padding: "10px",
                borderRadius: 12,
                border: "none",
                background: "transparent",
                color: "hsl(var(--glamora-gray))",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OccasionPickerScreen;

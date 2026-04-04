import { useState, useMemo } from "react";
import { Sparkles, Bookmark, Share2, RefreshCw, Download, Palette, Shirt, Gem, Scissors, Info, ExternalLink, Watch, CircleDot, Footprints } from "lucide-react";
import type { UserPrefs, PhotoType } from "./GlamoraApp";
import type { StyleProfile } from "./InspirationLoadingScreen";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { getShopUrl } from "./affiliateUrls";
import ShareMenu from "./ShareMenu";
import Watermark from "./subscription/Watermark";
import ShopPanel, { type ShopItem } from "./ShopPanel";
import DynamicPriceCard from "./DynamicPriceCard";
import type { LucideIcon } from "lucide-react";

interface Props {
  prefs: UserPrefs;
  styledImageUrl: string | null;
  styleProfile: StyleProfile | null;
  onBack: () => void;
  onHome: () => void;
  onSave: (lookName: string) => void;
  onRegenerate: () => void;
  showWatermark?: boolean;
}

type HotspotId = "makeup" | "top" | "accessories" | "bottom" | "shoes";

const getHotspotPositions = (isMale: boolean): Record<HotspotId, { top: string; left: string; label: string; Icon: LucideIcon; searchTerm: string }> => ({
  makeup: { top: "8%", left: "62%", label: isMale ? "Grooming" : "Makeup", Icon: Palette, searchTerm: isMale ? "men grooming kit skincare" : "makeup kit set" },
  top: { top: "28%", left: "18%", label: "Top", Icon: Shirt, searchTerm: isMale ? "men shirt top" : "women top blouse" },
  accessories: { top: "22%", left: "78%", label: "Accessories", Icon: Watch, searchTerm: isMale ? "men accessories watch" : "women fashion accessories jewelry" },
  bottom: { top: "58%", left: "22%", label: "Bottoms", Icon: CircleDot, searchTerm: isMale ? "men pants trousers" : "women pants trousers" },
  shoes: { top: "82%", left: "55%", label: "Shoes", Icon: Footprints, searchTerm: isMale ? "men shoes sneakers" : "women shoes heels" },
});

const handleDownload = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `glosseti-inspired-look-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(imageUrl, "_blank");
  }
};

// Smart store mapping for AI-generated clothing items
const clothingStoreMap: Record<string, { luxury: { store: string; item: string; price: string }; mid: { store: string; item: string; price: string }; budget: { store: string; item: string; price: string } }> = {
  blazer:       { luxury: { store: "Nordstrom", item: "Theory Etiennette Blazer", price: "$455" }, mid: { store: "Zara", item: "Double-Breasted Blazer", price: "$90" }, budget: { store: "H&M", item: "Single-Button Blazer", price: "$35" } },
  jacket:       { luxury: { store: "AllSaints", item: "Dalby Leather Biker Jacket", price: "$549" }, mid: { store: "Mango", item: "Faux Leather Biker Jacket", price: "$120" }, budget: { store: "Amazon", item: "Levi's Faux Leather Moto Jacket", price: "$45" } },
  coat:         { luxury: { store: "Nordstrom", item: "Max Mara Madame Wool Coat", price: "$3,690" }, mid: { store: "& Other Stories", item: "Belted Wool Coat", price: "$249" }, budget: { store: "H&M", item: "Double-Breasted Coat", price: "$60" } },
  dress:        { luxury: { store: "Net-a-Porter", item: "Reformation Midi Dress", price: "$278" }, mid: { store: "& Other Stories", item: "Belted Midi Dress", price: "$119" }, budget: { store: "H&M", item: "Crêpe Dress", price: "$30" } },
  jeans:        { luxury: { store: "Nordstrom", item: "Citizens of Humanity Horseshoe Jeans", price: "$238" }, mid: { store: "Madewell", item: "Perfect Vintage Jean", price: "$138" }, budget: { store: "Amazon", item: "Levi's 501 Original Fit", price: "$45" } },
  pants:        { luxury: { store: "Nordstrom", item: "Vince Tailored Trousers", price: "$345" }, mid: { store: "Banana Republic", item: "Slim Italian Wool Pant", price: "$140" }, budget: { store: "Uniqlo", item: "Smart Ankle Pants", price: "$40" } },
  trousers:     { luxury: { store: "Nordstrom", item: "Theory Good Wool Trousers", price: "$295" }, mid: { store: "Zara", item: "High-Waist Trousers", price: "$50" }, budget: { store: "H&M", item: "Tailored Trousers", price: "$28" } },
  skirt:        { luxury: { store: "Net-a-Porter", item: "Vince Satin Slip Skirt", price: "$265" }, mid: { store: "& Other Stories", item: "Satin Midi Skirt", price: "$79" }, budget: { store: "Amazon", item: "SheIn High Waist Midi Skirt", price: "$18" } },
  shirt:        { luxury: { store: "Ralph Lauren", item: "Oxford Button-Down Shirt", price: "$125" }, mid: { store: "J.Crew", item: "Slim Stretch Cotton Shirt", price: "$80" }, budget: { store: "Uniqlo", item: "Oxford Slim-Fit Shirt", price: "$30" } },
  blouse:       { luxury: { store: "Reformation", item: "Kelsey Silk Wrap Top", price: "$178" }, mid: { store: "Mango", item: "Floral Print Wrap Blouse", price: "$50" }, budget: { store: "Amazon", item: "VIISHOW Chiffon V-Neck Blouse", price: "$22" } },
  top:          { luxury: { store: "Net-a-Porter", item: "The Row Ellie Knit Top", price: "$590" }, mid: { store: "Zara", item: "Ribbed Knit Top", price: "$36" }, budget: { store: "H&M", item: "Fitted Jersey Top", price: "$10" } },
  sweater:      { luxury: { store: "Nordstrom", item: "Vince Cashmere Crew Sweater", price: "$345" }, mid: { store: "Everlane", item: "Cashmere Crew", price: "$130" }, budget: { store: "Amazon", item: "Amazon Essentials Crewneck Sweater", price: "$28" } },
  turtleneck:   { luxury: { store: "Net-a-Porter", item: "The Row Funnel-Neck Knit", price: "$490" }, mid: { store: "Everlane", item: "Cashmere Turtleneck", price: "$130" }, budget: { store: "Uniqlo", item: "Heattech Turtleneck", price: "$15" } },
  camisole:     { luxury: { store: "Net-a-Porter", item: "Vince Silk Camisole", price: "$225" }, mid: { store: "Nordstrom", item: "Topshop Satin Cowl Cami", price: "$45" }, budget: { store: "H&M", item: "Satin V-Neck Camisole", price: "$18" } },
  heels:        { luxury: { store: "Nordstrom", item: "Stuart Weitzman Nudist Sandal", price: "$425" }, mid: { store: "Steve Madden", item: "Steve Madden Daisie Pump", price: "$90" }, budget: { store: "Target", item: "A New Day Block Heel Sandal", price: "$30" } },
  boots:        { luxury: { store: "Nordstrom", item: "Isabel Marant Dicker Boot", price: "$690" }, mid: { store: "Dr. Martens", item: "Dr. Martens 1460 Boot", price: "$150" }, budget: { store: "Target", item: "Universal Thread Ankle Boot", price: "$35" } },
  sneakers:     { luxury: { store: "Nordstrom", item: "Golden Goose Superstar", price: "$530" }, mid: { store: "Nike", item: "Nike Dunk Low Retro", price: "$115" }, budget: { store: "Adidas", item: "Adidas Grand Court Sneaker", price: "$45" } },
  loafers:      { luxury: { store: "Gucci", item: "Gucci Horsebit Loafer", price: "$890" }, mid: { store: "Cole Haan", item: "Geneva Loafer", price: "$130" }, budget: { store: "Amazon", item: "Amazon Essentials Loafer", price: "$28" } },
  sandals:      { luxury: { store: "Nordstrom", item: "Ancient Greek Sandals Desmos", price: "$230" }, mid: { store: "Birkenstock", item: "Birkenstock Arizona Sandal", price: "$110" }, budget: { store: "Amazon", item: "Amazon Essentials Flat Sandal", price: "$18" } },
  flats:        { luxury: { store: "Nordstrom", item: "Jimmy Choo Romy Ballet Flat", price: "$595" }, mid: { store: "DSW", item: "Sam Edelman Jillie Flat", price: "$100" }, budget: { store: "Target", item: "A New Day Pointed Toe Flat", price: "$22" } },
  suit:         { luxury: { store: "Brooks Brothers", item: "Regent Fit Wool Suit", price: "$898" }, mid: { store: "Banana Republic", item: "Italian Wool Suit", price: "$450" }, budget: { store: "Amazon", item: "Kenneth Cole Slim-Fit Suit", price: "$130" } },
  hoodie:       { luxury: { store: "Nordstrom", item: "Acne Studios Logo Hoodie", price: "$380" }, mid: { store: "Nike", item: "Nike Sportswear Club Fleece Hoodie", price: "$60" }, budget: { store: "Amazon", item: "Hanes EcoSmart Hoodie", price: "$15" } },
  shorts:       { luxury: { store: "Nordstrom", item: "Vince Pleated Shorts", price: "$225" }, mid: { store: "J.Crew", item: "Dock Short", price: "$60" }, budget: { store: "Target", item: "Goodfellow Flat Front Short", price: "$20" } },
  vest:         { luxury: { store: "Ralph Lauren", item: "Quilted Vest", price: "$248" }, mid: { store: "The North Face", item: "ThermoBall Eco Vest", price: "$120" }, budget: { store: "Amazon", item: "Amazon Essentials Puffer Vest", price: "$32" } },
  jumpsuit:     { luxury: { store: "Net-a-Porter", item: "Stella McCartney Tailored Jumpsuit", price: "$1,295" }, mid: { store: "& Other Stories", item: "Belted Utility Jumpsuit", price: "$129" }, budget: { store: "H&M", item: "Jersey Jumpsuit", price: "$30" } },
  cardigan:     { luxury: { store: "Nordstrom", item: "Vince Cashmere Cardigan", price: "$395" }, mid: { store: "Everlane", item: "Oversized Alpaca Cardigan", price: "$128" }, budget: { store: "Amazon", item: "Amazon Essentials Cardigan", price: "$25" } },
  joggers:      { luxury: { store: "Lululemon", item: "Lululemon ABC Jogger", price: "$128" }, mid: { store: "Nike", item: "Nike Tech Fleece Jogger", price: "$110" }, budget: { store: "Amazon", item: "Amazon Essentials Fleece Jogger", price: "$18" } },
  leggings:     { luxury: { store: "Lululemon", item: "Lululemon Align Legging", price: "$98" }, mid: { store: "Nike", item: "Nike One High-Rise Legging", price: "$60" }, budget: { store: "Amazon", item: "CRZ YOGA High Waist Legging", price: "$28" } },
  puffer:       { luxury: { store: "The North Face", item: "The North Face 1996 Retro Nuptse", price: "$330" }, mid: { store: "Patagonia", item: "Patagonia Nano Puff Jacket", price: "$199" }, budget: { store: "Amazon", item: "Amazon Essentials Puffer Jacket", price: "$35" } },
  denim:        { luxury: { store: "Nordstrom", item: "AGOLDE 90s Pinch Waist Jeans", price: "$198" }, mid: { store: "Levi's", item: "Levi's 501 Original Fit", price: "$80" }, budget: { store: "Target", item: "Universal Thread High-Rise Jeans", price: "$25" } },
  polo:         { luxury: { store: "Ralph Lauren", item: "Ralph Lauren Polo Shirt", price: "$110" }, mid: { store: "J.Crew", item: "Piqué Polo Shirt", price: "$50" }, budget: { store: "Uniqlo", item: "DRY Piqué Polo Shirt", price: "$20" } },
  tank:         { luxury: { store: "Nordstrom", item: "Vince Ribbed Tank", price: "$95" }, mid: { store: "Everlane", item: "The Organic Cotton Tank", price: "$18" }, budget: { store: "Amazon", item: "Amazon Essentials Tank Top", price: "$10" } },
  crop:         { luxury: { store: "Revolve", item: "Retrofête Crystal Crop Top", price: "$295" }, mid: { store: "Urban Outfitters", item: "BDG Crop Top", price: "$29" }, budget: { store: "Amazon", item: "SheIn Crop Top", price: "$12" } },
};

const accessoryStoreMap: Record<string, { luxury: { store: string; item: string; price: string }; mid: { store: string; item: string; price: string }; budget: { store: string; item: string; price: string } }> = {
  watch:        { luxury: { store: "Nordstrom", item: "TAG Heuer Carrera 29mm", price: "$2,350" }, mid: { store: "Amazon", item: "Fossil Jacqueline Watch", price: "$90" }, budget: { store: "Amazon", item: "Casio Classic Watch", price: "$18" } },
  necklace:     { luxury: { store: "Mejuri", item: "Bold Link Chain Necklace", price: "$198" }, mid: { store: "Gorjana", item: "Layered Necklace Set", price: "$65" }, budget: { store: "Amazon", item: "PAVOI 14K Layered Necklace", price: "$14" } },
  earrings:     { luxury: { store: "Mejuri", item: "Croissant Dome Gold Hoops", price: "$125" }, mid: { store: "Gorjana", item: "Huggie Hoop Earrings", price: "$42" }, budget: { store: "Amazon", item: "PAVOI 14K Gold Chunky Hoops", price: "$14" } },
  bracelet:     { luxury: { store: "Nordstrom", item: "David Yurman Cable Bracelet", price: "$450" }, mid: { store: "Gorjana", item: "Power Gemstone Bracelet", price: "$38" }, budget: { store: "Amazon", item: "PAVOI Cuff Bangle Bracelet", price: "$12" } },
  ring:         { luxury: { store: "Mejuri", item: "Dome Ring in 14K Gold", price: "$175" }, mid: { store: "Gorjana", item: "Stackable Ring Set", price: "$55" }, budget: { store: "Amazon", item: "PAVOI 14K Gold Stacking Rings", price: "$12" } },
  bag:          { luxury: { store: "Nordstrom", item: "Saint Laurent Kate Chain Bag", price: "$2,150" }, mid: { store: "Coach Outlet", item: "Mini Skinny Crossbody", price: "$89" }, budget: { store: "Amazon", item: "CLUCI Small Crossbody Bag", price: "$22" } },
  handbag:      { luxury: { store: "Gucci", item: "Gucci GG Marmont Bag", price: "$2,350" }, mid: { store: "Rebecca Minkoff", item: "Edie Crossbody", price: "$198" }, budget: { store: "Amazon", item: "CLUCI Leather Handbag", price: "$35" } },
  belt:         { luxury: { store: "Gucci", item: "Gucci GG Marmont Belt", price: "$470" }, mid: { store: "Cole Haan", item: "Feather Edge Belt", price: "$68" }, budget: { store: "Amazon", item: "Amazon Essentials Leather Belt", price: "$15" } },
  scarf:        { luxury: { store: "Burberry", item: "Burberry Classic Check Scarf", price: "$520" }, mid: { store: "Nordstrom", item: "Halogen Cashmere Scarf", price: "$70" }, budget: { store: "Amazon", item: "Amazon Essentials Scarf", price: "$15" } },
  sunglasses:   { luxury: { store: "Nordstrom", item: "Celine Triomphe Sunglasses", price: "$460" }, mid: { store: "Nordstrom", item: "Ray-Ban Wayfarer Classic", price: "$163" }, budget: { store: "Amazon", item: "SOJOS Retro Square Sunglasses", price: "$15" } },
  hat:          { luxury: { store: "Nordstrom", item: "Janessa Leoné Packable Fedora", price: "$238" }, mid: { store: "Madewell", item: "Packable Straw Hat", price: "$48" }, budget: { store: "Amazon", item: "Lanzom Wide Brim Straw Hat", price: "$16" } },
  cap:          { luxury: { store: "Nordstrom", item: "Acne Studios Logo Cap", price: "$150" }, mid: { store: "Nike", item: "Nike Heritage86 Cap", price: "$28" }, budget: { store: "Amazon", item: "Nike Heritage86 Cap", price: "$18" } },
  tie:          { luxury: { store: "Brooks Brothers", item: "Silk Rep Tie", price: "$98" }, mid: { store: "Ralph Lauren", item: "Silk Twill Tie", price: "$75" }, budget: { store: "Amazon", item: "KissTies Solid Satin Tie", price: "$10" } },
  fragrance:    { luxury: { store: "Sephora", item: "Le Labo Santal 33 EDP", price: "$310" }, mid: { store: "Ulta", item: "Sol de Janeiro Cheirosa '62", price: "$35" }, budget: { store: "Amazon", item: "Raw Spirit Wild Fire Rollerball", price: "$15" } },
  jewelry:      { luxury: { store: "Mejuri", item: "Bold Link Chain + Pendant Set", price: "$230" }, mid: { store: "Gorjana", item: "Layered Necklace Set", price: "$65" }, budget: { store: "Amazon", item: "PAVOI 14K Layered Chain Set", price: "$14" } },
  glasses:      { luxury: { store: "Nordstrom", item: "Oliver Peoples O'Malley", price: "$420" }, mid: { store: "Nordstrom", item: "Ray-Ban Round Metal", price: "$163" }, budget: { store: "Amazon", item: "SOJOS Blue Light Blocking Glasses", price: "$16" } },
  clutch:       { luxury: { store: "Nordstrom", item: "Bottega Veneta Pouch Clutch", price: "$1,800" }, mid: { store: "Rebecca Minkoff", item: "Leo Clutch", price: "$98" }, budget: { store: "Amazon", item: "CLUCI Evening Clutch", price: "$18" } },
  tote:         { luxury: { store: "Tory Burch", item: "Tory Burch Perry Tote", price: "$348" }, mid: { store: "Madewell", item: "The Transport Tote", price: "$178" }, budget: { store: "Amazon", item: "Dreubea Faux Leather Tote", price: "$15" } },
  backpack:     { luxury: { store: "Prada", item: "Prada Re-Nylon Mini Backpack", price: "$1,350" }, mid: { store: "Nike", item: "Nike Heritage Backpack", price: "$35" }, budget: { store: "Amazon", item: "Carhartt Classic Backpack", price: "$35" } },
  chain:        { luxury: { store: "Mejuri", item: "Bold Cuban Link Chain 18K", price: "$290" }, mid: { store: "Gorjana", item: "Cuban Link Chain", price: "$65" }, budget: { store: "Amazon", item: "PROSTEEL Cuban Link Chain", price: "$25" } },
  choker:       { luxury: { store: "Nordstrom", item: "Fallon Monarch Velvet Choker", price: "$125" }, mid: { store: "Nordstrom", item: "Ettika Velvet Choker Set", price: "$35" }, budget: { store: "Amazon", item: "Mudder Velvet Choker Set 6pcs", price: "$10" } },
};

const beautyStoreMap: Record<string, { luxury: { store: string; item: string; price: string }; mid: { store: string; item: string; price: string }; budget: { store: string; item: string; price: string } }> = {
  foundation:   { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Airbrush Flawless Foundation", price: "$46" }, mid: { store: "Fenty Beauty", item: "Fenty Beauty Pro Filt'r Foundation", price: "$40" }, budget: { store: "Target", item: "Maybelline Fit Me Dewy Foundation", price: "$9" } },
  concealer:    { luxury: { store: "Sephora", item: "NARS Radiant Creamy Concealer", price: "$32" }, mid: { store: "Glossier", item: "Glossier Stretch Concealer", price: "$22" }, budget: { store: "Amazon", item: "e.l.f. 16HR Camo Concealer", price: "$7" } },
  primer:       { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Wonderglow Primer", price: "$55" }, mid: { store: "Ulta", item: "NYX Marshmallow Primer", price: "$16" }, budget: { store: "Amazon", item: "e.l.f. Jelly Pop Dew Primer", price: "$10" } },
  powder:       { luxury: { store: "Sephora", item: "Laura Mercier Translucent Powder", price: "$44" }, mid: { store: "Ulta", item: "Maybelline Fit Me Loose Powder", price: "$9" }, budget: { store: "Amazon", item: "Coty Airspun Loose Face Powder", price: "$8" } },
  blush:        { luxury: { store: "Rare Beauty", item: "Rare Beauty Soft Pinch Liquid Blush", price: "$23" }, mid: { store: "MAC", item: "MAC Mineralize Blush", price: "$30" }, budget: { store: "Amazon", item: "e.l.f. Baked Blush", price: "$6" } },
  bronzer:      { luxury: { store: "Fenty Beauty", item: "Fenty Beauty Sun Stalk'r Bronzer", price: "$32" }, mid: { store: "Ulta", item: "Physician's Formula Butter Bronzer", price: "$16" }, budget: { store: "Amazon", item: "e.l.f. Putty Bronzer", price: "$7" } },
  highlighter:  { luxury: { store: "Fenty Beauty", item: "Fenty Beauty Killawatt Highlighter", price: "$38" }, mid: { store: "Rare Beauty", item: "Rare Beauty Positive Light Highlighter", price: "$25" }, budget: { store: "Target", item: "e.l.f. Liquid Highlighter", price: "$5" } },
  contour:      { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Contour Wand", price: "$40" }, mid: { store: "Fenty Beauty", item: "Fenty Beauty Match Stix Contour", price: "$28" }, budget: { store: "Amazon", item: "e.l.f. Contour Palette", price: "$8" } },
  lipstick:     { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Matte Revolution Lipstick", price: "$37" }, mid: { store: "MAC", item: "MAC Matte Lipstick", price: "$22" }, budget: { store: "Target", item: "Revlon Super Lustrous Lipstick", price: "$8" } },
  lipgloss:     { luxury: { store: "Fenty Beauty", item: "Fenty Beauty Gloss Bomb", price: "$22" }, mid: { store: "Rare Beauty", item: "Rare Beauty Soft Pinch Tinted Lip Oil", price: "$20" }, budget: { store: "Amazon", item: "Revlon Super Lustrous Lip Gloss", price: "$5" } },
  lipliner:     { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Lip Cheat Liner", price: "$25" }, mid: { store: "MAC", item: "MAC Lip Pencil", price: "$22" }, budget: { store: "Amazon", item: "e.l.f. Lip Liner", price: "$3" } },
  eyeshadow:    { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Pillow Talk Palette", price: "$53" }, mid: { store: "Fenty Beauty", item: "Fenty Beauty Snap Shadows Palette", price: "$28" }, budget: { store: "Amazon", item: "Maybelline The Nudes Palette", price: "$11" } },
  eyeliner:     { luxury: { store: "MAC", item: "MAC Pro Longwear Fluidline", price: "$23" }, mid: { store: "Fenty Beauty", item: "Fenty Beauty Flypencil Eyeliner", price: "$24" }, budget: { store: "Amazon", item: "e.l.f. Intense Ink Eyeliner", price: "$4" } },
  mascara:      { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Pillow Talk Mascara", price: "$29" }, mid: { store: "Rare Beauty", item: "Rare Beauty Perfect Strokes Mascara", price: "$22" }, budget: { store: "Amazon", item: "e.l.f. Lash 'N Roll Mascara", price: "$5" } },
  brow:         { luxury: { store: "Glossier", item: "Glossier Boy Brow", price: "$18" }, mid: { store: "MAC", item: "MAC Shape + Shade Brow Tint", price: "$24" }, budget: { store: "Amazon", item: "e.l.f. Ultra Precise Brow Pencil", price: "$3" } },
  setting:      { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Airbrush Flawless Setting Spray", price: "$38" }, mid: { store: "Fenty Beauty", item: "Fenty Beauty Pro Filt'r Setting Powder", price: "$36" }, budget: { store: "Amazon", item: "e.l.f. Makeup Mist & Set", price: "$6" } },
  skincare:     { luxury: { store: "Glossier", item: "Glossier The Solution Set", price: "$65" }, mid: { store: "Ulta", item: "CeraVe Moisturizing Cream", price: "$19" }, budget: { store: "Amazon", item: "Neutrogena Hydro Boost Gel", price: "$15" } },
  moisturizer:  { luxury: { store: "Glossier", item: "Glossier Priming Moisturizer Rich", price: "$35" }, mid: { store: "Ulta", item: "CeraVe Daily Moisturizer", price: "$16" }, budget: { store: "Target", item: "Cetaphil Moisturizing Lotion", price: "$10" } },
  serum:        { luxury: { store: "Sephora", item: "Drunk Elephant C-Firma Serum", price: "$78" }, mid: { store: "Glossier", item: "Glossier Super Glow Serum", price: "$28" }, budget: { store: "Amazon", item: "TruSkin Vitamin C Serum", price: "$20" } },
  sunscreen:    { luxury: { store: "Sephora", item: "Supergoop Unseen Sunscreen", price: "$38" }, mid: { store: "Ulta", item: "La Roche-Posay Anthelios SPF 60", price: "$28" }, budget: { store: "Amazon", item: "Neutrogena Ultra Sheer SPF 70", price: "$10" } },
  palette:      { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Pillow Talk Palette", price: "$53" }, mid: { store: "Fenty Beauty", item: "Fenty Beauty Snap Shadows", price: "$28" }, budget: { store: "Amazon", item: "Maybelline The 24K Nudes Palette", price: "$10" } },
  lip:          { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Pillow Talk Lip Kit", price: "$45" }, mid: { store: "MAC", item: "MAC Retro Matte Lipstick", price: "$22" }, budget: { store: "Target", item: "NYX Suede Matte Lip", price: "$8" } },
  eye:          { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Eyes to Mesmerize", price: "$34" }, mid: { store: "Fenty Beauty", item: "Fenty Beauty Snap Shadows", price: "$28" }, budget: { store: "Amazon", item: "e.l.f. Bite Size Eyeshadow", price: "$3" } },
  makeup:       { luxury: { store: "Charlotte Tilbury", item: "Charlotte Tilbury Pillow Talk Set", price: "$75" }, mid: { store: "Fenty Beauty", item: "Fenty Beauty Essentials Set", price: "$42" }, budget: { store: "Amazon", item: "e.l.f. Flawless Face Kit", price: "$12" } },
  hair:         { luxury: { store: "Sephora", item: "Oribe Gold Lust Shampoo & Conditioner", price: "$92" }, mid: { store: "Ulta", item: "Moroccanoil Treatment", price: "$38" }, budget: { store: "Amazon", item: "OGX Argan Oil of Morocco Shampoo", price: "$8" } },
  perfume:      { luxury: { store: "Sephora", item: "Le Labo Santal 33 EDP", price: "$310" }, mid: { store: "Ulta", item: "Sol de Janeiro Cheirosa '62", price: "$35" }, budget: { store: "Amazon", item: "Raw Spirit Wild Fire Rollerball", price: "$15" } },
  nails:        { luxury: { store: "Nordstrom", item: "Chanel Le Vernis Nail Colour", price: "$30" }, mid: { store: "Ulta", item: "OPI Infinite Shine", price: "$13" }, budget: { store: "Amazon", item: "Essie Nail Polish", price: "$8" } },
  lashes:       { luxury: { store: "Sephora", item: "Lilly Lashes 3D Mink Lashes", price: "$30" }, mid: { store: "Ulta", item: "Ardell Demi Wispies", price: "$5" }, budget: { store: "Amazon", item: "KISS Lash Couture Faux Mink", price: "$5" } },
  brush:        { luxury: { store: "Sephora", item: "Artis Elite Oval 7 Brush", price: "$75" }, mid: { store: "Ulta", item: "Real Techniques Everyday Essentials Set", price: "$20" }, budget: { store: "Amazon", item: "BS-MALL Makeup Brush Set 14pc", price: "$10" } },
  sponge:       { luxury: { store: "Sephora", item: "Beautyblender Original", price: "$20" }, mid: { store: "Ulta", item: "Real Techniques Miracle Sponge", price: "$6" }, budget: { store: "Amazon", item: "AOA Studio Paw Paw Sponge", price: "$1" } },
  gloss:        { luxury: { store: "Fenty Beauty", item: "Fenty Beauty Gloss Bomb Universal", price: "$22" }, mid: { store: "Rare Beauty", item: "Rare Beauty Soft Pinch Tinted Lip Oil", price: "$20" }, budget: { store: "Amazon", item: "essence Extreme Shine Lip Gloss", price: "$3" } },
};

const getBeautyStores = (item: string) => {
  return findMatch(item, beautyStoreMap) || {
    luxury: { store: "Charlotte Tilbury", item, price: "$30+" },
    mid: { store: "MAC", item, price: "$10–20" },
    budget: { store: "Amazon", item, price: "$5–12" },
  };
};

const findMatch = (item: string, map: Record<string, any>) => {
  const lower = item.toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return null;
};

const getClothingStores = (item: string) => {
  return findMatch(item, clothingStoreMap) || findMatch(item, beautyStoreMap) || {
    luxury: { store: "Nordstrom", item, price: "$150+" },
    mid: { store: "Zara", item, price: "$40–80" },
    budget: { store: "H&M", item, price: "$15–30" },
  };
};

const getAccessoryStores = (item: string) => {
  return findMatch(item, accessoryStoreMap) || findMatch(item, beautyStoreMap) || {
    luxury: { store: "Nordstrom", item, price: "$150+" },
    mid: { store: "Mango", item, price: "$40–80" },
    budget: { store: "Amazon", item, price: "$10–25" },
  };
};

const InspirationResultScreen = ({ prefs, styledImageUrl, styleProfile, onBack, onHome, onSave, onRegenerate, showWatermark }: Props) => {
  const [viewMode, setViewMode] = useState<"compare" | "image">("compare");
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const isMale = prefs.gender === "male";
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const hasOriginal = !!prefs.photoBase64;
  const hasStyled = !!styledImageUrl;
  const hotspotPositions = getHotspotPositions(isMale);

  const profile = styleProfile || {
    styleName: "Inspired Aesthetic",
    clothingTypes: [],
    colorPalette: [],
    fitPreferences: [],
    accessories: [],
    makeupStyle: "",
    hairTrend: "",
    overallVibe: "",
    detailedPrompt: "",
  };

  // Build shop items from profile data for hotspot categories
  const getHotspotShopItems = (hotspotId: HotspotId): ShopItem[] => {
    switch (hotspotId) {
      case "makeup":
        return [
          ...(profile.makeupStyle ? [{ label: profile.makeupStyle, stores: getBeautyStores(profile.makeupStyle) }] : []),
          ...(profile.hairTrend ? [{ label: profile.hairTrend, stores: getBeautyStores(profile.hairTrend) }] : []),
        ];
      case "top":
        return profile.clothingTypes
          .filter(c => {
            const l = c.toLowerCase();
            return l.includes("top") || l.includes("shirt") || l.includes("blouse") || l.includes("sweater") || l.includes("jacket") || l.includes("coat") || l.includes("hoodie") || l.includes("turtleneck") || l.includes("cami") || l.includes("vest") || l.includes("cardigan") || l.includes("blazer") || l.includes("tank") || l.includes("crop") || l.includes("polo") || l.includes("tee");
          })
          .map(c => ({ label: c, stores: getClothingStores(c) }));
      case "bottom":
        return profile.clothingTypes
          .filter(c => {
            const l = c.toLowerCase();
            return l.includes("pant") || l.includes("jean") || l.includes("skirt") || l.includes("trouser") || l.includes("short") || l.includes("jogger") || l.includes("legging") || l.includes("denim");
          })
          .map(c => ({ label: c, stores: getClothingStores(c) }));
      case "shoes":
        return profile.clothingTypes
          .filter(c => {
            const l = c.toLowerCase();
            return l.includes("shoe") || l.includes("boot") || l.includes("sneaker") || l.includes("heel") || l.includes("sandal") || l.includes("loafer") || l.includes("flat");
          })
          .map(c => ({ label: c, stores: getClothingStores(c) }));
      case "accessories":
        return profile.accessories.map(a => ({ label: a, stores: getAccessoryStores(a) }));
      default:
        return [];
    }
  };

  // Get a shop link for a hotspot click
  const getHotspotShopLink = (hotspotId: HotspotId): string => {
    const items = getHotspotShopItems(hotspotId);
    if (items.length > 0 && items[0].stores) {
      const tier = items[0].stores.mid || items[0].stores.budget || items[0].stores.luxury;
      return getShopUrl(tier.store, tier.item);
    }
    return getShopUrl("Amazon", hotspotPositions[hotspotId].searchTerm);
  };

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40, overflowY: "auto" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div style={{ flex: 1 }}>
          <div className="header-title">{profile.styleName}</div>
          <div className="header-sub">AI-Inspired Look</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Overall vibe */}
        {profile.overallVibe && (
          <div className="glamora-card anim-fadeUp" style={{
            padding: "14px 16px", marginBottom: 16,
            border: `1.5px solid hsla(${accent} / 0.15)`,
            background: `linear-gradient(160deg, hsla(${accent} / 0.05), hsl(var(--card)))`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Sparkles size={16} color={`hsl(${accent})`} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Aesthetic Vibe</span>
            </div>
            <div style={{ fontSize: 14, color: "hsl(var(--glamora-char))", lineHeight: 1.5 }}>{profile.overallVibe}</div>
          </div>
        )}

        {/* Look Price Summary */}
        {hasStyled && (() => {
          const allShopItems: ShopItem[] = [
            ...getHotspotShopItems("makeup"),
            ...getHotspotShopItems("top"),
            ...getHotspotShopItems("bottom"),
            ...getHotspotShopItems("shoes"),
            ...getHotspotShopItems("accessories"),
          ];
          return allShopItems.length > 0 ? <DynamicPriceCard items={allShopItems} /> : null;
        })()}

        {/* Image display */}
        {viewMode === "compare" && hasOriginal && hasStyled ? (
          <div className="glamora-card anim-fadeUp d2" style={{ overflow: "hidden", borderRadius: 22, position: "relative" }}>
            {showWatermark && <Watermark />}
            <BeforeAfterSlider beforeSrc={prefs.photoBase64!} afterSrc={styledImageUrl!} />
          </div>
        ) : (
          <div className="glamora-card anim-fadeUp d2" style={{ position: "relative", overflow: "hidden", borderRadius: 22 }}>
            {showWatermark && <Watermark />}
            {styledImageUrl ? (
              <img src={styledImageUrl} alt="Inspired look" style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 22, display: "block" }} />
            ) : (
              <div style={{
                width: "100%", height: 420, borderRadius: 22,
                background: "linear-gradient(160deg, hsl(var(--glamora-char)) 0%, hsl(var(--glamora-char2)) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
              }}>
                <Sparkles size={56} color="hsl(var(--glamora-gray))" strokeWidth={1} />
                <div style={{ fontSize: 14, color: "hsl(var(--glamora-gray-light))" }}>AI-inspired image</div>
              </div>
            )}

            {/* Hotspot overlays — tap to shop */}
            {hasStyled && Object.entries(hotspotPositions).map(([id, pos]) => {
              const isActive = activeHotspot === id;
              return (
                <button
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isActive) {
                      window.open(getHotspotShopLink(id as HotspotId), "_blank", "noopener,noreferrer");
                    } else {
                      setActiveHotspot(id as HotspotId);
                    }
                  }}
                  style={{
                    position: "absolute", top: pos.top, left: pos.left, transform: "translate(-50%, -50%)",
                    width: isActive ? 48 : 36, height: isActive ? 48 : 36, borderRadius: "50%",
                    background: isActive
                      ? `linear-gradient(135deg, hsl(${accent}), hsl(var(--glamora-gold-light)))`
                      : "hsla(0 0% 0% / 0.55)",
                    backdropFilter: "blur(8px)",
                    border: isActive ? "2px solid hsl(var(--glamora-gold-light))" : "2px solid hsla(255 255 255 / 0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.25s ease",
                    boxShadow: isActive ? `0 4px 20px hsla(${accent} / 0.5)` : "0 2px 10px hsla(0 0% 0% / 0.3)",
                    animation: isActive ? "none" : "pulse2 2.5s ease-in-out infinite",
                  }}
                >
                  {isActive ? <ExternalLink size={20} color="white" /> : <pos.Icon size={16} color="white" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Hotspot shop panel */}
        {activeHotspot && (() => {
          const shopItems = getHotspotShopItems(activeHotspot);
          return (
            <div className="anim-fadeUp" style={{ marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                {(() => { const HIcon = hotspotPositions[activeHotspot].Icon; return <HIcon size={20} color={`hsl(${accent})`} />; })()}
                <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                  Shop {hotspotPositions[activeHotspot].label}
                </div>
              </div>
              {shopItems.length > 0 ? (
                <ShopPanel items={shopItems} accent={accent} />
              ) : (
                <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 8 }}>
                  No specific items found — tap the hotspot again to search
                </div>
              )}
            </div>
          );
        })()}

        {/* View mode toggle - only show when both images available */}
        {hasOriginal && hasStyled && (
          <div className="anim-fadeUp d3" style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => { setViewMode("compare"); setActiveHotspot(null); }} style={{
              flex: 1, padding: "10px 6px", borderRadius: 12, border: "1.5px solid",
              borderColor: viewMode === "compare" ? `hsl(${accent})` : "hsla(var(--glamora-gray-light) / 0.2)",
              background: viewMode === "compare" ? `hsla(${accent} / 0.12)` : "transparent",
              cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600,
              color: viewMode === "compare" ? `hsl(${accent})` : "hsl(var(--glamora-gray))",
              transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              <Sparkles size={14} /> Compare
            </button>
            <button onClick={() => setViewMode("image")} style={{
              flex: 1, padding: "10px 6px", borderRadius: 12, border: "1.5px solid",
              borderColor: viewMode === "image" ? `hsl(${accent})` : "hsla(var(--glamora-gray-light) / 0.2)",
              background: viewMode === "image" ? `hsla(${accent} / 0.12)` : "transparent",
              cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600,
              color: viewMode === "image" ? `hsl(${accent})` : "hsl(var(--glamora-gray))",
              transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              <Shirt size={14} /> Shop Image
            </button>
          </div>
        )}

        {/* Style profile tags */}
        <div className="anim-fadeUp d3" style={{ marginTop: 16 }}>
          {/* Color Palette */}
          {profile.colorPalette.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Palette size={14} color={`hsl(${accent})`} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Color Palette</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.colorPalette.map((c) => <span key={c} className="pill-tag">{c}</span>)}
              </div>
            </div>
          )}

          {/* Clothing */}
          {profile.clothingTypes.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Shirt size={14} color={`hsl(${accent})`} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Clothing</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.clothingTypes.map((c) => <span key={c} className="pill-tag">{c}</span>)}
              </div>
            </div>
          )}

          {/* Fit */}
          {profile.fitPreferences.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Gem size={14} color={`hsl(${accent})`} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Fit & Accessories</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[...profile.fitPreferences, ...profile.accessories].map((c) => <span key={c} className="pill-tag">{c}</span>)}
              </div>
            </div>
          )}

          {/* Beauty */}
          {(profile.makeupStyle || profile.hairTrend) && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Scissors size={14} color={`hsl(${accent})`} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Beauty & Hair</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.makeupStyle && <span className="pill-tag">{profile.makeupStyle}</span>}
                {profile.hairTrend && <span className="pill-tag">{profile.hairTrend}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Shop This Look — always show when there's profile data */}
        {(profile.clothingTypes.length > 0 || profile.accessories.length > 0 || profile.makeupStyle || profile.hairTrend) && (() => {
          const shopItems: ShopItem[] = [
            ...profile.clothingTypes.map((item) => ({
              label: item,
              stores: getClothingStores(item),
            })),
            ...profile.accessories.map((item) => ({
              label: item,
              stores: getAccessoryStores(item),
            })),
            ...(profile.makeupStyle ? [{
              label: profile.makeupStyle,
              stores: getBeautyStores(profile.makeupStyle),
            }] : []),
            ...(profile.hairTrend ? [{
              label: profile.hairTrend,
              stores: getBeautyStores(profile.hairTrend),
            }] : []),
          ];
          return (
            <div className="anim-fadeUp d4" style={{ marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <ExternalLink size={16} color={`hsl(${accent})`} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Shop This Look</span>
              </div>
              <ShopPanel items={shopItems} accent={accent} />
            </div>
          );
        })()}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-primary btn-sm" style={{ flex: 1, background: `linear-gradient(135deg, hsl(${accent}), hsl(var(--glamora-gold-light)))` }}
            onClick={() => onSave(profile.styleName)}>
            <Bookmark size={16} /> Save
          </button>
          <ShareMenu text={`Check out my "${profile.styleName}" look on Glosseti!`} imageUrl={styledImageUrl || undefined} />
          {hasStyled && (
            <button className="btn-primary btn-sm btn-ghost" style={{ flex: 1 }}
              onClick={() => handleDownload(styledImageUrl!)}>
              <Download size={16} /> Save
            </button>
          )}
        </div>

        {/* Regenerate */}
        <button
          className="btn-primary btn-ghost anim-fadeUp d5"
          style={{ marginTop: 12 }}
          onClick={onRegenerate}
        >
          <Sparkles size={16} /> Refine with Gio AI
        </button>

        {/* Home */}
        <button className="btn-primary btn-ghost" style={{ marginTop: 10 }} onClick={onHome}>
          Back to Home
        </button>

        {/* Disclaimer */}
        <div className="anim-fadeUp d6" style={{
          marginTop: 16, padding: "10px 14px", borderRadius: 12,
          background: "hsla(var(--glamora-gold-pale) / 0.5)",
          border: "1px solid hsla(var(--glamora-gold) / 0.12)",
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <Info size={13} color="hsl(var(--glamora-gold))" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", lineHeight: 1.5 }}>
            Styles are AI-generated and inspired by general trends. Glosseti is not affiliated with or endorsed by any public figures.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationResultScreen;

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "Deal" | "Bestseller" | "New" | "Trending";
  description: string;
  specs: { label: string; value: string }[];
  stock: number;
};

const IMG = (q: string, sig: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=80&sig=${sig}`;

export const categories = [
  { slug: "electronics", name: "Electronics", icon: "💻" },
  { slug: "fashion", name: "Fashion", icon: "👟" },
  { slug: "home", name: "Home", icon: "🛋️" },
  { slug: "beauty", name: "Beauty", icon: "💄" },
  { slug: "sports", name: "Sports", icon: "⚽" },
  { slug: "books", name: "Books", icon: "📚" },
  { slug: "toys", name: "Toys", icon: "🎮" },
  { slug: "grocery", name: "Grocery", icon: "🛒" },
];

const rawProducts: Product[] = [
  {
    id: "p1", name: "Aurora Pro Wireless Headphones", brand: "Sonara", category: "electronics",
    price: 12999, mrp: 19999, rating: 4.6, reviews: 2341, badge: "Bestseller",
    image: "photo-1505740420928-5e560c06d30e",
    description: "Studio-grade ANC over-ear headphones with 40h battery and spatial audio.",
    specs: [{label:"Battery",value:"40 hours"},{label:"Driver",value:"40mm"},{label:"ANC",value:"Hybrid Active"},{label:"Weight",value:"245g"}],
    stock: 42,
  },
  {
    id: "p2", name: "Nimbus X Gaming Laptop", brand: "Volt", category: "electronics",
    price: 68999, mrp: 89999, rating: 4.7, reviews: 891, badge: "Deal",
    image: "photo-1593642632559-0c6d3fc62b89",
    description: "RTX 4060, Ryzen 7, 16GB DDR5, 1TB NVMe. 165Hz QHD display.",
    specs: [{label:"GPU",value:"RTX 4060"},{label:"CPU",value:"Ryzen 7 7840HS"},{label:"RAM",value:"16GB DDR5"},{label:"Display",value:"15.6\" 165Hz"}],
    stock: 18,
  },
  {
    id: "p3", name: "Velocity Runner Sneakers", brand: "Striide", category: "fashion",
    price: 4499, mrp: 6999, rating: 4.4, reviews: 1207, badge: "Trending",
    image: "photo-1542291026-7eec264c27ff",
    description: "Lightweight running shoes with carbon plate and breathable mesh upper.",
    specs: [{label:"Drop",value:"8mm"},{label:"Weight",value:"220g"},{label:"Plate",value:"Carbon"},{label:"Use",value:"Road"}],
    stock: 75,
  },
  {
    id: "p4", name: "Lumen Smartwatch 7", brand: "Pulse", category: "electronics",
    price: 18999, mrp: 24999, rating: 4.5, reviews: 3210, badge: "New",
    image: "photo-1523275335684-37898b6baf30",
    description: "AMOLED always-on display, ECG, SpO2, 7-day battery.",
    specs: [{label:"Display",value:"1.9\" AMOLED"},{label:"Battery",value:"7 days"},{label:"Water",value:"5ATM"},{label:"GPS",value:"Dual-band"}],
    stock: 120,
  },
  {
    id: "p5", name: "Cloudrest Memory Foam Pillow", brand: "Hush", category: "home",
    price: 1499, mrp: 2499, rating: 4.3, reviews: 540,
    image: "photo-1584100936595-c0654b55a2e2",
    description: "Cooling gel-infused memory foam pillow with ergonomic contour.",
    specs: [{label:"Material",value:"Memory Foam"},{label:"Cover",value:"Bamboo"},{label:"Type",value:"Contour"},{label:"Warranty",value:"2 years"}],
    stock: 200,
  },
  {
    id: "p6", name: "Glow Vitamin C Serum", brand: "Lumière", category: "beauty",
    price: 899, mrp: 1499, rating: 4.6, reviews: 4128, badge: "Bestseller",
    image: "photo-1556228720-195a672e8a03",
    description: "20% Vitamin C + Hyaluronic Acid. Brightens & evens skin tone.",
    specs: [{label:"Volume",value:"30ml"},{label:"Skin",value:"All"},{label:"Vegan",value:"Yes"},{label:"Paraben",value:"Free"}],
    stock: 310,
  },
  {
    id: "p7", name: "Flex Pro Yoga Mat", brand: "Zenith", category: "sports",
    price: 1799, mrp: 2999, rating: 4.5, reviews: 678,
    image: "photo-1599447421416-3414500d18a5",
    description: "6mm non-slip eco-TPE yoga mat with alignment lines.",
    specs: [{label:"Thickness",value:"6mm"},{label:"Material",value:"TPE"},{label:"Size",value:"183x61cm"},{label:"Weight",value:"1.1kg"}],
    stock: 88,
  },
  {
    id: "p8", name: "The Quiet Algorithm", brand: "Inkwell Press", category: "books",
    price: 399, mrp: 599, rating: 4.8, reviews: 2156, badge: "Trending",
    image: "photo-1544716278-ca5e3f4abd8c",
    description: "A literary thriller about AI, memory, and the data we leave behind.",
    specs: [{label:"Pages",value:"384"},{label:"Format",value:"Paperback"},{label:"Language",value:"English"},{label:"Genre",value:"Thriller"}],
    stock: 500,
  },
  {
    id: "p9", name: "Orbit Drone 4K", brand: "Skylark", category: "electronics",
    price: 32999, mrp: 44999, rating: 4.4, reviews: 412, badge: "New",
    image: "photo-1473968512647-3e447244af8f",
    description: "4K HDR camera drone with 35-min flight and obstacle avoidance.",
    specs: [{label:"Camera",value:"4K/60fps"},{label:"Flight",value:"35 min"},{label:"Range",value:"10km"},{label:"Weight",value:"249g"}],
    stock: 22,
  },
  {
    id: "p10", name: "Ember Roast Coffee Beans 1kg", brand: "Brew & Bloom", category: "grocery",
    price: 749, mrp: 999, rating: 4.7, reviews: 1890, badge: "Bestseller",
    image: "photo-1559056199-641a0ac8b55e",
    description: "Single-origin Ethiopian Yirgacheffe. Notes of citrus & dark chocolate.",
    specs: [{label:"Origin",value:"Ethiopia"},{label:"Roast",value:"Medium-Dark"},{label:"Weight",value:"1kg"},{label:"Type",value:"Whole Bean"}],
    stock: 240,
  },
  {
    id: "p11", name: "Tactic Builder Block Set", brand: "Kido", category: "toys",
    price: 2299, mrp: 3499, rating: 4.6, reviews: 720,
    image: "photo-1558877385-81a1c7e67d72",
    description: "1500-piece modular building set sparking creativity and STEM skills.",
    specs: [{label:"Pieces",value:"1500"},{label:"Age",value:"8+"},{label:"Material",value:"ABS"},{label:"Awards",value:"3"}],
    stock: 60,
  },
  {
    id: "p12", name: "Voyager Leather Backpack", brand: "Harbor & Co.", category: "fashion",
    price: 3999, mrp: 6499, rating: 4.5, reviews: 1045, badge: "Deal",
    image: "photo-1553062407-98eeb64c6a62",
    description: "Full-grain leather backpack with padded laptop sleeve & USB port.",
    specs: [{label:"Material",value:"Full-grain Leather"},{label:"Capacity",value:"22L"},{label:"Laptop",value:"15.6\""},{label:"Warranty",value:"5 years"}],
    stock: 95,
  },
];

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  badge: p.badge as Product["badge"],
  image: IMG(p.image, Number(p.id.slice(1))),
}));

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);

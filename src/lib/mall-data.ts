export const ADMIN = {
  name: "Eceo Admin",
  role: "Founder & CEO",
  handle: "meremoth admin",
  whatsapp: "653779134",
  whatsappIntl: "237653779134",
  email: "support@meremothmall.com",
  location: "Douala, Cameroon",
  timezone: "Africa/Douala",
  hours: "8AM - 9PM everyday",
};

export const ADMIN_WA_LINK =
  "https://wa.me/237653779134?text=Hello%20meremoth%20admin%20Eceo%20from%20meremoth%20mall";

export function waLink(phoneIntl: string, text: string) {
  return `https://wa.me/${phoneIntl}?text=${encodeURIComponent(text)}`;
}

export function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export function usd(n: number) {
  return "≈ $" + (n / 615).toFixed(2) + " USD";
}

export type CategoryId =
  | "products"
  | "services"
  | "consultants"
  | "builders"
  | "real-estate"
  | "vehicles"
  | "jobs"
  | "food"
  | "education"
  | "hotels"
  | "transport";

export const DOUALA_AREAS = [
  "Akwa",
  "Bonapriso",
  "Bonaberi",
  "Deido",
  "Bonanjo",
  "Bali",
  "Kotto",
  "Bonamoussadi",
  "Logbessou",
  "Ndokoti",
];

export type Category = {
  id: CategoryId;
  name: string;
  icon: string;
  count: string;
  isNew?: boolean;
  subs: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "products",
    name: "Products",
    icon: "Footprints",
    count: "1.2k items",
    subs: [
      "Electronics",
      "Fashion & Shoes",
      "Phones",
      "PPE Safety (Boots, Gloves, Helmets, Workwear)",
      "Building Materials (Cement, Iron Rods, Tiles)",
    ],
  },
  {
    id: "services",
    name: "Services",
    icon: "Brush",
    count: "320 services",
    subs: [
      "Cleaning Service — 10,000 FCFA/hr",
      "Repair Service — 12,000 FCFA/hr",
      "Painter (Interior / Exterior / POP) — 1,500 FCFA/m²",
      "Plumbing",
      "Electrical",
      "Mechanic",
      "Hairdressing",
      "Photography",
      "Laundry",
    ],
  },
  {
    id: "consultants",
    name: "Consultants",
    icon: "BriefcaseBusiness",
    count: "45 consultants",
    subs: [
      "Business Consultant — Eceo Business Advisory 15,000 FCFA/hr",
      "Legal Consultant",
      "IT Consultant",
      "Medical Doctor Online",
      "Marketing Consultant",
      "Education Consultant",
    ],
  },
  {
    id: "builders",
    name: "Builders & House Plans",
    icon: "Hammer",
    count: "78 plans",
    subs: [
      "Mason",
      "Carpenter",
      "Welder",
      "Painter",
      "Tiler",
      "Electrician",
      "Plumber",
      "Full House Contractor — from 500,000 FCFA",
      "House Plan Designer",
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "House",
    count: "120 listings",
    isNew: true,
    subs: [
      "House for Rent",
      "Apartment",
      "Land for Sale",
      "Room to Rent",
      "Shop for Rent",
      "Plot",
    ],
  },
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "Car",
    count: "98 vehicles",
    isNew: true,
    subs: ["Cars for Sale", "Motorbikes", "Trucks", "Buses", "Car Hire / Rental", "Spare Parts"],
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: "Briefcase",
    count: "64 jobs",
    isNew: true,
    subs: ["Job Offer", "Job Seeker CV", "Domestic Worker", "Driver", "Security"],
  },
  {
    id: "food",
    name: "Food",
    icon: "UtensilsCrossed",
    count: "210 restaurants",
    isNew: true,
    subs: ["Eru", "Ndole", "Achu", "Grills", "Delivery"],
  },
  {
    id: "education",
    name: "Education",
    icon: "GraduationCap",
    count: "56 courses",
    subs: [
      "Computer Training — 25,000 FCFA",
      "Language (English / French)",
      "Driving School",
      "Professional Training",
    ],
  },
];

export type Seller = {
  id: string;
  name: string;
  phoneIntl: string;
  phone: string;
  verified: boolean;
  pro?: boolean;
  country: string;
  flag: string;
  rating: number;
  jobs: number;
};

export const SELLERS: Record<string, Seller> = {
  s1: {
    id: "s1",
    name: "Sparkle Clean Services",
    phoneIntl: "237653779134",
    phone: "+237 653 779 134",
    verified: true,
    pro: true,
    country: "Cameroon",
    flag: "🇨🇲",
    rating: 4.9,
    jobs: 132,
  },
  s2: {
    id: "s2",
    name: "Paul Mbarga — Painter",
    phoneIntl: "237653779134",
    phone: "+237 653 779 134",
    verified: true,
    pro: true,
    country: "Cameroon",
    flag: "🇨🇲",
    rating: 4.9,
    jobs: 32,
  },
  s3: {
    id: "s3",
    name: "Eceo Business Advisory",
    phoneIntl: "237653779134",
    phone: "+237 653 779 134",
    verified: true,
    pro: true,
    country: "Cameroon",
    flag: "🇨🇲",
    rating: 5,
    jobs: 58,
  },
  s4: {
    id: "s4",
    name: "Douala Land & Homes",
    phoneIntl: "237653779134",
    phone: "+237 653 779 134",
    verified: true,
    country: "Cameroon",
    flag: "🇨🇲",
    rating: 4.7,
    jobs: 41,
  },
  s5: {
    id: "s5",
    name: "Global Tech Store",
    phoneIntl: "237653779134",
    phone: "+237 653 779 134",
    verified: false,
    country: "Nigeria",
    flag: "🇳🇬",
    rating: 4.6,
    jobs: 210,
  },
};

export type Listing = {
  id: string;
  title: string;
  category: CategoryId;
  sub: string;
  price: number;
  priceUnit?: string;
  originalPrice?: number;
  condition: "Brand New" | "Okaza / Second Hand" | "Service";
  location: string;
  rating: number;
  reviews: number;
  sold?: number;
  sellerId: string;
  description: string;
  specs: Record<string, string>;
  emoji: string;
  sponsored?: boolean;
  featured?: boolean;
};

export const LISTINGS: Listing[] = [
  {
    id: "wireless-headphones",
    title: "Wireless Headphones",
    category: "products",
    sub: "Electronics",
    price: 27000,
    originalPrice: 33000,
    condition: "Brand New",
    location: "Douala, Akwa",
    rating: 4.8,
    reviews: 96,
    sold: 230,
    sellerId: "s5",
    description:
      "Bluetooth 5.3 over-ear headphones with active noise cancelling and 40 hours battery life.",
    specs: { Battery: "40 hours", Bluetooth: "5.3", Warranty: "6 months", Colour: "Black" },
    emoji: "🎧",
    featured: true,
  },
  {
    id: "smart-watch-pro",
    title: "Smart Watch Pro",
    category: "products",
    sub: "Electronics",
    price: 38000,
    condition: "Brand New",
    location: "Douala, Bonapriso",
    rating: 4.6,
    reviews: 64,
    sold: 180,
    sellerId: "s5",
    description: "Fitness tracking, heart rate, AMOLED display and 7-day battery.",
    specs: { Screen: "1.4in AMOLED", Battery: "7 days", Waterproof: "IP68" },
    emoji: "⌚",
    featured: true,
  },
  {
    id: "safety-boots",
    title: "PPE Safety Boots — Steel Toe",
    category: "products",
    sub: "PPE Safety",
    price: 18000,
    condition: "Brand New",
    location: "Douala, Bonaberi",
    rating: 4.7,
    reviews: 33,
    sold: 120,
    sellerId: "s4",
    description: "Anti-perforation sole, steel toe cap. Sizes 39 to 46. Site approved.",
    specs: { Sizes: "39 - 46", Standard: "EN ISO 20345", Material: "Leather" },
    emoji: "🥾",
  },
  {
    id: "gloves-12kv",
    title: "Insulating Gloves 12kV",
    category: "products",
    sub: "PPE Safety",
    price: 25000,
    condition: "Brand New",
    location: "Douala, Akwa",
    rating: 4.9,
    reviews: 21,
    sold: 74,
    sellerId: "s4",
    description: "Dielectric latex gloves tested at 12kV for electrical work.",
    specs: { Rating: "12kV", Class: "Class 2", Material: "Latex" },
    emoji: "🧤",
  },
  {
    id: "sparkle-clean",
    title: "Sparkle Clean — Home & Office Cleaning",
    category: "services",
    sub: "Cleaning Service",
    price: 10000,
    priceUnit: "/hr",
    condition: "Service",
    location: "Douala (all areas)",
    rating: 4.9,
    reviews: 128,
    sellerId: "s1",
    description: "Deep cleaning, post-construction cleaning and weekly office contracts.",
    specs: { Team: "2 - 6 cleaners", Response: "Same day", Coverage: "Douala" },
    emoji: "🧹",
    sponsored: true,
  },
  {
    id: "fixit-repair",
    title: "FixIt Repair — Appliance & Home Repair",
    category: "services",
    sub: "Repair Service",
    price: 12000,
    priceUnit: "/hr",
    condition: "Service",
    location: "Douala, Kotto",
    rating: 4.7,
    reviews: 88,
    sellerId: "s1",
    description: "Fridge, AC, generator and general home repairs by certified technicians.",
    specs: { Callout: "Free within Douala", Warranty: "30 days" },
    emoji: "🛠️",
  },
  {
    id: "painter-paul",
    title: "Paul Mbarga — Painting & POP Design",
    category: "services",
    sub: "Painter",
    price: 1500,
    priceUnit: "/m²",
    condition: "Service",
    location: "Douala, Bonamoussadi",
    rating: 4.9,
    reviews: 32,
    sellerId: "s2",
    description: "Interior, exterior and POP ceiling design. 32 completed jobs.",
    specs: { Experience: "9 years", Crew: "4 painters", Warranty: "1 year finish" },
    emoji: "🎨",
  },
  {
    id: "eceo-advisory",
    title: "Eceo Business Advisory — Business Consultant",
    category: "consultants",
    sub: "Business Consultant",
    price: 15000,
    priceUnit: "/hr",
    condition: "Service",
    location: "Douala / Online",
    rating: 5,
    reviews: 58,
    sellerId: "s3",
    description:
      "Business registration, growth strategy, funding readiness and market entry for Cameroon.",
    specs: { Format: "Online or in person", Session: "60 minutes", Language: "EN / FR" },
    emoji: "💼",
    featured: true,
  },
  {
    id: "plan-3bed",
    title: "Modern 3-Bedroom House Plan",
    category: "builders",
    sub: "House Plan Designer",
    price: 25000,
    condition: "Brand New",
    location: "Digital download",
    rating: 4.8,
    reviews: 44,
    sellerId: "s2",
    description:
      "Complete plan pack: floor plan, 3D render, PDF download, Bill of Quantities and construction cost estimate.",
    specs: { Area: "120 m²", Bedrooms: "3", Bathrooms: "2", Includes: "PDF + BOQ + 3D render" },
    emoji: "📐",
  },
  {
    id: "plan-duplex",
    title: "4-Bedroom Duplex House Plan",
    category: "builders",
    sub: "House Plan Designer",
    price: 80000,
    condition: "Brand New",
    location: "Digital download",
    rating: 4.9,
    reviews: 19,
    sellerId: "s2",
    description: "Duplex plan with full working drawings, BOQ and estimated construction cost.",
    specs: { Area: "180 m²", Bedrooms: "4", Bathrooms: "3", Includes: "PDF + BOQ + 3D render" },
    emoji: "🏡",
  },
  {
    id: "plan-2bed",
    title: "2-Bedroom House Plan",
    category: "builders",
    sub: "House Plan Designer",
    price: 25000,
    condition: "Brand New",
    location: "Digital download",
    rating: 4.6,
    reviews: 12,
    sellerId: "s2",
    description: "Compact and affordable 2-bedroom plan with full construction documents.",
    specs: { Area: "90 m²", Bedrooms: "2", Bathrooms: "1", Includes: "PDF + BOQ" },
    emoji: "📏",
  },
  {
    id: "land-bonaberi",
    title: "500 m² Plot — Bonaberi",
    category: "real-estate",
    sub: "Land for Sale",
    price: 1200000,
    condition: "Brand New",
    location: "Douala, Bonaberi",
    rating: 4.8,
    reviews: 9,
    sellerId: "s4",
    description: "Fenced plot with land title, aerial drone view available. Ready to build.",
    specs: { Area: "500 m²", Documents: "Land title", Access: "Tarred road" },
    emoji: "🗺️",
    featured: true,
  },
  {
    id: "land-logbessou",
    title: "1000 m² Plot — Logbessou",
    category: "real-estate",
    sub: "Land for Sale",
    price: 2500000,
    condition: "Brand New",
    location: "Douala, Logbessou",
    rating: 4.7,
    reviews: 6,
    sellerId: "s4",
    description: "Large plot suitable for duplex or small estate. Drone survey on request.",
    specs: { Area: "1000 m²", Documents: "Land title", Access: "Motorable" },
    emoji: "🛰️",
  },
  {
    id: "apartment-kotto",
    title: "3-Bedroom Apartment for Rent — Kotto",
    category: "real-estate",
    sub: "Apartment",
    price: 150000,
    priceUnit: "/month",
    condition: "Brand New",
    location: "Douala, Kotto",
    rating: 4.5,
    reviews: 14,
    sellerId: "s4",
    description: "Modern apartment with parking, water tank and 24h security.",
    specs: { Area: "110 m²", Bedrooms: "3", Bathrooms: "2", Parking: "Yes" },
    emoji: "🏢",
  },
  {
    id: "toyota-corolla",
    title: "Toyota Corolla 2012",
    category: "vehicles",
    sub: "Cars for Sale",
    price: 4500000,
    condition: "Okaza / Second Hand",
    location: "Douala, Ndokoti",
    rating: 4.4,
    reviews: 11,
    sellerId: "s4",
    description: "Clean registered Corolla, AC working, new tyres.",
    specs: { Year: "2012", Fuel: "Petrol", Mileage: "142,000 km", Transmission: "Automatic" },
    emoji: "🚗",
  },
  {
    id: "car-hire",
    title: "Car Hire — Toyota Hilux with Driver",
    category: "vehicles",
    sub: "Car Hire / Rental",
    price: 45000,
    priceUnit: "/day",
    condition: "Service",
    location: "Douala",
    rating: 4.8,
    reviews: 27,
    sellerId: "s4",
    description: "Daily hire with professional driver, fuel not included.",
    specs: { Seats: "5", Driver: "Included", Area: "Cameroon wide" },
    emoji: "🛻",
  },
  {
    id: "job-driver",
    title: "Company Driver Wanted — Douala",
    category: "jobs",
    sub: "Job Offer",
    price: 120000,
    priceUnit: "/month",
    condition: "Service",
    location: "Douala, Bonapriso",
    rating: 4.5,
    reviews: 3,
    sellerId: "s1",
    description: "Full-time driver for a logistics company. Valid licence and 3 years experience.",
    specs: { Type: "Full-time", Company: "Sparkle Group", Experience: "3 years" },
    emoji: "🧑‍✈️",
  },
  {
    id: "job-security",
    title: "Security Guard — Night Shift",
    category: "jobs",
    sub: "Security",
    price: 90000,
    priceUnit: "/month",
    condition: "Service",
    location: "Douala, Akwa",
    rating: 4.2,
    reviews: 2,
    sellerId: "s1",
    description: "Night shift security officer for office complex.",
    specs: { Type: "Full-time", Shift: "Night", Company: "Sparkle Group" },
    emoji: "🛡️",
  },
  {
    id: "food-eru",
    title: "Mama's Eru & Water Fufu",
    category: "food",
    sub: "Eru",
    price: 1500,
    condition: "Service",
    location: "Douala, Deido",
    rating: 4.9,
    reviews: 214,
    sellerId: "s1",
    description: "Fresh Eru cooked daily. Delivery within Douala in 45 minutes.",
    specs: { Delivery: "45 min", "Delivery fee": "500 FCFA", Hours: "10AM - 9PM" },
    emoji: "🍲",
  },
  {
    id: "food-ndole",
    title: "Ndole Special with Plantain",
    category: "food",
    sub: "Ndole",
    price: 2000,
    condition: "Service",
    location: "Douala, Bonamoussadi",
    rating: 4.8,
    reviews: 173,
    sellerId: "s1",
    description: "Ndole with beef or shrimps, served with ripe plantain.",
    specs: { Delivery: "40 min", Hours: "11AM - 10PM" },
    emoji: "🥘",
  },
  {
    id: "computer-training",
    title: "Computer Training — Office & Internet",
    category: "education",
    sub: "Computer Training",
    price: 25000,
    condition: "Service",
    location: "Douala, Akwa",
    rating: 4.7,
    reviews: 52,
    sellerId: "s3",
    description: "6-week practical course: Word, Excel, PowerPoint, email and internet.",
    specs: { Duration: "6 weeks", Certificate: "Yes", Language: "EN / FR" },
    emoji: "💻",
  },
  {
    id: "driving-school",
    title: "Driving School — Full Licence Package",
    category: "education",
    sub: "Driving School",
    price: 75000,
    condition: "Service",
    location: "Douala, Bonaberi",
    rating: 4.5,
    reviews: 38,
    sellerId: "s3",
    description: "Theory plus 20 practical lessons and licence processing support.",
    specs: { Lessons: "20", Duration: "8 weeks", Licence: "Category B" },
    emoji: "🚦",
  },
];

export const TOP_PAINTERS = [
  { name: "Paul Mbarga", rating: 4.9, jobs: 32, emoji: "👨🏿‍🎨", id: "painter-paul" },
  { name: "Marie Njie", rating: 4.7, jobs: 24, emoji: "👩🏿‍🎨", id: "painter-paul" },
  { name: "John Atangana", rating: 4.8, jobs: 18, emoji: "🧑🏿‍🎨", id: "painter-paul" },
];

export const CITIES = ["Douala", "Yaounde", "Buea", "Limbe", "Bafoussam", "Remote", "Other"];

export const COUNTRIES = [
  { name: "Cameroon", flag: "🇨🇲", code: "+237" },
  { name: "Nigeria", flag: "🇳🇬", code: "+234" },
  { name: "Ghana", flag: "🇬🇭", code: "+233" },
  { name: "Cote d'Ivoire", flag: "🇨🇮", code: "+225" },
  { name: "USA", flag: "🇺🇸", code: "+1" },
  { name: "UK", flag: "🇬🇧", code: "+44" },
  { name: "China", flag: "🇨🇳", code: "+86" },
  { name: "Other", flag: "🌍", code: "+" },
];

export const SELLER_TYPES = [
  "Product Seller",
  "Service Provider (Cleaner, Repairer, Painter, Plumber...)",
  "Consultant",
  "Builder / Contractor",
  "House Plan Designer",
  "Real Estate Agent",
  "Vehicle Dealer",
  "Job Poster (Employer)",
  "Restaurant Owner",
  "Educator",
  "International Seller",
];

export function getListing(id: string) {
  return LISTINGS.find((l) => l.id === id);
}

export function listingsByCategory(id: CategoryId) {
  return LISTINGS.filter((l) => l.category === id);
}

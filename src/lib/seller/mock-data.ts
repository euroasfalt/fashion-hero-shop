export type PersonaId = "urbanedge" | "marta" | "dropstyle";

export interface TopProduct {
  id: string;
  name: string;
  variant: string;
  sold: number;
  gmv: number;
  margin: number;
  hex: string;
}

export interface Sparklines {
  gmv: number[];
  margin: number[];
  orders: number[];
  mkt: number[];
  aov: number[];
}

export interface PeriodData {
  gmv: number;
  gmvPrev: number;
  orders: number;
  ordersPrev: number;
  netMargin: number;
  netMarginPrev: number;
  marginPct: number;
  marginPctPrev: number;
  returns: number;
  returnsPrev: number;
  returnRate: number;
  returnCost: number;
  marketingCost: number;
  marketingCostPrev: number;
  aov: number;
  aovPrev: number;
}

export interface Persona {
  name: string;
  rating: number;
  pro: boolean;
  initials: string;
  avatarBg: string;
  description: string;
  period: PeriodData;
  sparklines: Sparklines;
  marginByDay: number[];
  gmvByDay: number[];
  topProducts: TopProduct[];
}

export const PERSONAS: Record<PersonaId, Persona> = {
  urbanedge: {
    name: "UrbanEdge",
    rating: 4.6,
    pro: true,
    initials: "UE",
    avatarBg: "#212121",
    description: "Streetwear essentials",
    period: {
      gmv: 197250, gmvPrev: 175400,
      orders: 412, ordersPrev: 384,
      netMargin: 140105, netMarginPrev: 121200,
      marginPct: 71.0, marginPctPrev: 69.1,
      returns: 38, returnsPrev: 41, returnRate: 9.2,
      returnCost: 950,
      marketingCost: 12800, marketingCostPrev: 9200,
      aov: 479, aovPrev: 457,
    },
    sparklines: {
      gmv:    [4.8,5.2,6.1,5.8,6.4,7.2,6.9,7.5,7.8,8.1,7.9,8.4,8.7,8.9],
      margin: [3.4,3.7,4.3,4.1,4.5,5.1,4.9,5.3,5.5,5.7,5.6,5.9,6.1,6.3],
      orders: [10,12,14,13,15,18,17,18,19,20,19,21,22,23],
      mkt:    [0,0,0,0,1.2,1.2,1.2,1.2,3.5,3.5,3.5,3.5,4.5,4.5],
      aov:    [435,448,452,447,455,461,458,463,471,478,475,481,484,487],
    },
    marginByDay: Array.from({ length: 30 }, (_, i) =>
      Math.round(3800 + Math.sin(i / 3) * 900 + i * 120)
    ),
    gmvByDay: Array.from({ length: 30 }, (_, i) =>
      Math.round(5400 + Math.sin(i / 3) * 1300 + i * 180)
    ),
    topProducts: [
      { id:"cloud-runner",   name:"Cloud Runner",    variant:"Jet Black",    sold:84, gmv:40236, margin:28570, hex:"#212121" },
      { id:"trail-pacer",    name:"Trail Pacer",      variant:"Forest Green", sold:62, gmv:34658, margin:24600, hex:"#3d5743" },
      { id:"dash-sport",     name:"Dash Sport",       variant:"Storm Blue",   sold:54, gmv:31266, margin:22198, hex:"#3f5972" },
      { id:"stealth-hoodie", name:"Stealth Hoodie",   variant:"Washed Black", sold:48, gmv:20592, margin:14620, hex:"#2a2a2a" },
      { id:"street-runner-x",name:"Street Runner X",  variant:"Triple Black", sold:42, gmv:20958, margin:14880, hex:"#1f1f1f" },
      { id:"urban-tee",      name:"Urban Tee",         variant:"Bone",         sold:96, gmv:11520, margin:8050,  hex:"#e8e3d8" },
      { id:"cargo-pant-2",   name:"Cargo Pant 2.0",   variant:"Sand",         sold:31, gmv:13950, margin:9420,  hex:"#bda680" },
      { id:"flex-sock-3pk",  name:"Flex Sock 3-pack",  variant:"Mixed",        sold:78, gmv:6864,  margin:5350,  hex:"#6b6b6b" },
      { id:"street-cap",     name:"Street Cap",        variant:"Black",        sold:36, gmv:5040,  margin:3680,  hex:"#1a1a1a" },
      { id:"wind-jacket",    name:"Wind Jacket",       variant:"Charcoal",     sold:18, gmv:10620, margin:6940,  hex:"#3a3a3a" },
    ],
  },

  marta: {
    name: "Marta Handmade",
    rating: 4.2,
    pro: false,
    initials: "MH",
    avatarBg: "#8a6b4a",
    description: "Ręcznie robione buty i akcesoria",
    period: {
      gmv: 4485, gmvPrev: 3920,
      orders: 28, ordersPrev: 24,
      netMargin: 3245, netMarginPrev: 2870,
      marginPct: 72.4, marginPctPrev: 73.2,
      returns: 2, returnsPrev: 3, returnRate: 7.1,
      returnCost: 50,
      marketingCost: 200, marketingCostPrev: 0,
      aov: 160, aovPrev: 163,
    },
    sparklines: {
      gmv:    [0.10,0.14,0.12,0.18,0.16,0.20,0.22,0.19,0.24,0.21,0.23,0.26,0.28,0.30],
      margin: [0.07,0.10,0.09,0.13,0.12,0.14,0.16,0.14,0.17,0.15,0.17,0.19,0.20,0.22],
      orders: [1,2,1,2,2,2,3,2,3,2,3,3,3,4],
      mkt:    [0,0,0,0,0,0,0,0,0,0,0.1,0.1,0.1,0.1],
      aov:    [155,158,160,159,161,163,165,162,164,160,162,165,168,164],
    },
    marginByDay: Array.from({ length: 30 }, (_, i) =>
      Math.round(80 + Math.sin(i / 4) * 30 + i * 2)
    ),
    gmvByDay: Array.from({ length: 30 }, (_, i) =>
      Math.round(120 + Math.sin(i / 4) * 45 + i * 3)
    ),
    topProducts: [
      { id:"skorzane-sandaly",  name:"Skórzane Sandały",   variant:"Tan",     sold:9, gmv:1341, margin:970, hex:"#a98e6f" },
      { id:"skorzane-sandaly2", name:"Skórzane Sandały",   variant:"Black",   sold:7, gmv:1043, margin:755, hex:"#3d2a1f" },
      { id:"tote-bag-natural",  name:"Skórzana Torba",     variant:"Natural", sold:6, gmv:894,  margin:647, hex:"#c4a373" },
      { id:"bracelet-leather",  name:"Bransoletka",         variant:"Brown",   sold:4, gmv:516,  margin:373, hex:"#6e4a35" },
      { id:"sandals-kids",      name:"Sandały dziecięce",   variant:"Cream",   sold:2, gmv:298,  margin:215, hex:"#d8c4a8" },
      { id:"belt-handmade",     name:"Pasek skórzany",      variant:"Camel",   sold:5, gmv:520,  margin:380, hex:"#b88a5a" },
      { id:"wallet-mini",       name:"Portfel Mini",         variant:"Cognac",  sold:4, gmv:380,  margin:275, hex:"#8a4a2a" },
      { id:"sandaly-plecione",  name:"Sandały plecione",    variant:"Natural", sold:3, gmv:447,  margin:325, hex:"#d8b896" },
      { id:"kolczyki-leather",  name:"Kolczyki skórzane",   variant:"Black",   sold:6, gmv:288,  margin:215, hex:"#2d1f15" },
      { id:"klucznik",          name:"Brelok do kluczy",    variant:"Tan",     sold:8, gmv:184,  margin:138, hex:"#a07a55" },
    ],
  },

  dropstyle: {
    name: "DropStyle",
    rating: 3.9,
    pro: false,
    initials: "DS",
    avatarBg: "#cc4444",
    description: "Trendy weekly drops",
    period: {
      gmv: 31200, gmvPrev: 38500,
      orders: 156, ordersPrev: 198,
      netMargin: 14361, netMarginPrev: 21450,
      marginPct: 46.0, marginPctPrev: 55.7,
      returns: 59, returnsPrev: 52, returnRate: 37.8,
      returnCost: 1475,
      marketingCost: 8500, marketingCostPrev: 5200,
      aov: 200, aovPrev: 194,
    },
    sparklines: {
      gmv:    [1.4,1.6,1.8,1.5,1.3,1.2,1.1,1.0,0.9,1.0,0.95,0.9,0.85,0.8],
      margin: [0.95,1.0,1.1,0.9,0.75,0.65,0.55,0.5,0.45,0.5,0.45,0.4,0.35,0.3],
      orders: [9,10,11,9,8,7,7,6,6,6,5,5,5,4],
      mkt:    [0.2,0.3,0.4,0.5,0.6,0.7,0.7,0.8,0.85,0.85,0.85,0.85,0.85,0.85],
      aov:    [188,192,196,194,198,200,201,203,205,200,202,204,206,205],
    },
    marginByDay: Array.from({ length: 30 }, (_, i) =>
      Math.round(800 - Math.sin(i / 4) * 200 - i * 15)
    ),
    gmvByDay: Array.from({ length: 30 }, (_, i) =>
      Math.round(1500 - Math.sin(i / 4) * 300 - i * 15)
    ),
    topProducts: [
      { id:"crop-top-pink",   name:"Crop Top Y2K",       variant:"Hot Pink",  sold:24, gmv:1656, margin:485, hex:"#e85a8e" },
      { id:"wide-jeans",      name:"Wide-Leg Jeans",      variant:"Acid Wash", sold:18, gmv:2502, margin:730, hex:"#7aa3c4" },
      { id:"cargo-pants",     name:"Cargo Pants",          variant:"Olive",     sold:16, gmv:2080, margin:608, hex:"#5e6a3d" },
      { id:"puffer-mini",     name:"Mini Puffer",           variant:"Lime",      sold:12, gmv:1800, margin:526, hex:"#b8d04a" },
      { id:"platform-sneak",  name:"Platform Sneaker",      variant:"White",     sold:11, gmv:2189, margin:640, hex:"#ededed" },
      { id:"baby-tee",        name:"Baby Tee",              variant:"Baby Blue", sold:22, gmv:1320, margin:385, hex:"#a8c8e4" },
      { id:"mesh-top",        name:"Mesh Top",              variant:"Black",     sold:14, gmv:1120, margin:325, hex:"#1a1a1a" },
      { id:"mini-skirt",      name:"Mini Skirt Pleated",    variant:"Plaid",     sold:10, gmv:1490, margin:435, hex:"#a64545" },
      { id:"chunky-belt",     name:"Chunky Belt",           variant:"Silver",    sold:13, gmv:780,  margin:230, hex:"#bcbcbc" },
      { id:"cargo-skirt",     name:"Cargo Skirt",           variant:"Khaki",     sold:9,  gmv:1170, margin:340, hex:"#8a7a4a" },
    ],
  },
};

export const EMAIL_BY_PERSONA: Record<PersonaId, string> = {
  urbanedge: "kontakt@urbanedge.pl",
  marta: "marta.kowalska@gmail.com",
  dropstyle: "sales@dropstyle.pl",
};

/* ── Transactions ─────────────────────────────────────── */

export interface Transaction {
  id: string;
  product: { name: string; variant: string; hex: string };
  price: number;
  netMargin: number;
  marginPct: number | null;
  returned: boolean;
  returnCost: number;
  customerName: string;
  city: string;
  payment: string;
  size: string;
  date: Date;
  rating: number | null;
}

const CITIES = ["Warszawa","Kraków","Wrocław","Gdańsk","Poznań","Łódź","Katowice","Lublin","Szczecin","Bydgoszcz"];
const PAYMENTS = ["Karta","BLIK","Apple Pay","PayPo","Przelewy24"];
const LAST_INITIALS = ["K.","N.","W.","S.","M.","B.","P.","C.","L.","Z.","R.","F.","J.","G.","H."];

const FIRST_NAMES: Record<PersonaId, string[]> = {
  urbanedge: ["Tomasz","Michał","Krzysztof","Paweł","Adam","Marcin","Piotr","Maciej","Anna","Karolina","Jakub","Kamil","Bartek","Mateusz","Łukasz"],
  marta:     ["Anna","Maria","Katarzyna","Magdalena","Joanna","Ewa","Agnieszka","Barbara","Beata","Renata","Justyna","Iwona","Sylwia","Aneta"],
  dropstyle: ["Ola","Zuza","Kasia","Wiktoria","Natalia","Patrycja","Karolina","Julia","Amelia","Lena","Hania","Maja","Roksana","Nikola"],
};

const SIZES: Record<PersonaId, string[]> = {
  urbanedge: ["38","40","42","44"],
  marta:     ["36","37","38","39","40"],
  dropstyle: ["S","M","L","XL"],
};

export function generateTransactions(personaId: PersonaId): Transaction[] {
  const p = PERSONAS[personaId];
  const products = p.topProducts;
  const firstNames = FIRST_NAMES[personaId];
  const sizes = SIZES[personaId];
  const count = personaId === "marta" ? 22 : personaId === "urbanedge" ? 32 : 26;
  const returnRate = p.period.returnRate / 100;

  const out: Transaction[] = [];
  let txnId = 1900;

  for (let i = 0; i < count; i++) {
    txnId += (i % 3) + 1;
    const prod = products[i % products.length];
    const price = Math.round(prod.gmv / prod.sold);
    const commission = Math.round(price * 0.22);
    const isReturned = i / count < returnRate;
    const returnCost = isReturned ? 25 : 0;
    const netMargin = isReturned
      ? -(commission * 0.3 + returnCost)
      : price - commission - returnCost;
    const marginPct = isReturned ? null : Math.round((netMargin / price) * 100);
    const daysAgo = (i % 28) + 1;
    out.push({
      id: String(txnId),
      product: { name: prod.name, variant: prod.variant, hex: prod.hex },
      price,
      netMargin: Math.round(netMargin),
      marginPct,
      returned: isReturned,
      returnCost,
      customerName: `${firstNames[i % firstNames.length]} ${LAST_INITIALS[i % LAST_INITIALS.length]}`,
      city: CITIES[i % CITIES.length],
      payment: PAYMENTS[i % PAYMENTS.length],
      size: sizes[i % sizes.length],
      date: new Date(Date.now() - daysAgo * 86_400_000),
      rating: isReturned ? null : i % 2 === 0 ? 5 : 4,
    });
  }

  if (personaId === "urbanedge") {
    out.unshift({
      id: "1847",
      product: { name: "Cloud Runner", variant: "Jet Black", hex: "#212121" },
      price: 479, netMargin: 374, marginPct: 78,
      returned: false, returnCost: 0,
      customerName: "Anna K.", city: "Warszawa", payment: "Karta", size: "42",
      date: new Date(Date.now() - 3 * 86_400_000),
      rating: 5,
    });
  }

  return out.sort((a, b) => b.date.getTime() - a.date.getTime());
}

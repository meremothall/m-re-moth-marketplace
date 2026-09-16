import { useCallback, useEffect, useState } from "react";

export type WantedRequest = {
  id: string;
  product: string;
  description: string;
  budget: number;
  quantity: number;
  location: string;
  urgency: "Today" | "This Week";
  photo?: string;
  requester: string;
  createdAt: number;
  offers: number;
  isNew?: boolean;
};

const KEY = "meremoth-wanted-requests";
const HOUR = 3600_000;

export const SEED_WANTED: WantedRequest[] = [
  {
    id: "w1",
    product: "50 bags of cement (Dangote)",
    description: "Needed for a slab casting this weekend in Logbessou. Delivery included please.",
    budget: 300000,
    quantity: 50,
    location: "Logbessou, Douala",
    urgency: "This Week",
    requester: "Serge N.",
    createdAt: Date.now() - 2 * HOUR,
    offers: 5,
    isNew: true,
  },
  {
    id: "w2",
    product: "Size 43 safety boots, steel toe",
    description: "Six pairs for my site team. Brand new only.",
    budget: 110000,
    quantity: 6,
    location: "Bonaberi, Douala",
    urgency: "Today",
    requester: "Alice M.",
    createdAt: Date.now() - 5 * HOUR,
    offers: 3,
    isNew: true,
  },
  {
    id: "w3",
    product: "Hotel room for 3 nights near Akwa",
    description: "Two guests, AC and wifi required, budget per night.",
    budget: 25000,
    quantity: 1,
    location: "Akwa, Douala",
    urgency: "This Week",
    requester: "Ngwa B.",
    createdAt: Date.now() - 26 * HOUR,
    offers: 7,
  },
  {
    id: "w4",
    product: "Truck to move furniture to Yaounde",
    description: "One 3-bedroom apartment, Saturday morning pickup in Bonapriso.",
    budget: 90000,
    quantity: 1,
    location: "Bonapriso, Douala",
    urgency: "This Week",
    requester: "Claudia F.",
    createdAt: Date.now() - 30 * HOUR,
    offers: 2,
  },
];

export const NEW_WANTED_COUNT = 12;

function read(): WantedRequest[] {
  if (typeof window === "undefined") return SEED_WANTED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return SEED_WANTED;
    const parsed = JSON.parse(raw) as WantedRequest[];
    return [...parsed, ...SEED_WANTED];
  } catch {
    return SEED_WANTED;
  }
}

export function timeAgo(ts: number) {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function useWanted() {
  const [items, setItems] = useState<WantedRequest[]>(SEED_WANTED);

  useEffect(() => {
    setItems(read());
  }, []);

  const add = useCallback((req: Omit<WantedRequest, "id" | "createdAt" | "offers">) => {
    const entry: WantedRequest = {
      ...req,
      id: `w-${Date.now()}`,
      createdAt: Date.now(),
      offers: 0,
      isNew: true,
    };
    setItems((prev) => {
      const next = [entry, ...prev];
      try {
        const mine = next.filter((i) => !SEED_WANTED.some((s) => s.id === i.id));
        window.localStorage.setItem(KEY, JSON.stringify(mine));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
    return entry;
  }, []);

  return { items, add };
}

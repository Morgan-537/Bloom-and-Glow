const IMG = {
  skincare:
    "https://images.unsplash.com/photo-1760860992928-221d73c4c0cc?w=600&h=600&fit=crop&auto=format&q=80",
  haircareOil:
    "https://images.unsplash.com/photo-1701992678962-41703126549c?w=600&h=600&fit=crop&auto=format&q=80",
  haircareShampoo:
    "https://images.unsplash.com/photo-1701992678972-d5a053ad0fb0?w=600&h=600&fit=crop&auto=format&q=80",
  makeup:
    "https://images.unsplash.com/photo-1532441807072-e075a14e3b69?w=600&h=600&fit=crop&auto=format&q=80",
};

export const mockProducts = [
  {
    id: 1,
    name: "Rose Facial Serum",
    category: "Skincare",
    price: 24.0,
    stock: 42,
    status: "Active",
    image: IMG.skincare,
    description:
      "A lightweight, fast-absorbing serum infused with rosehip oil and vitamin C to brighten and hydrate skin for a natural, radiant glow.",
  },
  {
    id: 2,
    name: "Hydrating Day Cream",
    category: "Skincare",
    price: 18.5,
    stock: 65,
    status: "Active",
    image: IMG.skincare,
    description:
      "A rich daily moisturizer that locks in hydration and softens skin for a smooth, dewy finish.",
  },
  {
    id: 3,
    name: "Argan Hair Oil",
    category: "Haircare",
    price: 15.0,
    stock: 8,
    status: "Low Stock",
    image: IMG.haircareOil,
    description:
      "Nourishing argan oil that tames frizz and adds shine without weighing hair down.",
  },
  {
    id: 4,
    name: "Matte Lipstick - Rouge",
    category: "Makeup",
    price: 12.0,
    stock: 0,
    status: "Out of Stock",
    image: IMG.makeup,
    description:
      "A long-wearing matte lipstick in a bold rouge shade that glides on smooth.",
  },
  {
    id: 5,
    name: "Vitamin C Cleanser",
    category: "Skincare",
    price: 21.0,
    stock: 65,
    status: "Active",
    image: IMG.skincare,
    description:
      "A gentle daily cleanser with vitamin C to brighten skin and clear away impurities.",
  },
  {
    id: 6,
    name: "Keratin Shampoo",
    category: "Haircare",
    price: 16.5,
    stock: 30,
    status: "Active",
    image: IMG.haircareShampoo,
    description:
      "A keratin-infused shampoo that strengthens strands and smooths texture.",
  },
  {
    id: 7,
    name: "Volumizing Mascara",
    category: "Makeup",
    price: 14.0,
    stock: 50,
    status: "Active",
    image: IMG.makeup,
    description:
      "A buildable mascara that lifts and volumizes lashes without clumping.",
  },
  {
    id: 8,
    name: "Charcoal Face Mask",
    category: "Skincare",
    price: 19.0,
    stock: 22,
    status: "Active",
    image: IMG.skincare,
    description:
      "A deep-cleansing charcoal mask that draws out impurities and refines pores.",
  },
];

export const mockOrders = [
  { id: "BG-10457", date: "2026-08-19", items: 3, total: 71.0, status: "Delivered", customer: "Jane Doe" },
  { id: "BG-10391", date: "2026-08-02", items: 2, total: 42.0, status: "Processing", customer: "Amy K." },
  { id: "BG-10322", date: "2026-07-21", items: 1, total: 24.0, status: "Delivered", customer: "Peter M." },
  { id: "BG-10240", date: "2026-07-05", items: 4, total: 96.5, status: "Cancelled", customer: "Jane Doe" },
];

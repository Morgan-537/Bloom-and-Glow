export const mockProducts = [

  {
    id: 1,
    name: "Rose Facial Serum",
    category: "Skincare",
    price: 24.0,
    stock: 42,
    status: "Active",
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
    description:
      "A deep-cleansing charcoal mask that draws out impurities and refines pores.",
  },
  { id: 1, name: "Rose Facial Serum", category: "Skincare", price: 24.0, stock: 42, status: "Active" },
  { id: 2, name: "Hydrating Day Cream", category: "Skincare", price: 18.5, stock: 65, status: "Active" },
  { id: 3, name: "Argan Hair Oil", category: "Haircare", price: 15.0, stock: 8, status: "Low Stock" },
  { id: 4, name: "Matte Lipstick - Rouge", category: "Makeup", price: 12.0, stock: 0, status: "Out of Stock" },
  { id: 5, name: "Vitamin C Cleanser", category: "Skincare", price: 21.0, stock: 65, status: "Active" },
  { id: 6, name: "Keratin Shampoo", category: "Haircare", price: 16.5, stock: 30, status: "Active" },
  { id: 7, name: "Volumizing Mascara", category: "Makeup", price: 14.0, stock: 50, status: "Active" },
  { id: 8, name: "Charcoal Face Mask", category: "Skincare", price: 19.0, stock: 22, status: "Active" },
];

export const mockOrders = [
  { id: "BG-10457", date: "2026-08-19", items: 3, total: 71.0, status: "Delivered", customer: "Jane Doe" },
  { id: "BG-10391", date: "2026-08-02", items: 2, total: 42.0, status: "Processing", customer: "Amy K." },
  { id: "BG-10322", date: "2026-07-21", items: 1, total: 24.0, status: "Delivered", customer: "Peter M." },
  { id: "BG-10240", date: "2026-07-05", items: 4, total: 96.5, status: "Cancelled", customer: "Jane Doe" },
];

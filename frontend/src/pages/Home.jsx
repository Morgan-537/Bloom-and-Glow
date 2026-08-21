import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { setSearchTerm, setActiveCategory } from "../features/products/productsSlice";
import { addItem } from "../features/cart/cartSlice";

// Owned by Elvis (feature/shop-elvis) — Figma frame "03 - Home & Product Listing"
export default function Home() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, searchTerm, activeCategory } = useSelector((s) => s.products);

  // NavBar links to /?category=Skincare etc. — sync that into productsSlice.
  useEffect(() => {
    const category = searchParams.get("category");
    dispatch(setActiveCategory(category || "All"));
  }, [searchParams, dispatch]);

  const categories = ["All", ...new Set(items.map((p) => p.category))];

  const filtered = items.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleAddToCart(e, product) {
    e.stopPropagation();
    dispatch(addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1 }));
  }

  return (
    <Layout>
      {/* Hero */}
      <div
        style={{
          padding: "56px 48px 44px",
          background: "var(--gradient-primary)",
        }}
      >
        <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 700, color: "var(--color-white)" }}>
          Glow Naturally
        </h1>
        <p style={{ margin: 0, color: "var(--color-white)", opacity: 0.9, fontSize: 15 }}>
          Shop skincare, haircare &amp; makeup essentials, delivered to your door.
        </p>
      </div>

      {/* Search + sort controls */}
      <div style={{ display: "flex", gap: 12, padding: "22px 48px 0", flexWrap: "wrap" }}>
        <input
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          style={{
            flex: 1,
            minWidth: 220,
            padding: "11px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: 14,
          }}
        />
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 10, padding: "18px 48px 0", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(setActiveCategory(cat))}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "none",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: activeCategory === cat ? "var(--color-primary)" : "var(--color-border)",
              color: activeCategory === cat ? "var(--color-white)" : "var(--color-dark)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 22,
          padding: "28px 48px 60px",
        }}
      >
        {filtered.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-gray)", padding: "40px 0" }}>
            No products match your search.
          </p>
        )}

        {filtered.map((product) => (
          <Card
            key={product.id}
            style={{ padding: 0, cursor: "pointer", overflow: "hidden" }}
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                background: "var(--color-img-placeholder)",
              }}
            >
              {product.status !== "Active" && (
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                  <Badge tone={product.status === "Out of Stock" ? "danger" : "pending"}>
                    {product.status}
                  </Badge>
                </div>
              )}
              <Button
                variant="outline"
                onClick={(e) => handleAddToCart(e, product)}
                aria-label={`Add ${product.name} to cart`}
                disabled={product.status === "Out of Stock"}
                style={{
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                  width: 30,
                  height: 30,
                  padding: 0,
                  borderRadius: "50%",
                  background: "var(--color-white)",
                }}
              >
                +
              </Button>
            </div>
            <div style={{ padding: "12px 14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-primary)", marginBottom: 4 }}>
                {product.category.toUpperCase()}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{product.name}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-primary)" }}>
                ${product.price.toFixed(2)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
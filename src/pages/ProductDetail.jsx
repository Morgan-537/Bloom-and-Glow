
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { addItem } from "../features/cart/cartSlice";

// Owned by Elvis (feature/shop-elvis) — Figma frame "04 - Product Detail"
export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const items = useSelector((s) => s.products.items);
  const product = items.find((p) => String(p.id) === id);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!product) {
    return (
      <Layout>
        <div style={{ padding: 80, textAlign: "center", color: "var(--color-gray)" }}>
          Product not found. <Link to="/">Back to shop</Link>
        </div>
      </Layout>
    );
  }

  const inStock = product.stock > 0;

  function handleAddToCart() {
    dispatch(addItem({ productId: product.id, name: product.name, price: product.price, quantity: qty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Layout>
      <div style={{ padding: "18px 48px 0", fontSize: 13, color: "var(--color-gray)" }}>
        <Link to="/" style={{ color: "var(--color-gray)", textDecoration: "none" }}>Shop</Link>
        {" / "}
        <Link to={`/?category=${product.category}`} style={{ color: "var(--color-gray)", textDecoration: "none" }}>
          {product.category}
        </Link>
        {" / "}
        <span style={{ color: "var(--color-dark)" }}>{product.name}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          padding: "28px 48px 64px",
          maxWidth: 1100,
        }}
      >
        <Card style={{ padding: 0, aspectRatio: "1 / 1", background: "var(--color-img-placeholder)" }} />

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-primary)", marginBottom: 8 }}>
            {product.category.toUpperCase()}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 10px" }}>{product.name}</h1>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-primary)", marginBottom: 18 }}>
            ${product.price.toFixed(2)}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-gray)", maxWidth: 440, marginBottom: 18 }}>
            {product.description}
          </p>

          <div style={{ marginBottom: 22 }}>
            <Badge tone={inStock ? "success" : "danger"}>
              {inStock ? `In stock: ${product.stock} units` : "Out of stock"}
            </Badge>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Quantity</div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              marginBottom: 22,
            }}
          >
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              style={{ width: 38, height: 38, border: "none", background: "var(--color-white)", fontSize: 16 }}
            >
              −
            </button>
            <span style={{ width: 42, textAlign: "center", fontSize: 14, fontWeight: 600 }}>{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              style={{ width: 38, height: 38, border: "none", background: "var(--color-white)", fontSize: 16 }}
            >
              +
            </button>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
            <Button variant="primary" onClick={handleAddToCart} disabled={!inStock}>
              {added ? "Added ✓" : inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button variant="outline" onClick={() => setSaved((s) => !s)}>
              {saved ? "♥ Saved" : "♡ Save"}
            </Button>
          </div>

          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>Product Details</h2>
            <p style={{ fontSize: 13, color: "var(--color-gray)", margin: 0 }}>
              Category: {product.category} &nbsp;|&nbsp; Brand: Bloom &amp; Glow &nbsp;|&nbsp; Stock: {product.stock} units
            </p>
          </div>
        </div>

import Layout from "../components/layout/Layout";

// Owned by Elvis (feature/shop-elvis) — Figma frame "04 - Product Detail".
export default function ProductDetail() {
  return (
    <Layout>
      <div style={{ padding: 80, textAlign: "center", color: "var(--color-gray)" }}>
        Product Detail page — Elvis's section

      </div>
    </Layout>
  );
}

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { addProduct, updateProduct, deleteProduct } from "../../features/products/productsSlice";
import { searchPhotos } from "../../api/unsplashApi";

const STATUS_TONE = { Active: "success", "Low Stock": "pending", "Out of Stock": "danger" };
const CATEGORIES = ["All", "Skincare", "Haircare", "Makeup"];
const PRODUCT_CATEGORIES = ["Skincare", "Haircare", "Makeup"];

const fieldLabel = { display: "block", fontSize: 12, fontWeight: 600, margin: "14px 0 6px" };
const fieldInput = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)",
  fontSize: 13,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export default function AdminProductManagement() {
  // Reads/writes the same catalog Home and ProductDetail read from (see
  // productsSlice.js) — this used to point at a separate, disconnected
  // copy in adminSlice, so adding a product here never actually made it
  // appear in the shop.
  const { items: products, status, error } = useSelector((s) => s.products);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  // null = closed. "add" = add-product form. A product object = editing that product.
  const [formState, setFormState] = useState(null);
  // Surfaced inside the modal when the server rejects a save, so the form
  // stays open and the user can retry instead of silently losing the edit.
  const [formError, setFormError] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || p.category === category)
  );

  // json-server assigns the id on POST now, so we no longer generate one
  // client-side (that Date.now() id never matched what got persisted).
  // Both addProduct/updateProduct are thunks, so we await them and check
  // the outcome instead of assuming success and closing the modal early.
  async function handleSave(values) {
    setFormError("");
    const action =
      formState === "add"
        ? await dispatch(addProduct(values))
        : await dispatch(updateProduct({ id: formState.id, ...values }));

    if (action.meta.requestStatus === "rejected") {
      setFormError(action.payload || "Could not save this product. Please try again.");
      return;
    }
    setFormState(null);
  }

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Product Management</h1>
          <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
            Create, update, and manage the product catalog
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => {
            setFormError("");
            setFormState("add");
          }}
        >
          + Add Product
        </Button>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 400,
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: 13,
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: 13,
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>Category: {c}</option>
          ))}
        </select>
      </div>

      <Card style={{ padding: 0, marginTop: 20 }}>
        {/* Scrolls horizontally on narrow screens instead of squeezing 6
            columns unreadably thin or overflowing the page. */}
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-gray)", fontSize: 11 }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "14px 20px", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(status === "idle" || status === "loading") && (
              <tr>
                <td colSpan={6} style={{ padding: "20px", color: "var(--color-gray)", textAlign: "center" }}>
                  Loading products...
                </td>
              </tr>
            )}
            {status === "failed" && (
              <tr>
                <td colSpan={6} style={{ padding: "20px", color: "var(--color-danger)", textAlign: "center" }}>
                  {error || "Could not load products. Make sure `npm run server` is running on port 4000."}
                </td>
              </tr>
            )}
            {status === "succeeded" && filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "20px", color: "var(--color-gray)", textAlign: "center" }}>
                  No products match your search.
                </td>
              </tr>
            )}
            {status === "succeeded" && filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                <td style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      background: "var(--color-img-placeholder)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  {p.name}
                </td>
                <td style={{ padding: "14px 20px", color: "var(--color-gray)" }}>{p.category}</td>
                <td style={{ padding: "14px 20px", fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: "14px 20px" }}>{p.stock}</td>
                <td style={{ padding: "14px 20px" }}>
                  <Badge tone={STATUS_TONE[p.status] ?? "neutral"}>{p.status}</Badge>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <button
                    onClick={() => {
                      setFormError("");
                      setFormState(p);
                    }}
                    style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: 12, marginRight: 16, cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => dispatch(deleteProduct(p.id))}
                    style={{ background: "none", border: "none", color: "var(--color-danger)", fontSize: 12, cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
      <p style={{ color: "var(--color-gray)", fontSize: 12, marginTop: 12 }}>
        Showing {filtered.length} of {products.length} products
      </p>

      {formState && (
        <ProductFormModal
          initial={formState === "add" ? null : formState}
          onCancel={() => setFormState(null)}
          onSave={handleSave}
          serverError={formError}
        />
      )}
    </AdminLayout>
  );
}

function ProductFormModal({ initial, onCancel, onSave, serverError }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? PRODUCT_CATEGORIES[0]);
  const [price, setPrice] = useState(initial?.price ?? "");
  const [stock, setStock] = useState(initial?.stock ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [error, setError] = useState("");

  // Unsplash search — lets the admin pick a real product photo instead of
  // hand-pasting an image URL. Entirely optional: the manual "Image URL"
  // field above still works on its own, and picking a search result just
  // fills that same field. Attribution is shown per Unsplash's API terms
  // once a photo is picked.
  const [unsplashQuery, setUnsplashQuery] = useState(initial?.name ?? "");
  const [unsplashStatus, setUnsplashStatus] = useState("idle"); // idle | loading | succeeded | failed
  const [unsplashError, setUnsplashError] = useState("");
  const [unsplashResults, setUnsplashResults] = useState([]);
  const [credit, setCredit] = useState(null); // { photographer, photographerUrl } | null

  async function handleUnsplashSearch(e) {
    e.preventDefault(); // this button lives inside the outer <form> — don't submit it
    if (!unsplashQuery.trim()) return;
    setUnsplashStatus("loading");
    setUnsplashError("");
    try {
      const results = await searchPhotos(unsplashQuery.trim());
      setUnsplashResults(results);
      setUnsplashStatus("succeeded");
    } catch (err) {
      setUnsplashStatus("failed");
      setUnsplashError(err.message);
    }
  }

  function pickPhoto(photo) {
    setImage(photo.regular);
    setCredit({ photographer: photo.photographer, photographerUrl: photo.photographerUrl });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (price === "" || Number(price) < 0) {
      setError("Enter a valid price.");
      return;
    }
    if (stock === "" || Number(stock) < 0) {
      setError("Enter a valid stock count.");
      return;
    }

    const stockNum = Number(stock);
    // Same thresholds already used across the mock catalog: 0 units is Out
    // of Stock, under 10 is Low Stock, otherwise Active.
    const status = stockNum <= 0 ? "Out of Stock" : stockNum < 10 ? "Low Stock" : "Active";

    onSave({
      name: name.trim(),
      category,
      price: Number(price),
      stock: stockNum,
      status,
      image: image.trim(),
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(41, 31, 33, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 20,
      }}
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-white)",
          borderRadius: "var(--radius-lg)",
          padding: 28,
          width: 460,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-card-hover)",
        }}
      >
        <h2 style={{ margin: "0 0 18px", fontSize: 18, fontWeight: 700 }}>
          {initial ? "Edit Product" : "Add Product"}
        </h2>

        <label style={fieldLabel} htmlFor="product-name">Name</label>
        <input
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={fieldInput}
          placeholder="Rose Facial Serum"
        />

        <label style={fieldLabel} htmlFor="product-category">Category</label>
        <select
          id="product-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={fieldInput}
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={fieldLabel} htmlFor="product-price">Price ($)</label>
            <input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={fieldInput}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={fieldLabel} htmlFor="product-stock">Stock</label>
            <input
              id="product-stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              style={fieldInput}
            />
          </div>
        </div>

        <label style={fieldLabel} htmlFor="product-image">Image URL</label>
        <input
          id="product-image"
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
            setCredit(null); // manual edit overrides whatever was picked from search
          }}
          style={fieldInput}
          placeholder="https://images.unsplash.com/..."
        />
        {credit ? (
          <p style={{ fontSize: 11, color: "var(--color-gray)", margin: "4px 0 4px" }}>
            Photo by{" "}
            <a href={credit.photographerUrl} target="_blank" rel="noreferrer">
              {credit.photographer}
            </a>{" "}
            on Unsplash
          </p>
        ) : (
          <p style={{ fontSize: 11, color: "var(--color-gray)", margin: "4px 0 4px" }}>
            Paste a direct image link, or search Unsplash below. Leave blank to show a placeholder in the shop.
          </p>
        )}

        <div
          style={{
            marginTop: 14,
            padding: 12,
            background: "var(--color-img-placeholder)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <label style={{ ...fieldLabel, margin: "0 0 6px" }} htmlFor="unsplash-query">
            Search Unsplash for a photo
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              id="unsplash-query"
              value={unsplashQuery}
              onChange={(e) => setUnsplashQuery(e.target.value)}
              style={{ ...fieldInput, background: "var(--color-white)" }}
              placeholder="e.g. facial serum bottle"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUnsplashSearch}
              disabled={unsplashStatus === "loading" || !unsplashQuery.trim()}
            >
              {unsplashStatus === "loading" ? "Searching..." : "Search"}
            </Button>
          </div>

          {unsplashStatus === "failed" && (
            <p style={{ fontSize: 12, color: "var(--color-danger)", margin: "8px 0 0" }}>{unsplashError}</p>
          )}

          {unsplashStatus === "succeeded" && unsplashResults.length === 0 && (
            <p style={{ fontSize: 12, color: "var(--color-gray)", margin: "8px 0 0" }}>
              No photos found for that search.
            </p>
          )}

          {unsplashResults.length > 0 && unsplashStatus === "succeeded" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
                marginTop: 10,
              }}
            >
              {unsplashResults.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => pickPhoto(photo)}
                  title={photo.alt}
                  style={{
                    padding: 0,
                    border: image === photo.regular ? "2px solid var(--color-primary)" : "2px solid transparent",
                    borderRadius: 6,
                    overflow: "hidden",
                    cursor: "pointer",
                    aspectRatio: "1 / 1",
                    background: "var(--color-white)",
                  }}
                >
                  <img
                    src={photo.thumb}
                    alt={photo.alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {(error || serverError) && (
          <p style={{ fontSize: 12, color: "var(--color-danger)", margin: "10px 0 0" }}>{error || serverError}</p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
          <Button variant="gradient" type="submit">{initial ? "Save Changes" : "Add Product"}</Button>
        </div>
      </form>
    </div>
  );
}

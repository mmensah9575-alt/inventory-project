import { useState } from "react";
import { useCollection } from "../../useCollection";
import ProductForm from "../../components/productForm";
import type { Product } from "../../types";

export default function Products() {
  const { items, loading, add, update, del } = useCollection<Product>("products");
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");

  const close = () => { setEditing(null); setAdding(false); };
  const shown = items.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="bg-gray-100 p-4 ">
      <h2>Products</h2>
      {adding || editing ? (
        <ProductForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          onCancel={close}
          onSave={async (data) => {
            if (editing) await update({ ...editing, ...data });
            else await add(data);
            close();
          }}
        />
      ) : (
        <button
          className="bg-blue-500 ml-3 h-11 text-white py-2 px-4 rounded"
          onClick={() => setAdding(true)}
        >
          + Add product
        </button>
      )}

      <input
        placeholder="Search…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {loading ? (
        <p>Loading…</p>
      ) : shown.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid">
          {shown.map((p) => (
            <div className="card" key={p.id}>
              {p.image && <img src={p.image} alt={p.title} className="thumb" />}
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <b>Price. GHS {p.price}</b> · Stock: {p.stock}
              <div className="row">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  onClick={() => setEditing(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded"
                  onClick={() => {
                    if (confirm(`Delete ${p.title}?`)) del(p.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
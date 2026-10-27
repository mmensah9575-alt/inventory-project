import { useState } from "react";
import type { FormEvent } from "react";
import { useCollection } from "../../useCollection";
import type { Product, Order } from "../../types";

export default function Orders() {
  const products = useCollection<Product>("products");
  const orders = useCollection<Order>("orders");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const p = products.items.find((x) => x.id === productId);
    if (!p) return setError("Choose a product");
    if (quantity > p.stock) return setError(`Only ${p.stock} in stock`);
    setError("");
    await products.update({ ...p, stock: p.stock - quantity });
    await orders.add({
      productId: p.id, quantity, price: p.price,
      buyerName, buyerPhone, date: new Date().toISOString(),
    });
    setQuantity(1); setBuyerName(""); setBuyerPhone(""); setProductId("");
  };

  const title = (id: string) => products.items.find((p) => p.id === id)?.title ?? "(deleted)";
  const sorted = [...orders.items].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <h2>Orders</h2>
      <form className="card row" onSubmit={submit}>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Product…</option>
          {products.items.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.stock} left)
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <input
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder="Buyer name"
          required
        />
        <input
          value={buyerPhone}
          onChange={(e) => setBuyerPhone(e.target.value)}
          placeholder="Buyer phone"
          required
        />
        <button
          className="bg-blue-500 w-sm ml-3 h-11 text-white py-2 px-4 rounded"
          type="submit"
        >
          Place order
        </button>
      </form>
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}
      

      <div className="grid">
        {sorted.map((o) => (
          <div className="card" key={o.id}>
            <h3>{title(o.productId)}</h3>
            <b>GHS {`${o.price * o.quantity}`}</b> · Qty: {`${o.quantity}`}
            <p>
              {o.buyerName} · {o.buyerPhone}
            </p>
            <small>{new Date(o.date).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </>
  );
}

import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { Product } from "../types";

interface Props {
  initial?: Product;
  onSave: (p: Omit<Product, "id">) => void;
  onCancel: () => void;
}

export default function ProductForm({ initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [stock, setStock] = useState(initial ? String(initial.stock) : "");
  const [image, setImage] = useState(initial?.image ?? "");

  const pickImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
    });
  };

  return (
    <form className="card row" onSubmit={submit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product name"
        required
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (GHS)"
        required
      />
      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Quantity in stock"
        required
      />
      <input type="file" accept="image/*" onChange={pickImage} />
      <button
        type="submit"
        className="bg-blue-500 w-sm ml-3 h-11 text-white py-2 px-4 rounded"
      >
        {initial ? "Save changes" : "Add"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-blue-500 w-sm ml-3 h-11 text-white py-2 px-4 rounded"
      >
        Cancel
      </button>
    </form>
  );
}
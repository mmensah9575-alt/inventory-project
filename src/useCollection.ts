import { useEffect, useState } from "react";
import { getAll, save, remove } from "./db";
import type { StoreName } from "./db";

export function useCollection<T extends { id: string }>(store: StoreName) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getAll<T>(store).then((data) => {
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [store, version]);

  const refresh = () => setVersion((v) => v + 1);

  const add = async (item: Omit<T, "id">) => {
    await save(store, { ...item, id: crypto.randomUUID() } as T);
    refresh();
  };
  const update = async (item: T) => {
    await save(store, item);
    refresh();
  };
  const del = async (id: string) => {
    await remove(store, id);
    refresh();
  };

  return { items, loading, add, update, del };
}

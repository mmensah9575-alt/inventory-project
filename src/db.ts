import { openDB } from "idb";

export type StoreName = "products" | "orders" | "users";

const dbPromise = openDB("ims-db", 1, {
  upgrade(db) {
    (["products", "orders", "users"] as StoreName[]).forEach((s) =>
      db.createObjectStore(s, { keyPath: "id" }),
    );
  },
});

export async function getAll<T>(store: StoreName): Promise<T[]> {
  return (await dbPromise).getAll(store);
}
export async function save<T extends { id: string }>(
  store: StoreName,
  item: T,
) {
  await (await dbPromise).put(store, item);
}
export async function remove(store: StoreName, id: string) {
  await (await dbPromise).delete(store, id);
}

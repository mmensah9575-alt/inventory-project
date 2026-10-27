import { useState } from "react";
import { useCollection } from "../../useCollection";
import { useAuth } from "../../authContext";
import { hash } from "../../hash";
import UserForm from "../userForm";
import type { UserFormData } from "../userForm";
import type { User } from "../../types";

export default function Users() {
  const { user } = useAuth();
  const { items, loading, add, update, del } = useCollection<User>("users");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [error, setError] = useState("");

  const isAdmin = items.find((u) => u.id === user?.id)?.role === "admin";
  const adminCount = items.filter((u) => u.role === "admin").length;
  const close = () => { setAdding(false); setEditing(null); setError(""); };

  const save = async (d: UserFormData) => {
    if (d.password && d.password.length < 6) return setError("Password must be at least 6 characters");

    if (editing) {
      if (editing.role === "admin" && d.role !== "admin" && adminCount === 1)
        return setError("There must be at least one admin");
      await update({
        ...editing, name: d.name, role: d.role,
        passwordHash: d.password ? await hash(editing.email, d.password) : editing.passwordHash,
      });
    } else {
      if (items.some((u) => u.email.toLowerCase() === d.email.toLowerCase()))
        return setError("That email is already used");
      await add({
        name: d.name, email: d.email, role: d.role,
        passwordHash: await hash(d.email, d.password),
      });
    }
    close();
  };

  return (
    <>
      <h2>Users</h2>

      {adding || editing ? (
        <UserForm key={editing?.id ?? "new"} initial={editing ?? undefined}
          error={error} onSave={save} onCancel={close} />
      ) : isAdmin ? (
        <button onClick={() => setAdding(true)}>+ New user</button>
      ) : null}

      {loading ? <p>Loading…</p> : (
        <div className="grid">
          {items.map((u) => (
            <div className="card" key={u.id}>
              <div className="row">
                <div className="avatar">{u.name[0]?.toUpperCase()}</div>
                <div>
                  <b>{u.name}</b>{u.id === user?.id && <small> (Current User)</small>}
                  <small style={{ display: "block", color: "#64748b" }}>{u.email}</small>
                </div>
              </div>
              <p><span className={`badge ${u.role}`}>{u.role}</span></p>
              {isAdmin && (
                <div className="row">
                  <button onClick={() => { setAdding(false); setEditing(u); }}>Edit</button>
                  {u.id !== user?.id && (
                    <button onClick={() => { if (confirm(`Delete ${u.name}?`)) del(u.id); }}>Delete</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
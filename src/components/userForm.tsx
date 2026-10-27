import { useState } from "react";
import type { FormEvent } from "react";
import type { User } from "../types";

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: User["role"];
}

interface Props {
  initial?: User;
  error?: string;
  onSave: (d: UserFormData) => void;
  onCancel: () => void;
}

export default function UserForm({ initial, error, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>(initial?.role ?? "staff");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, email, password, role });
  };

  return (
    <form className="card row" onSubmit={submit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={!!initial}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={initial ? "New password (blank = keep)" : "Password"}
        required={!initial}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as User["role"])}
      >
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">{initial ? "Save changes" : "Create user"}</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      {error && (
        <p style={{ color: "#dc2626", width: "100%", margin: 0 }}>{error}</p>
      )}
    </form>
  );
}

import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters");
    const err = await register(name, email, password);
    if (err) setError(err);
    else navigate("/dashboard", { replace: true });
  };

  return (
    <div className="logins">
      <form onSubmit={submit}>
        <div className="text-xl">Create your account</div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        {error && <p>{error}</p>}
        <button type="submit">Sign up</button>
        <p>Have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
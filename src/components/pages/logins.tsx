import { useState } from "react";
import type {FormEvent} from "react"
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";

function Login() {
   
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit =async (e: FormEvent) => {
    e.preventDefault();
    const err = await login(email,password);
    if (err) setError(err)
      else navigate("/dashboard",{replace:true});   
  };

  return (
    <div className="logins">
      <form onSubmit={handleSubmit}>
        <img src="" alt="Logo" />
        <div className="text-xl">Let's get you logged in</div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="m-2 text-lg border rounded-lg p-1"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="m-2 text-lg border rounded-lg p-1"
        />
        {error && <p>{error}</p>}
        <button
          type="submit"
          className=" w-40 h-10 rounded-lg text-white mt-3"
        >
          Login
        </button>
        <p>No account? <Link to="/signup">Create one</Link></p>
      </form>
    </div>
  );
}



export default Login
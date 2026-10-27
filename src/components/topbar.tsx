import { useAuth } from "../authContext";

export default function Topbar() {
  const { user } = useAuth();
  return (
    <div className="topbar">
      <h2>Welcome back, {user?.name}</h2>
      <div className="avatar">{user?.name?.[0] ?? "A"}</div>
    </div>
  );
}

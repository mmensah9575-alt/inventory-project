import {NavLink} from "react-router-dom";
import  {useAuth} from "../authContext";
import {useNavigate} from "react-router-dom";


const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/product", label: "Items" },
  { to: "/order", label: "Orders" },
  { to: "/users", label: "Users" },
];


function Sidebar() {
  
  const {logout} =useAuth()
  const navigate = useNavigate()

  return (
    <nav className="sidebar">
      <b className="brand text-white">Inventory</b>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {l.label}
        </NavLink>
      ))}
      <button onClick={() => {
        logout();
        navigate("/");
      }}>
        logout
      </button>
    </nav>
  );
}
export default Sidebar;

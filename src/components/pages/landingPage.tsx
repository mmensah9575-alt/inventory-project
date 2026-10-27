import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";

const features = [
  {
    icon: "📦",
    title: "Product management",
    text: "Add, edit and track every item with images and live stock counts.",
  },
  {
    icon: "🧾",
    title: "Order tracking",
    text: "Record sales and stock updates automatically with every order.",
  },
  {
    icon: "📈",
    title: "Sales dashboard",
    text: "See revenue, top sellers and low stock at a glance.",
  },
  {
    icon: "📱",
    title: "Works offline",
    text: "Install it on your phone or PC and keep working without internet.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const cta = user ? "/dashboard" : "/login";

  return (
    <div className="lp ">
      <header className="lp-header">
        <b>Inventory</b>
        <Link to={cta} className="lp-btn">
          {user ? "Dashboard" : "Log in"}
        </Link>
      </header>
      <section className="lp-hero background-row">
          <div className="bg-card image-one dfrf">
            <h1 className="gvgh">Run your shop's stock and sales in one place</h1>
            <p>
              Track products, record orders and watch your sales grow, from any
              device.
            </p>

            <Link to={cta} className="lp-btn lp-big ">
              {user ? "Go to dashboard" : "Get started"}
            </Link>
        </div>

        <div className="bg-card image-two"></div>
      </section>
      <section className="lp-features">
        {features.map((f) => (
          <div className="card" key={f.title}>
            <div className="lp-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>
      <footer className="lp-footer">
        © {new Date().getFullYear()} Inventory Management System
      </footer>
    </div>
  );
}

import { useState } from "react";
import { useCollection } from "../../useCollection";
import type { Product, Order } from "../../types";
import StatCard from "../StatCard";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#2563eb", "#f97316", "#16a34a", "#06b6d4", "#a855f7"];
const DAY = 86400000;
const money = (list: Order[]) => list.reduce((s, o) => s + o.quantity * o.price, 0);
const pct = (a: number, b: number) => (b === 0 ? (a > 0 ? 100 : 0) : ((a - b) / b) * 100);

function Donut({ data, center, colors = COLORS }: {
  data: { name: string; value: number }[]; center?: string; colors?: string[];
}) {
  return (
    <div className="donut-wrap">
      <div className="donut">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="65%" outerRadius="100%" paddingAngle={2} stroke="none">
              {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {center && <div className="donut-center">{center}</div>}
      </div>
      <div className="legend">
        {data.map((d, i) => (
          <div key={d.name}><i style={{ background: colors[i % colors.length] }} />{d.name}<b>{d.value}</b></div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const products = useCollection<Product>("products").items;
  const orders = useCollection<Order>("orders").items;
  const [range, setRange] = useState(7);

  const now = new Date().getTime();
  const cur = orders.filter((o) => new Date(o.date).getTime() >= now - 30 * DAY);
  const prev = orders.filter((o) => {
    const t = new Date(o.date).getTime();
    return t >= now - 60 * DAY && t < now - 30 * DAY;
  });

  const series = (days: number) =>
    Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const list = orders.filter((o) => new Date(o.date).toDateString() === d.toDateString());
      return {
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        orders: list.length,
        sales: money(list),
      };
    });
  const spark = series(7);
  const chart = series(range);

  const customers = new Set(orders.map((o) => o.buyerPhone)).size;

  const inStock = products.filter((p) => p.stock >= 5).length;
  const low = products.filter((p) => p.stock > 0 && p.stock < 5).length;
  const out = products.filter((p) => p.stock === 0).length;
  const stockData = [
    { name: "In stock", value: inStock },
    { name: "Low stock", value: low },
    { name: "Out of stock", value: out },
  ];
  const stockPct = products.length ? Math.round((inStock / products.length) * 100) : 0;
  const byStock = [...products].sort((a, b) => b.stock - a.stock).slice(0, 4)
    .map((p) => ({ name: p.title, value: p.stock }));

  const top = Object.values(
    orders.reduce<Record<string, { id: string; units: number }>>((acc, o) => {
      const r = acc[o.productId] ?? { id: o.productId, units: 0 };
      r.units += o.quantity;
      acc[o.productId] = r;
      return acc;
    }, {})
  ).sort((a, b) => b.units - a.units).slice(0, 4);
  const maxUnits = top[0]?.units ?? 1;

  const recent = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const find = (id: string) => products.find((p) => p.id === id);

  return (
    <>
      <h2 className="text-2xl m-3">Sales Activity</h2>

      <div className="stat-grid">
        <StatCard
          icon="🧾"
          color="#2563eb"
          label="Total Orders"
          value={orders.length}
          change={pct(cur.length, prev.length)}
          spark={spark.map((s) => s.orders)}
        />
        <StatCard
          icon= " "          
          color="#f97316"
          label="Total Products"
          value={products.length}
          note={`${low + out} need restocking`}
        />
        <StatCard
          icon="👥"
          color="#16a34a"
          label="Total Customers"
          value={customers}
          note="Unique buyers"
        />
        <StatCard
          icon="💲"
          color="#2563eb"
          label="Total Revenue"
          value={`GHS ${money(orders)}`}
          change={pct(money(cur), money(prev))}
          spark={spark.map((s) => s.sales)}
        />
      </div>

      <div className="dash-main">
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3>Sales Overview</h3>
            <select
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} width={45} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Recent Orders</h3>
          {recent.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            recent.map((o) => {
              const p = find(o.productId);
              return (
                <div className="recent" key={o.id}>
                  {p?.image ? (
                    <img src={p.image} alt="" />
                  ) : (
                    <div className="ph" />
                  )}
                  <div>
                    <b>{o.buyerName}</b>
                    <small>{p?.title ?? "(deleted)"}</small>
                  </div>
                  <div className="right">
                    <b>GHS {o.quantity * o.price}</b>
                    <small>{new Date(o.date).toLocaleDateString()}</small>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="dash-bottom">
        <div className="card">
          <h3>Stock Levels</h3>
          <Donut
            data={stockData}
            center={`${stockPct}%`}
            colors={["#2563eb", "#f97316", "#ef4444"]}
          />
        </div>
        <div className="card">
          <h3>Stock by Product</h3>
          <Donut data={byStock} />
        </div>
        <div className="card">
          <h3>Top Selling Products</h3>
          {top.length === 0 ? (
            <p>No sales yet.</p>
          ) : (
            top.map((t) => {
              const p = find(t.id);
              return (
                <div className="top-row" key={t.id}>
                  {p?.image ? (
                    <img src={p.image} alt="" />
                  ) : (
                    <div className="ph" />
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      className="row"
                      style={{ justifyContent: "space-between" }}
                    >
                      <span>{p?.title ?? "(deleted)"}</span>
                      <b>{t.units}</b>
                    </div>
                    <div className="bar">
                      <div
                        style={{ width: `${(t.units / maxUnits) * 100}% ` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

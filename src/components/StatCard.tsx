import type { ReactNode } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface Props {
  icon: ReactNode;
  color: string;
  label: string;
  value: string | number;
  note?: string;
  change?: number;
  spark?: number[];
}

export default function StatCard({
  icon,
  color,
  label,
  value,
  note,
  change,
  spark,
}: Props) {
  return (
    <div className="card stat-card">
      <div className="stat-top">
        <div className="stat-icon" style={{ background: color }}>
          {icon} 
        </div>
        <div>
          <span>{label}</span>
          <b>{value}</b>
        </div>
      </div>
      <div className="stat-bottom">
        {change !== undefined ? (
          <small className={change >= 0 ? "up" : "down"}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% vs last 30
            days
          </small>
        ) : (
          <small>{note}</small>
        )}
        {spark && (
          <div style={{ width: 90, height: 36 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark.map((v) => ({ v }))}>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

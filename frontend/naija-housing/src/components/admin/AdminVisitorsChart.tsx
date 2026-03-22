"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Point = {
  day: string;
  count: number;
};

export default function AdminVisitorsChart({
  title,
  data,
}: {
  title: string;
  data: Point[];
}) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  sales: {
    label: "Sales (PHP)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function SellerSalesChart({
  data,
}: {
  data: { week: string; sales: number }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="sales" fill="var(--color-sales)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}

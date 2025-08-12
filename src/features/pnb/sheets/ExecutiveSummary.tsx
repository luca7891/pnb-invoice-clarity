import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "../components/KpiCard";
import { InvoiceRecord } from "../types";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Bar, BarChart, PieChart, Pie, Cell } from "recharts";

function monthKey(d?: string) {
  if (!d) return "Unknown";
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

export const ExecutiveSummary = ({ data }: { data: InvoiceRecord[] }) => {
  const kpis = useMemo(() => {
    const total = data.length;
    const pass = data.filter(d => d.Match_Status === "PASS").length;
    const tol = data.filter(d => d.Match_Status === "TOLERANCE_PASS").length;
    const fail = data.filter(d => d.Match_Status === "FAIL").length;

    const days = data
      .map(d => (d.Match_Date && d.Resolution_Date) ? (new Date(d.Resolution_Date).getTime() - new Date(d.Match_Date).getTime()) / (1000*3600*24) : undefined)
      .filter((v): v is number => typeof v === 'number');
    const avgDays = days.length ? (days.reduce((a,b)=>a+b,0)/days.length) : 0;

    // Simplified DPO calculation placeholder using Payment Terms
    const dpo = Math.round((data.reduce((acc, d) => acc + (d.Payment_Terms?.includes("45") ? 45 : 30), 0) / Math.max(1, total)));

    const automated = data.filter(d => d.Tolerance_Pass_Flag || d.Auto_Release_Flag).length;

    return { total, pass, tol, fail, avgDays: avgDays.toFixed(1), dpo, automationRate: total ? Math.round((automated/total)*100) : 0 };
  }, [data]);

  const invoiceTrend = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => {
      const m = monthKey(d.Match_Date);
      map.set(m, (map.get(m) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([name, value]) => ({ name, value }));
  }, [data]);

  const exceptionTrend = useMemo(() => {
    const map = new Map<string, { A1: number; A2: number; A3: number }>();
    data.forEach(d => {
      const m = monthKey(d.Match_Date ?? d.Block_Date);
      const cur = map.get(m) ?? { A1: 0, A2: 0, A3: 0 };
      if (d.Match_Status === "FAIL") cur.A1 += 1;
      if (d.Exception_Type) cur.A2 += 1;
      if (d.Block_Reason) cur.A3 += 1;
      map.set(m, cur);
    });
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([name, v]) => ({ name, ...v }));
  }, [data]);

  const automation = useMemo(() => {
    const auto = data.filter(d => d.Tolerance_Pass_Flag || d.Auto_Release_Flag).length;
    const manual = data.length - auto;
    return [
      { name: "Automated", value: auto },
      { name: "Manual", value: manual },
    ];
  }, [data]);

  const topVendors = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => {
      const exception = d.Match_Status === "FAIL" || d.Exception_Type || d.Block_Reason;
      if (exception) map.set(d.Vendor_Number, (map.get(d.Vendor_Number) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([vendor, count]) => ({ vendor, count })).sort((a,b)=>b.count-a.count).slice(0,5);
  }, [data]);

  const colors = ["hsl(var(--primary))", "hsl(var(--accent))"]; // themed via CSS vars

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <KpiCard title="Total Invoices" value={kpis.total} />
        <KpiCard title="% Fully Matched" value={`${kpis.total ? Math.round((kpis.pass/kpis.total)*100) : 0}%`} />
        <KpiCard title="% Tolerance Matched" value={`${kpis.total ? Math.round((kpis.tol/kpis.total)*100) : 0}%`} />
        <KpiCard title="% Failed Matches" value={`${kpis.total ? Math.round((kpis.fail/kpis.total)*100) : 0}%`} />
        <KpiCard title="Avg Resolution Time (days)" value={kpis.avgDays} />
        <KpiCard title="Current DPO" value={kpis.dpo} />
        <KpiCard title="Automation Rate" value={`${kpis.automationRate}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Processing Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <LineChart data={invoiceTrend}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exception Rate Trend (by Agent)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={exceptionTrend}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="A1" stackId="a" fill="hsl(var(--accent))" name="Agent 1" />
                <Bar dataKey="A2" stackId="a" fill="hsl(var(--secondary))" name="Agent 2" />
                <Bar dataKey="A3" stackId="a" fill="hsl(var(--ring))" name="Agent 3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation vs Manual Handling</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={automation} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                  {automation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Vendors by Exception Volume</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={topVendors} layout="vertical">
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="vendor" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

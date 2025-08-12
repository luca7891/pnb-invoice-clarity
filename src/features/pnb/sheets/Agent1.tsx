import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "../components/KpiCard";
import { InvoiceRecord } from "../types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

function monthKey(d?: string) {
  if (!d) return "Unknown";
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

export const Agent1Sheet = ({ data }: { data: InvoiceRecord[] }) => {
  const total = data.length || 1;
  const pass = data.filter(d => d.Match_Status === "PASS").length;
  const tol = data.filter(d => d.Match_Status === "TOLERANCE_PASS").length;
  const fail = data.filter(d => d.Match_Status === "FAIL").length;
  const avgMatchTime = useMemo(() => {
    const vals = data
      .map(d => (d.GR_Date && d.Match_Date) ? (new Date(d.Match_Date).getTime() - new Date(d.GR_Date).getTime())/(1000*3600*24) : undefined)
      .filter((v): v is number => typeof v === 'number');
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : "0.0";
  }, [data]);

  const failReasons = useMemo(() => {
    const m = new Map<string, number>();
    data.filter(d => d.Match_Status === "FAIL").forEach(d => {
      const k = d.Root_Cause_Code ?? "UNKNOWN";
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [data]);

  const statusTrend = useMemo(() => {
    const m = new Map<string, { PASS: number; TOL: number; FAIL: number }>();
    data.forEach(d => {
      const k = monthKey(d.Match_Date);
      const cur = m.get(k) ?? { PASS: 0, TOL: 0, FAIL: 0 };
      if (d.Match_Status === "PASS") cur.PASS += 1;
      if (d.Match_Status === "TOLERANCE_PASS") cur.TOL += 1;
      if (d.Match_Status === "FAIL") cur.FAIL += 1;
      m.set(k, cur);
    });
    return Array.from(m.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([name, v]) => ({ name, ...v }));
  }, [data]);

  const tolDistribution = useMemo(() => {
    const yes = data.filter(d => d.Tolerance_Pass_Flag).length;
    const no = data.length - yes;
    return [ { name: "Tolerance Pass", value: yes }, { name: "Others", value: no } ];
  }, [data]);

  const byVendor = useMemo(() => {
    const m = new Map<string, number>();
    data.forEach(d => m.set(d.Vendor_Number, (m.get(d.Vendor_Number) ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value).slice(0,7);
  }, [data]);

  const colors = ["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--accent))"]; // semantic via tokens

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Match Rate (PASS)" value={`${Math.round((pass/total)*100)}%`} />
        <KpiCard title="Tolerance Pass Rate" value={`${Math.round((tol/total)*100)}%`} />
        <KpiCard title="Fail Rate" value={`${Math.round((fail/total)*100)}%`} />
        <KpiCard title="Avg Matching Time (days)" value={avgMatchTime} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Fail Reasons Breakdown</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={failReasons}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Match Status Trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <LineChart data={statusTrend}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="PASS" stroke={colors[0]} strokeWidth={2} />
                <Line type="monotone" dataKey="TOL" stroke={colors[2]} strokeWidth={2} />
                <Line type="monotone" dataKey="FAIL" stroke={colors[1]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tolerance Pass Distribution</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={tolDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                  {tolDistribution.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "hsl(var(--accent))" : "hsl(var(--muted))"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Exceptions by Vendor</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={byVendor}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2">Invoice_ID</th>
                <th>PO_Number</th>
                <th>GR_Date</th>
                <th>IR_Date</th>
                <th>Match_Status</th>
                <th>Root_Cause_Code</th>
                <th>Escalation_Flag</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.Invoice_ID} className="border-t">
                  <td className="py-2">{d.Invoice_ID}</td>
                  <td>{d.PO_Number}</td>
                  <td>{d.GR_Date}</td>
                  <td>{d.IR_Date}</td>
                  <td>{d.Match_Status}</td>
                  <td>{d.Root_Cause_Code ?? "-"}</td>
                  <td>{d.Escalation_Flag ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

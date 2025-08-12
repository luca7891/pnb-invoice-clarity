import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { KpiCard } from "../components/KpiCard";
import { InvoiceRecord } from "../types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";

function monthKey(d?: string) {
  if (!d) return "Unknown";
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

export const Agent2Sheet = ({ data, onNavigate }: { data: InvoiceRecord[]; onNavigate?: (tab: "exec" | "a1" | "a2" | "a3" | "dc", next?: any) => void }) => {
  const exceptions = data.filter(d => !!d.Exception_Type);
  const kExceptions = exceptions.length;
  const avgConf = exceptions.length ? (exceptions.reduce((a,b)=> a + (b.Confidence_Score ?? 0), 0) / exceptions.length) : 0;

  const mostRoot = useMemo(() => {
    const m = new Map<string, number>();
    exceptions.forEach(d => m.set(d.Root_Cause ?? "Other", (m.get(d.Root_Cause ?? "Other") ?? 0) + 1));
    return Array.from(m.entries()).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "-";
  }, [exceptions]);

  const clusters = useMemo(() => {
    const m = new Map<string, number>();
    exceptions.forEach(d => d.Cluster_ID && m.set(d.Cluster_ID, (m.get(d.Cluster_ID) ?? 0) + 1));
    // threshold = 2 for demo
    return Array.from(m.values()).filter(v => v > 1).length;
  }, [exceptions]);

  const rootDist = useMemo(() => {
    const m = new Map<string, number>();
    exceptions.forEach(d => m.set(d.Root_Cause ?? "Other", (m.get(d.Root_Cause ?? "Other") ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [exceptions]);

  const confHist = useMemo(() => {
    const buckets = [0,0,0,0,0];
    exceptions.forEach(d => {
      const c = d.Confidence_Score ?? 0;
      const idx = Math.min(4, Math.floor(c*5));
      buckets[idx] += 1;
    });
    return buckets.map((v,i)=>({ name: `${i*20}-${(i+1)*20}%`, value: v }));
  }, [exceptions]);

  const clustersByVendor = useMemo(() => {
    const m = new Map<string, number>();
    exceptions.forEach(d => m.set(d.Vendor_Number, (m.get(d.Vendor_Number) ?? 0) + 1));
    return Array.from(m.entries()).map(([name,value])=>({name,value}));
  }, [exceptions]);

  const recurringTrend = useMemo(() => {
    const m = new Map<string, number>();
    exceptions.forEach(d => {
      const k = monthKey(d.Match_Date);
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return Array.from(m.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([name,value])=>({name, value}));
  }, [exceptions]);

  const colors = ["hsl(var(--ring))", "hsl(var(--muted-foreground))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--destructive))"]; // mapped to tokens

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Exceptions Processed" value={kExceptions} />
        <KpiCard title="Avg Confidence Score" value={(avgConf*100).toFixed(0) + "%"} />
        <KpiCard title="Most Frequent Root Cause" value={mostRoot} />
        <KpiCard title="Recurring Clusters Detected" value={clusters} />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="secondary" onClick={() => onNavigate?.("a3", {})}>Assign Resolution Path</Button>
        <Button onClick={() => toast({ title: "Marked as Known Issue", description: "Current clusters and exceptions tagged for tracking." })}>Mark Exception as Known Issue</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Root Cause Distribution</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={rootDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {rootDist.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Confidence Score Histogram</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={confHist}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Exception Clusters by Vendor</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={clustersByVendor}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recurring Issue Trend Over Time</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <LineChart data={recurringTrend}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--ring))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Exceptions Table</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2">Invoice_ID</th>
                <th>Exception_Type</th>
                <th>Root_Cause</th>
                <th>Confidence_Score</th>
                <th>Cluster_ID</th>
                <th>Suggested_Action</th>
              </tr>
            </thead>
            <tbody>
              {exceptions.map((d) => (
                <tr key={d.Invoice_ID} className="border-t">
                  <td className="py-2">{d.Invoice_ID}</td>
                  <td>{d.Exception_Type}</td>
                  <td>{d.Root_Cause}</td>
                  <td>{(d.Confidence_Score ?? 0).toFixed(2)}</td>
                  <td>{d.Cluster_ID}</td>
                  <td>{d.Suggested_Action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

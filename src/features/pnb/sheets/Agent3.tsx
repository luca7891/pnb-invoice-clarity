import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { KpiCard } from "../components/KpiCard";
import { InvoiceRecord } from "../types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

function monthKey(d?: string) {
  if (!d) return "Unknown";
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

export const Agent3Sheet = ({ data }: { data: InvoiceRecord[] }) => {
  const blocked = data.filter(d => !!d.Block_Reason);
  const blockedInQueue = blocked.length;
  const avgResolution = useMemo(() => {
    const vals = blocked
      .map(d => (d.Block_Date && d.Resolution_Date) ? (new Date(d.Resolution_Date).getTime() - new Date(d.Block_Date).getTime())/(1000*3600*24) : undefined)
      .filter((v): v is number => typeof v === 'number');
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : "0.0";
  }, [blocked]);
  const autoReleasedPct = blocked.length ? Math.round((blocked.filter(d => d.Auto_Release_Flag).length/blocked.length)*100) : 0;
  const slaBreaches = blocked.filter(d => d.SLA_Breach_Flag).length;
  const slaPct = blocked.length ? Math.round((slaBreaches/blocked.length)*100) : 0;

  const blockReasons = useMemo(() => {
    const m = new Map<string, number>();
    blocked.forEach(d => m.set(d.Block_Reason ?? "Other", (m.get(d.Block_Reason ?? "Other") ?? 0) + 1));
    return Array.from(m.entries()).map(([name,value])=>({name,value}));
  }, [blocked]);

  const successByAction = useMemo(() => {
    const m = new Map<string, { total: number; resolved: number }>();
    blocked.forEach(d => {
      const k = d.Resolution_Suggestion ?? "Other";
      const cur = m.get(k) ?? { total: 0, resolved: 0 };
      cur.total += 1;
      if (d.Resolution_Date) cur.resolved += 1;
      m.set(k, cur);
    });
    return Array.from(m.entries()).map(([name, v])=>({ name, value: Math.round((v.resolved/Math.max(1,v.total))*100) }));
  }, [blocked]);

  const slaTrend = useMemo(() => {
    const m = new Map<string, { total: number; breach: number }>();
    blocked.forEach(d => {
      const k = monthKey(d.Resolution_Date ?? d.Block_Date);
      const cur = m.get(k) ?? { total: 0, breach: 0 };
      cur.total += 1;
      if (d.SLA_Breach_Flag) cur.breach += 1;
      m.set(k, cur);
    });
    return Array.from(m.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([name, v])=>({ name, pct: Math.round((v.breach/Math.max(1,v.total))*100) }));
  }, [blocked]);

  const dpoImpact = useMemo(() => {
    // simplified: higher blocked count => higher DPO impact for demo
    const m = new Map<string, number>();
    blocked.forEach(d => {
      const k = monthKey(d.Block_Date);
      m.set(k, (m.get(k) ?? 0) + (d.SLA_Breach_Flag ? 2 : 1));
    });
    return Array.from(m.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([name, value])=>({ name, value }));
  }, [blocked]);

  const colors = ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--destructive))"]; // tokens in theme

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Blocked Invoices in Queue" value={blockedInQueue} />
        <KpiCard title="Avg Resolution Time (days)" value={avgResolution} />
        <KpiCard title="% Auto-Released" value={`${autoReleasedPct}%`} />
        <KpiCard title="SLA Breaches Count & %" value={`${slaBreaches} (${slaPct}%)`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Block Reasons Distribution</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={blockReasons} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {blockReasons.map((_,i)=>(<Cell key={i} fill={colors[i % colors.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resolution Success Rate by Action</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={successByAction}>
                <XAxis dataKey="name" />
                <YAxis domain={[0,100]} tickFormatter={(v)=>`${v}%`} />
                <Tooltip formatter={(v)=>`${v}%`} />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SLA Breach Trend Over Time</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <LineChart data={slaTrend}>
                <XAxis dataKey="name" />
                <YAxis domain={[0,100]} tickFormatter={(v)=>`${v}%`} />
                <Tooltip formatter={(v)=>`${v}%`} />
                <Line type="monotone" dataKey="pct" stroke="hsl(var(--destructive))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>DPO Impact Trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <LineChart data={dpoImpact}>
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
        <CardHeader><CardTitle>Blocked Invoices Table</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2">Invoice_ID</th>
                <th>Block_Reason</th>
                <th>Suggested_Resolution</th>
                <th>Responsible_Team</th>
                <th>Auto_Release_Flag</th>
                <th>Resolution_Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blocked.map((d) => (
                <tr key={d.Invoice_ID} className="border-t">
                  <td className="py-2">{d.Invoice_ID}</td>
                  <td>{d.Block_Reason}</td>
                  <td>{d.Resolution_Suggestion}</td>
                  <td>{d.Responsible_Team}</td>
                  <td>{d.Auto_Release_Flag ? "Yes" : "No"}</td>
                  <td>{d.Resolution_Date ?? "-"}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => toast({ title: "Initiated GR Posting", description: `Invoice ${d.Invoice_ID}` })}>Initiate GR Posting</Button>
                      <Button size="sm" variant="secondary" onClick={() => toast({ title: "PO Amendment Requested", description: `PO ${d.PO_Number} for Invoice ${d.Invoice_ID}` })}>Amend PO</Button>
                      <Button size="sm" variant="secondary" onClick={() => toast({ title: "Auto-Release Triggered", description: `Invoice ${d.Invoice_ID}` })}>Trigger Auto-Release</Button>
                      <Button size="sm" onClick={() => toast({ title: "Escalated to Manager", description: `Invoice ${d.Invoice_ID}` })}>Escalate</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

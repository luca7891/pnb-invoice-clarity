import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { InvoiceRecord } from "../types";

export const DecisionCenter = ({ data }: { data: InvoiceRecord[] }) => {
  const active = useMemo(() => data.filter(d => d.Match_Status === "FAIL" || d.Exception_Type || d.Block_Reason), [data]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const bulk = (action: string) => {
    const count = selected.size;
    toast({ title: `${action} executed`, description: count ? `${count} invoice(s) affected` : "No invoices selected" });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Decision Center</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="secondary" onClick={() => bulk("Apply Resolution")}>Apply Resolution</Button>
            <Button onClick={() => bulk("Escalate")}>Escalate</Button>
            <Button variant="secondary" onClick={() => bulk("Defer")}>Defer</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Exceptions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2"><span className="sr-only">Select</span></th>
                <th>Invoice ID</th>
                <th>Vendor</th>
                <th>Match Status</th>
                <th>Root Cause</th>
                <th>Block Reason</th>
                <th>Suggested Resolution</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {active.map((d) => (
                <tr key={d.Invoice_ID} className="border-t">
                  <td className="py-2">
                    <input type="checkbox" checked={selected.has(d.Invoice_ID)} onChange={() => toggle(d.Invoice_ID)} />
                  </td>
                  <td className="py-2">{d.Invoice_ID}</td>
                  <td>{d.Vendor_Number}</td>
                  <td>{d.Match_Status ?? "-"}</td>
                  <td>{d.Root_Cause ?? "-"}</td>
                  <td>{d.Block_Reason ?? "-"}</td>
                  <td>{d.Suggested_Action ?? d.Resolution_Suggestion ?? "-"}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => toast({ title: "Resolution Applied", description: `Invoice ${d.Invoice_ID}` })}>Apply</Button>
                      <Button size="sm" onClick={() => toast({ title: "Escalated", description: `Invoice ${d.Invoice_ID}` })}>Escalate</Button>
                      <Button size="sm" variant="secondary" onClick={() => toast({ title: "Deferred", description: `Invoice ${d.Invoice_ID}` })}>Defer</Button>
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

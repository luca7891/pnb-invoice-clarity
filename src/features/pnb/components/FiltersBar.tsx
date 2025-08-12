import { useMemo } from "react";
import { FiltersState, InvoiceRecord, MatchStatus } from "../types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FiltersBarProps {
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
  vendors: string[];
  plants: string[];
  materials: string[];
  poTypes: string[];
  matchStatuses: MatchStatus[];
  exceptionTypes: string[];
  blockReasons: string[];
  teams: string[];
}

export function applyFilters(data: InvoiceRecord[], f: FiltersState) {
  return data.filter((d) => {
    const inDateRange = (() => {
      if (!f.startDate && !f.endDate) return true;
      const md = d.Match_Date ?? d.IR_Date ?? d.GR_Date;
      if (!md) return false;
      const t = new Date(md).getTime();
      if (f.startDate && t < new Date(f.startDate).getTime()) return false;
      if (f.endDate && t > new Date(f.endDate).getTime()) return false;
      return true;
    })();

    const checks = [
      inDateRange,
      f.vendor ? d.Vendor_Number === f.vendor : true,
      f.plant ? d.Plant === f.plant : true,
      f.material ? d.Material_Number === f.material : true,
      f.poType ? d.PO_Type === f.poType : true,
      f.matchStatus && f.matchStatus !== "ALL" ? d.Match_Status === f.matchStatus : true,
      f.exceptionType ? d.Exception_Type === f.exceptionType : true,
      f.blockReason ? d.Block_Reason === f.blockReason : true,
      f.responsibleTeam ? d.Responsible_Team === f.responsibleTeam : true,
    ];
    return checks.every(Boolean);
  });
}

export const FiltersBar = ({ filters, onChange, vendors, plants, materials, poTypes, matchStatuses, exceptionTypes, blockReasons, teams }: FiltersBarProps) => {
  const unique = useMemo(() => ({ vendors, plants, materials, poTypes, matchStatuses, exceptionTypes, blockReasons, teams }), [vendors, plants, materials, poTypes, matchStatuses, exceptionTypes, blockReasons, teams]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3">
      <Input type="date" value={filters.startDate ?? ""} onChange={(e) => onChange({ ...filters, startDate: e.target.value })} placeholder="Start date" />
      <Input type="date" value={filters.endDate ?? ""} onChange={(e) => onChange({ ...filters, endDate: e.target.value })} placeholder="End date" />

      <Select value={filters.vendor ?? undefined} onValueChange={(v) => onChange({ ...filters, vendor: v })}>
        <SelectTrigger><SelectValue placeholder="Vendor" /></SelectTrigger>
        <SelectContent>
          {unique.vendors.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.plant ?? undefined} onValueChange={(v) => onChange({ ...filters, plant: v })}>
        <SelectTrigger><SelectValue placeholder="Plant" /></SelectTrigger>
        <SelectContent>
          {unique.plants.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.material ?? undefined} onValueChange={(v) => onChange({ ...filters, material: v })}>
        <SelectTrigger><SelectValue placeholder="Material" /></SelectTrigger>
        <SelectContent>
          {unique.materials.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.poType ?? undefined} onValueChange={(v) => onChange({ ...filters, poType: v })}>
        <SelectTrigger><SelectValue placeholder="PO Type" /></SelectTrigger>
        <SelectContent>
          {unique.poTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={(filters.matchStatus ?? "ALL") as string} onValueChange={(v) => onChange({ ...filters, matchStatus: v as any })}>
        <SelectTrigger><SelectValue placeholder="Match Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">ALL</SelectItem>
          {unique.matchStatuses.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.exceptionType ?? undefined} onValueChange={(v) => onChange({ ...filters, exceptionType: v })}>
        <SelectTrigger><SelectValue placeholder="Exception Type" /></SelectTrigger>
        <SelectContent>
          {unique.exceptionTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.blockReason ?? undefined} onValueChange={(v) => onChange({ ...filters, blockReason: v })}>
        <SelectTrigger><SelectValue placeholder="Block Reason" /></SelectTrigger>
        <SelectContent>
          {unique.blockReasons.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.responsibleTeam ?? undefined} onValueChange={(v) => onChange({ ...filters, responsibleTeam: v })}>
        <SelectTrigger><SelectValue placeholder="Team" /></SelectTrigger>
        <SelectContent>
          {unique.teams.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="col-span-full flex justify-end">
        <Button variant="secondary" onClick={() => onChange({})}>Reset Filters</Button>
      </div>
    </div>
  );
};

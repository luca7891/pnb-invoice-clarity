import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiltersBar, applyFilters } from "@/features/pnb/components/FiltersBar";
import { ExecutiveSummary } from "@/features/pnb/sheets/ExecutiveSummary";
import { Agent1Sheet } from "@/features/pnb/sheets/Agent1";
import { Agent2Sheet } from "@/features/pnb/sheets/Agent2";
import { Agent3Sheet } from "@/features/pnb/sheets/Agent3";
import { FiltersState } from "@/features/pnb/types";
import { invoices, allVendors, allMaterials, allPlants, allPOTypes, allMatchStatuses, allExceptionTypes, allBlockReasons, allTeams } from "@/features/pnb/mockData";

const Index = () => {
  const [filters, setFilters] = useState<FiltersState>({});
  const filtered = useMemo(() => applyFilters(invoices, filters), [filters]);

  return (
    <main className="min-h-screen container py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">PNB App Celonis EMS Dashboard</h1>
        <p className="text-muted-foreground mt-2">Executive Summary and Agent views for Parked & Blocked Invoices.</p>
      </header>

      <Card className="mb-6 shadow-glow">
        <CardHeader>
          <CardTitle>Global Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <FiltersBar
            filters={filters}
            onChange={setFilters}
            vendors={allVendors}
            plants={allPlants}
            materials={allMaterials}
            poTypes={allPOTypes}
            matchStatuses={allMatchStatuses}
            exceptionTypes={allExceptionTypes}
            blockReasons={allBlockReasons}
            teams={allTeams}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="exec" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="exec">Executive Summary</TabsTrigger>
          <TabsTrigger value="a1">Agent 1: Four-Way Match</TabsTrigger>
          <TabsTrigger value="a2">Agent 2: Root Cause</TabsTrigger>
          <TabsTrigger value="a3">Agent 3: Payment Block</TabsTrigger>
        </TabsList>

        <TabsContent value="exec" className="mt-6">
          <ExecutiveSummary data={filtered} />
        </TabsContent>
        <TabsContent value="a1" className="mt-6">
          <Agent1Sheet data={filtered} />
        </TabsContent>
        <TabsContent value="a2" className="mt-6">
          <Agent2Sheet data={filtered} />
        </TabsContent>
        <TabsContent value="a3" className="mt-6">
          <Agent3Sheet data={filtered} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Index;

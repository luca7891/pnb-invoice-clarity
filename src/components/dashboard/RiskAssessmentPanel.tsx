import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, DollarSign, Clock, TrendingDown, MapPin } from "lucide-react";
export const RiskAssessmentPanel = () => {
  const criticalOrders = [{
    orderId: "ORD-042502030311",
    store: "L04 - Leuven Kessel-Lo",
    value: "€12,450",
    items: 145,
    risk: "High",
    reason: "Warehouse understaffing + weather delay",
    estimatedLoss: "€2,100",
    perishables: 35,
    timeWindow: "2 hours remaining"
  }, {
    orderId: "ORD-042502030401",
    store: "B045 - Brussels Croix de Guerre",
    value: "€8,920",
    items: 98,
    risk: "Medium",
    reason: "Route disruption (roadworks)",
    estimatedLoss: "€890",
    perishables: 12,
    timeWindow: "4 hours remaining"
  }, {
    orderId: "ORD-042502030515",
    store: "A013 - Antwerp Bosuil",
    value: "€15,670",
    items: 201,
    risk: "Critical",
    reason: "Bridge closure + driver shortage",
    estimatedLoss: "€4,200",
    perishables: 67,
    timeWindow: "1 hour remaining"
  }];
  const stockRiskAnalysis = {
    totalAtRisk: 156700,
    perishableAtRisk: 45200,
    ordersMissed: 23,
    storesAffected: 8,
    categories: [{
      name: "Fresh Produce",
      risk: "€18,450",
      percentage: 65
    }, {
      name: "Dairy",
      risk: "€12,200",
      percentage: 45
    }, {
      name: "Meat & Fish",
      risk: "€8,900",
      percentage: 80
    }, {
      name: "Bakery",
      risk: "€5,650",
      percentage: 70
    }]
  };
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "destructive";
      case "High":
        return "high-risk";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "secondary";
    }
  };
  const mitigationActions = [{
    action: "Emergency Re-routing",
    description: "Reroute critical deliveries via alternative routes",
    impact: "Save 15 orders, €45k value",
    timeRequired: "30 minutes",
    cost: "€450 extra fuel"
  }, {
    action: "Priority Loading",
    description: "Fast-track perishable orders in loading queue",
    impact: "Reduce spoilage by 60%",
    timeRequired: "15 minutes",
    cost: "€200 overtime"
  }, {
    action: "Customer Communication",
    description: "Proactive notification to affected stores",
    impact: "Maintain customer satisfaction",
    timeRequired: "5 minutes",
    cost: "No additional cost"
  }];
  return <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-destructive" />
              Total Value at Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">€{(stockRiskAnalysis.totalAtRisk / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">Across {stockRiskAnalysis.ordersMissed} orders</p>
          </CardContent>
        </Card>

        <Card className="border-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-warning" />
              Perishable Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">€{(stockRiskAnalysis.perishableAtRisk / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">Time-sensitive items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Stores Affected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockRiskAnalysis.storesAffected}</div>
            <p className="text-xs text-muted-foreground">Delivery disruptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              OTIF Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">-12%</div>
            <p className="text-xs text-muted-foreground">Projected drop</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Orders at Risk */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Critical Orders at Risk
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Forecast: 7-8 August
            </div>
          </div>
          <CardDescription>Orders with high probability of delay or failure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalOrders.map((order, index) => <div key={index} className="p-4 border rounded-lg bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="font-medium">{order.orderId}</div>
                    <div className="text-sm text-muted-foreground">{order.store}</div>
                  </div>
                  <Badge variant={getRiskColor(order.risk) as any}>{order.risk} Risk</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order Value:</span>
                    <div className="font-medium">{order.value}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Items:</span>
                    <div className="font-medium">{order.items} ({order.perishables} perishable)</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Potential Loss:</span>
                    <div className="font-medium text-destructive">{order.estimatedLoss}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time Window:</span>
                    <div className="font-medium text-warning">{order.timeWindow}</div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Risk Factors:</span>
                    <span className="ml-2">{order.reason}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-slate-50 bg-red-600 hover:bg-red-500">Reroute</Button>
                  <Button size="sm" variant="outline" className="text-slate-50 bg-red-600 hover:bg-red-500">Priority Load</Button>
                  <Button size="sm" variant="outline" className="text-slate-50 bg-red-600 hover:bg-red-500">Alert Store</Button>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Stock Category Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Stock Category Risk
            </CardTitle>
            <CardDescription>Risk breakdown by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockRiskAnalysis.categories.map((category, index) => <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm font-medium text-destructive">{category.risk}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-destructive h-2 rounded-full" style={{
                  width: `${category.percentage}%`
                }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.percentage}% of category at risk
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Mitigation Actions
            </CardTitle>
            <CardDescription>Available actions to reduce risk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mitigationActions.map((action, index) => <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{action.action}</div>
                    <Badge variant="outline">{action.timeRequired}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {action.description}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-success">{action.impact}</span>
                    <span className="text-muted-foreground">{action.cost}</span>
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Execute Action
                  </Button>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Impact Summary</CardTitle>
          <CardDescription>Cost analysis of delivery disruptions and mitigation efforts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Direct Losses</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Spoiled perishables:</span>
                  <span className="text-destructive">€7,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Penalty charges:</span>
                  <span className="text-destructive">€3,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Lost sales:</span>
                  <span className="text-destructive">€12,800</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total Direct:</span>
                  <span className="text-destructive">€23,500</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Mitigation Costs</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Overtime pay:</span>
                  <span>€1,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency routing:</span>
                  <span>€450</span>
                </div>
                <div className="flex justify-between">
                  <span>Temp staff:</span>
                  <span>€800</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total Mitigation:</span>
                  <span>€2,450</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Net Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Without action:</span>
                  <span className="text-destructive">-€23,500</span>
                </div>
                <div className="flex justify-between">
                  <span>With mitigation:</span>
                  <span className="text-warning">-€8,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Mitigation cost:</span>
                  <span>-€2,450</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Net Savings:</span>
                  <span className="text-success">€12,850</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
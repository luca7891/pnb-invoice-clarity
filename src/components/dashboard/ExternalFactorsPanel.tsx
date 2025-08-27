import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Cloud, Users, MapPin, Calendar, Activity } from "lucide-react";

export const ExternalFactorsPanel = () => {
  const weatherFactors = [
    { factor: "Heavy Rain", impact: "High", affected: "Routes 15, 23, 31", delay: "+25 min" },
    { factor: "Fog", impact: "Medium", affected: "Routes 8, 12", delay: "+12 min" },
    { factor: "Sunny/Hot", impact: "Low", affected: "All Routes", delay: "+3 min" }
  ];

  const laborFactors = [
    { factor: "Flu Outbreak", impact: "High", affected: "Zellik Depot", staffReduction: "-15%" },
    { factor: "National Holiday", impact: "Critical", affected: "All Facilities", staffReduction: "-40%" },
    { factor: "Strike Action", impact: "Medium", affected: "Transport Union", staffReduction: "-25%" }
  ];

  const routeFactors = [
    { factor: "Roadworks A12", impact: "High", affected: "Routes to Antwerp", delay: "+35 min" },
    { factor: "Event Traffic", impact: "Medium", affected: "Brussels Routes", delay: "+18 min" },
    { factor: "Bridge Closure", impact: "Critical", affected: "Routes 5, 6, 7", delay: "+60 min" }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical": return "destructive";
      case "High": return "high-risk";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weather Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Conditions
          </CardTitle>
          <CardDescription>Weather impact on operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weatherFactors.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">{item.factor}</div>
                <div className="text-sm text-muted-foreground">{item.affected}</div>
              </div>
              <div className="text-right space-y-1">
                <Badge variant={getImpactColor(item.impact) as any}>{item.impact}</Badge>
                <div className="text-sm font-medium text-warning">{item.delay}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Labor Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Labor Availability
          </CardTitle>
          <CardDescription>Staff availability factors affecting operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {laborFactors.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">{item.factor}</div>
                <div className="text-sm text-muted-foreground">{item.affected}</div>
              </div>
              <div className="text-right space-y-1">
                <Badge variant={getImpactColor(item.impact) as any}>{item.impact}</Badge>
                <div className="text-sm font-medium text-destructive">{item.staffReduction}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Route Disruptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Route Disruptions
          </CardTitle>
          <CardDescription>Current route disruptions and traffic conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {routeFactors.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">{item.factor}</div>
                <div className="text-sm text-muted-foreground">{item.affected}</div>
              </div>
              <div className="text-right space-y-1">
                <Badge variant={getImpactColor(item.impact) as any}>{item.impact}</Badge>
                <div className="text-sm font-medium text-warning">{item.delay}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Real-time Alerts */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Real-time External Factor Alerts
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Forecast: 7-8 August
            </div>
          </div>
          <CardDescription>Live feed of external factors affecting delivery performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <div className="font-medium">Critical: Bridge Closure on A10</div>
                <div className="text-sm text-muted-foreground">
                  Major bridge closure affecting routes to Ghent. Expected delay: +60 minutes for 15 deliveries.
                </div>
              </div>
              <Badge variant="destructive">Active</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <Activity className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <div className="font-medium">High Impact: Flu Outbreak at Warehouse-1</div>
                <div className="text-sm text-muted-foreground">
                  15% staff reduction detected. Minimum 80 operators required for Carrier 100 operations.
                </div>
              </div>
              <Badge variant="secondary">Monitoring</Badge>
            </div>

            <div className="flex items-center gap-3 p-4 bg-info/10 border border-info/20 rounded-lg">
              <Calendar className="h-5 w-5 text-info" />
              <div className="flex-1">
                <div className="font-medium">Upcoming: National Holiday Tomorrow</div>
                <div className="text-sm text-muted-foreground">
                  40% staff reduction expected. Proactive order allocation adjustments recommended.
                </div>
              </div>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

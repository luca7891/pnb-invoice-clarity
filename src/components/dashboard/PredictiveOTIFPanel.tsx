import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter
} from "recharts";
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export const PredictiveOTIFPanel = () => {
  const delayDistributionData = [
    { range: "-40", frequency: 150 },
    { range: "-20", frequency: 800 },
    { range: "0", frequency: 3500 },
    { range: "20", frequency: 2000 },
    { range: "40", frequency: 900 },
    { range: "60", frequency: 500 },
    { range: "80", frequency: 200 },
    { range: "100", frequency: 100 }
  ];

  const actualVsPredictedData = [
    { actual: 45, predicted: 42 },
    { actual: 67, predicted: 65 },
    { actual: 23, predicted: 28 },
    { actual: 89, predicted: 85 },
    { actual: 12, predicted: 15 },
    { actual: 156, predicted: 145 },
    { actual: 34, predicted: 38 },
    { actual: 78, predicted: 82 }
  ];

  const orders = [
    {
      store: "L034",
      route: "042502030311",
      classification: "Planning w/o Warehouse",
      predictedDelay: 8,
      estimatedDelay: 6,
      status: "Planned Delivery",
      stopsBefore: 3,
      rootCause: "Store ID",
      fulfillmentTime: "Fulfillment Time"
    },
    {
      store: "B682",
      route: "042502030401",
      classification: "Planning w/o Warehouse", 
      predictedDelay: 3,
      estimatedDelay: 6,
      status: "Planned Delivery",
      stopsBefore: 4,
      rootCause: "Store ID",
      fulfillmentTime: "Fulfillment Time"
    },
    {
      store: "B618",
      route: "042502030515",
      classification: "Planning w/o Warehouse",
      predictedDelay: 32,
      estimatedDelay: 32,
      status: "Estimated Arrival Store",
      stopsBefore: 3,
      rootCause: "DriverID",
      fulfillmentTime: "Departure delay"
    }
  ];

  const getDelayBadge = (delay: number) => {
    if (delay <= 5) return <Badge variant="secondary" className="bg-success text-success-foreground">{delay} min</Badge>;
    if (delay <= 15) return <Badge variant="secondary" className="bg-warning text-warning-foreground">{delay} min</Badge>;
    return <Badge variant="destructive">{delay} min</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Predicted Delays Distribution</CardTitle>
            <CardDescription>Frequency distribution of predicted delivery delays</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={delayDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="frequency" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actual vs Predicted Plot</CardTitle>
            <CardDescription>Accuracy of delay predictions vs actual outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart data={actualVsPredictedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="predicted" name="Predicted" />
                <YAxis dataKey="actual" name="Actual" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative Delays</CardTitle>
            <CardDescription>Real-time delay accumulation tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Driver Availability</div>
                <div className="text-lg font-semibold">71 min</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Picking Delay</div>
                <div className="text-lg font-semibold">-</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Loading Start</div>
                <div className="text-lg font-semibold">0 min</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Loading End</div>
                <div className="text-lg font-semibold">0 min</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">Deploy Agent</Button>
              <Button size="sm" variant="outline" className="flex-1">Alert Store</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Detail Analysis</CardTitle>
          <CardDescription>Detailed breakdown of predicted delivery performance by order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Store</th>
                  <th className="text-left p-2 font-medium">Route ID</th>
                  <th className="text-left p-2 font-medium">Classification</th>
                  <th className="text-left p-2 font-medium">Predicted Delay</th>
                  <th className="text-left p-2 font-medium">Estimated Time</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Stops Before</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{order.store}</td>
                    <td className="p-2 text-sm text-muted-foreground">{order.route}</td>
                    <td className="p-2">
                      <Badge variant="secondary">{order.classification}</Badge>
                    </td>
                    <td className="p-2">{getDelayBadge(order.predictedDelay)}</td>
                    <td className="p-2">{getDelayBadge(order.estimatedDelay)}</td>
                    <td className="p-2">
                      <Badge variant={order.status.includes("Planned") ? "secondary" : "outline"}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">{order.stopsBefore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Users, Clock, Truck, TrendingDown, CheckCircle } from "lucide-react";
export const WarehouseCapacityPanel = () => {
  const warehouseData = {
    currentStaff: 72,
    requiredStaff: 80,
    maxCapacity: 120,
    carrier100Orders: 45,
    estimatedDelayPerMissingStaff: 3.5,
    // minutes per missing operator
    criticalThreshold: 80
  };
  const staffingProgress = warehouseData.currentStaff / warehouseData.requiredStaff * 100;
  const missingStaff = warehouseData.requiredStaff - warehouseData.currentStaff;
  const estimatedDelay = missingStaff * warehouseData.estimatedDelayPerMissingStaff;
  const capacityMetrics = [{
    title: "Current Operators",
    value: warehouseData.currentStaff,
    target: warehouseData.requiredStaff,
    unit: "operators",
    status: warehouseData.currentStaff >= warehouseData.requiredStaff ? "success" : "critical"
  }, {
    title: "Carrier 100 Orders",
    value: warehouseData.carrier100Orders,
    target: 50,
    unit: "orders",
    status: "warning"
  }, {
    title: "Estimated Delay Impact",
    value: Math.round(estimatedDelay),
    target: 0,
    unit: "minutes",
    status: estimatedDelay > 0 ? "critical" : "success"
  }, {
    title: "Capacity Utilization",
    value: Math.round(warehouseData.currentStaff / warehouseData.maxCapacity * 100),
    target: 100,
    unit: "%",
    status: "info"
  }];
  const shiftData = [{
    shift: "Morning (6-14)",
    current: 28,
    planned: 32,
    status: "understaffed"
  }, {
    shift: "Day (14-22)",
    current: 24,
    planned: 28,
    status: "understaffed"
  }, {
    shift: "Night (22-6)",
    current: 20,
    planned: 20,
    status: "adequate"
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      case "success":
        return "secondary";
      case "info":
        return "secondary";
      default:
        return "secondary";
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };
  return <div className="space-y-6">
      {/* Critical Alert */}
      {warehouseData.currentStaff < warehouseData.requiredStaff && <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Critical Staffing Alert - Zellik Depot
            </CardTitle>
            <CardDescription>
              Carrier 100 operations require minimum {warehouseData.requiredStaff} operators. 
              Current shortfall will impact loading times and order fulfillment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">
                  <strong className="bg-[#000d60]/0 rounded-none">{missingStaff} operators short</strong> - Estimated delay: <strong>+{Math.round(estimatedDelay)} minutes</strong> per order
                </p>
              </div>
              <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-500">
                Alert Management
              </Button>
            </div>
          </CardContent>
        </Card>}

      {/* Capacity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {capacityMetrics.map((metric, index) => <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getStatusIcon(metric.status)}
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-xs text-muted-foreground">
                Target: {metric.target} {metric.unit}
              </div>
              {metric.title === "Current Operators" && <Progress value={staffingProgress} className="mt-2" />}
            </CardContent>
          </Card>)}
      </div>

      {/* Shift Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Shift Staffing Analysis
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Forecast: 7 August
              </div>
            </div>
            <CardDescription>Current vs planned staffing by shift</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shiftData.map((shift, index) => <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{shift.shift}</div>
                    <div className="text-sm text-muted-foreground">
                      {shift.current}/{shift.planned} operators
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={shift.status === "adequate" ? "secondary" : "destructive"}>
                      {shift.status === "adequate" ? "Adequate" : "Understaffed"}
                    </Badge>
                    <div className="text-sm">
                      {shift.current < shift.planned && <span className="text-destructive">-{shift.planned - shift.current}</span>}
                    </div>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Carrier 100 Impact Analysis
            </CardTitle>
            <CardDescription>How staffing levels affect Carrier 100 performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="font-medium">Carrier 100 Requirements</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>• Minimum 80 operators required</div>
                  <div>• Peak efficiency at 95+ operators</div>
                  <div>• Each missing operator adds ~3.5 min delay</div>
                </div>
              </div>

              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-warning" />
                  <span className="font-medium">Current Impact</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>• {missingStaff} operators below minimum</div>
                  <div>• +{Math.round(estimatedDelay)} min average delay per order</div>
                  <div>• {warehouseData.carrier100Orders} orders at risk today</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-slate-50 bg-red-600 hover:bg-red-500">
                  Request Overtime
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-slate-50 bg-red-600 hover:bg-red-500">
                  Temp Staff
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recommended Actions</CardTitle>
            <div className="text-sm text-muted-foreground">
              Forecast: 7-8 August
            </div>
          </div>
          <CardDescription>Immediate steps to address capacity constraints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-red-300">
              <div className="font-medium mb-2">Immediate (Next 2 hours)</div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Call in 8 overtime operators</li>
                <li>• Prioritize Carrier 100 orders</li>
                <li>• Alert affected stores of delays</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-red-200">
              <div className="font-medium mb-2">Short-term (Today)</div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Contact temp agency for 5 operators</li>
                <li>• Reschedule non-critical orders</li>
                <li>• Implement staggered loading</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-red-100">
              <div className="font-medium mb-2">Medium-term (This week)</div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Review staffing patterns</li>
                <li>• Adjust shift schedules</li>
                <li>• Plan for recurring absences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};

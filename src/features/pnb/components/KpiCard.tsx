import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  onClick?: () => void;
}

export const KpiCard = ({ title, value, subtitle, onClick }: KpiCardProps) => {
  const clickable = typeof onClick === "function";
  return (
    <Card
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      className={`transition-transform hover:scale-[1.01] ${clickable ? "cursor-pointer" : ""}`}
    >
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-primary">{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
};

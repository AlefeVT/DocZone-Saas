import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InfoCardProps {
  title: string;
  value: string;
  icon: JSX.Element;
  colorClass: string;
}

export function InfoCard({ title, value, icon, colorClass }: InfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <p
          className={`text-2xl font-extrabold text-muted-foreground ${colorClass}`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

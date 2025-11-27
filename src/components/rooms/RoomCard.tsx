import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Quarto } from "@/hooks/useQuartos";
import { ViewQuartoDialog } from "@/components/quartos/ViewQuartoDialog";
import { EditQuartoDialog } from "@/components/quartos/EditQuartoDialog";

interface RoomCardProps {
  number: string;
  type: string;
  capacity: number;
  price: number;
  status: "available" | "occupied" | "maintenance";
  quarto: Quarto;
}

const statusConfig = {
  available: { label: "Disponível", className: "bg-success/10 text-success border-success/20" },
  occupied: { label: "Ocupado", className: "bg-destructive/10 text-destructive border-destructive/20" },
  maintenance: { label: "Manutenção", className: "bg-accent/10 text-accent-foreground border-accent/20" },
};

export const RoomCard = ({ number, type, capacity, price, status, quarto }: RoomCardProps) => {
  const statusStyle = statusConfig[status];

  return (
    <Card className="shadow-card transition-all hover:shadow-elegant">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Quarto {number}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{type}</p>
          </div>
          <Badge variant="outline" className={cn("border", statusStyle.className)}>
            {statusStyle.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{capacity} pessoas</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BedDouble className="h-4 w-4" />
              <span>{capacity === 1 ? "Solteiro" : capacity === 2 ? "Casal" : "Família"}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Diária</p>
              <p className="text-2xl font-bold text-primary">
                R$ {price.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <ViewQuartoDialog quarto={quarto} />
              <EditQuartoDialog quarto={quarto} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

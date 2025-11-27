import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, User, BedDouble, Calendar, DollarSign, FileText } from "lucide-react";
import { Reserva } from "@/hooks/useReservas";

interface ViewReservaDialogProps {
  reserva: Reserva;
}

export const ViewReservaDialog = ({ reserva }: ViewReservaDialogProps) => {
  const statusConfig = {
    pendente: { label: "Pendente", className: "bg-accent/10 text-accent-foreground border-accent/20" },
    confirmada: { label: "Confirmado", className: "bg-success/10 text-success border-success/20" },
    checkin: { label: "Check-in Feito", className: "bg-primary/10 text-primary border-primary/20" },
    cancelada: { label: "Cancelado", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  const statusStyle = statusConfig[reserva.status as keyof typeof statusConfig];

  const calcularNoites = () => {
    const checkin = new Date(reserva.data_checkin);
    const checkout = new Date(reserva.data_checkout);
    const diff = checkout.getTime() - checkin.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Reserva</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="outline" className={statusStyle.className}>
              {statusStyle.label}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Hóspede</p>
                <p className="text-sm text-foreground">{reserva.hospedes?.nome || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">{reserva.hospedes?.email || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">{reserva.hospedes?.telefone || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BedDouble className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Quarto</p>
                <p className="text-sm text-foreground">Quarto {reserva.quartos?.numero || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">{reserva.quartos?.tipo || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Período</p>
                <p className="text-sm text-foreground">
                  {new Date(reserva.data_checkin).toLocaleDateString("pt-BR")} até{" "}
                  {new Date(reserva.data_checkout).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground">{calcularNoites()} noite(s)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Valor Total</p>
                <p className="text-lg font-bold text-primary">
                  R$ {Number(reserva.valor_total).toFixed(2)}
                </p>
              </div>
            </div>

            {reserva.observacoes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Observações</p>
                  <p className="text-sm text-muted-foreground">{reserva.observacoes}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            Reserva #{reserva.id.substring(0, 8)} • Criada em {new Date(reserva.created_at).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, BedDouble, Users, DollarSign } from "lucide-react";
import { Quarto } from "@/hooks/useQuartos";

interface ViewQuartoDialogProps {
  quarto: Quarto;
}

const statusConfig = {
  disponivel: { label: "Disponível", className: "bg-success/10 text-success border-success/20" },
  ocupado: { label: "Ocupado", className: "bg-destructive/10 text-destructive border-destructive/20" },
  manutencao: { label: "Manutenção", className: "bg-accent/10 text-accent-foreground border-accent/20" },
};

export const ViewQuartoDialog = ({ quarto }: ViewQuartoDialogProps) => {
  const statusStyle = statusConfig[quarto.status as keyof typeof statusConfig];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalhes do Quarto {quarto.numero}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className={statusStyle.className}>
                {statusStyle.label}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="text-lg font-semibold">{quarto.tipo}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-border p-4 bg-primary/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacidade</p>
                <p className="text-lg font-semibold">{quarto.capacidade} pessoas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border p-4 bg-primary/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diária</p>
                <p className="text-lg font-semibold">R$ {Number(quarto.preco_diaria).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {quarto.descricao && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Descrição</p>
              <p className="text-sm text-foreground rounded-lg border border-border p-4 bg-primary/30">
                {quarto.descricao}
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Cadastrado em: {new Date(quarto.created_at).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

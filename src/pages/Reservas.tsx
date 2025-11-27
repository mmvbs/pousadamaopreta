import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, BedDouble } from "lucide-react";
import { useReservas } from "@/hooks/useReservas";
import { useState } from "react";
import { AddReservaDialog } from "@/components/reservas/AddReservaDialog";
import { ViewReservaDialog } from "@/components/reservas/ViewReservaDialog";

const Reservas = () => {
  const { reservas, isLoading } = useReservas();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReservas = reservas.filter((reserva) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reserva.hospedes?.nome.toLowerCase().includes(searchLower) ||
      reserva.quartos?.numero.toLowerCase().includes(searchLower) ||
      reserva.data_checkin.includes(searchTerm) ||
      reserva.data_checkout.includes(searchTerm)
    );
  });

  const statusConfig = {
    pendente: { label: "Pendente", className: "bg-accent/10 text-accent-foreground border-accent/20" },
    confirmada: { label: "Confirmado", className: "bg-success/10 text-success border-success/20" },
    checkin: { label: "Check-in Feito", className: "bg-primary/10 text-primary border-primary/20" },
    cancelada: { label: "Cancelado", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reservas</h1>
            <p className="mt-2 text-muted-foreground">Gerencie todas as reservas do hotel</p>
          </div>
          <AddReservaDialog />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por hóspede, quarto ou data..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservas.map((reserva) => {
            const statusStyle = statusConfig[reserva.status as keyof typeof statusConfig];
            
            return (
              <Card key={reserva.id} className="shadow-card transition-all hover:shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              {reserva.hospedes?.nome || 'N/A'}
                            </h3>
                            <Badge variant="outline" className={statusStyle.className}>
                              {statusStyle.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Reserva #{reserva.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BedDouble className="h-4 w-4" />
                          <span>Quarto {reserva.quartos?.numero || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(reserva.data_checkin).toLocaleDateString("pt-BR")} até{" "}
                            {new Date(reserva.data_checkout).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-primary">
                          R$ {Number(reserva.valor_total).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <ViewReservaDialog reserva={reserva} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default Reservas;

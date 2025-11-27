import { PageLayout } from "@/components/layout/PageLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Users, Calendar, TrendingUp, Clock, DollarSign } from "lucide-react";
import { useQuartos } from "@/hooks/useQuartos";
import { useReservas } from "@/hooks/useReservas";
import { usePagamentos } from "@/hooks/usePagamentos";

const Index = () => {
  const { quartos } = useQuartos();
  const { reservas } = useReservas();
  const { pagamentos } = usePagamentos();

  const quartosOcupados = quartos.filter(q => q.status === "ocupado").length;
  const receitaMensal = pagamentos
    .filter(p => p.status === "pago")
    .reduce((sum, p) => sum + Number(p.valor), 0);

  const stats = [
    {
      title: "Total de Quartos",
      value: quartos.length,
      icon: BedDouble,
      trend: { value: `${quartos.length} cadastrados`, isPositive: true },
    },
    {
      title: "Quartos Ocupados",
      value: quartosOcupados,
      icon: Users,
      trend: { value: `${Math.round((quartosOcupados / quartos.length) * 100)}% ocupação`, isPositive: true },
    },
    {
      title: "Total Reservas",
      value: reservas.length,
      icon: Calendar,
      trend: { value: `${reservas.filter(r => r.status === "confirmada").length} confirmadas`, isPositive: true },
    },
    {
      title: "Receita Total",
      value: `R$ ${receitaMensal.toFixed(2)}`,
      icon: TrendingUp,
      trend: { value: `${pagamentos.length} pagamentos`, isPositive: true },
    },
  ];

  const reservasRecentes = reservas.slice(0, 3);

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Visão geral do seu hotel em tempo real
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Bookings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Reservas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservasRecentes.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {reserva.quartos?.numero || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{reserva.hospedes?.nome || 'N/A'}</p>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(reserva.data_checkin).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        reserva.status === "confirmada"
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent-foreground"
                      }`}
                    >
                      {reserva.status === "confirmada" ? "Confirmado" : "Pendente"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payments Summary */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Resumo de Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pagamentos.slice(0, 3).map((pagamento) => (
                  <div
                    key={pagamento.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent-foreground font-semibold">
                        {pagamento.reservas?.quartos?.numero || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{pagamento.reservas?.hospedes?.nome || 'N/A'}</p>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(pagamento.data_pagamento).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        pagamento.status === "pago"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {pagamento.status === "pago" ? "Pago" : "Pendente"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;

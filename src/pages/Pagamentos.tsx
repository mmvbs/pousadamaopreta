import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CreditCard, Calendar, CheckCircle, Clock, XCircle, Trash2 } from "lucide-react";
import { usePagamentos } from "@/hooks/usePagamentos";
import { useState } from "react";
import { toast } from "sonner";
import { AddPagamentoDialog } from "@/components/pagamentos/AddPagamentoDialog";
import { EditPagamentoDialog } from "@/components/pagamentos/EditPagamentoDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Pagamentos = () => {
  const { pagamentos, isLoading, updatePagamento, deletePagamento } = usePagamentos();
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmingPayment, setConfirmingPayment] = useState<string | null>(null);

  const filteredPagamentos = pagamentos.filter((pagamento) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pagamento.reservas?.hospedes?.nome.toLowerCase().includes(searchLower) ||
      pagamento.reservas?.quartos?.numero.toLowerCase().includes(searchLower) ||
      pagamento.metodo.toLowerCase().includes(searchLower)
    );
  });

  const handleConfirmPayment = async (paymentId: string) => {
    setConfirmingPayment(paymentId);
    try {
      await updatePagamento.mutateAsync({ id: paymentId, status: "pago" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setConfirmingPayment(null);
    }
  };

  const statusConfig = {
    pago: {
      label: "Pago",
      icon: CheckCircle,
      className: "bg-success/10 text-success border-success/20",
    },
    pendente: {
      label: "Pendente",
      icon: Clock,
      className: "bg-accent/10 text-accent-foreground border-accent/20",
    },
    cancelado: {
      label: "Cancelado",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const totalPaid = pagamentos
    .filter((p) => p.status === "pago")
    .reduce((sum, p) => sum + Number(p.valor), 0);

  const totalPending = pagamentos
    .filter((p) => p.status === "pendente")
    .reduce((sum, p) => sum + Number(p.valor), 0);

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
            <h1 className="text-3xl font-bold text-foreground">Pagamentos</h1>
            <p className="mt-2 text-muted-foreground">Controle financeiro do hotel</p>
          </div>
          <AddPagamentoDialog />
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Recebido</p>
                  <p className="mt-2 text-3xl font-bold text-success">
                    R$ {totalPaid.toFixed(2)}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-7 w-7 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendente</p>
                  <p className="mt-2 text-3xl font-bold text-accent-foreground">
                    R$ {totalPending.toFixed(2)}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <Clock className="h-7 w-7 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Geral</p>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    R$ {(totalPaid + totalPending).toFixed(2)}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-7 w-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por hóspede, quarto ou método..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPagamentos.map((pagamento) => {
            const statusStyle = statusConfig[pagamento.status as keyof typeof statusConfig];
            const StatusIcon = statusStyle.icon;

            return (
              <Card key={pagamento.id} className="shadow-card transition-all hover:shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              {pagamento.reservas?.hospedes?.nome || 'N/A'}
                            </h3>
                            <Badge variant="outline" className={statusStyle.className}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {statusStyle.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Pagamento #{pagamento.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>{pagamento.metodo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(pagamento.data_pagamento).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Quarto {pagamento.reservas?.quartos?.numero || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Valor</p>
                        <p className="text-2xl font-bold text-primary">
                          R$ {Number(pagamento.valor).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <EditPagamentoDialog pagamento={pagamento} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="outline">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o pagamento de <strong>R$ {Number(pagamento.valor).toFixed(2)}</strong> de {pagamento.reservas?.hospedes?.nome || 'N/A'}? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePagamento.mutate(pagamento.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {pagamento.status === "pendente" && (
                          <Button 
                            size="sm" 
                            className="bg-success hover:bg-success/90"
                            onClick={() => handleConfirmPayment(pagamento.id)}
                            disabled={confirmingPayment === pagamento.id}
                          >
                            {confirmingPayment === pagamento.id ? "Confirmando..." : "Confirmar"}
                          </Button>
                        )}
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

export default Pagamentos;

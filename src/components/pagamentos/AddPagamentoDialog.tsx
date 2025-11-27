import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { usePagamentos } from "@/hooks/usePagamentos";
import { useReservas } from "@/hooks/useReservas";

export const AddPagamentoDialog = () => {
  const { createPagamento } = usePagamentos();
  const { reservas } = useReservas();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    reserva_id: "",
    valor: "",
    metodo: "",
    data_pagamento: new Date().toISOString().split('T')[0],
    status: "pendente",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createPagamento.mutateAsync({
      reserva_id: formData.reserva_id,
      valor: parseFloat(formData.valor),
      metodo: formData.metodo,
      data_pagamento: formData.data_pagamento,
      status: formData.status,
    });
    
    setFormData({
      reserva_id: "",
      valor: "",
      metodo: "",
      data_pagamento: new Date().toISOString().split('T')[0],
      status: "pendente",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Pagamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Pagamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reserva_id">Reserva</Label>
            <Select value={formData.reserva_id} onValueChange={(value) => setFormData({ ...formData, reserva_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma reserva" />
              </SelectTrigger>
              <SelectContent>
                {reservas.map((reserva) => (
                  <SelectItem key={reserva.id} value={reserva.id}>
                    {reserva.hospedes?.nome} - Quarto {reserva.quartos?.numero} (R$ {Number(reserva.valor_total).toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo">Método de Pagamento</Label>
              <Select value={formData.metodo} onValueChange={(value) => setFormData({ ...formData, metodo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_pagamento">Data do Pagamento</Label>
              <Input
                id="data_pagamento"
                type="date"
                value={formData.data_pagamento}
                onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createPagamento.isPending}>
              {createPagamento.isPending ? "Criando..." : "Criar Pagamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

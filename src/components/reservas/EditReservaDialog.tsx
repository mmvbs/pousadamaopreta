import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { Reserva, useReservas } from "@/hooks/useReservas";
import { useHospedes } from "@/hooks/useHospedes";
import { useQuartos } from "@/hooks/useQuartos";

interface EditReservaDialogProps {
  reserva: Reserva;
}

export const EditReservaDialog = ({ reserva }: EditReservaDialogProps) => {
  const { updateReserva } = useReservas();
  const { hospedes } = useHospedes();
  const { quartos } = useQuartos();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    hospede_id: reserva.hospede_id,
    quarto_id: reserva.quarto_id,
    data_checkin: reserva.data_checkin,
    data_checkout: reserva.data_checkout,
    status: reserva.status,
    valor_total: reserva.valor_total.toString(),
    observacoes: reserva.observacoes || "",
  });

  const quartosDisponiveis = quartos.filter(
    (q) => q.status === "disponivel" || q.id === reserva.quarto_id
  );

  useEffect(() => {
    const selectedQuarto = quartos.find((q) => q.id === formData.quarto_id);
    if (selectedQuarto && formData.data_checkin && formData.data_checkout) {
      const checkin = new Date(formData.data_checkin);
      const checkout = new Date(formData.data_checkout);
      const nights = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        const total = selectedQuarto.preco_diaria * nights;
        setFormData((prev) => ({ ...prev, valor_total: total.toString() }));
      }
    }
  }, [formData.quarto_id, formData.data_checkin, formData.data_checkout, quartos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateReserva.mutateAsync({
      id: reserva.id,
      hospede_id: formData.hospede_id,
      quarto_id: formData.quarto_id,
      data_checkin: formData.data_checkin,
      data_checkout: formData.data_checkout,
      status: formData.status,
      valor_total: parseFloat(formData.valor_total),
      observacoes: formData.observacoes || null,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Reserva</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="hospede_id">Hóspede</Label>
            <Select value={formData.hospede_id} onValueChange={(value) => setFormData({ ...formData, hospede_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um hóspede" />
              </SelectTrigger>
              <SelectContent>
                {hospedes.map((hospede) => (
                  <SelectItem key={hospede.id} value={hospede.id}>
                    {hospede.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quarto_id">Quarto</Label>
            <Select value={formData.quarto_id} onValueChange={(value) => setFormData({ ...formData, quarto_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um quarto" />
              </SelectTrigger>
              <SelectContent>
                {quartosDisponiveis.map((quarto) => (
                  <SelectItem key={quarto.id} value={quarto.id}>
                    Quarto {quarto.numero} - {quarto.tipo} (R$ {Number(quarto.preco_diaria).toFixed(2)}/noite)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_checkin">Check-in</Label>
              <Input
                id="data_checkin"
                type="date"
                value={formData.data_checkin}
                onChange={(e) => setFormData({ ...formData, data_checkin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_checkout">Check-out</Label>
              <Input
                id="data_checkout"
                type="date"
                value={formData.data_checkout}
                onChange={(e) => setFormData({ ...formData, data_checkout: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="checkin">Check-in Feito</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_total">Valor Total (R$)</Label>
            <Input
              id="valor_total"
              type="number"
              step="0.01"
              value={formData.valor_total}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateReserva.isPending}>
              {updateReserva.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

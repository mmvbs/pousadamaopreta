import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useReservas } from "@/hooks/useReservas";
import { useHospedes } from "@/hooks/useHospedes";
import { useQuartos } from "@/hooks/useQuartos";

export const AddReservaDialog = () => {
  const { createReserva } = useReservas();
  const { hospedes } = useHospedes();
  const { quartos } = useQuartos();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    hospede_id: "",
    quarto_id: "",
    data_checkin: "",
    data_checkout: "",
    valor_total: 0,
    observacoes: "",
    status: "confirmada",
  });

  // Calcular valor total automaticamente
  useEffect(() => {
    if (formData.quarto_id && formData.data_checkin && formData.data_checkout) {
      const quarto = quartos.find(q => q.id === formData.quarto_id);
      if (quarto) {
        const checkin = new Date(formData.data_checkin);
        const checkout = new Date(formData.data_checkout);
        const diff = checkout.getTime() - checkin.getTime();
        const noites = Math.ceil(diff / (1000 * 3600 * 24));
        
        if (noites > 0) {
          const valorTotal = noites * Number(quarto.preco_diaria);
          setFormData(prev => ({ ...prev, valor_total: valorTotal }));
        }
      }
    }
  }, [formData.quarto_id, formData.data_checkin, formData.data_checkout, quartos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createReserva.mutateAsync({
      hospede_id: formData.hospede_id,
      quarto_id: formData.quarto_id,
      data_checkin: formData.data_checkin,
      data_checkout: formData.data_checkout,
      valor_total: formData.valor_total,
      observacoes: formData.observacoes || null,
      status: formData.status,
    });
    
    setFormData({
      hospede_id: "",
      quarto_id: "",
      data_checkin: "",
      data_checkout: "",
      valor_total: 0,
      observacoes: "",
      status: "confirmada",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nova Reserva
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
                  {quartos.filter(q => q.status === "disponivel").map((quarto) => (
                    <SelectItem key={quarto.id} value={quarto.id}>
                      Quarto {quarto.numero} - {quarto.tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_checkin">Data de Check-in</Label>
              <Input
                id="data_checkin"
                type="date"
                value={formData.data_checkin}
                onChange={(e) => setFormData({ ...formData, data_checkin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_checkout">Data de Check-out</Label>
              <Input
                id="data_checkout"
                type="date"
                value={formData.data_checkout}
                onChange={(e) => setFormData({ ...formData, data_checkout: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total (R$)</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                value={formData.valor_total}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Calculado automaticamente com base nas diárias</p>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações sobre a reserva..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createReserva.isPending}>
              {createReserva.isPending ? "Criando..." : "Criar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

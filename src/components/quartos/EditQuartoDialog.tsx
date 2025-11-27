import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Quarto, useQuartos } from "@/hooks/useQuartos";

interface EditQuartoDialogProps {
  quarto: Quarto;
}

export const EditQuartoDialog = ({ quarto }: EditQuartoDialogProps) => {
  const { updateQuarto } = useQuartos();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero: quarto.numero,
    tipo: quarto.tipo,
    preco_diaria: quarto.preco_diaria.toString(),
    capacidade: quarto.capacidade.toString(),
    status: quarto.status,
    descricao: quarto.descricao || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateQuarto.mutateAsync({
      id: quarto.id,
      numero: formData.numero,
      tipo: formData.tipo,
      preco_diaria: parseFloat(formData.preco_diaria),
      capacidade: parseInt(formData.capacidade),
      status: formData.status,
      descricao: formData.descricao || null,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Quarto {quarto.numero}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número do Quarto</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Input
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_diaria">Preço da Diária (R$)</Label>
              <Input
                id="preco_diaria"
                type="number"
                step="0.01"
                value={formData.preco_diaria}
                onChange={(e) => setFormData({ ...formData, preco_diaria: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                id="capacidade"
                type="number"
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
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
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="ocupado">Ocupado</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição opcional do quarto..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateQuarto.isPending}>
              {updateQuarto.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

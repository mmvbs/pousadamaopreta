import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useQuartos } from "@/hooks/useQuartos";
import { z } from "zod";

const quartoSchema = z.object({
  numero: z.string().trim().min(1, "Número é obrigatório").max(10),
  tipo: z.string().trim().min(1, "Tipo é obrigatório").max(50),
  preco_diaria: z.number().positive("Preço deve ser maior que zero"),
  capacidade: z.number().int().positive("Capacidade deve ser maior que zero"),
  status: z.enum(["disponivel", "ocupado", "manutencao"]),
  descricao: z.string().max(500).optional(),
});

export const AddQuartoDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    tipo: "",
    preco_diaria: "",
    capacidade: "",
    status: "disponivel",
    descricao: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createQuarto } = useQuartos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = quartoSchema.parse({
        ...formData,
        preco_diaria: parseFloat(formData.preco_diaria),
        capacidade: parseInt(formData.capacidade),
      });
      
      await createQuarto.mutateAsync({
        numero: validated.numero,
        tipo: validated.tipo,
        preco_diaria: validated.preco_diaria,
        capacidade: validated.capacidade,
        status: validated.status,
        descricao: validated.descricao || null,
      });
      setOpen(false);
      setFormData({
        numero: "",
        tipo: "",
        preco_diaria: "",
        capacidade: "",
        status: "disponivel",
        descricao: "",
      });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Quarto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Quarto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                placeholder="101"
              />
              {errors.numero && <p className="text-sm text-destructive">{errors.numero}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Input
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                placeholder="Standard, Deluxe, Suite"
              />
              {errors.tipo && <p className="text-sm text-destructive">{errors.tipo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_diaria">Preço Diária (R$) *</Label>
              <Input
                id="preco_diaria"
                type="number"
                step="0.01"
                value={formData.preco_diaria}
                onChange={(e) => setFormData({ ...formData, preco_diaria: e.target.value })}
                placeholder="250.00"
              />
              {errors.preco_diaria && <p className="text-sm text-destructive">{errors.preco_diaria}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade *</Label>
              <Input
                id="capacidade"
                type="number"
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                placeholder="2"
              />
              {errors.capacidade && <p className="text-sm text-destructive">{errors.capacidade}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="ocupado">Ocupado</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição do quarto..."
              rows={3}
            />
            {errors.descricao && <p className="text-sm text-destructive">{errors.descricao}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createQuarto.isPending}>
              {createQuarto.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

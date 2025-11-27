import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useHospedes } from "@/hooks/useHospedes";
import { z } from "zod";

const hospedeSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(255),
  email: z.string().trim().email("Email inválido").max(255),
  telefone: z.string().trim().min(1, "Telefone é obrigatório").max(20),
  documento: z.string().trim().min(1, "Documento é obrigatório").max(20),
});

export const AddHospedeDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    documento: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createHospede } = useHospedes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = hospedeSchema.parse(formData);
      await createHospede.mutateAsync({
        nome: validated.nome,
        email: validated.email,
        telefone: validated.telefone,
        documento: validated.documento,
      });
      setOpen(false);
      setFormData({ nome: "", email: "", telefone: "", documento: "" });
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
          Novo Hóspede
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Hóspede</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="João da Silva"
            />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="joao@email.com"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="(11) 98765-4321"
            />
            {errors.telefone && <p className="text-sm text-destructive">{errors.telefone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento">Documento (CPF/RG) *</Label>
            <Input
              id="documento"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
              placeholder="000.000.000-00"
            />
            {errors.documento && <p className="text-sm text-destructive">{errors.documento}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createHospede.isPending}>
              {createHospede.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

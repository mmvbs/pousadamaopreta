import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Hospede, useHospedes } from "@/hooks/useHospedes";

interface EditHospedeDialogProps {
  hospede: Hospede;
}

export const EditHospedeDialog = ({ hospede }: EditHospedeDialogProps) => {
  const { updateHospede } = useHospedes();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: hospede.nome,
    email: hospede.email,
    telefone: hospede.telefone,
    documento: hospede.documento,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateHospede.mutateAsync({
      id: hospede.id,
      ...formData,
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
          <DialogTitle>Editar Hóspede</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento">Documento (CPF/RG)</Label>
            <Input
              id="documento"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateHospede.isPending}>
              {updateHospede.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

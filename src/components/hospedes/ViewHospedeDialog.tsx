import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, FileText, Calendar } from "lucide-react";
import { Hospede } from "@/hooks/useHospedes";

interface ViewHospedeDialogProps {
  hospede: Hospede;
}

export const ViewHospedeDialog = ({ hospede }: ViewHospedeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ver Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
              {hospede.nome.charAt(0)}
            </div>
            <div>
              <DialogTitle className="text-2xl">{hospede.nome}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Perfil do Hóspede</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium break-all">{hospede.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="text-sm font-medium">{hospede.telefone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Documento</p>
                <p className="text-sm font-medium">{hospede.documento}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Cadastrado em</p>
                <p className="text-sm font-medium">
                  {new Date(hospede.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

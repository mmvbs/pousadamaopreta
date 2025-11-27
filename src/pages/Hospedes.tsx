import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, Trash2 } from "lucide-react";
import { useHospedes } from "@/hooks/useHospedes";
import { AddHospedeDialog } from "@/components/hospedes/AddHospedeDialog";
import { ViewHospedeDialog } from "@/components/hospedes/ViewHospedeDialog";
import { EditHospedeDialog } from "@/components/hospedes/EditHospedeDialog";
import { useState } from "react";
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

const Hospedes = () => {
  const { hospedes, isLoading, deleteHospede } = useHospedes();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHospedes = hospedes.filter((hospede) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      hospede.nome.toLowerCase().includes(searchLower) ||
      hospede.email.toLowerCase().includes(searchLower) ||
      hospede.telefone.includes(searchTerm)
    );
  });

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
            <h1 className="text-3xl font-bold text-foreground">Hóspedes</h1>
            <p className="mt-2 text-muted-foreground">Gerencie o cadastro de hóspedes</p>
          </div>
          <AddHospedeDialog />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Guests Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredHospedes.map((hospede) => (
            <Card key={hospede.id} className="shadow-card transition-all hover:shadow-elegant">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {hospede.nome.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{hospede.nome}</h3>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{hospede.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{hospede.telefone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="text-sm text-muted-foreground">
                    Documento: {hospede.documento}
                  </div>
                  <div className="flex gap-2">
                    <ViewHospedeDialog hospede={hospede} />
                    <EditHospedeDialog hospede={hospede} />
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
                            Tem certeza que deseja excluir o hóspede <strong>{hospede.nome}</strong>? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteHospede.mutate(hospede.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Hospedes;

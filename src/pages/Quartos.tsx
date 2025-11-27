import { PageLayout } from "@/components/layout/PageLayout";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQuartos } from "@/hooks/useQuartos";
import { AddQuartoDialog } from "@/components/quartos/AddQuartoDialog";
import { useState } from "react";

const Quartos = () => {
  const { quartos, isLoading } = useQuartos();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const filteredQuartos = quartos.filter((quarto) => {
    const matchesSearch = 
      quarto.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quarto.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "todos" || quarto.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
            <h1 className="text-3xl font-bold text-foreground">Quartos</h1>
            <p className="mt-2 text-muted-foreground">Gerencie todos os quartos do hotel</p>
          </div>
          <AddQuartoDialog />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por número ou tipo..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === "todos" ? "default" : "outline"}
              onClick={() => setStatusFilter("todos")}
            >
              Todos
            </Button>
            <Button 
              variant={statusFilter === "disponivel" ? "default" : "outline"}
              onClick={() => setStatusFilter("disponivel")}
            >
              Disponível
            </Button>
            <Button 
              variant={statusFilter === "ocupado" ? "default" : "outline"}
              onClick={() => setStatusFilter("ocupado")}
            >
              Ocupado
            </Button>
            <Button 
              variant={statusFilter === "manutencao" ? "default" : "outline"}
              onClick={() => setStatusFilter("manutencao")}
            >
              Manutenção
            </Button>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuartos.map((quarto) => {
            const statusMap: Record<string, "available" | "occupied" | "maintenance"> = {
              disponivel: "available",
              ocupado: "occupied",
              manutencao: "maintenance"
            };
            
            return (
              <RoomCard 
                key={quarto.id} 
                number={quarto.numero}
                type={quarto.tipo}
                capacity={quarto.capacidade}
                price={Number(quarto.preco_diaria)}
                status={statusMap[quarto.status] || "available"}
                quarto={quarto}
              />
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default Quartos;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Quarto = {
  id: string;
  numero: string;
  tipo: string;
  preco_diaria: number;
  capacidade: number;
  status: string;
  descricao: string | null;
  created_at: string;
};

export const useQuartos = () => {
  const queryClient = useQueryClient();

  const { data: quartos = [], isLoading } = useQuery({
    queryKey: ["quartos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quartos")
        .select("*")
        .order("numero");

      if (error) throw error;
      return data as Quarto[];
    },
  });

  const createQuarto = useMutation({
    mutationFn: async (quarto: Omit<Quarto, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("quartos")
        .insert(quarto)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quartos"] });
      toast.success("Quarto criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateQuarto = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Quarto> & { id: string }) => {
      const { data, error } = await supabase
        .from("quartos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quartos"] });
      toast.success("Quarto atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return { quartos, isLoading, createQuarto, updateQuarto };
};

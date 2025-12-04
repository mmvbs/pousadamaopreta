import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Pagamento = {
  id: string;
  reserva_id: string;
  valor: number;
  metodo: string;
  status: string;
  data_pagamento: string;
  created_at: string;
  reservas?: {
    hospedes?: {
      nome: string;
    };
    quartos?: {
      numero: string;
    };
  };
};

export const usePagamentos = () => {
  const queryClient = useQueryClient();

  const { data: pagamentos = [], isLoading } = useQuery({
    queryKey: ["pagamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pagamentos")
        .select(`
          *,
          reservas (
            hospedes (nome),
            quartos (numero)
          )
        `)
        .order("data_pagamento", { ascending: false });

      if (error) throw error;
      return data as Pagamento[];
    },
  });

  const createPagamento = useMutation({
    mutationFn: async (pagamento: Omit<Pagamento, "id" | "created_at" | "reservas">) => {
      const { data, error } = await supabase
        .from("pagamentos")
        .insert(pagamento)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      toast.success("Pagamento registrado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updatePagamento = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pagamento> & { id: string }) => {
      const { data, error } = await supabase
        .from("pagamentos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      toast.success("Pagamento atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deletePagamento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pagamentos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      toast.success("Pagamento excluído com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return { pagamentos, isLoading, createPagamento, updatePagamento, deletePagamento };
};

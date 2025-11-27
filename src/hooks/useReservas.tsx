import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Reserva = {
  id: string;
  hospede_id: string;
  quarto_id: string;
  data_checkin: string;
  data_checkout: string;
  status: string;
  valor_total: number;
  observacoes: string | null;
  created_at: string;
  hospedes?: {
    nome: string;
    email: string;
    telefone: string;
  };
  quartos?: {
    numero: string;
    tipo: string;
  };
};

export const useReservas = () => {
  const queryClient = useQueryClient();

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ["reservas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservas")
        .select(`
          *,
          hospedes (nome, email, telefone),
          quartos (numero, tipo)
        `)
        .order("data_checkin", { ascending: false });

      if (error) throw error;
      return data as Reserva[];
    },
  });

  const createReserva = useMutation({
    mutationFn: async (reserva: Omit<Reserva, "id" | "created_at" | "hospedes" | "quartos">) => {
      const { data, error } = await supabase
        .from("reservas")
        .insert(reserva)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success("Reserva criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateReserva = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reserva> & { id: string }) => {
      const { data, error } = await supabase
        .from("reservas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success("Reserva atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return { reservas, isLoading, createReserva, updateReserva };
};

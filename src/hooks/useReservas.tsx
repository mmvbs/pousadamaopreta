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

  const deleteReserva = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reservas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success("Reserva excluída com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const checkQuartoDisponibilidade = async (
    quartoId: string,
    dataCheckin: string,
    dataCheckout: string,
    reservaIdExcluir?: string
  ) => {
    let query = supabase
      .from("reservas")
      .select("id, data_checkin, data_checkout")
      .eq("quarto_id", quartoId)
      .in("status", ["confirmada", "checkin"]);

    // Só aplica o filtro de exclusão se houver um ID válido
    if (reservaIdExcluir) {
      query = query.neq("id", reservaIdExcluir);
    }

    const { data, error } = await query;

    if (error) throw error;

    const checkin = new Date(dataCheckin);
    const checkout = new Date(dataCheckout);

    // Verificar se há sobreposição de datas
    const temConflito = data.some((reserva) => {
      const reservaCheckin = new Date(reserva.data_checkin);
      const reservaCheckout = new Date(reserva.data_checkout);

      return (
        (checkin >= reservaCheckin && checkin < reservaCheckout) ||
        (checkout > reservaCheckin && checkout <= reservaCheckout) ||
        (checkin <= reservaCheckin && checkout >= reservaCheckout)
      );
    });

    return !temConflito;
  };

  return { 
    reservas, 
    isLoading, 
    createReserva, 
    updateReserva, 
    deleteReserva,
    checkQuartoDisponibilidade 
  };
};
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
  const atualizarStatusDoQuarto = async (quartoId: string, status: string) => {
    let novoStatus = "disponivel";

    if (["confirmada", "checkin"].includes(status)) {
      novoStatus = "ocupado";
    }

    const { error } = await supabase
      .from("quartos")
      .update({ status: novoStatus })
      .eq("id", quartoId);

    if (error) throw error;
  };
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

      // Atualiza status do quarto automaticamente
      await atualizarStatusDoQuarto(reserva.quarto_id, reserva.status);

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

      // Buscar a reserva atual para comparar quarto e status
      const { data: reservaAtual } = await supabase
        .from("reservas")
        .select("quarto_id, status")
        .eq("id", id)
        .single();

      const { data, error } = await supabase
        .from("reservas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const quartoAntigo = reservaAtual?.quarto_id;
      const quartoNovo = updates.quarto_id ?? quartoAntigo;

      // Se trocou de quarto, liberar o antigo
      if (updates.quarto_id && updates.quarto_id !== quartoAntigo) {
        await atualizarStatusDoQuarto(quartoAntigo, "cancelada");
        await atualizarStatusDoQuarto(quartoNovo, updates.status ?? reservaAtual.status);
      } else {
        // Só atualizar o status do quarto atual
        await atualizarStatusDoQuarto(quartoNovo, updates.status ?? reservaAtual.status);
      }
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

      // Buscar reserva antes de deletar
      const { data: reserva } = await supabase
        .from("reservas")
        .select("quarto_id")
        .eq("id", id)
        .single();
      const { error } = await supabase
        .from("reservas")
        .delete()
        .eq("id", id);

      if (error) throw error;
      // Libera o quarto
      if (reserva?.quarto_id) {
        await atualizarStatusDoQuarto(reserva.quarto_id, "cancelada");
      }
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

    if (reservaIdExcluir) query = query.neq("id", reservaIdExcluir);

    const { data, error } = await query;

    if (error) throw error;

    const checkin = new Date(dataCheckin);
    const checkout = new Date(dataCheckout);

    const temConflito = data.some((r) => {
      const cIn = new Date(r.data_checkin);
      const cOut = new Date(r.data_checkout);

      return (
        (checkin >= cIn && checkin < cOut) ||
        (checkout > cIn && checkout <= cOut) ||
        (checkin <= cIn && checkout >= cOut)
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
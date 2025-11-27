import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Hospede = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  created_at: string;
};

export const useHospedes = () => {
  const queryClient = useQueryClient();

  const { data: hospedes = [], isLoading } = useQuery({
    queryKey: ["hospedes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospedes")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data as Hospede[];
    },
  });

  const createHospede = useMutation({
    mutationFn: async (hospede: Omit<Hospede, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("hospedes")
        .insert(hospede)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospedes"] });
      toast.success("Hóspede cadastrado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return { hospedes, isLoading, createHospede };
};

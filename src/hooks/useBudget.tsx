import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Budget {
  id: string;
  user_id: string;
  month: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export function useBudget() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  const budgetQuery = useQuery({
    queryKey: ["budget", user?.id, currentMonth],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", currentMonth)
        .maybeSingle();

      if (error) throw error;
      return data as Budget | null;
    },
    enabled: !!user,
  });

  const upsertBudget = useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("budgets")
        .upsert({
          user_id: user.id,
          month: currentMonth,
          amount,
        }, {
          onConflict: "user_id,month",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Budget updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update budget: ${error.message}`);
    },
  });

  return {
    budget: budgetQuery.data,
    isLoading: budgetQuery.isLoading,
    error: budgetQuery.error,
    upsertBudget,
  };
}

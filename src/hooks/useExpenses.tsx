import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { ExpenseCategory } from "@/lib/categories";

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateExpenseData {
  amount: number;
  category: ExpenseCategory;
  date: string;
  note?: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {
  id: string;
}

export function useExpenses(filters: ExpenseFilters = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { startDate, endDate, category, search, page = 1, limit = 20 } = filters;

  const expensesQuery = useQuery({
    queryKey: ["expenses", user?.id, filters],
    queryFn: async () => {
      if (!user) return { expenses: [], total: 0 };

      let query = supabase
        .from("expenses")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (startDate) {
        query = query.gte("date", startDate);
      }
      if (endDate) {
        query = query.lte("date", endDate);
      }
      if (category) {
        query = query.eq("category", category);
      }
      if (search) {
        query = query.ilike("note", `%${search}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return { 
        expenses: data as Expense[], 
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
    enabled: !!user,
  });

  const createExpense = useMutation({
    mutationFn: async (data: CreateExpenseData) => {
      if (!user) throw new Error("Not authenticated");

      const { data: expense, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          amount: data.amount,
          category: data.category,
          date: data.date,
          note: data.note || null,
        })
        .select()
        .single();

      if (error) throw error;
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      toast.success("Expense added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add expense: ${error.message}`);
    },
  });

  const updateExpense = useMutation({
    mutationFn: async (data: UpdateExpenseData) => {
      if (!user) throw new Error("Not authenticated");

      const { id, ...updateData } = data;
      const { data: expense, error } = await supabase
        .from("expenses")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      toast.success("Expense updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update expense: ${error.message}`);
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense-stats"] });
      toast.success("Expense deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete expense: ${error.message}`);
    },
  });

  return {
    expenses: expensesQuery.data?.expenses || [],
    total: expensesQuery.data?.total || 0,
    totalPages: expensesQuery.data?.totalPages || 0,
    isLoading: expensesQuery.isLoading,
    error: expensesQuery.error,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}

export function useExpenseStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["expense-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

      // Get all expenses for stats
      const { data: allExpenses, error: allError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id);

      if (allError) throw allError;

      // Get this month's expenses
      const { data: monthExpenses, error: monthError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

      if (monthError) throw monthError;

      const totalExpenses = (allExpenses || []).reduce((sum, exp) => sum + Number(exp.amount), 0);
      const monthlyExpenses = (monthExpenses || []).reduce((sum, exp) => sum + Number(exp.amount), 0);

      // Calculate category breakdown
      const categoryTotals: Record<string, number> = {};
      (monthExpenses || []).forEach((exp) => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount);
      });

      const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

      // Calculate monthly trends (last 6 months)
      const monthlyTrends: { month: string; amount: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString().split("T")[0];
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).toISOString().split("T")[0];

        const monthTotal = (allExpenses || [])
          .filter((exp) => exp.date >= monthStart && exp.date <= monthEnd)
          .reduce((sum, exp) => sum + Number(exp.amount), 0);

        monthlyTrends.push({
          month: monthDate.toLocaleDateString("en-US", { month: "short" }),
          amount: monthTotal,
        });
      }

      return {
        totalExpenses,
        monthlyExpenses,
        topCategory: topCategory ? { category: topCategory[0], amount: topCategory[1] } : null,
        categoryBreakdown: categoryTotals,
        monthlyTrends,
        expenseCount: allExpenses?.length || 0,
      };
    },
    enabled: !!user,
  });
}

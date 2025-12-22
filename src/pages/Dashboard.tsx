import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useExpenses, useExpenseStats, ExpenseFilters, CreateExpenseData } from "@/hooks/useExpenses";
import { useBudget } from "@/hooks/useBudget";
import { CATEGORIES, CATEGORY_CHART_COLORS, ExpenseCategory } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Plus, Sun, Moon, LogOut, Wallet, TrendingUp, PieChart, Search, Trash2, Edit2, Download } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ExpenseFilters>({ page: 1, limit: 10 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  
  const { expenses, total, totalPages, isLoading, createExpense, updateExpense, deleteExpense } = useExpenses(filters);
  const { data: stats } = useExpenseStats();
  const { budget, upsertBudget } = useBudget();

  const [form, setForm] = useState<CreateExpenseData>({
    amount: 0,
    category: "other",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (budget) setBudgetInput(String(budget.amount));
  }, [budget]);

  if (authLoading || !user) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      await updateExpense.mutateAsync({ id: editingExpense, ...form });
      setEditingExpense(null);
    } else {
      await createExpense.mutateAsync(form);
    }
    setForm({ amount: 0, category: "other", date: new Date().toISOString().split("T")[0], note: "" });
    setDialogOpen(false);
  };

  const categoryData = stats ? Object.entries(stats.categoryBreakdown).map(([key, value]) => ({
    name: CATEGORIES[key as ExpenseCategory].label,
    value,
    color: CATEGORY_CHART_COLORS[key as ExpenseCategory],
  })) : [];

  const budgetProgress = budget && stats ? Math.min((stats.monthlyExpenses / budget.amount) * 100, 100) : 0;

  const exportCSV = () => {
    const csv = ["Date,Category,Amount,Note", ...expenses.map(e => 
      `${e.date},${CATEGORIES[e.category].label},${e.amount},"${e.note || ""}"`
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">ExpenseTracker</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold font-display">${stats?.totalExpenses.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold font-display">${stats?.monthlyExpenses.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <PieChart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Top Category</p>
                    <p className="text-2xl font-bold font-display">
                      {stats?.topCategory ? CATEGORIES[stats.topCategory.category as ExpenseCategory].label : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Budget Progress */}
        <Card className="shadow-card mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Monthly Budget</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Set budget"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-32"
              />
              <Button size="sm" onClick={() => upsertBudget.mutate(Number(budgetInput))}>Save</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent: ${stats?.monthlyExpenses.toFixed(2) || 0}</span>
                <span className="text-muted-foreground">Budget: ${budget?.amount || 0}</span>
              </div>
              <Progress value={budgetProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {budget ? `${budgetProgress.toFixed(0)}% of budget used` : "Set a budget to track progress"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display">Category Breakdown</CardTitle></CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : <p className="text-center text-muted-foreground py-12">No data yet</p>}
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display">Monthly Trend</CardTitle></CardHeader>
            <CardContent>
              {stats?.monthlyTrends && stats.monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.monthlyTrends}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-muted-foreground py-12">No data yet</p>}
            </CardContent>
          </Card>
        </div>

        {/* Expenses List */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="font-display">Expenses</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  className="pl-9 w-40"
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                />
              </div>
              <Select onValueChange={(v) => setFilters(f => ({ ...f, category: v === "all" ? undefined : v as ExpenseCategory }))}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <SelectItem key={key} value={key}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4 mr-1" /> Export</Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingExpense ? "Edit" : "Add"} Expense</DialogTitle></DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input type="number" step="0.01" placeholder="Amount" value={form.amount || ""} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} required />
                    <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as ExpenseCategory }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                    <Input placeholder="Note (optional)" value={form.note || ""} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                    <Button type="submit" className="w-full">{editingExpense ? "Update" : "Add"} Expense</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : expenses.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No expenses yet. Add your first one!</p>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => {
                  const cat = CATEGORIES[expense.category];
                  const Icon = cat.icon;
                  return (
                    <div key={expense.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${cat.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{cat.label}</p>
                          <p className="text-sm text-muted-foreground">{expense.note || expense.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-display">${Number(expense.amount).toFixed(2)}</span>
                        <Button variant="ghost" size="icon" onClick={() => { setEditingExpense(expense.id); setForm({ amount: expense.amount, category: expense.category, date: expense.date, note: expense.note || "" }); setDialogOpen(true); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteExpense.mutate(expense.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button key={i} variant={filters.page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}>
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

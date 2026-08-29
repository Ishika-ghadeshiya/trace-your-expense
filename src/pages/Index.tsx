import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, Wallet, Moon, Sun, PieChart, TrendingUp } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    { icon: Wallet, title: "Track Expenses", description: "Log daily expenses with categories and notes" },
    { icon: PieChart, title: "Visual Insights", description: "Beautiful charts showing spending patterns" },
    { icon: TrendingUp, title: "Budget Goals", description: "Set monthly budgets and track progress" },
    { icon: Shield, title: "Secure Data", description: "Your financial data is encrypted and private" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">ExpenseTracker</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Link to="/auth">
              <Button variant="hero-outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Smart Financial Tracking
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Take Control of Your
              <span className="gradient-text block">Financial Future</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Track expenses, set budgets, and gain insights into your spending habits with our beautiful and intuitive expense tracker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Tracking Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Spent", value: "₹4,280", color: "text-foreground" },
                  { label: "This Month", value: "₹1,240", color: "text-primary" },
                  { label: "Budget Left", value: "₹760", color: "text-success" },
                ].map((stat, i) => (
                  <div key={i} className="bg-muted/50 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold font-display ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-32 bg-muted/30 rounded-xl flex items-end justify-around px-4 pb-4">
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                  <div key={i} className="w-8 bg-primary/80 rounded-t-md transition-all" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          © 2024 Smart Expense Tracker. Built with Lovable.
        </div>
      </footer>
    </div>
  );
};

export default Index;

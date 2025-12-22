import { 
  Utensils, 
  Car, 
  Gamepad2, 
  ShoppingBag, 
  Lightbulb, 
  Heart, 
  GraduationCap, 
  Plane, 
  MoreHorizontal,
  LucideIcon
} from "lucide-react";

export type ExpenseCategory = 
  | "food" 
  | "transport" 
  | "entertainment" 
  | "shopping" 
  | "utilities" 
  | "healthcare" 
  | "education" 
  | "travel" 
  | "other";

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const CATEGORIES: Record<ExpenseCategory, CategoryConfig> = {
  food: {
    label: "Food & Dining",
    icon: Utensils,
    color: "text-expense-food",
    bgColor: "bg-expense-food/10",
  },
  transport: {
    label: "Transport",
    icon: Car,
    color: "text-expense-transport",
    bgColor: "bg-expense-transport/10",
  },
  entertainment: {
    label: "Entertainment",
    icon: Gamepad2,
    color: "text-expense-entertainment",
    bgColor: "bg-expense-entertainment/10",
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    color: "text-expense-shopping",
    bgColor: "bg-expense-shopping/10",
  },
  utilities: {
    label: "Utilities",
    icon: Lightbulb,
    color: "text-expense-utilities",
    bgColor: "bg-expense-utilities/10",
  },
  healthcare: {
    label: "Healthcare",
    icon: Heart,
    color: "text-expense-healthcare",
    bgColor: "bg-expense-healthcare/10",
  },
  education: {
    label: "Education",
    icon: GraduationCap,
    color: "text-expense-education",
    bgColor: "bg-expense-education/10",
  },
  travel: {
    label: "Travel",
    icon: Plane,
    color: "text-expense-travel",
    bgColor: "bg-expense-travel/10",
  },
  other: {
    label: "Other",
    icon: MoreHorizontal,
    color: "text-expense-other",
    bgColor: "bg-expense-other/10",
  },
};

export const CATEGORY_CHART_COLORS: Record<ExpenseCategory, string> = {
  food: "hsl(24, 95%, 53%)",
  transport: "hsl(200, 98%, 39%)",
  entertainment: "hsl(280, 87%, 65%)",
  shopping: "hsl(330, 81%, 60%)",
  utilities: "hsl(45, 93%, 47%)",
  healthcare: "hsl(0, 72%, 51%)",
  education: "hsl(262, 83%, 58%)",
  travel: "hsl(171, 77%, 64%)",
  other: "hsl(220, 9%, 46%)",
};

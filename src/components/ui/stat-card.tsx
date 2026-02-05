 import { motion } from "framer-motion";
 import { LucideIcon } from "lucide-react";
 import { clsx } from "clsx"; // Import clsx
 
 interface StatCardProps {
   title: string;
   value: string | number;
   icon: LucideIcon;
   description?: string;
   trend?: {
     value: number;
     isPositive: boolean;
   };
   testId?: string;
   className?: string; // Add className prop
 }
 
 const StatCard = ({ title, value, icon: Icon, description, trend, testId, className }: StatCardProps) => { // Destructure className
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
       data-testid={testId}
       className={clsx("stat-card bg-card border border-border rounded-xl p-6 group", className)} // Apply className
     >
       <div className="flex items-start justify-between">
         <div className="space-y-2">
           <p className="text-sm font-medium text-muted-foreground">{title}</p>
           <p className="text-3xl font-semibold tracking-tight text-foreground">
             {value}
           </p>
           {description && (
             <p className="text-xs text-muted-foreground">{description}</p>
           )}
           {trend && (
             <div className="flex items-center gap-1">
               <span
                 className={`text-xs font-medium ${
                   trend.isPositive ? "text-success" : "text-destructive"
                 }`}
               >
                 {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
               </span>
               <span className="text-xs text-muted-foreground">from last month</span>
             </div>
           )}
         </div>
         <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-foreground/5 transition-colors">
           <Icon className="w-5 h-5 text-muted-foreground" />
         </div>
       </div>
     </motion.div>
   );
 };
 
 export default StatCard;
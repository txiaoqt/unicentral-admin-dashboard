 import { motion } from "framer-motion";
 
 interface PageHeaderProps {
   title: string;
   description?: string;
   testId?: string;
   action?: React.ReactNode;
 }
 
 const PageHeader = ({ title, description, testId, action }: PageHeaderProps) => {
   return (
     <motion.div
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
       className="flex items-start justify-between mb-8"
     >
       <div>
         <h1
           data-testid={testId}
           className="text-2xl font-semibold tracking-tight text-foreground"
         >
           {title}
         </h1>
         {description && (
           <p className="text-sm text-muted-foreground mt-1">{description}</p>
         )}
       </div>
       {action && <div>{action}</div>}
     </motion.div>
   );
 };
 
 export default PageHeader;
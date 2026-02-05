 import { motion } from "framer-motion";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 
 interface Column<T> {
   key: keyof T | string;
   header: string;
   render?: (item: T) => React.ReactNode;
   className?: string;
 }
 
 interface DataTableProps<T> {
   data: T[];
   columns: Column<T>[];
   emptyMessage?: string;
   rowKey: keyof T;
   onRowClick?: (item: T) => void;
 }
 
function DataTable<T extends Record<string, unknown>>({
   data,
   columns,
   emptyMessage = "No data found.",
   rowKey,
   onRowClick,
 }: DataTableProps<T>) {
   if (data.length === 0) {
     return (
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="bg-card border border-border rounded-xl p-12 text-center"
       >
         <p className="text-muted-foreground">{emptyMessage}</p>
       </motion.div>
     );
   }
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
       className="bg-card border border-border rounded-xl overflow-hidden"
     >
       <Table>
         <TableHeader>
           <TableRow className="border-border hover:bg-transparent">
             {columns.map((column) => (
               <TableHead
                 key={String(column.key)}
                 className={`text-xs font-medium text-muted-foreground uppercase tracking-wider ${column.className || ""}`}
               >
                 {column.header}
               </TableHead>
             ))}
           </TableRow>
         </TableHeader>
         <TableBody>
           {data.map((item, index) => (
             <TableRow
               key={String(item[rowKey])}
               onClick={() => onRowClick?.(item)}
               className={`
                 border-border transition-colors
                 ${onRowClick ? "cursor-pointer" : ""}
                 hover:bg-muted/50
               `}
               style={{
                 animationDelay: `${index * 50}ms`,
               }}
             >
               {columns.map((column) => (
                 <TableCell
                   key={String(column.key)}
                   className={`text-sm ${column.className || ""}`}
                 >
                   {column.render
                     ? column.render(item)
                     : String(item[column.key as keyof T] ?? "")}
                 </TableCell>
               ))}
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </motion.div>
   );
 }
 
 export default DataTable;
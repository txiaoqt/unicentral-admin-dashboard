 import { Link, useLocation } from "react-router-dom";
 import { motion } from "framer-motion";
 import {
   LayoutDashboard,
   GraduationCap,
   Globe,
   Users,
   Settings,
   X, // Import X icon for close button
 } from "lucide-react";
 import { Button } from "@/components/ui/button"; // Assuming Button component exists
 
 const menuItems = [
   { path: "/", label: "Dashboard", icon: LayoutDashboard },
   { path: "/universities", label: "Universities", icon: GraduationCap },
   { path: "/web-scraping", label: "Web Scraping", icon: Globe },
   { path: "/users", label: "Users", icon: Users },
   { path: "/settings", label: "Settings", icon: Settings },
 ];
 
 interface SidebarProps {
   isOpen: boolean;
   onClose: () => void;
 }
 
 const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
   const location = useLocation();
 
   return (
     <>
       {/* Overlay for mobile */}
       {isOpen && (
         <div
           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
           onClick={onClose}
         ></div>
       )}
 
       <aside
         className={`
           fixed inset-y-0 left-0 z-40 w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col
           transform transition-transform duration-300 ease-in-out
           md:relative md:translate-x-0
           ${isOpen ? "translate-x-0" : "-translate-x-full"}
         `}
       >
         {/* Close button for mobile */}
         <div className="absolute top-4 right-4 md:hidden">
           <Button variant="ghost" size="icon" onClick={onClose}>
             <X className="h-6 w-6 text-foreground" />
           </Button>
         </div>
 
         {/* Logo */}
         <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
               <span className="text-background font-bold text-sm">U</span>
             </div>
             <span className="font-semibold text-foreground tracking-tight">
               UniCentral
             </span>
           </div>
         </div>
 
         {/* Navigation */}
         <nav className="flex-1 px-3 py-4">
           <ul className="space-y-1">
             {menuItems.map((item) => {
               const isActive = location.pathname === item.path;
               const Icon = item.icon;
 
               return (
                 <li key={item.path}>
                   <Link
                     to={item.path}
                     onClick={onClose} // Close sidebar on navigation click
                     className={`
                       relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                       transition-all duration-200
                       ${
                         isActive
                           ? "text-sidebar-accent-foreground"
                           : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                       }
                     `}
                   >
                     {isActive && (
                       <motion.div
                         layoutId="sidebar-active"
                         className="absolute inset-0 bg-sidebar-accent rounded-lg"
                         transition={{
                           type: "spring",
                           stiffness: 500,
                           damping: 35,
                         }}
                       />
                     )}
                     <Icon className="w-4 h-4 relative z-10" />
                     <span className="relative z-10">{item.label}</span>
                   </Link>
                 </li>
               );
             })}
           </ul>
         </nav>
 
         {/* Footer */}
         <div className="px-6 py-4 border-t border-sidebar-border">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
               <span className="text-xs font-medium text-muted-foreground">A</span>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-foreground truncate">Admin</p>
               <p className="text-xs text-muted-foreground truncate">
                 admin@unicentral.com
               </p>
             </div>
           </div>
         </div>
       </aside>
     </>
   );
 };
 
 export default Sidebar;
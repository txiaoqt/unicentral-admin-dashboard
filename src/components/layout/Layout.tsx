 import React, { useState } from "react";
 import Sidebar from "./Sidebar";
 import { Menu } from "lucide-react";
 import { Button } from "@/components/ui/button"; // Assuming Button component exists in "@/components/ui/button"
 
 interface LayoutProps {
   children: React.ReactNode;
 }
 
 const Layout: React.FC<LayoutProps> = ({ children }) => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
   return (
     <div className="flex min-h-screen bg-background">
       {/* Mobile Menu Button */}
       <div className="md:hidden fixed top-4 left-4 z-50">
         <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
           <Menu className="h-6 w-6" />
         </Button>
       </div>
 
       {/* Sidebar */}
       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
 
       {/* Main Content */}
       <main className="flex-1 overflow-auto pt-16 md:pt-0"> {/* Added pt-16 for mobile to clear fixed button */}
         <div className="p-4 md:p-8 max-w-7xl mx-auto"> {/* Adjusted padding for mobile */}
           {children}
         </div>
       </main>
     </div>
   );
 };
 
 export default Layout;
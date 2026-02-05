 import { motion } from "framer-motion";
 import { GraduationCap, Users, Activity, ArrowRight } from "lucide-react";
 import { Link } from "react-router-dom";
 import StatCard from "@/components/ui/stat-card";
 import PageHeader from "@/components/ui/page-header";
 import { Button } from "@/components/ui/button";
 import { supabase } from '../lib/supabase';
 import { useEffect, useState } from 'react';
 
 interface QuickAction {
   label: string;
   href: string;
   testId: string;
 }
 
 interface DashboardStats {
   totalUniversities: number;
   totalUsers: number;
   recentActivity: number;
 }
 
 const quickActions: QuickAction[] = [
   { label: "Add University", href: "/universities", testId: "quick-action-add-university" },
   { label: "Run Scraper", href: "/web-scraping", testId: "quick-action-run-scraper" },
   { label: "Manage Users", href: "/users", testId: "quick-action-manage-users" },
   { label: "Settings", href: "/settings", testId: "quick-action-settings" },
 ];
 
 const Dashboard = () => {
   const [stats, setStats] = useState<DashboardStats>({
     totalUniversities: 0,
     totalUsers: 0,
     recentActivity: 0,
   });
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const fetchStats = async () => {
       try {
         const { count: universitiesCount } = await supabase
           .from('universities')
           .select('*', { count: 'exact', head: true });
 
         const { count: usersCount } = { count: 0 }; // Temporarily set to 0 to prevent 404 error, as 'users' table not found.
 
         setStats({
           totalUniversities: universitiesCount || 0,
           totalUsers: usersCount || 0,
           recentActivity: 0, // Placeholder as no clear source in admin-dashboard example
         });
       } catch (error) {
         console.error('Error fetching dashboard stats:', error);
       } finally {
         setLoading(false);
       }
     };
 
     fetchStats();
   }, []);
 
   if (loading) {
     return (
       <div className="flex items-center justify-center h-64">
         <div className="text-gray-600">Loading dashboard...</div>
       </div>
     );
   }
 
   return (
     <div className="space-y-8">
       <PageHeader
         title="Dashboard"
         description="Welcome to UniCentral Admin Dashboard"
         testId="dashboard-title"
       />
 
       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <StatCard
                     title="Total Universities"
                     value={stats.totalUniversities}
                     icon={GraduationCap}
                     description="Active institutions"
                     testId="stat-universities"
                   />         <StatCard
           title="Total Admins"
           value={stats.totalUsers}
           icon={Users}
           description="Active administrators"
           testId="stat-users"
         />
                   <StatCard
                     title="Recent Activity"
                     value={stats.recentActivity}
                     icon={Activity}
                     description="Actions this week"
                     testId="stat-activity"
                   />       </div>
 
       {/* Quick Actions */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3, delay: 0.1 }}
         className="bg-card border border-border rounded-xl p-6"
       >
         <h2 className="text-sm font-medium text-foreground mb-4">Quick Actions</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           {quickActions.map((action) => (
             <Link key={action.testId} to={action.href}>
               <Button
                 variant="secondary"
                 data-testid={action.testId}
                 className="w-full justify-between group"
               >
                 <span>{action.label}</span>
                 <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
               </Button>
             </Link>
           ))}
         </div>
       </motion.div>
 
       {/* Recent Activity */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3, delay: 0.2 }}
         className="bg-card border border-border rounded-xl p-6"
       >
         <h2 className="text-sm font-medium text-foreground mb-4">Recent Activity</h2>
         <div className="text-center py-12">
           <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
             <Activity className="w-5 h-5 text-muted-foreground" />
           </div>
           <p className="text-muted-foreground text-sm">No recent activity to display</p>
         </div>
       </motion.div>
     </div>
   );
 };
 
 export default Dashboard;
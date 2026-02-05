 import { motion } from "framer-motion";
 import { User, Bell, Shield, Palette } from "lucide-react";
 import PageHeader from "@/components/ui/page-header";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { Separator } from "@/components/ui/separator";
 
 const UserSettings = () => {
   return (
     <div className="space-y-6">
       <PageHeader
         title="Settings"
         description="Manage your account settings and preferences"
         testId="settings-title"
       />
 
       <div className="grid gap-6">
         {/* Profile Settings */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
           className="bg-card border border-border rounded-xl p-6"
         >
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
               <User className="w-5 h-5 text-muted-foreground" />
             </div>
             <div>
               <h3 className="font-medium text-foreground">Profile</h3>
               <p className="text-sm text-muted-foreground">
                 Update your personal information
               </p>
             </div>
           </div>
 
           <div className="grid gap-4 max-w-md">
             <div className="space-y-2">
               <Label htmlFor="name">Full Name</Label>
               <Input id="name" placeholder="Enter your name" defaultValue="Admin User" />
             </div>
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="Enter your email"
                 defaultValue="admin@unicentral.com"
               />
             </div>
             <Button className="w-fit">Save Changes</Button>
           </div>
         </motion.div>
 
         {/* Notifications */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, delay: 0.1 }}
           className="bg-card border border-border rounded-xl p-6"
         >
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
               <Bell className="w-5 h-5 text-muted-foreground" />
             </div>
             <div>
               <h3 className="font-medium text-foreground">Notifications</h3>
               <p className="text-sm text-muted-foreground">
                 Configure how you receive notifications
               </p>
             </div>
           </div>
 
           <div className="space-y-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-foreground">Email notifications</p>
                 <p className="text-xs text-muted-foreground">
                   Receive email updates about activity
                 </p>
               </div>
               <Switch defaultChecked />
             </div>
             <Separator />
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-foreground">Scraper alerts</p>
                 <p className="text-xs text-muted-foreground">
                   Get notified when scrapers complete
                 </p>
               </div>
               <Switch defaultChecked />
             </div>
           </div>
         </motion.div>
 
         {/* Security */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, delay: 0.2 }}
           className="bg-card border border-border rounded-xl p-6"
         >
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
               <Shield className="w-5 h-5 text-muted-foreground" />
             </div>
             <div>
               <h3 className="font-medium text-foreground">Security</h3>
               <p className="text-sm text-muted-foreground">
                 Manage your security preferences
               </p>
             </div>
           </div>
 
           <div className="grid gap-4 max-w-md">
             <div className="space-y-2">
               <Label htmlFor="current-password">Current Password</Label>
               <Input id="current-password" type="password" placeholder="••••••••" />
             </div>
             <div className="space-y-2">
               <Label htmlFor="new-password">New Password</Label>
               <Input id="new-password" type="password" placeholder="••••••••" />
             </div>
             <div className="space-y-2">
               <Label htmlFor="confirm-password">Confirm Password</Label>
               <Input id="confirm-password" type="password" placeholder="••••••••" />
             </div>
             <Button variant="secondary" className="w-fit">
               Update Password
             </Button>
           </div>
         </motion.div>
 
         {/* Appearance */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, delay: 0.3 }}
           className="bg-card border border-border rounded-xl p-6"
         >
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
               <Palette className="w-5 h-5 text-muted-foreground" />
             </div>
             <div>
               <h3 className="font-medium text-foreground">Appearance</h3>
               <p className="text-sm text-muted-foreground">
                 Customize the look and feel
               </p>
             </div>
           </div>
 
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-foreground">Compact mode</p>
               <p className="text-xs text-muted-foreground">
                 Reduce spacing for denser information
               </p>
             </div>
             <Switch />
           </div>
         </motion.div>
       </div>
     </div>
   );
 };
 
 export default UserSettings;
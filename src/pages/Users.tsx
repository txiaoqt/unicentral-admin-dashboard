 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Plus, Pencil, Trash2 } from "lucide-react";
 import PageHeader from "@/components/ui/page-header";
 import { Button } from "@/components/ui/button";
 import { Alert, AlertDescription } from "@/components/ui/alert";
 import { Badge } from "@/components/ui/badge";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import AddUserModal from "@/components/modals/AddUserModal";
 import EditUserModal from "@/components/modals/EditUserModal";
 import type { User, UserFormData } from "@/types/User";
 
 // Mock data
 const mockUsers: User[] = [
   {
     id: 1,
     email: "admin@unicentral.com",
     full_name: "Admin User",
     role: "super_admin",
     created_at: "2025-01-01",
     last_login: "2025-01-15",
     is_active: true,
   },
   {
     id: 2,
     email: "john@unicentral.com",
     full_name: "John Doe",
     role: "admin",
     created_at: "2025-01-05",
     last_login: "2025-01-14",
     is_active: true,
   },
 ];
 
 const Users = () => {
   const [users, setUsers] = useState<User[]>(mockUsers);
   const [error, setError] = useState<string | null>(null);
   const [showAddModal, setShowAddModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [currentUser, setCurrentUser] = useState<User | null>(null);
 
   const handleAddUser = (newUser: UserFormData) => {
     const id = Math.max(...users.map((u) => u.id), 0) + 1;
     setUsers([
       ...users,
       {
         ...newUser,
         id,
         created_at: new Date().toISOString().split("T")[0],
         is_active: true,
       },
     ]);
   };
 
   const handleUpdateUser = (updatedUser: User) => {
     setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
   };
 
   const handleDeleteUser = (id: number) => {
     if (!window.confirm("Are you sure you want to delete this user?")) return;
     setUsers(users.filter((u) => u.id !== id));
   };
 
   const handleToggleActive = (id: number) => {
     setUsers(
       users.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
     );
   };
 
   const openEditModal = (user: User) => {
     setCurrentUser(user);
     setShowEditModal(true);
   };
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Users"
         description="Manage admin users and their permissions"
         testId="users-title"
         action={
           <Button onClick={() => setShowAddModal(true)} data-testid="btn-add-user">
             <Plus className="w-4 h-4 mr-2" />
             Add User
           </Button>
         }
       />
 
       {error && (
         <Alert variant="destructive">
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}
 
       {users.length === 0 ? (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="bg-card border border-border rounded-xl p-12 text-center"
         >
           <p className="text-muted-foreground">No users found.</p>
         </motion.div>
       ) : (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
           className="bg-card border border-border rounded-xl overflow-hidden"
         >
           <Table>
             <TableHeader>
               <TableRow className="border-border hover:bg-transparent">
                 <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                   User
                 </TableHead>
                 <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                   Role
                 </TableHead>
                 <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                   Status
                 </TableHead>
                 <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                   Last Login
                 </TableHead>
                 <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-24 text-right">
                   Actions
                 </TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {users.map((user) => (
                 <TableRow
                   key={user.id}
                   data-testid={`user-row-${user.id}`}
                   className="border-border transition-colors hover:bg-muted/50"
                 >
                   <TableCell>
                     <div>
                       <div className="text-sm font-medium text-foreground">
                         {user.full_name}
                       </div>
                       <div className="text-xs text-muted-foreground">
                         {user.email}
                       </div>
                     </div>
                   </TableCell>
                   <TableCell>
                     <Badge
                       variant={user.role === "super_admin" ? "default" : "secondary"}
                     >
                       {user.role === "super_admin" ? "Super Admin" : "Admin"}
                     </Badge>
                   </TableCell>
                   <TableCell>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleToggleActive(user.id)}
                       data-testid={`btn-toggle-status-${user.id}`}
                       className={`text-xs ${
                         user.is_active
                           ? "text-success hover:text-success"
                           : "text-warning hover:text-warning"
                       }`}
                     >
                       {user.is_active ? "Active" : "Inactive"}
                     </Button>
                   </TableCell>
                   <TableCell className="text-sm text-muted-foreground">
                     {user.last_login || "Never"}
                   </TableCell>
                   <TableCell className="text-right">
                     <div className="flex items-center justify-end gap-1">
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => openEditModal(user)}
                         data-testid={`btn-edit-user-${user.id}`}
                       >
                         <Pencil className="w-4 h-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => handleDeleteUser(user.id)}
                         data-testid={`btn-delete-user-${user.id}`}
                         className="text-destructive hover:text-destructive"
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </motion.div>
       )}
 
       <AddUserModal
         isOpen={showAddModal}
         onClose={() => setShowAddModal(false)}
         onSave={handleAddUser}
       />
 
       <EditUserModal
         isOpen={showEditModal}
         onClose={() => setShowEditModal(false)}
         onSave={handleUpdateUser}
         initialData={currentUser}
       />
     </div>
   );
 };
 
 export default Users;
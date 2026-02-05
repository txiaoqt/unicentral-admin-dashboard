 import { useState, useEffect } from "react";
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import type { User } from "@/types/User";
 
 interface EditUserModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (user: User) => void;
   initialData: User | null;
 }
 
 const EditUserModal = ({ isOpen, onClose, onSave, initialData }: EditUserModalProps) => {
   const [formData, setFormData] = useState({
     full_name: "",
     email: "",
     role: "admin" as "super_admin" | "admin",
   });
 
   useEffect(() => {
     if (initialData) {
       setFormData({
         full_name: initialData.full_name,
         email: initialData.email,
         role: initialData.role,
       });
     }
   }, [initialData]);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (initialData) {
       onSave({ ...initialData, ...formData });
     }
     onClose();
   };
 
   return (
     <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Edit User</DialogTitle>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="edit-full_name">Full Name</Label>
             <Input
               id="edit-full_name"
               placeholder="Enter full name"
               value={formData.full_name}
               onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="edit-email">Email</Label>
             <Input
               id="edit-email"
               type="email"
               placeholder="Enter email address"
               value={formData.email}
               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="edit-role">Role</Label>
             <Select
               value={formData.role}
               onValueChange={(value: "super_admin" | "admin") =>
                 setFormData({ ...formData, role: value })
               }
             >
               <SelectTrigger>
                 <SelectValue placeholder="Select role" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="admin">Admin</SelectItem>
                 <SelectItem value="super_admin">Super Admin</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <DialogFooter>
             <Button type="button" variant="outline" onClick={onClose}>
               Cancel
             </Button>
             <Button type="submit">Save Changes</Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default EditUserModal;
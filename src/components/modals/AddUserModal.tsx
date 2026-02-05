 import { useState } from "react";
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
 import type { UserFormData } from "@/types/User";
 
 interface AddUserModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (user: UserFormData) => void;
 }
 
 const AddUserModal = ({ isOpen, onClose, onSave }: AddUserModalProps) => {
   const [formData, setFormData] = useState<UserFormData>({
     email: "",
     full_name: "",
     role: "admin",
     password: "",
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSave(formData);
     setFormData({ email: "", full_name: "", role: "admin", password: "" });
     onClose();
   };
 
   return (
     <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Add New User</DialogTitle>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="full_name">Full Name</Label>
             <Input
               id="full_name"
               placeholder="Enter full name"
               value={formData.full_name}
               onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="email">Email</Label>
             <Input
               id="email"
               type="email"
               placeholder="Enter email address"
               value={formData.email}
               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="password">Password</Label>
             <Input
               id="password"
               type="password"
               placeholder="Enter password"
               value={formData.password}
               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="role">Role</Label>
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
             <Button type="submit">Add User</Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default AddUserModal;
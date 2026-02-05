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
 import type { University } from "@/types/University";
 
 interface AddUniversityModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (university: Omit<University, "id">) => void;
 }
 
 const AddUniversityModal = ({ isOpen, onClose, onSave }: AddUniversityModalProps) => {
   const [formData, setFormData] = useState({
     name: "",
     location: "",
     website: "",
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSave(formData);
     setFormData({ name: "", location: "", website: "" });
     onClose();
   };
 
   return (
     <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Add New University</DialogTitle>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="name">University Name</Label>
             <Input
               id="name"
               placeholder="Enter university name"
               value={formData.name}
               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="location">Location</Label>
             <Input
               id="location"
               placeholder="Enter location"
               value={formData.location}
               onChange={(e) => setFormData({ ...formData, location: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="website">Website (optional)</Label>
             <Input
               id="website"
               placeholder="https://..."
               value={formData.website}
               onChange={(e) => setFormData({ ...formData, website: e.target.value })}
             />
           </div>
           <DialogFooter>
             <Button type="button" variant="outline" onClick={onClose}>
               Cancel
             </Button>
             <Button type="submit">Add University</Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default AddUniversityModal;
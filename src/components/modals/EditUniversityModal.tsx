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
 import type { University } from "@/types/University";
 
 interface EditUniversityModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (university: University) => void;
   initialData: University | null;
 }
 
 const EditUniversityModal = ({ isOpen, onClose, onSave, initialData }: EditUniversityModalProps) => {
   const [formData, setFormData] = useState({
     name: "",
     location: "",
     website: "",
   });
 
   useEffect(() => {
     if (initialData) {
       setFormData({
         name: initialData.name,
         location: initialData.location,
         website: initialData.website || "",
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
           <DialogTitle>Edit University</DialogTitle>
         </DialogHeader>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="edit-name">University Name</Label>
             <Input
               id="edit-name"
               placeholder="Enter university name"
               value={formData.name}
               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="edit-location">Location</Label>
             <Input
               id="edit-location"
               placeholder="Enter location"
               value={formData.location}
               onChange={(e) => setFormData({ ...formData, location: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="edit-website">Website (optional)</Label>
             <Input
               id="edit-website"
               placeholder="https://..."
               value={formData.website}
               onChange={(e) => setFormData({ ...formData, website: e.target.value })}
             />
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
 
 export default EditUniversityModal;
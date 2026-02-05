 import { useEffect, useState } from "react";
 import { Plus, Pencil, Trash2 } from "lucide-react";
 import PageHeader from "@/components/ui/page-header";
 import { Button } from "@/components/ui/button";
 import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
 import AddUniversityModal from "@/components/modals/AddUniversityModal";
 import EditUniversityModal from "@/components/modals/EditUniversityModal";
 import type { University } from "@/types/University";
 import { supabase } from '../lib/supabase';
 
 const Universities = () => {
   const [universities, setUniversities] = useState<University[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [showAddModal, setShowAddModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [currentUniversity, setCurrentUniversity] = useState<University | null>(null);
 
   const fetchUniversities = async () => {
     setLoading(true);
     const { data, error } = await supabase
       .from('universities')
       .select('*');
 
     if (error) {
       setError(error.message);
       setUniversities([]);
     } else {
       setUniversities(data || []);
     }
     setLoading(false);
   };
 
   useEffect(() => {
     fetchUniversities();
   }, []);
 
   const handleAddUniversity = async (newUniversity: Omit<University, "id">) => {
     const { data, error } = await supabase
       .from('universities')
       .insert([newUniversity])
       .select();
 
     if (error) {
       console.error('Error adding university:', error);
       setError('Failed to add university: ' + error.message);
     } else {
       console.log('University added successfully:', data);
       fetchUniversities();
     }
   };
 
   const handleUpdateUniversity = async (updatedUniversity: University) => {
     const { data, error } = await supabase
       .from('universities')
       .update(updatedUniversity)
       .eq('id', updatedUniversity.id)
       .select();
 
     if (error) {
       console.error('Error updating university:', error);
       setError('Failed to update university: ' + error.message);
     } else {
       console.log('University updated successfully:', data);
       fetchUniversities();
     }
   };
 
   const handleDeleteUniversity = async (id: number) => {
     if (!window.confirm("Are you sure you want to delete this university?")) return;
     
     const { error } = await supabase
       .from('universities')
       .delete()
       .eq('id', id);
 
     if (error) {
       console.error('Error deleting university:', error);
       setError('Failed to delete university: ' + error.message);
     } else {
       console.log('University deleted successfully.');
       fetchUniversities();
     }
   };
 
   const openEditModal = (university: University) => {
     setCurrentUniversity(university);
     setShowEditModal(true);
   };
 
   if (loading) {
     return (
       <div className="flex items-center justify-center h-64">
         <div className="text-gray-600">Loading universities...</div>
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Universities"
         description="Manage university listings and information"
         testId="universities-title"
         action={
           <Button onClick={() => setShowAddModal(true)} data-testid="btn-add-university">
             <Plus className="w-4 h-4 mr-2" />
             Add University
           </Button>
         }
       />
 
       {error && (
         <Alert variant="destructive">
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}
 
      {universities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-xl p-12 text-center"
        >
          <p className="text-muted-foreground">No universities found.</p>
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
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                  ID
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Location
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-24 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.map((university) => (
                <TableRow
                  key={university.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {university.id}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {university.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {university.location}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(university)}
                        data-testid={`btn-edit-university-${university.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUniversity(university.id)}
                        data-testid={`btn-delete-university-${university.id}`}
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
 
       <AddUniversityModal
         isOpen={showAddModal}
         onClose={() => setShowAddModal(false)}
         onSave={handleAddUniversity}
       />
 
       <EditUniversityModal
         isOpen={showEditModal}
         onClose={() => setShowEditModal(false)}
         onSave={handleUpdateUniversity}
         initialData={currentUniversity}
       />
     </div>
   );
 };
 
 export default Universities;
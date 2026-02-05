 export interface User {
   id: number;
   email: string;
   full_name: string;
   role: "super_admin" | "admin";
   created_at: string;
   last_login?: string;
   is_active: boolean;
 }
 
 export interface UserFormData {
   email: string;
   full_name: string;
   role: "super_admin" | "admin";
   password?: string;
 }
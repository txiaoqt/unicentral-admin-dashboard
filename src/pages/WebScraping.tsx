 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Play, Loader2, Globe, CheckCircle2 } from "lucide-react";
 import PageHeader from "@/components/ui/page-header";
 import { Button } from "@/components/ui/button";
 import { Alert, AlertDescription } from "@/components/ui/alert";
 
 interface ScrapeResult {
   admission_status?: string;
   academic_semester_start?: string;
   academic_semester_end?: string;
   academic_application_deadline?: string;
   admission_deadline?: string;
   academic_status?: string;
   supabase_status?: string;
   error?: string;
 }
 
 const WebScraping = () => {
   const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const handleScrape = async () => {
     setLoading(true);
     setError(null);
     setScrapeResult(null);
 
     // Simulate scraping - replace with actual API call
     try {
       await new Promise((resolve) => setTimeout(resolve, 2000));
       setScrapeResult({
         admission_status: "Open",
         academic_semester_start: "August 2025",
         academic_semester_end: "December 2025",
         academic_application_deadline: "July 15, 2025",
         admission_deadline: "July 30, 2025",
         academic_status: "Active",
         supabase_status: "Updated",
       });
     } catch (e) {
       setError("Failed to run scraper. Please try again.");
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="space-y-6">
       <PageHeader
         title="Web Scraping"
         description="Scrape admission data from university websites"
         testId="web-scraping-title"
       />
 
       {/* Scraper Card */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-card border border-border rounded-xl p-6"
       >
         <div className="flex items-start justify-between gap-4">
           <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
               <Globe className="w-5 h-5 text-muted-foreground" />
             </div>
             <div>
               <h3 className="font-medium text-foreground">PUP Admissions Scraper</h3>
               <p className="text-sm text-muted-foreground mt-1">
                 Scrapes admission data from PUP's website and updates the database.
               </p>
             </div>
           </div>
           <Button onClick={handleScrape} disabled={loading}>
             {loading ? (
               <>
                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                 Scraping...
               </>
             ) : (
               <>
                 <Play className="w-4 h-4 mr-2" />
                 Run Scraper
               </>
             )}
           </Button>
         </div>
       </motion.div>
 
       {/* Loading State */}
       {loading && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="flex items-center justify-center py-12"
         >
           <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
         </motion.div>
       )}
 
       {/* Error State */}
       {error && (
         <Alert variant="destructive">
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}
 
       {/* Results */}
       {scrapeResult && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-card border border-border rounded-xl overflow-hidden"
         >
           <div className="px-6 py-4 border-b border-border flex items-center gap-2">
             <CheckCircle2 className="w-4 h-4 text-success" />
             <h3 className="font-medium text-foreground">Scraping Results</h3>
           </div>
           <div className="divide-y divide-border">
             {Object.entries(scrapeResult).map(([key, value]) => (
               <div key={key} className="px-6 py-3 flex items-center justify-between">
                 <span className="text-sm text-muted-foreground capitalize">
                   {key.replace(/_/g, " ")}
                 </span>
                 <span className="text-sm font-medium text-foreground">
                   {value || "N/A"}
                 </span>
               </div>
             ))}
           </div>
         </motion.div>
       )}
     </div>
   );
 };
 
 export default WebScraping;
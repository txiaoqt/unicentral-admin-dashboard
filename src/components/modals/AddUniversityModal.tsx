import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { University } from '@/types/University'; // Assuming this path

interface AddUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUniversity: Omit<University, 'id'>) => Promise<void>;
}

const AddUniversityModal: React.FC<AddUniversityModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<University, 'id'>>({
    name: '',
    acronym: '',
    location: '',
    province: '',
    established: '',
    type: '',
    students: '',
    programs: 0,
    description: '',
    long_description: '',
    subjects: [],
    image_url: '',
    gallery_images: [],
    accreditation: [],
    campus_size: null,
    founded: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    facilities: [],
    amenities: [],
    achievements: [],
    quickfacts: [],
    admission_requirements: [],
    application_process: [],
    admission_status: '',
    admission_deadline: null,
    academic_semester_start: null,
    academic_semester_end: null,
    academic_application_deadline: null,
    ranking_source: '',
    ranking_details: '',
    map_location_lat: 0,
    map_location_lng: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: keyof University) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value.split(',').map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose(); // Close modal after saving
    } catch (error) {
      console.error('Error saving university:', error);
      // Optionally show an error toast/message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New University</DialogTitle>
          <DialogDescription>
            Fill in the details for the new university.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="acronym" className="text-right">
              Acronym
            </Label>
            <Input
              id="acronym"
              name="acronym"
              value={formData.acronym || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="province" className="text-right">
              Province
            </Label>
            <Input
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="established" className="text-right">
              Established Year
            </Label>
            <Input
              id="established"
              name="established"
              value={formData.established}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="students" className="text-right">
              Number of Students
            </Label>
            <Input
              id="students"
              name="students"
              value={formData.students}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="programs" className="text-right">
              Number of Programs
            </Label>
            <Input
              id="programs"
              name="programs"
              type="number"
              value={formData.programs}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="long_description" className="text-right">
              Long Description
            </Label>
            <Textarea
              id="long_description"
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image_url" className="text-right">
              Image URL
            </Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gallery_images" className="text-right">
              Gallery Images (comma-separated URLs)
            </Label>
            <Textarea
              id="gallery_images"
              name="gallery_images"
              value={formData.gallery_images.join(', ')}
              onChange={(e) => handleArrayChange(e, 'gallery_images')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accreditation" className="text-right">
              Accreditation (comma-separated)
            </Label>
            <Input
              id="accreditation"
              name="accreditation"
              value={formData.accreditation.join(', ')}
              onChange={(e) => handleArrayChange(e, 'accreditation')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campus_size" className="text-right">
              Campus Size
            </Label>
            <Input
              id="campus_size"
              name="campus_size"
              value={formData.campus_size || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="founded" className="text-right">
              Founded Year
            </Label>
            <Input
              id="founded"
              name="founded"
              value={formData.founded}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="facilities" className="text-right">
              Facilities (comma-separated)
            </Label>
            <Textarea
              id="facilities"
              name="facilities"
              value={formData.facilities.join(', ')}
              onChange={(e) => handleArrayChange(e, 'facilities')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amenities" className="text-right">
              Amenities (comma-separated)
            </Label>
            <Textarea
              id="amenities"
              name="amenities"
              value={formData.amenities.join(', ')}
              onChange={(e) => handleArrayChange(e, 'amenities')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="achievements" className="text-right">
              Achievements (comma-separated)
            </Label>
            <Textarea
              id="achievements"
              name="achievements"
              value={formData.achievements.join(', ')}
              onChange={(e) => handleArrayChange(e, 'achievements')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quickfacts" className="text-right">
              Quick Facts (comma-separated)
            </Label>
            <Textarea
              id="quickfacts"
              name="quickfacts"
              value={formData.quickfacts.join(', ')}
              onChange={(e) => handleArrayChange(e, 'quickfacts')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="admission_requirements" className="text-right">
              Admission Requirements (comma-separated)
            </Label>
            <Textarea
              id="admission_requirements"
              name="admission_requirements"
              value={formData.admission_requirements.join(', ')}
              onChange={(e) => handleArrayChange(e, 'admission_requirements')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="application_process" className="text-right">
              Application Process (comma-separated)
            </Label>
            <Textarea
              id="application_process"
              name="application_process"
              value={formData.application_process.join(', ')}
              onChange={(e) => handleArrayChange(e, 'application_process')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="admission_status" className="text-right">
              Admission Status
            </Label>
            <Input
              id="admission_status"
              name="admission_status"
              value={formData.admission_status}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="admission_deadline" className="text-right">
              Admission Deadline
            </Label>
            <Input
              id="admission_deadline"
              name="admission_deadline"
              type="date"
              value={formData.admission_deadline || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="academic_semester_start" className="text-right">
              Academic Semester Start
            </Label>
            <Input
              id="academic_semester_start"
              name="academic_semester_start"
              value={formData.academic_semester_start || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="academic_semester_end" className="text-right">
              Academic Semester End
            </Label>
            <Input
              id="academic_semester_end"
              name="academic_semester_end"
              value={formData.academic_semester_end || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="academic_application_deadline" className="text-right">
              Academic Application Deadline
            </Label>
            <Input
              id="academic_application_deadline"
              name="academic_application_deadline"
              type="date"
              value={formData.academic_application_deadline || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ranking_source" className="text-right">
              Ranking Source
            </Label>
            <Input
              id="ranking_source"
              name="ranking_source"
              value={formData.ranking_source}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ranking_details" className="text-right">
              Ranking Details
            </Label>
            <Input
              id="ranking_details"
              name="ranking_details"
              value={formData.ranking_details}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="map_location_lat" className="text-right">
              Latitude
            </Label>
            <Input
              id="map_location_lat"
              name="map_location_lat"
              type="number"
              value={formData.map_location_lat}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="map_location_lng" className="text-right">
              Longitude
            </Label>
            <Input
              id="map_location_lng"
              name="map_location_lng"
              type="number"
              value={formData.map_location_lng}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add University'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUniversityModal;
import React, { useState } from 'react';
import { User, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ProfileImageUploadProps {
  userId: string;
  currentImageUrl: string | null;
  onImageUpdate: (url: string) => void;
}

export const ProfileImageUpload = ({ userId, currentImageUrl, onImageUpdate }: ProfileImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;

      // Delete existing file if it exists
      if (currentImageUrl) {
        const { error: deleteError } = await supabase.storage
          .from('profile-images')
          .remove([`${userId}/profile.${currentImageUrl.split('.').pop()}`]);

        if (deleteError) {
          console.error('Error deleting old image:', deleteError);
        }
      }

      // Upload new file
      const { error: uploadError, data } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      onImageUpdate(publicUrl);
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {currentImageUrl ? (
        <img
          src={currentImageUrl}
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
          <User className="h-12 w-12 text-indigo-600" />
        </div>
      )}
      <label
        htmlFor="profile-image"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
      >
        <Upload className="h-6 w-6 text-white" />
        <input
          type="file"
          id="profile-image"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={uploading}
        />
      </label>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white"></div>
        </div>
      )}
    </div>
  );
};
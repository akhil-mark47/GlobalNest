import React from 'react';
import { User } from 'lucide-react';
import { ProfileImageUpload } from './ProfileImageUpload';
import { Profile } from '../../types';

interface ProfileHeaderProps {
  profile: Profile | null;
  onImageUpdate: (url: string) => void;
}

export const ProfileHeader = ({ profile, onImageUpdate }: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex flex-col items-center">
        <ProfileImageUpload
          userId={profile?.id || ''}
          currentImageUrl={profile?.image_url || null}
          onImageUpdate={onImageUpdate}
        />
        <h2 className="mt-4 text-2xl font-semibold">{profile?.name || 'Anonymous'}</h2>
        <p className="text-gray-600">{profile?.university || 'University not set'}</p>
        <p className="text-gray-600">{profile?.field_of_study || 'Field of study not set'}</p>
      </div>
    </div>
  );
};
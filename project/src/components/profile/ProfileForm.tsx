import React from 'react';
import { Profile } from '../../types';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';

interface ProfileFormProps {
  profile: Profile | null;
  formData: {
    name: string;
    university: string;
    field_of_study: string;
    bio: string;
  };
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (field: string, value: string) => void;
}

export const ProfileForm = ({ 
  profile, 
  formData, 
  loading, 
  onSubmit, 
  onChange 
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormInput
        label="Email"
        type="email"
        disabled
        value={profile?.email || ''}
      />

      <FormInput
        label="Name"
        value={formData.name}
        onChange={(e) => onChange('name', e.target.value)}
      />

      <FormInput
        label="University"
        value={formData.university}
        onChange={(e) => onChange('university', e.target.value)}
      />

      <FormInput
        label="Field of Study"
        value={formData.field_of_study}
        onChange={(e) => onChange('field_of_study', e.target.value)}
      />

      <FormTextarea
        label="Bio"
        value={formData.bio}
        onChange={(e) => onChange('bio', e.target.value)}
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
};
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { ProfileForm } from '../components/profile/ProfileForm';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { useGeolocation } from '../hooks/useGeolocation';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    field_of_study: '',
    bio: ''
  });

  const { getCurrentLocation } = useGeolocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({
        name: data.name || '',
        university: data.university || '',
        field_of_study: data.field_of_study || '',
        bio: data.bio || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const location = await getCurrentLocation();

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          location,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = async (url: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ image_url: url })
        .eq('id', user?.id);

      if (error) throw error;
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error('Failed to update profile image');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProfileHeader profile={profile} onImageUpdate={handleImageUpdate} />
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
        <ProfileForm
          profile={profile}
          formData={formData}
          loading={loading}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
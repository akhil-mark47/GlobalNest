import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types';

export const ProfileSidebar = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center">
        {profile?.image_url ? (
          <img
            src={profile.image_url}
            alt={profile.name || 'Profile'}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="h-12 w-12 text-indigo-600" />
          </div>
        )}
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          {profile?.name || 'Anonymous'}
        </h2>
        <p className="text-gray-500">{profile?.university || 'University not set'}</p>
        <p className="text-gray-500">{profile?.field_of_study || 'Field not set'}</p>
      </div>
      
      <div className="mt-6 border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900">Quick Links</h3>
        <ul className="mt-2 space-y-2">
          <li>
            <Link to="/profile" className="text-indigo-600 hover:text-indigo-800">
              Edit Profile
            </Link>
          </li>
          <li>
            <Link to="/housing" className="text-indigo-600 hover:text-indigo-800">
              My Housing Listings
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="text-indigo-600 hover:text-indigo-800">
              My Job Listings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
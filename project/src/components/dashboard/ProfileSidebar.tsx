import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { User, Calendar, Award, Bell, Home, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types/profiles';

export const ProfileSidebar = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMentor, setIsMentor] = useState<boolean>(false);
  const [upcomingSessions, setUpcomingSessions] = useState<number>(0);

  useEffect(() => {
    if (user) {
      loadProfile();
      checkMentorStatus();
      checkUpcomingSessions();
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
  
  const checkMentorStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('id')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsMentor(!!data);
    } catch (error) {
      console.error('Error checking mentor status:', error);
    }
  };
  
  const checkUpcomingSessions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { count, error } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .gte('date', today)
        .eq('status', 'upcoming');
        
      if (error) throw error;
      setUpcomingSessions(count || 0);
    } catch (error) {
      console.error('Error checking upcoming sessions:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          {profile?.image_url ? (
            <img
              src={profile.image_url}
              alt={profile.name || 'Profile'}
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-gray-100">
              <User className="h-12 w-12 text-indigo-600" />
            </div>
          )}
          
          {/* Mentor badge */}
          {isMentor && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-1 shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {profile?.name || 'Anonymous'}
            {isMentor && (
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs py-0.5 px-2 rounded-full">
                Mentor
              </span>
            )}
          </h2>
          <p className="text-gray-500">{profile?.university || 'University not set'}</p>
          <p className="text-gray-500">{profile?.field_of_study || 'Field not set'}</p>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900">Quick Links</h3>
        <ul className="mt-2 space-y-2.5">
          <li>
            <Link to="/profile" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
              <User className="h-4 w-4 mr-2" />
              <span>Edit Profile</span>
            </Link>
          </li>
          
          {/* Sessions link with counter badge */}
          <li>
            <Link to="/sessions" className="flex items-center justify-between text-gray-700 hover:text-indigo-600 transition-colors group">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>My Sessions</span>
              </div>
              {upcomingSessions > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 group-hover:bg-indigo-700">
                  {upcomingSessions}
                </span>
              )}
            </Link>
          </li>
          
          <li>
            <Link to="/housing" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
              <Home className="h-4 w-4 mr-2" />
              <span>My Housing Listings</span>
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>My Job Listings</span>
            </Link>
          </li>
          
          {/* Show mentor dashboard link if user is a mentor */}
          {isMentor && (
            <li>
              <Link to="/mentor/dashboard" className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                <Award className="h-4 w-4 mr-2" />
                <span>Mentor Dashboard</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
      
      {/* User stats */}
      <div className="mt-6 border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Activity</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-indigo-600">{upcomingSessions}</div>
            <div className="text-xs text-gray-500">Upcoming Sessions</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-indigo-600">
              {isMentor ? 'Active' : 'Student'}
            </div>
            <div className="text-xs text-gray-500">Account Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};
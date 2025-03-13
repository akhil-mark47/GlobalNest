import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, Users, Calendar, Award, ChevronRight, Clock } from 'lucide-react';
import { ProfileSidebar } from '../components/dashboard/ProfileSidebar';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

interface Session {
  id: string;
  date: string;
  time_slot: string;
  mentor: {
    name: string;
    image_url: string;
  }
}

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUpcomingSessions();
      checkMentorStatus();
    }
  }, [user]);

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          date,
          time_slot,
          mentor:mentor_id (
            name,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .gte('date', today)
        .eq('status', 'upcoming')
        .order('date', { ascending: true })
        .limit(3);
        
      if (error) throw error;
      // Map the data to ensure it matches the Session interface structure
      const formattedSessions = (data || []).map(session => ({
        id: session.id,
        date: session.date,
        time_slot: session.time_slot,
        mentor: {
          name: session.mentor?.[0]?.name || '',
          image_url: session.mentor?.[0]?.image_url || ''
        }
      }));
      setUpcomingSessions(formattedSessions);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeSlot: string) => {
    return new Date(`2000-01-01T${timeSlot}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <ProfileSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {isMentor && (
              <Link 
                to="/mentor/dashboard" 
                className="mt-2 sm:mt-0 inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:from-indigo-700 hover:to-purple-700"
              >
                <Award className="mr-1.5 h-4 w-4" />
                Mentor Dashboard
              </Link>
            )}
          </div>
          
          {/* Sessions Section */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                Upcoming Sessions
              </h2>
              <Link to="/sessions" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="py-6 px-6 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-r-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading sessions...</p>
                </div>
              ) : upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={session.mentor?.image_url || '/alternate.jpg'} 
                        alt={session.mentor?.name}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/alternate.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Session with {session.mentor?.name}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(session.date)}
                        <div className="mx-1.5 h-0.5 w-0.5 rounded-full bg-gray-300"></div>
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {formatTime(session.time_slot)}
                      </div>
                    </div>
                    <Link
                      to={`/sessions#${session.id}`}
                      className="ml-4 bg-indigo-50 text-indigo-700 px-3 py-1.5 text-xs rounded-md hover:bg-indigo-100 flex-shrink-0"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-8 px-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-3">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="text-gray-500 mb-3">No upcoming sessions found</p>
                  <Link 
                    to="/connect" 
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Find a mentor
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/housing" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <Home className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Housing</h2>
                <p className="text-gray-600">Find or list housing opportunities near your university.</p>
              </div>
            </Link>

            <Link to="/jobs" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Jobs</h2>
                <p className="text-gray-600">Browse available jobs and internships in your area.</p>
              </div>
            </Link>

            <Link to="/community" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Community</h2>
                <p className="text-gray-600">Connect with fellow students and join local events.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
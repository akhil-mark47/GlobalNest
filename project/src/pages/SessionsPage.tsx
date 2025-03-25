import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Calendar, DollarSign, CheckCircle, XCircle, AlertCircle, Video, MessageCircle, 
  ArrowRight, Award, Filter, ChevronDown, User, MoreVertical, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// Define session types
interface Session {
  id: string;
  mentor_id: string;
  user_id: string;
  date: string;
  time_slot: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'canceled';
  payment_status: 'paid' | 'pending' | 'refunded' | 'failed';
  notes?: string;
  created_at: string;
  amount: number;
  currency: string;
  mentor: {
    id: string;
    name: string;
    image_url: string;
    title: string;
    expertise: string[];
    rating: number;
  };
}

export const SessionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      navigate('/login');
    }
  }, [user, activeTab, filterStatus]);

  // Handle session highlight when coming from booking page
  useEffect(() => {
    if (window.location.hash && sessions.length > 0) {
      const sessionId = window.location.hash.substring(1);
      const element = document.getElementById(`session-${sessionId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-session');
          setTimeout(() => element.classList.remove('highlight-session'), 2000);
        }, 500);
      }
    }
  }, [sessions]);
  
  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      // Build query
      let query = supabase
        .from('sessions')
        .select(`
          *,
          mentor:mentor_id (
            id,
            name,
            image_url,
            title,
            expertise,
            rating
          )
        `)
        .eq('user_id', user?.id);
      
      // Filter by upcoming or past
      const today = new Date().toISOString().split('T')[0];
      if (activeTab === 'upcoming') {
        query = query.gte('date', today).neq('status', 'canceled');
      } else {
        query = query.or(`date.lt.${today},status.eq.completed,status.eq.canceled`);
      }
      
      // Additional filters
      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }
      
      // Order by date
      query = query.order('date', { ascending: activeTab === 'upcoming' });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setSessions(data as Session[]);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      
      const { error } = await supabase
        .from('sessions')
        .update({ 
          status: 'canceled',
          payment_status: 'refunded' 
        })
        .eq('id', sessionId)
        .eq('user_id', user?.id); // Security: ensure user can only cancel their own sessions
      
      if (error) throw error;
      
      toast.success('Session canceled successfully');
      // Refresh the sessions list
      fetchSessions();
      
    } catch (error) {
      console.error('Error canceling session:', error);
      toast.error('Failed to cancel session');
    } finally {
      setActionLoading(null);
      setMenuOpen(null); 
    }
  };

  const markSessionCompleted = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      
      const { error } = await supabase
        .from('sessions')
        .update({ 
          status: 'completed',
          payment_status: 'paid' 
        })
        .eq('id', sessionId)
        .eq('user_id', user?.id); // Security check
      
      if (error) throw error;
      
      toast.success('Session marked as completed');
      fetchSessions();
      
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
    } finally {
      setActionLoading(null);
      setMenuOpen(null);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPaymentStatusIcon = (status: string) => {
    switch(status) {
      case 'paid': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'refunded': return <ArrowRight className="h-5 w-5 text-blue-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Updated formatTime function with better error handling
  const formatTime = (timeSlot: string): string => {
    try {
      // Handle time formats like "HH:MM:SS" or "HH:MM"
      const timeComponents = timeSlot.split(':');
      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);
      
      // Create a date object and set the hours and minutes
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeSlot; // Return the original value as fallback
    }
  };
  
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg 
        key={i} 
        className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Updated isSessionStartingSoon with better error handling
  const isSessionStartingSoon = (date: string, timeSlot: string): boolean => {
    try {
      // Create a date object from the session date
      const sessionDate = new Date(date);
      
      // Parse the time slot (expected format: "HH:MM:SS" or "HH:MM")
      const timeComponents = timeSlot.split(':');
      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);
      const seconds = timeComponents.length > 2 ? parseInt(timeComponents[2], 10) : 0;
      
      // Set the time components on the session date
      sessionDate.setHours(hours, minutes, seconds);
      
      const now = new Date();
      const timeDiff = sessionDate.getTime() - now.getTime();
      
      // Return true if session starts in less than 15 minutes but hasn't started yet
      return timeDiff > 0 && timeDiff <= 15 * 60 * 1000;
    } catch (error) {
      console.error("Error calculating if session is starting soon:", error);
      return false;
    }
  };

  // Format the price with proper currency
  const formatPrice = (amount: number, currency: string): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD'
      }).format(amount);
    } catch (error) {
      return `${currency || 'USD'} ${amount.toFixed(2)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">My Sessions</h1>
          <p className="mt-2 text-indigo-100">Manage your upcoming and past mentoring sessions</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs and filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 mb-4 sm:mb-0">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:text-indigo-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'past'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:text-indigo-700'
              }`}
            >
              Past
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={fetchSessions}
              className="flex items-center text-indigo-700 hover:text-indigo-900 text-sm font-medium"
              disabled={loading}
            >
              <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-indigo-700 hover:text-indigo-900 text-sm font-medium ml-4"
            >
              <Filter size={16} className="mr-1" />
              Filters
              <ChevronDown size={16} className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-fadeIn">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === null ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('upcoming')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus('canceled')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === 'canceled' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Canceled
              </button>
            </div>
          </div>
        )}
        
        {/* Sessions list */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-6">
            {sessions.map(session => (
              <div 
                id={`session-${session.id}`}
                key={session.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Status indicator */}
                <div className={`h-2 ${
                  session.payment_status === 'paid' ? 'bg-green-500' : 
                  session.payment_status === 'pending' ? 'bg-amber-500' : 
                  session.payment_status === 'refunded' ? 'bg-blue-500' : 'bg-red-500'
                }`}></div>
                
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Mentor info */}
                    <div className="flex items-center mb-4 lg:mb-0">
                      <img 
                        src={session.mentor.image_url || '/alternate.jpg'} 
                        alt={session.mentor.name}
                        className="w-16 h-16 rounded-full object-cover shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = '/alternate.jpg';
                        }}
                      />
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">{session.mentor.name}</h3>
                        <p className="text-sm text-gray-600">{session.mentor.title}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex mr-1">
                            {renderStars(session.mentor.rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {session.mentor.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Session details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-8 lg:flex-shrink-0">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-gray-700">{formatDate(session.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          {formatTime(session.time_slot)} ({session.duration} min)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          {formatPrice(session.amount, session.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tags and actions */}
                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                      {isSessionStartingSoon(session.date, session.time_slot) && session.status === 'upcoming' && (
                        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Starting soon
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                      <div className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs">
                        <div className="mr-1.5">
                          {getPaymentStatusIcon(session.payment_status)}
                        </div>
                        {session.payment_status.charAt(0).toUpperCase() + session.payment_status.slice(1)}
                      </div>
                      {session.mentor.expertise && session.mentor.expertise.slice(0, 2).map((skill, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2 relative">
                      {/* Show different actions based on session status */}
                      {session.status === 'upcoming' && (
                        <>
                          <button 
                            className={`px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center
                              ${isSessionStartingSoon(session.date, session.time_slot) ? 'animate-pulse' : ''}`}
                            onClick={() => window.open('https://meet.google.com', '_blank')}
                          >
                            <Video className="h-4 w-4 mr-1.5" />
                            Join
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this session?')) {
                                cancelSession(session.id);
                              }
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            disabled={actionLoading === session.id}
                          >
                            {actionLoading === session.id ? (
                              <><RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />Canceling...</>
                            ) : (
                              <>Cancel</>
                            )}
                          </button>
                        </>
                      )}
                      
                      {session.status === 'completed' && (
                        <Link 
                          to={`/connect?mentor=${session.mentor_id}&review=true`}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center"
                        >
                          <Award className="h-4 w-4 mr-1.5" />
                          Leave Review
                        </Link>
                      )}
                      
                      <button
                        onClick={() => setMenuOpen(menuOpen === session.id ? null : session.id)}
                        className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {/* Dropdown menu */}
                      {menuOpen === session.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`Session with ${session.mentor.name} on ${formatDate(session.date)} at ${formatTime(session.time_slot)}`);
                                toast.success('Session details copied to clipboard');
                                setMenuOpen(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem"
                            >
                              Copy Details
                            </button>
                            
                            {session.status === 'upcoming' && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Do you want to mark this session as completed?')) {
                                    markSessionCompleted(session.id);
                                  }
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                              >
                                Mark as Completed
                              </button>
                            )}
                            
                            <Link
                              to={`/connect?mentor=${session.mentor_id}`}
                              onClick={() => setMenuOpen(null)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem"
                            >
                              View Mentor Profile
                            </Link>
                            
                            <button
                              onClick={() => {
                                navigate(`/messages?with=${session.mentor_id}`);
                                setMenuOpen(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem"
                            >
                              Message Mentor
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional notes if available */}
                  {session.notes && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">{session.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Calendar size={28} className="text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No {activeTab} sessions found</h3>
            <p className="mt-2 text-gray-500">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming sessions scheduled."
                : "You haven't completed any sessions yet."
              }
            </p>
            <div className="mt-6">
              <Link
                to="/connect"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Find a Mentor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Session stats */}
      {sessions.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Session Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-full p-3 mr-4">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(sessions.reduce((acc, session) => acc + (session.duration || 0), 0) / 60).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completed Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sessions.filter(s => s.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-amber-100 rounded-full p-3 mr-4">
                  <User className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Different Mentors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(sessions.filter(s => s.mentor_id).map(s => s.mentor_id)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
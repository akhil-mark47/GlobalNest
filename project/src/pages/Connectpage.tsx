import React, { useEffect, useState } from 'react';
import { Search, Filter, Star, Award, Clock, MapPin, Globe, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

// Type definitions based on your database schema
interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  experience: number;
  hourly_rate: number;
  currency: string;
  rating: number;
  total_reviews: number;
  badges: string[];
  bio: string;
  image_url: string;
  availability: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
  location: string;
  languages: string[];
}

interface Review {
  id: string;
  mentor_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url: string;
  };
}

export const ConnectPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [rateFilter, setRateFilter] = useState<[number, number]>([0, 500]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    timeSlot: '',
    duration: 60,
  });
  const [allExpertise, setAllExpertise] = useState<string[]>([]);

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    if (selectedMentor) {
      fetchReviews(selectedMentor.id);
    }
  }, [selectedMentor]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mentors')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setMentors(data);
        
        // Extract all unique expertise areas for filtering
        const allTags = data.flatMap((mentor: { expertise: any; }) => mentor.expertise);
        setAllExpertise([...new Set(allTags)] as string[]);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (mentorId: string) => {
    try {
      const { data, error } = await supabase
        .from('mentor_reviews')
        .select(`
          *,
          user:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async (rating: number, comment: string) => {
    if (!user || !selectedMentor) return;
    
    try {
      const { error } = await supabase
        .from('mentor_reviews')
        .insert({
          mentor_id: selectedMentor.id,
          user_id: user.id,
          rating,
          comment
        });
      
      if (error) throw error;
      
      // Refresh reviews
      fetchReviews(selectedMentor.id);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const bookSession = async () => {
    if (!user || !selectedMentor || !bookingDetails.date || !bookingDetails.timeSlot) {
      alert('Please select a date and time slot');
      return;
    }
    
    // This would typically connect to a booking system or payment gateway
    alert(`Session booked with ${selectedMentor.name} for ${bookingDetails.date} at ${bookingDetails.timeSlot} for ${bookingDetails.duration} minutes`);
  };

  const filteredMentors = mentors.filter(mentor => {
    // Search filter
    const searchMatch = searchTerm === '' || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Expertise filter
    const expertiseMatch = selectedExpertise.length === 0 ||
      selectedExpertise.some(expertise => mentor.expertise.includes(expertise));
    
    // Rate filter
    const rateMatch = mentor.hourly_rate >= rateFilter[0] && mentor.hourly_rate <= rateFilter[1];
    
    // Rating filter
    const ratingMatch = mentor.rating >= ratingFilter;
    
    return searchMatch && expertiseMatch && rateMatch && ratingMatch;
  });

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect with Expert Mentors</h1>
          <p className="text-indigo-100 text-lg max-w-3xl mx-auto">
            Find the perfect mentor to guide you through your academic and career journey
          </p>
          
          {/* Search bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, expertise, or keywords..."
                className="w-full py-3 px-4 pl-10 rounded-full border-0 shadow-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <Search size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Available Mentors</h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-indigo-700 hover:text-indigo-900"
            >
              <Filter size={18} className="mr-1" />
              Filters
              <ChevronDown size={18} className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {allExpertise.map(expertise => (
                      <div key={expertise} className="flex items-center">
                        <input
                          id={`expertise-${expertise}`}
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                          checked={selectedExpertise.includes(expertise)}
                          onChange={() => {
                            if (selectedExpertise.includes(expertise)) {
                              setSelectedExpertise(selectedExpertise.filter(e => e !== expertise));
                            } else {
                              setSelectedExpertise([...selectedExpertise, expertise]);
                            }
                          }}
                        />
                        <label htmlFor={`expertise-${expertise}`} className="ml-2 text-sm text-gray-700">
                          {expertise}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (${rateFilter[0]} - ${rateFilter[1]})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    value={rateFilter[1]}
                    onChange={(e) => setRateFilter([rateFilter[0], parseInt(e.target.value)])}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[0, 1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setRatingFilter(rating)}
                        className={`p-2 rounded ${ratingFilter === rating ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
                      >
                        {rating === 0 ? 'Any' : rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => {
                    setSelectedExpertise([]);
                    setRateFilter([0, 500]);
                    setRatingFilter(0);
                  }}
                  className="mr-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading mentors...</p>
          </div>
        ) : (
          <>
            {selectedMentor ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Mentor Profile Header */}
                <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-6 text-white">
                  <button 
                    onClick={() => setSelectedMentor(null)}
                    className="text-white mb-4 flex items-center hover:underline"
                  >
                    ← Back to all mentors
                  </button>
                  
                  <div className="flex flex-col md:flex-row md:items-center">
                    <img 
                      src={selectedMentor.image_url || '/default-avatar.png'} 
                      alt={selectedMentor.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white"
                    />
                    <div className="md:ml-6 mt-4 md:mt-0">
                      <h2 className="text-2xl font-bold">{selectedMentor.name}</h2>
                      <p className="text-indigo-100">{selectedMentor.title}</p>
                      <div className="flex items-center mt-2">
                        {renderStars(selectedMentor.rating)}
                        <span className="ml-2">{selectedMentor.rating.toFixed(1)} ({selectedMentor.total_reviews} reviews)</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedMentor.badges.map(badge => (
                          <span key={badge} className="bg-indigo-900/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                            <Award size={12} className="mr-1" /> {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mentor Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Bio and Expertise */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-gray-700">{selectedMentor.bio}</p>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMentor.expertise.map(skill => (
                            <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Clock size={18} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">{selectedMentor.experience} years experience</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={18} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">{selectedMentor.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Globe size={18} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">{selectedMentor.languages.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Reviews Section */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Reviews ({reviews.length})</h3>
                        
                        {reviews.length > 0 ? (
                          <div className="space-y-6">
                            {reviews.map(review => (
                              <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start">
                                  <img 
                                    src={review.user?.avatar_url || '/default-avatar.png'} 
                                    alt={review.user?.full_name || 'User'} 
                                    className="w-10 h-10 rounded-full object-cover mr-4"
                                  />
                                  <div>
                                    <div className="flex items-center">
                                      <span className="font-medium">{review.user?.full_name || 'Anonymous'}</span>
                                      <div className="flex ml-2">
                                        {renderStars(review.rating)}
                                      </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">
                                      {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="mt-2">{review.comment}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No reviews yet.</p>
                        )}
                        
                        {/* Add review form */}
                        {user && (
                          <div className="mt-6 bg-white p-4 rounded-lg border">
                            <h4 className="font-medium mb-2">Write a Review</h4>
                            <div className="flex items-center mb-3">
                              <div className="flex mr-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button 
                                    key={star}
                                    onClick={() => {
                                      const rating = document.getElementById('review-rating') as HTMLInputElement;
                                      rating.value = star.toString();
                                    }}
                                    className="text-gray-300 hover:text-yellow-400 focus:text-yellow-400"
                                  >
                                    <Star size={20} />
                                  </button>
                                ))}
                              </div>
                              <input type="hidden" id="review-rating" value="5" />
                            </div>
                            <textarea
                              id="review-comment"
                              className="w-full border rounded p-2 h-24"
                              placeholder="Share your experience with this mentor..."
                            ></textarea>
                            <button 
                              onClick={() => {
                                const rating = (document.getElementById('review-rating') as HTMLInputElement).value;
                                const comment = (document.getElementById('review-comment') as HTMLTextAreaElement).value;
                                submitReview(parseInt(rating), comment);
                              }}
                              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            >
                              Submit Review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Right Column: Booking */}
                    <div>
                      <div className="bg-gray-50 p-4 rounded-lg sticky top-4">
                        <h3 className="text-lg font-semibold mb-2">Book a Session</h3>
                        <p className="text-2xl font-bold text-indigo-600 mb-4">
                          {selectedMentor.currency} {selectedMentor.hourly_rate.toFixed(2)}/hour
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                              type="date"
                              className="w-full rounded border-gray-300 p-2"
                              min={new Date().toISOString().split('T')[0]}
                              value={bookingDetails.date}
                              onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                            <select
                              className="w-full rounded border-gray-300 p-2"
                              value={bookingDetails.timeSlot}
                              onChange={(e) => setBookingDetails({...bookingDetails, timeSlot: e.target.value})}
                            >
                              <option value="">Select a time</option>
                              {/* These would ideally come from the mentor's availability */}
                              <option value="09:00">9:00 AM</option>
                              <option value="10:00">10:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="13:00">1:00 PM</option>
                              <option value="14:00">2:00 PM</option>
                              <option value="15:00">3:00 PM</option>
                              <option value="16:00">4:00 PM</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[30, 60, 90].map(mins => (
                                <button
                                  key={mins}
                                  className={`p-2 border rounded ${bookingDetails.duration === mins ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300'}`}
                                  onClick={() => setBookingDetails({...bookingDetails, duration: mins})}
                                >
                                  {mins} min
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between mb-2">
                              <span>Rate</span>
                              <span>
                                {selectedMentor.currency} {(selectedMentor.hourly_rate * (bookingDetails.duration / 60)).toFixed(2)}
                              </span>
                            </div>
                            
                            <button
                              onClick={bookSession}
                              className="w-full bg-indigo-600 text-white py-3 rounded font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {filteredMentors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMentors.map(mentor => (
                      <div 
                        key={mentor.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                        onClick={() => setSelectedMentor(mentor)}
                      >
                        <div className="p-6">
                          <div className="flex items-center">
                            <img 
                              src={mentor.image_url || '/default-avatar.png'}
                              alt={mentor.name}
                              className="w-16 h-16 rounded-full object-cover mr-4 border border-gray-200"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">{mentor.name}</h3>
                              <p className="text-gray-600 text-sm">{mentor.title}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex items-center mb-2">
                              {renderStars(mentor.rating)}
                              <span className="ml-2 text-sm text-gray-600">
                                ({mentor.total_reviews})
                              </span>
                            </div>
                            
                            <p className="text-gray-700 line-clamp-2 mb-3">
                              {mentor.bio}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {mentor.expertise.slice(0, 3).map(skill => (
                                <span key={skill} className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                              {mentor.expertise.length > 3 && (
                                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                                  +{mentor.expertise.length - 3} more
                                </span>
                              )}
                            </div>
                            
                            {mentor.badges.length > 0 && (
                              <div className="flex items-center text-xs text-gray-600 mb-3">
                                <Award size={12} className="text-yellow-500 mr-1" />
                                {mentor.badges[0]}
                                {mentor.badges.length > 1 && ` +${mentor.badges.length - 1} more`}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="font-bold text-indigo-700">
                              {mentor.currency} {mentor.hourly_rate.toFixed(2)}/hr
                            </span>
                            <button className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700">
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No mentors found</h3>
                    <p className="mt-2 text-gray-500">Try adjusting your search filters</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedExpertise([]);
                        setRateFilter([0, 500]);
                        setRatingFilter(0);
                      }}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectPage;
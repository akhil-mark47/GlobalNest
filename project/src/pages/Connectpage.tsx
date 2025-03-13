import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate here
import { Search, Filter, Star, Award, Clock, MapPin, Globe, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

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
  user: {
    id: string;
    name: string;
    image_url: string | null;  // Changed from avatar_url to image_url
  } | null;
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
  const navigate = useNavigate();
  // Add these new state variables
const [selectedRating, setSelectedRating] = useState<number>(5);
const [reviewComment, setReviewComment] = useState<string>('');
const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
const [hasExistingReview, setHasExistingReview] = useState<boolean>(false);
const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  
// Add this to your useEffect that runs when selectedMentor changes
useEffect(() => {
  if (selectedMentor && user) {
    checkExistingReview();
  }
}, [selectedMentor, user]);

// Add this function to your ConnectPage component
const deleteReview = async (reviewId: string) => {
  if (!user) return;
  
  try {
    setSubmitStatus('loading');
    
    const { error } = await supabase
      .from('mentor_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id); // Security: ensure user can only delete their own reviews
    
    if (error) throw error;
    
    toast.success('Review deleted successfully');
    setSubmitStatus('idle');
    
    // Refresh reviews
    if (selectedMentor) {
      await fetchReviews(selectedMentor.id);
      
      // Refresh mentor data to update ratings
      const { data: updatedMentor } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', selectedMentor.id)
        .single();
      
      if (updatedMentor) {
        setSelectedMentor(updatedMentor);
      }
    }
    
    // Reset form state
    setSelectedRating(5);
    setReviewComment('');
    setHasExistingReview(false);
    
  } catch (error) {
    console.error('Error deleting review:', error);
    toast.error('Failed to delete review');
    setSubmitStatus('error');
  }
};

// Add this function at the top of your ConnectPage component, after your state definitions
const getAvatarUrl = async (userId: string): Promise<string> => {
  try {
    // First check if the image exists in the storage bucket
    const { data, error } = await supabase
      .storage
      .from('profile-images')
      .list(`avatars/${userId}`);
    
    if (error) {
      console.error('Error checking avatar existence:', error);
      return '/alternate.jpg'; // Fallback to default image
    }
    
    // If we have any files for this user
    if (data && data.length > 0) {
      // Get the public URL for the most recent image
      const { data: publicUrlData } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl(`avatars/${userId}/${data[0].name}`);
      
      return publicUrlData.publicUrl;
    }
    
    return '/alternate.jpg'; // No images found, use default
  } catch (error) {
    console.error('Error fetching avatar from storage:', error);
    return '/alternate.jpg'; // Fallback to default image
  }
};

// Now update your fetchReviews function to use this helper
const fetchReviews = async (mentorId: string) => {
  try {
    console.log('Fetching reviews for mentor:', mentorId);
    
    // First get the reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('mentor_reviews')
      .select('*')
      .eq('mentor_id', mentorId)
      .order('created_at', { ascending: false });
    
    if (reviewsError) {
      console.error('Supabase error fetching reviews:', reviewsError);
      throw reviewsError;
    }
    
    if (!reviewsData || reviewsData.length === 0) {
      setReviews([]);
      return;
    }
    
    console.log('Raw reviews data:', reviewsData);
    
 // Then fetch user profiles for each review
const enrichedReviews = await Promise.all(
  reviewsData.map(async (review) => {
    // Get the user profile for this review
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, name, image_url')
      .eq('id', review.user_id)
      .single();
    
    let avatarUrl = '/alternate.jpg'; // Default avatar

    // Try to get avatar from storage if not found in profile
    if (!userData?.image_url || userData.image_url === '') {
      avatarUrl = await getAvatarUrl(review.user_id);
    } else {
      avatarUrl = userData.image_url;
    }
    
    if (userError) {
      console.error(`Error fetching user ${review.user_id}:`, userError);
      return {
        ...review,
        user: {
          id: review.user_id,
          name: 'Anonymous',
          image_url: avatarUrl
        }
      };
    }
    
    return {
      ...review,
      user: {
        ...userData,
        image_url: avatarUrl  // Return image_url instead of avatar_url
      }
    };
  })
);
   
    
    console.log('Enriched reviews with user data:', enrichedReviews);
    setReviews(enrichedReviews);
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    toast.error('Failed to load reviews');
  }
};

const handleSubmitReview = async () => {
  if (!user || !selectedMentor) return;
  
  // Validate input
  if (selectedRating < 1 || selectedRating > 5) {
    toast.error('Please select a rating between 1 and 5 stars');
    return;
  }
  
  if (!reviewComment.trim() || reviewComment.length < 10) {
    toast.error('Please enter a review comment (minimum 10 characters)');
    return;
  }
  
  setSubmitStatus('loading');
  
  try {
    let result;
    
    if (hasExistingReview) {
      // Update existing review
      result = await supabase
        .from('mentor_reviews')
        .update({
          rating: selectedRating,
          comment: reviewComment
        })
        .eq('mentor_id', selectedMentor.id)
        .eq('user_id', user.id);
    } else {
      // Insert new review
      result = await supabase
        .from('mentor_reviews')
        .insert({
          mentor_id: selectedMentor.id,
          user_id: user.id,
          rating: selectedRating,
          comment: reviewComment
        });
    }
    
    if (result.error) throw result.error;
    
    // Success handling
    setSubmitStatus('success');
    toast.success('Review submitted successfully!');
    
    // Reset form after successful submission
    if (!hasExistingReview) {
      setSelectedRating(5);
      setReviewComment('');
    }
    
    // Refresh reviews
    await fetchReviews(selectedMentor.id);
    
    // Reset status after delay
    setTimeout(() => setSubmitStatus('idle'), 3000);
    
  } catch (error) {
    console.error('Error submitting review:', error);
    setSubmitStatus('error');
    toast.error('Failed to submit review. Please try again.');
    setTimeout(() => setSubmitStatus('idle'), 3000);
  }
};
// Add this function to check if the user has already reviewed this mentor
// Updated checkExistingReview to store the review ID
const checkExistingReview = async () => {
  if (!user || !selectedMentor) return;
  
  try {
    const { data, error } = await supabase
      .from('mentor_reviews')
      .select('id, rating, comment')
      .eq('mentor_id', selectedMentor.id)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) throw error;
    
    if (data) {
      setHasExistingReview(true);
      setExistingReviewId(data.id); // Store the existing review ID
      // Pre-fill the form with existing review data
      setSelectedRating(data.rating);
      setReviewComment(data.comment);
    } else {
      setHasExistingReview(false);
      setExistingReviewId(null);
      // Reset form
      setSelectedRating(5);
      setReviewComment('');
    }
  } catch (error) {
    console.error('Error checking existing review:', error);
  }
};
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

  // This fetchReviews function is already defined above

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
      toast.error('Please select a date and time slot');
      return;
    }
    
    try {
      // Calculate the session amount based on hourly rate and duration
      const amount = selectedMentor.hourly_rate * (bookingDetails.duration / 60);
      
      // First, insert the session in the database
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          mentor_id: selectedMentor.id,
          user_id: user.id,
          date: bookingDetails.date,
          time_slot: bookingDetails.timeSlot,
          duration: bookingDetails.duration,
          status: 'upcoming',
          payment_status: 'pending',  // Assuming payment is handled separately
          amount: amount,
          currency: selectedMentor.currency,
          notes: `Session with ${selectedMentor.name} for ${bookingDetails.duration} minutes` 
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Success message
 

      // Inside the bookSession function, after successful booking:
      toast.success(
        (t) => (
          <div>
            <p>Session booked successfully!</p>
            <button 
              onClick={() => {
                toast.dismiss(t.id);
                navigate(`/sessions#${data.id}`);
              }}
              className="mt-2 bg-white text-indigo-600 px-3 py-1 rounded-md text-sm hover:bg-indigo-50"
            >
              View My Sessions
            </button>
          </div>
        ),
        { duration: 5000 }
      );
      
      // Reset booking form
      setBookingDetails({
        date: '',
        timeSlot: '',
        duration: 60,
      });
      
      // Redirect to the sessions page
      navigate(`/sessions#${data.id}`);
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Failed to book session. Please try again.');
    }
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
                      src={selectedMentor.image_url || '/alternate.jpg'} 
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
                            <span className="text-gray-700">Location: {selectedMentor.location} </span>
                          </div>
                          <div className="flex items-center">
                            <Globe size={18} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">{selectedMentor.languages.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      
<div className="mt-8">
  <h3 className="text-lg font-semibold mb-4">Reviews ({reviews.length})</h3>
  
  {reviews.length > 0 ? (
    <div className="space-y-6">
      {reviews.map(review => {
        // Check if this review belongs to the current user
        const isUserReview = user && review.user_id === user.id;
        
        return (
          <div 
            key={review.id} 
            className={`${isUserReview ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'} p-4 rounded-lg`}
          >

<div className="flex items-start">
  <img 
    src={review.user?.image_url || '/alternate.jpg'} 
    alt={review.user?.name || 'User'} 
    className="w-10 h-10 rounded-full object-cover mr-4"
    onError={(e) => {
      // If image fails to load, use default image
      e.currentTarget.src = '/alternate.jpg';
    }}
  />
  <div className="flex-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
        {isUserReview && (
          <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
            You
          </span>
        )}
        <div className="flex ml-2">
          {renderStars(review.rating)}
        </div>
      </div>
      
      {/* Allow users to edit or delete their own reviews */}
      {isUserReview && (
        <div className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Pre-fill form with existing review
              setSelectedRating(review.rating);
              setReviewComment(review.comment);
              // Scroll to review form
              document.getElementById('review-form')?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }}
            className="text-indigo-600 hover:text-indigo-800"
            title="Edit your review"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete your review?')) {
                deleteReview(review.id);
              }
            }}
            className="text-red-600 hover:text-red-800"
            title="Delete your review"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
    <p className="text-gray-600 text-sm mt-1">
      {new Date(review.created_at).toLocaleDateString()}
    </p>
    <p className="mt-2">{review.comment}</p>
  </div>
</div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-500">No reviews yet. Be the first to review this mentor!</p>
  )}
  
{/* Add review form - Enhanced */}
{user ? (
  <div id="review-form" className="mt-6 bg-white p-4 rounded-lg border">
    <h4 className="font-medium mb-2">
      {hasExistingReview ? 'Update Your Review' : 'Write a Review'}
    </h4>
    
    {/* Star Rating with better interaction */}
    <div className="mb-3">
      <p className="text-sm text-gray-700 mb-1">Your Rating</p>
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star}
            type="button"
            onClick={() => setSelectedRating(star)}
            className="p-1 focus:outline-none"
          >
            <Star 
              size={24} 
              className={`${star <= selectedRating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-200'}`} 
            />
          </button>
        ))}
      </div>
    </div>
    
    {/* Comment field with character counter */}
    <div className="mb-2">
      <p className="text-sm text-gray-700 mb-1">Your Review</p>
      <textarea
        value={reviewComment}
        onChange={(e) => setReviewComment(e.target.value)}
        className="w-full border rounded-md p-2 h-24 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Share your experience with this mentor..."
        maxLength={500}
      ></textarea>
      <div className="flex justify-end">
        <span className="text-xs text-gray-500">{reviewComment.length}/500</span>
      </div>
    </div>
    
    {/* Review submission with state feedback */}
    <div className="flex items-center justify-between mt-3">
      <div>
        {/* Status messages */}
        {submitStatus === 'error' && (
          <p className="text-red-500 text-sm">Failed to submit review. Please try again.</p>
        )}
        {submitStatus === 'success' && (
          <p className="text-green-500 text-sm">Review submitted successfully!</p>
        )}
        {hasExistingReview && submitStatus === 'idle' && (
          <p className="text-amber-500 text-sm">You'll update your previous review.</p>
        )}
      </div>
      
      <div className="flex space-x-2">
        {hasExistingReview && (
          <button
            type="button"
            onClick={() => {
              setSelectedRating(5);
              setReviewComment('');
              setHasExistingReview(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        
        <button 
          onClick={handleSubmitReview}
          className={`px-4 py-2 rounded font-medium flex items-center
            ${submitStatus === 'loading' 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          disabled={submitStatus === 'loading'}
        >
          {submitStatus === 'loading' ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting...
            </>
          ) : (
            hasExistingReview ? 'Update Review' : 'Submit Review'
          )}
        </button>
      </div>
    </div>
  </div>
) : (
  <div className="mt-6 bg-gray-50 p-4 rounded-lg border text-center">
    <p className="text-gray-600">Please <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">log in</Link> to leave a review.</p>
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
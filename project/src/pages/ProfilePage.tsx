import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { ProfileForm } from '../components/profile/ProfileForm';

interface Profile {
  id: string;
  name: string;
  university?: string;
  field_of_study?: string;
  bio?: string;
  image_url?: string;
  location?: string;
  updated_at?: string;
}
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { useGeolocation } from '../hooks/useGeolocation';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2, X, Edit2, Check, DollarSign, Clock, Award } from 'lucide-react';

interface MentorData {
  title: string;
  expertise: string[];
  experience: number;
  hourly_rate: number;
  currency: string;
  bio: string;
  availability: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
  languages: string[];
}

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
  const [isMentor, setIsMentor] = useState(false);
  const [mentorData, setMentorData] = useState<MentorData>({
    title: '',
    expertise: [],
    experience: 0,
    hourly_rate: 50,
    currency: 'USD',
    bio: '',
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    languages: ['English']
  });
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [newExpertise, setNewExpertise] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isSubmittingMentor, setIsSubmittingMentor] = useState(false);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [currentTimeSlot, setCurrentTimeSlot] = useState('');

  const { getCurrentLocation } = useGeolocation();

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'CNY', 'JPY'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
    checkMentorStatus();
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

  const checkMentorStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setIsMentor(true);
        setMentorData({
          title: data.title || '',
          expertise: data.expertise || [],
          experience: data.experience || 0,
          hourly_rate: data.hourly_rate || 50,
          currency: data.currency || 'USD',
          bio: data.bio || '',
          availability: data.availability || {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          },
          languages: data.languages || ['English']
        });
      }
    } catch (error) {
      console.error('Error checking mentor status:', error);
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

  const handleMentorChange = (field: string, value: any) => {
    setMentorData(prev => ({ ...prev, [field]: value }));
  };

  const addExpertise = () => {
    if (newExpertise.trim() !== '' && !mentorData.expertise.includes(newExpertise.trim())) {
      setMentorData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (item: string) => {
    setMentorData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== item)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() !== '' && !mentorData.languages.includes(newLanguage.trim())) {
      setMentorData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (item: string) => {
    setMentorData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== item)
    }));
  };

  const addTimeSlot = () => {
    if (!activeDay || !currentTimeSlot) return;
    
    setMentorData(prev => {
      const updatedAvailability = {...prev.availability};
      const daySlots = updatedAvailability[activeDay as keyof typeof updatedAvailability] || [];
      
      if (!daySlots.includes(currentTimeSlot)) {
        updatedAvailability[activeDay as keyof typeof updatedAvailability] = 
          [...daySlots, currentTimeSlot].sort();
      }
      
      return {
        ...prev,
        availability: updatedAvailability
      };
    });
    
    setCurrentTimeSlot('');
  };

  const removeTimeSlot = (day: string, slot: string) => {
    setMentorData(prev => {
      const updatedAvailability = {...prev.availability};
      const daySlots = updatedAvailability[day as keyof typeof updatedAvailability] || [];
      
      updatedAvailability[day as keyof typeof updatedAvailability] = 
        daySlots.filter(s => s !== slot);
      
      return {
        ...prev,
        availability: updatedAvailability
      };
    });
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    try {
      setIsSubmittingMentor(true);
      
      const mentorRecord = {
        user_id: user.id,
        name: profile.name || formData.name,
        title: mentorData.title,
        expertise: mentorData.expertise,
        experience: mentorData.experience,
        hourly_rate: mentorData.hourly_rate,
        currency: mentorData.currency,
        bio: mentorData.bio || profile.bio || formData.bio,
        image_url: profile.image_url,
        availability: mentorData.availability,
        location: profile.location || 'Remote',
        languages: mentorData.languages
      };
      
      let result;
      
      if (isMentor) {
        // Update existing mentor record
        result = await supabase
          .from('mentors')
          .update(mentorRecord)
          .eq('user_id', user.id);
          
        if (result.error) throw result.error;
        toast.success('Mentor profile updated successfully');
      } else {
        // Create new mentor record
        result = await supabase
          .from('mentors')
          .insert(mentorRecord);
          
        if (result.error) throw result.error;
        setIsMentor(true);
        toast.success('You are now registered as a mentor!');
      }
      
      setShowMentorForm(false);
    } catch (error) {
      console.error('Error saving mentor profile:', error);
      toast.error('Failed to save mentor profile');
    } finally {
      setIsSubmittingMentor(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader profile={profile} onImageUpdate={handleImageUpdate} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mentor Status</h2>
            
            {isMentor ? (
              <div className="mb-4">
                <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg">
                  <Check className="h-5 w-5 mr-2" />
                  <p className="font-medium">You are registered as a mentor</p>
                </div>
                
                <button 
                  onClick={() => setShowMentorForm(true)}
                  className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Edit Mentor Profile
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Share your expertise and help other students by becoming a mentor.
                </p>
                <button 
                  onClick={() => setShowMentorForm(true)}
                  className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Register as Mentor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mentor Registration/Edit Modal */}
      {showMentorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{isMentor ? 'Edit' : 'Register as'} Mentor</h2>
              <button 
                onClick={() => setShowMentorForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleMentorSubmit} className="p-6">
              <div className="space-y-6">
                {/* Professional Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Computer Science Student, Software Engineer"
                    value={mentorData.title}
                    onChange={(e) => handleMentorChange('title', e.target.value)}
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Describe your experience, expertise and how you can help other students..."
                    value={mentorData.bio}
                    onChange={(e) => handleMentorChange('bio', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-2 border rounded-md"
                      value={mentorData.experience}
                      onChange={(e) => handleMentorChange('experience', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        className="w-full pl-10 p-2 border rounded-md"
                        value={mentorData.hourly_rate}
                        onChange={(e) => handleMentorChange('hourly_rate', parseFloat(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={mentorData.currency}
                      onChange={(e) => handleMentorChange('currency', e.target.value)}
                      required
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Areas of Expertise
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {mentorData.expertise.map(item => (
                      <div key={item} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center text-sm">
                        {item}
                        <button 
                          type="button"
                          onClick={() => removeExpertise(item)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow p-2 border rounded-l-md"
                      placeholder="Add expertise (e.g., Python, Academic Writing)"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                    />
                    <button
                      type="button"
                      className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700"
                      onClick={addExpertise}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {mentorData.languages.map(item => (
                      <div key={item} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm">
                        {item}
                        <button 
                          type="button"
                          onClick={() => removeLanguage(item)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow p-2 border rounded-l-md"
                      placeholder="Add language (e.g., Spanish, Mandarin)"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                    />
                    <button
                      type="button"
                      className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700"
                      onClick={addLanguage}
                    >
                      Add
                    </button>
                  </div>
                </div>

               {/* Availability - Calendar Style UI */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    Weekly Availability
  </label>
  
  <div className="border rounded-lg overflow-hidden shadow-sm mb-4">
    {/* Days of week header */}
    <div className="grid grid-cols-7 bg-indigo-50">
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
        <div key={day} className="p-3 text-center font-medium text-indigo-800 border-b border-r border-indigo-100 last:border-r-0">
          {day}
        </div>
      ))}
    </div>
    
    {/* Calendar cells */}
    <div>
      <div className="grid grid-cols-7 bg-white">
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
          const daySlots = mentorData.availability[day as keyof typeof mentorData.availability] || [];
          const hasSlots = daySlots.length > 0;
          
          return (
            <div 
              key={day} 
              className={`p-4 border-r last:border-r-0 border-b min-h-[100px] cursor-pointer hover:bg-indigo-50 transition-colors relative
                ${hasSlots ? 'bg-indigo-50' : 'bg-white'}`}
              onClick={() => setActiveDay(day)}
            >
              {hasSlots ? (
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {daySlots.length} time slot{daySlots.length !== 1 ? 's' : ''}
                  </span>
                  <div className="mt-1 space-y-1">
                    {daySlots.slice(0, 3).map(slot => (
                      <div key={slot} className="text-xs text-indigo-700 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {slot}
                      </div>
                    ))}
                    {daySlots.length > 3 && (
                      <div className="text-xs text-indigo-600 font-semibold">
                        + {daySlots.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Clock className="h-5 w-5" />
                  <span className="text-xs mt-1">No slots</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
  
  {/* Selected day time slots */}
  {activeDay && (
    <div className="bg-white rounded-lg border p-4 mb-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-indigo-800 capitalize">{activeDay} Availability</h4>
        <button 
          type="button" 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setActiveDay(null)}
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {timeSlots.map(slot => {
          const isSelected = (mentorData.availability[activeDay as keyof typeof mentorData.availability] || [])
            .includes(slot);
            
          return (
            <button
              key={slot}
              type="button"
              className={`py-2 px-3 rounded-md text-sm flex items-center justify-center transition-all
                ${isSelected 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => {
                if (isSelected) {
                  removeTimeSlot(activeDay, slot);
                } else {
                  setMentorData(prev => {
                    const updatedAvailability = {...prev.availability};
                    const daySlots = updatedAvailability[activeDay as keyof typeof updatedAvailability] || [];
                    updatedAvailability[activeDay as keyof typeof updatedAvailability] = 
                      [...daySlots, slot].sort();
                    return {
                      ...prev,
                      availability: updatedAvailability
                    };
                  });
                }
              }}
            >
              <Clock className={`h-3.5 w-3.5 ${isSelected ? 'mr-1.5' : 'mr-1.5'}`} />
              {slot}
              {isSelected && <Check className="h-3.5 w-3.5 ml-1.5" />}
            </button>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center">
        <button
          type="button"
          className="text-sm text-red-600 hover:text-red-800 flex items-center"
          onClick={() => {
            setMentorData(prev => {
              const updatedAvailability = {...prev.availability};
              updatedAvailability[activeDay as keyof typeof updatedAvailability] = [];
              return {
                ...prev,
                availability: updatedAvailability
              };
            });
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear all {activeDay} slots
        </button>
        
        <button
          type="button"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          onClick={() => setActiveDay(null)}
        >
          Done
        </button>
      </div>
    </div>
  )}
  
  {/* Summary section */}
  <div className="bg-gray-50 rounded-lg p-4 border">
    <h4 className="font-medium text-gray-700 mb-2">Your Weekly Availability</h4>
    
    {Object.entries(mentorData.availability).some(([_, slots]) => slots && slots.length > 0) ? (
      <div className="space-y-2">
        {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(day => {
          const slots = mentorData.availability[day] || [];
          if (slots.length === 0) return null;
          
          return (
            <div key={day} className="flex flex-wrap items-center">
              <span className="w-24 font-medium capitalize text-gray-700">{day}:</span>
              <div className="flex flex-wrap gap-1.5">
                {slots.map(timeSlot => (
                  <div key={timeSlot} className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs flex items-center">
                    {timeSlot}
                    <button 
                      type="button"
                      onClick={() => removeTimeSlot(day, timeSlot)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-gray-500 text-sm">No availability set. Click on a day in the calendar to add time slots.</p>
    )}
  </div>
  
  <p className="mt-2 text-xs text-gray-500">
    Select a day from the calendar above to add or remove available time slots.
  </p>
</div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowMentorForm(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                    disabled={isSubmittingMentor}
                  >
                    {isSubmittingMentor ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        {isMentor ? 'Update' : 'Register'} as Mentor
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
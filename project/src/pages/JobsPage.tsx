import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CreateJobListing } from '../components/listings/CreateJobListing';
import { ListingCard } from '../components/listings/ListingCard';
import { SearchFilters } from '../components/search/SearchFilters';
import { filterJobListings } from '../utils/filters';
import { useAuthStore } from '../store/authStore';
import { Job } from '../types';
import toast from 'react-hot-toast';

export const JobsPage = () => {
  const { user } = useAuthStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [listings, setListings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    salaryRange: ''
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateOrUpdateSuccess = async () => {
    setShowCreateForm(false);
    setEditingListing(null);
    await loadListings();
    toast.success('Job listing saved successfully!');
  };

  const handleEdit = (listing: Job) => {
    setEditingListing(listing);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setListings(listings.filter(listing => listing.id !== id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const filteredListings = filterJobListings(listings, searchTerm, filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        {user && (
          <button
            onClick={() => {
              setEditingListing(null);
              setShowCreateForm(!showCreateForm);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Job Listing
          </button>
        )}
      </div>

      <SearchFilters
        type="jobs"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {showCreateForm && (
        <div className="mb-8">
          <CreateJobListing 
            initialData={editingListing}
            onSuccess={handleCreateOrUpdateSuccess}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingListing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              type="job"
              data={listing}
              onEdit={user?.id === listing.user_id ? () => handleEdit(listing) : undefined}
              onDelete={user?.id === listing.user_id ? () => handleDelete(listing.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};
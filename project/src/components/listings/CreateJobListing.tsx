import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Job } from '../../types';
import toast from 'react-hot-toast';

interface CreateJobListingProps {
  initialData?: Job | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateJobListing = ({ 
  initialData, 
  onSuccess,
  onCancel 
}: CreateJobListingProps) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'full-time',
    salary: '',
    contact_email: '',
    contact_phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        company: initialData.company,
        description: initialData.description,
        location: typeof initialData.location === 'string' 
          ? initialData.location 
          : `${initialData.location.lat}, ${initialData.location.lng}`,
        type: initialData.type,
        salary: initialData.salary || '',
        contact_email: initialData.contact_email || '',
        contact_phone: initialData.contact_phone || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const [lat, lng] = formData.location.split(',').map(coord => parseFloat(coord.trim())) || [0, 0];
      
      const jobData = {
        user_id: user.id,
        ...formData,
        location: { lat, lng }
      };

      if (initialData?.id) {
        // Update existing listing
        const { error } = await supabase
          .from('jobs')
          .update({
            ...jobData,
            updated_at: new Date().toISOString()
          })
          .eq('id', initialData.id)
          .select();

        if (error) throw error;
        toast.success('Job listing updated successfully!');
      } else {
        // Create new listing
        const { error } = await supabase
          .from('jobs')
          .insert([{
            ...jobData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Job listing created successfully!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving job listing:', error);
      toast.error('Failed to save job listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Edit Job Listing' : 'Create Job Listing'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location (lat, lng)</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., 51.5074, -0.1278"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Salary Range</label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
            placeholder="e.g., $50,000 - $70,000 per year"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              required
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};
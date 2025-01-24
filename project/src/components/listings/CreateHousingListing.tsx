import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Housing } from '../../types';
import toast from 'react-hot-toast';

interface CreateHousingListingProps {
  initialData?: Housing | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateHousingListing = ({ 
  initialData, 
  onSuccess,
  onCancel 
}: CreateHousingListingProps) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    available_from: '',
    available_until: '',
    contact_email: '',
    contact_phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price.toString(),
        location: typeof initialData.location === 'string' 
          ? initialData.location 
          : `${initialData.location.lat}, ${initialData.location.lng}`,
        available_from: initialData.available_from,
        available_until: initialData.available_until,
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
      
      const housingData = {
        user_id: user.id,
        ...formData,
        price: parseFloat(formData.price),
        location: { lat, lng }
      };

      if (initialData?.id) {
        // Update existing listing
        const { error } = await supabase
          .from('housing')
          .update({
            ...housingData,
            updated_at: new Date().toISOString()
          })
          .eq('id', initialData.id)
          .select();

        if (error) throw error;
        toast.success('Housing listing updated successfully!');
      } else {
        // Create new listing
        const { error } = await supabase
          .from('housing')
          .insert([{
            ...housingData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Housing listing created successfully!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error('Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Edit Housing Listing' : 'Create Housing Listing'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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
            <label className="block text-sm font-medium text-gray-700">Price (per month)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Available From</label>
            <input
              type="date"
              required
              value={formData.available_from}
              onChange={(e) => setFormData(prev => ({ ...prev, available_from: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Available Until</label>
            <input
              type="date"
              required
              value={formData.available_until}
              onChange={(e) => setFormData(prev => ({ ...prev, available_until: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
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
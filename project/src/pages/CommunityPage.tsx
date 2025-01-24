import React, { useState, useEffect } from 'react';
import { MapPin, Search, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export const CommunityPage = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('location', 'is', null);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.university?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Search and Filters */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow p-6 h-[600px] relative">
            {/* Placeholder for map - In production, use a real map library */}
            <div className="absolute inset-0 bg-gray-100 rounded-lg">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="absolute"
                  style={{
                    left: `${user.location?.lng}%`,
                    top: `${user.location?.lat}%`,
                  }}
                  onMouseEnter={() => setSelectedUser(user)}
                  onMouseLeave={() => setSelectedUser(null)}
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      {user.image_url ? (
                        <img
                          src={user.image_url}
                          alt={user.name || ''}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    {selectedUser?.id === user.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg p-4">
                        <div className="text-sm font-semibold">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.university}</div>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => { window.location.href = '/connect'; }}
                            className="px-2 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600"
                          >
                            Connect
                          </button>
                          <button
                            onClick={() => {/* Implement chat logic */}}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
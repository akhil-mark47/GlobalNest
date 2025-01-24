import React from 'react';
import { MapPin, DollarSign, Calendar, Phone, Mail } from 'lucide-react';
import { formatLocation } from '../../utils/formatters';

interface ListingCardProps {
  type: 'housing' | 'job';
  data: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ListingCard = ({ type, data, onEdit, onDelete }: ListingCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{data.title}</h3>
          {type === 'job' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {data.type}
            </span>
          )}
        </div>

        {type === 'job' && (
          <p className="mt-1 text-sm text-gray-600">{data.company}</p>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{formatLocation(data.location)}</span>
          </div>

          <div className="flex items-center text-gray-500">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{type === 'housing' ? `$${data.price}/month` : data.salary}</span>
          </div>

          {type === 'housing' && (
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Available: {data.available_from} - {data.available_until}</span>
            </div>
          )}
        </div>

        <p className="mt-4 text-gray-600">{data.description}</p>

        <div className="mt-6 space-y-2">
          {data.contact_email && (
            <div className="flex items-center text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              <a href={`mailto:${data.contact_email}`} className="hover:text-indigo-600">
                {data.contact_email}
              </a>
            </div>
          )}
          {data.contact_phone && (
            <div className="flex items-center text-gray-500">
              <Phone className="h-4 w-4 mr-2" />
              <a href={`tel:${data.contact_phone}`} className="hover:text-indigo-600">
                {data.contact_phone}
              </a>
            </div>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="mt-6 flex space-x-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex-1 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
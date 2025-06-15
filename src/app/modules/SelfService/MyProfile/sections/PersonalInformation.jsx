import React, { useState } from 'react';
import { useSelfServicePermissions } from '../../hooks/useSelfServicePermissions';
import { SELF_SERVICE_PERMISSIONS } from '../../permissions/constants';

const PersonalInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { profile } = useSelfServicePermissions();
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    address: '123 Main St, City, Country',
    nationality: 'US'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to update personal information
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update personal information:', error);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              rows={3}
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500">First Name</h4>
          <p className="mt-1 text-sm text-gray-900">{formData.firstName}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
          <p className="mt-1 text-sm text-gray-900">{formData.lastName}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Email</h4>
          <p className="mt-1 text-sm text-gray-900">{formData.email}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Phone</h4>
          <p className="mt-1 text-sm text-gray-900">{formData.phone}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
          <p className="mt-1 text-sm text-gray-900">{formData.dateOfBirth}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Gender</h4>
          <p className="mt-1 text-sm text-gray-900">{formData.gender}</p>
        </div>

        <div className="col-span-2">
          <h4 className="text-sm font-medium text-gray-500">Address</h4>
          <p className="mt-1 text-sm text-gray-900">{formData.address}</p>
        </div>
      </div>

      {profile.personal.canEdit && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Edit Information
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInformation; 
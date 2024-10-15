import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

interface FloorPlan {
  id: string;
  name: string;
  imageUrl: string;
}

const FloorPlanManagement: React.FC = () => {
  const { user } = useAuth();
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [newFloorPlan, setNewFloorPlan] = useState<{ name: string; file: File | null }>({
    name: '',
    file: null,
  });

  useEffect(() => {
    fetchFloorPlans();
  }, []);

  const fetchFloorPlans = async () => {
    try {
      const response = await api.get('/floor-plans');
      setFloorPlans(response.data);
    } catch (error) {
      console.error('Error fetching floor plans:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFloorPlan({ ...newFloorPlan, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFloorPlan.file) return;

    const formData = new FormData();
    formData.append('name', newFloorPlan.name);
    formData.append('file', newFloorPlan.file);

    try {
      await api.post('/floor-plans', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchFloorPlans();
      setNewFloorPlan({ name: '', file: null });
    } catch (error) {
      console.error('Error uploading floor plan:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Floor Plan Management</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Floor Plan Name
          </label>
          <input
            type="text"
            id="name"
            value={newFloorPlan.name}
            onChange={(e) => setNewFloorPlan({ ...newFloorPlan, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Floor Plan Image
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 block w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Upload Floor Plan
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {floorPlans.map((floorPlan) => (
          <div key={floorPlan.id} className="border rounded-md p-4">
            <h3 className="text-lg font-semibold mb-2">{floorPlan.name}</h3>
            <img src={floorPlan.imageUrl} alt={floorPlan.name} className="w-full h-48 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPlanManagement;
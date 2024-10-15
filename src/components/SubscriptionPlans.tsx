import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Plus, Edit, Trash } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

const SubscriptionPlans: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [newPlan, setNewPlan] = useState<Omit<Plan, 'id'>>({
    name: '',
    description: '',
    price: 0,
    features: [],
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscription-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/subscription-plans', newPlan);
      fetchPlans();
      setNewPlan({ name: '', description: '', price: 0, features: [] });
    } catch (error) {
      console.error('Error creating subscription plan:', error);
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      await api.put(`/subscription-plans/${editingPlan.id}`, editingPlan);
      fetchPlans();
      setEditingPlan(null);
    } catch (error) {
      console.error('Error updating subscription plan:', error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.delete(`/subscription-plans/${id}`);
        fetchPlans();
      } catch (error) {
        console.error('Error deleting subscription plan:', error);
      }
    }
  };

  if (!isSuperAdmin) {
    return <div>Access denied. Super admin rights required.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>

      <form onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Plan Name"
            value={editingPlan ? editingPlan.name : newPlan.name}
            onChange={(e) => editingPlan ? setEditingPlan({...editingPlan, name: e.target.value}) : setNewPlan({...newPlan, name: e.target.value})}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={editingPlan ? editingPlan.price : newPlan.price}
            onChange={(e) => editingPlan ? setEditingPlan({...editingPlan, price: parseFloat(e.target.value)}) : setNewPlan({...newPlan, price: parseFloat(e.target.value)})}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <textarea
          placeholder="Description"
          value={editingPlan ? editingPlan.description : newPlan.description}
          onChange={(e) => editingPlan ? setEditingPlan({...editingPlan, description: e.target.value}) : setNewPlan({...newPlan, description: e.target.value})}
          className="mt-4 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        ></textarea>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          {(editingPlan ? editingPlan.features : newPlan.features).map((feature, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const updatedFeatures = [...(editingPlan ? editingPlan.features : newPlan.features)];
                  updatedFeatures[index] = e.target.value;
                  editingPlan ? setEditingPlan({...editingPlan, features: updatedFeatures}) : setNewPlan({...newPlan, features: updatedFeatures});
                }}
                className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const updatedFeatures = [...(editingPlan ? editingPlan.features : newPlan.features)];
                  updatedFeatures.splice(index, 1);
                  editingPlan ? setEditingPlan({...editingPlan, features: updatedFeatures}) : setNewPlan({...newPlan, features: updatedFeatures});
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => editingPlan ? setEditingPlan({...editingPlan, features: [...editingPlan.features, '']}) : setNewPlan({...newPlan, features: [...newPlan.features, '']})}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Add Feature
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          {editingPlan && (
            <button
              type="button"
              onClick={() => setEditingPlan(null)}
              className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {editingPlan ? 'Update Plan' : 'Create Plan'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <p className="text-2xl font-bold mb-4">${plan.price}/month</p>
            <ul className="mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setEditingPlan(plan)}
                className="mr-2 p-2 text-blue-500 hover:text-blue-700"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
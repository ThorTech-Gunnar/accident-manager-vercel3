import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Theme } from '../utils/theme';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Payment';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);

interface Franchise {
  _id: string;
  name: string;
  subscriptionStatus: 'active' | 'inactive' | 'pending';
  subscriptionEndDate: string;
  paymentMethod: string;
  theme: Theme;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
}

const FranchiseManagement: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedFranchise, setSelectedFranchise] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchFranchises();
      fetchSubscriptionPlans();
    }
  }, [isSuperAdmin]);

  const fetchFranchises = async () => {
    try {
      const response = await api.get('/franchises/list');
      setFranchises(response.data);
    } catch (error) {
      console.error('Error fetching franchises:', error);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await api.get('/subscription-plans');
      setSubscriptionPlans(response.data);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  // ... (keep existing functions like handleCreateFranchise, handleUpdateTheme, etc.)

  if (!isSuperAdmin) {
    return <div>Access denied. Super admin rights required.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Franchise Management</h1>
      
      {/* ... (keep existing franchise creation form) */}

      <h2 className="text-2xl font-bold mt-8 mb-4">Franchise List</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription End</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {franchises.map((franchise) => (
              <tr key={franchise._id}>
                <td className="px-6 py-4 whitespace-nowrap">{franchise.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{franchise.subscriptionStatus}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(franchise.subscriptionEndDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{franchise.paymentMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedFranchise(franchise._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Manage Subscription
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFranchise && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Manage Subscription</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Select a Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <h4 className="font-semibold">{plan.name}</h4>
                  <p className="text-gray-600">${plan.price}/month</p>
                </div>
              ))}
            </div>
            {selectedPlan && (
              <Elements stripe={stripePromise}>
                <Payment
                  planId={selectedPlan}
                  amount={subscriptionPlans.find((plan) => plan.id === selectedPlan)?.price || 0}
                />
              </Elements>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseManagement;
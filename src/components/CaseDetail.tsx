import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle, User, Calendar, FileText, Send, Download } from 'lucide-react';
import FileVideoUpload from './FileVideoUpload';
import { useNotification } from '../contexts/NotificationContext';
import { generateCasePDF } from '../utils/documentGenerator';
import api from '../utils/api';

interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'closed';
  createdAt: string;
  assignedTo: string;
  updates: Array<{ id: string; user: string; content: string; createdAt: string }>;
  files: Array<{ id: string; name: string; type: string; uploadedAt: string; uploadedBy: string }>;
  floorPlanId?: string;
  incidentLocation?: { x: number; y: number };
}

interface FloorPlan {
  id: string;
  name: string;
  imageUrl: string;
}

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [case_, setCase] = useState<Case | null>(null);
  const [newUpdate, setNewUpdate] = useState('');
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<string | null>(null);
  const [incidentLocation, setIncidentLocation] = useState<{ x: number; y: number } | null>(null);
  const floorPlanRef = useRef<HTMLImageElement>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchCase();
    fetchFloorPlans();
  }, [id]);

  const fetchCase = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      setCase(response.data);
      setSelectedFloorPlan(response.data.floorPlanId || null);
      setIncidentLocation(response.data.incidentLocation || null);
    } catch (error) {
      console.error('Error fetching case:', error);
      addNotification('Error fetching case details', 'error');
    }
  };

  const fetchFloorPlans = async () => {
    try {
      const response = await api.get('/floor-plans');
      setFloorPlans(response.data);
    } catch (error) {
      console.error('Error fetching floor plans:', error);
    }
  };

  // ... (keep existing functions like handleStatusChange, handleAddUpdate, handleExportCase, etc.)

  const handleFloorPlanClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!floorPlanRef.current) return;

    const rect = floorPlanRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setIncidentLocation({ x, y });
  };

  const handleSaveIncidentLocation = async () => {
    if (!case_ || !selectedFloorPlan || !incidentLocation) return;

    try {
      await api.put(`/cases/${case_.id}`, {
        floorPlanId: selectedFloorPlan,
        incidentLocation,
      });
      addNotification('Incident location saved successfully', 'success');
    } catch (error) {
      console.error('Error saving incident location:', error);
      addNotification('Error saving incident location', 'error');
    }
  };

  if (!case_) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (keep existing JSX for case details) */}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Floor Plan</h3>
        <select
          value={selectedFloorPlan || ''}
          onChange={(e) => setSelectedFloorPlan(e.target.value || null)}
          className="mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a floor plan</option>
          {floorPlans.map((floorPlan) => (
            <option key={floorPlan.id} value={floorPlan.id}>
              {floorPlan.name}
            </option>
          ))}
        </select>
        {selectedFloorPlan && (
          <div className="relative">
            <img
              ref={floorPlanRef}
              src={floorPlans.find((fp) => fp.id === selectedFloorPlan)?.imageUrl}
              alt="Floor Plan"
              className="w-full h-auto"
              onClick={handleFloorPlanClick}
            />
            {incidentLocation && (
              <div
                className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${incidentLocation.x * 100}%`,
                  top: `${incidentLocation.y * 100}%`,
                }}
              ></div>
            )}
          </div>
        )}
        <button
          onClick={handleSaveIncidentLocation}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={!selectedFloorPlan || !incidentLocation}
        >
          Save Incident Location
        </button>
      </div>

      {/* ... (keep existing JSX for case updates, etc.) */}
    </div>
  );
};

export default CaseDetail;
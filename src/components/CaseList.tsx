import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';

interface Case {
  id: string;
  title: string;
  status: 'open' | 'in progress' | 'closed';
  createdAt: string;
}

const CaseList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [casesPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [newCase, setNewCase] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  useEffect(() => {
    let result = cases;
    if (statusFilter !== 'all') {
      result = result.filter(case_ => case_.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(case_ => 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCases(result);
    setCurrentPage(1);
  }, [cases, statusFilter, searchTerm]);

  const getStatusIcon = (status: Case['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="text-yellow-500" />;
      case 'in progress':
        return <Clock className="text-orange-500" />;
      case 'closed':
        return <CheckCircle className="text-green-500" />;
    }
  };

  // Get current cases
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/cases', newCase);
      setCases([response.data, ...cases]);
      setIsCreatingCase(false);
      setNewCase({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsCreatingCase(true)}
            className="btn btn-primary"
          >
            <Plus className="inline-block mr-2" size={18} />
            Create New Case
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-2 md:mb-0">
                <label htmlFor="status-filter" className="mr-2">Filter by status:</label>
                <select
                  id="status-filter"
                  className="input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cases..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentCases.map((case_) => (
                    <tr key={case_.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          {getStatusIcon(case_.status)}
                          <span className="ml-2 text-gray-900 capitalize">{case_.status}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{case_.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(case_.createdAt).toLocaleString()}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link to={`/cases/${case_.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View<span className="sr-only">, {case_.title}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstCase + 1}</span> to <span className="font-medium">{Math.min(indexOfLastCase, filteredCases.length)}</span> of{' '}
            <span className="font-medium">{filteredCases.length}</span> results
          </p>
        </div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {Array.from({ length: Math.ceil(filteredCases.length / casesPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === index + 1
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredCases.length / casesPerPage)}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
      {isCreatingCase && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Case</h3>
              <form onSubmit={handleCreateCase} className="mt-2 text-left">
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="input"
                    value={newCase.title}
                    onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={newCase.description}
                    onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCase(false)}
                    className="btn btn-secondary mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Case
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseList;
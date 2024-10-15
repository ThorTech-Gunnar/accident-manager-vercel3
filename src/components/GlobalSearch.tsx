import React, { useState, useEffect } from 'react';
import { Search, User, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'case' | 'user';
  title: string;
  subtitle: string;
}

const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setIsSearching(true);
        // In a real application, this would be an API call
        const mockSearch = async () => {
          // Simulating API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          const results: SearchResult[] = [
            { id: '1', type: 'case', title: 'Server Outage', subtitle: 'Open' },
            { id: '2', type: 'case', title: 'Network Issues', subtitle: 'In Progress' },
            { id: '3', type: 'user', title: 'John Doe', subtitle: 'Staff' },
            { id: '4', type: 'user', title: 'Jane Smith', subtitle: 'Manager' },
          ].filter(result => 
            result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
          );

          setSearchResults(results);
          setIsSearching(false);
        };

        mockSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search cases and users..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
      {searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((result) => (
                <li key={result.id} className="border-b last:border-b-0">
                  <Link
                    to={result.type === 'case' ? `/cases/${result.id}` : `/users/${result.id}`}
                    className="flex items-center p-4 hover:bg-gray-50"
                  >
                    {result.type === 'case' ? (
                      <FileText className="mr-3 text-blue-500" size={20} />
                    ) : (
                      <User className="mr-3 text-green-500" size={20} />
                    )}
                    <div>
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-gray-500">{result.subtitle}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
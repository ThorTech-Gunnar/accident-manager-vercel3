import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const NotificationDropdown: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRemoveNotification = (id: string) => {
    removeNotification(id);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="px-4 py-2 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <button
                      onClick={() => handleRemoveNotification(notification.id)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
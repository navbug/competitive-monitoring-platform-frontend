import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Loading, { SkeletonCard } from '../components/Loading';
import { IMPACT_LEVELS } from '../utils/constants';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = filter === 'unread' ? '?read=false' : '';
      const response = await api.get(`/notifications${params}`);
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      toast.success('Marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      setMarkingAll(true);
      await api.put('/notifications/read-all');
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            High-impact competitor updates
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={markingAll}
            className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCheck size={20} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'unread'
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'unread' 
              ? 'No unread notifications'
              : 'No notifications yet'
            }
          </h3>
          <p className="text-gray-600">
            {filter === 'unread'
              ? 'All caught up! Check back later for new updates.'
              : 'Notifications will appear here when important updates are detected'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`card transition-all duration-200 ${
                notification.status === 'new' 
                  ? 'border-l-4 border-l-blue-500 bg-blue-50/50 hover:bg-blue-50' 
                  : 'border-l-4 border-l-transparent hover:shadow-lg'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">
                    {notification.competitor?.name}
                  </h3>
                  <span className={`badge ${IMPACT_LEVELS[notification.classification.impactLevel]?.class || 'badge-low'}`}>
                    {notification.classification.impactLevel}
                  </span>
                  <span className="badge badge-low">
                    {notification.classification.category.replace('_', ' ')}
                  </span>
                  {notification.status === 'new' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
                      NEW
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {format(new Date(notification.detectedAt), 'MMM dd, HH:mm')}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {notification.title}
              </h4>

              {/* Summary */}
              {notification.summary && (
                <p className="text-gray-600 mb-4">{notification.summary}</p>
              )}

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  {notification.source?.url && (
                    <a
                      href={notification.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group/link transition-colors"
                    >
                      <span className="group-hover/link:underline">View Source</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {notification.status === 'new' && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="btn btn-secondary text-sm flex items-center gap-2 self-start sm:self-auto"
                  >
                    <Check size={16} />
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
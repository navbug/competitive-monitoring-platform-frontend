import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { TrendingUp, Users, Activity } from 'lucide-react';
import { format } from 'date-fns';

const Trends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trends');
      setTrends(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch trends');
    } finally {
      setLoading(false);
    }
  };

  const getSignificanceColor = (significance) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800'
    };
    return colors[significance] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      emerging: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      declining: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trends & Patterns</h1>
        <p className="text-gray-600 mt-1">
          AI-detected patterns across competitive landscape
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : trends.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No trends detected yet. Trends will appear as we gather more data.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {trends.map((trend) => (
            <div key={trend._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getStatusColor(trend.status)}`}>
                      {trend.status}
                    </span>
                    <span className={`badge ${getSignificanceColor(trend.significance)}`}>
                      {trend.significance} significance
                    </span>
                    {trend.category && (
                      <span className="badge badge-low">{trend.category}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {trend.pattern}
                  </h3>
                  {trend.description && (
                    <p className="text-gray-600">{trend.description}</p>
                  )}
                </div>
              </div>

              {trend.insights && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900">
                    <strong>Insights:</strong> {trend.insights}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Competitors</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {trend.affectedCompetitors?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Related Updates</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {trend.relatedUpdates?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Frequency</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {trend.frequency?.count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  First seen: {format(new Date(trend.timeframe.firstSeen), 'MMM dd, yyyy')}
                  {' · '}
                  Last seen: {format(new Date(trend.timeframe.lastSeen), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trends;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Plus, Search, ExternalLink, Edit, Trash2, Globe } from 'lucide-react';
import AddCompetitorModal from '../components/AddCompetitorModel';

const Competitors = () => {
  const [competitors, setCompetitors] = useState([]);
  const [filteredCompetitors, setFilteredCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompetitors();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = competitors.filter(comp =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompetitors(filtered);
    } else {
      setFilteredCompetitors(competitors);
    }
  }, [searchQuery, competitors]);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/competitors');
      setCompetitors(response.data.data);
      setFilteredCompetitors(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch competitors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await api.delete(`/competitors/${id}`);
      toast.success('Competitor deleted successfully');
      fetchCompetitors();
    } catch (error) {
      toast.error('Failed to delete competitor');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.active;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors.medium;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Competitors</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor your competitors
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Competitor
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search competitors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Competitors Grid */}
      {filteredCompetitors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'No competitors found' : 'No competitors added yet'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Add Your First Competitor
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitors.map((competitor) => (
            <div
              key={competitor._id}
              className="card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/competitors/${competitor._id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {competitor.name}
                  </h3>
                  {competitor.industry && (
                    <p className="text-sm text-gray-600">{competitor.industry}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className={`badge ${getStatusColor(competitor.status)}`}>
                    {competitor.status}
                  </span>
                </div>
              </div>

              {competitor.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {competitor.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {competitor.website && (
                  <a
                    href={competitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Globe size={16} />
                    {competitor.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`badge ${getPriorityColor(competitor.monitoringConfig?.priority)}`}>
                    {competitor.monitoringConfig?.priority || 'medium'}
                  </span>
                  <span className="text-gray-500">
                    {competitor.metrics?.totalUpdates || 0} updates
                  </span>
                </div>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/competitors/${competitor._id}`)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(competitor._id, competitor.name)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Competitor Modal */}
      {showModal && (
        <AddCompetitorModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchCompetitors();
          }}
        />
      )}
    </div>
  );
};

export default Competitors;
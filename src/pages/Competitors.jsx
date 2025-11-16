import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Search, Globe, Edit, Trash2, TrendingUp } from 'lucide-react';
import AddCompetitorModal from '../components/AddCompetitorModel';
import Loading, { SkeletonCard } from '../components/Loading';
import { ROUTES, PRIORITY_LEVELS, STATUS_TYPES } from '../utils/constants';

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
      const comps = response.data.data;
      
      // Get actual update counts for each competitor
      const competitorsWithCounts = await Promise.all(
        comps.map(async (comp) => {
          try {
            const countResponse = await api.get(`/updates?competitor=${comp._id}&limit=1`);
            return {
              ...comp,
              actualUpdateCount: countResponse.data.total || 0
            };
          } catch (error) {
            return {
              ...comp,
              actualUpdateCount: 0
            };
          }
        })
      );
      
      setCompetitors(competitorsWithCounts);
      setFilteredCompetitors(competitorsWithCounts);
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

  const getPriorityClass = (priority) => {
    return PRIORITY_LEVELS.find(p => p.value === priority)?.color || 'badge-low';
  };

  const getStatusClass = (status) => {
    return STATUS_TYPES[status] || STATUS_TYPES.active;
  };

  if (loading && competitors.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
            Competitors
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage and monitor your competitors
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span>Add Competitor</span>
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Competitors Grid */}
      {filteredCompetitors.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No competitors found' : 'No competitors yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Start by adding your first competitor to monitor'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Your First Competitor
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitors.map((competitor) => (
            <div
              key={competitor._id}
              className="card-hover group"
              onClick={() => navigate(`${ROUTES.COMPETITORS}/${competitor._id}`)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                    {competitor.name}
                  </h3>
                  {competitor.industry && (
                    <p className="text-sm text-gray-600 truncate">{competitor.industry}</p>
                  )}
                </div>
                <span className={`badge ${getStatusClass(competitor.status)} shrink-0 ml-2`}>
                  {competitor.status}
                </span>
              </div>

              {/* Description */}
              {competitor.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {competitor.description}
                </p>
              )}

              {/* Website */}
              {competitor.website && (
                <a
                  href={competitor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4 transition-colors group/link"
                >
                  <Globe size={16} className="shrink-0" />
                  <span className="truncate group-hover/link:underline">
                    {competitor.website.replace(/^https?:\/\//, '')}
                  </span>
                </a>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`badge ${getPriorityClass(competitor.monitoringConfig?.priority)}`}>
                    {competitor.monitoringConfig?.priority || 'medium'}
                  </span>
                  <span className="text-gray-500">
                    {competitor.actualUpdateCount || 0} updates
                  </span>
                </div>

                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`${ROUTES.COMPETITORS}/${competitor._id}`)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(competitor._id, competitor.name)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
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
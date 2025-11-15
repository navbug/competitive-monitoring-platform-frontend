// import { useState, useEffect } from 'react';
// import api from '../utils/api';
// import { toast } from 'react-toastify';
// import { Filter, ExternalLink, Calendar } from 'lucide-react';
// import { format } from 'date-fns';

// const Updates = () => {
//   const [updates, setUpdates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     category: '',
//     impactLevel: '',
//     status: ''
//   });

//   useEffect(() => {
//     fetchUpdates();
//   }, [filters]);

//   const fetchUpdates = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (filters.category) params.append('category', filters.category);
//       if (filters.impactLevel) params.append('impactLevel', filters.impactLevel);
//       if (filters.status) params.append('status', filters.status);
      
//       const response = await api.get(`/updates?${params.toString()}`);
//       setUpdates(response.data.data);
//     } catch (error) {
//       toast.error('Failed to fetch updates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsReviewed = async (id) => {
//     try {
//       await api.put(`/updates/${id}/status`, { status: 'reviewed' });
//       fetchUpdates();
//     } catch (error) {
//       toast.error('Failed to update status');
//     }
//   };

//   const getImpactBadgeClass = (impact) => {
//     const classes = {
//       low: 'badge-low',
//       medium: 'badge-medium',
//       high: 'badge-high',
//       critical: 'badge-critical'
//     };
//     return classes[impact] || 'badge-low';
//   };

//   return (
//     <div className="p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Updates Feed</h1>
//         <p className="text-gray-600 mt-1">All competitor activity in one place</p>
//       </div>

//       {/* Filters */}
//       <div className="card mb-6">
//         <div className="flex items-center gap-4 flex-wrap">
//           <div className="flex items-center gap-2">
//             <Filter size={20} className="text-gray-500" />
//             <span className="font-medium text-gray-700">Filters:</span>
//           </div>

//           <select
//             value={filters.category}
//             onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//             className="input w-auto"
//           >
//             <option value="">All Categories</option>
//             <option value="pricing">Pricing</option>
//             <option value="feature_release">Feature Release</option>
//             <option value="integration">Integration</option>
//             <option value="blog_post">Blog Post</option>
//             <option value="case_study">Case Study</option>
//             <option value="webinar">Webinar</option>
//             <option value="product_update">Product Update</option>
//           </select>

//           <select
//             value={filters.impactLevel}
//             onChange={(e) => setFilters({ ...filters, impactLevel: e.target.value })}
//             className="input w-auto"
//           >
//             <option value="">All Impact Levels</option>
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//             <option value="critical">Critical</option>
//           </select>

//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="input w-auto"
//           >
//             <option value="">All Status</option>
//             <option value="new">New</option>
//             <option value="reviewed">Reviewed</option>
//           </select>

//           <button
//             onClick={() => setFilters({ category: '', impactLevel: '', status: '' })}
//             className="btn btn-secondary text-sm"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Updates List */}
//       {loading ? (
//         <div className="space-y-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="card animate-pulse">
//               <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//               <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//             </div>
//           ))}
//         </div>
//       ) : updates.length === 0 ? (
//         <div className="card text-center py-12">
//           <p className="text-gray-500">No updates found</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {updates.map((update) => (
//             <div key={update._id} className="card hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <h3 className="font-semibold text-gray-900">
//                     {update.competitor?.name}
//                   </h3>
//                   <span className={`badge ${getImpactBadgeClass(update.classification.impactLevel)}`}>
//                     {update.classification.impactLevel}
//                   </span>
//                   <span className="badge badge-low">
//                     {update.classification.category}
//                   </span>
//                   {update.classification.tags.map((tag, idx) => (
//                     <span key={idx} className="badge badge-low text-xs">
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-500">
//                   <Calendar size={16} />
//                   {format(new Date(update.detectedAt), 'MMM dd, HH:mm')}
//                 </div>
//               </div>

//               <h4 className="text-lg font-medium text-gray-900 mb-2">
//                 {update.title}
//               </h4>

//               {update.summary && (
//                 <p className="text-gray-600 mb-3">{update.summary}</p>
//               )}

//               <div className="flex items-center justify-between pt-3 border-t border-gray-200">
//                 <div className="flex items-center gap-2">
//                   {update.source?.url && (
//                     <a
//                       href={update.source.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
//                     >
//                       View Source <ExternalLink size={14} />
//                     </a>
//                   )}
//                   {update.sentiment && (
//                     <span className="text-sm text-gray-500">
//                       · Sentiment: {update.sentiment}
//                     </span>
//                   )}
//                 </div>

//                 {update.status === 'new' && (
//                   <button
//                     onClick={() => markAsReviewed(update._id)}
//                     className="btn btn-secondary text-sm"
//                   >
//                     Mark as Reviewed
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Updates;




import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Filter, ExternalLink, Calendar, Activity, X } from 'lucide-react';
import { format } from 'date-fns';
import Loading, { SkeletonCard } from '../components/Loading';
import { UPDATE_CATEGORIES, IMPACT_LEVELS } from '../utils/constants';

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    impactLevel: '',
    status: ''
  });

  useEffect(() => {
    fetchUpdates();
  }, [filters]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.impactLevel) params.append('impactLevel', filters.impactLevel);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/updates?${params.toString()}`);
      setUpdates(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  const markAsReviewed = async (id) => {
    try {
      await api.put(`/updates/${id}/status`, { status: 'reviewed' });
      toast.success('Update marked as reviewed');
      fetchUpdates();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', impactLevel: '', status: '' });
  };

  const hasActiveFilters = filters.category || filters.impactLevel || filters.status;

  if (loading && updates.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
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
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Updates Feed
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          All competitor activity in one place
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-700">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-3 flex-1">
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input w-auto min-w-[160px]"
            >
              <option value="">All Categories</option>
              {UPDATE_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Impact Level Filter */}
            <select
              value={filters.impactLevel}
              onChange={(e) => setFilters({ ...filters, impactLevel: e.target.value })}
              className="input w-auto min-w-[160px]"
            >
              <option value="">All Impact Levels</option>
              {Object.entries(IMPACT_LEVELS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input w-auto min-w-[160px]"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-secondary text-sm flex items-center gap-2"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Updates List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : updates.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No updates found
          </h3>
          <p className="text-gray-600">
            {hasActiveFilters 
              ? 'Try adjusting your filters' 
              : 'Updates will appear here as they are detected'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <div 
              key={update._id} 
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {update.competitor?.name}
                  </h3>
                  <span className={`badge ${IMPACT_LEVELS[update.classification.impactLevel]?.class || 'badge-low'}`}>
                    {update.classification.impactLevel}
                  </span>
                  <span className="badge badge-low">
                    {update.classification.category.replace('_', ' ')}
                  </span>
                  {update.classification.tags.map((tag, idx) => (
                    <span key={idx} className="badge badge-low text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  {format(new Date(update.detectedAt), 'MMM dd, HH:mm')}
                </div>
              </div>

              {/* Title */}
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {update.title}
              </h4>

              {/* Summary */}
              {update.summary && (
                <p className="text-gray-600 mb-4">{update.summary}</p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  {update.source?.url && (
                    <a
                      href={update.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group/link transition-colors"
                    >
                      <span className="group-hover/link:underline">View Source</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {update.sentiment && (
                    <span className="text-sm text-gray-500">
                      Sentiment: <span className="font-medium">{update.sentiment}</span>
                    </span>
                  )}
                </div>

                {update.status === 'new' && (
                  <button
                    onClick={() => markAsReviewed(update._id)}
                    className="btn btn-secondary text-sm"
                  >
                    Mark as Reviewed
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

export default Updates;
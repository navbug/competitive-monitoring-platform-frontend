// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../utils/api';
// import { toast } from 'react-toastify';
// import { 
//   ArrowLeft, 
//   Globe, 
//   Edit, 
//   Save, 
//   X,
//   Calendar,
//   Activity,
//   TrendingUp,
//   AlertCircle,
//   RefreshCw
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const CompetitorDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [competitor, setCompetitor] = useState(null);
//   const [recentUpdates, setRecentUpdates] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [triggering, setTriggering] = useState(false);

//   useEffect(() => {
//     fetchCompetitorDetails();
//   }, [id]);

//   const fetchCompetitorDetails = async () => {
//     try {
//       setLoading(true);
      
//       const [competitorRes, statsRes] = await Promise.all([
//         api.get(`/competitors/${id}`),
//         api.get(`/competitors/${id}/stats`)
//       ]);

//       setCompetitor(competitorRes.data.data.competitor);
//       setRecentUpdates(competitorRes.data.data.recentUpdates);
//       setStats(statsRes.data.data);
//       setEditData(competitorRes.data.data.competitor);
//     } catch (error) {
//       toast.error('Failed to fetch competitor details');
//       navigate('/competitors');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await api.put(`/competitors/${id}`, editData);
//       toast.success('Competitor updated successfully');
//       setEditing(false);
//       fetchCompetitorDetails();
//     } catch (error) {
//       toast.error('Failed to update competitor');
//     }
//   };

//   const handleTriggerScrape = async () => {
//     try {
//       setTriggering(true);
//       await api.post(`/competitors/${id}/scrape`);
//       toast.success('Scraping triggered! Check updates in 1-2 minutes');
//     } catch (error) {
//       toast.error('Failed to trigger scraping');
//     } finally {
//       setTriggering(false);
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

//   if (loading) {
//     return (
//       <div className="p-8">
//         <div className="animate-pulse space-y-4">
//           <div className="h-12 bg-gray-200 rounded w-1/3"></div>
//           <div className="h-64 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!competitor) return null;

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <button
//           onClick={() => navigate('/competitors')}
//           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
//         >
//           <ArrowLeft size={20} />
//           Back to Competitors
//         </button>

//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             {editing ? (
//               <input
//                 type="text"
//                 value={editData.name}
//                 onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//                 className="input text-3xl font-bold mb-2"
//               />
//             ) : (
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 {competitor.name}
//               </h1>
//             )}
            
//             {editing ? (
//               <input
//                 type="text"
//                 value={editData.industry || ''}
//                 onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
//                 className="input"
//                 placeholder="Industry"
//               />
//             ) : (
//               competitor.industry && (
//                 <p className="text-gray-600">{competitor.industry}</p>
//               )
//             )}
//           </div>

//           <div className="flex gap-2">
//             {editing ? (
//               <>
//                 <button onClick={handleSave} className="btn btn-primary flex items-center gap-2">
//                   <Save size={20} />
//                   Save
//                 </button>
//                 <button onClick={() => setEditing(false)} className="btn btn-secondary">
//                   <X size={20} />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button 
//                   onClick={handleTriggerScrape}
//                   disabled={triggering}
//                   className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
//                 >
//                   <RefreshCw size={20} className={triggering ? 'animate-spin' : ''} />
//                   {triggering ? 'Scraping...' : 'Scrape Now'}
//                 </button>
//                 <button onClick={() => setEditing(true)} className="btn btn-secondary flex items-center gap-2">
//                   <Edit size={20} />
//                   Edit
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Updates</p>
//               <p className="text-3xl font-bold text-gray-900 mt-1">
//                 {stats?.totalUpdates || 0}
//               </p>
//             </div>
//             <Activity className="text-primary-600" size={24} />
//           </div>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Last Update</p>
//               <p className="text-sm font-medium text-gray-900 mt-1">
//                 {competitor.metrics?.lastUpdateDetected 
//                   ? format(new Date(competitor.metrics.lastUpdateDetected), 'MMM dd, yyyy')
//                   : 'No updates yet'
//                 }
//               </p>
//             </div>
//             <Calendar className="text-green-600" size={24} />
//           </div>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Monitoring</p>
//               <p className="text-sm font-medium text-gray-900 mt-1">
//                 {competitor.monitoringConfig?.enabled ? 'Active' : 'Paused'}
//               </p>
//             </div>
//             <TrendingUp className="text-blue-600" size={24} />
//           </div>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Priority</p>
//               <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
//                 {competitor.monitoringConfig?.priority || 'Medium'}
//               </p>
//             </div>
//             <AlertCircle className="text-orange-600" size={24} />
//           </div>
//         </div>
//       </div>

//       {/* Info & Stats */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Info Card */}
//         <div className="lg:col-span-2 card">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Information</h2>
          
//           <div className="space-y-4">
//             {competitor.website && (
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Website</label>
//                 <a
//                   href={competitor.website}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mt-1"
//                 >
//                   <Globe size={16} />
//                   {competitor.website}
//                 </a>
//               </div>
//             )}

//             {editing ? (
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Description</label>
//                 <textarea
//                   value={editData.description || ''}
//                   onChange={(e) => setEditData({ ...editData, description: e.target.value })}
//                   className="input mt-1"
//                   rows="4"
//                 />
//               </div>
//             ) : (
//               competitor.description && (
//                 <div>
//                   <label className="text-sm font-medium text-gray-600">Description</label>
//                   <p className="text-gray-900 mt-1">{competitor.description}</p>
//                 </div>
//               )
//             )}

//             <div>
//               <label className="text-sm font-medium text-gray-600">Monitored Channels</label>
//               <div className="mt-2 space-y-2">
//                 {competitor.monitoredChannels?.websitePages?.length > 0 && (
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">Website Pages ({competitor.monitoredChannels.websitePages.length})</p>
//                     <ul className="text-sm text-gray-600 ml-4 list-disc">
//                       {competitor.monitoredChannels.websitePages.map((page, idx) => (
//                         <li key={idx}>{page.type}: {page.url}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//                 {competitor.monitoredChannels?.rssFeeds?.length > 0 && (
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">RSS Feeds ({competitor.monitoredChannels.rssFeeds.length})</p>
//                     <ul className="text-sm text-gray-600 ml-4 list-disc">
//                       {competitor.monitoredChannels.rssFeeds.map((feed, idx) => (
//                         <li key={idx}>{feed.url}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Chart */}
//         <div className="card">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Updates by Category</h2>
//           {stats?.byCategory && stats.byCategory.length > 0 ? (
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={stats.byCategory}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#0ea5e9" />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className="text-gray-500 text-center py-8">No data yet</p>
//           )}
//         </div>
//       </div>

//       {/* Recent Updates */}
//       <div className="card">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Updates</h2>
        
//         {recentUpdates.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No updates yet</p>
//         ) : (
//           <div className="space-y-4">
//             {recentUpdates.map((update) => (
//               <div key={update._id} className="border-b border-gray-200 pb-4 last:border-0">
//                 <div className="flex items-start justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <span className={`badge ${getImpactBadgeClass(update.classification.impactLevel)}`}>
//                       {update.classification.impactLevel}
//                     </span>
//                     <span className="badge badge-low">
//                       {update.classification.category}
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     {format(new Date(update.detectedAt), 'MMM dd, HH:mm')}
//                   </span>
//                 </div>
//                 <h3 className="font-medium text-gray-900 mb-1">{update.title}</h3>
//                 {update.summary && (
//                   <p className="text-sm text-gray-600">{update.summary}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompetitorDetail;



import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Globe, 
  Edit, 
  Save, 
  X,
  Calendar,
  Activity,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Loading, { SkeletonCard } from '../components/Loading';
import { ROUTES, IMPACT_LEVELS } from '../utils/constants';

const CompetitorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competitor, setCompetitor] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchCompetitorDetails();
  }, [id]);

  const fetchCompetitorDetails = async () => {
    try {
      setLoading(true);
      
      const [competitorRes, statsRes] = await Promise.all([
        api.get(`/competitors/${id}`),
        api.get(`/competitors/${id}/stats`)
      ]);

      setCompetitor(competitorRes.data.data.competitor);
      setRecentUpdates(competitorRes.data.data.recentUpdates);
      setStats(statsRes.data.data);
      setEditData(competitorRes.data.data.competitor);
    } catch (error) {
      toast.error('Failed to fetch competitor details');
      navigate(ROUTES.COMPETITORS);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/competitors/${id}`, editData);
      toast.success('Competitor updated successfully');
      setEditing(false);
      fetchCompetitorDetails();
    } catch (error) {
      toast.error('Failed to update competitor');
    }
  };

  const handleTriggerScrape = async () => {
    try {
      setTriggering(true);
      await api.post(`/competitors/${id}/scrape`);
      toast.success('Scraping triggered! Check updates in 1-2 minutes');
    } catch (error) {
      toast.error('Failed to trigger scraping');
    } finally {
      setTriggering(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!competitor) return null;

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={color} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(ROUTES.COMPETITORS)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Competitors</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="input text-2xl font-bold mb-2"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {competitor.name}
              </h1>
            )}
            
            {editing ? (
              <input
                type="text"
                value={editData.industry || ''}
                onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                className="input max-w-md"
                placeholder="Industry"
              />
            ) : (
              competitor.industry && (
                <p className="text-gray-600">{competitor.industry}</p>
              )
            )}
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <button 
                  onClick={handleSave} 
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Save size={20} />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button 
                  onClick={() => setEditing(false)} 
                  className="btn btn-secondary"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleTriggerScrape}
                  disabled={triggering}
                  className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={20} className={triggering ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">
                    {triggering ? 'Scraping...' : 'Scrape Now'}
                  </span>
                </button>
                <button 
                  onClick={() => setEditing(true)} 
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Edit size={20} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Updates"
          value={stats?.totalUpdates || 0}
          icon={Activity}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Last Update"
          value={
            competitor.metrics?.lastUpdateDetected 
              ? format(new Date(competitor.metrics.lastUpdateDetected), 'MMM dd, yyyy')
              : 'No updates yet'
          }
          icon={Calendar}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Monitoring"
          value={competitor.monitoringConfig?.enabled ? 'Active' : 'Paused'}
          icon={TrendingUp}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          title="Priority"
          value={competitor.monitoringConfig?.priority || 'Medium'}
          icon={AlertCircle}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Info & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Information</h2>
          
          <div className="space-y-6">
            {competitor.website && (
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Website
                </label>
                <a
                  href={competitor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 group"
                >
                  <Globe size={18} />
                  <span className="group-hover:underline">{competitor.website}</span>
                </a>
              </div>
            )}

            {editing ? (
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Description
                </label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="input"
                  rows="4"
                />
              </div>
            ) : (
              competitor.description && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Description
                  </label>
                  <p className="text-gray-900">{competitor.description}</p>
                </div>
              )
            )}

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-3 block">
                Monitored Channels
              </label>
              <div className="space-y-4">
                {competitor.monitoredChannels?.websitePages?.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Website Pages ({competitor.monitoredChannels.websitePages.length})
                    </p>
                    <ul className="space-y-2">
                      {competitor.monitoredChannels.websitePages.map((page, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                          <span className="badge badge-low">{page.type}</span>
                          <span className="truncate">{page.url}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {competitor.monitoredChannels?.rssFeeds?.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      RSS Feeds ({competitor.monitoredChannels.rssFeeds.length})
                    </p>
                    <ul className="space-y-2">
                      {competitor.monitoredChannels.rssFeeds.map((feed, idx) => (
                        <li key={idx} className="text-sm text-gray-700 truncate">
                          {feed.url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Updates by Category</h2>
          {stats?.byCategory && stats.byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="_id" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  style={{ fontSize: '12px' }}
                />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Updates</h2>
        
        {recentUpdates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No updates yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentUpdates.map((update) => (
              <div 
                key={update._id} 
                className="border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 -mx-6 px-6 py-4 transition-colors rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge ${IMPACT_LEVELS[update.classification.impactLevel]?.class || 'badge-low'}`}>
                      {update.classification.impactLevel}
                    </span>
                    <span className="badge badge-low">
                      {update.classification.category}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {format(new Date(update.detectedAt), 'MMM dd, HH:mm')}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{update.title}</h3>
                {update.summary && (
                  <p className="text-sm text-gray-600">{update.summary}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitorDetail;
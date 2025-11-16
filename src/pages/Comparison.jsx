import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { GitCompare, TrendingUp, DollarSign, Zap, ExternalLink } from 'lucide-react';
import Loading, { SkeletonCard } from '../components/Loading';

const Comparison = () => {
  const [competitors, setCompetitors] = useState([]);
  const [updates, setUpdates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const competitorsRes = await api.get('/competitors');
      const comps = competitorsRes.data.data;
      setCompetitors(comps);

      const updatesData = {};
      for (const comp of comps) {
        const res = await api.get(`/updates?competitor=${comp._id}&limit=5`);
        updatesData[comp._id] = res.data.data;
      }
      setUpdates(updatesData);

    } catch (error) {
      toast.error('Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryUpdates = (competitorId, categories) => {
    return updates[competitorId]?.filter(u => 
      categories.includes(u.classification.category)
    ) || [];
  };

  const getActivityLevel = (totalUpdates) => {
    if (totalUpdates > 3) return { label: 'High', class: 'text-green-600' };
    if (totalUpdates > 1) return { label: 'Medium', class: 'text-yellow-600' };
    return { label: 'Low', class: 'text-gray-400' };
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="h-10 bg-gray-200 rounded w-64 animate-pulse mb-6"></div>
        <SkeletonCard />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Side-by-Side Comparison
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Compare recent activities across all PM tools
        </p>
      </div>

      {/* Comparison Table */}
      <div className="card overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50 rounded-tl-xl">
                  Feature
                </th>
                {competitors.map(comp => (
                  <th 
                    key={comp._id} 
                    className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50 first:rounded-tl-xl last:rounded-tr-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">{comp.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Pricing Updates */}
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign size={18} className="text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">Recent Pricing Changes</span>
                  </div>
                </td>
                {competitors.map(comp => {
                  const pricing = getCategoryUpdates(comp._id, ['pricing']);
                  return (
                    <td key={comp._id} className="py-4 px-4">
                      {pricing.length > 0 ? (
                        <div className="space-y-2">
                          {pricing.slice(0, 1).map(update => (
                            <div key={update._id} className="text-sm">
                              <p className="text-gray-700 font-medium line-clamp-2">
                                {update.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No recent changes</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Feature Updates */}
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Zap size={18} className="text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-900">Latest Features</span>
                  </div>
                </td>
                {competitors.map(comp => {
                  const features = getCategoryUpdates(comp._id, ['feature_release', 'product_update']);
                  return (
                    <td key={comp._id} className="py-4 px-4">
                      {features.length > 0 ? (
                        <div className="space-y-2">
                          {features.slice(0, 2).map(update => (
                            <div key={update._id} className="text-sm">
                              <p className="text-gray-700 font-medium line-clamp-2">
                                {update.title}
                              </p>
                            </div>
                          ))}
                          {features.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{features.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No recent features</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Integration Updates */}
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <GitCompare size={18} className="text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">New Integrations</span>
                  </div>
                </td>
                {competitors.map(comp => {
                  const integrations = getCategoryUpdates(comp._id, ['integration']);
                  return (
                    <td key={comp._id} className="py-4 px-4">
                      {integrations.length > 0 ? (
                        <div className="space-y-2">
                          {integrations.slice(0, 2).map(update => (
                            <div key={update._id} className="text-sm">
                              <p className="text-gray-700 font-medium line-clamp-2">
                                {update.title}
                              </p>
                            </div>
                          ))}
                          {integrations.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{integrations.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No recent integrations</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Activity Level */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={18} className="text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">Activity Level (Last 7 days)</span>
                  </div>
                </td>
                {competitors.map(comp => {
                  const totalUpdates = updates[comp._id]?.length || 0;
                  const activity = getActivityLevel(totalUpdates);
                  
                  return (
                    <td key={comp._id} className="py-4 px-4">
                      <div>
                        <span className={`font-semibold ${activity.class}`}>
                          {activity.label}
                        </span>
                        <p className="text-sm text-gray-600">{totalUpdates} updates</p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitors.map(comp => {
            const compUpdates = updates[comp._id] || [];
            const pricingCount = compUpdates.filter(u => u.classification.category === 'pricing').length;
            const featureCount = compUpdates.filter(u => 
              u.classification.category === 'feature_release' || 
              u.classification.category === 'product_update'
            ).length;

            return (
              <div key={comp._id} className="card hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {comp.name}
                  </h3>
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Visit website"
                  >
                    <ExternalLink size={18} className="text-gray-600" />
                  </a>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Updates</span>
                    <span className="text-lg font-bold text-gray-900">
                      {compUpdates.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pricing Changes</span>
                    <span className="text-lg font-semibold text-green-600">
                      {pricingCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Feature Updates</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {featureCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Comparison;
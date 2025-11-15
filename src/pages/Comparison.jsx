import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { GitCompare, TrendingUp, DollarSign, Zap } from 'lucide-react';

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
      
      // Fetch all competitors
      const competitorsRes = await api.get('/competitors');
      const comps = competitorsRes.data.data;
      setCompetitors(comps);

      // Fetch recent updates for each
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

  const getPricingUpdates = (competitorId) => {
    return updates[competitorId]?.filter(u => u.classification.category === 'pricing') || [];
  };

  const getFeatureUpdates = (competitorId) => {
    return updates[competitorId]?.filter(u => 
      u.classification.category === 'feature_release' || 
      u.classification.category === 'product_update'
    ) || [];
  };

  const getIntegrationUpdates = (competitorId) => {
    return updates[competitorId]?.filter(u => u.classification.category === 'integration') || [];
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Side-by-Side Comparison</h1>
        <p className="text-gray-600 mt-1">Compare recent activities across all PM tools</p>
      </div>

      {/* Comparison Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
              {competitors.map(comp => (
                <th key={comp._id} className="text-left py-4 px-4 font-semibold text-gray-900">
                  {comp.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Pricing Updates */}
            <tr className="border-b border-gray-200">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-600" />
                  <span className="font-medium">Recent Pricing Changes</span>
                </div>
              </td>
              {competitors.map(comp => {
                const pricing = getPricingUpdates(comp._id);
                return (
                  <td key={comp._id} className="py-4 px-4">
                    {pricing.length > 0 ? (
                      <div className="space-y-2">
                        {pricing.slice(0, 2).map(update => (
                          <div key={update._id} className="text-sm">
                            <p className="text-gray-700 mt-1">{update.title}</p>
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
            <tr className="border-b border-gray-200 bg-gray-50">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-yellow-600" />
                  <span className="font-medium">Latest Features</span>
                </div>
              </td>
              {competitors.map(comp => {
                const features = getFeatureUpdates(comp._id);
                return (
                  <td key={comp._id} className="py-4 px-4">
                    {features.length > 0 ? (
                      <div className="space-y-2">
                        {features.slice(0, 2).map(update => (
                          <div key={update._id} className="text-sm">
                            <p className="text-gray-700 mt-1">{update.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No recent features</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Integration Updates */}
            <tr className="border-b border-gray-200">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <GitCompare size={20} className="text-blue-600" />
                  <span className="font-medium">New Integrations</span>
                </div>
              </td>
              {competitors.map(comp => {
                const integrations = getIntegrationUpdates(comp._id);
                return (
                  <td key={comp._id} className="py-4 px-4">
                    {integrations.length > 0 ? (
                      <div className="space-y-2">
                        {integrations.slice(0, 2).map(update => (
                          <div key={update._id} className="text-sm">
                            <p className="text-gray-700 mt-1">{update.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No recent integrations</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Activity Level */}
            <tr className="bg-gray-50">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-purple-600" />
                  <span className="font-medium">Activity Level (Last 7 days)</span>
                </div>
              </td>
              {competitors.map(comp => {
                const totalUpdates = updates[comp._id]?.length || 0;
                const activityLevel = totalUpdates > 3 ? 'High' : totalUpdates > 1 ? 'Medium' : 'Low';
                const colorClass = totalUpdates > 3 ? 'text-green-600' : totalUpdates > 1 ? 'text-yellow-600' : 'text-gray-400';
                
                return (
                  <td key={comp._id} className="py-4 px-4">
                    <div>
                      <span className={`font-medium ${colorClass}`}>{activityLevel}</span>
                      <p className="text-sm text-gray-600">{totalUpdates} updates</p>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {competitors.map(comp => {
          const compUpdates = updates[comp._id] || [];
          const pricingCount = compUpdates.filter(u => u.classification.category === 'pricing').length;
          const featureCount = compUpdates.filter(u => 
            u.classification.category === 'feature_release' || 
            u.classification.category === 'product_update'
          ).length;

          return (
            <div key={comp._id} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{comp.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Updates</span>
                  <span className="font-semibold text-gray-900">{compUpdates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pricing Changes</span>
                  <span className="font-semibold text-green-600">{pricingCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Feature Updates</span>
                  <span className="font-semibold text-blue-600">{featureCount}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Visit Website →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comparison;
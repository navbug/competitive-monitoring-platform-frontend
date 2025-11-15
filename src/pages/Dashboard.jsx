import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompetitors: 0,
    totalUpdates: 0,
    activeTrends: 0,
    criticalUpdates: 0
  });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch competitors
      const competitorsRes = await api.get('/competitors');
      
      // Fetch updates
      const updatesRes = await api.get('/updates?limit=10');
      
      // Fetch trends
      const trendsRes = await api.get('/trends?status=active');
      
      // Fetch stats
      const statsRes = await api.get('/updates/stats/overview');

      setStats({
        totalCompetitors: competitorsRes.data.count,
        totalUpdates: statsRes.data.data.total,
        activeTrends: trendsRes.data.count,
        criticalUpdates: statsRes.data.data.byImpact?.find(i => i._id === 'critical')?.count || 0
      });

      setRecentUpdates(updatesRes.data.data);
      setTimelineData(statsRes.data.data.timeline || []);
      
      // Process category data for pie chart
      const categoryMap = {};
      updatesRes.data.data.forEach(update => {
        const cat = update.classification.category;
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });
      setCategoryData(
        Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
      );

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getImpactBadgeClass = (impact) => {
    const classes = {
      low: 'badge-low',
      medium: 'badge-medium',
      high: 'badge-high',
      critical: 'badge-critical'
    };
    return classes[impact] || 'badge-low';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Project Management SaaS Competitive Intelligence</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Competitors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalCompetitors}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Updates</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalUpdates}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Trends</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.activeTrends}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Updates</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.criticalUpdates}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Timeline Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Updates by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Updates</h3>
        <div className="space-y-4">
          {recentUpdates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No updates yet</p>
          ) : (
            recentUpdates.map((update) => (
              <div key={update._id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {update.competitor?.name}
                      </span>
                      <span className={`badge ${getImpactBadgeClass(update.classification.impactLevel)}`}>
                        {update.classification.impactLevel}
                      </span>
                      <span className="badge badge-low">
                        {update.classification.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {update.title}
                    </h4>
                    {/* {update.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {update.summary}
                      </p>
                    )} */}
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    {format(new Date(update.detectedAt), 'MMM dd, HH:mm')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
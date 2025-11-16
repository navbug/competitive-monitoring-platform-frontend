import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Save, User, Bell, Filter, Loader2 } from 'lucide-react';
import { UPDATE_CATEGORIES, IMPACT_THRESHOLDS, DIGEST_FREQUENCIES } from '../utils/constants';

const Settings = () => {
  const { user, updatePreferences } = useAuth();
  const [preferences, setPreferences] = useState(user?.preferences || {
    notificationSettings: {
      email: true,
      inApp: true,
      impactThreshold: 'medium'
    },
    monitoredCategories: ['pricing', 'feature_release', 'product_update'],
    digestFrequency: 'daily'
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleToggle = (category, field, value) => {
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [field]: value
      }
    });
  };

  const handleCategoryToggle = (category) => {
    const current = preferences.monitoredCategories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    setPreferences({
      ...preferences,
      monitoredCategories: updated
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updatePreferences(preferences);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'categories', label: 'Categories', icon: Filter },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Manage preferences and notifications
        </p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} />
                Profile Information
              </h2>
              <p className="text-sm text-gray-600">
                Your account information
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="input bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input bg-gray-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell size={24} />
                Notification Preferences
              </h2>
              <p className="text-sm text-gray-600">
                Configure how and when you receive notifications
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Impact Threshold */}
              <div className="bg-gray-50 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Impact Threshold
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Only notify me for updates with this impact level or higher
                </p>
                <select
                  value={preferences.notificationSettings?.impactThreshold || 'medium'}
                  onChange={(e) => handleToggle('notificationSettings', 'impactThreshold', e.target.value)}
                  className="input"
                >
                  {IMPACT_THRESHOLDS.map(threshold => (
                    <option key={threshold.value} value={threshold.value}>
                      {threshold.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Digest Frequency */}
              <div className="bg-gray-50 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Digest Frequency
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  How often would you like to receive update summaries?
                </p>
                <select
                  value={preferences.digestFrequency || 'daily'}
                  onChange={(e) => setPreferences({ ...preferences, digestFrequency: e.target.value })}
                  className="input"
                >
                  {DIGEST_FREQUENCIES.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="card space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter size={24} />
                Monitored Categories
              </h2>
              <p className="text-sm text-gray-600">
                Select which types of updates you want to track
              </p>
            </div>
            
            <div className="space-y-3">
              {UPDATE_CATEGORIES.map((category) => (
                <label 
                  key={category.value} 
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.monitoredCategories?.includes(category.value)}
                      onChange={() => handleCategoryToggle(category.value)}
                      className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.label}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {getCategoryDescription(category.value)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function for category descriptions
const getCategoryDescription = (category) => {
  const descriptions = {
    pricing: 'Track pricing changes, new plans, and special offers',
    feature_release: 'Monitor new features and product capabilities',
    integration: 'Stay updated on new integrations and partnerships',
    product_update: 'Track general product improvements and updates',
    blog_post: 'Follow competitor blog posts and articles',
    case_study: 'Monitor new case studies and success stories',
    webinar: 'Track webinars, training sessions, and events'
  };
  return descriptions[category] || 'Track this type of update';
};

export default Settings;
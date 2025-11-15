import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, updatePreferences } = useAuth();
  const [preferences, setPreferences] = useState(user?.preferences || {
    notificationSettings: {
      email: true,
      inApp: true,
      impactThreshold: 'medium'
    },
    monitoredCategories: ['pricing', 'product_release', 'campaign'],
    digestFrequency: 'daily'
  });
  const [loading, setLoading] = useState(false);

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

  const categories = [
    { value: 'pricing', label: 'Pricing Changes' },
    { value: 'feature_release', label: 'Feature Releases' },
    { value: 'integration', label: 'Integrations' },
    { value: 'product_update', label: 'Product Updates' },
    { value: 'blog_post', label: 'Blog Posts' },
    { value: 'case_study', label: 'Case Studies' },
    { value: 'webinar', label: 'Webinars & Training' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences and notifications</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Monitored Categories */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Monitored Categories
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Select which types of updates you want to track
          </p>
          
          <div className="space-y-3">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.monitoredCategories?.includes(category.value)}
                  onChange={() => handleCategoryToggle(category.value)}
                  className="w-5 h-5 text-primary-600 rounded"
                />
                <span className="font-medium text-gray-900">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Notification Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impact Threshold
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Only notify me for updates with this impact level or higher
              </p>
              <select
                value={preferences.notificationSettings?.impactThreshold || 'medium'}
                onChange={(e) => handleToggle('notificationSettings', 'impactThreshold', e.target.value)}
                className="input"
              >
                <option value="low">Low and above</option>
                <option value="medium">Medium and above</option>
                <option value="high">High and above</option>
                <option value="critical">Critical only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digest Frequency
              </label>
              <select
                value={preferences.digestFrequency || 'daily'}
                onChange={(e) => setPreferences({ ...preferences, digestFrequency: e.target.value })}
                className="input"
              >
                <option value="realtime">Real-time (immediate)</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly digest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
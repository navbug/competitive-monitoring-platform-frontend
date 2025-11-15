// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// App Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  COMPETITORS: '/competitors',
  COMPETITOR_DETAIL: '/competitors/:id',
  UPDATES: '/updates',
  TRENDS: '/trends',
  COMPARISON: '/comparison',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
};

// Monitoring Frequencies
export const MONITORING_FREQUENCIES = [
  { value: '5minutes', label: 'Every 5 minutes (testing)' },
  { value: '10minutes', label: 'Every 10 minutes (testing)' },
  { value: '30minutes', label: 'Every 30 minutes (testing)' },
  { value: 'hourly', label: 'Hourly' },
  { value: '6hours', label: 'Every 6 hours' },
  { value: '12hours', label: 'Every 12 hours' },
  { value: 'daily', label: 'Daily' },
];

// Priority Levels
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
];

// Impact Levels
export const IMPACT_LEVELS = {
  low: { label: 'Low', class: 'badge-low' },
  medium: { label: 'Medium', class: 'badge-medium' },
  high: { label: 'High', class: 'badge-high' },
  critical: { label: 'Critical', class: 'badge-critical' },
};

// Update Categories
export const UPDATE_CATEGORIES = [
  { value: 'pricing', label: 'Pricing Changes' },
  { value: 'feature_release', label: 'Feature Releases' },
  { value: 'integration', label: 'Integrations' },
  { value: 'product_update', label: 'Product Updates' },
  { value: 'blog_post', label: 'Blog Posts' },
  { value: 'case_study', label: 'Case Studies' },
  { value: 'webinar', label: 'Webinars & Training' },
];

// Status Types
export const STATUS_TYPES = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800',
  emerging: 'bg-green-100 text-green-800',
  declining: 'bg-yellow-100 text-yellow-800',
};

// Page Types
export const PAGE_TYPES = [
  { value: 'pricing', label: 'Pricing' },
  { value: 'product', label: 'Product' },
  { value: 'blog', label: 'Blog' },
  { value: 'about', label: 'About' },
  { value: 'other', label: 'Other' },
];

// Digest Frequencies
export const DIGEST_FREQUENCIES = [
  { value: 'realtime', label: 'Real-time (immediate)' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly digest' },
];

// Impact Thresholds
export const IMPACT_THRESHOLDS = [
  { value: 'low', label: 'Low and above' },
  { value: 'medium', label: 'Medium and above' },
  { value: 'high', label: 'High and above' },
  { value: 'critical', label: 'Critical only' },
];
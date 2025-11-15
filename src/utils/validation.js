import * as Yup from 'yup';

// Login validation schema
export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .trim(),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Register validation schema
export const registerSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .trim(),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

// Competitor validation schema
export const competitorSchema = Yup.object({
  name: Yup.string()
    .required('Company name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  website: Yup.string()
    .url('Must be a valid URL')
    .required('Website is required')
    .trim(),
  industry: Yup.string()
    .required('Industry is required')
    .trim(),
  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  monitoredChannels: Yup.object({
    websitePages: Yup.array().of(
      Yup.object({
        url: Yup.string().url('Must be a valid URL').required('URL is required'),
        type: Yup.string().required('Type is required'),
      })
    ),
    rssFeeds: Yup.array().of(
      Yup.object({
        url: Yup.string().url('Must be a valid URL').required('URL is required'),
      })
    ),
  }),
  monitoringConfig: Yup.object({
    enabled: Yup.boolean(),
    frequency: Yup.string().required('Frequency is required'),
    priority: Yup.string().required('Priority is required'),
  }),
});

// Helper function to get error message
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};
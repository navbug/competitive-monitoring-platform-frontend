// import { useState } from 'react';
// import api from '../utils/api';
// import { toast } from 'react-toastify';
// import { X, Plus, Trash2 } from 'lucide-react';

// const AddCompetitorModal = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     website: '',
//     industry: 'Project Management SaaS',
//     description: '',
//     monitoredChannels: {
//       websitePages: [],
//       rssFeeds: []
//     },
//     monitoringConfig: {
//       enabled: true,
//       frequency: '6hours',
//       priority: 'high'
//     }
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('monitoringConfig.')) {
//       const field = name.split('.')[1];
//       setFormData({
//         ...formData,
//         monitoringConfig: {
//           ...formData.monitoringConfig,
//           [field]: value
//         }
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const addWebsitePage = () => {
//     setFormData({
//       ...formData,
//       monitoredChannels: {
//         ...formData.monitoredChannels,
//         websitePages: [
//           ...formData.monitoredChannels.websitePages,
//           { url: '', type: 'other' }
//         ]
//       }
//     });
//   };

//   const removeWebsitePage = (index) => {
//     const pages = [...formData.monitoredChannels.websitePages];
//     pages.splice(index, 1);
//     setFormData({
//       ...formData,
//       monitoredChannels: {
//         ...formData.monitoredChannels,
//         websitePages: pages
//       }
//     });
//   };

//   const updateWebsitePage = (index, field, value) => {
//     const pages = [...formData.monitoredChannels.websitePages];
//     pages[index][field] = value;
//     setFormData({
//       ...formData,
//       monitoredChannels: {
//         ...formData.monitoredChannels,
//         websitePages: pages
//       }
//     });
//   };

//   const addRssFeed = () => {
//     setFormData({
//       ...formData,
//       monitoredChannels: {
//         ...formData.monitoredChannels,
//         rssFeeds: [
//           ...formData.monitoredChannels.rssFeeds,
//           { url: '' }
//         ]
//       }
//     });
//   };

//   const removeRssFeed = (index) => {
//     const feeds = [...formData.monitoredChannels.rssFeeds];
//     feeds.splice(index, 1);
//     setFormData({
//       ...formData,
//       monitoredChannels: {
//         ...formData.monitoredChannels,
//         rssFeeds: feeds
//       }
//     });
//   };

//   const updateRssFeed = (index, value) => {
//     const feeds = [...formData.monitoredChannels.rssFeeds];
//     feeds[index].url = value;
//     setFormData({
//       ...formData,
//       monitoredChannels: {
//         ...formData.monitoredChannels,
//         rssFeeds: feeds
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await api.post('/competitors', formData);
//       toast.success('Competitor added successfully');
//       onSuccess();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to add competitor');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
//           <h2 className="text-2xl font-bold">Add Competitor</h2>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Basic Info */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-gray-900">Basic Information</h3>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Company Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="input"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Website *
//               </label>
//               <input
//                 type="url"
//                 name="website"
//                 value={formData.website}
//                 onChange={handleChange}
//                 className="input"
//                 placeholder="https://example.com"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Industry
//               </label>
//               <input
//                 type="text"
//                 name="industry"
//                 value="Project Management SaaS"
//                 disabled
//                 className="input bg-gray-50"
//               />
//               <p className="text-xs text-gray-500 mt-1">Industry is fixed for this platform</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="input"
//                 rows="3"
//               />
//             </div>
//           </div>

//           {/* Monitoring Config */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-gray-900">Monitoring Configuration</h3>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Frequency
//                 </label>
//                 <select
//                   name="monitoringConfig.frequency"
//                   value={formData.monitoringConfig.frequency}
//                   onChange={handleChange}
//                   className="input"
//                 >
//                   <option value="5minutes">Every 5 minutes (testing)</option>
//                   <option value="10minutes">Every 10 minutes (testing)</option>
//                   <option value="30minutes">Every 30 minutes (testing)</option>
//                   <option value="hourly">Hourly</option>
//                   <option value="6hours">Every 6 hours</option>
//                   <option value="12hours">Every 12 hours</option>
//                   <option value="daily">Daily</option>
//                 </select>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Use 5-30min for quick testing
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Priority
//                 </label>
//                 <select
//                   name="monitoringConfig.priority"
//                   value={formData.monitoringConfig.priority}
//                   onChange={handleChange}
//                   className="input"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Website Pages */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="font-semibold text-gray-900">Website Pages to Monitor</h3>
//               <button
//                 type="button"
//                 onClick={addWebsitePage}
//                 className="btn btn-secondary text-sm flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add Page
//               </button>
//             </div>
            
//             {formData.monitoredChannels.websitePages.map((page, index) => (
//               <div key={index} className="flex gap-2">
//                 <input
//                   type="url"
//                   value={page.url}
//                   onChange={(e) => updateWebsitePage(index, 'url', e.target.value)}
//                   className="input flex-1"
//                   placeholder="https://competitor.com/pricing"
//                 />
//                 <select
//                   value={page.type}
//                   onChange={(e) => updateWebsitePage(index, 'type', e.target.value)}
//                   className="input w-32"
//                 >
//                   <option value="pricing">Pricing</option>
//                   <option value="product">Product</option>
//                   <option value="blog">Blog</option>
//                   <option value="about">About</option>
//                   <option value="other">Other</option>
//                 </select>
//                 <button
//                   type="button"
//                   onClick={() => removeWebsitePage(index)}
//                   className="p-2 text-red-600 hover:bg-red-50 rounded"
//                 >
//                   <Trash2 size={20} />
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* RSS Feeds */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="font-semibold text-gray-900">RSS Feeds</h3>
//               <button
//                 type="button"
//                 onClick={addRssFeed}
//                 className="btn btn-secondary text-sm flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add Feed
//               </button>
//             </div>
            
//             {formData.monitoredChannels.rssFeeds.map((feed, index) => (
//               <div key={index} className="flex gap-2">
//                 <input
//                   type="url"
//                   value={feed.url}
//                   onChange={(e) => updateRssFeed(index, e.target.value)}
//                   className="input flex-1"
//                   placeholder="https://competitor.com/blog/feed"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeRssFeed(index)}
//                   className="p-2 text-red-600 hover:bg-red-50 rounded"
//                 >
//                   <Trash2 size={20} />
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary flex-1 disabled:opacity-50"
//             >
//               {loading ? 'Adding...' : 'Add Competitor'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCompetitorModal;




import { Formik, Form, Field, FieldArray } from 'formik';
import { useCompetitors } from '../hooks/useCompetitors';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { competitorSchema } from '../utils/validation';
import { MONITORING_FREQUENCIES, PRIORITY_LEVELS, PAGE_TYPES } from '../utils/constants';
import toast from 'react-hot-toast';

const AddCompetitorModal = ({ onClose, onSuccess }) => {
  const { addCompetitor } = useCompetitors();

  const initialValues = {
    name: '',
    website: '',
    industry: 'Project Management SaaS',
    description: '',
    monitoredChannels: {
      websitePages: [],
      rssFeeds: []
    },
    monitoringConfig: {
      enabled: true,
      frequency: '6hours',
      priority: 'high'
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await addCompetitor(values);
      toast.success('Competitor added successfully!');
      onSuccess();
    } catch (error) {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Competitor</h2>
            <p className="text-sm text-gray-600 mt-1">Monitor a new competitor's activities</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <Formik
            initialValues={initialValues}
            validationSchema={competitorSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg">Basic Information</h3>
                  
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className={`input ${
                        errors.name && touched.name ? 'input-error' : ''
                      }`}
                      placeholder="e.g., Asana, Monday.com"
                    />
                    {errors.name && touched.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website *
                    </label>
                    <Field
                      type="url"
                      name="website"
                      className={`input ${
                        errors.website && touched.website ? 'input-error' : ''
                      }`}
                      placeholder="https://example.com"
                    />
                    {errors.website && touched.website && (
                      <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                    )}
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <Field
                      type="text"
                      name="industry"
                      disabled
                      className="input bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Industry is fixed for this platform
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows="3"
                      className={`input ${
                        errors.description && touched.description ? 'input-error' : ''
                      }`}
                      placeholder="Brief description of the competitor..."
                    />
                    {errors.description && touched.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Monitoring Configuration */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Monitoring Configuration
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <Field
                        as="select"
                        name="monitoringConfig.frequency"
                        className="input"
                      >
                        {MONITORING_FREQUENCIES.map(freq => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label}
                          </option>
                        ))}
                      </Field>
                      <p className="text-xs text-gray-500 mt-1">
                        Use 5-30min for quick testing
                      </p>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority *
                      </label>
                      <Field
                        as="select"
                        name="monitoringConfig.priority"
                        className="input"
                      >
                        {PRIORITY_LEVELS.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Website Pages */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Website Pages to Monitor
                    </h3>
                  </div>
                  
                  <FieldArray name="monitoredChannels.websitePages">
                    {({ push, remove }) => (
                      <>
                        {values.monitoredChannels.websitePages.map((page, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              type="url"
                              name={`monitoredChannels.websitePages.${index}.url`}
                              className="input flex-1"
                              placeholder="https://competitor.com/pricing"
                            />
                            <Field
                              as="select"
                              name={`monitoredChannels.websitePages.${index}.type`}
                              className="input w-36"
                            >
                              {PAGE_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </Field>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ url: '', type: 'other' })}
                          className="btn btn-secondary text-sm flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Add Page
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* RSS Feeds */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">RSS Feeds</h3>
                  </div>
                  
                  <FieldArray name="monitoredChannels.rssFeeds">
                    {({ push, remove }) => (
                      <>
                        {values.monitoredChannels.rssFeeds.map((feed, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              type="url"
                              name={`monitoredChannels.rssFeeds.${index}.url`}
                              className="input flex-1"
                              placeholder="https://competitor.com/blog/feed"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ url: '' })}
                          className="btn btn-secondary text-sm flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Add Feed
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Competitor'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddCompetitorModal;
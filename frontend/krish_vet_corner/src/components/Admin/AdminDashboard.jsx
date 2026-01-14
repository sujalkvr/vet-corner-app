// src/components/Admin/AdminDashboard.jsx - COMPLETE FIXED VERSION
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, LogOut, Eye, Star, Calendar, FileText, Bell, Power, PowerOff } from 'lucide-react';

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [notificationContent, setNotificationContent] = useState('');
  const [notificationImage, setNotificationImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    fetchBlogs();
    fetchNotifications();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/notifications/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length !== 3) {
      alert('Please upload exactly 3 images');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    Array.from(images).forEach(img => formData.append('images', img));

    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Blog created successfully!');
        setTitle('');
        setContent('');
        setImages([]);
        document.getElementById('fileInput').value = '';
        fetchBlogs();
        setActiveTab('manage');
      } else {
        alert(data.message || 'Error creating blog');
      }
    } catch (err) {
      alert('Error creating blog. Check console for details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ Are you sure you want to delete this blog? This action cannot be undone.')) return;
    
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Blog deleted successfully!');
        fetchBlogs();
      }
    } catch (error) {
      alert('❌ Error deleting blog');
      console.error(error);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    if (!notificationImage) {
      alert('Please upload an image');
      return;
    }

    setNotificationLoading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('content', notificationContent);
    formData.append('image', notificationImage);

    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Notification created successfully!');
        setNotificationContent('');
        setNotificationImage(null);
        document.getElementById('notificationImageInput').value = '';
        fetchNotifications();
      } else {
        alert(data.message || 'Error creating notification');
      }
    } catch (err) {
      alert('Error creating notification. Check console for details.');
      console.error(err);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleToggleNotification = async (id) => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      alert('❌ Error toggling notification');
      console.error(error);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!confirm('⚠️ Are you sure you want to delete this notification?')) return;
    
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Notification deleted successfully!');
        fetchNotifications();
      }
    } catch (error) {
      alert('❌ Error deleting notification');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const featuredBlogs = blogs.slice(0, 3);
  const otherBlogs = blogs.slice(3);
  const activeNotifications = notifications.filter(n => n.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Krish Nayak
            </h1>
            <p className="text-gray-600 mt-2">Manage your content</p>
          </div>
          <div className="flex gap-3">
            
              <a href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all shadow-lg"
            >
              <Eye size={20} />
              <span className="hidden sm:inline">View Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Blogs</p>
                <p className="text-4xl font-bold mt-2">{blogs.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Featured on Home</p>
                <p className="text-4xl font-bold mt-2">{Math.min(blogs.length, 3)}</p>
              </div>
              <Star className="w-12 h-12 text-emerald-200 fill-current" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Notifications</p>
                <p className="text-4xl font-bold mt-2">{activeNotifications.length}</p>
              </div>
              <Bell className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ✏️ Create Blog
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📚 Manage Blogs
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔔 Notifications
          </button>
        </div>

        {/* Create Blog Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Blog Post
              </span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Blog Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="e.g., Complete Guide to Puppy Vaccination"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Content *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none h-64 resize-none"
                  placeholder="Write your blog content here... You can write multiple paragraphs."
                  required
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {content.length} characters • {Math.ceil(content.split(' ').filter(w => w).length / 200)} min read
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Upload 3 Images *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all bg-gray-50">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    className="hidden"
                    required
                    disabled={loading}
                  />
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer inline-block px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold"
                  >
                    Choose Images
                  </label>
                  <p className="text-sm text-gray-600 mt-4">
                    {images.length > 0 ? (
                      <span className="text-green-600 font-semibold">
                        ✓ {images.length} file(s) selected
                      </span>
                    ) : (
                      'Select exactly 3 images (JPG, PNG, GIF, WebP)'
                    )}
                  </p>
                  {images.length > 0 && images.length !== 3 && (
                    <p className="text-red-600 text-sm mt-2">⚠️ Please select exactly 3 images</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || images.length !== 3}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Upload size={20} />
                <span>{loading ? 'Publishing...' : '🚀 Publish Blog'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Manage Blogs Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Featured Blogs Section */}
            {featuredBlogs.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-emerald-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-emerald-800 flex items-center">
                    <Star className="w-7 h-7 mr-3 fill-current text-emerald-600" />
                    Featured on Homepage
                  </h2>
                  <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Top {featuredBlogs.length}
                  </span>
                </div>
                <p className="text-emerald-700 mb-6 bg-white/60 p-4 rounded-xl">
                  ℹ️ <strong>The first 3 blogs</strong> (newest to oldest) are automatically displayed on the homepage. 
                  Reorder by deleting and recreating blogs.
                </p>
                <div className="space-y-4">
                  {featuredBlogs.map((blog, index) => (
                    <BlogCard 
                      key={blog._id} 
                      blog={blog} 
                      index={index} 
                      onDelete={handleDelete}
                      isFeatured={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Blogs Section */}
            {otherBlogs.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FileText className="w-7 h-7 mr-3 text-gray-600" />
                    Other Blogs
                  </h2>
                  <span className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {otherBlogs.length}
                  </span>
                </div>
                <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl">
                  These blogs are visible on the "All Blogs" page but not featured on the homepage.
                </p>
                <div className="space-y-4">
                  {otherBlogs.map((blog, index) => (
                    <BlogCard 
                      key={blog._id} 
                      blog={blog} 
                      index={index + 3} 
                      onDelete={handleDelete}
                      isFeatured={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {blogs.length === 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No blogs yet</h3>
                <p className="text-gray-600 mb-6">Create your first blog post to get started!</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Upload size={20} className="mr-2" />
                  Create First Blog
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Create Notification Form */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Bell className="w-7 h-7 mr-3 text-purple-600" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create Notification
                </span>
              </h2>
              
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Notification Text *</label>
                  <textarea
                    value={notificationContent}
                    onChange={(e) => setNotificationContent(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none h-24 resize-none"
                    placeholder="e.g., 🎉 Special offer: 20% off on all consultations this week!"
                    required
                    disabled={notificationLoading}
                    maxLength={200}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Keep it short and catchy! {notificationContent.length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Upload Image *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all bg-gray-50">
                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <input
                      id="notificationImageInput"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNotificationImage(e.target.files[0])}
                      className="hidden"
                      required
                      disabled={notificationLoading}
                    />
                    <label
                      htmlFor="notificationImageInput"
                      className="cursor-pointer inline-block px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all font-semibold"
                    >
                      Choose Image
                    </label>
                    <p className="text-sm text-gray-600 mt-3">
                      {notificationImage ? (
                        <span className="text-green-600 font-semibold">
                          ✓ {notificationImage.name}
                        </span>
                      ) : (
                        'Recommended: 56x56px square image'
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={notificationLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Bell size={20} />
                  <span>{notificationLoading ? 'Creating...' : '📢 Create Notification'}</span>
                </button>
              </form>
            </div>

            {/* Manage Notifications */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                <span className="flex items-center">
                  <Bell className="w-7 h-7 mr-3 text-gray-600" />
                  All Notifications
                </span>
                <span className="text-sm font-normal text-gray-600">
                  {notifications.length} total • {activeNotifications.length} active
                </span>
              </h2>

              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔔</div>
                  <p className="text-gray-600">No notifications yet. Create your first one above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`border-2 rounded-2xl p-4 sm:p-6 transition-all ${
                        notification.isActive
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Image */}
                        <img
                          src={`http://localhost:5000${notification.image}`}
                          alt="Notification"
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/56?text=🔔';
                          }}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium line-clamp-2">
                            {notification.content}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleToggleNotification(notification._id)}
                            className={`p-3 rounded-xl transition-all ${
                              notification.isActive
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                            }`}
                            title={notification.isActive ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                          >
                            {notification.isActive ? <Power size={20} /> : <PowerOff size={20} />}
                          </button>
                          <button
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                            title="Delete notification"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog, index, onDelete, isFeatured }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`border-2 rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
      isFeatured 
        ? 'border-emerald-300 bg-white hover:border-emerald-400 hover:shadow-lg' 
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
    }`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Blog Image */}
        <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          {blog.images && blog.images.length > 0 ? (
            <img
              src={`http://localhost:5000${blog.images[0]}`}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=Blog';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🐾
            </div>
          )}
        </div>

        {/* Blog Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isFeatured && (
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured #{index + 1}
                  </span>
                )}
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 line-clamp-2">
                {blog.title}
              </h3>
            </div>
            <button
              onClick={() => onDelete(blog._id)}
              className="p-2 sm:p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all flex-shrink-0 group"
              title="Delete blog"
            >
              <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <p className={`text-gray-600 text-sm leading-relaxed mb-3 ${
            isExpanded ? '' : 'line-clamp-2'
          }`}>
            {blog.content}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              {isExpanded ? '▲ Show Less' : '▼ Read More'}
              </button>
        
          <a href={`/blog/${blog.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center"
        >
          <Eye size={16} className="mr-1" />
          View Live
        </a>
      </div>
    </div>
  </div>
</div>
        );
    };

    export default AdminDashboard;
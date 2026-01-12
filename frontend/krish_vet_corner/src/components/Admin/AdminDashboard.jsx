import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await fetch('http://localhost:5000/api/blogs');
    const data = await response.json();
    setBlogs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (response.ok) {
        alert('Blog created successfully!');
        setTitle('');
        setContent('');
        setImages([]);
        fetchBlogs();
      }
    } catch (err) {
      alert('Error creating blog');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog?')) return;
    const token = localStorage.getItem('adminToken');

    await fetch(`http://localhost:5000/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    fetchBlogs();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Create Blog Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create New Blog</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Blog Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Enter blog title"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none h-40"
                placeholder="Write your blog content..."
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Upload 3 Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(e.target.files)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Upload size={20} />
              <span>Publish Blog</span>
            </button>
          </form>
        </div>

        {/* Existing Blogs */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Existing Blogs</h2>
          <div className="space-y-4">
            {blogs.map(blog => (
              <div key={blog._id} className="flex justify-between items-center border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-all">
                <div>
                  <h3 className="font-bold text-lg">{blog.title}</h3>
                  <p className="text-gray-600 text-sm">{new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
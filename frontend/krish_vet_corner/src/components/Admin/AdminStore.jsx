import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, Edit3, Save, X, Users, UserCheck, Award, Search, Filter, Briefcase } from 'lucide-react';

const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    description: '',
    image: null,
    order: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [teamMembers, searchQuery]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team');
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
        setFilteredMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const filterMembers = () => {
    let filtered = [...teamMembers];

    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      degree: '',
      description: '',
      image: null,
      order: 0
    });
    setEditingMember(null);
    document.getElementById('imageInput').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image && !editingMember) {
      alert('Please upload an image');
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append('name', formData.name);
    form.append('degree', formData.degree);
    form.append('description', formData.description);
    form.append('order', formData.order);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const url = editingMember 
        ? `http://localhost:5000/api/team/${editingMember._id}`
        : 'http://localhost:5000/api/team';
      
      const method = editingMember ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: form
      });

      const data = await response.json();

      if (data.success) {
        alert(editingMember ? '✅ Team member updated!' : '✅ Team member added!');
        resetForm();
        fetchTeamMembers();
        setActiveTab('manage');
      } else {
        alert(data.message || 'Error saving team member');
      }
    } catch (err) {
      alert('Error saving team member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      degree: member.degree,
      description: member.description,
      image: null,
      order: member.order
    });
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ Are you sure you want to delete this team member?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/team/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Team member deleted successfully!');
        fetchTeamMembers();
      }
    } catch (error) {
      alert('❌ Error deleting team member');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                👥 Team Management
              </h1>
              <p className="text-gray-600 mt-2">Manage your team members and their profiles</p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">Total Members</p>
                <p className="text-4xl font-bold mt-2">{teamMembers.length}</p>
              </div>
              <Users className="w-12 h-12 text-cyan-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Active Profiles</p>
                <p className="text-4xl font-bold mt-2">{teamMembers.length}</p>
              </div>
              <UserCheck className="w-12 h-12 text-teal-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Displayed Order</p>
                <p className="text-4xl font-bold mt-2">{teamMembers.length > 0 ? 'Active' : 'None'}</p>
              </div>
              <Award className="w-12 h-12 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex gap-2">
          <button
            onClick={() => { setActiveTab('add'); resetForm(); }}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-cyan-500 via-teal-600 to-emerald-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ➕ {editingMember ? 'Edit Member' : 'Add Member'}
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-cyan-500 via-teal-600 to-emerald-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👥 Manage Team
          </button>
        </div>

        {/* Add/Edit Member Tab */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent flex items-center">
                <Users className="mr-3 text-cyan-600" size={28} />
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>
              {editingMember && (
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  <X size={18} />
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                    <UserCheck className="mr-2 text-cyan-600" size={18} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-all"
                    placeholder="e.g., Dr. John Smith"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                    <Award className="mr-2 text-cyan-600" size={18} />
                    Degree/Title *
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-all"
                    placeholder="e.g., DVM, Veterinary Surgeon"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                  <Briefcase className="mr-2 text-cyan-600" size={18} />
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="0"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Lower numbers appear first on the website
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                  <Edit3 className="mr-2 text-cyan-600" size={18} />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none h-32 resize-none"
                  placeholder="Brief description about the team member..."
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {formData.description.length} characters
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                  <Upload className="mr-2 text-cyan-600" size={18} />
                  Profile Image {editingMember ? '(optional - leave empty to keep current)' : '*'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cyan-400 transition-all bg-gradient-to-br from-cyan-50 to-emerald-50">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <label
                    htmlFor="imageInput"
                    className="cursor-pointer inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    Choose Image
                  </label>
                  <p className="text-sm text-gray-600 mt-4">
                    {formData.image ? (
                      <span className="text-green-600 font-semibold">
                        ✓ {formData.image.name}
                      </span>
                    ) : editingMember ? (
                      <span className="text-blue-600">Current image will be kept if not changed</span>
                    ) : (
                      'JPG, PNG, GIF, WebP (Max 5MB)'
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.degree || !formData.description || (!formData.image && !editingMember)}
                className="w-full bg-gradient-to-r from-cyan-500 via-teal-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {editingMember ? <Save size={20} /> : <Upload size={20} />}
                <span>{loading ? 'Saving...' : editingMember ? '💾 Update Member' : '✨ Add Team Member'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Manage Team Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team members by name, degree, or description..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Team Members Grid */}
            {filteredMembers.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {searchQuery ? 'No team members found' : 'No team members yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search' 
                    : 'Add your first team member to get started!'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setActiveTab('add')}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Upload size={20} className="mr-2" />
                    Add First Member
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <div
                    key={member._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-300"
                  >
                    {/* Member Image */}
                    <div className="relative h-56 bg-gradient-to-br from-cyan-100 to-emerald-100">
                      <img
                        src={`http://localhost:5000${member.image}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=Team+Member';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700 border-2 border-cyan-300">
                          Order: {member.order}
                        </span>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="text-cyan-600" size={16} />
                        <p className="text-cyan-600 font-semibold text-sm">
                          {member.degree}
                        </p>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {member.description}
                      </p>

                      <p className="text-xs text-gray-400 mb-4">
                        Added {new Date(member.createdAt).toLocaleDateString()}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all font-semibold"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all font-semibold"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTeam;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Trash2,
  Edit,
  Save,
  X,
  Users,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";
import { API_URL } from "../../api";
const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    description: "",
    image: null,
    order: 0,
  });

  // Edit form states
  const [editData, setEditData] = useState({
    name: "",
    degree: "",
    description: "",
    image: null,
    order: 0,
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/team`);
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("degree", formData.degree);
    form.append("description", formData.description);
    form.append("image", formData.image);
    form.append("order", formData.order);

    try {
      const response = await fetch(`${API_URL}/api/team`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Team member added successfully!");
        setFormData({
          name: "",
          degree: "",
          description: "",
          image: null,
          order: 0,
        });
        document.getElementById("imageInput").value = "";
        fetchTeamMembers();
      } else {
        alert(data.message || "Error adding team member");
      }
    } catch (err) {
      alert("Error adding team member. Check console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setEditData({
      name: member.name,
      degree: member.degree,
      description: member.description,
      image: null,
      order: member.order,
    });
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    const form = new FormData();
    form.append("name", editData.name);
    form.append("degree", editData.degree);
    form.append("description", editData.description);
    form.append("order", editData.order);
    if (editData.image) {
      form.append("image", editData.image);
    }

    try {
      const response = await fetch(`${API_URL}/api/team/${id}`, {
        method: "PUT",
        body: form,
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Team member updated successfully!");
        setEditingId(null);
        fetchTeamMembers();
      } else {
        alert(data.message || "Error updating team member");
      }
    } catch (err) {
      alert("Error updating team member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("⚠️ Are you sure you want to delete this team member?"))
      return;

    try {
      const response = await fetch(`${API_URL}/api/team/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Team member deleted successfully!");
        fetchTeamMembers();
      }
    } catch (error) {
      alert("❌ Error deleting team member");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <ArrowLeft size={24} className="text-teal-600" />
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                <Users className="text-teal-600" size={40} />
                Team Management
              </h1>
              <p className="text-gray-600 mt-2">
                Add and manage your team members
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-teal-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">
                Total Team Members
              </p>
              <p className="text-4xl font-bold mt-2">{teamMembers.length}</p>
            </div>
            <Users className="w-16 h-16 text-teal-200" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add New Member Form */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 h-fit sticky top-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Upload className="text-white" size={20} />
              </div>
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Add New Member
              </span>
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-all"
                  placeholder="e.g., Dr. John Smith"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Degree/Title *
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-all"
                  placeholder="e.g., DVM, Veterinary Surgeon"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none h-32 resize-none"
                  placeholder="Brief description about the team member..."
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-all"
                  placeholder="0"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Profile Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-all bg-gray-50">
                  <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    className="hidden"
                    disabled={loading}
                  />
                  <label
                    htmlFor="imageInput"
                    className="cursor-pointer inline-block px-5 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all font-semibold text-sm"
                  >
                    Choose Image
                  </label>
                  <p className="text-sm text-gray-600 mt-3">
                    {formData.image ? (
                      <span className="text-teal-600 font-semibold">
                        ✓ {formData.image.name}
                      </span>
                    ) : (
                      "JPG, PNG, GIF, WebP (Max 5MB)"
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.degree ||
                  !formData.description ||
                  !formData.image
                }
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Upload size={20} />
                <span>{loading ? "Adding..." : "✨ Add Team Member"}</span>
              </button>
            </div>
          </div>

          {/* Team Members List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <span className="text-gray-800">
                Current Team ({teamMembers.length})
              </span>
            </h2>

            {teamMembers.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Users className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No team members yet
                </h3>
                <p className="text-gray-600">
                  Add your first team member to get started!
                </p>
              </div>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-gray-100"
                >
                  {editingId === member._id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-teal-200"
                        />
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                image: e.target.files[0],
                              })
                            }
                            className="text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Leave empty to keep current image
                          </p>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                        placeholder="Name"
                      />

                      <input
                        type="text"
                        value={editData.degree}
                        onChange={(e) =>
                          setEditData({ ...editData, degree: e.target.value })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                        placeholder="Degree/Title"
                      />

                      <textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none h-24 resize-none"
                        placeholder="Description"
                      />

                      <input
                        type="number"
                        value={editData.order}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            order: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                        placeholder="Order"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdate(member._id)}
                          disabled={loading}
                          className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Save size={18} />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-gray-500 text-white font-semibold py-3 rounded-xl hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex gap-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-teal-100 flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=Team";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 mb-1">
                              {member.name}
                            </h3>
                            <p className="text-teal-600 font-semibold mb-2">
                              {member.degree}
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                              {member.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Order: {member.order} • Added{" "}
                              {new Date(member.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleEdit(member)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all font-semibold text-sm flex items-center gap-2"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all font-semibold text-sm flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeam;

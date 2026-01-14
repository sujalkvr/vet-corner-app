import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Package, 
  ShoppingBag, 
  Tag,
  IndianRupee,
  Eye,
  Search,
  Filter,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const AdminStore = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: 'pet care',
    description: '',
    price: '',
    image: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, filterType]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
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
      type: 'pet care',
      description: '',
      price: '',
      image: null
    });
    setEditingProduct(null);
    document.getElementById('productImageInput').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image && !editingProduct) {
      alert('Please upload a product image');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const data = new FormData();
    
    data.append('name', formData.name);
    data.append('type', formData.type);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      const result = await response.json();

      if (result.success) {
        alert(editingProduct ? '✅ Product updated!' : '✅ Product added!');
        resetForm();
        fetchProducts();
        setActiveTab('manage');
      } else {
        alert(result.message || 'Error saving product');
      }
    } catch (err) {
      alert('Error saving product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      type: product.type,
      description: product.description,
      price: product.price.toString(),
      image: null
    });
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ Delete this product? This cannot be undone.')) return;
    
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Product deleted!');
        fetchProducts();
      }
    } catch (error) {
      alert('❌ Error deleting product');
      console.error(error);
    }
  };

  const productsByType = {
    'pet care': products.filter(p => p.type === 'pet care').length,
    'courses': products.filter(p => p.type === 'courses').length,
    'others': products.filter(p => p.type === 'others').length
  };

  const typeColors = {
    'pet care': 'bg-blue-100 text-blue-700 border-blue-300',
    'courses': 'bg-purple-100 text-purple-700 border-purple-300',
    'others': 'bg-gray-100 text-gray-700 border-gray-300'
  };

  const typeIcons = {
    'pet care': '🐾',
    'courses': '📚',
    'others': '📦'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                🛍️ Store Management
              </h1>
              <p className="text-gray-600 mt-2">Manage your products and inventory</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium">Total Products</p>
                <p className="text-4xl font-bold mt-2">{products.length}</p>
              </div>
              <Package className="w-12 h-12 text-violet-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Pet Care</p>
                <p className="text-4xl font-bold mt-2">{productsByType['pet care']}</p>
              </div>
              <div className="text-5xl">🐾</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Courses</p>
                <p className="text-4xl font-bold mt-2">{productsByType['courses']}</p>
              </div>
              <div className="text-5xl">📚</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Others</p>
                <p className="text-4xl font-bold mt-2">{productsByType['others']}</p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex gap-2">
          <button
            onClick={() => { setActiveTab('add'); resetForm(); }}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-violet-500 via-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ➕ {editingProduct ? 'Edit Product' : 'Add Product'}
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-violet-500 via-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📦 Manage Products
          </button>
        </div>

        {/* Add/Edit Product Tab */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                <ShoppingBag className="mr-3 text-violet-600" size={28} />
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              {editingProduct && (
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  <X size={18} />
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                    <Tag className="mr-2 text-violet-600" size={18} />
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-all"
                    placeholder="e.g., Premium Dog Food 5kg"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                    <Filter className="mr-2 text-violet-600" size={18} />
                    Product Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-all"
                    required
                    disabled={loading}
                  >
                    <option value="pet care">🐾 Pet Care</option>
                    <option value="courses">📚 Courses</option>
                    <option value="others">📦 Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                  <IndianRupee className="mr-2 text-violet-600" size={18} />
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-all"
                  placeholder="e.g., 999"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                  <AlertCircle className="mr-2 text-violet-600" size={18} />
                  Product Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none h-32 resize-none"
                  placeholder="Describe your product in detail..."
                  required
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {formData.description.length} characters
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                  <Upload className="mr-2 text-violet-600" size={18} />
                  Product Image {editingProduct ? '(optional - leave empty to keep current)' : '*'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-400 transition-all bg-gradient-to-br from-violet-50 to-pink-50">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <input
                    id="productImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={!editingProduct}
                    disabled={loading}
                  />
                  <label
                    htmlFor="productImageInput"
                    className="cursor-pointer inline-block px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    Choose Image
                  </label>
                  <p className="text-sm text-gray-600 mt-4">
                    {formData.image ? (
                      <span className="text-green-600 font-semibold">
                        ✓ {formData.image.name}
                      </span>
                    ) : editingProduct ? (
                      <span className="text-blue-600">Current image will be kept if not changed</span>
                    ) : (
                      'PNG, JPG, GIF, WebP up to 5MB'
                    )}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-500 via-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingProduct ? <Save size={20} /> : <Upload size={20} />}
                <span>{loading ? 'Saving...' : editingProduct ? '💾 Update Product' : '🚀 Add Product'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Manage Products Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-all appearance-none"
                  >
                    <option value="all">All Products</option>
                    <option value="pet care">🐾 Pet Care</option>
                    <option value="courses">📚 Courses</option>
                    <option value="others">📦 Others</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {searchQuery || filterType !== 'all' ? 'No products found' : 'No products yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterType !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Add your first product to get started!'}
                </p>
                {!searchQuery && filterType === 'all' && (
                  <button
                    onClick={() => setActiveTab('add')}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Upload size={20} className="mr-2" />
                    Add First Product
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-violet-300"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gradient-to-br from-violet-100 to-pink-100">
                      <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Product';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${typeColors[product.type]}`}>
                          {typeIcons[product.type]} {product.type}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                          <IndianRupee size={24} className="text-violet-600" />
                          {product.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all font-semibold"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
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

export default AdminStore;
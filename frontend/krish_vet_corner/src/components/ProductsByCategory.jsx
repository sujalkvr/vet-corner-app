import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingCart,
  ArrowLeft,
  Package,
  Search,
} from "lucide-react";
import Footer from "./Footer";
import { API_URL } from "../api";
const ProductsByCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryInfo = {
    "pet-care": {
      title: "Pet Care Products",
      icon: "🐾",
      description: "Premium quality products for your beloved pets",
    },
    courses: {
      title: "Pet Care Courses",
      icon: "📚",
      description: "Learn professional pet care techniques and training",
    },
    others: {
      title: "Other Products",
      icon: "✨",
      description: "Explore our special collection of unique items",
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const type = category.replace("-", " ");
      const response = await fetch(`${API_URL}/api/products/type/${type}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const info = categoryInfo[category] || categoryInfo["others"];

  return (
    <>
      <div className="min-h-screen bg-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/#store")}
            className="flex items-center gap-2 text-gray-800 hover:text-emerald-600 font-bold text-lg mb-8 transition-all duration-300 group"
          >
            <ArrowLeft
              size={24}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="border-b-2 border-transparent group-hover:border-emerald-600 transition-all duration-300">
              Back to Store
            </span>
          </button>

          {/* Header */}
          <div className="mb-12">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{info.icon}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h1>
                  <p className="text-gray-600 text-base">{info.description}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}{" "}
                available
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-10">
            <div className="relative max-w-md">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all bg-white shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {searchQuery ? "No products found" : "No products available"}
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Check back soon for new products!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-emerald-200 group"
                >
                  {/* Product Image */}
                  <div className="relative h-56 bg-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Product";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2 min-h-[56px] group-hover:text-emerald-700 transition-colors duration-300">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center mb-5">
                      <div className="flex items-center text-2xl font-bold text-emerald-600">
                        <IndianRupee size={22} />
                        {product.price.toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Link
                      to="/payment"
                      state={{ product }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transform hover:scale-105 transition-all duration-300"
                    >
                      <ShoppingCart size={20} />
                      Buy Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsByCategory;

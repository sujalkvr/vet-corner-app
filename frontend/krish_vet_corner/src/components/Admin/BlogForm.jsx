import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Star, Image, Upload, Save, X, Loader2 } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';
import api from '../common/api';
import { useParams, useNavigate } from 'react-router-dom';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    isFeatured: false,
    featuredImages: [null, null, null], // 3 images
    contentImage: null
  });
  const [imagePreviews, setImagePreviews] = useState(['', '', '']);

  // Fetch blog for edit
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      const blog = response.data;
      setBlogData({
        title: blog.title,
        content: blog.content,
        isFeatured: blog.isFeatured,
        featuredImages: [blog.featuredImages?.[0], blog.featuredImages?.[1], blog.featuredImages?.[2]],
        contentImage: blog.contentImage
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const newPreviews = [...imagePreviews];
      newPreviews[index] = previewUrl;
      setImagePreviews(newPreviews);

      const newImages = [...blogData.featuredImages];
      newImages[index] = file;
      setBlogData({ ...blogData, featuredImages: newImages });
    }
  };

  const handleContentImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogData({ ...blogData, contentImage: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('isFeatured', blogData.isFeatured);

      // Add images
      blogData.featuredImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append('featuredImages', image);
        }
      });

      if (blogData.contentImage instanceof File) {
        formData.append('contentImage', blogData.contentImage);
      }

      if (isEdit) {
        await api.put(`/blogs/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
      <div className="p-8 border-b border-slate-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-2 rounded-2xl ${isEdit ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {isEdit ? <Edit3 className="w-6 h-6" /> : <Save className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{isEdit ? 'Edit Blog' : 'Create New Blog'}</h1>
            <p className="text-slate-600 mt-1">Fill out the form below to {isEdit ? 'update' : 'create'} your blog post</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Blog Title</span>
          </label>
          <input
            type="text"
            value={blogData.title}
            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
            className="w-full px-6 py-4 text-xl border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/50 outline-none transition-all duration-300"
            placeholder="Enter a catchy blog title..."
            required
          />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200/50">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={blogData.isFeatured}
              onChange={(e) => setBlogData({ ...blogData, isFeatured: e.target.checked })}
              className="w-6 h-6 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-amber-500 fill-amber-100" />
              <span className="text-lg font-semibold text-slate-800">
                Feature on Homepage (Max 3 blogs)
              </span>
            </div>
          </label>
        </div>

        {/* Featured Images - 3 Images Slider */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center space-x-2">
            <Image className="w-5 h-5" />
            <span>Featured Images (3 images for slider)</span>
          </label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="space-y-3">
                <div className="w-full h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 transition-all duration-300 cursor-pointer p-4 flex items-center justify-center group hover:bg-slate-50">
                  {preview ? (
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center text-slate-500 group-hover:text-emerald-600 transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-2 opacity-50 group-hover:opacity-100" />
                      <p className="text-sm font-medium">Image {index + 1}</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                  className="hidden"
                  id={`featured-image-${index}`}
                />
                <label
                  htmlFor={`featured-image-${index}`}
                  className="w-full block text-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-all duration-300 cursor-pointer"
                >
                  Choose Image
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Content Image */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
            <Image className="w-5 h-5" />
            <span>Article Header Image</span>
          </label>
          <div className="space-y-3">
            <div className="w-full h-64 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 transition-all duration-300 cursor-pointer p-8 flex items-center justify-center group hover:bg-slate-50">
              {blogData.contentImage ? (
                <img 
                  src={blogData.contentImage instanceof File ? URL.createObjectURL(blogData.contentImage) : blogData.contentImage} 
                  alt="Content preview" 
                  className="w-full h-full object-cover rounded-xl" 
                />
              ) : (
                <div className="text-center text-slate-500 group-hover:text-emerald-600 transition-colors">
                  <Upload className="w-16 h-16 mx-auto mb-3 opacity-50 group-hover:opacity-100" />
                  <p className="text-lg font-semibold">Article Header Image</p>
                  <p className="text-sm mt-1">Optional - 1200x600px recommended</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleContentImageUpload}
              className="hidden"
              id="content-image"
            />
            <label
              htmlFor="content-image"
              className="w-full block text-center px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-2xl text-lg transition-all duration-300 cursor-pointer"
            >
              Choose Header Image
            </label>
          </div>
        </div>

        {/* Rich Content Editor */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Blog Content</span>
          </label>
          <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-200/50 transition-all duration-300">
            <ReactQuill
              theme="snow"
              value={blogData.content}
              onChange={(content) => setBlogData({ ...blogData, content })}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['blockquote', 'code-block'],
                  [{ indent: '-1' }, { indent: '+1' }],
                  ['link', 'image'],
                  [{ color: [] }, { background: [] }],
                  [{ align: [] }],
                  ['clean']
                ]
              }}
              placeholder="Write your blog content here..."
              className="h-96"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-8 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
            className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                <span>{isEdit ? 'Update Blog' : 'Create Blog'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;

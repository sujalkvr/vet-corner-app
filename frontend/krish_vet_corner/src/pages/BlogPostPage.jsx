import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../components/common/api';
import BlogCard from '../components/Blog/BlogCard';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
    fetchRelatedBlogs();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${slug}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setRelatedBlogs(response.data.blogs?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Blog Not Found</h1>
          <p className="text-xl text-slate-600 mb-8">The article you're looking for doesn't exist.</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/blog')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
            >
              View All Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Back Navigation */}
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-12 px-4 py-2 bg-white/50 backdrop-blur-xl rounded-2xl hover:bg-white transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>All Articles</span>
        </Link>

        {/* Blog Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center text-emerald-600 mb-8 space-x-3 px-4 py-3 bg-white/60 backdrop-blur-xl rounded-3xl inline-flex">
            <span className="text-2xl font-bold">{blog.rating || 5.0}</span>
            <div className="flex text-xl">{'★'.repeat(5)}</div>
            <Clock className="w-6 h-6" />
            <span className="text-xl font-semibold">{blog.readTime || '5 min'}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* Featured Image */}
        {blog.contentImage && (
          <div className="w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-20 mx-auto max-w-4xl">
            <img
              src={blog.contentImage}
              alt={blog.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div 
          className="prose prose-lg max-w-none text-slate-800 leading-relaxed prose-headings:text-slate-900 prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-img:rounded-2xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-24 bg-white/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Related Articles</h2>
              <p className="text-xl text-slate-600">More helpful content from Krish Vet Corner</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog._id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;

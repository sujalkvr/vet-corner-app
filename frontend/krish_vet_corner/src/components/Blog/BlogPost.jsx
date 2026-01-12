import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Star } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import api from '../common/api';
import BlogCard from './BlogCard';

const BlogPost = () => {
  const { slug } = useParams();
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
      setRelatedBlogs(response.data.blogs.slice(0, 3));
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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog Not Found</h1>
          <Link to="/blog" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Blogs</span>
        </Link>

        {/* Blog Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center text-emerald-600 mb-6 space-x-2">
            <span className="text-3xl font-bold">{blog.rating || 5.0}</span>
            <div className="flex text-2xl">{'★'.repeat(5)}</div>
            <Clock className="w-6 h-6" />
            <span className="text-xl">{blog.readTime || '5 min'}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* Featured Image */}
        {blog.contentImage && (
          <div className="w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-16">
            <img
              src={blog.contentImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div 
          className="prose prose-lg max-w-none text-slate-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-24 bg-white/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Related Articles
              </h2>
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

export default BlogPost;

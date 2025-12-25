import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const posts = useAppSelector((state) => state.blog.posts);
  const categories = useAppSelector((state) => state.blog.categories);

  // Convert slug back to category name
  const categoryName = categories.find(
    (c) => c.toLowerCase().replace(' & ', '-') === slug
  );

  const categoryPosts = categoryName
    ? posts.filter((p) => p.category === categoryName)
    : [];

  if (!categoryName) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Category Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link to="/categories">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Categories
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-12">
          <Link to="/categories" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              All Categories
            </Button>
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {categoryName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {categoryPosts.length} {categoryPosts.length === 1 ? 'article' : 'articles'} in this category
          </p>
        </section>

        {/* Posts Grid */}
        <section className="container pb-16">
          {categoryPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No articles in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;

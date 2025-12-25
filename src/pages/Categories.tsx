import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { ArrowRight, Folder } from 'lucide-react';

const Categories = () => {
  const categories = useAppSelector((state) => state.blog.categories);
  const posts = useAppSelector((state) => state.blog.posts);

  const categoryData = categories.map((category) => {
    const categoryPosts = posts.filter((p) => p.category === category);
    return {
      name: category,
      slug: category.toLowerCase().replace(' & ', '-'),
      count: categoryPosts.length,
      latestPost: categoryPosts[0],
      image: categoryPosts[0]?.coverImage,
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-12 md:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 mb-4">
              <Folder className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Categories
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore our content organized by topic. Find exactly what you're looking for.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container pb-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categoryData.map((category, index) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Image */}
                <div className="aspect-[4/3] w-full overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h2 className="font-display text-2xl font-bold text-primary-foreground">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-primary-foreground/80">
                    {category.count} {category.count === 1 ? 'article' : 'articles'}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-primary-foreground group-hover:text-primary transition-colors">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest from Each Category */}
        <section className="container pb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">
            Latest from Each Category
          </h2>
          <div className="space-y-12">
            {categoryData.map((category) => (
              <div key={category.slug}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                {category.latestPost && (
                  <PostCard post={category.latestPost} variant="horizontal" />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;

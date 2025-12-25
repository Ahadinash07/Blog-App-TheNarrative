import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Tags as TagsIcon, Search, Hash } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/store/hooks';

const Tags = () => {
  const posts = useAppSelector((state) => state.blog.posts);
  const [searchQuery, setSearchQuery] = useState('');

  const tagStats = useMemo(() => {
    const stats: Record<string, { count: number; views: number }> = {};

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (!stats[tag]) {
          stats[tag] = { count: 0, views: 0 };
        }
        stats[tag].count += 1;
        stats[tag].views += post.views;
      });
    });

    return Object.entries(stats)
      .map(([tag, data]) => ({ tag, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const filteredTags = useMemo(() => {
    if (!searchQuery) return tagStats;
    return tagStats.filter((t) =>
      t.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tagStats, searchQuery]);

  const getTagSize = (count: number) => {
    const max = Math.max(...tagStats.map((t) => t.count));
    const ratio = count / max;
    if (ratio > 0.7) return 'text-2xl font-bold';
    if (ratio > 0.5) return 'text-xl font-semibold';
    if (ratio > 0.3) return 'text-lg font-medium';
    return 'text-base';
  };

  return (
    <>
      <Helmet>
        <title>Browse Tags - TheNarrative</title>
        <meta name="description" content="Explore all topics and tags on TheNarrative. Find articles on web development, AI, design, programming, and more." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="container py-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TagsIcon className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Browse Tags
              </h1>
            </div>
            <p className="text-muted-foreground mb-8">
              {tagStats.length} topics across {posts.length} articles
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </section>

          {/* Tag Cloud */}
          <section className="container pb-8">
            <div className="card-elevated rounded-xl p-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Tag Cloud
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                {filteredTags.map((t) => (
                  <Link
                    key={t.tag}
                    to={`/?tag=${encodeURIComponent(t.tag)}`}
                    className={`${getTagSize(t.count)} text-muted-foreground hover:text-primary transition-colors`}
                  >
                    #{t.tag}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Tag List */}
          <section className="container pb-16">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              All Tags
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTags.map((t, index) => (
                <Link
                  key={t.tag}
                  to={`/?tag=${encodeURIComponent(t.tag)}`}
                  className="group card-elevated rounded-xl p-4 hover:shadow-elevated transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {t.tag}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{t.count} {t.count === 1 ? 'article' : 'articles'}</span>
                        <span>•</span>
                        <span>{t.views.toLocaleString()} views</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{t.count}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Tags;

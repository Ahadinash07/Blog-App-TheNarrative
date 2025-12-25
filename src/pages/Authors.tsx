import { Helmet } from 'react-helmet-async';
import { Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthorCard from '@/components/AuthorCard';
import NewsletterCTA from '@/components/NewsletterCTA';
import { useAppSelector } from '@/store/hooks';

const Authors = () => {
  const authors = useAppSelector((state) => state.blog.authors);

  return (
    <>
      <Helmet>
        <title>Our Writers - TheNarrative</title>
        <meta name="description" content="Meet the expert writers behind TheNarrative. Industry professionals sharing their knowledge and insights." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="container py-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Our Writers
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Meet the talented individuals behind TheNarrative. Our writers are industry 
              experts, thought leaders, and passionate technologists sharing their knowledge 
              with the world.
            </p>
          </section>

          {/* Authors Grid */}
          <section className="container pb-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {authors.map((author, index) => (
                <div
                  key={author.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AuthorCard author={author} />
                </div>
              ))}
            </div>
          </section>

          {/* Write for Us CTA */}
          <section className="container pb-16">
            <div className="card-elevated rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 via-card to-accent/5">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Want to Write for TheNarrative?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                We're always looking for talented writers who can share unique perspectives 
                on technology, design, and the future of digital experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact">
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Apply to Write
                  </button>
                </a>
                <a href="/about">
                  <button className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                    Learn More
                  </button>
                </a>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="container pb-16">
            <NewsletterCTA />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Authors;

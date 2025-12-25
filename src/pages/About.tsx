import { Helmet } from 'react-helmet-async';
import { Users, FileText, Eye, Heart, Target, Lightbulb, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterCTA from '@/components/NewsletterCTA';
import StatsCard from '@/components/StatsCard';
import AuthorCard from '@/components/AuthorCard';
import { useAppSelector } from '@/store/hooks';

const About = () => {
  const authors = useAppSelector((state) => state.blog.authors);
  const posts = useAppSelector((state) => state.blog.posts);

  const totalViews = posts.reduce((acc, post) => acc + post.views, 0);
  const totalLikes = posts.reduce((acc, post) => acc + post.likes, 0);

  const stats = [
    { icon: FileText, label: 'Published Articles', value: posts.length },
    { icon: Users, label: 'Expert Writers', value: authors.length },
    { icon: Eye, label: 'Monthly Views', value: `${(totalViews / 1000).toFixed(1)}K` },
    { icon: Heart, label: 'Community Likes', value: `${(totalLikes / 1000).toFixed(1)}K` },
  ];

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'Every article goes through rigorous editing to ensure accuracy, clarity, and actionable insights.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Focus',
      description: 'We cover emerging technologies and trends before they become mainstream, keeping you ahead of the curve.',
    },
    {
      icon: Globe,
      title: 'Community Driven',
      description: 'Our content is shaped by reader feedback and the diverse perspectives of our global community.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - TheNarrative</title>
        <meta name="description" content="Learn about TheNarrative, a premium tech publication delivering insights on web development, AI, design, and the future of technology." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
            <div className="container relative">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground animate-fade-in">
                  Stories That Shape
                  <span className="text-gradient block mt-2">Tomorrow's Tech</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground animate-slide-up">
                  TheNarrative is a premium publication for developers, designers, and tech enthusiasts 
                  who want to stay ahead of the curve. We deliver deep insights, practical tutorials, 
                  and thought-provoking perspectives on the technologies shaping our future.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="container pb-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <StatsCard {...stat} />
                </div>
              ))}
            </div>
          </section>

          {/* Mission Section */}
          <section className="container py-16">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Our Mission
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  In a world overflowing with content, we believe in quality over quantity. 
                  Our mission is to cut through the noise and deliver articles that genuinely 
                  help you grow as a technologist.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Whether you're a seasoned developer looking to master the latest frameworks, 
                  a designer exploring new paradigms, or an entrepreneur navigating the tech landscape, 
                  TheNarrative is your trusted companion on the journey.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-2xl -z-10" />
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="container py-16">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Our Values
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we create and publish.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="card-elevated rounded-xl p-8 text-center animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Team Section */}
          <section className="container py-16">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Meet Our Writers
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Industry experts sharing their knowledge and experience.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {authors.slice(0, 4).map((author, index) => (
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

          {/* CTA Section */}
          <section className="container py-16">
            <NewsletterCTA />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;

import { Helmet } from 'react-helmet-async';
import { Users, FileText, Eye, Heart, Target, Lightbulb, Globe, Award, TrendingUp, Calendar, MapPin, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterCTA from '@/components/NewsletterCTA';
import StatsCard from '@/components/StatsCard';
import AuthorCard from '@/components/AuthorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & Editor-in-Chief',
      bio: 'Former TechCrunch editor with 10+ years in tech journalism. Passionate about making complex technology accessible.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      social: { twitter: '@sarahchen', linkedin: 'sarahchen', github: 'sarahc' },
      achievements: ['Forbes 30 Under 30', 'Tech Journalism Award 2023']
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Technical Director',
      bio: 'Full-stack developer turned content strategist. Built scalable systems at Netflix and Spotify.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      social: { twitter: '@marcusr', linkedin: 'marcusrodriguez', github: 'marcusr' },
      achievements: ['Google Developer Expert', 'AWS Certified Solutions Architect']
    },
    {
      name: 'Dr. Emily Watson',
      role: 'AI & ML Editor',
      bio: 'PhD in Machine Learning from Stanford. Research background in natural language processing and computer vision.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      social: { twitter: '@emilywatson', linkedin: 'emilywatsonphd', github: 'emily-watson' },
      achievements: ['Stanford AI Lab Alumni', 'NeurIPS Reviewer']
    },
    {
      name: 'Alex Kim',
      role: 'Design & UX Lead',
      bio: 'Award-winning designer with experience at Apple and Google. Advocate for inclusive and accessible design.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      social: { twitter: '@alexkimux', linkedin: 'alexkimdesign', github: 'alexkim' },
      achievements: ['Apple Design Award', 'Google UX Excellence']
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Launched in 15+ countries with localized content and international contributors.',
      icon: Globe
    },
    {
      year: '2023',
      title: 'AI Integration',
      description: 'Introduced AI-powered content recommendations and automated content analysis.',
      icon: Lightbulb
    },
    {
      year: '2022',
      title: 'Community Growth',
      description: 'Reached 500K monthly readers and launched premium membership program.',
      icon: Users
    },
    {
      year: '2021',
      title: 'Platform Launch',
      description: 'TheNarrative goes live with 50+ expert contributors and 200+ articles.',
      icon: TrendingUp
    },
    {
      year: '2020',
      title: 'Foundation',
      description: 'Founded during the pandemic to provide quality tech content and remote learning resources.',
      icon: Target
    }
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
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="secondary">Quality Content</Badge>
                  <Badge variant="secondary">Expert Insights</Badge>
                  <Badge variant="secondary">Community First</Badge>
                  <Badge variant="secondary">Innovation Focus</Badge>
                </div>
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

          {/* Timeline Section */}
          <section className="container py-16">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Our Journey
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                From a small idea to a global platform, here's how we've grown.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  return (
                    <div key={milestone.year} className="flex gap-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono">{milestone.year}</Badge>
                          <h3 className="font-display text-xl font-semibold text-foreground">
                            {milestone.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="container py-16">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Meet Our Team
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind TheNarrative's success.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <Card key={member.name} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.achievements.map((achievement, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-center gap-3">
                      {member.social.twitter && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Twitter className="h-4 w-4" />
                        </Button>
                      )}
                      {member.social.linkedin && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )}
                      {member.social.github && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contributors Section */}
          <section className="container py-16">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Our Contributors
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Industry experts sharing their knowledge and experience.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {authors.slice(0, 8).map((author, index) => (
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

          {/* Contact Section */}
          <section className="container py-16">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="font-display text-2xl">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Have a story idea, partnership opportunity, or just want to say hello?
                  We'd love to hear from you.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email Us</p>
                      <p className="text-sm text-muted-foreground">hello@thenarrative.dev</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="gap-2">
                    <Twitter className="h-4 w-4" />
                    Follow Us
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
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

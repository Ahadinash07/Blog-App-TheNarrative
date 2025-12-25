import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone, Send, MessageSquare, Briefcase, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@thenarrative.com',
      href: 'mailto:hello@thenarrative.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
  ];

  const contactReasons = [
    {
      icon: MessageSquare,
      title: 'General Inquiry',
      description: 'Questions about our content or platform',
    },
    {
      icon: Briefcase,
      title: 'Business & Partnerships',
      description: 'Sponsorships, collaborations, and advertising',
    },
    {
      icon: HelpCircle,
      title: 'Support',
      description: 'Technical issues or account help',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - TheNarrative</title>
        <meta name="description" content="Get in touch with TheNarrative team. We'd love to hear from you about partnerships, feedback, or general inquiries." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
            <div className="container relative">
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
                  Let's Start a
                  <span className="text-gradient block mt-2">Conversation</span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground animate-slide-up">
                  Have a question, feedback, or want to collaborate? We'd love to hear from you.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Reasons */}
          <section className="container pb-12">
            <div className="grid gap-6 md:grid-cols-3">
              {contactReasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <div
                    key={reason.title}
                    className="card-elevated rounded-xl p-6 text-center animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {reason.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact Form & Info */}
          <section className="container py-12">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="card-elevated rounded-xl p-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Send us a message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          setFormData({ ...formData, subject: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="partnership">Business & Partnerships</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="writing">Write for Us</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us what's on your mind..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card-elevated rounded-xl p-8">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    {contactInfo.map((info) => {
                      const Icon = info.icon;
                      const content = (
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{info.label}</p>
                            <p className="font-medium text-foreground">{info.value}</p>
                          </div>
                        </div>
                      );

                      if (info.href) {
                        return (
                          <a
                            key={info.label}
                            href={info.href}
                            className="block hover:opacity-80 transition-opacity"
                          >
                            {content}
                          </a>
                        );
                      }

                      return <div key={info.label}>{content}</div>;
                    })}
                  </div>
                </div>

                <div className="card-elevated rounded-xl p-8">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    Write for TheNarrative
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you an expert in your field? We're always looking for talented 
                    writers to contribute to our publication.
                  </p>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;

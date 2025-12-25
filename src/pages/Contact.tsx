import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone, Send, MessageSquare, Briefcase, HelpCircle, Clock, Twitter, Linkedin, Github, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
    company: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '', company: '', phone: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@thenarrative.dev',
      href: 'mailto:hello@thenarrative.dev',
      description: 'General inquiries and support'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
      description: 'Global team, remote-first'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      description: 'Mon-Fri, 9AM-6PM PST'
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: 'Within 24 hours',
      description: 'We typically respond within one business day'
    },
  ];

  const contactReasons = [
    {
      icon: MessageSquare,
      title: 'General Inquiry',
      description: 'Questions about our content or platform',
      email: 'hello@thenarrative.dev'
    },
    {
      icon: Briefcase,
      title: 'Business & Partnerships',
      description: 'Sponsorships, collaborations, and advertising',
      email: 'business@thenarrative.dev'
    },
    {
      icon: HelpCircle,
      title: 'Technical Support',
      description: 'Account issues, bugs, or technical problems',
      email: 'support@thenarrative.dev'
    },
  ];

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/thenarrative', handle: '@thenarrative' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/thenarrative', handle: 'TheNarrative' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/thenarrative', handle: 'thenarrative' },
    { icon: Globe, label: 'Website', href: 'https://thenarrative.dev', handle: 'thenarrative.dev' },
  ];

  const faqs = [
    {
      question: 'How can I contribute an article?',
      answer: 'We welcome contributions from industry experts. Send us your article pitch to hello@thenarrative.dev with your background and proposed topic.'
    },
    {
      question: 'Do you offer sponsored content?',
      answer: 'Yes, we work with select partners on sponsored content that aligns with our editorial standards. Contact business@thenarrative.dev for opportunities.'
    },
    {
      question: 'How do I report a bug or technical issue?',
      answer: 'Please use our contact form with "Technical Support" as the subject, or email support@thenarrative.dev with details about the issue.'
    },
    {
      question: 'Can I republish your articles?',
      answer: 'We allow limited republication with proper attribution and a link back to the original article. Contact us for permission.'
    },
    {
      question: 'Do you offer internships or job opportunities?',
      answer: 'We occasionally have openings for writers, editors, and developers. Check our careers page or contact us about current opportunities.'
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
                  Our team is here to help.
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
                  <Card key={reason.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {reason.description}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${reason.email}`}>Email Us</a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Contact Form & Info */}
          <section className="container py-12">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Form */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-2xl">Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name *</Label>
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
                          <Label htmlFor="email">Email Address *</Label>
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

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            placeholder="Your Company"
                            value={formData.company}
                            onChange={(e) =>
                              setFormData({ ...formData, company: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) =>
                            setFormData({ ...formData, subject: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="What can we help you with?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="partnership">Business & Partnerships</SelectItem>
                            <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="writing">Write for Us</SelectItem>
                            <SelectItem value="press">Press & Media</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
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
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info & Social */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {contactInfo.map((info) => {
                      const Icon = info.icon;
                      const content = (
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{info.label}</p>
                            <p className="text-sm text-muted-foreground">{info.description}</p>
                            <p className="text-sm font-medium">{info.value}</p>
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Follow Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          >
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{social.label}</p>
                              <p className="text-xs text-muted-foreground">{social.handle}</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Write for TheNarrative</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Are you an expert in your field? We're always looking for talented
                      writers to contribute to our publication.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:hello@thenarrative.dev?subject=Write for Us">Learn More</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="container py-16">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Quick answers to common questions about working with us.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Collapsible
                    key={index}
                    open={expandedFaq === `faq-${index}`}
                    onOpenChange={(open) => setExpandedFaq(open ? `faq-${index}` : null)}
                  >
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-left text-lg">{faq.question}</CardTitle>
                            {expandedFaq === `faq-${index}` ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
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

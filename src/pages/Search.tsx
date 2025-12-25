import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SemanticSearch from '@/components/SemanticSearch';

const Search = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Discover Articles
              </h1>
              <p className="text-lg text-muted-foreground">
                Search through our collection of articles using AI-powered semantic search
              </p>
            </div>
            <SemanticSearch />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
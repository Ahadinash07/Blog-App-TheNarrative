import { Link } from 'react-router-dom';
import { Users, FileText, ExternalLink, Twitter } from 'lucide-react';
import { Author } from '@/types/blog';
import { Button } from '@/components/ui/button';

interface AuthorCardProps {
  author: Author;
  variant?: 'default' | 'compact';
}

const AuthorCard = ({ author, variant = 'default' }: AuthorCardProps) => {
  if (variant === 'compact') {
    return (
      <Link
        to={`/author/${author.id}`}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <img
          src={author.avatar}
          alt={author.name}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm truncate">
            {author.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {author.postsCount} articles
          </p>
        </div>
      </Link>
    );
  }

  return (
    <article className="group card-elevated rounded-xl p-6 hover:shadow-elevated transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <Link to={`/author/${author.id}`}>
          <img
            src={author.avatar}
            alt={author.name}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-background shadow-soft group-hover:ring-primary/20 transition-all"
          />
        </Link>
        
        <Link to={`/author/${author.id}`}>
          <h3 className="mt-4 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {author.name}
          </h3>
        </Link>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {author.bio}
        </p>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {author.postsCount} posts
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {author.followersCount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          {author.twitter && (
            <a
              href={`https://twitter.com/${author.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
            </a>
          )}
          {author.website && (
            <a
              href={`https://${author.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
          <Link to={`/author/${author.id}`}>
            <Button variant="secondary" size="sm">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default AuthorCard;

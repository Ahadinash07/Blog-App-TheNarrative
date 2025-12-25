import { Clock } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface ReadingTimeEstimatorProps {
  readingTime?: number;
  content?: string;
  className?: string;
}

const ReadingTimeEstimator = ({ readingTime, content, className = '' }: ReadingTimeEstimatorProps) => {
  const user = useAppSelector((state) => state.blog.currentUser);
  const readingSpeed = user?.readingSpeed || 200; // Default 200 WPM

  let estimatedMinutes = readingTime || 5; // Default fallback

  if (content && !readingTime) {
    // Calculate from content if readingTime not provided
    const wordCount = content.split(/\s+/).length;
    estimatedMinutes = Math.ceil(wordCount / readingSpeed);
  }

  const difficulty = estimatedMinutes > 10 ? 'Long read' :
                    estimatedMinutes > 5 ? 'Medium read' : 'Quick read';

  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      <Clock className="h-4 w-4" />
      <span>{estimatedMinutes} min read</span>
      <span className="text-xs">•</span>
      <span className="text-xs">{difficulty}</span>
    </div>
  );
};

export default ReadingTimeEstimator;
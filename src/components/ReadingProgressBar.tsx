import { useAppSelector } from '@/store/hooks';

const ReadingProgressBar = () => {
  const progress = useAppSelector((state) => state.blog.ui.readingProgress);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-muted">
      <div
        className="h-full reading-progress transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
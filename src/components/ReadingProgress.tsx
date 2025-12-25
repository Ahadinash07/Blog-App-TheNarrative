import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setReadingProgress } from '@/store/blogSlice';

const ReadingProgress = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const progress = Math.min(100, Math.max(0, scrollPercent));
      dispatch(setReadingProgress({ progress }));
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, [dispatch]);

  return null; // Progress is now managed globally
};

export default ReadingProgress;

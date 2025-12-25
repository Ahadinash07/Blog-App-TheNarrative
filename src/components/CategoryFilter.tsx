import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedCategory } from '@/store/blogSlice';
import { Button } from '@/components/ui/button';

const CategoryFilter = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.blog.categories);
  const selectedCategory = useAppSelector((state) => state.blog.selectedCategory);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => dispatch(setSelectedCategory(null))}
        className="rounded-full"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => dispatch(setSelectedCategory(category))}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;

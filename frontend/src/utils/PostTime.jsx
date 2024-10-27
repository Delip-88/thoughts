import { formatDistanceToNow } from 'date-fns';

const PostTime = ({ createdAt }) => {
  const date = new Date(Number(createdAt)); // Convert to Date

  // Format the date distance and remove "about" if present
  const timeAgo = formatDistanceToNow(date, { addSuffix: true }).replace(/^about\s/, '');

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      {isNaN(date) ? 'Invalid date' : timeAgo}
    </div>
  );
};


export default PostTime
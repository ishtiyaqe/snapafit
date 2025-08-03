import React, { useState } from 'react';
import BaseLayout from '../components/BaseLayout';
import PostList from '../components/PostList';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <BaseLayout>
      <div className='max-w-screen bg-white mx-auto'>
        <h1 className="text-gradient3 mt-10 font-black text-3xl text-center">Blog</h1>
        <div className="flex justify-center mt-4 px-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search posts..."
            className="border rounded-md p-2 w-full max-w-md"
          />
        </div>
        <PostList searchQuery={searchQuery} />
      </div>
    </BaseLayout>
  );
};

export default BlogPage;

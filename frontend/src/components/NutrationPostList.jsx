import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PostList = ({ searchQuery }) => {
    const [posts, setPosts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    useEffect(() => {
        setPosts([]); // Clear previous posts data
        fetchPosts(`http://localhost:8000/api/search_nutration_blog_post/?q=${searchQuery}`);
    }, [searchQuery]);

    const fetchPosts = async (url) => {
        try {
            const response = await axios.get(url);
            setPosts(response.data.results);
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <div className='mt-10 px-4 mb-10'>
            <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-5'>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="post w-full px-4">
                            <Link to={`/nutrition-post/${post.id}`}>
                            <img src={`http://localhost:8000${post.image}`} className='h-96 w-full rounded-md object-cover' alt={post.title} />
                            <h2 className='px-2 text-xl font-semibold text-gradient3'>{post.title}</h2>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No posts found</p>
                )}
            </div>
            <div className="pagination">
                {previousPage && (
                    <button className='bg-violet-600 text-white p-4 rounded-lg w-full font-semibold text-3xl mt-10 mb-10' onClick={() => fetchPosts(previousPage)}>Previous</button>
                )}
                {nextPage && (
                    <button className='bg-violet-600 text-white p-4 rounded-lg w-full font-semibold text-3xl mt-10 mb-10' onClick={() => fetchPosts(nextPage)}>Next</button>
                )}
            </div>
        </div>
    );
};

export default PostList;

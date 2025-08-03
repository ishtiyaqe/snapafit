// src/components/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import clients from './api/client';
import ShareButton from './ShareButton';
import BackButtonWithImage from './BackButtonWithImage';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await clients.get(`http://localhost:8000/api/post/${id}/`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <div className="post-detail">
            <BackButtonWithImage imageSrc={`http://localhost:8000${post.image}`} title={post.title} />
            <h1 className="text-gradient3 mt-10 font-black text-3xl text-start px-4">{post.title}</h1>
            <div className="px-4">
                <div className="post-content mt-10 px-4 py-4 bg-gray-100 rounded-lg">
                    {parse(post.content)}
                </div>
                <div className="grid grid-cols-3 gap-4 px-4">
                    <button className='bg-violet-600 col-span-2 text-white p-4 rounded-lg w-full whitespace-nowrap font-semibold text-lg mt-10 mb-10'>
                        Ask Your AI Coach
                    </button>
                    <ShareButton />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;

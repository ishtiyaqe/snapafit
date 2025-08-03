import React, { useState, useEffect, useRef } from 'react';
import BaseLayout from '../AccountPage';
import instractor from '../../../assets/images/instractor.png';
import clients from '../../../components/api/client';
import { Link } from 'react-router-dom';

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const chatBoxRef = useRef(null);
    const socket = useRef(null);
    const [token, setToken] = useState(0);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchNutritionData = async () => {
            try {
                const user = await clients.get('/api/user_profiles/');
                setUsername(user.data.user);
                const response = await clients.get('/api/Token_View/');
                const t = response.data.total_token;
                setToken(t);
            } catch (error) {
                console.log('Failed to load nutrition data');
            }
        };

        fetchNutritionData();
    }, []);

    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:8000/ws/chat/');
        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };
        return () => {
            socket.current.close();
        };
    }, []);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (socket.current && message.trim()) {
            socket.current.send(
                JSON.stringify({
                    message,
                    user: 'user', // replace with actual user identifier
                })
            );
            setMessage('');
        }
    };

    // Function to handle key press (Enter key)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <BaseLayout>
            <div className="px-4 mb-10">
                <h2 className="text-gradient3 font-black text-3xl text-center">Chat with your coach</h2>
                <div className="mb-4 mt-4">
                    <img
                        src={instractor}
                        alt="Coach"
                        className="w-24 h-24 rounded-full mx-auto"
                    />
                </div>

                {/* Chat Box */}
                <div
                    className="bg-gray-100 rounded-lg p-4 h-72 mb-4 overflow-y-auto"
                    ref={chatBoxRef}
                    key={messages.length} // Adding a key to trigger re-render
                >
                    {messages.map((msg, index) => {
                        const date = new Date(msg.timestamp);
                        const formattedDate = date.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                        });
                        const formattedTime = date.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        });
                        const alignmentClass = msg.user === username ? 'justify-end' : 'justify-start';
                        const backgroundColorClass = msg.user === username ? 'bg-blue-800' : 'bg-green-800';
                        
                        return (
                            <div key={index} className={`grid ${alignmentClass}`}>
                                <div className={`${backgroundColorClass} text-white rounded-lg p-2 m-1 max-w-xs`}>
                                    {msg.message}
                                </div>
                                <div className={`grid px-2 ${alignmentClass}`}>
                                    <div className="text-xs text-gray-400 flex justify-between min-w-32">
                                        <div>{formattedDate}</div>
                                        <div>{formattedTime}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Message Input */}
                <div className="relative mb-2">
                    <input
                        type="text"
                        placeholder="Message coach..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress} // Handle "Enter" key
                        className="w-full py-2 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={sendMessage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>

                {/* Token Information */}
                <div className="flex justify-between text-sm text-gray-500">
                    <span>{token} tokens left</span>
                    <Link to={'/get_more_token'} className="text-purple-500 hover:underline">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Get more credits
                    </Link>
                </div>
            </div>
        </BaseLayout>
    );
};

export default ChatPage;

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import {
    deleteMessageForMeThunk,
    deleteMessageForEveryoneThunk
} from '../../store/slice/message/message.thunk.js';
import { useState } from 'react';

function Message({ messageDetails }) {
    const dispatch = useDispatch();
    const { userProfile, selectedUser } = useSelector(state => state.userSlice)
    const isSentByMe = userProfile?._id === messageDetails.senderId;
    const formattedDateTime = format(new Date(messageDetails.createdAt), 'MMMM d, yyyy h:mm a')
    const [showOptions, setShowOptions] = useState(false);

    const handleDeleteForMe = () => {
        dispatch(deleteMessageForMeThunk(messageDetails._id));
        setShowOptions(false);
    };

    const handleDeleteForEveryone = () => {
        dispatch(deleteMessageForEveryoneThunk(messageDetails._id));
        setShowOptions(false);
    };

    return (
        <div className={`relative group ${isSentByMe ? 'chat-end' : 'chat-start'}`}>
            <div 
                className={`chat ${isSentByMe ? 'chat-end' : 'chat-start'} cursor-pointer`} 
                onClick={() => setShowOptions(prev => !prev)}
            >
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="User avatar"
                            src={isSentByMe ? userProfile?.avatar : selectedUser?.avatar}
                        />
                    </div>
                </div>
                <div className="chat-header">
                    <time className="text-xs opacity-50">{formattedDateTime}</time>
                </div>
                {messageDetails?.imageUrl ? (
                    <div className="chat-bubble bg-transparent p-0 max-w-[80%]">
                        <div className="relative">
                            <img
                                src={messageDetails.imageUrl}
                                alt="Sent image"
                                className="rounded-lg object-cover max-h-64 w-auto"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    minWidth: '150px',
                                    minHeight: '150px'
                                }}
                                loading="lazy"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="chat-bubble">{messageDetails?.message}</div>
                )}
            </div>

            {showOptions && (
                <div className={`absolute ${isSentByMe ? 'right-0' : 'left-0'} bottom-full mb-2 z-10`}>
                    <div className="bg-gray-700 text-white rounded-lg shadow-lg overflow-hidden">
                        <button
                            className="block px-4 py-2 hover:bg-gray-600 w-full text-left transition-colors"
                            onClick={handleDeleteForMe}
                        >
                            Delete for Me
                        </button>
                        {isSentByMe && (
                            <button
                                className="block px-4 py-2 hover:bg-gray-600 w-full text-left transition-colors"
                                onClick={handleDeleteForEveryone}
                            >
                                Delete for Everyone
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Message
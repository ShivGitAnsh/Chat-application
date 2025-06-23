import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

function Message({messageDetails}) {
    // console.log(messageDetails)

    const {userProfile, selectedUser} = useSelector(state => state.userSlice)
     const isSentByMe = userProfile?._id === messageDetails.senderId;

       
    const formattedDateTime = format(new Date(messageDetails.createdAt), 'MMMM d, yyyy h:mm a')
    return (
        <>
            <div className={`chat ${isSentByMe ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src={isSentByMe ? userProfile?.avatar : selectedUser?.avatar} />
                    </div>
                </div>
                <div className="chat-header">
                    <time className="text-xs opacity-50">{formattedDateTime}</time>
                </div>
                <div className="chat-bubble">{messageDetails?.message}</div>
            </div>
           
        </>
    )
}

export default Message
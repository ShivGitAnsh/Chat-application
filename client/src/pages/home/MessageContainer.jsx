import React, { useEffect } from 'react';
import User from './User';
import Message from './Message';
import { IoIosSend } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { getMessageThunk } from '../../store/slice/message/message.thunk';
import SendMessage from './SendMessage';

function MessageContainer() {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(state => state.userSlice);
  const { messages } = useSelector(state => state.messageSlice)

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ receiverId: selectedUser._id }));
    }
  }, [selectedUser, dispatch]);

  if (!selectedUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-800">
        <div className="text-center p-8 max-w-md">
          <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">No conversation selected</h2>
          <p className="text-gray-400">Please select a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen w-full flex flex-col bg-gray-800'>
      {/* Header with user info */}
      <div className='p-4 border-b border-gray-700 bg-gray-900'>
        <User userDetails={selectedUser} />
      </div>

      {/* Messages area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800'>
        {messages?.map(messageDetails => {
          return (
            <Message key={messageDetails?._id} messageDetails = {messageDetails} />
          )
        })}
        {/* Additional messages would go here */}
      </div>

      {/* Message input */}
      <SendMessage/>
      </div>
  );
}

export default MessageContainer;
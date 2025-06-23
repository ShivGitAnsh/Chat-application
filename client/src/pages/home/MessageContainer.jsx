import React, { useEffect, useRef, useState, useCallback } from 'react';
import User from './User';
import Message from './Message';
import SendMessage from './SendMessage';
import { useDispatch, useSelector } from 'react-redux';
import { getMessageThunk } from '../../store/slice/message/message.thunk';
import { clearMessages } from '../../store/slice/message/message.slice';

function MessageContainer() {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(state => state.userSlice);
  const { messages, hasMore } = useSelector(state => state.messageSlice);

  const containerRef = useRef(null);
  const observer = useRef(null);
  const [page, setPage] = useState(1);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  const loadOlderMessages = useCallback(() => {
    if (hasMore && selectedUser) {
      if (containerRef.current) {
        setPrevScrollHeight(containerRef.current.scrollHeight);
      }
      dispatch(getMessageThunk({ receiverId: selectedUser._id, page: page + 1 }));
      setPage(prev => prev + 1);
    }
  }, [dispatch, selectedUser, page, hasMore]);

  const observeTopMessage = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            loadOlderMessages();
          }
        },
        { threshold: 1 }
      );

      if (node) observer.current.observe(node);
    },
    [loadOlderMessages, hasMore]
  );

  useEffect(() => {
    if (selectedUser?._id) {
      setPage(1);
      dispatch(clearMessages());
      dispatch(getMessageThunk({ receiverId: selectedUser._id, page: 1 }));
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    if (page === 1 && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, page]);

  useEffect(() => {
    if (page > 1 && containerRef.current && prevScrollHeight > 0) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
    }
  }, [messages, page]);

  if (!selectedUser) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-800 text-gray-300">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-indigo-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-indigo-200">No User Selected</h2>
          <p className="text-gray-400">
            Please select a user to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen w-full flex flex-col bg-gray-800'>
      <div className='p-4 border-b border-gray-700 bg-gray-900'>
        <User userDetails={selectedUser} />
      </div>

      <div ref={containerRef} className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800'>
        {messages.map((msg, index) => {
          const isFirst = index === 0;
          return (
            <div ref={isFirst ? observeTopMessage : null} key={msg._id}>
              <Message messageDetails={msg} />
            </div>
          );
        })}
      </div>

      <SendMessage />
    </div>
  );
}

export default MessageContainer;
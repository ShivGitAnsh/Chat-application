import React, { useState, useRef, useEffect } from 'react';
import { IoIosSend } from 'react-icons/io';
import { FiImage } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageThunk } from '../../store/slice/message/message.thunk.js';
import { axiosInstance } from '../../components/utilities/axiosInstance.js';
import { toast } from 'react-hot-toast';

const SendMessage = () => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { selectedUser, userProfile } = useSelector(state => state.userSlice);
  const { socket } = useSelector(state => state.socketSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socket) return;

    socket.emit('typing', {
      to: selectedUser?._id,
      from: userProfile?._id
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', {
        to: selectedUser?._id,
        from: userProfile?._id
      });
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    dispatch(sendMessageThunk({
      receiverId: selectedUser?._id,
      message
    }));

    if (socket) {
      socket.emit('stop_typing', {
        to: selectedUser?._id,
        from: userProfile?._id
      });
    }

    setMessage('');
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = res.data.imageUrl;

      dispatch(sendMessageThunk({
        receiverId: selectedUser?._id,
        imageUrl
      }));
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  return (
    <div className='w-full p-4 bg-gray-900 border-t border-gray-700'>
      <div className='flex gap-3'>
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          onChange={handleTyping}
          value={message}
        />

        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <div className="flex gap-2">
          <button
            onClick={handleImageUploadClick}
            className="btn bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
          >
            <FiImage className="text-xl" />
          </button>
          <button
            onClick={handleSendMessage}
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
          >
            <IoIosSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;

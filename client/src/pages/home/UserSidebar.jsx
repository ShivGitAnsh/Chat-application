import React, { useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import User from './User';
import { useDispatch, useSelector } from 'react-redux';
import { getOtherUsersThunk, logoutUserThunk } from '../../store/slice/user/user.thunk';
import { axiosInstance } from '../../components/utilities/axiosInstance';
import SummaryDialog from './SummaryDialog';
import toast from 'react-hot-toast';

function UserSidebar() {
  const { unreadMessages } = useSelector(state => state.messageSlice);
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [showSummary, setShowSummary] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { otherUsers, userProfile } = useSelector(state => state.userSlice);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk());
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const generateSummary = async () => {
  if (isGenerating) return;
  
  setIsGenerating(true);
  
  try {
    console.log("Current unreadMessages:", unreadMessages);

    // Safely get user IDs with unread messages
    const userIds = unreadMessages ? Object.keys(unreadMessages) : [];
    
    // Prepare messages for summarization with robust error handling
    const messagesToSummarize = userIds.reduce((acc, userId) => {
      try {
        // Safely access the messages array
        const userMessages = unreadMessages[userId];
        if (!Array.isArray(userMessages) || userMessages.length === 0) {
          return acc;
        }

        // Process messages with null checks
        const validMessages = userMessages
          .map(m => m?.message) // Safely access content
          .filter(content => typeof content === 'string' && content.trim().length > 0);

        if (validMessages.length === 0) {
          return acc;
        }

        const user = otherUsers?.find(u => u._id === userId);
        
        return [
          ...acc,
          {
            userId,
            senderName: user?.fullName || 'Unknown',
            messages: validMessages.join("\n")
          }
        ];
      } catch (error) {
        console.error(`Error processing messages for user ${userId}:`, error);
        return acc;
      }
    }, []);

    if (messagesToSummarize.length === 0) {
      toast.success("No unread messages to summarize.");
      setIsGenerating(false);
      return;
    }

    // Debug log to verify the payload being sent
    console.log("Payload being sent to API:", messagesToSummarize);

    const res = await axiosInstance.post("/summarize/summarize-unread", {
      conversations: messagesToSummarize
    });

    setSummaries(res.data.summaries || []);
    setShowSummary(true);
  } catch (err) {
    console.error("Summary generation error:", err);
    toast.error("Failed to generate summary. Please check console for details.");
  } finally {
    setIsGenerating(false);
  }
};

  useEffect(() => {
    if (!searchValue) {
      setUsers(otherUsers || []);
    } else {
      setUsers((otherUsers || []).filter(user => {
        return user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchValue.toLowerCase());
      }));
    }
  }, [searchValue, otherUsers]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(getOtherUsersThunk());
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [dispatch]);

  return (
    <div className="w-[20em] flex flex-col bg-gray-900 border-r border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-400">CHATTR BOX</h1>
      </div>
      
      {/* Summarize Section */}
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-indigo-950 border-b border-indigo-700 bg-indigo-900 text-white font-medium shadow-sm rounded-md mx-3 mt-3 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={generateSummary}
      >
        <span className="text-xl">📄</span>
        <span className="text-sm sm:text-base">
          {isGenerating ? 'Generating...' : 'Summarize Unread Messages'}
        </span>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="search"
            placeholder="Search"
            className="w-full bg-gray-800 text-gray-200 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <IoIosSearch className="absolute left-3 top-2.5 text-gray-400 text-xl" />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 flex flex-col gap-3">
        {users?.map(userDetails => (
          <User key={userDetails._id} userDetails={userDetails} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className='flex items-center gap-3'>
              <div className="avatar">
                <div className="w-10 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-800">
                  <img
                    src={userProfile?.avatar}
                    alt="User avatar"
                  />
                </div>
              </div>
              <h2>{userProfile?.username}</h2>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white btn-sm px-4"
          >
            Logout
          </button>
        </div>
      </div>
      
      <SummaryDialog
        isOpen={showSummary} 
        onClose={() => setShowSummary(false)} 
        summaries={summaries} 
      />
    </div>
  );
}

export default UserSidebar;
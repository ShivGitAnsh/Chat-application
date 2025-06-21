import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../store/slice/user/user.slice';

function User({ userDetails }) {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(state => state.userSlice);
    const { onlineUsers } = useSelector(state => state.socketSlice);
    const isUserOnline = onlineUsers?.includes(userDetails?._id);

    const handleUserClick = () => {
        dispatch(setSelectedUser(userDetails));
    };

    return (
        <div 
            onClick={handleUserClick} 
            className={`flex gap-5 items-center hover:bg-gray-700 rounded-lg py-1 px-2 cursor-pointer ${
                userDetails?._id === selectedUser?._id ? 'bg-gray-700' : ''
            }`}
        >
            <div className="relative w-12 h-12">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    {userDetails?.avatar ? (
                        <img
                            src={userDetails.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral text-neutral-content flex items-center justify-center">
                            <span className="text-xl">AI</span>
                        </div>
                    )}
                </div>
                {isUserOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                )}
            </div>
            <div>
                <h2 className="line-clamp-1">{userDetails?.fullName}</h2>
                <p className="text-xs text-gray-400">{userDetails?.username}</p>
            </div>
        </div>
    );
}

export default User;

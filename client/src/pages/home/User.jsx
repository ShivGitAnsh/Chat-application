import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, setUserTyping, removeUserTyping } from '../../store/slice/user/user.slice';
import { clearUnreadMessagesForUser } from '../../store/slice/message/message.slice.js';
import { useEffect } from 'react';

function User({ userDetails }) {
    const dispatch = useDispatch();
    const { selectedUser, typingUsers } = useSelector(state => state.userSlice);
    const { onlineUsers, socket } = useSelector(state => state.socketSlice);
    const { unreadMessages } = useSelector(state => state.messageSlice);
    const isUserOnline = onlineUsers?.includes(userDetails?._id);

    const handleUserClick = () => {
        dispatch(setSelectedUser(userDetails));
        dispatch(clearUnreadMessagesForUser(userDetails._id));
    };

    const hasUnread = unreadMessages[userDetails._id]?.length > 0;


    useEffect(() => {
        if (!socket || !userDetails?._id) return;

        socket.on("typing", ({ from }) => {
            dispatch(setUserTyping(from));
        });

        socket.on("stop_typing", ({ from }) => {
            dispatch(removeUserTyping(from));
        });

        return () => {
            socket.off("typing");
            socket.off("stop_typing");
        };
    }, [socket, userDetails?._id]);

    return (
        <div
            onClick={handleUserClick}
            className={`flex gap-5 items-center hover:bg-gray-700 rounded-lg py-1 px-2 cursor-pointer ${userDetails?._id === selectedUser?._id ? 'bg-gray-700' : ''
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

                {typingUsers.includes(userDetails?._id) && (
                    <p className="text-xs text-indigo-400 animate-pulse">typing...</p>
                )}

                {hasUnread && !typingUsers.includes(userDetails?._id) && (
                <p className="text-xs text-green-500 font-semibold">new messages</p>
                )}
            </div>
        </div>
    );
}

export default User;

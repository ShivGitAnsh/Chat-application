import React, { useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageThunk } from '../../store/slice/message/message.thunk';

const SendMessage = () => {

    const [message, setMessage] = useState('');
    const {selectedUser} = useSelector(state => state.userSlice)

    const dispatch = useDispatch()

    const handleSendMessage = () => {
       dispatch(sendMessageThunk({
        receiverId:selectedUser?._id,
        message    
    }))
    setMessage('');
    }
  return (
    <div className='w-full p-4 bg-gray-900 border-t border-gray-700'>
        <div className='flex gap-3'>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            onChange={e => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage} className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
            <IoIosSend className="text-xl" />
          </button>
        </div>
      </div>
  )
}

export default SendMessage
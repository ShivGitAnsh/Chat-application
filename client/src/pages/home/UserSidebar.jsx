import React, { useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import User from './User';
import { useDispatch, useSelector } from 'react-redux';
import { getOtherUsersThunk, logoutUserThunk } from '../../store/slice/user/user.thunk';


function UserSidebar() {

  const [searchValue, setSearchValue] = useState('')
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()
  const {otherUsers, userProfile} = useSelector(state => state.userSlice)
  
  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
  }

  useEffect(() => {
    if(!searchValue){
      setUsers(otherUsers)
    }else{
      setUsers(otherUsers.filter(user => {
        return user.username.toLowerCase().includes(searchValue.toLowerCase())||
        user.fullName.toLowerCase().includes(searchValue.toLowerCase());

      }))
    }

  },[searchValue, otherUsers])

  useEffect(() => {
     (
      async() => {
        await dispatch(getOtherUsersThunk())
      }
     )();
  },[])

  return (
    <div className="w-[20em] flex flex-col bg-gray-900 border-r border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-400">CHATTR BOX</h1>
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
        {users?.map(userDetails=>{
          return <User key={userDetails._id} userDetails ={userDetails} />
        })}
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
          <button onClick = {handleLogout} className="btn bg-indigo-600 hover:bg-indigo-700 text-white btn-sm px-4">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSidebar;
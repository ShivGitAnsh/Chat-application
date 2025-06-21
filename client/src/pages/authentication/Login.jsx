import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FaKey } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { loginUserThunk } from '../../store/slice/user/user.thunk';

const Login = () => {

    const { isAuthenticated } = useSelector(
        (state) => state.userSlice
      );

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const  [loginData, setLoginData] = useState({
        username: "",
        password: ""
    })

    useEffect(() => {
      if(isAuthenticated){
        navigate("/")
      }
    },[isAuthenticated])

    const handleInputChange = (e) => {
        setLoginData({
            ...loginData,[e.target.name] : e.target.value
        })
    }


    const handleLogin = async () => {
        const response = await dispatch(loginUserThunk(loginData))
        if(response?.payload?.success){
            navigate('/')
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-900 p-4'>
            <div className='flex flex-col gap-6 items-center bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-700'>
                <div className='text-center'>
                    <h2 className='text-2xl font-semibold text-white mb-1'>Login</h2>
                    <p className='text-gray-400 text-sm'>Enter your credentials to continue</p>
                </div>

                <div className='w-full space-y-4'>
                    <label className="flex flex-col gap-1">
                        <span className='text-sm font-medium text-gray-300'>Username</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FaUser className="text-sm" />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="Enter username"
                                minLength="4"
                                name = "username"
                                maxLength="20"
                                pattern="[a-zA-Z0-9]+"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                              onChange={handleInputChange}
                              />
                        </div>
                        <p className="text-xs text-gray-500">
                            4-20 characters (letters and numbers only)
                        </p>
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className='text-sm font-medium text-gray-300'>Password</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FaKey className="text-sm" />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="Enter password"
                                minLength="8"
                                name="password"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                                 onChange={handleInputChange}
                                 />
                        </div>
                        <p className="text-xs text-gray-500">
                            8+ chars with uppercase, lowercase, and number
                        </p>
                    </label>
                </div>

                <div className='w-full space-y-3'>
                    <button onClick={handleLogin} className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                        Sign In
                    </button>
                </div>
                <p className='text-gray-200'>
                    Already have an account?  
                    <Link to = '/signup' className='text-blue-400'> Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
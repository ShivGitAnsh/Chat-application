import React, { useEffect, useState } from 'react';
import { FaUser, FaKey, FaEnvelope, FaIdCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserThunk } from '../../store/slice/user/user.thunk';
import toast from 'react-hot-toast';

const Signup = () => {

    const { isAuthenticated } = useSelector(
            (state) => state.userSlice
          );

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [signUpData, setSignUpData] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "male"
    })

    useEffect(() => {
          if(isAuthenticated){
            navigate("/")
          }
        },[isAuthenticated])


    const handleInputChange = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value
        })
    }

    const handleSignup = async () => {
        if(signUpData.password !== signUpData.confirmPassword){
            toast.error("Password and Confirm Password do not match")
            return;
        }
        const response = await dispatch(registerUserThunk(signUpData))
        if(response?.payload?.success){
            navigate('/')
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-900 p-4'>
            <div className='flex flex-col gap-6 items-center bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-700'>
                <div className='text-center'>
                    <h2 className='text-2xl font-semibold text-white mb-1'>Create Account</h2>
                    <p className='text-gray-400 text-sm'>Join us to get started</p>
                </div>

                <div className='w-full space-y-4'>
                    {/* Full Name */}
                    <label className="flex flex-col gap-1">
                        <span className='text-sm font-medium text-gray-300'>Full Name</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FaIdCard className="text-sm" />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="Enter your full name"
                                name="fullName"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                                onChange={handleInputChange} />
                        </div>
                    </label>

                    {/* Username */}
                    <label className="flex flex-col gap-1">
                        <span className='text-sm font-medium text-gray-300'>Username</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FaUser className="text-sm" />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="Choose a username"
                                minLength="4"
                                maxLength="20"
                                name="username"
                                pattern="[a-zA-Z0-9]+"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                                onChange={handleInputChange} />
                        </div>
                        <p className="text-xs text-gray-500">
                            4-20 characters (letters and numbers only)
                        </p>
                    </label>

                    {/* Password */}
                    <label className="flex flex-col gap-1">
                        <span className='text-sm font-medium text-gray-300'>Password</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FaKey className="text-sm" />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="Create password"
                                minLength="8"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                name="password"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                                onChange={handleInputChange} />
                        </div>
                        <p className="text-xs text-gray-500">
                            8+ chars with uppercase, lowercase, and number
                        </p>
                    </label>

                    {/* Confirm Password */}
                    <label className="flex flex-col gap-1">
                        <span className='text-sm font-medium text-gray-300'>Confirm Password</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FaKey className="text-sm" />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="Re-enter your password"
                                minLength="8"
                                name="confirmPassword"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                                onChange={handleInputChange} />
                        </div>
                    </label>

                    {/* Gender Selection */}
                    <label className="flex flex-col gap-1">
                        <span className='text-sm font-medium text-gray-300'>Gender</span>
                        <div className="flex gap-4 mt-1">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={signUpData.gender === "male"}
                                    onChange={handleInputChange}
                                    className="form-radio h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-gray-300">Male</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={signUpData.gender === "female"}
                                    onChange={handleInputChange}
                                    className="form-radio h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-gray-300">Female</span>
                            </label>
                        </div>
                    </label>
                </div>

                <div className='w-full space-y-3'>
                    <button onClick={handleSignup} className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                        Create Account
                    </button>
                </div>
                <p className='text-gray-200'>
                    Already have an account?  
                    <Link to="/login" className='text-blue-400 hover:underline ml-1'>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
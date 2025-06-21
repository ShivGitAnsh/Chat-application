import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast"
import { axiosInstance } from "../../../components/utilities/axiosInstance";

export const sendMessageThunk = createAsyncThunk("message/send", async ({ receiverId, message }, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post(`/message/send/${receiverId}`,{
            message
        })
        // toast.success("Login successful!!")
        return response.data
    } catch (error) {
        // console.log("Login error:", error);

    
      const errorOutput =
        error?.response?.data?.errMessage 

      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
});

export const getMessageThunk = createAsyncThunk("message/get", async ({ receiverId}, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.get(`/message/get-messages/${receiverId}`)
        // toast.success("Login successful!!")
        return response.data
    } catch (error) {
        // console.log("Login error:", error);

    
      const errorOutput =
        error?.response?.data?.errMessage 

      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
});


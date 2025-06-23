import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utilities/axiosInstance";

export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ receiverId, message, imageUrl }, { rejectWithValue }) => {
    try {
      const payload = {};
      if (message) payload.message = message;
      if (imageUrl) payload.imageUrl = imageUrl;

      const response = await axiosInstance.post(`/message/send/${receiverId}`, payload);
      return response.data;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || "Failed to send message";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);


export const getMessageThunk = createAsyncThunk(
  "message/get",
  async ({ receiverId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/message/get-messages/${receiverId}?page=${page}`
      );
      return response.data;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

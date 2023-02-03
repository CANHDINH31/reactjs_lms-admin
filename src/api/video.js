import axios from "axios";
import { baseUrl } from "../helper/configs";

export const getLastLeastVideo = async () => {
  try {
    return await axios.get(baseUrl + "/video/lastlestvideo");
  } catch (error) {
    return error;
  }
};

export const getAllVideo = async (query) => {
  try {
    if (query) {
      return await axios.get(baseUrl + "/video?title=" + query);
    } else {
      return await axios.get(baseUrl + "/video");
    }
  } catch (error) {
    return error;
  }
};

export const getVideoById = async (id) => {
  try {
    return await axios.get(baseUrl + "/video/" + id);
  } catch (error) {
    return error;
  }
};

export const createVideo = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/video", payloads);
  } catch (error) {
    return error;
  }
};

export const updateVideoById = async (id, payloads) => {
  try {
    return await axios.patch(baseUrl + "/video/" + id, payloads);
  } catch (error) {
    return error;
  }
};

export const addVideoToCourse = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/video/addVideoToCourse", payloads);
  } catch (error) {
    return error;
  }
};

export const deleteVideo = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/video/deleteVideo", payloads);
  } catch (error) {
    return error;
  }
};

export const removeVideoFromCourse = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/video/removeVideoFromCourse", payloads);
  } catch (error) {
    return error;
  }
};

import axios from "axios";
import { baseUrl } from "../helper/configs";

export const getAllCourse = async (query) => {
  try {
    if (query) {
      return await axios.get(baseUrl + "/course?title=" + query);
    } else {
      return await axios.get(baseUrl + "/course");
    }
  } catch (error) {
    return error;
  }
};

export const getLastLeastCourse = async () => {
  try {
    return await axios.get(baseUrl + "/course/lastlestcourse");
  } catch (error) {
    return error;
  }
};

export const getCourseById = async (id) => {
  try {
    return await axios.get(baseUrl + "/course/" + id);
  } catch (error) {
    return error;
  }
};

export const createCourse = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/course", payloads);
  } catch (error) {
    return error;
  }
};

export const updateCourseById = async (id, payloads) => {
  try {
    return await axios.patch(baseUrl + "/course/" + id, payloads);
  } catch (error) {
    return error;
  }
};

export const addCourseToTerm = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/course/addCourseToTerm", payloads);
  } catch (error) {
    return error;
  }
};

export const removeCourseFromTerm = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/course/removeCourseFromTerm", payloads);
  } catch (error) {
    return error;
  }
};

export const deleteCourse = async (id) => {
  try {
    return await axios.delete(baseUrl + "/course/" + id);
  } catch (error) {
    return error;
  }
};

export const deleteMultiCourse = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/course/deleteMulti", payloads);
  } catch (error) {
    return error;
  }
};

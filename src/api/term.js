import axios from "axios";
import { baseUrl } from "../helper/configs";

export const getAllTerm = async (query) => {
  try {
    if (query) {
      return await axios.get(baseUrl + "/term?title=" + query);
    } else {
      return await axios.get(baseUrl + "/term");
    }
  } catch (error) {
    return error;
  }
};

export const getLastLeastTerm = async () => {
  try {
    return await axios.get(baseUrl + "/term/lastlestterm");
  } catch (error) {
    return error;
  }
};

export const createTerm = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/term", payloads);
  } catch (error) {
    return error;
  }
};

export const getTermById = async (id) => {
  try {
    return await axios.get(baseUrl + "/term/" + id);
  } catch (error) {
    return error;
  }
};

export const updateTermById = async (id, payloads) => {
  try {
    return await axios.patch(baseUrl + "/term/" + id, payloads);
  } catch (error) {
    return error;
  }
};

export const deleteTerm = async (id) => {
  try {
    return await axios.delete(baseUrl + "/term/" + id);
  } catch (error) {
    return error;
  }
};

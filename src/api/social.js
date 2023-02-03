import axios from "axios";
import { baseUrl } from "../helper/configs";

export const getLastLeastSocial = async () => {
  try {
    return await axios.get(baseUrl + "/social/lastlestsocial");
  } catch (error) {
    return error;
  }
};

export const getAllSocial = async (query) => {
  try {
    if (query) {
      return await axios.get(baseUrl + "/social?title=" + query);
    } else {
      return await axios.get(baseUrl + "/social");
    }
  } catch (error) {
    return error;
  }
};

export const getSocialById = async (id) => {
  try {
    return await axios.get(baseUrl + "/social/" + id);
  } catch (error) {
    return error;
  }
};

export const updateSocialById = async (id, payloads) => {
  try {
    return await axios.patch(baseUrl + "/social/" + id, payloads);
  } catch (error) {
    return error;
  }
};

export const deleteSocial = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/social/deleteSocial", payloads);
  } catch (error) {
    return error;
  }
};

export const createSocial = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/social", payloads);
  } catch (error) {
    return error;
  }
};

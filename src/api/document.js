import axios from "axios";
import { baseUrl } from "../helper/configs";

export const createDocument = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/document", payloads);
  } catch (error) {
    return error;
  }
};

export const addDocumentToCourse = async (payloads) => {
  try {
    return await axios.post(
      baseUrl + "/document/addDocumentToCourse",
      payloads
    );
  } catch (error) {
    return error;
  }
};

export const getLastLeastDocument = async () => {
  try {
    return await axios.get(baseUrl + "/document/lastlestdocument");
  } catch (error) {
    return error;
  }
};

export const getAllDocument = async (query) => {
  try {
    if (query) {
      return await axios.get(baseUrl + "/document?title=" + query);
    } else {
      return await axios.get(baseUrl + "/document");
    }
  } catch (error) {
    return error;
  }
};

export const getDocumentById = async (id) => {
  try {
    return await axios.get(baseUrl + "/document/" + id);
  } catch (error) {
    return error;
  }
};

export const updateDocumentById = async (id, payloads) => {
  try {
    return await axios.patch(baseUrl + "/document/" + id, payloads);
  } catch (error) {
    return error;
  }
};

export const deleteDocument = async (payloads) => {
  try {
    return await axios.post(baseUrl + "/document/deleteDocument", payloads);
  } catch (error) {
    return error;
  }
};

export const removeDocumentFromCourse = async (payloads) => {
  try {
    return await axios.post(
      baseUrl + "/document/removeDocumentFromCourse",
      payloads
    );
  } catch (error) {
    return error;
  }
};

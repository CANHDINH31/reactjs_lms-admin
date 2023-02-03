// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: "AIzaSyCZaeACxgfCQNjfT0HvIp_AOApKapXz_JM",
  authDomain: "lms-education-8bb9c.firebaseapp.com",
  projectId: "lms-education-8bb9c",
  storageBucket: "lms-education-8bb9c.appspot.com",
  messagingSenderId: "1073037315524",
  appId: "1:1073037315524:web:7300fde293c6cbbe45a891",
});

export const storage = getStorage(app);

import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import store from "../redux/store";
import { setFcmToken } from "../redux/adminUserSlice";
const firebaseConfig = {
  apiKey: "AIzaSyDg1__Y23xsWzmIbfQRiV2WD8s2nMxvHSU",
  authDomain: "bromag-web.firebaseapp.com",
  projectId: "bromag-web",
  storageBucket: "bromag-web.appspot.com",
  messagingSenderId: "758673298399",
  appId: "1:758673298399:web:b9d8d4b4d3e3e5e8352a6a",
  measurementId: "G-36XD1B7QFE",
};


export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const getFireToken = () => {
  getToken(messaging, {
    vapidKey:
      "BL43BnIQnCwhTThzD9RK8n5pWQNZ9RkjuLtbqiIsBhF7kKQ6TwuIwg89oox8xUOFtMX7SZ6wyi4OZcDswmYglew",
  })
    .then(async (currentToken) => {
      if (currentToken) {
        console.log({ currentToken });
      
          addNotifyToken(currentToken);
      
        //
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // ...
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });
};

export function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission()
    .then(async(permission) => {
      if (permission === "granted") {
        const state=await store.getState(state=>state?.userSlice)
        console.log(state)
        if(state?.user?.fcm === null){
       await getFireToken()
        }
        console.log("Notification permission granted.");
      } else {
        console.log("PErmission Denied!!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export const addNotifyToken = async (token) => {
  try {
     await axios.post(`${process.env.REACT_APP_URL}/addFcm`, { token });
     store.dispatch(setFcmToken(token))
  } catch (error) {
    console.log(error)
  }
  
};
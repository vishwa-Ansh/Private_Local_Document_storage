// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   initializeAuth,
//   getReactNativePersistence,
// } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyCTEcxjFqk-RSwXFRzRcTTUsogr8O80ujo",
//   authDomain: "trilok-on.firebaseapp.com",
//   projectId: "trilok-on",
//   storageBucket: "trilok-on.firebasestorage.app",
//   messagingSenderId: "681818104251",
//   appId: "1:681818104251:web:2acbc38ddd8f7a9b0b649e",
//   measurementId: "G-STK9P9H8X7"
// };
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// let auth;

// try {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// } catch {
//   auth = getAuth(app);
// }

// export { app, auth };


// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   initializeAuth,
//   getReactNativePersistence,
// } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyCTEcxjFqk-RSwXFRzRcTTUsogr8O80ujo",
//   authDomain: "trilok-on.firebaseapp.com",
//   projectId: "trilok-on",
//   storageBucket: "trilok-on.firebasestorage.app",
//   messagingSenderId: "681818104251",
//   appId: "1:681818104251:web:2acbc38ddd8f7a9b0b649e",
//   measurementId: "G-STK9P9H8X7"
// };

// const app = initializeApp(firebaseConfig);

// let auth;

// try {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// } catch {
//   auth = getAuth(app);
// }

// const db = getFirestore(app);

// export { app, auth, db };


import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTEcxjFqk-RSwXFRzRcTTUsogr8O80ujo",
  authDomain: "trilok-on.firebaseapp.com",
  projectId: "trilok-on",
  storageBucket: "trilok-on.firebasestorage.app",
  messagingSenderId: "681818104251",
  appId: "1:681818104251:web:2acbc38ddd8f7a9b0b649e",
  measurementId: "G-STK9P9H8X7"
};
const app = initializeApp(firebaseConfig);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(
      AsyncStorage
    ),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export {
  app,
  auth,
  db,
  storage,
};
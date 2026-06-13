import {initializeApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"
import {getFirestore} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

const firebaseConfig={
  apiKey: "AIzaSyAB1kncVDRO7YCw9-mHyzN__lE3LFuFgoo",
  authDomain: "rodilla-dcf27.firebaseapp.com",
  projectId: "rodilla-dcf27",
  storageBucket: "rodilla-dcf27.appspot.com",
  messagingSenderId: "346664534517",
  appId: "1:346664534517:web:c6b4521362b6de3a8160bc"
}

const app=initializeApp(firebaseConfig);
export const db=getFirestore(app);
import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //Config

  apiKey: "AIzaSyB-Fzqy98NpNziu7UGoc3YQHWs6V8tIcRc",
  authDomain: "chatdemo-d7cdd.firebaseapp.com",
  databaseURL: "https://chatdemo-d7cdd.firebaseio.com",
  projectId: "chatdemo-d7cdd",
  storageBucket: "chatdemo-d7cdd.appspot.com",
  messagingSenderId: "809550924762",
  appId: "1:809550924762:web:f8eb99a292914b98560ee3",
  measurementId: "G-0ST8F7SWGS"
})

const auth =firebase.auth;
const firestore = firebase.firestore();

const [user] = useAuthState(auth);

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )

}
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>SignOut</button>
  )

}

function ChatRoom(){}

export default App;

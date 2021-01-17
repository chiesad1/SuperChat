import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //Config
  apiKey: "AIzaSyB-Fzqy98NpNziu7UGoc3YQHWs6V8tIcRc",
  authDomain: "chatdemo-d7cdd.firebaseapp.com",
  databaseURL: "https://chatdemo-d7cdd.firebaseio.com",
  projectId: "chatdemo-d7cdd",
  storageBucket: "chatdemo-d7cdd.appspot.com",
  messagingSenderId: "809550924762",
  appId: "1:809550924762:web:3244a486bf9aada5560ee3",
  measurementId: "G-DXDS5YMFNG"
})

const auth =firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();



function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
      <h1>Poopy Talk</h1>
      {user ? <ChatRoom /> : <SignIn />}
      <SignOut />
      </header>

      <section>
        
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
    <>
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    <p>Please be nice!</p>
    </>
  )

}
function SignOut() {
  return auth.currentUser && (
    <button className ="sign-out" onClick={() => auth.signOut()}>SignOut</button>
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState(''); 

  const sendMessage = async (e) => {
    e.preventDefault();
    
    const {uid,photoURL} = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }


  return(<>
  <main>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
    <span ref={dummy}></span>
  </main>

  <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice please" />

      <button type="submit" disabled={!formValue}>🕊</button>
    </form>
  </>

  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt=""/>
      <p>{text}</p>
    </div>
    </>
  )


}

export default App;

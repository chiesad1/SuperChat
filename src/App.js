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

function ChatRoom(){
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

  }


  return(
  <main>
    <div>{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}</div>


    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button type="submit">🕊</button>
      

    </form>
  </main>
  

  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>

  )


}

export default App;

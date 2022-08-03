import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from "react-firebase-hooks/firestore";
import "firebase/firestore";
firebase.initializeApp({
  apiKey: "AIzaSyBGi2wewQ8PvlYxp1KbkQct25uvwaM0IrA",
  authDomain: "bibitoinc.firebaseapp.com",
  projectId: "bibitoinc",
  storageBucket: "bibitoinc.appspot.com",
  messagingSenderId: "600768124742",
  appId: "1:600768124742:web:98772dfbe5d6a1c2e27747",
  measurementId: "G-95VQL7NW10"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Bibito inc.🤝</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      
    </div>
  );
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy("createAt")
  const [messages] = useCollectionData(query, {idField:'id'})
  const [formValue,setFormValue]= useState("")
  const dummy=useRef()
  const sendMessage = async(e)=>{
    e.preventDefault()
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue("")
    dummy.current.scrollIntoView({behavior:'smooth'})
  }
  return(
    <>
      <main>
        {messages && messages.map(msg=><ChatMessage key={msg.id} message={msg}/>)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e=>setFormValue(e.target.value)}/>
        <button type="submit">➜</button>
      </form>
    </>
  )
}

function ChatMessage(props){
  const {text,uid,photoURL}=props.message;
  const messageClass=uid === auth.currentUser.uid ? 'sent' : 'received';
   return (<div className={`message ${messageClass}`}>
    <img src={photoURL} alt={photoURL}/>
      <p>
        {text}
      </p>
    </div>)
}

function SignOut(){
  return auth.currentUser && (
     <button onClick={()=> auth.signOut()}>Sign Out</button>
  )

}

function SignIn(){
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

export default App;

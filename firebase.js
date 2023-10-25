import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOyL-3fiDCLpmSP4Omf56lJqbIsCcxkwE",
  authDomain: "task7-2d-2a00b.firebaseapp.com",
  projectId: "task7-2d-2a00b",
  storageBucket: "task7-2d-2a00b.appspot.com",
  messagingSenderId: "926687710220",
  appId: "1:926687710220:web:fa3f144f612d651b233229",
  measurementId: "G-ZVQ5MX3YL2"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);
const firebaseapp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider)
export const db = getFirestore();
export const createuserdocfromAuth = async (userAuth, additionalInformation = {}) => {
  if (!userAuth.email) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  console.log(userDocRef)


  const userSnapShots = await getDoc(userDocRef);
  console.log(userSnapShots)
  console.log(userSnapShots.exists())

  if (!userSnapShots.exists()) {
    const { displayName, email } = userAuth
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      })
    }
    catch (error) {
      console.log('error in creating', error.message)
    }

  }
  return userDocRef;
}

export async function createAuthUserWithEmailAndPassword(email, password) {
  if (!email || !password)
    return
  return await createUserWithEmailAndPassword(auth, email, password)
}

export async function signinAuthUserWithEmailAndPassword(email, password) {
  if (!email || !password)
    return
  return await signInWithEmailAndPassword(auth, email, password)
}

const initializeCollections = async () => {
  const collections = ['questions', 'articles'];

  for (const collectionName of collections) {
    try {
      // Use collection() with firestore as the first argument
      const collectionRef = collection(firestore, collectionName);
      await addDoc(collectionRef, {}); // Add an empty document to initialize the collection
      console.log(`Collection "${collectionName}" initialized.`);
    } catch (error) {
      console.error(`Error initializing collection "${collectionName}":`, error);
    }
  }
};

export { app, storage, firestore, initializeCollections };
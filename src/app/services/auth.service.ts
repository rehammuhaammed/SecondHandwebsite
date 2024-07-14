
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { collection, addDoc ,setDoc,doc} from "firebase/firestore";
import { environment } from '../environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  docData,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { ProfileUser } from '../interface/profile-user';
import { Observable, from, map } from 'rxjs';
import { profile } from 'console';
import { User } from 'firebase/auth';
import { Auth, authState } from '@angular/fire/auth';
const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
@Injectable({
  providedIn: 'root',
})
export class AuthService {

prof:ProfileUser={
  uid: '',
}
 ////-----------------------------------------------////////////////
  constructor(private fireauth: AngularFireAuth, private router: Router,private afs: AngularFirestore ) {
  }
 ////-----------------------------------------------////////////////
  getCurrentUser() {
    return this.fireauth.authState; 
  }
   ////-----------------------------------------------////////////////
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['welcome']);
        
      },err=> {
        alert("Incorrect Email or Password");
        this.router.navigate(['/login']);
      }
    );
  }

  
 ////-----------------------------------------------////////////////

 async register(email: string, password: string, name: string ,phone_num:string) : Promise<string>{
  try{
   const userCredential = await this.fireauth.createUserWithEmailAndPassword(email, password);   
      if (userCredential && userCredential.user) {
        const uid = userCredential.user.uid; 
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
          name,
          phone_num,
          email,
          userId: uid,
        });
          const wishlistRef = collection(userDocRef, 'wishlist');
          await setDoc(doc(wishlistRef), {});
          const mylistRef = collection(userDocRef, 'mylist');
          await setDoc(doc(mylistRef), {});
          const purchasesRef = collection(userDocRef, 'purchases');
          await setDoc(doc(purchasesRef), {});
          const notificationRef = collection(userDocRef, 'notification');
          await setDoc(doc(notificationRef), {});
           alert('Registration successful');
           setTimeout(() => {          
             this.router.navigate(['']);
           }, 250);
           return userCredential.user.uid;

          } else {
           this.router.navigate(['/register']);        
          }
        }
          catch(error) {
            console.error('Error registering user:', error);
            this.router.navigate(['/register']);
           throw error;

          }
          return this.prof.uid
      }

 ////-----------------------------------------------////////////////
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }
   ////-----------------------------------------------////////////////
addUser(profile: ProfileUser) {
  this.afs.collection('Additional_User').add(profile);
    }
    getCurrentuser(): Observable<string | null> {
      return this.fireauth.authState.pipe(
        map(user => user ? user.uid : null)
      );
    }
    getCurrentUserName(): Observable<string | null> {
      return this.fireauth.authState.pipe(
        map(user => (user ? user.displayName : null))
      );
  }
  getCurrentUserId(): Observable<string | null> {
    return this.fireauth.authState.pipe(
      map(user => (user ? user.uid : null))
    );
  }
}

  
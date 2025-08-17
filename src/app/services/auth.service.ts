
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { collection, addDoc ,setDoc,doc} from "firebase/firestore";
import { environment } from '../environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import jwt_decode from 'jwt-decode';
// @ts-ignore
import jwtEncode from 'jwt-encode';
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
  token=''
 currentUserData: any = null;
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
   login(email: string, password: string): Promise<void> {
  return this.fireauth.signInWithEmailAndPassword(email, password)
    .then(async (res) => {
      if (res.user) {
        const uid = res.user.uid;

        
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.currentUserData = userData; 
          localStorage.setItem("UserName",this.currentUserData.name)

          
          const payload = { 
            uid: this.currentUserData.userId, 
            name: this.currentUserData.name, 
            email: this.currentUserData.email, 
            phone_num: this.currentUserData.phone_num 
          };
          const secret = 'SECRET_KEY';
          const token = jwtEncode(payload, secret);

          
          localStorage.setItem('token', token);

          
          this.router.navigate(['welcome']);
        }
      }
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
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
        const payload = { uid, name, email, phone_num };
        const secret = 'SECRET_KEY';
         this.token = jwtEncode(payload, secret);

        // localStorage.setItem('token', token);
        
        // localStorage.setItem('token', this.token);
      
           
           const collections = ['wishlist', 'mylist', 'purchases', 'notification'];
              for (const col of collections) {
                await setDoc(doc(collection(userDocRef, col)), {});
              }

           
           setTimeout(() => {          
             this.router.navigate(['']);
           }, 1000);
           return userCredential.user.uid;

          } else {
           this.router.navigate(['/register']);        
          }
        }
          catch(error) {
            
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
        this.router.navigate(['']);
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

  
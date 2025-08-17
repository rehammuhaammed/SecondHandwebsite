import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Storage ,ref,uploadBytes,getDownloadURL, uploadBytesResumable, StorageReference,} from '@angular/fire/storage';
import { Observable, finalize, from, of, switchMap } from 'rxjs';
import { Cars } from '../interface/cars';
import { concatMap, map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ProfileUser } from '../interface/profile-user';
import { Firestore, addDoc, collection, collectionData, doc, docData, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { chat } from '../interface/chats';
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';
import { getFirestore } from "firebase/firestore";
import { promises } from 'dns';


const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
@Injectable({
  providedIn: 'root'
})
export class BossService {
  user$!: Observable<any>;
  constructor(private storage:AngularFireStorage,private afs:AngularFirestore,private afAuth: AngularFireAuth,private authService: AuthService) { }

          
//////-------------------------- upload image : -----------------------------------///////

  uploadImage(file: File): Promise<string> {
    const filePath = `images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Promise((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            resolve(url);
          }, (error) => {
            reject(error);
          });
        })
      ).subscribe();
    });
  }

  //// ------------------------ add car : -------------------------------------//

  async addCar(car: Cars) {
    car.id = this.afs.createId();
   
    const carRef = await this.afs.collection('/cars').add(car);
    const user = await this.afAuth.currentUser;
    if (user) {
      const userDocRef = this.afs.collection('users').doc(user.uid);
      const wishlistRef = userDocRef.collection('mylist');
      await wishlistRef.doc(car.id).set({
        ...car, 
      });
    } else {
      throw new Error('User not logged in');
    }

    return carRef;
  }

///////------------------------Display the Data ---------------------------------///////////

  getAllCars() {
    return this.afs.collection('/cars').snapshotChanges();    
  }

 ///////----------------------Display The Specific Car------------------------///////////

  getCarById(carId: string): Observable<Cars> {
    return this.afs.collection('/cars').doc(carId).valueChanges() as Observable<Cars>;
  }

  ////------------------------- Delete The car When Buyed ------------------------////

  deleteCar(car: Cars): Promise<void> {
    return this.afs.collection('/cars').doc(car.id).delete();
  }
  
  getAllUsers(): Observable<any[]> {
    return this.afs.collection('/Additional_User').snapshotChanges();
  }

  ////------------------------ Create Chat---------------------------------------//

async createChat(otherUserId: string, otherUserDisplayName: string, username: string): Promise<void> {
  this.authService.getCurrentUser().subscribe(currentUser => {
    if (currentUser) {
      const currentUserId = currentUser.uid;
      const userIds = [currentUserId, otherUserId];
      const userIds2 = [otherUserId,currentUserId ];
      const users = [username, otherUserDisplayName]; 
     this.afs.collection('chats', ref =>
        ref.where('userIds', '==', userIds)
      ).get().subscribe(async querySnapshot => {
        if (querySnapshot.size === 0) {
          if(1==1)
            {
              this.afs.collection('chats', ref =>
                ref.where('userIds', '==', userIds2)
              ).get().subscribe(async querySnapshot => {
                if (querySnapshot.size === 0) {
                  this.afs.collection('chats').add({
                    userIds: userIds,
                    users: users,
                    messages:[]
                }).then(() => {
                  console.log('New chat created successfully.');
                }).catch(error => {
                  console.error('Error creating new chat: ', error);
                });
                }
                else{
                  console.log('Chat already exists with these users.');
                  return;
                }
            });
          }
        } else {
          console.log('Chat already exists with these users.');
        }
      }, error => {
        console.error('Error checking for existing chat: ', error);
      });
    }
  });
}
}


import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BossService } from '../../services/boss.service';
import { Cars } from '../../interface/cars';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.css'
})
export class BuyComponent implements OnInit{

  CarsList: Cars[] = [];
  sortedBy: string = '';
  likedCars: { [key: string]: boolean } = {};  


  constructor(private afs:AngularFirestore ,private router: Router, private service : BossService,private afAuth: AngularFireAuth){}

  ngOnInit(): void {
    this.getAllCars();
  }

  getAllCars() {
    this.service.getAllCars() 
    .pipe(
      map(res => res.map((e: any) => {
        const data = e.payload.doc.data() as Cars;
        data.id = e.payload.doc.id;
        return data;
      }))
    )
    .subscribe(
      (data: Cars[]) => {
        this.CarsList = data;
        if (this.sortedBy) {
          this.sortCars(this.sortedBy);
        }
      },
      err => {
        alert('Error while fetching car data');
      }
    );
  }
  async checkWishlist() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userId = user.uid;
      const wishlistRef = this.afs.collection(`users/${userId}/wishlist`);

      wishlistRef.valueChanges().subscribe((wishlist: any[]) => {
        this.likedCars = {};
        wishlist.forEach(car => {
          this.likedCars[car.id] = true;
        });
      });
    }
  }

  sortCars(option: string) {
    this.sortedBy = option; 
    switch (option) {
        case 'recent' :
          this.getAllCars();
          break;
        case 'pHtoL':
            this.CarsList.sort((a, b) => Number(b.price) - Number(a.price));
            break;
        case 'pLtoH':
            this.CarsList.sort((a, b) => Number(a.price) - Number(b.price));
            break;
        case 'kmHtoL':
            this.CarsList.sort((a, b) => Number(b.kilometer) - Number(a.kilometer));
            break;
        case 'kmLtoH':
            this.CarsList.sort((a, b) => Number(a.kilometer) - Number(b.kilometer));
            break;
        case 'yNtoo':
            this.CarsList.sort((a, b) => Number(b.year) - Number(a.year));
            break;
        case 'yOtoN':
            this.CarsList.sort((a, b) => Number(a.year) - Number(b.year));
            break;
    }
  }

  async toggleLike(carId: string, car: any) {
    this.likedCars[carId] = !this.likedCars[carId]; 
    const user = await this.afAuth.currentUser;
    if (user) {
      const userDocRef = this.afs.collection('users').doc(user.uid);
      const wishlistRef = userDocRef.collection('wishlist');
      if (this.likedCars[carId]) {
        await wishlistRef.doc(carId).set({
          ...car,         
        });
        const notificationsRef = userDocRef.collection('notification');
        await notificationsRef.add({
            message: `A new car (${car.brand}) has been added to your wishlist.`,  
      });
    } else {
        await wishlistRef.doc(carId).delete();
      }
    } else {
      throw new Error('User not logged in');
    }
  }

  viewDetails(carId: string): void {
    this.router.navigate(['/car', carId]);
  }

}

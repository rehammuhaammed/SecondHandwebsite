import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  userData$: Observable<any> = of(null); // Initialize with an observable

  constructor(private authService: AuthService, private firestore: AngularFirestore ,private router:Router ) {}

  ngOnInit(): void {
    this.userData$ = this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          // User is authenticated, fetch Firestore data
          return this.fetchUserData(user.uid);
        } else {
          // User is not authenticated, return an empty observable
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return of(null); // Return an empty observable on error
      })
    );

    this.userData$.subscribe(userData => {
    
    });
  }

      viewDetails(carId: string): void {
    this.router.navigate(['/car', carId]);
  }

fetchUserData(userId: string): Observable<any[]> {
  return this.firestore.collection(`users/${userId}/wishlist`).valueChanges().pipe(
    switchMap(cars => {
      
      const filteredCars = cars.filter(car => car && Object.keys(car).length > 0);
      return of(filteredCars);
    })
  );
}

  successMessage: string = ''; 

removeFromWishlist(carId: string) {
  this.authService.getCurrentUser().subscribe(user => {
    if (user) {
      const userId = user.uid;
      const carRef = this.firestore.collection(`users/${userId}/wishlist`).doc(carId);
      carRef.delete().then(() => {
        
        this.successMessage = 'Car removed from wishlist successfully!';
        
       
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);

        
        this.userData$ = this.fetchUserData(userId);
      }).catch(error => {
        console.error('Error removing car from wishlist:', error);
      });
    }
  });
}

  
}
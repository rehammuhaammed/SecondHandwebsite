import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})
export class PurchasesComponent implements OnInit {
  userData$: Observable<any> = of(null); // Initialize with an observable

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.userData$ = this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          return this.fetchUserData(user.uid);
        } else {
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return of(null);
      })
    );

    this.userData$.subscribe(userData => {
      console.log('userData:', userData);
    });
  }

  fetchUserData(userId: string): Observable<any[]> {
    return this.firestore.collection(`users/${userId}/purchases`).valueChanges().pipe(
      switchMap(cars => {
       
        const filteredCars = cars.filter(car => car && Object.keys(car).length > 0);
        return of(filteredCars);
      })
    );
  }
}

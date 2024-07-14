import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-mylist',
  templateUrl: './mylist.component.html',
  styleUrls: ['./mylist.component.css'] // Corrected styleUrl to styleUrls
})
export class MylistComponent implements OnInit {
  userData$: Observable<any> = of(null); // Initialize with an observable

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}

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
      console.log('userData:', userData);
    });
  }

  fetchUserData(userId: string): Observable<any[]> {
    return this.firestore.collection(`users/${userId}/mylist`).valueChanges();
  }
}

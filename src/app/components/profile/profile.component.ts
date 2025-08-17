import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] // Fixed styleUrl to styleUrls
})
export class ProfileComponent implements OnInit {
  userData$: Observable<any>=null!;
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
      })
    );
    this.userData$.subscribe(userData => {
      // console.log('userData:', userData);
    });
  }

  fetchUserData(userId: string): Observable<any[]> {
    // Fetch documents from 'users' collection where 'userId' field matches current user's UID
    return this.firestore.collection('users', ref =>
      ref.where('userId', '==', userId)
    ).valueChanges();
  }
}
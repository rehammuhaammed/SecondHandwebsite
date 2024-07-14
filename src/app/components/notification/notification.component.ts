import { Component , OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];

  constructor(private authService: AuthService, private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.fetchNotifications(user.uid);
      }
    });
  }

  fetchNotifications(userId: string): void {
    this.afs.collection(`users/${userId}/notification`).valueChanges().subscribe((notifications: any[]) => {
      this.notifications = notifications;
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {

  notifications: any[] = [];
  loading: boolean = true;

  constructor(private authService: AuthService, private afs: AngularFirestore) {}

  ngOnInit(): void {
  this.authService.getCurrentUser().subscribe(user => {
    if (user) {
      this.afs.collection(`users/${user.uid}/notification`, ref =>
          ref.orderBy('timestamp','desc'))
        .valueChanges()
        .subscribe((notifications: any[]) => {
          this.notifications = notifications.map(n => ({
            ...n,
            timestamp: n.timestamp ? new Date(n.timestamp) : new Date()
          }));
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  });
}

  fetchNotifications(userId: string): void {
    this.afs.collection(`users/${userId}/notification`, ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges()
      .subscribe((notifications: any[]) => {
        // فلترة العناصر الفارغة أو غير الصالحة
        this.notifications = notifications
          .filter(n => Object.keys(n).length > 0)
          .map(n => ({
            message: n.message,
            senderName: n.senderName || 'Unknown',
            timestamp: n.timestamp ? new Date(n.timestamp) : new Date()
          }));
        this.loading = false;
      });
  }

}

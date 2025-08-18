import { Component, OnInit } from '@angular/core';
import { BossService } from '../../services/boss.service';
import { Observable, of, switchMap, map } from 'rxjs';
import { ProfileUser } from '../../interface/profile-user';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit {
  users$: Observable<ProfileUser[]> | undefined;
  filteredUsers$: Observable<any[]> | undefined;
  currentUser: string | undefined;
  userData$: Observable<any> = null!;
  selectedUserName: string | null = null;
  selectedUserId: string | null = null;
  newMessage: string = '';
  messages: string[] = [];
  notifications: any[] = [];

  constructor(
    private boss: BossService,
    private auth: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.userData$ = this.auth.getCurrentUser().pipe(
      switchMap(user => {
        if (user) return this.fetchUserData(user.uid);
        else return of(null);
      })
    );
    this.getAllUsers();
    this.loadNotifications();
  }

  getCurrentUser(): void {
    this.auth.getCurrentuser().subscribe(user => {
      this.currentUser = user || undefined;
    });
  }

  getAllUsers(): void {
    this.users$ = this.boss.getAllUsers().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ProfileUser;
        const uid = a.payload.doc.id;
        return data;
      }))
    );

    this.filteredUsers$ = this.users$?.pipe(
      map(users => users
        .filter(user => user.uid !== this.currentUser)
        .map(user => {
          const hasNewMessage = this.notifications.some(n => n.senderId === user.uid);
          return { ...user, hasNewMessage };
        })
      )
    );
  }

  fetchUserData(userId: string): Observable<any[]> {
    return this.firestore.collection('users', ref =>
      ref.where('userId', '==', userId)
    ).valueChanges();
  }

  loadNotifications(): void {
    if(!this.currentUser) return;
    this.firestore.collection(`users/${this.currentUser}/notification`, ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges().subscribe((notifications: any[]) => {
        this.notifications = notifications.map(n => ({
          ...n,
          timestamp: n.timestamp ? new Date(n.timestamp) : new Date()
        }));
        this.getAllUsers();
      });
  }

  startChat(user: ProfileUser, username: string): void {
    this.selectedUserName = user.name || null;
    this.selectedUserId = user.uid || null;

    
    if (user.hasNewMessage) {
      user.hasNewMessage = false;
      this.removeNotificationsFromUser(user.uid);
    }

    this.resetMessages();
    this.loadMessages();
  }

  removeNotificationsFromUser(userId: string) {
    if(!this.currentUser) return;
    this.firestore.collection(`users/${this.currentUser}/notification`, ref =>
      ref.where('senderId', '==', userId)
    ).get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => doc.ref.delete());
    });
  }

  sendMessage(senderName: string): void {
   

    if (!this.selectedUserId || !this.newMessage.trim() || !this.currentUser) {
      console.warn("⚠️ Missing data:", {
        selectedUserId: this.selectedUserId,
        newMessage: this.newMessage,
        currentUser: this.currentUser
      });
      return;
    }

    const messageData = {
      senderId: this.currentUser,
      senderName,
      message: this.newMessage,
      timestamp: new Date().toISOString()
    };

    // دايمًا نخزن userIds بالترتيب
    const userIds = [this.currentUser, this.selectedUserId].sort();
    

    this.firestore.collection('chats', ref => ref.where('userIds', '==', userIds))
      .get().subscribe(querySnapshot => {
        

        if (querySnapshot.size !== 0) {
          

          querySnapshot.forEach(doc => {
         

            const docRef = this.firestore.collection('chats').doc(doc.id);
            docRef.get().subscribe(snapshot => {
              const currentMessages = snapshot.get('messages') || [];
              

              const updatedMessages = [...currentMessages, messageData];
              docRef.update({ messages: updatedMessages }).then(() => {
               
                this.messages.push(messageData.message);
                this.newMessage = '';

                // أضف إشعار للمستخدم التاني
                this.firestore.collection('users').doc(this.selectedUserId ?? undefined)
                  .collection('notification').add({
                    ...messageData,
                    message: `You have a new message`
                  }).then(() => {
                   
                  }).catch(err => console.error("❌ Error adding notification:", err));
              }).catch(err => console.error("❌ Error updating doc:", err));
            });
          });
        } else {
          

          this.firestore.collection('chats').add({
            userIds: userIds,
            messages: [messageData]
          }).then(docRef => {
           
            this.messages.push(messageData.message);
            this.newMessage = '';
          }).catch();
        }
      }, err => {
        
      });
  }


loadMessages(): void {
  if (!this.selectedUserId || !this.currentUser) {
    console.warn("⚠️ loadMessages skipped. Missing:", {
      selectedUserId: this.selectedUserId,
      currentUser: this.currentUser
    });
    return;
  }

  const userIds = [this.currentUser, this.selectedUserId].sort();
  

  this.firestore.collection('chats', ref => ref.where('userIds', '==', userIds))
    .get().subscribe(querySnapshot => {
      

      if (querySnapshot.size !== 0) {
        querySnapshot.forEach(doc => {
          
          const messagesArray = doc.get('messages') || [];
          

          const extractedMessages = messagesArray.map((msg: any) => msg.message);
          this.messages = extractedMessages;
        });
      } else {
        
        this.messages = [];
      }
    }, err => {
     
    });
}


  resetMessages() {
    this.messages = [];
  }
}

import { Component, OnInit } from '@angular/core';
import { BossService } from '../../services/boss.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { ProfileUser } from '../../interface/profile-user';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { chat } from '../../interface/chats';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})

export class ChatsComponent implements OnInit {
  users$: Observable<ProfileUser[]> | undefined;
  filteredUsers$: Observable<ProfileUser[]> | undefined;
  currentUser: string  | undefined;
  userData$: Observable<any>=null!;
  chats$: Observable<any[]> | undefined;
  currentUserName$!: Observable<string | null>;
  currentUserId$!: Observable<string | null>;
  selectedUserName: string | null = null;
  selectedUserId: string | null = null;
  newMessage: string = '';
  messages: string[] = [];
  chat$!: Observable<any[]>;
  Senders:string[] = [];
  constructor(private boss:BossService,private auth:AuthService ,private firestore:AngularFirestore){}
 
 ////////////////////////-----------------------------------------------////////////////

 ngOnInit(): void {
     this.getAllUser();
     this.getCurrentUser();
     this.userData$ = this.auth.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          return this.fetchUserData(user.uid);
        } else {
          return of(null);
        }
      })
    );
    this.chat$ = this.firestore.collection('chats').valueChanges();
 }

 ///////////////////-----------------------------------------------////////////////

 getAllUser() {
  this.users$ = this.boss.getAllUsers().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as ProfileUser;
      const uid = a.payload.doc.id;
      return data ;
    }))
  );
}

 ////////////////-----------------------------------------------////////////////
getCurrentUser(): void {
  this.auth.getCurrentuser().subscribe(user => {
    this.currentUser = user || undefined;
    this.filterUsers();
  });

}
 ///////////////-----------------------------------------------////////////////

filterUsers(): void {
  if (this.users$ && this.currentUser !== undefined) {
    this.filteredUsers$ = this.users$.pipe(
      map(users => users.filter(user => user.uid !== this.currentUser))
    );
}
}
 //////////////-----------------------------------------------////////////////
startChat(user:ProfileUser,username:string): void {
  if (this.currentUser) {
    this.selectedUserName = user.name || null;
    this.selectedUserId = user.uid || null;
    this.boss.createChat(user.uid,user.name||'',username); 
    this.resetmessages(); 
    this.loadMessages();
  }
}

 /////////////-----------------------------------------------////////////////

fetchUserData(userId: string): Observable<any[]> {
  return this.firestore.collection('users', ref =>
    ref.where('userId', '==', userId)
  ).valueChanges();
}

sendMessage(name:string): void {
  this.auth.getCurrentUser().subscribe(currentUser => {
    if (currentUser) {
      const currentUserId = currentUser.uid;
      const userIds = [currentUserId, this.selectedUserId];
      const userIds2 = [this.selectedUserId,currentUserId ];
      let docId :any;
    if (this.selectedUserId && this.newMessage.trim() !== '') {
      const messageData = {
        senderId: this.currentUser,
        message: this.newMessage,
        timestamp: new Date().toISOString(),
        sender:name
      };
      this.firestore.collection('chats', ref =>
        ref.where('userIds', '==', userIds)
      ).get().subscribe(async querySnapshot => {
        if (querySnapshot.size !== 0) {             
        querySnapshot.forEach(doc => {
          docId=doc.id;
          const docRef = this.firestore.collection('chats').doc(docId);
          docRef.get().subscribe(snapshot => {
          const currentMessages = snapshot.get('messages') || [];      
            // Update the messages array with the new message
          const updatedMessages = [...currentMessages, messageData];       
            // Update the document with the updated messages array
            docRef.update({ messages: updatedMessages })
              .then(() => {
                console.log('Message sent successfully!');
                // Clear the newMessage field after sending
                this.newMessage = '';
                this.messages.push(messageData.message);
                this.firestore.collection('users').doc(this.selectedUserId ?? undefined).collection('notification').add({ message:" YOU Have A New Message "});
              })
        })
    });
  }
  else{
    if(1==1)
      {
        this.firestore.collection('chats', ref =>
          ref.where('userIds', '==', userIds2)
        ).get().subscribe(async querySnapshot => {
          if (querySnapshot.size !== 0) {
            querySnapshot.forEach(doc => {
              docId=doc.id;
              const docRef = this.firestore.collection('chats').doc(docId);
              docRef.get().subscribe(snapshot => {
                const currentMessages = snapshot.get('messages') || [];          
                const updatedMessages = [...currentMessages, messageData];            
                docRef.update({ messages: updatedMessages })
                  .then(() => {
                    console.log('Message sent successfully!');
                    this.newMessage = '';
                    this.messages.push(messageData.message);
                    this.firestore.collection('users').doc(this.selectedUserId ?? undefined).collection('notification').add({ message:" You Have A New Message "});
                  })
            })
        });
          } 
      });     
    }
  }
    })
  }
}
});
 this.loadMessages();
}

loadMessages(): void {
  this.auth.getCurrentUser().subscribe(currentUser => {
    if (currentUser) {
      const currentUserId = currentUser.uid;
      const userIds = [currentUserId, this.selectedUserId];
      const userIds2 = [this.selectedUserId,currentUserId ];
      const allMessages:any = [];
      let docId :any;
    if (this.selectedUserId) {  
      this.firestore.collection('chats', ref =>
        ref.where('userIds', '==', userIds)
      ).get().subscribe(async querySnapshot => {
        if (querySnapshot.size !== 0) {            
        querySnapshot.forEach(doc => {
          docId=doc.id;
          const docRef = this.firestore.collection('chats').doc(docId);
          docRef.get().subscribe(snapshot => {
            const messagesArray = snapshot.get('messages') || [];
            const extractedMessages = messagesArray.map((messageObj: { message: any}) => messageObj.message);
            allMessages.push(...extractedMessages);
            this.messages = allMessages; 
            })
        })
    }
         else{
    if(1==1)
      {
        this.firestore.collection('chats', ref =>
          ref.where('userIds', '==', userIds2)
        ).get().subscribe(async querySnapshot => {
          if (querySnapshot.size !== 0) {
            querySnapshot.forEach(doc => {
              docId=doc.id;
              const docRef = this.firestore.collection('chats').doc(docId);
              docRef.get().subscribe(snapshot => {
                const messagesArray = snapshot.get('messages') || [];
                const extractedMessages = messagesArray.map((messageObj: { message: any}) => messageObj.message);
                allMessages.push(...extractedMessages);
                this.messages = allMessages;  
              });        
            })
        }});
          } 
      }});    
    }}})
  }

  resetmessages()
  {
    while (this.messages.length > 0) {
      this.messages.pop();
  }
  }
}




import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { BossService } from '../../services/boss.service';
import { Cars } from '../../interface/cars';
import { Observable, Subscription, filter, switchMap } from 'rxjs';
import { Firestore, arrayUnion } from 'firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{

  car: Cars | undefined;
  carSnapshot:any |undefined ;
  private subscription: Subscription | undefined;
  @ViewChild('feedbackTextarea') feedbackTextarea!: ElementRef;
  constructor(private route: ActivatedRoute,private routes:Router,private afs:AngularFirestore, private bossService: BossService,private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    const carId = this.route.snapshot.paramMap.get('id');
   
    if (carId) {
      this.subscription = this.bossService.getCarById(carId).subscribe({
        next: (car: Cars) => {
          this.car= car;
        },
        error: (err) => {
          console.error('Error fetching car details:', err);
        }
      });
      }
  }

  async buyCar(car: any): Promise<void> {
    if (this.car) {
      const carId = this.route.snapshot.paramMap.get('id');
      if (carId) {
        try {
          // Delete the car from the 'cars' collection
          await this.afs.collection('cars').doc(carId).delete();
       
  
          const user = await this.afAuth.currentUser;
          if (user) {
            const userDocRef = this.afs.collection('users').doc(user.uid);
            const purchasesRef = userDocRef.collection('purchases');
  
            await purchasesRef.doc(carId).set({
              ...car,
              
            });
  
            alert('Congratulations! You have successfully purchased this car.');
  
            setTimeout(() => {
              this.routes.navigate(['/buy']);
            }, 4000);
          }
        } catch (error) {
          console.error('Error purchasing car:', error);
        }
      } 
    } 
  }
  
  
  
  async sendFeedback(feedback: string) {
    if (this.car) {
      const carId = this.route.snapshot.paramMap.get('id');
      if (carId) {
        try {
          const carDocRef = this.afs.collection('cars').doc(carId);
  
          // Update the 'comments' array using arrayUnion
          await carDocRef.update({
            comments: arrayUnion(feedback)
          });
  
          // Notify user about successful feedback submission
          alert('Thank you for your feedback!');
  
          // Clear the feedback textarea
          this.feedbackTextarea.nativeElement.value = '';
  
          // Get the car document
          
          this.carSnapshot = await carDocRef.get().toPromise();
          
          if (this.carSnapshot.exists) {
            const carData = this.carSnapshot.data();
  
            // Add the document to the new collection 'cars_feedback'
            await this.afs.collection('cars_feedback').doc(carId).set(carData);
          } else {
            console.error('Car document does not exist.');
          }
  
        } catch (error) {
          console.error('Error sending feedback:', error);
        }
      }
    }
  }
  

}

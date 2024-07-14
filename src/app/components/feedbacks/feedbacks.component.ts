import { Component,OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.css'
})
export class FeedbacksComponent implements OnInit {
  feedbacks$: Observable<any[]> | undefined;
  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.feedbacks$ = this.afs.collection('cars_feedback').valueChanges();
  }

}

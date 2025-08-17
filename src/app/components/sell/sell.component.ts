import { Component, OnInit } from '@angular/core';
import { BossService } from '../../services/boss.service';
import { Cars } from '../../interface/cars';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  nameUser: string | null = null;
  userData$: Observable<any> = null!;
  imageUrl: string | null = null;
  url: any;
  Filesss!: File;
  fileSelected: boolean = false;

  msg: string = "";
  success: boolean = false;

  fieldMsg: any = {}; // <-- الرسائل لكل حقل

  CarsObj: Cars = {
    id: '',
    brand: '',
    model: '',
    price: '',
    year: '',
    kilometer: '',
    transmission: '',
    phone_number: '',
    location: '',
    image_url: '',
    Name_User: ''
  };

  id: any = '';
  brand: string = '';
  model: string = '';
  price: string = '';
  year: string = '';
  kilometer: string = '';
  transmission: string = '';
  phone_number: string = '';
  location: string = '';
  image_url: string = '';

  constructor(
    private service: BossService,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userData$ = this.authService.getCurrentUser().pipe(
      switchMap(user => user ? this.fetchUserData(user.uid) : of(null))
    );

    this.userData$.subscribe(userData => console.log('userData:', userData));
  }

  selectFile(event: any) {
    this.fieldMsg = {};
    if (!event.target.files[0]) {
      this.msg = 'You must select an image';
      this.success = false;
      return;
    }

    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      this.success = false;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.msg = "";
      this.url = reader.result;
      this.success = true;
    }

    this.fileSelected = true;
    this.Filesss = event.target.files[0];
  }

  uploadimage() {
    this.fieldMsg = {};
    if (!this.fileSelected) {
      this.msg = "Please Choose Image!";
      this.success = false;
      return;
    }

    let emptyFields = this.checkEmptyFields();
    if (emptyFields.length) {
      emptyFields.forEach(f => this.fieldMsg[f] = 'This field is required');
      this.msg = "Please Fill All The Fields First!";
      this.success = false;
      return;
    }

    this.service.uploadImage(this.Filesss).then(url => {
      this.imageUrl = url;
      this.CarsObj.image_url = url;
      this.msg = 'The Photo is Saved. Press Submit to submit the data.';
      this.success = true;
    }).catch(error => {
      this.msg = 'Failed to upload image: ' + error;
      this.success = false;
    });
  }

  addCar() {
  this.fieldMsg = {};
  let emptyFields = this.checkEmptyFields();

  if (!this.CarsObj.image_url) {
    this.msg = "Please Save Image Before Submit!";
    this.success = false;
    return;
  }

  if (emptyFields.length) {
    emptyFields.forEach(f => this.fieldMsg[f] = 'This field is required');
    this.msg = "Please Fill All The Fields!";
    this.success = false;
    return;
  }

  this.CarsObj = {
    ...this.CarsObj,
    id: '',
    brand: this.brand,
    model: this.model,
    price: this.price,
    kilometer: this.kilometer,
    transmission: this.transmission,
    phone_number: this.phone_number,
    location: this.location,
    year: this.year,
    Name_User: this.nameUser
  };

  this.service.addCar(this.CarsObj);
  this.msg = "Added Successfully!";
  this.success = true;

  // نعرض الرسالة لمدة ثانيتين قبل إعادة الفورم أو إعادة التوجيه
  setTimeout(() => {
    this.resetForm();
    this.reloadPage();
  }, 2000); // 2000ms = 2 ثواني
}


  checkEmptyFields() {
  const values = {
    brand: this.brand,
    model: this.model,
    year: this.year,
    price: this.price,
    kilometer: this.kilometer,
    transmission: this.transmission,
    phone_number: this.phone_number,
    location: this.location
  };

  return Object.keys(values).filter(key => !values[key as keyof typeof values]);
}

  hasFieldError() {
    return Object.keys(this.fieldMsg).length > 0;
  }

  resetForm() {
    this.id = '';
    this.brand = '';
    this.model = '';
    this.price = '';
    this.year = '';
    this.kilometer = '';
    this.transmission = '';
    this.phone_number = '';
    this.location = '';
    this.image_url = '';
    this.url = null;
    this.fileSelected = false;
    this.fieldMsg = {};
    this.msg = '';
    this.success = false;
  }

  reloadPage(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  fetchUserData(userId: string) {
    return this.firestore.collection('users', ref => ref.where('userId', '==', userId)).valueChanges().pipe(
      map(users => {
        if (users && users.length > 0) {
          const user = users[0] as { name: string };
          this.nameUser = user.name;
          return { ...user, name: this.nameUser };
        } else return null;
      })
    );
  }
}

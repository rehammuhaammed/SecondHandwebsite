import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileUser } from '../../interface/profile-user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  name: string = '';
  phone_num: string = '';
  email: string = '';
  password: string = '';


  errorMessage: string = '';
  successMessage: string = '';

  Profile: ProfileUser = {
    uid: '',
    name: '',
    email: '',
  };

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  async register(form: any) {
    if (form.invalid) return;


    this.errorMessage = '';
    this.successMessage = '';

    try {
      const uid = await this.auth.register(this.email, this.password, this.name, this.phone_num);

      this.Profile.uid = uid;
      this.Profile.name = this.name;
      this.Profile.email = this.email;

      await this.auth.addUser(this.Profile);

      this.successMessage = 'Account created successfully. Welcome!';
      form.reset();

    } catch (error: any) {
     
      switch (error?.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'This email is already registered. Try logging in.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Invalid email format. Please check and try again.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'Password is too weak. Use at least 6 characters.';
          break;
        case 'auth/network-request-failed':
          this.errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          this.errorMessage = 'Something went wrong: ' + (error?.message ?? 'Unknown error');
      }
    }
  }
}

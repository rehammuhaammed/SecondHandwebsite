import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {}

  async login(form: any) {
    if (form.invalid) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }
    if (!this.password.trim()) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

try {
  await this.auth.login(this.email, this.password);
  this.successMessage = 'Login successful';
  form.reset();
} catch (error: any) {
  this.errorMessage = 'Login failed. Please check your credentials, Or Please register first.';
}


  }

}

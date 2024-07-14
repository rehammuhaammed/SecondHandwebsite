import { Component ,OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileUser } from '../../interface/profile-user';

@Component({
  selector: 'app-register',
  templateUrl:'./register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  name : string = '';
  phone_num : string = '';
  email : string = '';
  password : string = '';
  Profile: ProfileUser = {
    uid: '',
    name : '',
    email:'', 
  };
  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }
userId:any
 async register() {

    if(this.name == '') {
      alert('Please enter your name');
      return;
    }
    if(this.phone_num == '') {
      alert('Please enter your phone Number');
      return;
    }
    if(this.email == '') {
      alert('Please enter email');
      return;
    }

    if(this.password == '') {
      alert('Please enter password');
      return;
    }


    const uid = await this.auth.register(this.email, this.password, this.name, this.phone_num);
    const cred = uid
    this.Profile.uid = cred;
    this.Profile.name = this.name;
    this.Profile.email = this.email;
    this.auth.addUser(this.Profile);
    this.name = '';
    this.phone_num='';
    this.email = '';
    this.password ='';
}  


}

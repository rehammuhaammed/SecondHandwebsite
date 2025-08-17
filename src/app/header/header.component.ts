import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly auth=inject(AuthService)
logout(){
this.auth.logout()
}
}

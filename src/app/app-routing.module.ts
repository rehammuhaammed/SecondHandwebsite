import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellComponent } from './components/sell/sell.component';
import { BuyComponent } from './components/buy/buy.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DetailsComponent } from './components/details/details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { MylistComponent } from './components/mylist/mylist.component';
import { ChatsComponent } from './components/chats/chats.component';
import { NotificationComponent } from './components/notification/notification.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
const routes: Routes = [
  
  { path: '', component: LoginComponent , canActivate: [guestGuard]},
  { path: 'register', component: RegisterComponent , canActivate: [guestGuard]} ,
  {path:'welcome',component:WelcomeComponent , canActivate: [authGuard]},
  {path:'buy',component:BuyComponent , canActivate: [authGuard]},
  { path:'car/:id', component: DetailsComponent , canActivate: [authGuard]},
  {path:'sell',component:SellComponent , canActivate: [authGuard]},

  { path: 'profile', component: ProfileComponent , canActivate: [authGuard]} ,
  { path: 'wishlist', component: WishlistComponent , canActivate: [authGuard]} ,
  { path: 'purchases', component: PurchasesComponent , canActivate: [authGuard]} ,
  { path: 'feedbacks', component: FeedbacksComponent , canActivate: [authGuard]} ,
  { path: 'mylist', component: MylistComponent , canActivate: [authGuard]} ,
  { path: 'chats', component: ChatsComponent , canActivate: [authGuard]},
  { path: 'notification', component: NotificationComponent , canActivate: [authGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

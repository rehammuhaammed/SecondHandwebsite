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
const routes: Routes = [
  { path: '', component: LoginComponent } ,
  {path:'welcome',component:WelcomeComponent},
  {path:'buy',component:BuyComponent},
  { path:'car/:id', component: DetailsComponent },
  {path:'sell',component:SellComponent},
  { path: 'register', component: RegisterComponent } ,
  { path: 'profile', component: ProfileComponent } ,
  { path: 'wishlist', component: WishlistComponent } ,
  { path: 'purchases', component: PurchasesComponent } ,
  { path: 'feedbacks', component: FeedbacksComponent } ,
  { path: 'mylist', component: MylistComponent } ,
  { path: 'chats', component: ChatsComponent },
  { path: 'notification', component: NotificationComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

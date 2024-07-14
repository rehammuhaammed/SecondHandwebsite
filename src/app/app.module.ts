import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import{AngularFireModule}from'@angular/fire/compat' ;
import{AngularFireStorageModule}from '@angular/fire/compat/storage';
import{AngularFirestore, AngularFirestoreModule}from '@angular/fire/compat/firestore'
import { environment } from './environments/environment';
import { SellComponent } from './components/sell/sell.component';
import { BossService } from './services/boss.service';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { BuyComponent } from './components/buy/buy.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DetailsComponent } from './components/details/details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { MylistComponent } from './components/mylist/mylist.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import{MatAutocompleteModule}from '@angular/material/autocomplete';
import{MatAutocomplete}from '@angular/material/autocomplete';
import { ChatsComponent } from './components/chats/chats.component';
import { MatSelectModule } from '@angular/material/select';
import{MatListModule} from '@angular/material/list'
import{MatDividerModule} from '@angular/material/divider'
import { NotificationComponent } from './components/notification/notification.component';
@NgModule({
  declarations: [
    AppComponent,
    SellComponent,
    BuyComponent,
    WelcomeComponent,
    DetailsComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    WishlistComponent,
    PurchasesComponent,
    FeedbacksComponent,
    MylistComponent,
    ChatsComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    FormsModule,
    provideAuth(() => getAuth()),
    HttpClientModule,
    MatFormFieldModule,
    provideStorage(()=>getStorage()),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatAutocomplete,
    MatSelectModule,
    MatListModule,
    MatDividerModule
  ],
  providers: [
    provideClientHydration(),
    BossService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

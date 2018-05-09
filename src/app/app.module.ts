import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ClassPage } from '../pages/class/class';
import { AssignPage } from '../pages/assign/assign';
import { AthletePage } from '../pages/athlete/athlete';
import { PastWorkoutPage } from '../pages/pastWorkout/pastWorkout';

import { ModalAddAthletePage } from '../pages/modalAddAthlete/modalAddAthlete';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ExpandableComponent } from '../components/expandable/expandable';

import { IonicStorageModule } from '@ionic/storage';
import { Data } from '../providers/data/data';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ClassPage,
    AssignPage,
    AthletePage,
    PastWorkoutPage,

ModalAddAthletePage,

    ExpandableComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ClassPage,
    AssignPage,
    AthletePage,

ModalAddAthletePage,

    PastWorkoutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Data
  ]
})
export class AppModule {}

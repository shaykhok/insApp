import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ClassPage } from '../pages/class/class';
import { AssignPage } from '../pages/assign/assign';
import { AthletePage } from '../pages/athlete/athlete';
import { PastWorkoutPage } from '../pages/pastWorkout/pastWorkout';

import { ModalAddAthletePage } from '../pages/modalAddAthlete/modalAddAthlete';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Login', component: LoginPage },
      { title: 'Signup', component: SignupPage },
      { title: 'Class', component: ClassPage },
      { title: 'Assign', component: AssignPage },
      { title: 'Athlete', component: AthletePage },
{ title: 'ModalAddAthlete', component: ModalAddAthletePage },

      { title: 'PastWorkout', component: PastWorkoutPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openClass(){
    this.nav.setRoot(ClassPage);
  }

  assignNewWorkout(){
    //also would like to alert them that 
    this.nav.push(AssignPage);
  }

  appLogout(){
    this.nav.setRoot(LoginPage);
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClassPage } from '../class/class';
import { AssignPage } from '../assign/assign';
import { LoginPage } from '../login/login';

import { Data } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

data:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: Data) {

this.dataService.getWorkoutID().then((workoutID) => {
   this.data.currentWorkoutID = workoutID;
   console.log(this.data.currentWorkoutID);
});
  }
  

  assignNewWorkout(){
     this.navCtrl.push(AssignPage);
  }

  resumeWorkout(){
     this.navCtrl.setRoot(ClassPage);
  }

  logOut(){
     this.navCtrl.setRoot(LoginPage)
  }

}

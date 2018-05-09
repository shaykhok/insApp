import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { AthletePage } from '../athlete/athlete';
import { Data } from '../../providers/data/data';

import { Http } from '@angular/http';

import { ModalController } from 'ionic-angular';
import { ModalAddAthletePage } from '../modalAddAthlete/modalAddAthlete';

import { Events } from 'ionic-angular';
import { NgZone } from '@angular/core';

@Component({
  selector: 'page-class',
  templateUrl: 'class.html'
})
export class ClassPage {

data:any = {};

  items: any = [];
  itemExpandHeight: number = 1000;

  objectKeys = Object.keys;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public dataService: Data, public http: Http, public modalCtrl: ModalController, public events: Events, private ngZone: NgZone){

this.data.username = '';
this.data.response = '';
this.http = http;

    /*  this.items = [ //should change naming of athleteID to athleteName

//do i need to add in workoutid to past workouts? - i think so for the notes aspect

            {expanded: false, athleteID: "Karrie", workoutStatus: "Not Started",
            sets: 6, reps: 5, workout: [{set: [{rep: "2"}, {rep: "1"}, {rep: "2"}, {rep: "1"}, {rep: "2"}]}, 
                                        {set: [{rep: "2"}, {rep: "0"}, {rep: "2"}, {rep: "1"}, {rep: "2"}]},
                                        {set: [{rep: "2"}, {rep: "1"}, {rep: "2"}, {rep: "1"}, {rep: "2"}]},
                                        {set: [{rep: "2"}, {rep: "1"}, {rep: "2"}, {rep: "1"}, {rep: "2"}]},
                                        {set: [{rep: "2"}, {rep: "0"}, {rep: "2"}, {rep: "1"}, {rep: "2"}]},
                                        {set: [{rep: "2"}, {rep: "0"}, {rep: "2"}, {rep: "1"}, {rep: "2"}]}],
            pastWorkouts: [{workoutTitle: "Workout Title", instructorID: "instid", date: "8/13/2017", sets: 2, reps: 2,
                               workoutData: [{set: [{rep: "2"}, {rep: "1"}]}, {set: [{rep: "2"}, {rep: "0"}]}]
                                  },
                           {workoutTitle: "Workout Title 2", instructorID: "instid 2", date: "8/13/2017", sets: 2, reps: 2,
                               workoutData: [{set: [{rep: "2"}, {rep: "1"}]},  {set: [{rep: "2"}, {rep: "0"}]}]
                                  }]},
            {expanded: false, athleteID: "Ben", workoutStatus: "Complete",
             sets: 2, reps: 2, workout: [{set: [{rep: "2"}, {rep: "1"}]}, {set: [{rep: "2"}, {rep: "0"}]}],
            pastWorkouts: [{workoutTitle: "Workout Title", instructorID: "instid", date: "8/13/2017", sets: 2, reps: 2,
                               workoutData: [{set: [{rep: "2"}, {rep: "1"}]}, {set: [{rep: "2"}, {rep: "0"}]}]
                                  },
                           {workoutTitle: "Workout Title 2", instructorID: "instid 2", date: "8/13/2017", sets: 2, reps: 2,
                               workoutData: [{set: [{rep: "2"}, {rep: "1"}]},  {set: [{rep: "2"}, {rep: "0"}]}]
                                  }]}

      ];*/


   this.events.subscribe('updateClassPageAthletes:event',(string) => {
      console.log("Event received");
      this.ngZone.run(() => {
         console.log("Zone: event received");
         this.updateInfo();
      });
   });


var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

this.dataService.getUserID().then((userID) => {
this.dataService.getWorkoutID().then((workoutID) => {

var myData = JSON.stringify({action: "athleteDataForWorkout", username: userID, workoutid: workoutID}); 

 this.http.post(link, myData).subscribe(data => {
    this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
    this.items = JSON.parse(this.data.response);
    // console.log(JSON.parse(this.data.response));
 }, error => {
 console.log("Oooops!");
 });

 });
 });

  }

  expandItem(item){
     item.expanded = !item.expanded;
  }

 addAthlete(){ //edit to not allow adding of the same athlete to the workout twice
        var numOfSets, numOfRepsPerSet = 0;
        this.dataService.getWorkoutSets().then((sets) => {
        numOfSets = Number(sets);
        console.log(numOfSets);
        });
        this.dataService.getWorkoutRepsPerSet().then((repsPerSet) => {
        numOfRepsPerSet = Number(repsPerSet);
        console.log(numOfRepsPerSet);
        });
        let prompt = this.alertCtrl.create({
            title: 'Add Participant',
            inputs: [{
                name: 'title'
            }],
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Add',
                    handler: data => {
                        console.log(typeof numOfSets, typeof numOfRepsPerSet);

                        var i, j;
                        var athleteWorkout = [];
                        for(i = 0; i != numOfSets; ++i){
                           var currentSet = [];
                           for(j = 0; j != numOfRepsPerSet; ++j){
                              var rep;
                              rep = {rep: "0"};
                              currentSet.push(rep);
                           }
                           console.log(currentSet.toString());
                           athleteWorkout.push({set: currentSet});
                        }
                        var athletePastWorkouts = []; //draw from database later
                        var newAthlete; 
                        newAthlete = {expanded:false, athleteID: data.title, workoutStatus: "Not Started", sets: numOfSets, reps: numOfRepsPerSet,
                        workout:  athleteWorkout, pastWorkouts: athletePastWorkouts};
                        console.log(newAthlete);
                        this.items.push(newAthlete);
                    }
                }
            ]
        });

        prompt.present();
    }

  itemTapped(event, item) {
    this.navCtrl.push(AthletePage, {
      item: item
    });
  }

submit(){
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

this.dataService.getUserID().then((userID) => {
this.dataService.getWorkoutID().then((workoutID) => {

var myData = JSON.stringify({action: "athleteDataForWorkout", username: userID, workoutid: workoutID}); 
//remove hardcoded workoutid and figure out how we'll know the workoutid

 this.http.post(link, myData)
 .subscribe(data => {
 this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
this.items = JSON.parse(this.data.response);
// console.log(JSON.parse(this.data.response));
 }, error => {
 console.log("Oooops!");
 });

 });
});

}

openAddAthleteModal(){
    var modalPage = this.modalCtrl.create(ModalAddAthletePage);
    modalPage.present();
}

updateInfo(){
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

this.dataService.getUserID().then((userID) => {
this.dataService.getWorkoutID().then((workoutID) => {

var myData = JSON.stringify({action: "athleteDataForWorkout", username: userID, workoutid: workoutID});

 this.http.post(link, myData).subscribe(data => {
    this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
    this.items = JSON.parse(this.data.response);
    // console.log(JSON.parse(this.data.response));
 }, error => {
 console.log("Oooops!");
 });

 });
});
}

//remove this after getting the socket working
refreshPage(){
this.navCtrl.setRoot(ClassPage);
}

}

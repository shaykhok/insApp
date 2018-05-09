import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { Data } from '../../providers/data/data';

import { Http } from '@angular/http';

@Component({
  selector: 'page-pastWorkout',
  templateUrl: 'pastWorkout.html'
})
export class PastWorkoutPage {

//  notes: any = [];
//  noteInstructors: any = [];
//  noteDates: any = [];
  items: any = [];

  objectKeys = Object.keys;

noteObjects: any = [];

data:any = {};

workout:any = {};
currentAthlete:any = {};
//instructorID:any = {};

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public dataService: Data, public http: Http) {
//        this.items = [
  //          {expanded: false, sets: 2, reps: 2, workout: [{set: [{rep: "2"}, {rep: "0"}]}, {set: [{rep: "1"}, {rep: "2"}]}],
    //        pastWorkouts: [{workoutTitle: "Workout Title", instructorID: "1", date: "8/13/2017"}, {workoutTitle: "Workout Title", instructorID: "2", date: "8/14/2017"}]}
      //  ];

this.data.username = '';
this.data.response = '';
this.http = http;

this.workout = this.navParams.get('workout');
this.currentAthlete = this.navParams.get('currentAthlete');

console.log(this.workout);
console.log(this.currentAthlete);

var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

this.dataService.getUserID().then((userID) => {

var myData = JSON.stringify({action: "getNoteDetailsForAthleteAndWorkout", athleteUsername: this.currentAthlete, workoutID: this.workout.workoutId});

 this.http.post(link, myData).subscribe(data => {
    this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
    this.noteObjects = JSON.parse(this.data.response);
    console.log(this.noteObjects);
    }, error => {
    console.log("Oooops!");
    });
 });

    }

  //  workout = this.navParams.get('workout');
    //currentAthlete = this.navParams.get('currentAthlete');
    //instructorID = this.navParams.get('userID');

    addNote(){

   let prompt = this.alertCtrl.create({
      title:'Add Note',
      inputs: [{
         name: 'note'
      }],
      buttons: [
         {
            text: 'Cancel' 
         },
         {
            text: 'Add',
               handler: data => {
                //submit to database then reload note objects after submission
                //reload note objects after submission

                var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
                this.dataService.getUserID().then((userID) => {
                   var myData = JSON.stringify({action: "addNoteForAthlete", username: userID, workoutID: this.workout.workoutId, athleteUsername: this.currentAthlete, note: data.note});
                   this.http.post(link, myData).subscribe(dataTwo => {
                      this.data.response = dataTwo["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response

                      var updateData = JSON.stringify({action: "getNoteDetailsForAthleteAndWorkout", athleteUsername: this.currentAthlete, workoutID: this.workout.workoutId});
                         this.http.post(link, updateData).subscribe(dataThree => {
                            this.data.response = dataThree["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
                            this.noteObjects = JSON.parse(this.data.response);
                            console.log(this.noteObjects);
                         }, error => {
                            console.log("Oooops!");
                      });

                   }, error => {
                      console.log("Oooops!");
                   });

                });
             
               }
          }
       ]
       });
       prompt.present();

    }

    editNote(note){

        let prompt = this.alertCtrl.create({
            title: 'Edit Note',
            inputs: [{
                name: 'note'
            }],
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Save',
                    handler: data => {


                var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
                this.dataService.getUserID().then((userID) => {
                   var myData = JSON.stringify({action: "editNoteByNoteID", username: userID, note: data.note, noteID: note.noteid});  
                   this.http.post(link, myData).subscribe(dataTwo => {
                         this.data.response = dataTwo["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response

                         var updateData = JSON.stringify({action: "getNoteDetailsForAthleteAndWorkout", athleteUsername: this.currentAthlete, workoutID: this.workout.workoutId});
                         this.http.post(link, updateData).subscribe(dataThree => {
                            this.data.response = dataThree["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
                            this.noteObjects = JSON.parse(this.data.response);
         //                   console.log(this.noteObjects);
                            }, error => {
                               console.log("Oooops!");
                         });

                        }, error => {
                              console.log("Oooops!");
                   });

                });
             
                    }
                }
            ]
        });

        prompt.present();

    }

    deleteNote(note){

        var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
        var myData = JSON.stringify({action: "deleteNoteByNoteID", noteID: note.noteid});
        this.http.post(link, myData).subscribe(data => {
            this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response

            var updateData = JSON.stringify({action: "getNoteDetailsForAthleteAndWorkout", athleteUsername: this.currentAthlete, workoutID: this.workout.workoutId});
            this.http.post(link, updateData).subscribe(dataTwo => {
               this.data.response = dataTwo["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
                  this.noteObjects = JSON.parse(this.data.response);
                  console.log(this.noteObjects);
                  }, error => {
                     console.log("Oooops!");
             });
        }, error => {
            console.log("Oooops!");
        });

    }

}

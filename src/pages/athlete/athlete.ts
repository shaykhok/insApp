import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { PastWorkoutPage } from '../pastWorkout/pastWorkout';
import { ClassPage } from '../class/class';
import { Data } from '../../providers/data/data';

import { Http } from '@angular/http';

@Component({
  selector: 'page-athlete',
  templateUrl: 'athlete.html'
})
export class AthletePage {

//  notes: any = [];
//  noteInstructors: any = [];
//  noteDates: any = [];

noteObjects: any = [];

  objectKeys = Object.keys;

data:any = {};

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public dataService: Data, public http: Http) {
this.data.username = '';
this.data.response = '';
this.http = http;

var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

this.dataService.getUserID().then((userID) => {

var myData = JSON.stringify({action: "getNoteDetailsForAthleteAndWorkout", athleteUsername: this.athleteDetails.athleteID, workoutID: this.athleteDetails.workoutID});

 this.http.post(link, myData).subscribe(data => {
    this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
    this.noteObjects = JSON.parse(this.data.response);
    console.log(this.noteObjects);
    }, error => {
    console.log("Oooops!");
    });
 });


    }

    athleteDetails = this.navParams.get('item');
   
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
                   var myData = JSON.stringify({action: "addNoteForAthlete", username: userID, workoutID: this.athleteDetails.workoutID, athleteUsername: this.athleteDetails.athleteID, note: data.note});
                   this.http.post(link, myData).subscribe(dataTwo => {
                      this.data.response = dataTwo["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response

                      var updateData = JSON.stringify({action: "getNoteDetailsForAthleteAndWorkout", athleteUsername: this.athleteDetails.athleteID, workoutID: this.athleteDetails.workoutID});
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

                         var updateData = JSON.stringify({action: "getNoteDetailsForAthleteAndWorkout", athleteUsername: this.athleteDetails.athleteID, workoutID: this.athleteDetails.workoutID});
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

            var updateData = JSON.stringify({action: "getNoteDetailsForAthleteAndWorkout", athleteUsername: this.athleteDetails.athleteID, workoutID: this.athleteDetails.workoutID});
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

    removeAthlete(){
        let prompt = this.alertCtrl.create({
            title: 'Are you sure you want to remove ' + this.athleteDetails.athleteID + ' from the current workout?',
            buttons: [
                {
                    text: 'No'
                },
                {
                    text: 'Yes, remove',
                    handler: data => {

                       var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
                       var myData = JSON.stringify({action: "removeAthleteFromWorkout", athleteUsername: this.athleteDetails.athleteID, workoutID: this.athleteDetails.workoutID});
                       console.log(this.athleteDetails);
                       this.http.post(link, myData).subscribe(data => {
                          this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
                       }, error => {
                          console.log("Oooops!");
                       });

                       this.navCtrl.setRoot(ClassPage);
                    }
                }
            ]
        });

        prompt.present();
    } 

    expandWorkout(workout){
       console.log("expanded workout");
       var currentAthlete = this.navParams.get('item').athleteID;
       this.navCtrl.push(PastWorkoutPage,
           {workout: workout,
           currentAthlete: currentAthlete
           }
       );
    }


submit(){
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

this.dataService.getUserID().then((userID) => {

var myData = JSON.stringify({action: "removeAthleteFromWorkout", athleteUsername: this.athleteDetails.athleteID, workoutID: this.athleteDetails.workoutID});

console.log(this.athleteDetails);

 this.http.post(link, myData).subscribe(data => {
 this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
//this.items = JSON.parse(this.data.response);
// console.log(JSON.parse(this.data.response));
 }, error => {
 console.log("Oooops!");
 });

 });

}

}

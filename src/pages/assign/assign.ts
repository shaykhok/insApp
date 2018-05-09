import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { ClassPage } from '../class/class';

import { Data } from '../../providers/data/data';

import { Http } from '@angular/http';

@Component({
  selector: 'page-assign',
  templateUrl: 'assign.html'
})
export class AssignPage {

  selectedAthletes: any = [];
  workout = <any>{};

searchTerm: string = '';

data:any = {};

athletes: any;
filteredAthletes:any;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public dataService: Data, public http: Http) {

this.data.username = '';
this.data.response = '';
this.http = http;

this.filteredAthletes = [];

var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

var myData = JSON.stringify({action: "getAllAthleteNamesAndIDs"});

this.http.post(link, myData).subscribe(data => {
 this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
 console.log(JSON.parse(this.data.response));
 this.athletes = JSON.parse(this.data.response);
 }, error => {
 console.log("Oooops!");
 });

    }

   addAthlete(athlete){
      console.log(athlete);
      var athleteAlreadyAdded = false;
      var i = 0;
      for(i = 0; i != this.selectedAthletes.length; ++i){
         if(this.selectedAthletes[i].athletename == athlete.athletename){
            athleteAlreadyAdded = true;
         }
      }
      if(!athleteAlreadyAdded){
         this.selectedAthletes.push(athlete);
      }
    }

    deleteAthlete(athlete){

        let index = this.selectedAthletes.indexOf(athlete);

        if(index > -1){
            this.selectedAthletes.splice(index, 1);
        }
    }



  sendWorkout(){ //connect to database and store the number of sets and reps in the workout locally somewhere for reference when adding participants later
        var modalMessage = 'Assigning this new workout will end your current workout. Are you sure you would like to continue?';
        var inputError = false;
        if(!this.workout.hasOwnProperty('title') || (this.workout.hasOwnProperty('title') && this.workout.title.length == 0)){
            modalMessage = "Please enter a title for the workout";
            inputError = true;
        } else if(!this.workout.hasOwnProperty('sets') || (this.workout.hasOwnProperty('sets') && this.workout.sets.length == 0)){ // check that it's not empty
            modalMessage = "Please enter the number of sets for the workout";
            inputError = true;
        } else{
               if(this.workout.hasOwnProperty('sets')){
                  var sets = Number(this.workout.sets);
                  if(isNaN(sets) || !Number.isInteger(sets) || (sets < 1)){ //check that sets is a number
                     modalMessage = "Please enter a valid number for 'Number of Sets'";
                     inputError = true;
                  } else if(!this.workout.hasOwnProperty('repsPerSet') || (this.workout.hasOwnProperty('repsPerSet') && this.workout.repsPerSet.length == 0)){ // check that it's not empty
                          modalMessage = "Please enter the number of reps for each set in the workout";
                          inputError = true;
                         } else{
                                if(this.workout.hasOwnProperty('repsPerSet')){
                                   var repsPerSet = Number(this.workout.repsPerSet);
                                   if(isNaN(repsPerSet) || !Number.isInteger(repsPerSet) || (repsPerSet < 1)){ //check that repsPerSet is a number
                                       modalMessage = "Please enter a valid number for 'Reps Per Set'";
                                       inputError = true;
                                   } else {
                                       var totalReps = sets * repsPerSet;
                                       if(totalReps > 100){
                                          modalMessage = "Please assign 100 or fewer reps per workout";
                                          inputError = true;
                                       } else if(this.athletes.length == 0){
                                          modalMessage = "Please add at least one participant to the workout";
                                          inputError = true;
                                         }
                                     }
                                }
                           }
              }
         }    
        
        if(inputError){
        let prompt = this.alertCtrl.create({
            title: modalMessage,
            buttons: [
                {
                    text: 'Close'
                }
            ]
        });
        prompt.present();
        } else{

            let prompt = this.alertCtrl.create({
                title: modalMessage,
                buttons: [
                    {
                        text: 'No'
                    },
                    {
                        text: 'Yes',
                        handler: data => {
                            //all the remove stuff
                            var workoutNumOfSets = this.workout.sets;
                            var workoutNumOfRepsPerSet = this.workout.repsPerSet;
                            this.dataService.saveWorkoutSets(workoutNumOfSets);
                            this.dataService.saveWorkoutRepsPerSet(workoutNumOfRepsPerSet);

var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';


this.dataService.getUserID().then((userID) => {
   var myData = JSON.stringify({action: "createNewWorkout", username: userID, sets: this.workout.sets, reps: this.workout.repsPerSet, workoutTitle: this.workout.title});
   this.http.post(link, myData).subscribe(data => {
this.data.response = data["_body"];
console.log(this.data.response);

      var myData = JSON.stringify({action: "assignToAthletes", username: userID, athletes: JSON.stringify(this.selectedAthletes)});
      this.http.post(link, myData).subscribe(data => {
         this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
this.dataService.saveWorkoutID(this.data.response); //MIGHT NEED TO BE PARSED FIRST
         // console.log(JSON.parse(this.data.response));
         // this.athleteNames = JSON.parse(this.data.response);
      }, error => {
         console.log("Oooops!");
      });

   }, error => {
      console.log("Oooops!");
   });
});

                            this.navCtrl.setRoot(ClassPage);
                        }
                    }
                ]
            });
            prompt.present();
        }

  }

filterAthletes(){
   console.log(this.searchTerm);
   if(this.searchTerm != null && this.searchTerm != ''){
      this.filteredAthletes=this.athletes.filter((athlete) => {
         return athlete.username.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
   } else {
      this.filteredAthletes = [];
   }
}

// this creates the new workout
//var myData = JSON.stringify({action: "createNewWorkout", username: userID, sets: this.workout.sets, reps: this.workout.repsPerSet, workoutTitle: this.workout.title});
// need a call to make changes to assignment table and populate the database for the athletes and their reps

/*submit(){
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';


//var myData = JSON.stringify({action: "assignToAthletes", username: userID, athletes: this.selectedAthletes});

this.dataService.getUserID().then((userID) => {
var myData = JSON.stringify({action: "assignToAthletes", username: userID, athletes: JSON.stringify(this.selectedAthletes)});

//var myData = JSON.stringify({action: "getAllAthleteNamesAndIDs"});

//var myData = JSON.stringify({action: "createNewWorkout", username: userID, sets: this.workout.sets, reps: this.workout.repsPerSet, workoutTitle: this.workout.title});

 this.http.post(link, myData)
 .subscribe(data => {
 this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
// console.log(JSON.parse(this.data.response));
// this.athleteNames = JSON.parse(this.data.response);
 }, error => {
 console.log("Oooops!");
 });

 });

}*/

}

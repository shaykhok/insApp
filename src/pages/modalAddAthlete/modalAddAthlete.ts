import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

import { Data } from '../../providers/data/data';
import { Http } from '@angular/http';

import { Events } from 'ionic-angular';

@Component({
  selector: 'page-modalAddAthlete',
  templateUrl: 'modalAddAthlete.html'
})
export class ModalAddAthletePage {

  selectedAthletes: any = [];
  workout = <any>{};

  searchTerm: string = '';

  data:any = {};

  athletes: any;
  filteredAthletes:any;

  athletesInWorkout: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public http: Http, public dataService: Data, public events: Events) {
this.data.username = '';
this.data.response = '';
this.http = http;

this.filteredAthletes = [];
this.athletesInWorkout = [];

var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

var myData = JSON.stringify({action: "getAllAthleteNamesAndIDs"});

this.http.post(link, myData).subscribe(data => {
 this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
 console.log(JSON.parse(this.data.response));
 this.athletes = JSON.parse(this.data.response);
 }, error => {
 console.log("Oooops!");
 });

this.dataService.getUserID().then((userID) => {
    var dataForAthletes = JSON.stringify({action: "getAthletesAssignedToWorkout", username:userID});

    this.http.post(link, dataForAthletes).subscribe(data => {
        this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
        this.athletesInWorkout = JSON.parse(this.data.response);
    }, error => {
        console.log("Oooops!");
    });
});


  }

   closeModal(){
      this.viewCtrl.dismiss();
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

      for(i = 0; i != this.athletesInWorkout.length; ++i){
         if(this.athletesInWorkout[i].athletename == athlete.athletename){
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

assignToAthletes(){
   if(this.selectedAthletes.length != 0){
      var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
      this.dataService.getUserID().then((userID) => {
      var myData = JSON.stringify({action: "assignToAthletes", username: userID, athletes: JSON.stringify(this.selectedAthletes)});

      this.http.post(link, myData).subscribe(data => {
         this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response

         //publish event to update the class page
         this.events.publish('updateClassPageAthletes:event', "test");
         console.log("sending event");
         this.closeModal();

         }, error => {
         console.log("Oooops!");
         });
      });
   }
}

/*submit(){
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';


this.dataService.getUserID().then((userID) => {
var myData = JSON.stringify({action: "assignToAthletes", username: userID, athletes: JSON.stringify(this.selectedAthletes)});

//var myData = JSON.stringify({action: "getAthletesAssignedToWorkout", username:userID});

 this.http.post(link, myData)
 .subscribe(data => {
 this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
// console.log(JSON.parse(this.data.response));
 }, error => {
 console.log("Oooops!");
 });

 });

}*/

}

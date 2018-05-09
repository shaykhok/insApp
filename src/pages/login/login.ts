import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { Data } from '../../providers/data/data';

import { Http } from '@angular/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  login = <any>{};
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public dataService: Data, public http: Http) {
     this.http = http;
     this.login.response = '';
  }

  instructorLogin(){

  var modalErrorMessage = "";
     if(!this.login.hasOwnProperty('username') || (this.login.hasOwnProperty('username') && this.login.username.length == 0)){ //if no username
        modalErrorMessage = "Please enter your username";
     } else if(!this.login.hasOwnProperty('password') || (this.login.hasOwnProperty('password') && this.login.password.length == 0)){ //if no password
        modalErrorMessage = "Please enter your password";
     }
     if(modalErrorMessage != ""){
        let prompt = this.alertCtrl.create({
            title: modalErrorMessage,
            buttons: [
                {
                    text: 'Close'
                },
            ]
        });
        prompt.present();

     }

    //username and password have at least been entered
    if(this.login.hasOwnProperty('username') && this.login.username.length > 0 && this.login.hasOwnProperty('password') && this.login.password.length > 0){
        var userExists = false;
        var passwordMatches = false;

        var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
        var userPassword = JSON.stringify({action: "instructorUserPasswordCheck", username: this.login.username, password: this.login.password});

        this.http.post(link, userPassword).subscribe(
           data => {
               this.login.response = data["_body"];
               var responseObject = JSON.parse(this.login.response);
               userExists = responseObject.userExists;
               passwordMatches = responseObject.passwordMatches;
               
                if(!userExists){ //if username not in database
                   modalErrorMessage = "The username you entered does not exist";
                } else if(!passwordMatches){ //if password is not right for the given user
                   modalErrorMessage = "Incorrect password";
                }
                if(modalErrorMessage != ""){
                   let prompt = this.alertCtrl.create({
                      title: modalErrorMessage,
                      buttons: [
                         {
                            text: 'Close'
                         },
                      ]
                });
                prompt.present();
                } else{
                   this.dataService.saveUserID(this.login.username);

//GET WORKOUTID from database (if none then set to null)

var workoutIDForUserRequest = JSON.stringify({action: "getInstructorCurrentWorkoutID", username: this.login.username});

           this.http.post(link, workoutIDForUserRequest).subscribe(
           data => {
                this.login.response = data["_body"];		//should change naming in the future
		console.log(this.login.response);
		this.dataService.saveWorkoutID(this.login.response);
                this.navCtrl.setRoot(HomePage);
             },
             error => {
                console.log("Error!");
             });
//


//                   this.navCtrl.setRoot(HomePage);
                }
             },
             error => {
                console.log("Error!");
             });

     }
  }

  signUp(){
     this.navCtrl.push(SignupPage);
  }

}

import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
 
@Injectable()
export class Data {
 
  constructor(public storage: Storage){
 
  }
 
  getWorkoutSets() {
    return this.storage.get('workoutSets'); 
  }
 
  saveWorkoutSets(data){
    this.storage.set('workoutSets', data);
  }

  getWorkoutRepsPerSet(){
    return this.storage.get('workoutRepsPerSet');
  }
  
  saveWorkoutRepsPerSet(data){
    this.storage.set('workoutRepsPerSet', data);
  }

  getUserID(){
    return this.storage.get('userID');
  }
  
  saveUserID(data){
    this.storage.set('userID', data);
  }

  getWorkoutID(){
    return this.storage.get('workoutID');
  }

  saveWorkoutID(data){
    this.storage.set('workoutID', data);
  }
 
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { People } from '../class/people';
import { Share } from '../interface/share';
@Injectable({
  providedIn: 'root'
})
export class ShareService {
  public shareCollection: any;
  public peoplecollection: any;
  share: Observable<any[]>;
  people: Observable<People[]>;
  // shareDoc: AngularFirestoreDocument<Share>;
  constructor(public db: AngularFirestore) {
    this.shareCollection = this.db.collection('share', ref => ref.orderBy('when', 'desc'));
    this.peoplecollection = this.db.collection('people', x => x.orderBy('name', 'asc'));
   }


  /** 
   *    Court share services
   * */ 

  getShare() {
    return this.db.collection('share').valueChanges();
  }

  addShare(obj) {
    return this.shareCollection.add(obj);
  }

  deleteShare(obj) {
    this.db.doc(`share/${obj.id}`).delete();
  }


  /**
   *    People Services
   * */

  // getPeople() {
  //   return this.db.collection('people').valueChanges();
  // }

  getPeople() {
    this.people = this.peoplecollection.snapshotChanges().pipe(map(
      (changes: any) => {
        return changes.map(
          a => {
            const data = a.payload.doc.data() as People;
            data.id = a.payload.doc.id;
            return data;
          });

      }));
    return this.people;
  }

  addPeople(user) {
    // return this.shareCollection.add(user);
    this.db.collection("people").doc().set(user);
  }

  deletePeople(user) {
    this.db.doc(`people/${user.id}`).delete();   
  }
  
}

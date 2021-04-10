import { Component, OnInit, ViewChild } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import { User } from './class/user';
import { AuthService } from './core/security/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  items: Observable<any[]>;
  @ViewChild(MatSidenav) drawer: MatSidenav;

  arr: User[] = [];
  model = { firstname: '', lastname: '', mobile: '' };

  constructor(public _data: AngularFirestore,
    public ar: ActivatedRoute,
    private _router: Router,
    public auth: AuthService,
    private route: ActivatedRoute) {
    this.items = _data.collection('share').valueChanges();
    
  }

  ngOnInit() {
    
  }

  closeMenu() {
    this.drawer.close();
  }

  addData(){
    this._data.collection("items").doc().set({
      name: "Los Angeles"
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
  }

  logout() {
    this.auth.logout();
  }

}

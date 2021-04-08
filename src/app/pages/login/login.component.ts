
import { Component, OnInit } from '@angular/core';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {AuthService} from '../../core/security/auth.service';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, 
    public auth: AngularFireAuth,
    private authService: AuthService,
                private router: Router) {

  }

  ngOnInit() {
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.router.navigate['home'];
  }
  logout() {
    this.auth.signOut();
  }

/*   login() {
    this.authService.doGoogleLogin()
    .then( (res) => {
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    });
  } */

}

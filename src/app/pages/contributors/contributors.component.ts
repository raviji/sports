import { Component, OnInit } from '@angular/core';

import { People } from '../../class/people';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareService } from 'src/app/services/share.service';
export interface PeopleList {
  name: string;
  id: string;
}
@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.css']
})

export class ContributorsComponent implements OnInit {
  addPlayerForm: FormGroup;
  submitted = false;
  people: PeopleList[];
  constructor(private formBuilder: FormBuilder, public sharedServ: ShareService) {  }

  ngOnInit() {
      this.addPlayerForm = this.formBuilder.group({
        name: ['', Validators.required]
      });
      this.sharedServ.getPeople().subscribe(
        (user: People[]) => {
          this.people = user;
          // console.log(this.people);
        }
      );
  }

// convenience getter for easy access to form fields
    get f() { return this.addPlayerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.addPlayerForm.invalid) {
            return;
        }
        this.sharedServ.addPeople(this.addPlayerForm.value);
        // console.log(this.addPlayerForm.value)
    }

    delete(user) {
        this.sharedServ.deletePeople(user);
      }

}

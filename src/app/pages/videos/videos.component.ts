import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  // player: YT.Player;
  nextpageToken: any;
  videoArray: any = [];
  ytURL: any = env.ytBaseUrl + env.ytKey + '&channelId=' + env.channelId + '&part=snippet,id&order=date&maxResults=5';
  constructor(private spinner: NgxSpinnerService, public http: HttpClient) {

    // this.http.get(this.ytURL)
    // .subscribe(
    //   data => {
    //     console.log(data);
    //     this.videoArray = data;
    //   },
    //   error => {
    //     console.log('Error', error);
    //   }
    // );



   }

  ngOnInit() {
    this.fetchToken('');
  }




  prevFn(token) {
    this.fetchToken(token);
  }
  nextFn(token) {
    this.fetchToken(token);
  }
  fetchToken(token) {
    this.spinner.show();
    this.http.get(this.ytURL + '&pageToken=' + token)
    .subscribe(
      data => {
        this.spinner.hide();
        this.videoArray = data;
        console.log(data)
      },
      error => {
        console.log('Error', error);
      }
    );
  }

}

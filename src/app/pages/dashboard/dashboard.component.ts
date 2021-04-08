import { Component, OnInit, AfterViewInit, ViewChild, Inject, OnDestroy, AfterContentInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatDialog} from '@angular/material/dialog';
import { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ShareService } from '../../services/share.service';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';


export interface PeriodicElement {
  when: string;
  courtFee: number;
  id: string;
  totalAmount: number;
  toDate: string;
  whoPlayed: Array<any>;
  shareSheet: Array<any>;
  people: Array<any>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {
  public displayedColumns: string[] = ['when', 'courtFee', 'shuttleCost', 'totalAmount', 'id'];
  public shareData: any;
  public dataSource = new MatTableDataSource<PeriodicElement>();
  public peopleList: any;
  public sum: any = [];
  public hidden: Boolean = false;
  public deleteRecord: Boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _data: AngularFirestore, public route: ActivatedRoute,
    private _shareData: ShareService, public dialog: MatDialog) {
    }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      if (params.delete === 's') {
        this.deleteRecord = true;
      }
    });
    this._shareData.getPeople().subscribe(
      res => {
        this.peopleList = res;
      });
    this._shareData.getShare().subscribe(
      data => {
        this.shareData = data;
        this.dataSource.data = this.shareData;
        // console.log(data);
        if (data) {this.calculateShareAmount(this.shareData); }
      });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  calculateShareAmount(arr) {
    // Calculate Shares total by id
    const totalPaid = [];
    if (this.peopleList.length > 0) {
      for (const ids of this.peopleList) {
        // console.log('start', ids.id);
        let a = 0;
        let p = 0;
        for (const s of arr) {
          if (s.shareSheet != undefined){
            s.shareSheet.forEach( (v) => {
              // console.log(v,i);
              if (v.id === ids.id) {
                a = a + v.court + v.shuttle;
                p = p + v.played;
              };
            });
          } 
        };
        // console.log(a, ids.id);
        this.sum.push({id : ids.id, totalPaid : a, totalPlayed : p, toPay: a - p});
      };
    };
  };

  ngAfterContentInit() { }



  ngOnDestroy() {}
  delete(id) {
    // console.log(id.id)
   this._shareData.deleteShare(id);
  }
  showPop(element): void {
    element.people = this.peopleList;
    console.log(element)
    const dialogRef = this.dialog.open(AppShareDataDialogComponent, {
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

// Dialog Box

@Component({
  selector: 'app-share-data-dialog-component',
  templateUrl: 'share-data-dialog.component.html',
})
export class AppShareDataDialogComponent {
  peopleList: any;
  realOne: any;
  public whenDate: any;

  constructor(
    public dialogRef: MatDialogRef<AppShareDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public shareDatas: PeriodicElement) {
      this.whenDate = this.shareDatas.when;
      console.log(this.whenDate.toDate());

      }



  onNoClick(): void {
    this.dialogRef.close();
  }
}

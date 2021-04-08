import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { ShareService } from './services/share.service';
import { MainModule } from './pages/court-share/main.module';
import { MaterialModule } from './modules/material.module';
import { AppShareDataDialogComponent, DashboardComponent } from './pages/dashboard/dashboard.component';
import { CourtShareComponent } from './pages/court-share/court-share.component';
import { SharedModule } from './modules/shared.module';
import { BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import { CommonModule } from '@angular/common';
import { ContributorsComponent } from './pages/contributors/contributors.component';
import { EventsComponent } from './pages/events/events.component';
import { LoginComponent } from './pages/login/login.component';
import { MyFilterPipe } from './pipes/filter.pipe';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PlayersComponent } from './pages/players/players.component';
import { VideosComponent } from './pages/videos/videos.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CourtShareComponent,
    ContributorsComponent,
    EventsComponent,
    LoginComponent,
    MyFilterPipe,
    NotFoundComponent,
    PlayersComponent,
    AppShareDataDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAnalyticsModule,
    MainModule,
    MaterialModule,
    SharedModule,
    CommonModule
  ],
  providers: [ShareService],
  bootstrap: [AppComponent],
  entryComponents: [ AppShareDataDialogComponent],
})
export class AppModule { }

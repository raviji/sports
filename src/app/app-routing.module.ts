

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent, AppShareDataDialogComponent } from './pages/dashboard/dashboard.component';
import { CourtShareComponent } from './pages/court-share/court-share.component';
import { ContributorsComponent } from './pages/contributors/contributors.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { canActivate } from '@angular/fire/auth-guard';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PlayersComponent } from './pages/players/players.component';
import { VideosComponent } from './pages/videos/videos.component';

const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['items']);
const belongsToAccount = (next) => hasCustomClaim(`account-${next.params.id}`);


    const routes: Routes = [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
          path: 'home',
          component: DashboardComponent,
          // canActivate: [AngularFireAuthGuard],
          // ...canActivate(adminOnly)
      },
      // {
      //     path: 'videos',
      //     component: VideosComponent,
      // },
      {
          path: 'people',
          component: ContributorsComponent,
          // canActivate: [AngularFireAuthGuard]
      }, 
      {
          path: 'share',
          component: CourtShareComponent,
          // canActivate: [AngularFireAuthGuard]
      },
      { path: 'login', component: LoginComponent 
      },
      {
        path: 'players',
        component: PlayersComponent
      },
      {
        path: '**',
        component: NotFoundComponent
    }
       
    ];

    @NgModule({
        imports: [
            RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
        ],
        exports: [
            RouterModule
        ],
        declarations: []
    })
    export class AppRoutingModule { }

    export const AppRoutingComponents = [
        DashboardComponent,
        CourtShareComponent,
        AppShareDataDialogComponent,
    ];

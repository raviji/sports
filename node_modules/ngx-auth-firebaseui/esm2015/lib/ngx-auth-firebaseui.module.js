// @angular/*
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
// @angular/fire
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// @angular/material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { NgxAuthFirebaseuiLoginComponent } from './components/ngx-auth-firebaseui-login/ngx-auth-firebaseui-login.component';
import { NgxAuthFirebaseuiRegisterComponent } from './components/ngx-auth-firebaseui-register/ngx-auth-firebaseui-register.component';
import { DomSanitizer } from '@angular/platform-browser';
// ngx-auth-firebaseui
// components
import { AuthComponent } from './components/ngx-auth-firebaseui/auth.component';
import { UserComponent } from './components/ngx-auth-firebaseui-user/user.component';
import { AuthProvidersComponent } from './components/providers/auth.providers.component';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { ngxAuthFirebaseUIConfigFactory } from './interfaces/config.interface';
import { NgxAuthFirebaseuiAvatarComponent } from './components/ngx-auth-firebaseui-avatar/ngx-auth-firebaseui-avatar.component';
import { LegalityDialogComponent } from './components/legality-dialog/legality-dialog.component';
// guards
import { LoggedInGuard } from './guards/logged-in.guard';
// services
import { FirestoreSyncService } from './services/firestore-sync.service';
import { AuthProcessService } from './services/auth-process.service';
import { NgxAuthFirebaseUIConfigToken, UserProvidedConfigToken } from './tokens';
// interfaces
// ###################################################################################################
// Export module's public API
// components
export { LegalityDialogComponent } from './components/legality-dialog/legality-dialog.component';
export { NgxAuthFirebaseuiAvatarComponent } from './components/ngx-auth-firebaseui-avatar/ngx-auth-firebaseui-avatar.component';
export { UserComponent } from './components/ngx-auth-firebaseui-user/user.component';
export { AuthComponent } from './components/ngx-auth-firebaseui/auth.component';
export { AuthProvidersComponent, Layout, Theme } from './components/providers/auth.providers.component';
export { NgxAuthFirebaseuiLoginComponent } from './components/ngx-auth-firebaseui-login/ngx-auth-firebaseui-login.component';
export { NgxAuthFirebaseuiRegisterComponent } from './components/ngx-auth-firebaseui-register/ngx-auth-firebaseui-register.component';
// guards
export { LoggedInGuard } from './guards/logged-in.guard';
// services
export { AuthProcessService, AuthProvider } from './services/auth-process.service';
export { FirestoreSyncService } from './services/firestore-sync.service';
export class NgxAuthFirebaseUIModule {
    constructor(iconRegistry, sanitizer, auth) {
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        auth.listenToUserEvents();
        this.registerProviderIcons();
    }
    static forRoot(configFactory, appNameFactory = () => undefined, config = {}) {
        return {
            ngModule: NgxAuthFirebaseUIModule,
            providers: [
                {
                    provide: FIREBASE_OPTIONS,
                    useValue: configFactory
                },
                {
                    provide: FIREBASE_APP_NAME,
                    useFactory: appNameFactory
                },
                { provide: UserProvidedConfigToken, useValue: config },
                {
                    provide: NgxAuthFirebaseUIConfigToken,
                    useFactory: ngxAuthFirebaseUIConfigFactory,
                    deps: [UserProvidedConfigToken]
                },
                AuthProcessService,
                FirestoreSyncService,
                LoggedInGuard
            ]
        };
    }
    registerProviderIcons() {
        this.iconRegistry
            .addSvgIcon('google', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/google.svg'))
            .addSvgIcon('apple', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/apple.svg'))
            .addSvgIcon('google-colored', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/google.svg'))
            .addSvgIcon('facebook', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/facebook.svg'))
            .addSvgIcon('twitter', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/twitter.svg'))
            .addSvgIcon('github', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/github-circle.svg'))
            .addSvgIcon('microsoft', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/microsoft.svg'))
            .addSvgIcon('yahoo', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/mdi/yahoo.svg'))
            .addSvgIcon('phone', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/phone.svg'));
    }
}
NgxAuthFirebaseUIModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    // HTTP
                    RouterModule,
                    HttpClientModule,
                    // FLEX_LAYOUT
                    FlexLayoutModule,
                    // FORMS
                    FormsModule,
                    ReactiveFormsModule,
                    // MATERIAL2
                    MatTabsModule,
                    MatCardModule,
                    MatInputModule,
                    MatButtonModule,
                    MatIconModule,
                    MatSnackBarModule,
                    MatDividerModule,
                    MatChipsModule,
                    MatTooltipModule,
                    MatDialogModule,
                    MatCheckboxModule,
                    MatProgressSpinnerModule,
                    MatProgressBarModule,
                    MatDialogModule,
                    MatMenuModule,
                    // ANGULAR MATERIAL EXTENSIONS
                    MatPasswordStrengthModule,
                    // ANGULARFIRE2
                    AngularFireAuthModule,
                    AngularFirestoreModule,
                ],
                exports: [
                    AuthComponent,
                    UserComponent,
                    NgxAuthFirebaseuiAvatarComponent,
                    AuthProvidersComponent,
                    EmailConfirmationComponent,
                    // LoggedInGuard,
                    AngularFireAuthModule,
                    AngularFirestoreModule,
                    NgxAuthFirebaseuiLoginComponent,
                    NgxAuthFirebaseuiRegisterComponent
                ],
                declarations: [
                    AuthComponent,
                    UserComponent,
                    NgxAuthFirebaseuiAvatarComponent,
                    AuthProvidersComponent,
                    EmailConfirmationComponent,
                    LegalityDialogComponent,
                    NgxAuthFirebaseuiLoginComponent,
                    NgxAuthFirebaseuiRegisterComponent
                ],
                entryComponents: [
                    UserComponent,
                    LegalityDialogComponent
                ]
            },] }
];
NgxAuthFirebaseUIModule.ctorParameters = () => [
    { type: MatIconRegistry },
    { type: DomSanitizer },
    { type: AuthProcessService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dGgtZmlyZWJhc2V1aS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtYXV0aC1maXJlYmFzZXVpL3NyYy9saWIvbmd4LWF1dGgtZmlyZWJhc2V1aS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsV0FBVyxFQUFFLG1CQUFtQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELGdCQUFnQjtBQUNoQixPQUFPLEVBQUMsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQ3JGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELG9CQUFvQjtBQUNwQixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7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QWE7b0JBQ2IsZ0NBQWdDO29CQUNoQyxzQkFBc0I7b0JBQ3RCLDBCQUEwQjtvQkFDMUIsdUJBQXVCO29CQUN2QiwrQkFBK0I7b0JBQy9CLGtDQUFrQztpQkFDbkM7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLGFBQWE7b0JBQ2IsdUJBQXVCO2lCQUN4QjthQUNGOzs7WUFqSHNCLGVBQWU7WUFnQjlCLFlBQVk7WUFjWixrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAYW5ndWxhci8qXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1JvdXRlck1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7RmxleExheW91dE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnO1xuLy8gQGFuZ3VsYXIvZmlyZVxuaW1wb3J0IHtGSVJFQkFTRV9BUFBfTkFNRSwgRklSRUJBU0VfT1BUSU9OUywgRmlyZWJhc2VBcHBDb25maWd9IGZyb20gJ0Bhbmd1bGFyL2ZpcmUnO1xuaW1wb3J0IHtBbmd1bGFyRmlyZUF1dGhNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2ZpcmUvYXV0aCc7XG5pbXBvcnQge0FuZ3VsYXJGaXJlc3RvcmVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2ZpcmUvZmlyZXN0b3JlJztcbi8vIEBhbmd1bGFyL21hdGVyaWFsXG5pbXBvcnQge01hdEJ1dHRvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7TWF0Q2FyZE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZCc7XG5pbXBvcnQge01hdENoZWNrYm94TW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XG5pbXBvcnQge01hdENoaXBzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGlwcyc7XG5pbXBvcnQge01hdERpYWxvZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7TWF0RGl2aWRlck1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGl2aWRlcic7XG5pbXBvcnQge01hdEljb25Nb2R1bGUsIE1hdEljb25SZWdpc3RyeX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XG5pbXBvcnQge01hdElucHV0TW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5pbXBvcnQge01hdE1lbnVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuaW1wb3J0IHtNYXRQcm9ncmVzc0Jhck1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3MtYmFyJztcbmltcG9ydCB7TWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyJztcbmltcG9ydCB7TWF0U25hY2tCYXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcic7XG5pbXBvcnQge01hdFRhYnNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYnMnO1xuaW1wb3J0IHtNYXRUb29sdGlwTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90b29sdGlwJztcblxuaW1wb3J0IHtNYXRQYXNzd29yZFN0cmVuZ3RoTW9kdWxlfSBmcm9tICdAYW5ndWxhci1tYXRlcmlhbC1leHRlbnNpb25zL3Bhc3N3b3JkLXN0cmVuZ3RoJztcblxuXG5pbXBvcnQge05neEF1dGhGaXJlYmFzZXVpTG9naW5Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uZ3gtYXV0aC1maXJlYmFzZXVpLWxvZ2luL25neC1hdXRoLWZpcmViYXNldWktbG9naW4uY29tcG9uZW50JztcbmltcG9ydCB7Tmd4QXV0aEZpcmViYXNldWlSZWdpc3RlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25neC1hdXRoLWZpcmViYXNldWktcmVnaXN0ZXIvbmd4LWF1dGgtZmlyZWJhc2V1aS1yZWdpc3Rlci5jb21wb25lbnQnO1xuXG5cbmltcG9ydCB7RG9tU2FuaXRpemVyfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbi8vIG5neC1hdXRoLWZpcmViYXNldWlcbi8vIGNvbXBvbmVudHNcbmltcG9ydCB7QXV0aENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25neC1hdXRoLWZpcmViYXNldWkvYXV0aC5jb21wb25lbnQnO1xuaW1wb3J0IHtVc2VyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmd4LWF1dGgtZmlyZWJhc2V1aS11c2VyL3VzZXIuY29tcG9uZW50JztcbmltcG9ydCB7QXV0aFByb3ZpZGVyc0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3Byb3ZpZGVycy9hdXRoLnByb3ZpZGVycy5jb21wb25lbnQnO1xuaW1wb3J0IHtFbWFpbENvbmZpcm1hdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2VtYWlsLWNvbmZpcm1hdGlvbi9lbWFpbC1jb25maXJtYXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7Tmd4QXV0aEZpcmViYXNlVUlDb25maWcsIG5neEF1dGhGaXJlYmFzZVVJQ29uZmlnRmFjdG9yeX0gZnJvbSAnLi9pbnRlcmZhY2VzL2NvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHtOZ3hBdXRoRmlyZWJhc2V1aUF2YXRhckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25neC1hdXRoLWZpcmViYXNldWktYXZhdGFyL25neC1hdXRoLWZpcmViYXNldWktYXZhdGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0xlZ2FsaXR5RGlhbG9nQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbGVnYWxpdHktZGlhbG9nL2xlZ2FsaXR5LWRpYWxvZy5jb21wb25lbnQnO1xuLy8gZ3VhcmRzXG5pbXBvcnQge0xvZ2dlZEluR3VhcmR9IGZyb20gJy4vZ3VhcmRzL2xvZ2dlZC1pbi5ndWFyZCc7XG4vLyBzZXJ2aWNlc1xuaW1wb3J0IHtGaXJlc3RvcmVTeW5jU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9maXJlc3RvcmUtc3luYy5zZXJ2aWNlJztcbmltcG9ydCB7QXV0aFByb2Nlc3NTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL2F1dGgtcHJvY2Vzcy5zZXJ2aWNlJztcbmltcG9ydCB7Tmd4QXV0aEZpcmViYXNlVUlDb25maWdUb2tlbiwgVXNlclByb3ZpZGVkQ29uZmlnVG9rZW59IGZyb20gJy4vdG9rZW5zJztcbi8vIGludGVyZmFjZXNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gRXhwb3J0IG1vZHVsZSdzIHB1YmxpYyBBUElcbi8vIGNvbXBvbmVudHNcbmV4cG9ydCB7TGVnYWxpdHlEaWFsb2dDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9sZWdhbGl0eS1kaWFsb2cvbGVnYWxpdHktZGlhbG9nLmNvbXBvbmVudCc7XG5leHBvcnQge0xpbmtNZW51SXRlbSwgTmd4QXV0aEZpcmViYXNldWlBdmF0YXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uZ3gtYXV0aC1maXJlYmFzZXVpLWF2YXRhci9uZ3gtYXV0aC1maXJlYmFzZXVpLWF2YXRhci5jb21wb25lbnQnO1xuZXhwb3J0IHtVc2VyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmd4LWF1dGgtZmlyZWJhc2V1aS11c2VyL3VzZXIuY29tcG9uZW50JztcbmV4cG9ydCB7QXV0aENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25neC1hdXRoLWZpcmViYXNldWkvYXV0aC5jb21wb25lbnQnO1xuZXhwb3J0IHtBdXRoUHJvdmlkZXJzQ29tcG9uZW50LCBMYXlvdXQsIFRoZW1lfSBmcm9tICcuL2NvbXBvbmVudHMvcHJvdmlkZXJzL2F1dGgucHJvdmlkZXJzLmNvbXBvbmVudCc7XG5leHBvcnQge05neEF1dGhGaXJlYmFzZXVpTG9naW5Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uZ3gtYXV0aC1maXJlYmFzZXVpLWxvZ2luL25neC1hdXRoLWZpcmViYXNldWktbG9naW4uY29tcG9uZW50JztcbmV4cG9ydCB7Tmd4QXV0aEZpcmViYXNldWlSZWdpc3RlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25neC1hdXRoLWZpcmViYXNldWktcmVnaXN0ZXIvbmd4LWF1dGgtZmlyZWJhc2V1aS1yZWdpc3Rlci5jb21wb25lbnQnO1xuXG5cbi8vIGd1YXJkc1xuZXhwb3J0IHtMb2dnZWRJbkd1YXJkfSBmcm9tICcuL2d1YXJkcy9sb2dnZWQtaW4uZ3VhcmQnO1xuLy8gaW50ZXJmYWNlc1xuZXhwb3J0IHtOZ3hBdXRoRmlyZWJhc2VVSUNvbmZpZ30gZnJvbSAnLi9pbnRlcmZhY2VzL2NvbmZpZy5pbnRlcmZhY2UnO1xuLy8gc2VydmljZXNcbmV4cG9ydCB7QXV0aFByb2Nlc3NTZXJ2aWNlLCBBdXRoUHJvdmlkZXJ9IGZyb20gJy4vc2VydmljZXMvYXV0aC1wcm9jZXNzLnNlcnZpY2UnO1xuZXhwb3J0IHtGaXJlc3RvcmVTeW5jU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9maXJlc3RvcmUtc3luYy5zZXJ2aWNlJztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIC8vIEhUVFBcbiAgICBSb3V0ZXJNb2R1bGUsXG4gICAgSHR0cENsaWVudE1vZHVsZSxcbiAgICAvLyBGTEVYX0xBWU9VVFxuICAgIEZsZXhMYXlvdXRNb2R1bGUsXG4gICAgLy8gRk9STVNcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgIC8vIE1BVEVSSUFMMlxuICAgIE1hdFRhYnNNb2R1bGUsXG4gICAgTWF0Q2FyZE1vZHVsZSxcbiAgICBNYXRJbnB1dE1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgTWF0SWNvbk1vZHVsZSxcbiAgICBNYXRTbmFja0Jhck1vZHVsZSxcbiAgICBNYXREaXZpZGVyTW9kdWxlLFxuICAgIE1hdENoaXBzTW9kdWxlLFxuICAgIE1hdFRvb2x0aXBNb2R1bGUsXG4gICAgTWF0RGlhbG9nTW9kdWxlLFxuICAgIE1hdENoZWNrYm94TW9kdWxlLFxuICAgIE1hdFByb2dyZXNzU3Bpbm5lck1vZHVsZSxcbiAgICBNYXRQcm9ncmVzc0Jhck1vZHVsZSxcbiAgICBNYXREaWFsb2dNb2R1bGUsXG4gICAgTWF0TWVudU1vZHVsZSxcbiAgICAvLyBBTkdVTEFSIE1BVEVSSUFMIEVYVEVOU0lPTlNcbiAgICBNYXRQYXNzd29yZFN0cmVuZ3RoTW9kdWxlLFxuICAgIC8vIEFOR1VMQVJGSVJFMlxuICAgIEFuZ3VsYXJGaXJlQXV0aE1vZHVsZSxcbiAgICBBbmd1bGFyRmlyZXN0b3JlTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQXV0aENvbXBvbmVudCxcbiAgICBVc2VyQ29tcG9uZW50LFxuICAgIE5neEF1dGhGaXJlYmFzZXVpQXZhdGFyQ29tcG9uZW50LFxuICAgIEF1dGhQcm92aWRlcnNDb21wb25lbnQsXG4gICAgRW1haWxDb25maXJtYXRpb25Db21wb25lbnQsXG4gICAgLy8gTG9nZ2VkSW5HdWFyZCxcbiAgICBBbmd1bGFyRmlyZUF1dGhNb2R1bGUsXG4gICAgQW5ndWxhckZpcmVzdG9yZU1vZHVsZSxcbiAgICBOZ3hBdXRoRmlyZWJhc2V1aUxvZ2luQ29tcG9uZW50LFxuICAgIE5neEF1dGhGaXJlYmFzZXVpUmVnaXN0ZXJDb21wb25lbnRcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQXV0aENvbXBvbmVudCxcbiAgICBVc2VyQ29tcG9uZW50LFxuICAgIE5neEF1dGhGaXJlYmFzZXVpQXZhdGFyQ29tcG9uZW50LFxuICAgIEF1dGhQcm92aWRlcnNDb21wb25lbnQsXG4gICAgRW1haWxDb25maXJtYXRpb25Db21wb25lbnQsXG4gICAgTGVnYWxpdHlEaWFsb2dDb21wb25lbnQsXG4gICAgTmd4QXV0aEZpcmViYXNldWlMb2dpbkNvbXBvbmVudCxcbiAgICBOZ3hBdXRoRmlyZWJhc2V1aVJlZ2lzdGVyQ29tcG9uZW50XG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW1xuICAgIFVzZXJDb21wb25lbnQsXG4gICAgTGVnYWxpdHlEaWFsb2dDb21wb25lbnRcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hBdXRoRmlyZWJhc2VVSU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaWNvblJlZ2lzdHJ5OiBNYXRJY29uUmVnaXN0cnksIHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsIGF1dGg6IEF1dGhQcm9jZXNzU2VydmljZSkge1xuICAgIGF1dGgubGlzdGVuVG9Vc2VyRXZlbnRzKCk7XG4gICAgdGhpcy5yZWdpc3RlclByb3ZpZGVySWNvbnMoKTtcbiAgfVxuXG4gIHN0YXRpYyBmb3JSb290KFxuICAgIGNvbmZpZ0ZhY3Rvcnk6IEZpcmViYXNlQXBwQ29uZmlnLFxuICAgIGFwcE5hbWVGYWN0b3J5OiAoKSA9PiBzdHJpbmcgfCB1bmRlZmluZWQgPSAoKSA9PiB1bmRlZmluZWQsXG4gICAgY29uZmlnOiBOZ3hBdXRoRmlyZWJhc2VVSUNvbmZpZyA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4QXV0aEZpcmViYXNlVUlNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5neEF1dGhGaXJlYmFzZVVJTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOlxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogRklSRUJBU0VfT1BUSU9OUyxcbiAgICAgICAgICAgIHVzZVZhbHVlOiBjb25maWdGYWN0b3J5XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBGSVJFQkFTRV9BUFBfTkFNRSxcbiAgICAgICAgICAgIHVzZUZhY3Rvcnk6IGFwcE5hbWVGYWN0b3J5XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7cHJvdmlkZTogVXNlclByb3ZpZGVkQ29uZmlnVG9rZW4sIHVzZVZhbHVlOiBjb25maWd9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5neEF1dGhGaXJlYmFzZVVJQ29uZmlnVG9rZW4sXG4gICAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3hBdXRoRmlyZWJhc2VVSUNvbmZpZ0ZhY3RvcnksXG4gICAgICAgICAgICBkZXBzOiBbVXNlclByb3ZpZGVkQ29uZmlnVG9rZW5dXG4gICAgICAgICAgfSxcbiAgICAgICAgICBBdXRoUHJvY2Vzc1NlcnZpY2UsXG4gICAgICAgICAgRmlyZXN0b3JlU3luY1NlcnZpY2UsXG4gICAgICAgICAgTG9nZ2VkSW5HdWFyZFxuICAgICAgICBdXG4gICAgfTtcbiAgfVxuXG4gIHJlZ2lzdGVyUHJvdmlkZXJJY29ucygpIHtcbiAgICB0aGlzLmljb25SZWdpc3RyeVxuICAgICAgLmFkZFN2Z0ljb24oJ2dvb2dsZScsIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnL2Fzc2V0cy9tZGkvZ29vZ2xlLnN2ZycpKVxuICAgICAgLmFkZFN2Z0ljb24oJ2FwcGxlJywgdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcvYXNzZXRzL21kaS9hcHBsZS5zdmcnKSlcbiAgICAgIC5hZGRTdmdJY29uKCdnb29nbGUtY29sb3JlZCcsIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnL2Fzc2V0cy9nb29nbGUuc3ZnJykpXG4gICAgICAuYWRkU3ZnSWNvbignZmFjZWJvb2snLCB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoJy9hc3NldHMvbWRpL2ZhY2Vib29rLnN2ZycpKVxuICAgICAgLmFkZFN2Z0ljb24oJ3R3aXR0ZXInLCB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoJy9hc3NldHMvbWRpL3R3aXR0ZXIuc3ZnJykpXG4gICAgICAuYWRkU3ZnSWNvbignZ2l0aHViJywgdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcvYXNzZXRzL21kaS9naXRodWItY2lyY2xlLnN2ZycpKVxuICAgICAgLmFkZFN2Z0ljb24oJ21pY3Jvc29mdCcsIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnL2Fzc2V0cy9tZGkvbWljcm9zb2Z0LnN2ZycpKVxuICAgICAgLmFkZFN2Z0ljb24oJ3lhaG9vJywgdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcvYXNzZXRzL21kaS95YWhvby5zdmcnKSlcbiAgICAgIC5hZGRTdmdJY29uKCdwaG9uZScsIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnL2Fzc2V0cy9waG9uZS5zdmcnKSk7XG4gIH1cbn1cbiJdfQ==
import { ModuleWithProviders } from '@angular/core';
import { FirebaseAppConfig } from '@angular/fire';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxAuthFirebaseUIConfig } from './interfaces/config.interface';
import { AuthProcessService } from './services/auth-process.service';
export { LegalityDialogComponent } from './components/legality-dialog/legality-dialog.component';
export { LinkMenuItem, NgxAuthFirebaseuiAvatarComponent } from './components/ngx-auth-firebaseui-avatar/ngx-auth-firebaseui-avatar.component';
export { UserComponent } from './components/ngx-auth-firebaseui-user/user.component';
export { AuthComponent } from './components/ngx-auth-firebaseui/auth.component';
export { AuthProvidersComponent, Layout, Theme } from './components/providers/auth.providers.component';
export { NgxAuthFirebaseuiLoginComponent } from './components/ngx-auth-firebaseui-login/ngx-auth-firebaseui-login.component';
export { NgxAuthFirebaseuiRegisterComponent } from './components/ngx-auth-firebaseui-register/ngx-auth-firebaseui-register.component';
export { LoggedInGuard } from './guards/logged-in.guard';
export { NgxAuthFirebaseUIConfig } from './interfaces/config.interface';
export { AuthProcessService, AuthProvider } from './services/auth-process.service';
export { FirestoreSyncService } from './services/firestore-sync.service';
export declare class NgxAuthFirebaseUIModule {
    private iconRegistry;
    private sanitizer;
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, auth: AuthProcessService);
    static forRoot(configFactory: FirebaseAppConfig, appNameFactory?: () => string | undefined, config?: NgxAuthFirebaseUIConfig): ModuleWithProviders<NgxAuthFirebaseUIModule>;
    registerProviderIcons(): void;
}

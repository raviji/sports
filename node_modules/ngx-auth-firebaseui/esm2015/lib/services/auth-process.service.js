import { __awaiter } from "tslib";
import '@firebase/auth';
import { EventEmitter, forwardRef, Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Accounts } from '../enums';
import { NgxAuthFirebaseUIConfigToken } from '../tokens';
import { FirestoreSyncService } from './firestore-sync.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/fire/auth";
import * as i2 from "../tokens/index";
import * as i3 from "@angular/material/snack-bar";
import * as i4 from "./firestore-sync.service";
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const appleAuthProvider = new firebase.auth.OAuthProvider("apple.com");
export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
export const microsoftAuthProvider = new firebase.auth.OAuthProvider("microsoft.com");
export const yahooAuthProvider = new firebase.auth.OAuthProvider("yahoo.com");
export var AuthProvider;
(function (AuthProvider) {
    AuthProvider["ALL"] = "all";
    AuthProvider["ANONYMOUS"] = "anonymous";
    AuthProvider["EmailAndPassword"] = "firebase";
    AuthProvider["Google"] = "google";
    AuthProvider["Apple"] = "apple";
    AuthProvider["Facebook"] = "facebook";
    AuthProvider["Twitter"] = "twitter";
    AuthProvider["Github"] = "github";
    AuthProvider["Microsoft"] = "microsoft";
    AuthProvider["Yahoo"] = "yahoo";
    AuthProvider["PhoneNumber"] = "phoneNumber";
})(AuthProvider || (AuthProvider = {}));
export class AuthProcessService {
    constructor(afa, config, snackBar, fireStoreService, matSnackBarConfig) {
        this.afa = afa;
        this.config = config;
        this.snackBar = snackBar;
        this.fireStoreService = fireStoreService;
        this.matSnackBarConfig = matSnackBarConfig;
        this.onSuccessEmitter = new EventEmitter();
        this.onErrorEmitter = new EventEmitter();
        // Useful to know about auth state even between reloads.
        // Replace emailConfirmationSent and emailToConfirm.
        this._user$ = new BehaviorSubject(null);
    }
    get user$() {
        return this._user$.asObservable();
    }
    listenToUserEvents() {
        this.afa.user.subscribe((user) => {
            this._user$.next(user);
            this.user = user;
        });
    }
    /**
     * Reset the password of the ngx-auth-firebaseui-user via email
     *
     * @param email - the email to reset
     */
    resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Password reset email sent");
                return yield this.afa.sendPasswordResetEmail(email);
            }
            catch (error) {
                return this.notifyError(error);
            }
        });
    }
    /**
     * General sign in mechanism to authenticate the users with a firebase project
     * using a traditional way, via username and password or by using an authentication provider
     * like google, facebook, twitter and github
     *
     * @param provider - the provider to authenticate with (google, facebook, twitter, github)
     * @param credentials optional email and password
     */
    signInWith(provider, credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let signInResult;
                switch (provider) {
                    case AuthProvider.ANONYMOUS:
                        signInResult = (yield this.afa.signInAnonymously());
                        break;
                    case AuthProvider.EmailAndPassword:
                        signInResult = (yield this.afa.signInWithEmailAndPassword(credentials.email, credentials.password));
                        break;
                    case AuthProvider.Google:
                        signInResult = (yield this.afa.signInWithPopup(googleAuthProvider));
                        break;
                    case AuthProvider.Apple:
                        signInResult = (yield this.afa.signInWithPopup(appleAuthProvider));
                        break;
                    case AuthProvider.Facebook:
                        signInResult = (yield this.afa.signInWithPopup(facebookAuthProvider));
                        break;
                    case AuthProvider.Twitter:
                        signInResult = (yield this.afa.signInWithPopup(twitterAuthProvider));
                        break;
                    case AuthProvider.Github:
                        signInResult = (yield this.afa.signInWithPopup(githubAuthProvider));
                        break;
                    case AuthProvider.Microsoft:
                        signInResult = (yield this.afa.signInWithPopup(microsoftAuthProvider));
                        break;
                    case AuthProvider.Yahoo:
                        signInResult = (yield this.afa.signInWithPopup(yahooAuthProvider));
                        break;
                    case AuthProvider.PhoneNumber:
                        // coming soon - see feature/sms branch
                        break;
                    default:
                        throw new Error(`${AuthProvider[provider]} is not available as auth provider`);
                }
                yield this.handleSuccess(signInResult);
            }
            catch (err) {
                this.handleError(err);
            }
        });
    }
    /**
     * Sign up new users via email and password.
     * After that the ngx-auth-firebaseui-user should verify and confirm an email sent via the firebase
     *
     * @param displayName - the displayName if the new ngx-auth-firebaseui-user
     * @param credentials email and password
     * @returns -
     */
    signUp(displayName, credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userCredential = yield this.afa.createUserWithEmailAndPassword(credentials.email, credentials.password);
                const user = userCredential.user;
                yield this.updateProfile(displayName, user.photoURL);
                if (this.config.enableFirestoreSync) {
                    yield this.fireStoreService.getUserDocRefByUID(user.uid).set({
                        uid: user.uid,
                        displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    });
                }
                if (this.config.enableEmailVerification) {
                    yield user.sendEmailVerification();
                }
                // Legacy fields
                this.emailConfirmationSent = true;
                this.emailToConfirm = credentials.email;
                yield this.handleSuccess(userCredential);
            }
            catch (err) {
                this.handleError(err);
            }
        });
    }
    sendNewVerificationEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.user) {
                return Promise.reject(new Error("No signed in user"));
            }
            return this.user.sendEmailVerification();
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.afa.signOut();
            }
            catch (error) {
                this.notifyError(error);
            }
        });
    }
    /**
     * Update the profile (name + photo url) of the authenticated ngx-auth-firebaseui-user in the
     * firebase authentication feature (not in firestore)
     *
     * @param name - the new name of the authenticated ngx-auth-firebaseui-user
     * @param photoURL - the new photo url of the authenticated ngx-auth-firebaseui-user
     * @returns -
     */
    updateProfile(name, photoURL) {
        return this.afa.currentUser.then((user) => {
            if (!photoURL) {
                return user.updateProfile({ displayName: name });
            }
            else {
                return user.updateProfile({ displayName: name, photoURL });
            }
        });
    }
    parseUserInfo(user) {
        return {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerId: user.providerData.length > 0 ? user.providerData[0].providerId : null,
        };
    }
    getUserPhotoUrl() {
        return this._user$.pipe(map((user) => {
            if (!user) {
                return null;
            }
            else if (user.photoURL) {
                return user.photoURL;
            }
            else if (user.emailVerified) {
                return this.getPhotoPath(Accounts.CHECK);
            }
            else if (user.isAnonymous) {
                return this.getPhotoPath(Accounts.OFF);
            }
            else {
                return this.getPhotoPath(Accounts.NONE);
            }
        }));
    }
    getPhotoPath(image) {
        return `assets/user/${image}.svg`;
    }
    signInWithPhoneNumber() {
        // todo: 3.1.18
    }
    handleSuccess(userCredential) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.config.useRawUserCredential) {
                this.onSuccessEmitter.next(userCredential);
            }
            else {
                this.onSuccessEmitter.next(userCredential.user);
            }
            if (this.config.enableFirestoreSync) {
                try {
                    yield this.fireStoreService.updateUserData(this.parseUserInfo(userCredential.user));
                }
                catch (e) {
                    console.error(`Error occurred while updating user data with firestore: ${e}`);
                }
            }
            if (this.config.toastMessageOnAuthSuccess) {
                const fallbackMessage = `Hello ${userCredential.user.displayName ? userCredential.user.displayName : ""}!`;
                this.showToast(this.messageOnAuthSuccess || fallbackMessage);
            }
        });
    }
    handleError(error) {
        this.notifyError(error);
        console.error(error);
    }
    // Refresh user info. Can be useful for instance to get latest status regarding email verification.
    reloadUserInfo() {
        return this._user$
            .pipe(take(1))
            .subscribe((user) => user && user.reload());
    }
    // Search for an error message.
    // Consumers of this library are given the possibility to provide a
    // function in case they want to instrument message based on error properties.
    getMessageOnAuthError(error) {
        // tslint:disable-next-line:no-bitwise
        return (error.toString() || "Sorry, something went wrong. Please retry later.");
    }
    // Show a toast using current snackbar config. If message is empty, no toast is displayed allowing to opt-out when needed.
    // Default MatSnackBarConfig has no duration, meaning it stays visible forever.
    // If that's the case, an action button is added to allow the end-user to dismiss the toast.
    showToast(message) {
        if (message) {
            this.snackBar.open(message, this.matSnackBarConfig.duration ? null : "OK");
        }
    }
    showErrorToast(error) {
        if (this.config.toastMessageOnAuthError) {
            this.showToast(this.getMessageOnAuthError(error));
        }
    }
    notifyError(error) {
        this.onErrorEmitter.emit(error);
        this.showErrorToast(error);
    }
}
AuthProcessService.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthProcessService_Factory() { return new AuthProcessService(i0.ɵɵinject(i1.AngularFireAuth), i0.ɵɵinject(i2.NgxAuthFirebaseUIConfigToken), i0.ɵɵinject(i3.MatSnackBar), i0.ɵɵinject(i4.FirestoreSyncService), i0.ɵɵinject(i3.MAT_SNACK_BAR_DEFAULT_OPTIONS)); }, token: AuthProcessService, providedIn: "root" });
AuthProcessService.decorators = [
    { type: Injectable, args: [{
                providedIn: "root",
            },] }
];
AuthProcessService.ctorParameters = () => [
    { type: AngularFireAuth },
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgxAuthFirebaseUIConfigToken),] }] },
    { type: MatSnackBar },
    { type: FirestoreSyncService },
    { type: MatSnackBarConfig, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DEFAULT_OPTIONS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1wcm9jZXNzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtYXV0aC1maXJlYmFzZXVpL3NyYy9saWIvc2VydmljZXMvYXV0aC1wcm9jZXNzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLDZCQUE2QixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVHLE9BQU8sUUFBUSxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUVwQyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDekQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7OztBQUloRSxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztBQUM3RSxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUN6RSxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlFLE1BQU0sQ0FBQyxNQUFN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dXJjZXNDb250ZW50IjpbImltcG9ydCAnQGZpcmViYXNlL2F1dGgnO1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5ndWxhckZpcmVBdXRoIH0gZnJvbSAnQGFuZ3VsYXIvZmlyZS9hdXRoJztcbmltcG9ydCB7IE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TLCBNYXRTbmFja0JhciwgTWF0U25hY2tCYXJDb25maWcgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbmFjay1iYXInO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICcuLi9lbnVtcyc7XG5pbXBvcnQgeyBJQ3JlZGVudGlhbHMsIElTaWduSW5Qcm9jZXNzLCBJU2lnblVwUHJvY2VzcywgTmd4QXV0aEZpcmViYXNlVUlDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE5neEF1dGhGaXJlYmFzZVVJQ29uZmlnVG9rZW4gfSBmcm9tICcuLi90b2tlbnMnO1xuaW1wb3J0IHsgRmlyZXN0b3JlU3luY1NlcnZpY2UgfSBmcm9tICcuL2ZpcmVzdG9yZS1zeW5jLnNlcnZpY2UnO1xuXG5pbXBvcnQgVXNlckNyZWRlbnRpYWwgPSBmaXJlYmFzZS5hdXRoLlVzZXJDcmVkZW50aWFsO1xuXG5leHBvcnQgY29uc3QgZmFjZWJvb2tBdXRoUHJvdmlkZXIgPSBuZXcgZmlyZWJhc2UuYXV0aC5GYWNlYm9va0F1dGhQcm92aWRlcigpO1xuZXhwb3J0IGNvbnN0IGdvb2dsZUF1dGhQcm92aWRlciA9IG5ldyBmaXJlYmFzZS5hdXRoLkdvb2dsZUF1dGhQcm92aWRlcigpO1xuZXhwb3J0IGNvbnN0IGFwcGxlQXV0aFByb3ZpZGVyID0gbmV3IGZpcmViYXNlLmF1dGguT0F1dGhQcm92aWRlcihcImFwcGxlLmNvbVwiKTtcbmV4cG9ydCBjb25zdCB0d2l0dGVyQXV0aFByb3ZpZGVyID0gbmV3IGZpcmViYXNlLmF1dGguVHdpdHRlckF1dGhQcm92aWRlcigpO1xuZXhwb3J0IGNvbnN0IGdpdGh1YkF1dGhQcm92aWRlciA9IG5ldyBmaXJlYmFzZS5hdXRoLkdpdGh1YkF1dGhQcm92aWRlcigpO1xuZXhwb3J0IGNvbnN0IG1pY3Jvc29mdEF1dGhQcm92aWRlciA9IG5ldyBmaXJlYmFzZS5hdXRoLk9BdXRoUHJvdmlkZXIoXG4gIFwibWljcm9zb2Z0LmNvbVwiXG4pO1xuZXhwb3J0IGNvbnN0IHlhaG9vQXV0aFByb3ZpZGVyID0gbmV3IGZpcmViYXNlLmF1dGguT0F1dGhQcm92aWRlcihcInlhaG9vLmNvbVwiKTtcblxuZXhwb3J0IGVudW0gQXV0aFByb3ZpZGVyIHtcbiAgQUxMID0gXCJhbGxcIixcbiAgQU5PTllNT1VTID0gXCJhbm9ueW1vdXNcIixcbiAgRW1haWxBbmRQYXNzd29yZCA9IFwiZmlyZWJhc2VcIixcbiAgR29vZ2xlID0gXCJnb29nbGVcIixcbiAgQXBwbGUgPSBcImFwcGxlXCIsXG4gIEZhY2Vib29rID0gXCJmYWNlYm9va1wiLFxuICBUd2l0dGVyID0gXCJ0d2l0dGVyXCIsXG4gIEdpdGh1YiA9IFwiZ2l0aHViXCIsXG4gIE1pY3Jvc29mdCA9IFwibWljcm9zb2Z0XCIsXG4gIFlhaG9vID0gXCJ5YWhvb1wiLFxuICBQaG9uZU51bWJlciA9IFwicGhvbmVOdW1iZXJcIixcbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiBcInJvb3RcIixcbn0pXG5leHBvcnQgY2xhc3MgQXV0aFByb2Nlc3NTZXJ2aWNlIGltcGxlbWVudHMgSVNpZ25JblByb2Nlc3MsIElTaWduVXBQcm9jZXNzIHtcbiAgb25TdWNjZXNzRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgb25FcnJvckVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLy8gVXNlZnVsIHRvIGtub3cgYWJvdXQgYXV0aCBzdGF0ZSBldmVuIGJldHdlZW4gcmVsb2Fkcy5cbiAgLy8gUmVwbGFjZSBlbWFpbENvbmZpcm1hdGlvblNlbnQgYW5kIGVtYWlsVG9Db25maXJtLlxuICBwcml2YXRlIF91c2VyJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8ZmlyZWJhc2UuVXNlciB8IG51bGw+KG51bGwpO1xuICBnZXQgdXNlciQoKTogT2JzZXJ2YWJsZTxmaXJlYmFzZS5Vc2VyIHwgbnVsbD4ge1xuICAgIHJldHVybiB0aGlzLl91c2VyJC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBhY2Nlc3MgdmlhIHVzZXIkIGFzeW5jaHJvbm91c2x5IGluc3RlYWRcbiAgICovXG4gIHVzZXI6IGZpcmViYXNlLlVzZXI7XG5cbiAgbWVzc2FnZU9uQXV0aFN1Y2Nlc3M6IHN0cmluZztcbiAgbWVzc2FnZU9uQXV0aEVycm9yOiBzdHJpbmc7XG5cbiAgLy8gTGVnYWN5IGZpZWxkIHRoYXQgaXMgc2V0IHRvIHRydWUgYWZ0ZXIgc2lnbiB1cC5cbiAgLy8gVmFsdWUgaXMgbG9zdCBpbiBjYXNlIG9mIHJlbG9hZC4gVGhlIGlkZWEgaGVyZSBpcyB0byBrbm93IGlmIHdlIGp1c3Qgc2VudCBhIHZlcmlmaWNhdGlvbiBlbWFpbC5cbiAgZW1haWxDb25maXJtYXRpb25TZW50OiBib29sZWFuO1xuICAvLyBMZWdhY3kgZmlsZWQgdGhhdCBjb250YWluIHRoZSBtYWlsIHRvIGNvbmZpcm0uIFNhbWUgbGlmZWN5Y2xlIHRoYW4gZW1haWxDb25maXJtYXRpb25TZW50LlxuICBlbWFpbFRvQ29uZmlybTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBhZmE6IEFuZ3VsYXJGaXJlQXV0aCxcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmd4QXV0aEZpcmViYXNlVUlDb25maWdUb2tlbikpXG4gICAgcHVibGljIGNvbmZpZzogTmd4QXV0aEZpcmViYXNlVUlDb25maWcsXG4gICAgcHJpdmF0ZSBzbmFja0JhcjogTWF0U25hY2tCYXIsXG4gICAgcHJpdmF0ZSBmaXJlU3RvcmVTZXJ2aWNlOiBGaXJlc3RvcmVTeW5jU2VydmljZSxcbiAgICBASW5qZWN0KE1BVF9TTkFDS19CQVJfREVGQVVMVF9PUFRJT05TKVxuICAgIHByaXZhdGUgbWF0U25hY2tCYXJDb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnXG4gICkge31cblxuICBsaXN0ZW5Ub1VzZXJFdmVudHMoKSB7XG4gICAgdGhpcy5hZmEudXNlci5zdWJzY3JpYmUoKHVzZXI6IGZpcmViYXNlLlVzZXIgfCBudWxsKSA9PiB7XG4gICAgICB0aGlzLl91c2VyJC5uZXh0KHVzZXIpO1xuICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgcGFzc3dvcmQgb2YgdGhlIG5neC1hdXRoLWZpcmViYXNldWktdXNlciB2aWEgZW1haWxcbiAgICpcbiAgICogQHBhcmFtIGVtYWlsIC0gdGhlIGVtYWlsIHRvIHJlc2V0XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcmVzZXRQYXNzd29yZChlbWFpbDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiUGFzc3dvcmQgcmVzZXQgZW1haWwgc2VudFwiKTtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmFmYS5zZW5kUGFzc3dvcmRSZXNldEVtYWlsKGVtYWlsKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMubm90aWZ5RXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmFsIHNpZ24gaW4gbWVjaGFuaXNtIHRvIGF1dGhlbnRpY2F0ZSB0aGUgdXNlcnMgd2l0aCBhIGZpcmViYXNlIHByb2plY3RcbiAgICogdXNpbmcgYSB0cmFkaXRpb25hbCB3YXksIHZpYSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgb3IgYnkgdXNpbmcgYW4gYXV0aGVudGljYXRpb24gcHJvdmlkZXJcbiAgICogbGlrZSBnb29nbGUsIGZhY2Vib29rLCB0d2l0dGVyIGFuZCBnaXRodWJcbiAgICpcbiAgICogQHBhcmFtIHByb3ZpZGVyIC0gdGhlIHByb3ZpZGVyIHRvIGF1dGhlbnRpY2F0ZSB3aXRoIChnb29nbGUsIGZhY2Vib29rLCB0d2l0dGVyLCBnaXRodWIpXG4gICAqIEBwYXJhbSBjcmVkZW50aWFscyBvcHRpb25hbCBlbWFpbCBhbmQgcGFzc3dvcmRcbiAgICovXG4gIHB1YmxpYyBhc3luYyBzaWduSW5XaXRoKHByb3ZpZGVyOiBBdXRoUHJvdmlkZXIsIGNyZWRlbnRpYWxzPzogSUNyZWRlbnRpYWxzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBzaWduSW5SZXN1bHQ6IFVzZXJDcmVkZW50aWFsIHwgYW55O1xuXG4gICAgICBzd2l0Y2ggKHByb3ZpZGVyKSB7XG4gICAgICAgIGNhc2UgQXV0aFByb3ZpZGVyLkFOT05ZTU9VUzpcbiAgICAgICAgICBzaWduSW5SZXN1bHQgPSAoYXdhaXQgdGhpcy5hZmEuc2lnbkluQW5vbnltb3VzbHkoKSkgYXMgVXNlckNyZWRlbnRpYWw7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBBdXRoUHJvdmlkZXIuRW1haWxBbmRQYXNzd29yZDpcbiAgICAgICAgICBzaWduSW5SZXN1bHQgPSAoYXdhaXQgdGhpcy5hZmEuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoXG4gICAgICAgICAgICBjcmVkZW50aWFscy5lbWFpbCxcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzLnBhc3N3b3JkXG4gICAgICAgICAgKSkgYXMgVXNlckNyZWRlbnRpYWw7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBBdXRoUHJvdmlkZXIuR29vZ2xlOlxuICAgICAgICAgIHNpZ25JblJlc3VsdCA9IChhd2FpdCB0aGlzLmFmYS5zaWduSW5XaXRoUG9wdXAoXG4gICAgICAgICAgICBnb29nbGVBdXRoUHJvdmlkZXJcbiAgICAgICAgICApKSBhcyBVc2VyQ3JlZGVudGlhbDtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIEF1dGhQcm92aWRlci5BcHBsZTpcbiAgICAgICAgICBzaWduSW5SZXN1bHQgPSAoYXdhaXQgdGhpcy5hZmEuc2lnbkluV2l0aFBvcHVwKFxuICAgICAgICAgICAgYXBwbGVBdXRoUHJvdmlkZXJcbiAgICAgICAgICApKSBhcyBVc2VyQ3JlZGVudGlhbDtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIEF1dGhQcm92aWRlci5GYWNlYm9vazpcbiAgICAgICAgICBzaWduSW5SZXN1bHQgPSAoYXdhaXQgdGhpcy5hZmEuc2lnbkluV2l0aFBvcHVwKFxuICAgICAgICAgICAgZmFjZWJvb2tBdXRoUHJvdmlkZXJcbiAgICAgICAgICApKSBhcyBVc2VyQ3JlZGVudGlhbDtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIEF1dGhQcm92aWRlci5Ud2l0dGVyOlxuICAgICAgICAgIHNpZ25JblJlc3VsdCA9IChhd2FpdCB0aGlzLmFmYS5zaWduSW5XaXRoUG9wdXAoXG4gICAgICAgICAgICB0d2l0dGVyQXV0aFByb3ZpZGVyXG4gICAgICAgICAgKSkgYXMgVXNlckNyZWRlbnRpYWw7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBBdXRoUHJvdmlkZXIuR2l0aHViOlxuICAgICAgICAgIHNpZ25JblJlc3VsdCA9IChhd2FpdCB0aGlzLmFmYS5zaWduSW5XaXRoUG9wdXAoXG4gICAgICAgICAgICBnaXRodWJBdXRoUHJvdmlkZXJcbiAgICAgICAgICApKSBhcyBVc2VyQ3JlZGVudGlhbDtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIEF1dGhQcm92aWRlci5NaWNyb3NvZnQ6XG4gICAgICAgICAgc2lnbkluUmVzdWx0ID0gKGF3YWl0IHRoaXMuYWZhLnNpZ25JbldpdGhQb3B1cChcbiAgICAgICAgICAgIG1pY3Jvc29mdEF1dGhQcm92aWRlclxuICAgICAgICAgICkpIGFzIFVzZXJDcmVkZW50aWFsO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgQXV0aFByb3ZpZGVyLllhaG9vOlxuICAgICAgICAgIHNpZ25JblJlc3VsdCA9IChhd2FpdCB0aGlzLmFmYS5zaWduSW5XaXRoUG9wdXAoXG4gICAgICAgICAgICB5YWhvb0F1dGhQcm92aWRlclxuICAgICAgICAgICkpIGFzIFVzZXJDcmVkZW50aWFsO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgQXV0aFByb3ZpZGVyLlBob25lTnVtYmVyOlxuICAgICAgICAgIC8vIGNvbWluZyBzb29uIC0gc2VlIGZlYXR1cmUvc21zIGJyYW5jaFxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYCR7QXV0aFByb3ZpZGVyW3Byb3ZpZGVyXX0gaXMgbm90IGF2YWlsYWJsZSBhcyBhdXRoIHByb3ZpZGVyYFxuICAgICAgICAgICk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZVN1Y2Nlc3Moc2lnbkluUmVzdWx0KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2lnbiB1cCBuZXcgdXNlcnMgdmlhIGVtYWlsIGFuZCBwYXNzd29yZC5cbiAgICogQWZ0ZXIgdGhhdCB0aGUgbmd4LWF1dGgtZmlyZWJhc2V1aS11c2VyIHNob3VsZCB2ZXJpZnkgYW5kIGNvbmZpcm0gYW4gZW1haWwgc2VudCB2aWEgdGhlIGZpcmViYXNlXG4gICAqXG4gICAqIEBwYXJhbSBkaXNwbGF5TmFtZSAtIHRoZSBkaXNwbGF5TmFtZSBpZiB0aGUgbmV3IG5neC1hdXRoLWZpcmViYXNldWktdXNlclxuICAgKiBAcGFyYW0gY3JlZGVudGlhbHMgZW1haWwgYW5kIHBhc3N3b3JkXG4gICAqIEByZXR1cm5zIC1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBzaWduVXAoZGlzcGxheU5hbWU6IHN0cmluZywgY3JlZGVudGlhbHM6IElDcmVkZW50aWFscykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB1c2VyQ3JlZGVudGlhbDogVXNlckNyZWRlbnRpYWwgPSBhd2FpdCB0aGlzLmFmYS5jcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQoXG4gICAgICAgIGNyZWRlbnRpYWxzLmVtYWlsLFxuICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyQ3JlZGVudGlhbC51c2VyO1xuICAgICAgYXdhaXQgdGhpcy51cGRhdGVQcm9maWxlKGRpc3BsYXlOYW1lLCB1c2VyLnBob3RvVVJMKTtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnLmVuYWJsZUZpcmVzdG9yZVN5bmMpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5maXJlU3RvcmVTZXJ2aWNlLmdldFVzZXJEb2NSZWZCeVVJRCh1c2VyLnVpZCkuc2V0KHtcbiAgICAgICAgICB1aWQ6IHVzZXIudWlkLFxuICAgICAgICAgIGRpc3BsYXlOYW1lLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIHBob3RvVVJMOiB1c2VyLnBob3RvVVJMLFxuICAgICAgICB9IGFzIGZpcmViYXNlLlVzZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jb25maWcuZW5hYmxlRW1haWxWZXJpZmljYXRpb24pIHtcbiAgICAgICAgYXdhaXQgdXNlci5zZW5kRW1haWxWZXJpZmljYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgLy8gTGVnYWN5IGZpZWxkc1xuICAgICAgdGhpcy5lbWFpbENvbmZpcm1hdGlvblNlbnQgPSB0cnVlO1xuICAgICAgdGhpcy5lbWFpbFRvQ29uZmlybSA9IGNyZWRlbnRpYWxzLmVtYWlsO1xuXG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZVN1Y2Nlc3ModXNlckNyZWRlbnRpYWwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5oYW5kbGVFcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNlbmROZXdWZXJpZmljYXRpb25FbWFpbCgpOiBQcm9taXNlPHZvaWQgfCBuZXZlcj4ge1xuICAgIGlmICghdGhpcy51c2VyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTm8gc2lnbmVkIGluIHVzZXJcIikpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51c2VyLnNlbmRFbWFpbFZlcmlmaWNhdGlvbigpO1xuICB9XG5cbiAgYXN5bmMgc2lnbk91dCgpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5hZmEuc2lnbk91dCgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLm5vdGlmeUVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBwcm9maWxlIChuYW1lICsgcGhvdG8gdXJsKSBvZiB0aGUgYXV0aGVudGljYXRlZCBuZ3gtYXV0aC1maXJlYmFzZXVpLXVzZXIgaW4gdGhlXG4gICAqIGZpcmViYXNlIGF1dGhlbnRpY2F0aW9uIGZlYXR1cmUgKG5vdCBpbiBmaXJlc3RvcmUpXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIC0gdGhlIG5ldyBuYW1lIG9mIHRoZSBhdXRoZW50aWNhdGVkIG5neC1hdXRoLWZpcmViYXNldWktdXNlclxuICAgKiBAcGFyYW0gcGhvdG9VUkwgLSB0aGUgbmV3IHBob3RvIHVybCBvZiB0aGUgYXV0aGVudGljYXRlZCBuZ3gtYXV0aC1maXJlYmFzZXVpLXVzZXJcbiAgICogQHJldHVybnMgLVxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVByb2ZpbGUobmFtZTogc3RyaW5nLCBwaG90b1VSTDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuYWZhLmN1cnJlbnRVc2VyLnRoZW4oKHVzZXI6IGZpcmViYXNlLlVzZXIpID0+IHtcbiAgICAgIGlmICghcGhvdG9VUkwpIHtcbiAgICAgICAgcmV0dXJuIHVzZXIudXBkYXRlUHJvZmlsZSh7IGRpc3BsYXlOYW1lOiBuYW1lIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVzZXIudXBkYXRlUHJvZmlsZSh7IGRpc3BsYXlOYW1lOiBuYW1lLCBwaG90b1VSTCB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVVzZXJJbmZvKHVzZXI6IGZpcmViYXNlLlVzZXIpOiBmaXJlYmFzZS5Vc2VySW5mbyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVpZDogdXNlci51aWQsXG4gICAgICBkaXNwbGF5TmFtZTogdXNlci5kaXNwbGF5TmFtZSxcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgcGhvbmVOdW1iZXI6IHVzZXIucGhvbmVOdW1iZXIsXG4gICAgICBwaG90b1VSTDogdXNlci5waG90b1VSTCxcbiAgICAgIHByb3ZpZGVySWQ6XG4gICAgICAgIHVzZXIucHJvdmlkZXJEYXRhLmxlbmd0aCA+IDAgPyB1c2VyLnByb3ZpZGVyRGF0YVswXS5wcm92aWRlcklkIDogbnVsbCxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGdldFVzZXJQaG90b1VybCgpOiBPYnNlcnZhYmxlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gdGhpcy5fdXNlciQucGlwZShcbiAgICAgIG1hcCgodXNlcjogZmlyZWJhc2UuVXNlciB8IG51bGwpID0+IHtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlci5waG90b1VSTCkge1xuICAgICAgICAgIHJldHVybiB1c2VyLnBob3RvVVJMO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldFBob3RvUGF0aChBY2NvdW50cy5DSEVDSyk7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlci5pc0Fub255bW91cykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldFBob3RvUGF0aChBY2NvdW50cy5PRkYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldFBob3RvUGF0aChBY2NvdW50cy5OT05FKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGdldFBob3RvUGF0aChpbWFnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYGFzc2V0cy91c2VyLyR7aW1hZ2V9LnN2Z2A7XG4gIH1cblxuICBwdWJsaWMgc2lnbkluV2l0aFBob25lTnVtYmVyKCkge1xuICAgIC8vIHRvZG86IDMuMS4xOFxuICB9XG5cbiAgYXN5bmMgaGFuZGxlU3VjY2Vzcyh1c2VyQ3JlZGVudGlhbDogVXNlckNyZWRlbnRpYWwpIHtcblxuICAgIGlmKHRoaXMuY29uZmlnLnVzZVJhd1VzZXJDcmVkZW50aWFsKSB7XG4gICAgICB0aGlzLm9uU3VjY2Vzc0VtaXR0ZXIubmV4dCh1c2VyQ3JlZGVudGlhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TdWNjZXNzRW1pdHRlci5uZXh0KHVzZXJDcmVkZW50aWFsLnVzZXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5lbmFibGVGaXJlc3RvcmVTeW5jKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmZpcmVTdG9yZVNlcnZpY2UudXBkYXRlVXNlckRhdGEoXG4gICAgICAgICAgdGhpcy5wYXJzZVVzZXJJbmZvKHVzZXJDcmVkZW50aWFsLnVzZXIpXG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYEVycm9yIG9jY3VycmVkIHdoaWxlIHVwZGF0aW5nIHVzZXIgZGF0YSB3aXRoIGZpcmVzdG9yZTogJHtlfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuY29uZmlnLnRvYXN0TWVzc2FnZU9uQXV0aFN1Y2Nlc3MpIHtcbiAgICAgIGNvbnN0IGZhbGxiYWNrTWVzc2FnZSA9IGBIZWxsbyAke1xuICAgICAgICB1c2VyQ3JlZGVudGlhbC51c2VyLmRpc3BsYXlOYW1lID8gdXNlckNyZWRlbnRpYWwudXNlci5kaXNwbGF5TmFtZSA6IFwiXCJcbiAgICAgIH0hYDtcbiAgICAgIHRoaXMuc2hvd1RvYXN0KHRoaXMubWVzc2FnZU9uQXV0aFN1Y2Nlc3MgfHwgZmFsbGJhY2tNZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFcnJvcihlcnJvcjogYW55KSB7XG4gICAgdGhpcy5ub3RpZnlFcnJvcihlcnJvcik7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIH1cblxuICAvLyBSZWZyZXNoIHVzZXIgaW5mby4gQ2FuIGJlIHVzZWZ1bCBmb3IgaW5zdGFuY2UgdG8gZ2V0IGxhdGVzdCBzdGF0dXMgcmVnYXJkaW5nIGVtYWlsIHZlcmlmaWNhdGlvbi5cbiAgcmVsb2FkVXNlckluZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXIkXG4gICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgLnN1YnNjcmliZSgodXNlcjogZmlyZWJhc2UuVXNlciB8IG51bGwpID0+IHVzZXIgJiYgdXNlci5yZWxvYWQoKSk7XG4gIH1cblxuICAvLyBTZWFyY2ggZm9yIGFuIGVycm9yIG1lc3NhZ2UuXG4gIC8vIENvbnN1bWVycyBvZiB0aGlzIGxpYnJhcnkgYXJlIGdpdmVuIHRoZSBwb3NzaWJpbGl0eSB0byBwcm92aWRlIGFcbiAgLy8gZnVuY3Rpb24gaW4gY2FzZSB0aGV5IHdhbnQgdG8gaW5zdHJ1bWVudCBtZXNzYWdlIGJhc2VkIG9uIGVycm9yIHByb3BlcnRpZXMuXG4gIGdldE1lc3NhZ2VPbkF1dGhFcnJvcihlcnJvcjogYW55KSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWJpdHdpc2VcbiAgICByZXR1cm4gKFxuICAgICAgZXJyb3IudG9TdHJpbmcoKSB8fCBcIlNvcnJ5LCBzb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHJldHJ5IGxhdGVyLlwiXG4gICAgKTtcbiAgfVxuXG4gIC8vIFNob3cgYSB0b2FzdCB1c2luZyBjdXJyZW50IHNuYWNrYmFyIGNvbmZpZy4gSWYgbWVzc2FnZSBpcyBlbXB0eSwgbm8gdG9hc3QgaXMgZGlzcGxheWVkIGFsbG93aW5nIHRvIG9wdC1vdXQgd2hlbiBuZWVkZWQuXG4gIC8vIERlZmF1bHQgTWF0U25hY2tCYXJDb25maWcgaGFzIG5vIGR1cmF0aW9uLCBtZWFuaW5nIGl0IHN0YXlzIHZpc2libGUgZm9yZXZlci5cbiAgLy8gSWYgdGhhdCdzIHRoZSBjYXNlLCBhbiBhY3Rpb24gYnV0dG9uIGlzIGFkZGVkIHRvIGFsbG93IHRoZSBlbmQtdXNlciB0byBkaXNtaXNzIHRoZSB0b2FzdC5cbiAgc2hvd1RvYXN0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHRoaXMubWF0U25hY2tCYXJDb25maWcuZHVyYXRpb24gPyBudWxsIDogXCJPS1wiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHNob3dFcnJvclRvYXN0KGVycm9yOiBhbnkpIHtcbiAgICBpZiAodGhpcy5jb25maWcudG9hc3RNZXNzYWdlT25BdXRoRXJyb3IpIHtcbiAgICAgIHRoaXMuc2hvd1RvYXN0KHRoaXMuZ2V0TWVzc2FnZU9uQXV0aEVycm9yKGVycm9yKSk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5RXJyb3IoZXJyb3I6IGFueSkge1xuICAgIHRoaXMub25FcnJvckVtaXR0ZXIuZW1pdChlcnJvcik7XG4gICAgdGhpcy5zaG93RXJyb3JUb2FzdChlcnJvcik7XG4gIH1cbn1cbiJdfQ==
import { __awaiter } from "tslib";
import { Component, EventEmitter, forwardRef, Inject, Input, Output, } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from "..";
import { NgxAuthFirebaseUIConfigToken } from "../../tokens";
import { AuthProcessService } from "../../services/auth-process.service";
import { FirestoreSyncService } from "../../services/firestore-sync.service";
import { map, take } from "rxjs/operators";
export class UserComponent {
    constructor(auth, authProcess, fireStoreService, config) {
        this.auth = auth;
        this.authProcess = authProcess;
        this.fireStoreService = fireStoreService;
        this.config = config;
        this.canLogout = true;
        this.canEditAccount = true;
        this.canDeleteAccount = true;
        // i18n commons
        this.notLoggedInText = "You are not logged in!";
        this.emailVerifiedText = "email is verified";
        this.emailNotVerifiedText = "email is not verified";
        this.cancelButtonText = "cancel";
        this.saveChangesButtonText = "Save changes";
        this.editButtonText = "edit";
        this.signoutButtonText = "Sign out";
        this.deleteAccountButtonText = "Delete account";
        //i18n name
        this.nameText = "Name";
        this.nameErrorRequiredText = "Name is required";
        // i18n email
        this.emailText = "Email";
        this.emailErrorRequiredText = "Email is required";
        this.emailErrorPatternText = "Please enter a valid email address";
        // i18n phone
        this.phoneText = "Phone number";
        this.phoneHintText = `
    The phone number is international. Therefore, it should start with a + sign or 00,
    followed by the country code, - and national number e.g: +49-12345678 or 0041-1234567890

      NOTE : the phone number must be a valid phone credential !!`;
        this.phoneErrorPatternText = "Please enter a valid phone number";
        // tslint:disable-next-line:no-output-on-prefix
        this.onSignOut = new EventEmitter();
        // tslint:disable-next-line:no-output-on-prefix
        this.onAccountEdited = new EventEmitter();
        // tslint:disable-next-line:no-output-on-prefix
        this.onAccountDeleted = new EventEmitter();
    }
    changeEditMode() {
        if (this.editMode) {
            this.reset();
            this.editMode = false;
        }
        else {
            this.initUpdateFormGroup().subscribe((updateFormGroup) => {
                this.updateFormGroup = updateFormGroup;
                this.editMode = true;
            });
        }
    }
    reset() {
        this.updateFormGroup.reset();
        this.updateFormGroup.disable();
        this.updateFormGroup = null;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.updateFormGroup.dirty) {
                this.editMode = false;
                const user = this.authProcess.user;
                // ngx-auth-firebaseui-user.updateProfile()
                // ngx-auth-firebaseui-user.updateEmail()
                // console.log('form = ', this.updateFormGroup);
                const snackBarMsg = [];
                try {
                    if (this.updateNameFormControl.dirty) {
                        yield user.updateProfile({
                            displayName: this.updateNameFormControl.value,
                        });
                        snackBarMsg.push(`your name has been updated to ${user.displayName}`);
                    }
                    if (this.updateEmailFormControl.dirty) {
                        yield user.updateEmail(this.updateEmailFormControl.value);
                        snackBarMsg.push(`your email has been updated to ${user.email}`);
                    }
                    if (this.updatePhoneNumberFormControl.dirty) {
                        yield user.updatePhoneNumber(this.updatePhoneNumberFormControl.value);
                        console.log("phone number = ", this.updatePhoneNumberFormControl.value);
                        snackBarMsg.push(`your phone number has been updated to ${user.phoneNumber}`);
                    }
                    if (this.config.enableFirestoreSync) {
                        yield this.fireStoreService.updateUserData(this.authProcess.parseUserInfo(user));
                    }
                }
                catch (error) {
                    this.authProcess.showToast(error && error.message ? error.message : error);
                    console.error(error);
                }
                if (snackBarMsg.length > 0) {
                    this.authProcess.showToast(snackBarMsg.join("\\n"));
                }
                this.onAccountEdited.emit(); // emit event if the form was dirty
                this.updateFormGroup.reset();
            }
        });
    }
    signOut() {
        this.auth
            .signOut()
            .then(() => this.onSignOut.emit())
            .catch((e) => console.error("An error happened while signing out!", e));
    }
    /**
     * Delete the account of the current firebase ngx-auth-firebaseui-user
     *
     * On Success, emit the <onAccountDeleted> event and toast a msg!#
     * Otherwise, log the and toast and error msg!
     *
     */
    deleteAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.authProcess.user;
                // await this.authProcess.deleteAccount();
                yield this.authProcess.user.delete();
                // if (this.config.enableFirestoreSync) {
                yield this.fireStoreService.deleteUserData(user.uid);
                // }
                this.onAccountDeleted.emit();
                this.editMode = false;
                console.log("Your account has been successfully deleted!");
                this.authProcess.showToast("Your account has been successfully deleted!");
            }
            catch (error) {
                console.log("Error while delete user account", error);
                this.authProcess.showToast(`Error occurred while deleting your account: ${error.message}`);
            }
        });
    }
    initUpdateFormGroup() {
        return this.authProcess.user$.pipe(take(1), map((currentUser) => {
            const updateFormGroup = new FormGroup({
                name: this.updateNameFormControl = new FormControl({ value: currentUser.displayName, disabled: this.editMode }, [
                    Validators.required,
                    Validators.minLength(this.config.nameMinLength),
                    Validators.maxLength(this.config.nameMaxLength),
                ]),
                email: this.updateEmailFormControl = new FormControl({ value: currentUser.email, disabled: this.editMode }, [Validators.required, Validators.pattern(EMAIL_REGEX)]),
                phoneNumber: this.updatePhoneNumberFormControl = new FormControl({ value: currentUser.phoneNumber, disabled: this.editMode }, [Validators.pattern(PHONE_NUMBER_REGEX)]),
            });
            updateFormGroup.enable();
            return updateFormGroup;
        }));
    }
}
UserComponent.decorators = [
    { type: Component, args: [{
                selector: "ngx-auth-firebaseui-user",
                template: "<div *ngIf=\"auth.authState| async; then authenticated else none\">\n\n</div>\n\n<ng-template #authenticated>\n  <mat-card *ngIf=\"auth.user | async as user\">\n    <!--<form [formGroup]=\"updateFormGroup\" >-->\n    <!--card header-->\n    <mat-card-header fxLayout=\"column\" fxLayoutAlign=\"center center\">\n\n      <img *ngIf=\"authProcess?.getUserPhotoUrl() | async as photoUrl\" [src]=\"photoUrl\" mat-card-avatar>\n\n      <div *ngIf=\"user.emailVerified; then emailVerified else emailNotVerified\"></div>\n      <ng-template #emailVerified>\n        <mat-icon color=\"primary\"\n                  [matTooltip]=\"emailVerifiedText\"\n                  matTooltipPosition=\"after\">\n          verified_user\n        </mat-icon>\n      </ng-template>\n      <ng-template #emailNotVerified>\n        <mat-icon color=\"warn\"\n                  [matTooltip]=\"emailNotVerifiedText\"\n                  matTooltipPosition=\"after\">\n          warning\n        </mat-icon>\n      </ng-template>\n\n    </mat-card-header>\n\n    <!--card content-->\n    <mat-card-content *ngIf=\"editMode; then edit else readonly\">\n    </mat-card-content>\n\n    <ng-template #edit>\n      <form (submit)=\"save()\" [formGroup]=\"updateFormGroup\">\n\n        <mat-card-content fxLayout=\"column\" fxLayoutAlign=\"center center\">\n          <div fxLayoutAlign=\"center\">\n            <button (click)=\"changeEditMode()\" class=\"edit-button\" color=\"warn\"\n                    mat-raised-button>\n              {{cancelButtonText}}\n            </button>\n          </div>\n\n          <!--name-->\n          <mat-form-field [appearance]=\"appearance\" class=\"full-width\">\n            <mat-label>{{nameText}}</mat-label>\n            <input [formControl]=\"updateNameFormControl\"\n                   matInput\n                   [placeholder]=\"nameText\">\n            <mat-icon matSuffix>person</mat-icon>\n            <mat-hint align=\"end\" aria-live=\"polite\"> {{ updateNameFormControl.value?.length }}\n              / {{ config.nameMaxLength }} </mat-hint>\n            <mat-error *ngIf=\"updateNameFormControl.hasError('required')\">\n              {{nameErrorRequiredText}}\n            </mat-error>\n          </mat-form-field>\n\n          <!--email-->\n          <mat-form-field [appearance]=\"appearance\" class=\"full-width\">\n            <mat-label>{{emailText}}</mat-label>\n            <input [formControl]=\"updateEmailFormControl\"\n                   matInput\n                   [placeholder]=\"emailText\">\n            <mat-icon matSuffix>email</mat-icon>\n            <mat-error *ngIf=\"updateEmailFormControl.hasError('required')\">\n              {{emailErrorRequiredText}} {{updateEmailFormControl.value}}\n            </mat-error>\n            <mat-error *ngIf=\"updateEmailFormControl.hasError('pattern')\">\n              {{emailErrorPatternText}} {{updateEmailFormControl.value}}\n            </mat-error>\n          </mat-form-field>\n\n          <!--phone number-->\n          <mat-form-field *ngIf=\"false\" [appearance]=\"appearance\" class=\"full-width\">\n            <mat-label>{{phoneText}}</mat-label>\n            <input [formControl]=\"updatePhoneNumberFormControl\"\n                   matInput\n                   [placeholder]=\"phoneText\"\n                   type=\"tel\">\n            <mat-icon matSuffix>phone</mat-icon>\n            <mat-hint align=\"end\" aria-live=\"polite\">\n              {{phoneHintText}}\n            </mat-hint>\n            <mat-error *ngIf=\"updatePhoneNumberFormControl.hasError('pattern')\">\n              {{phoneErrorPatternText}}\n            </mat-error>\n          </mat-form-field>\n\n        </mat-card-content>\n\n        <mat-card-actions fxLayout=\"column\">\n          <button color=\"primary\"\n                  mat-button\n                  type=\"submit\">\n            {{saveChangesButtonText}}\n          </button>\n        </mat-card-actions>\n      </form>\n    </ng-template>\n\n    <ng-template #readonly>\n      <div fxLayoutAlign=\"center\">\n        <button *ngIf=\"canEditAccount\" (click)=\"changeEditMode()\" class=\"edit-button\" color=\"primary\"\n                mat-raised-button>\n          {{editButtonText}}\n        </button>\n      </div>\n\n      <!--name-->\n      <mat-form-field [appearance]=\"appearance\" class=\"full-width\">\n        <mat-label>{{nameText}}</mat-label>\n        <input [disabled]=\"!editMode\"\n               [value]=\"user.displayName\"\n               matInput\n               [placeholder]=\"nameText\">\n        <mat-icon color=\"primary\" matSuffix>person</mat-icon>\n      </mat-form-field>\n\n      <!--email-->\n      <mat-form-field [appearance]=\"appearance\" class=\"full-width\">\n        <mat-label>{{emailText}}</mat-label>\n        <input [disabled]=\"!editMode\"\n               [value]=\"user.email\" matInput\n               [placeholder]=\"emailText\">\n        <mat-icon color=\"primary\" matSuffix>email</mat-icon>\n      </mat-form-field>\n\n      <!--phone number-->\n      <mat-form-field *ngIf=\"false\" [appearance]=\"appearance\" class=\"full-width\">\n        <mat-label>{{phoneText}}</mat-label>\n        <input [disabled]=\"!editMode\"\n               [value]=\"user.phoneNumber\"\n               matInput\n               [placeholder]=\"phoneText\">\n        <mat-icon color=\"primary\" matSuffix>phone</mat-icon>\n      </mat-form-field>\n\n      <mat-card-actions fxLayout=\"column\">\n        <button (click)=\"signOut()\" *ngIf=\"canLogout\" color=\"primary\" mat-button>{{signoutButtonText}}</button>\n        <button (click)=\"deleteAccount()\" *ngIf=\"canDeleteAccount\" color=\"warn\" mat-button>{{deleteAccountButtonText}}</button>\n      </mat-card-actions>\n\n    </ng-template>\n\n  </mat-card>\n\n</ng-template>\n\n\n<ng-template #none>\n  <mat-card class=\"none-card\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n    <mat-card-content fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <mat-icon color=\"accent\">warning</mat-icon>\n      <span>{{notLoggedInText}}</span>\n    </mat-card-content>\n  </mat-card>\n</ng-template>\n",
                styles: [".edit-button{margin:1rem}.full-width{width:100%}.cut-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.none-card{min-height:430px}.none-card span{color:rgba(0,0,0,.54);font-size:24px;text-align:center}"]
            },] }
];
UserComponent.ctorParameters = () => [
    { type: AngularFireAuth },
    { type: AuthProcessService },
    { type: FirestoreSyncService },
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgxAuthFirebaseUIConfigToken),] }] }
];
UserComponent.propDecorators = {
    editMode: [{ type: Input }],
    canLogout: [{ type: Input }],
    canEditAccount: [{ type: Input }],
    canDeleteAccount: [{ type: Input }],
    appearance: [{ type: Input }],
    notLoggedInText: [{ type: Input }],
    emailVerifiedText: [{ type: Input }],
    emailNotVerifiedText: [{ type: Input }],
    cancelButtonText: [{ type: Input }],
    saveChangesButtonText: [{ type: Input }],
    editButtonText: [{ type: Input }],
    signoutButtonText: [{ type: Input }],
    deleteAccountButtonText: [{ type: Input }],
    nameText: [{ type: Input }],
    nameErrorRequiredText: [{ type: Input }],
    emailText: [{ type: Input }],
    emailErrorRequiredText: [{ type: Input }],
    emailErrorPatternText: [{ type: Input }],
    phoneText: [{ type: Input }],
    phoneHintText: [{ type: Input }],
    phoneErrorPatternText: [{ type: Input }],
    onSignOut: [{ type: Output }],
    onAccountEdited: [{ type: Output }],
    onAccountDeleted: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtYXV0aC1maXJlYmFzZXVpL3NyYy9saWIvY29tcG9uZW50cy9uZ3gtYXV0aC1maXJlYmFzZXVpLXVzZXIvdXNlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLElBQUksQ0FBQztBQUVyRCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFNUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDekUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDN0UsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVEzQyxNQUFNLE9BQU8sYUFBYTtJQWlEeEIsWUFDUyxJQUFxQixFQUNyQixXQUErQixFQUM5QixnQkFBc0MsRUFFdkMsTUFBK0I7UUFKL0IsU0FBSSxHQUFKLElBQUksQ0FBaUI7UUFDckIsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBQzlCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7UUFFdkMsV0FBTSxHQUFOLE1BQU0sQ0FBeUI7UUFwRC9CLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFDdEIscUJBQWdCLEdBQUcs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S0FBSztnQ0FDTCxLQUFLO21DQUNMLEtBQUs7K0JBQ0wsS0FBSztvQ0FDTCxLQUFLOzZCQUNMLEtBQUs7Z0NBQ0wsS0FBSztzQ0FDTCxLQUFLO3VCQUdMLEtBQUs7b0NBQ0wsS0FBSzt3QkFHTCxLQUFLO3FDQUNMLEtBQUs7b0NBQ0wsS0FBSzt3QkFHTCxLQUFLOzRCQUNMLEtBQUs7b0NBS0wsS0FBSzt3QkFHTCxNQUFNOzhCQUdOLE1BQU07K0JBR04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPdXRwdXQsXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBbmd1bGFyRmlyZUF1dGggfSBmcm9tIFwiQGFuZ3VsYXIvZmlyZS9hdXRoXCI7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgZmlyZWJhc2UgZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFBIT05FX05VTUJFUl9SRUdFWCB9IGZyb20gXCIuLlwiO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSB9IGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkXCI7XG5pbXBvcnQgeyBOZ3hBdXRoRmlyZWJhc2VVSUNvbmZpZ1Rva2VuIH0gZnJvbSBcIi4uLy4uL3Rva2Vuc1wiO1xuaW1wb3J0IHsgTmd4QXV0aEZpcmViYXNlVUlDb25maWcgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgQXV0aFByb2Nlc3NTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2F1dGgtcHJvY2Vzcy5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBGaXJlc3RvcmVTeW5jU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9maXJlc3RvcmUtc3luYy5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBtYXAsIHRha2UgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibmd4LWF1dGgtZmlyZWJhc2V1aS11c2VyXCIsXG4gIHRlbXBsYXRlVXJsOiBcIi4vdXNlci5jb21wb25lbnQuaHRtbFwiLFxuICBzdHlsZVVybHM6IFtcIi4vdXNlci5jb21wb25lbnQuc2Nzc1wiXSxcbn0pXG5leHBvcnQgY2xhc3MgVXNlckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGVkaXRNb2RlOiBib29sZWFuO1xuICBASW5wdXQoKSBjYW5Mb2dvdXQgPSB0cnVlO1xuICBASW5wdXQoKSBjYW5FZGl0QWNjb3VudCA9IHRydWU7XG4gIEBJbnB1dCgpIGNhbkRlbGV0ZUFjY291bnQgPSB0cnVlO1xuICBASW5wdXQoKSBhcHBlYXJhbmNlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuXG4gIC8vIGkxOG4gY29tbW9uc1xuICBASW5wdXQoKSBub3RMb2dnZWRJblRleHQgPSBcIllvdSBhcmUgbm90IGxvZ2dlZCBpbiFcIjtcbiAgQElucHV0KCkgZW1haWxWZXJpZmllZFRleHQgPSBcImVtYWlsIGlzIHZlcmlmaWVkXCI7XG4gIEBJbnB1dCgpIGVtYWlsTm90VmVyaWZpZWRUZXh0ID0gXCJlbWFpbCBpcyBub3QgdmVyaWZpZWRcIjtcbiAgQElucHV0KCkgY2FuY2VsQnV0dG9uVGV4dCA9IFwiY2FuY2VsXCI7XG4gIEBJbnB1dCgpIHNhdmVDaGFuZ2VzQnV0dG9uVGV4dCA9IFwiU2F2ZSBjaGFuZ2VzXCI7XG4gIEBJbnB1dCgpIGVkaXRCdXR0b25UZXh0ID0gXCJlZGl0XCI7XG4gIEBJbnB1dCgpIHNpZ25vdXRCdXR0b25UZXh0ID0gXCJTaWduIG91dFwiO1xuICBASW5wdXQoKSBkZWxldGVBY2NvdW50QnV0dG9uVGV4dCA9IFwiRGVsZXRlIGFjY291bnRcIjtcblxuICAvL2kxOG4gbmFtZVxuICBASW5wdXQoKSBuYW1lVGV4dCA9IFwiTmFtZVwiO1xuICBASW5wdXQoKSBuYW1lRXJyb3JSZXF1aXJlZFRleHQgPSBcIk5hbWUgaXMgcmVxdWlyZWRcIjtcblxuICAvLyBpMThuIGVtYWlsXG4gIEBJbnB1dCgpIGVtYWlsVGV4dCA9IFwiRW1haWxcIjtcbiAgQElucHV0KCkgZW1haWxFcnJvclJlcXVpcmVkVGV4dCA9IFwiRW1haWwgaXMgcmVxdWlyZWRcIjtcbiAgQElucHV0KCkgZW1haWxFcnJvclBhdHRlcm5UZXh0ID0gXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzXCI7XG5cbiAgLy8gaTE4biBwaG9uZVxuICBASW5wdXQoKSBwaG9uZVRleHQgPSBcIlBob25lIG51bWJlclwiO1xuICBASW5wdXQoKSBwaG9uZUhpbnRUZXh0ID0gYFxuICAgIFRoZSBwaG9uZSBudW1iZXIgaXMgaW50ZXJuYXRpb25hbC4gVGhlcmVmb3JlLCBpdCBzaG91bGQgc3RhcnQgd2l0aCBhICsgc2lnbiBvciAwMCxcbiAgICBmb2xsb3dlZCBieSB0aGUgY291bnRyeSBjb2RlLCAtIGFuZCBuYXRpb25hbCBudW1iZXIgZS5nOiArNDktMTIzNDU2Nzggb3IgMDA0MS0xMjM0NTY3ODkwXG5cbiAgICAgIE5PVEUgOiB0aGUgcGhvbmUgbnVtYmVyIG11c3QgYmUgYSB2YWxpZCBwaG9uZSBjcmVkZW50aWFsICEhYDtcbiAgQElucHV0KCkgcGhvbmVFcnJvclBhdHRlcm5UZXh0ID0gXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBwaG9uZSBudW1iZXJcIjtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCkgb25TaWduT3V0OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIG9uQWNjb3VudEVkaXRlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSBvbkFjY291bnREZWxldGVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgdXBkYXRlRm9ybUdyb3VwOiBGb3JtR3JvdXA7XG4gIHVwZGF0ZU5hbWVGb3JtQ29udHJvbDogRm9ybUNvbnRyb2w7XG4gIHVwZGF0ZUVtYWlsRm9ybUNvbnRyb2w6IEZvcm1Db250cm9sO1xuICB1cGRhdGVQaG9uZU51bWJlckZvcm1Db250cm9sOiBGb3JtQ29udHJvbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgYXV0aDogQW5ndWxhckZpcmVBdXRoLFxuICAgIHB1YmxpYyBhdXRoUHJvY2VzczogQXV0aFByb2Nlc3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgZmlyZVN0b3JlU2VydmljZTogRmlyZXN0b3JlU3luY1NlcnZpY2UsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5neEF1dGhGaXJlYmFzZVVJQ29uZmlnVG9rZW4pKVxuICAgIHB1YmxpYyBjb25maWc6IE5neEF1dGhGaXJlYmFzZVVJQ29uZmlnXG4gICkge31cblxuICBjaGFuZ2VFZGl0TW9kZSgpIHtcbiAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xuICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluaXRVcGRhdGVGb3JtR3JvdXAoKS5zdWJzY3JpYmUoKHVwZGF0ZUZvcm1Hcm91cDogRm9ybUdyb3VwKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlRm9ybUdyb3VwID0gdXBkYXRlRm9ybUdyb3VwO1xuICAgICAgICB0aGlzLmVkaXRNb2RlID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudXBkYXRlRm9ybUdyb3VwLnJlc2V0KCk7XG4gICAgdGhpcy51cGRhdGVGb3JtR3JvdXAuZGlzYWJsZSgpO1xuICAgIHRoaXMudXBkYXRlRm9ybUdyb3VwID0gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIHNhdmUoKSB7XG4gICAgaWYgKHRoaXMudXBkYXRlRm9ybUdyb3VwLmRpcnR5KSB7XG4gICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XG4gICAgICBjb25zdCB1c2VyID0gdGhpcy5hdXRoUHJvY2Vzcy51c2VyO1xuICAgICAgLy8gbmd4LWF1dGgtZmlyZWJhc2V1aS11c2VyLnVwZGF0ZVByb2ZpbGUoKVxuICAgICAgLy8gbmd4LWF1dGgtZmlyZWJhc2V1aS11c2VyLnVwZGF0ZUVtYWlsKClcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3JtID0gJywgdGhpcy51cGRhdGVGb3JtR3JvdXApO1xuXG4gICAgICBjb25zdCBzbmFja0Jhck1zZzogc3RyaW5nW10gPSBbXTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMudXBkYXRlTmFtZUZvcm1Db250cm9sLmRpcnR5KSB7XG4gICAgICAgICAgYXdhaXQgdXNlci51cGRhdGVQcm9maWxlKHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB0aGlzLnVwZGF0ZU5hbWVGb3JtQ29udHJvbC52YWx1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzbmFja0Jhck1zZy5wdXNoKGB5b3VyIG5hbWUgaGFzIGJlZW4gdXBkYXRlZCB0byAke3VzZXIuZGlzcGxheU5hbWV9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51cGRhdGVFbWFpbEZvcm1Db250cm9sLmRpcnR5KSB7XG4gICAgICAgICAgYXdhaXQgdXNlci51cGRhdGVFbWFpbCh0aGlzLnVwZGF0ZUVtYWlsRm9ybUNvbnRyb2wudmFsdWUpO1xuICAgICAgICAgIHNuYWNrQmFyTXNnLnB1c2goYHlvdXIgZW1haWwgaGFzIGJlZW4gdXBkYXRlZCB0byAke3VzZXIuZW1haWx9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51cGRhdGVQaG9uZU51bWJlckZvcm1Db250cm9sLmRpcnR5KSB7XG4gICAgICAgICAgYXdhaXQgdXNlci51cGRhdGVQaG9uZU51bWJlcih0aGlzLnVwZGF0ZVBob25lTnVtYmVyRm9ybUNvbnRyb2wudmFsdWUpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJwaG9uZSBudW1iZXIgPSBcIixcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGhvbmVOdW1iZXJGb3JtQ29udHJvbC52YWx1ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgc25hY2tCYXJNc2cucHVzaChcbiAgICAgICAgICAgIGB5b3VyIHBob25lIG51bWJlciBoYXMgYmVlbiB1cGRhdGVkIHRvICR7dXNlci5waG9uZU51bWJlcn1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5lbmFibGVGaXJlc3RvcmVTeW5jKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5maXJlU3RvcmVTZXJ2aWNlLnVwZGF0ZVVzZXJEYXRhKFxuICAgICAgICAgICAgdGhpcy5hdXRoUHJvY2Vzcy5wYXJzZVVzZXJJbmZvKHVzZXIpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5hdXRoUHJvY2Vzcy5zaG93VG9hc3QoXG4gICAgICAgICAgZXJyb3IgJiYgZXJyb3IubWVzc2FnZSA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvclxuICAgICAgICApO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNuYWNrQmFyTXNnLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5hdXRoUHJvY2Vzcy5zaG93VG9hc3Qoc25hY2tCYXJNc2cuam9pbihcIlxcXFxuXCIpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub25BY2NvdW50RWRpdGVkLmVtaXQoKTsgLy8gZW1pdCBldmVudCBpZiB0aGUgZm9ybSB3YXMgZGlydHlcbiAgICAgIHRoaXMudXBkYXRlRm9ybUdyb3VwLnJlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgc2lnbk91dCgpIHtcbiAgICB0aGlzLmF1dGhcbiAgICAgIC5zaWduT3V0KClcbiAgICAgIC50aGVuKCgpID0+IHRoaXMub25TaWduT3V0LmVtaXQoKSlcbiAgICAgIC5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcihcIkFuIGVycm9yIGhhcHBlbmVkIHdoaWxlIHNpZ25pbmcgb3V0IVwiLCBlKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRoZSBhY2NvdW50IG9mIHRoZSBjdXJyZW50IGZpcmViYXNlIG5neC1hdXRoLWZpcmViYXNldWktdXNlclxuICAgKlxuICAgKiBPbiBTdWNjZXNzLCBlbWl0IHRoZSA8b25BY2NvdW50RGVsZXRlZD4gZXZlbnQgYW5kIHRvYXN0IGEgbXNnISNcbiAgICogT3RoZXJ3aXNlLCBsb2cgdGhlIGFuZCB0b2FzdCBhbmQgZXJyb3IgbXNnIVxuICAgKlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlQWNjb3VudCgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdXNlciA9IHRoaXMuYXV0aFByb2Nlc3MudXNlcjtcblxuICAgICAgLy8gYXdhaXQgdGhpcy5hdXRoUHJvY2Vzcy5kZWxldGVBY2NvdW50KCk7XG4gICAgICBhd2FpdCB0aGlzLmF1dGhQcm9jZXNzLnVzZXIuZGVsZXRlKCk7XG4gICAgICAvLyBpZiAodGhpcy5jb25maWcuZW5hYmxlRmlyZXN0b3JlU3luYykge1xuICAgICAgYXdhaXQgdGhpcy5maXJlU3RvcmVTZXJ2aWNlLmRlbGV0ZVVzZXJEYXRhKHVzZXIudWlkKTtcbiAgICAgIC8vIH1cbiAgICAgIHRoaXMub25BY2NvdW50RGVsZXRlZC5lbWl0KCk7XG4gICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XG4gICAgICBjb25zb2xlLmxvZyhcIllvdXIgYWNjb3VudCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgZGVsZXRlZCFcIik7XG4gICAgICB0aGlzLmF1dGhQcm9jZXNzLnNob3dUb2FzdChcIllvdXIgYWNjb3VudCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgZGVsZXRlZCFcIik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igd2hpbGUgZGVsZXRlIHVzZXIgYWNjb3VudFwiLCBlcnJvcik7XG4gICAgICB0aGlzLmF1dGhQcm9jZXNzLnNob3dUb2FzdChcbiAgICAgICAgYEVycm9yIG9jY3VycmVkIHdoaWxlIGRlbGV0aW5nIHlvdXIgYWNjb3VudDogJHtlcnJvci5tZXNzYWdlfWBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRVcGRhdGVGb3JtR3JvdXAoKTogT2JzZXJ2YWJsZTxGb3JtR3JvdXA+IHtcbiAgICByZXR1cm4gdGhpcy5hdXRoUHJvY2Vzcy51c2VyJC5waXBlKFxuICAgICAgdGFrZSgxKSxcbiAgICAgIG1hcCgoY3VycmVudFVzZXI6IGZpcmViYXNlLlVzZXIpID0+IHtcbiAgICAgICAgY29uc3QgdXBkYXRlRm9ybUdyb3VwID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgICAgICAgbmFtZTogdGhpcy51cGRhdGVOYW1lRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woXG4gICAgICAgICAgICB7IHZhbHVlOiBjdXJyZW50VXNlci5kaXNwbGF5TmFtZSwgZGlzYWJsZWQ6IHRoaXMuZWRpdE1vZGUgfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAgICAgICAgICAgICAgVmFsaWRhdG9ycy5taW5MZW5ndGgodGhpcy5jb25maWcubmFtZU1pbkxlbmd0aCksXG4gICAgICAgICAgICAgIFZhbGlkYXRvcnMubWF4TGVuZ3RoKHRoaXMuY29uZmlnLm5hbWVNYXhMZW5ndGgpLFxuICAgICAgICAgICAgXVxuICAgICAgICAgICksXG5cbiAgICAgICAgICBlbWFpbDogdGhpcy51cGRhdGVFbWFpbEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKFxuICAgICAgICAgICAgeyB2YWx1ZTogY3VycmVudFVzZXIuZW1haWwsIGRpc2FibGVkOiB0aGlzLmVkaXRNb2RlIH0sXG4gICAgICAgICAgICBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5wYXR0ZXJuKEVNQUlMX1JFR0VYKV1cbiAgICAgICAgICApLFxuXG4gICAgICAgICAgcGhvbmVOdW1iZXI6IHRoaXMudXBkYXRlUGhvbmVOdW1iZXJGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbChcbiAgICAgICAgICAgIHsgdmFsdWU6IGN1cnJlbnRVc2VyLnBob25lTnVtYmVyLCBkaXNhYmxlZDogdGhpcy5lZGl0TW9kZSB9LFxuICAgICAgICAgICAgW1ZhbGlkYXRvcnMucGF0dGVybihQSE9ORV9OVU1CRVJfUkVHRVgpXVxuICAgICAgICAgICksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVwZGF0ZUZvcm1Hcm91cC5lbmFibGUoKTtcbiAgICAgICAgcmV0dXJuIHVwZGF0ZUZvcm1Hcm91cDtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIl19
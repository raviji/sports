import { __awaiter } from "tslib";
import { Component, EventEmitter, forwardRef, Inject, Input, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxAuthFirebaseuiAnimations } from '../../animations';
import { AuthProcessService } from '../../services/auth-process.service';
import { isPlatformBrowser } from '@angular/common';
import { NgxAuthFirebaseUIConfigToken } from '../../tokens';
export const confirmPasswordValidator = (control) => {
    if (!control.parent || !control) {
        return null;
    }
    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');
    if (!password || !passwordConfirm) {
        return null;
    }
    if (passwordConfirm.value === '') {
        return null;
    }
    if (password.value === passwordConfirm.value) {
        return null;
    }
    return { passwordsNotMatching: true };
};
export class NgxAuthFirebaseuiRegisterComponent {
    // tslint:disable-next-line:ban-types
    constructor(platformId, config, formBuilder, authProcess) {
        // Configure the layout
        this.platformId = platformId;
        this.config = config;
        this.formBuilder = formBuilder;
        this.authProcess = authProcess;
        // i18n common
        this.titleText = 'CREATE AN ACCOUNT';
        this.termsAndConditionsText = 'I read and accept the';
        this.termsAndConditionsLinkText = 'terms and conditions';
        this.privacyPolicyText = 'I read and accept the';
        this.privacyPolicyLinkText = 'privacy policy';
        this.createAccountButtonText = 'CREATE AN ACCOUNT';
        this.alreadyHaveAccountText = 'Already have an account?';
        this.loginButtonText = 'LOGIN';
        // i18n name
        this.nameText = 'Name';
        this.nameErrorRequiredText = 'Name is required';
        // i18n email
        this.emailText = 'Email';
        this.emailErrorRequiredText = 'Email is required';
        this.emailErrorPatternText = 'Please enter a valid email address';
        // i18n password
        this.passwordText = 'Password';
        this.passwordErrorRequiredText = 'Password is required';
        this.passwordConfirmationText = 'Password Confirmation';
        this.passwordConfirmationErrorRequiredText = 'Password confirmation is required';
        this.passwordErrorMatchText = 'Password must match';
        this.passwordErrorMinLengthText = "The password is too short!";
        this.passwordErrorMaxLengthText = "The password is too long!";
        // tslint:disable-next-line:no-output-on-prefix
        this.onLoginRequested = new EventEmitter();
        this.onCreateAccountButtonClicked = new EventEmitter();
        this.authenticationError = false;
        // Set the private defaults
        this.unsubscribeAll = new Subject();
        this.onSuccess = authProcess.onSuccessEmitter;
        this.onError = authProcess.onErrorEmitter;
    }
    get color() {
        return this.authenticationError ? 'warn' : 'primary';
    }
    get colorAccent() {
        return this.authenticationError ? 'warn' : 'accent';
    }
    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.onErrorSubscription = this.onError.subscribe(() => this.authenticationError = true);
        }
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required,
                    Validators.minLength(this.config.passwordMinLength),
                    Validators.maxLength(this.config.passwordMaxLength)]],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            tos: [''],
            privacyPolicy: ['']
        });
        // If tos or privacy policy url set, ensure that the two form items are required
        if (this.tosUrl) {
            this.registerForm.controls.tos.setValidators(Validators.requiredTrue);
        }
        if (this.privacyPolicyUrl) {
            this.registerForm.controls.privacyPolicy.setValidators(Validators.requiredTrue);
        }
        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm
            .controls
            .password
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe(() => {
            this.registerForm.controls.passwordConfirm.updateValueAndValidity();
        });
    }
    /**
     * On destroy
     */
    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
    createAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            // Emit the create account clicked event.
            this.onCreateAccountButtonClicked.emit();
            return yield this.authProcess.signUp(this.registerForm.controls.name.value, {
                email: this.registerForm.controls.email.value,
                password: this.registerForm.controls.password.value
            });
        });
    }
}
NgxAuthFirebaseuiRegisterComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-auth-firebaseui-register',
                template: "<div fxLayout=\"column\" id=\"register\">\n\n  <div fxLayout=\"column\" fxLayoutAlign=\"center center\" id=\"register-form-wrapper\">\n\n    <div [@animateStagger]=\"{ value: '50' }\" id=\"register-form\">\n\n      <div *ngIf=\"logoUrl\" class=\"logo\">\n        <img [@animate]=\"{ value: '*', params: { x: '50px' } }\" [src]=\"logoUrl\" alt=\"logo\">\n      </div>\n\n      <div [@animate]=\"{ value: '*', params: { x: '-50px' } }\" class=\"title\">{{titleText}}</div>\n\n      <form [@animate]=\"{value:'*',params:{duration:'300ms',y:'100px'}}\" [formGroup]=\"registerForm\" name=\"registerForm\"\n            novalidate>\n\n        <mat-form-field [@animate]=\"{ value: '*', params: { x: '50px' } }\" [appearance]=\"appearance\">\n          <input [placeholder]=\"nameText\" formControlName=\"name\" matInput/>\n          <mat-icon [color]=\"color\" matSuffix>person</mat-icon>\n          <mat-error>\n            {{nameErrorRequiredText}}\n          </mat-error>\n        </mat-form-field>\n\n        <mat-form-field [@animate]=\"{ value: '*', params: { x: '50px' } }\" [appearance]=\"appearance\">\n          <input [placeholder]=\"emailText\" formControlName=\"email\" matInput autocomplete=\"username\"/>\n          <mat-icon [color]=\"color\" matSuffix>email</mat-icon>\n          <mat-error *ngIf=\"registerForm.get('email')?.hasError('required')\">\n            {{emailErrorRequiredText}}\n          </mat-error>\n          <mat-error *ngIf=\"registerForm.get('email')?.hasError('email')\">\n            {{emailErrorPatternText}}\n          </mat-error>\n        </mat-form-field>\n\n        <mat-form-field [@animate]=\"{ value: '*', params: { x: '50px' } }\" [appearance]=\"appearance\">\n          <input [placeholder]=\"passwordText\" formControlName=\"password\" matInput type=\"password\" autocomplete=\"new-password\"/>\n          <mat-icon [color]=\"color\" matSuffix>lock</mat-icon>\n          <mat-error  *ngIf=\"registerForm.get('password')?.hasError('required')\">\n            {{passwordErrorRequiredText}}\n          </mat-error>\n          <mat-error  *ngIf=\"registerForm.get('password')?.hasError('minlength')\">\n            {{ passwordErrorMinLengthText }}\n          </mat-error>\n          <mat-error  *ngIf=\"registerForm.get('password')?.hasError('maxlength')\">\n            {{ passwordErrorMaxLengthText }}\n          </mat-error>\n        </mat-form-field>\n\n        <mat-form-field [@animate]=\"{ value: '*', params: { x: '50px' } }\" [appearance]=\"appearance\">\n          <input [placeholder]=\"passwordConfirmationText\" formControlName=\"passwordConfirm\" matInput type=\"password\" autocomplete=\"new-password\"/>\n          <mat-icon [color]=\"color\" matSuffix>lock</mat-icon>\n          <mat-error *ngIf=\"registerForm.get('passwordConfirm')?.hasError('required')\">\n            {{passwordConfirmationErrorRequiredText}}\n          </mat-error>\n          <mat-error\n            *ngIf=\"\n              !registerForm.get('passwordConfirm')?.hasError('required') &&\n              registerForm.get('passwordConfirm')?.hasError('passwordsNotMatching')\n            \">\n            {{passwordErrorMatchText}}\n          </mat-error>\n        </mat-form-field>\n\n        <div *ngIf=\"this.tosUrl\">\n          <mat-checkbox aria-label=\"{{termsAndConditionsText}}\" formControlName=\"tos\" required>\n            <span>{{termsAndConditionsText}}</span>\n            <a target=\"_blank\" [href]=\"this.tosUrl\">\n                {{termsAndConditionsLinkText}}\n            </a>\n          </mat-checkbox>\n        </div>\n\n        <div *ngIf=\"this.privacyPolicyUrl\">\n          <mat-checkbox aria-label=\"{{privacyPolicyText}}\" formControlName=\"privacyPolicy\" required>\n            <span>{{privacyPolicyText}}</span>\n            <a target=\"_blank\" [href]=\"this.privacyPolicyUrl\">\n                {{privacyPolicyLinkText}}\n            </a>\n          </mat-checkbox>\n        </div>\n\n        <button (click)=\"createAccount()\"\n                [color]=\"colorAccent\"\n                [disabled]=\"registerForm.invalid\"\n                aria-label=\"CREATE AN ACCOUNT\"\n                class=\"submit-button\"\n                id=\"createAccountButton\"\n                mat-raised-button>\n          {{createAccountButtonText}}\n        </button>\n      </form>\n\n      <div [@animate]=\"{value:'*',params:{duration:'300ms',y:'100px'}}\" class=\"register\" fxLayout=\"column\"\n           fxLayoutAlign=\"center center\">\n        <span [@animate]=\"{ value: '*', params: { x: '100px' } }\" class=\"text\">\n          {{alreadyHaveAccountText}}\n        </span>\n        <button (click)=\"onLoginRequested.emit()\"\n                [@animate]=\"{ value: '*', params: { x: '-100px' } }\"\n                [color]=\"colorAccent\"\n                id=\"loginButton\"\n                mat-button\n                type=\"button\">\n          {{loginButtonText}}\n        </button>\n      </div>\n\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                animations: NgxAuthFirebaseuiAnimations,
                styles: ["ngx-auth-firebaseui-register #register{background-size:cover;width:100%}ngx-auth-firebaseui-register #register #register-form-wrapper{flex:1 0 auto;padding:32px}@media screen and (max-width:599px){ngx-auth-firebaseui-register #register #register-form-wrapper{padding:16px}}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form{max-width:384px;padding:32px;text-align:center;width:384px}@media screen and (max-width:599px){ngx-auth-firebaseui-register #register #register-form-wrapper #register-form{padding:24px;width:100%}}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .logo{margin:32px auto;width:128px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .title{font-size:20px;margin:16px 0 32px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form form{text-align:left;width:100%}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form form mat-form-field{width:100%}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form form mat-checkbox{margin:0}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form form .terms{margin:16px 0 32px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form form .terms a{font-size:16px;margin-left:4px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form form .submit-button{display:block;margin:16px auto;width:220px}@media screen and (max-width:599px){ngx-auth-firebaseui-register #register #register-form-wrapper #register-form form .submit-button{width:90%}}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .register{font-weight:500;margin:32px auto 24px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .register .text{margin-right:8px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .separator{font-size:15px;font-weight:600;margin:24px auto;overflow:hidden;position:relative;width:100px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .separator .text{display:inline-flex;padding:0 8px;position:relative;z-index:9999}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .separator .text:after,ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .separator .text:before{border-top:1px solid;content:\"\";display:block;position:absolute;top:10px;width:30px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .separator .text:before{right:100%}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form .separator .text:after{left:100%}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form button.facebook,ngx-auth-firebaseui-register #register #register-form-wrapper #register-form button.google{color:#fff;font-size:13px;text-transform:none;width:192px}@media screen and (max-width:599px){ngx-auth-firebaseui-register #register #register-form-wrapper #register-form button{width:80%}}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form button.google{background-color:#d73d32;margin-bottom:8px}ngx-auth-firebaseui-register #register #register-form-wrapper #register-form button.facebook{background-color:#3f5c9a}ngx-auth-firebaseui-register ::ng-deep .mat-checkbox-label{display:flex;flex-wrap:wrap}"]
            },] }
];
NgxAuthFirebaseuiRegisterComponent.ctorParameters = () => [
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgxAuthFirebaseUIConfigToken),] }] },
    { type: FormBuilder },
    { type: AuthProcessService }
];
NgxAuthFirebaseuiRegisterComponent.propDecorators = {
    logoUrl: [{ type: Input }],
    appearance: [{ type: Input }],
    tosUrl: [{ type: Input }],
    privacyPolicyUrl: [{ type: Input }],
    titleText: [{ type: Input }],
    termsAndConditionsText: [{ type: Input }],
    termsAndConditionsLinkText: [{ type: Input }],
    privacyPolicyText: [{ type: Input }],
    privacyPolicyLinkText: [{ type: Input }],
    createAccountButtonText: [{ type: Input }],
    alreadyHaveAccountText: [{ type: Input }],
    loginButtonText: [{ type: Input }],
    nameText: [{ type: Input }],
    nameErrorRequiredText: [{ type: Input }],
    emailText: [{ type: Input }],
    emailErrorRequiredText: [{ type: Input }],
    emailErrorPatternText: [{ type: Input }],
    passwordText: [{ type: Input }],
    passwordErrorRequiredText: [{ type: Input }],
    passwordConfirmationText: [{ type: Input }],
    passwordConfirmationErrorRequiredText: [{ type: Input }],
    passwordErrorMatchText: [{ type: Input }],
    passwordErrorMinLengthText: [{ type: Input }],
    passwordErrorMaxLengthText: [{ type: Input }],
    onSuccess: [{ type: Output }],
    onError: [{ type: Output }],
    onLoginRequested: [{ type: Output }],
    onCreateAccountButtonClicked: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dGgtZmlyZWJhc2V1aS1yZWdpc3Rlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtYXV0aC1maXJlYmFzZXVpL3NyYy9saWIvY29tcG9uZW50cy9uZ3gtYXV0aC1maXJlYmFzZXVpLXJlZ2lzdGVyL25neC1hdXRoLWZpcmViYXNldWktcmVnaXN0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1SSxPQUFPLEVBQWtCLFdBQVcsRUFBNEMsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEgsT0FBTyxFQUFDLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFekMsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDN0QsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDdkUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHbEQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRzVELE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFnQixDQUFDLE9BQXdCLEVBQTJCLEVBQUU7SUFDekcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDL0IsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sZUFBZSxH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c0NBQ0wsS0FBSztxQ0FDTCxLQUFLOzhCQUNMLEtBQUs7dUJBR0wsS0FBSztvQ0FDTCxLQUFLO3dCQUdMLEtBQUs7cUNBQ0wsS0FBSztvQ0FDTCxLQUFLOzJCQUdMLEtBQUs7d0NBQ0wsS0FBSzt1Q0FDTCxLQUFLO29EQUNMLEtBQUs7cUNBQ0wsS0FBSzt5Q0FDTCxLQUFLO3lDQUNMLEtBQUs7d0JBSUwsTUFBTTtzQkFFTixNQUFNOytCQUVOLE1BQU07MkNBRU4sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFBMQVRGT1JNX0lELCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm4sIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7Tmd4QXV0aEZpcmViYXNldWlBbmltYXRpb25zfSBmcm9tICcuLi8uLi9hbmltYXRpb25zJztcbmltcG9ydCB7QXV0aFByb2Nlc3NTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hdXRoLXByb2Nlc3Muc2VydmljZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRBcHBlYXJhbmNlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7VGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7IE5neEF1dGhGaXJlYmFzZVVJQ29uZmlnVG9rZW4gfSBmcm9tICcuLi8uLi90b2tlbnMnO1xuaW1wb3J0IHsgTmd4QXV0aEZpcmViYXNlVUlDb25maWcgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNvbnN0IGNvbmZpcm1QYXNzd29yZFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICBpZiAoIWNvbnRyb2wucGFyZW50IHx8ICFjb250cm9sKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBwYXNzd29yZCA9IGNvbnRyb2wucGFyZW50LmdldCgncGFzc3dvcmQnKTtcbiAgY29uc3QgcGFzc3dvcmRDb25maXJtID0gY29udHJvbC5wYXJlbnQuZ2V0KCdwYXNzd29yZENvbmZpcm0nKTtcblxuICBpZiAoIXBhc3N3b3JkIHx8ICFwYXNzd29yZENvbmZpcm0pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChwYXNzd29yZENvbmZpcm0udmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAocGFzc3dvcmQudmFsdWUgPT09IHBhc3N3b3JkQ29uZmlybS52YWx1ZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtwYXNzd29yZHNOb3RNYXRjaGluZzogdHJ1ZX07XG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtYXV0aC1maXJlYmFzZXVpLXJlZ2lzdGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1hdXRoLWZpcmViYXNldWktcmVnaXN0ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtYXV0aC1maXJlYmFzZXVpLXJlZ2lzdGVyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IE5neEF1dGhGaXJlYmFzZXVpQW5pbWF0aW9uc1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hBdXRoRmlyZWJhc2V1aVJlZ2lzdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpIGxvZ29Vcmw6IHN0cmluZztcbiAgQElucHV0KCkgYXBwZWFyYW5jZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcbiAgQElucHV0KCkgdG9zVXJsOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHByaXZhY3lQb2xpY3lVcmw6IHN0cmluZztcblxuICAvLyBpMThuIGNvbW1vblxuICBASW5wdXQoKSB0aXRsZVRleHQgPSAnQ1JFQVRFIEFOIEFDQ09VTlQnO1xuICBASW5wdXQoKSB0ZXJtc0FuZENvbmRpdGlvbnNUZXh0ID0gJ0kgcmVhZCBhbmQgYWNjZXB0IHRoZSc7XG4gIEBJbnB1dCgpIHRlcm1zQW5kQ29uZGl0aW9uc0xpbmtUZXh0ID0gJ3Rlcm1zIGFuZCBjb25kaXRpb25zJztcbiAgQElucHV0KCkgcHJpdmFjeVBvbGljeVRleHQgPSAnSSByZWFkIGFuZCBhY2NlcHQgdGhlJztcbiAgQElucHV0KCkgcHJpdmFjeVBvbGljeUxpbmtUZXh0ID0gJ3ByaXZhY3kgcG9saWN5JztcbiAgQElucHV0KCkgY3JlYXRlQWNjb3VudEJ1dHRvblRleHQgPSAnQ1JFQVRFIEFOIEFDQ09VTlQnO1xuICBASW5wdXQoKSBhbHJlYWR5SGF2ZUFjY291bnRUZXh0ID0gJ0FscmVhZHkgaGF2ZSBhbiBhY2NvdW50Pyc7XG4gIEBJbnB1dCgpIGxvZ2luQnV0dG9uVGV4dCA9ICdMT0dJTic7XG5cbiAgLy8gaTE4biBuYW1lXG4gIEBJbnB1dCgpIG5hbWVUZXh0ID0gJ05hbWUnO1xuICBASW5wdXQoKSBuYW1lRXJyb3JSZXF1aXJlZFRleHQgPSAnTmFtZSBpcyByZXF1aXJlZCc7XG5cbiAgLy8gaTE4biBlbWFpbFxuICBASW5wdXQoKSBlbWFpbFRleHQgPSAnRW1haWwnO1xuICBASW5wdXQoKSBlbWFpbEVycm9yUmVxdWlyZWRUZXh0ID0gJ0VtYWlsIGlzIHJlcXVpcmVkJztcbiAgQElucHV0KCkgZW1haWxFcnJvclBhdHRlcm5UZXh0ID0gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MnO1xuXG4gIC8vIGkxOG4gcGFzc3dvcmRcbiAgQElucHV0KCkgcGFzc3dvcmRUZXh0ID0gJ1Bhc3N3b3JkJztcbiAgQElucHV0KCkgcGFzc3dvcmRFcnJvclJlcXVpcmVkVGV4dCA9ICdQYXNzd29yZCBpcyByZXF1aXJlZCc7XG4gIEBJbnB1dCgpIHBhc3N3b3JkQ29uZmlybWF0aW9uVGV4dCA9ICdQYXNzd29yZCBDb25maXJtYXRpb24nO1xuICBASW5wdXQoKSBwYXNzd29yZENvbmZpcm1hdGlvbkVycm9yUmVxdWlyZWRUZXh0ID0gJ1Bhc3N3b3JkIGNvbmZpcm1hdGlvbiBpcyByZXF1aXJlZCc7XG4gIEBJbnB1dCgpIHBhc3N3b3JkRXJyb3JNYXRjaFRleHQgPSAnUGFzc3dvcmQgbXVzdCBtYXRjaCc7IFxuICBASW5wdXQoKSBwYXNzd29yZEVycm9yTWluTGVuZ3RoVGV4dCA9IFwiVGhlIHBhc3N3b3JkIGlzIHRvbyBzaG9ydCFcIjtcbiAgQElucHV0KCkgcGFzc3dvcmRFcnJvck1heExlbmd0aFRleHQgPSBcIlRoZSBwYXNzd29yZCBpcyB0b28gbG9uZyFcIjtcblxuICAvLyBFdmVudHNcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIG9uU3VjY2VzczogYW55O1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCkgb25FcnJvcjogYW55O1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCkgb25Mb2dpblJlcXVlc3RlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBPdXRwdXQoKSBvbkNyZWF0ZUFjY291bnRCdXR0b25DbGlja2VkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcmVnaXN0ZXJGb3JtOiBGb3JtR3JvdXA7XG4gIG9uRXJyb3JTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgYXV0aGVudGljYXRpb25FcnJvciA9IGZhbHNlO1xuXG4gIC8vIFByaXZhdGVcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUFsbDogU3ViamVjdDxhbnk+O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4tdHlwZXNcbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5neEF1dGhGaXJlYmFzZVVJQ29uZmlnVG9rZW4pKVxuICAgIHB1YmxpYyBjb25maWc6IE5neEF1dGhGaXJlYmFzZVVJQ29uZmlnLFxuICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgIHB1YmxpYyBhdXRoUHJvY2VzczogQXV0aFByb2Nlc3NTZXJ2aWNlXG4gICkge1xuICAgIC8vIENvbmZpZ3VyZSB0aGUgbGF5b3V0XG5cbiAgICAvLyBTZXQgdGhlIHByaXZhdGUgZGVmYXVsdHNcbiAgICB0aGlzLnVuc3Vic2NyaWJlQWxsID0gbmV3IFN1YmplY3QoKTtcbiAgICB0aGlzLm9uU3VjY2VzcyA9IGF1dGhQcm9jZXNzLm9uU3VjY2Vzc0VtaXR0ZXI7XG4gICAgdGhpcy5vbkVycm9yID0gYXV0aFByb2Nlc3Mub25FcnJvckVtaXR0ZXI7XG4gIH1cblxuICBnZXQgY29sb3IoKTogc3RyaW5nIHwgVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGlvbkVycm9yID8gJ3dhcm4nIDogJ3ByaW1hcnknO1xuICB9XG5cbiAgZ2V0IGNvbG9yQWNjZW50KCk6IHN0cmluZyB8IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRpb25FcnJvciA/ICd3YXJuJyA6ICdhY2NlbnQnO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMub25FcnJvclN1YnNjcmlwdGlvbiA9IHRoaXMub25FcnJvci5zdWJzY3JpYmUoKCkgPT4gdGhpcy5hdXRoZW50aWNhdGlvbkVycm9yID0gdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMucmVnaXN0ZXJGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICBuYW1lOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgZW1haWw6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMuZW1haWxdXSxcbiAgICAgIHBhc3N3b3JkOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgICAgICAgVmFsaWRhdG9ycy5taW5MZW5ndGgodGhpcy5jb25maWcucGFzc3dvcmRNaW5MZW5ndGgpLCBcbiAgICAgICAgICAgICAgICAgICAgIFZhbGlkYXRvcnMubWF4TGVuZ3RoKHRoaXMuY29uZmlnLnBhc3N3b3JkTWF4TGVuZ3RoKV1dLFxuICAgICAgcGFzc3dvcmRDb25maXJtOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBjb25maXJtUGFzc3dvcmRWYWxpZGF0b3JdXSxcbiAgICAgIHRvczogWycnXSxcbiAgICAgIHByaXZhY3lQb2xpY3k6IFsnJ11cbiAgICB9KTtcblxuICAgIC8vIElmIHRvcyBvciBwcml2YWN5IHBvbGljeSB1cmwgc2V0LCBlbnN1cmUgdGhhdCB0aGUgdHdvIGZvcm0gaXRlbXMgYXJlIHJlcXVpcmVkXG4gICAgaWYgKHRoaXMudG9zVXJsKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyRm9ybS5jb250cm9scy50b3Muc2V0VmFsaWRhdG9ycyhWYWxpZGF0b3JzLnJlcXVpcmVkVHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJpdmFjeVBvbGljeVVybCkge1xuICAgICAgdGhpcy5yZWdpc3RlckZvcm0uY29udHJvbHMucHJpdmFjeVBvbGljeS5zZXRWYWxpZGF0b3JzKFZhbGlkYXRvcnMucmVxdWlyZWRUcnVlKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIHZhbGlkaXR5IG9mIHRoZSAncGFzc3dvcmRDb25maXJtJyBmaWVsZFxuICAgIC8vIHdoZW4gdGhlICdwYXNzd29yZCcgZmllbGQgY2hhbmdlc1xuICAgIHRoaXMucmVnaXN0ZXJGb3JtXG4gICAgICAuY29udHJvbHNcbiAgICAgIC5wYXNzd29yZFxuICAgICAgLnZhbHVlQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLnVuc3Vic2NyaWJlQWxsKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybS5jb250cm9scy5wYXNzd29yZENvbmZpcm0udXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogT24gZGVzdHJveVxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgLy8gVW5zdWJzY3JpYmUgZnJvbSBhbGwgc3Vic2NyaXB0aW9uc1xuICAgIHRoaXMudW5zdWJzY3JpYmVBbGwubmV4dCgpO1xuICAgIHRoaXMudW5zdWJzY3JpYmVBbGwuY29tcGxldGUoKTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUFjY291bnQoKSB7XG4gICAgLy8gRW1pdCB0aGUgY3JlYXRlIGFjY291bnQgY2xpY2tlZCBldmVudC5cbiAgICB0aGlzLm9uQ3JlYXRlQWNjb3VudEJ1dHRvbkNsaWNrZWQuZW1pdCgpO1xuXG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5hdXRoUHJvY2Vzcy5zaWduVXAoXG4gICAgICB0aGlzLnJlZ2lzdGVyRm9ybS5jb250cm9scy5uYW1lLnZhbHVlLFxuICAgICAge1xuICAgICAgICBlbWFpbDogdGhpcy5yZWdpc3RlckZvcm0uY29udHJvbHMuZW1haWwudmFsdWUsXG4gICAgICAgIHBhc3N3b3JkOiB0aGlzLnJlZ2lzdGVyRm9ybS5jb250cm9scy5wYXNzd29yZC52YWx1ZVxuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==
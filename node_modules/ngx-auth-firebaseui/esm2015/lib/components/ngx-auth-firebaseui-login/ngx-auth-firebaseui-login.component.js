import { __awaiter } from "tslib";
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProcessService, AuthProvider } from '../../services/auth-process.service';
import { NgxAuthFirebaseuiAnimations } from '../../animations';
import { isPlatformBrowser } from '@angular/common';
export class NgxAuthFirebaseuiLoginComponent {
    constructor(
    // tslint:disable-next-line:ban-types
    platformId, authProcess, formBuilder) {
        this.platformId = platformId;
        this.authProcess = authProcess;
        this.formBuilder = formBuilder;
        this.providers = AuthProvider.ALL; //  google, facebook, twitter, github as array or all as one single string
        this.registrationEnabled = true;
        this.resetPasswordEnabled = true;
        // i18n
        this.titleText = 'LOGIN TO YOUR ACCOUNT';
        this.rememberMeText = 'Remember Me';
        this.loginButtonText = 'LOGIN';
        this.orLabelText = 'OR';
        this.forgotPasswordText = 'Forgot Password?';
        this.dontHaveAnAccountText = 'Don\'t have an account?';
        this.createAccountButtonText = 'Create an account';
        // i18n email
        this.emailText = 'Email';
        this.emailErrorRequiredText = 'Email is required';
        this.emailErrorPatternText = 'Please enter a valid email address';
        // i18n password
        this.passwordText = 'Password';
        this.passwordErrorRequiredText = 'Password is required';
        // tslint:disable-next-line:no-output-on-prefix
        this.onCreateAccountRequested = new EventEmitter();
        // tslint:disable-next-line:no-output-on-prefix
        this.onResetPasswordRequested = new EventEmitter();
        this.onLoginButtonClicked = new EventEmitter();
        this.authProviders = AuthProvider;
        this.authenticationError = false;
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
        this.updateAuthSnackbarMessages();
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    updateAuthSnackbarMessages() {
        this.authProcess.messageOnAuthSuccess = this.messageOnAuthSuccess;
        this.authProcess.messageOnAuthError = this.messageOnAuthError;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            // Emit event for button click
            this.onLoginButtonClicked.emit();
            return yield this.authProcess.signInWith(this.authProviders.EmailAndPassword, {
                email: this.loginForm.controls.email.value,
                password: this.loginForm.controls.password.value
            });
        });
    }
}
NgxAuthFirebaseuiLoginComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-auth-firebaseui-login',
                template: "<div fxLayout=\"column\" id=\"login\">\n\n  <div fxLayout=\"column\" fxLayoutAlign=\"center center\" id=\"login-form-wrapper\">\n\n    <div [@animateStagger]=\"{ value: '50' }\" id=\"login-form\">\n\n      <div *ngIf=\"logoUrl\" class=\"logo\">\n        <img [@animate]=\"{ value: '*', params: { x: '50px' } }\" [src]=\"logoUrl\" alt=\"logo\">\n      </div>\n\n      <div [@animate]=\"{ value: '*', params: { x: '-50px' } }\" class=\"title\">{{titleText}}</div>\n\n      <form [@animate]=\"{value:'*',params:{duration:'300ms',y:'100px'}}\" [formGroup]=\"loginForm\" name=\"loginForm\"\n            novalidate>\n\n        <mat-form-field [@animate]=\"{ value: '*', params: { x: '50px' } }\" [appearance]=\"appearance\">\n          <input [placeholder]=\"emailText\" formControlName=\"email\" matInput autocomplete=\"username\">\n          <mat-icon [color]=\"color\" matSuffix>email</mat-icon>\n          <mat-error *ngIf=\"loginForm.get('email')?.hasError('required')\">\n            {{emailErrorRequiredText}}\n          </mat-error>\n          <mat-error\n            *ngIf=\"!loginForm.get('email')?.hasError('required') &&\n                                loginForm.get('email')?.hasError('email')\">\n            {{emailErrorPatternText}}\n          </mat-error>\n        </mat-form-field>\n\n        <mat-form-field [@animate]=\"{ value: '*', params: { x: '50px' } }\" [appearance]=\"appearance\">\n          <input [placeholder]=\"passwordText\" formControlName=\"password\" matInput type=\"password\" autocomplete=\"current-password\">\n          <mat-icon [color]=\"color\" matSuffix>lock</mat-icon>\n          <mat-error>\n            {{passwordErrorRequiredText}}\n          </mat-error>\n        </mat-form-field>\n\n        <div [@animate]=\"{ value: '*', params: { x: '50px' } }\"\n             class=\"remember-forgot-password\" fxLayout=\"row\"\n             fxLayout.xs=\"column\"\n             fxLayoutAlign=\"space-between center\">\n          <!--          <mat-checkbox class=\"remember-me\" aria-label=\"Remember Me\">-->\n          <!--            {{rememberMeText}}-->\n          <!--          </mat-checkbox>-->\n\n          <button (click)=\"onResetPasswordRequested.emit()\"\n                  *ngIf=\"resetPasswordEnabled\"\n                  [@animate]=\"{ value: '*', params: { x: '-50px' } }\"\n                  [color]=\"color\"\n                  class=\"forgot-password\"\n                  mat-button\n                  type=\"button\">\n            {{forgotPasswordText}}\n          </button>\n        </div>\n\n        <button (click)=\"login()\"\n                [color]=\"colorAccent\"\n                [disabled]=\"loginForm.invalid\"\n                aria-label=\"LOG IN\"\n                class=\"submit-button\"\n                id=\"loginButton\"\n                mat-raised-button>\n          {{loginButtonText}}\n        </button>\n\n      </form>\n\n      <div *ngIf=\"providers.length > 0\"\n           [@animate]=\"{ value: '*', params: { z: '50px', delay: '50ms', scale: '0.2' } }\"\n           class=\"separator\">\n        <span class=\"text\">{{orLabelText}}</span>\n      </div>\n\n      <ngx-auth-firebaseui-providers [providers]=\"providers\"\n                                     fxLayoutAlign=\"center center\"\n                                     layout=\"column\"\n                                     theme=\"raised\"></ngx-auth-firebaseui-providers>\n\n      <div *ngIf=\"registrationEnabled\"\n           [@animateStagger]=\"{ value: '100' }\"\n           class=\"register\"\n           fxLayout=\"column\" fxLayoutAlign=\"center center\">\n        <span [@animate]=\"{ value: '*', params: { x: '100px' } }\" class=\"text\">\n          {{dontHaveAnAccountText}}\n        </span>\n        <button (click)=\"onCreateAccountRequested.emit()\"\n                [@animate]=\"{ value: '*', params: { x: '-100px' } }\"\n                [color]=\"color\"\n                id=\"createAccountButton\"\n                mat-button\n                type=\"button\">{{createAccountButtonText}}</button>\n      </div>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                animations: NgxAuthFirebaseuiAnimations,
                styles: ["ngx-auth-firebaseui-login #login-form-wrapper{flex:1 0 auto;padding:32px}@media screen and (max-width:599px){ngx-auth-firebaseui-login #login-form-wrapper{padding:16px}}ngx-auth-firebaseui-login #login-form-wrapper #login-form{max-width:384px;padding:32px;text-align:center;width:384px}@media screen and (max-width:599px){ngx-auth-firebaseui-login #login-form-wrapper #login-form{padding:24px;width:100%}}ngx-auth-firebaseui-login #login-form-wrapper #login-form .logo{height:150px;margin:32px auto;width:150px}ngx-auth-firebaseui-login #login-form-wrapper #login-form .title{font-size:20px;margin:16px 0 32px}ngx-auth-firebaseui-login #login-form-wrapper #login-form form{text-align:left;width:100%}ngx-auth-firebaseui-login #login-form-wrapper #login-form form mat-form-field{width:100%}ngx-auth-firebaseui-login #login-form-wrapper #login-form form mat-checkbox{margin:0}ngx-auth-firebaseui-login #login-form-wrapper #login-form form .remember-forgot-password{font-size:13px;margin-top:8px}ngx-auth-firebaseui-login #login-form-wrapper #login-form form .remember-forgot-password .remember-me{margin-bottom:16px}ngx-auth-firebaseui-login #login-form-wrapper #login-form form .remember-forgot-password .forgot-password{font-size:13px;font-weight:500;margin-bottom:16px}ngx-auth-firebaseui-login #login-form-wrapper #login-form form .submit-button{display:block;margin:16px auto;width:220px}@media screen and (max-width:599px){ngx-auth-firebaseui-login #login-form-wrapper #login-form form .submit-button{width:90%}}ngx-auth-firebaseui-login #login-form-wrapper #login-form .register{font-weight:500;margin:32px auto 24px}ngx-auth-firebaseui-login #login-form-wrapper #login-form .register .text{margin-right:8px}ngx-auth-firebaseui-login #login-form-wrapper #login-form .separator{font-size:15px;font-weight:600;margin:24px auto;overflow:hidden;position:relative;width:100px}ngx-auth-firebaseui-login #login-form-wrapper #login-form .separator .text{display:inline-flex;padding:0 8px;position:relative;z-index:9999}ngx-auth-firebaseui-login #login-form-wrapper #login-form .separator .text:after,ngx-auth-firebaseui-login #login-form-wrapper #login-form .separator .text:before{border-top:1px solid;content:\"\";display:block;position:absolute;top:10px;width:30px}ngx-auth-firebaseui-login #login-form-wrapper #login-form .separator .text:before{right:100%}ngx-auth-firebaseui-login #login-form-wrapper #login-form .separator .text:after{left:100%}ngx-auth-firebaseui-login #login-form-wrapper #login-form button.apple-raised,ngx-auth-firebaseui-login #login-form-wrapper #login-form button.facebook-raised,ngx-auth-firebaseui-login #login-form-wrapper #login-form button.github-raised,ngx-auth-firebaseui-login #login-form-wrapper #login-form button.google-raised,ngx-auth-firebaseui-login #login-form-wrapper #login-form button.microsoft-raised,ngx-auth-firebaseui-login #login-form-wrapper #login-form button.twitter-raised,ngx-auth-firebaseui-login #login-form-wrapper #login-form button.yahoo-raised{color:#fff;font-size:13px;margin-bottom:8px;text-transform:none;width:192px}@media screen and (max-width:599px){ngx-auth-firebaseui-login #login-form-wrapper #login-form button{width:80%}}"]
            },] }
];
NgxAuthFirebaseuiLoginComponent.ctorParameters = () => [
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: AuthProcessService },
    { type: FormBuilder }
];
NgxAuthFirebaseuiLoginComponent.propDecorators = {
    logoUrl: [{ type: Input }],
    providers: [{ type: Input }],
    appearance: [{ type: Input }],
    registrationEnabled: [{ type: Input }],
    resetPasswordEnabled: [{ type: Input }],
    messageOnAuthSuccess: [{ type: Input }],
    messageOnAuthError: [{ type: Input }],
    titleText: [{ type: Input }],
    rememberMeText: [{ type: Input }],
    loginButtonText: [{ type: Input }],
    orLabelText: [{ type: Input }],
    forgotPasswordText: [{ type: Input }],
    dontHaveAnAccountText: [{ type: Input }],
    createAccountButtonText: [{ type: Input }],
    emailText: [{ type: Input }],
    emailErrorRequiredText: [{ type: Input }],
    emailErrorPatternText: [{ type: Input }],
    passwordText: [{ type: Input }],
    passwordErrorRequiredText: [{ type: Input }],
    onSuccess: [{ type: Output }],
    onError: [{ type: Output }],
    onCreateAccountRequested: [{ type: Output }],
    onResetPasswordRequested: [{ type: Output }],
    onLoginButtonClicked: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dGgtZmlyZWJhc2V1aS1sb2dpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtYXV0aC1maXJlYmFzZXVpL3NyYy9saWIvY29tcG9uZW50cy9uZ3gtYXV0aC1maXJlYmFzZXVpLWxvZ2luL25neC1hdXRoLWZpcmViYXNldWktbG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckgsT0FBTyxFQUFDLFdBQVcsRUFBYSxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFFckYsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDN0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFXbEQsTUFBTSxPQUFPLCtCQUErQjtJQTZDMUM7SUFDRSxxQ0FBcUM7SUFDUixVQUFrQixFQUN4QyxXQUErQixFQUM5QixXQUF3QjtRQUZILGVBQVUsR0FBVixVQUFVLENBQVE7UUFDeEMsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBQzlCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBOUN6QixjQUFTLEdBQXNCLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQywwRUFBMEU7UUFFM0gsd0JBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQzNCLHlCQUFvQixHQUFHLElBQUksQ0FBQztRQUlyQyxPQUFPO1FBQ0UsY0FBUyxHQUFHLHVCQUF1QixDQUFDO1FBQ3BDLG1CQUFjLEdBQUcsYUFBYSxDQUFDO1FBQy9CLG9CQUFlLEdBQUcsT0FBTyxDQUFD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WUE3RGYsa0JBQWtCO1lBRGxCLFdBQVc7OztzQkFpQmhCLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLO2tDQUNMLEtBQUs7bUNBQ0wsS0FBSzttQ0FDTCxLQUFLO2lDQUNMLEtBQUs7d0JBR0wsS0FBSzs2QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSztpQ0FDTCxLQUFLO29DQUNMLEtBQUs7c0NBQ0wsS0FBSzt3QkFHTCxLQUFLO3FDQUNMLEtBQUs7b0NBQ0wsS0FBSzsyQkFHTCxLQUFLO3dDQUNMLEtBQUs7d0JBSUwsTUFBTTtzQkFFTixNQUFNO3VDQUVOLE1BQU07dUNBRU4sTUFBTTttQ0FFTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFBMQVRGT1JNX0lELCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7QXV0aFByb2Nlc3NTZXJ2aWNlLCBBdXRoUHJvdmlkZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2F1dGgtcHJvY2Vzcy5zZXJ2aWNlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7Tmd4QXV0aEZpcmViYXNldWlBbmltYXRpb25zfSBmcm9tICcuLi8uLi9hbmltYXRpb25zJztcbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge01hdEZvcm1GaWVsZEFwcGVhcmFuY2V9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtYXV0aC1maXJlYmFzZXVpLWxvZ2luJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1hdXRoLWZpcmViYXNldWktbG9naW4uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtYXV0aC1maXJlYmFzZXVpLWxvZ2luLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IE5neEF1dGhGaXJlYmFzZXVpQW5pbWF0aW9uc1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hBdXRoRmlyZWJhc2V1aUxvZ2luQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoKSBsb2dvVXJsOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHByb3ZpZGVyczogc3RyaW5nW10gfCBzdHJpbmcgPSBBdXRoUHJvdmlkZXIuQUxMOyAvLyAgZ29vZ2xlLCBmYWNlYm9vaywgdHdpdHRlciwgZ2l0aHViIGFzIGFycmF5IG9yIGFsbCBhcyBvbmUgc2luZ2xlIHN0cmluZ1xuICBASW5wdXQoKSBhcHBlYXJhbmNlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuICBASW5wdXQoKSByZWdpc3RyYXRpb25FbmFibGVkID0gdHJ1ZTtcbiAgQElucHV0KCkgcmVzZXRQYXNzd29yZEVuYWJsZWQgPSB0cnVlO1xuICBASW5wdXQoKSBtZXNzYWdlT25BdXRoU3VjY2Vzczogc3RyaW5nO1xuICBASW5wdXQoKSBtZXNzYWdlT25BdXRoRXJyb3I6IHN0cmluZztcblxuICAvLyBpMThuXG4gIEBJbnB1dCgpIHRpdGxlVGV4dCA9ICdMT0dJTiBUTyBZT1VSIEFDQ09VTlQnO1xuICBASW5wdXQoKSByZW1lbWJlck1lVGV4dCA9ICdSZW1lbWJlciBNZSc7XG4gIEBJbnB1dCgpIGxvZ2luQnV0dG9uVGV4dCA9ICdMT0dJTic7XG4gIEBJbnB1dCgpIG9yTGFiZWxUZXh0ID0gJ09SJztcbiAgQElucHV0KCkgZm9yZ290UGFzc3dvcmRUZXh0ID0gJ0ZvcmdvdCBQYXNzd29yZD8nO1xuICBASW5wdXQoKSBkb250SGF2ZUFuQWNjb3VudFRleHQgPSAnRG9uXFwndCBoYXZlIGFuIGFjY291bnQ/JztcbiAgQElucHV0KCkgY3JlYXRlQWNjb3VudEJ1dHRvblRleHQgPSAnQ3JlYXRlIGFuIGFjY291bnQnO1xuXG4gIC8vIGkxOG4gZW1haWxcbiAgQElucHV0KCkgZW1haWxUZXh0ID0gJ0VtYWlsJztcbiAgQElucHV0KCkgZW1haWxFcnJvclJlcXVpcmVkVGV4dCA9ICdFbWFpbCBpcyByZXF1aXJlZCc7XG4gIEBJbnB1dCgpIGVtYWlsRXJyb3JQYXR0ZXJuVGV4dCA9ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzJztcblxuICAvLyBpMThuIHBhc3N3b3JkXG4gIEBJbnB1dCgpIHBhc3N3b3JkVGV4dCA9ICdQYXNzd29yZCc7XG4gIEBJbnB1dCgpIHBhc3N3b3JkRXJyb3JSZXF1aXJlZFRleHQgPSAnUGFzc3dvcmQgaXMgcmVxdWlyZWQnO1xuXG4gIC8vIEV2ZW50c1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCkgb25TdWNjZXNzOiBhbnk7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSBvbkVycm9yOiBhbnk7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSBvbkNyZWF0ZUFjY291bnRSZXF1ZXN0ZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIG9uUmVzZXRQYXNzd29yZFJlcXVlc3RlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBPdXRwdXQoKSBvbkxvZ2luQnV0dG9uQ2xpY2tlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGxvZ2luRm9ybTogRm9ybUdyb3VwO1xuICBhdXRoUHJvdmlkZXJzID0gQXV0aFByb3ZpZGVyO1xuICBvbkVycm9yU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIGF1dGhlbnRpY2F0aW9uRXJyb3IgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6YmFuLXR5cGVzXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgcHVibGljIGF1dGhQcm9jZXNzOiBBdXRoUHJvY2Vzc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIpIHtcbiAgICB0aGlzLm9uU3VjY2VzcyA9IGF1dGhQcm9jZXNzLm9uU3VjY2Vzc0VtaXR0ZXI7XG4gICAgdGhpcy5vbkVycm9yID0gYXV0aFByb2Nlc3Mub25FcnJvckVtaXR0ZXI7XG4gIH1cblxuICBnZXQgY29sb3IoKTogc3RyaW5nIHwgVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGlvbkVycm9yID8gJ3dhcm4nIDogJ3ByaW1hcnknO1xuICB9XG5cbiAgZ2V0IGNvbG9yQWNjZW50KCk6IHN0cmluZyB8IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRpb25FcnJvciA/ICd3YXJuJyA6ICdhY2NlbnQnO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgdGhpcy5vbkVycm9yU3Vic2NyaXB0aW9uID0gdGhpcy5vbkVycm9yLnN1YnNjcmliZSgoKSA9PiB0aGlzLmF1dGhlbnRpY2F0aW9uRXJyb3IgPSB0cnVlKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUF1dGhTbmFja2Jhck1lc3NhZ2VzKCk7XG5cbiAgICB0aGlzLmxvZ2luRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgZW1haWw6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMuZW1haWxdXSxcbiAgICAgIHBhc3N3b3JkOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlQXV0aFNuYWNrYmFyTWVzc2FnZXMoKTogdm9pZCB7XG4gICAgdGhpcy5hdXRoUHJvY2Vzcy5tZXNzYWdlT25BdXRoU3VjY2VzcyA9IHRoaXMubWVzc2FnZU9uQXV0aFN1Y2Nlc3M7XG4gICAgdGhpcy5hdXRoUHJvY2Vzcy5tZXNzYWdlT25BdXRoRXJyb3IgPSB0aGlzLm1lc3NhZ2VPbkF1dGhFcnJvcjtcbiAgfVxuXG4gIGFzeW5jIGxvZ2luKCkge1xuICAgIC8vIEVtaXQgZXZlbnQgZm9yIGJ1dHRvbiBjbGlja1xuICAgIHRoaXMub25Mb2dpbkJ1dHRvbkNsaWNrZWQuZW1pdCgpO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuYXV0aFByb2Nlc3Muc2lnbkluV2l0aCh0aGlzLmF1dGhQcm92aWRlcnMuRW1haWxBbmRQYXNzd29yZCxcbiAgICAgIHtcbiAgICAgICAgZW1haWw6IHRoaXMubG9naW5Gb3JtLmNvbnRyb2xzLmVtYWlsLnZhbHVlLFxuICAgICAgICBwYXNzd29yZDogdGhpcy5sb2dpbkZvcm0uY29udHJvbHMucGFzc3dvcmQudmFsdWVcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXX0=
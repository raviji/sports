import { __awaiter } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '../../services/auth-process.service';
const defaultTranslations = {
    verifyEmailTitleText: 'Confirm your e-mail address!',
    verifyEmailConfirmationText: 'A confirmation e-mail has been sent.' +
        ' Check your inbox and click on the link "Confirm my e-mail" to confirm your e-mail address.',
    verifyEmailGoBackText: 'Go back',
    sendNewVerificationEmailText: 'Send new confirmation e-mail',
    signOutText: 'Sign out',
    messageOnEmailConfirmationSuccess: 'A new confirmation e-mail has been sent. Please check your inbox.',
};
export class EmailConfirmationComponent {
    constructor(authProcess, router, changeDetectorRef) {
        this.authProcess = authProcess;
        this.router = router;
        this.changeDetectorRef = changeDetectorRef;
        this.signOut = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes.verifyEmailTemplate && changes.verifyEmailTemplate.currentValue == null) {
            this.verifyEmailTemplate = this.defaultTemplate;
            console.log('ngOnChanges - defaultTemplate:', this.verifyEmailTemplate);
        }
        this.verifyEmailContext = this.createTemplateContext();
    }
    ngOnInit() {
        if (!this.verifyEmailTemplate) {
            console.log('ngOnInit - defaultTemplate');
            this.verifyEmailTemplate = this.defaultTemplate;
        }
        this.verifyEmailContext = this.createTemplateContext();
        console.log('verifyEmailTemplate:', this.verifyEmailTemplate);
        console.log('verifyEmailContext:', this.verifyEmailContext);
    }
    continue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authProcess.reloadUserInfo();
                yield this.router.navigate([this.goBackURL]);
            }
            catch (error) {
                this.authProcess.notifyError(error);
            }
        });
    }
    sendNewVerificationEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.isLoading = true;
                this.changeDetectorRef.markForCheck();
                yield this.authProcess.sendNewVerificationEmail();
                this.authProcess.showToast(this.verifyEmailContext.messageOnEmailConfirmationSuccess);
            }
            catch (error) {
                this.authProcess.notifyError(error);
            }
            finally {
                this.isLoading = false;
                this.changeDetectorRef.markForCheck();
            }
        });
    }
    createTemplateContext() {
        return {
            email: this.email,
            goBackURL: this.goBackURL,
            verifyEmailTitleText: this.verifyEmailTitleText || defaultTranslations.verifyEmailTitleText,
            verifyEmailConfirmationText: this.verifyEmailConfirmationText || defaultTranslations.verifyEmailConfirmationText,
            verifyEmailGoBackText: this.verifyEmailGoBackText || defaultTranslations.verifyEmailGoBackText,
            sendNewVerificationEmailText: this.sendNewVerificationEmailText || defaultTranslations.sendNewVerificationEmailText,
            signOutText: this.signOutText || defaultTranslations.signOutText,
            messageOnEmailConfirmationSuccess: this.messageOnEmailConfirmationSuccess || defaultTranslations.messageOnEmailConfirmationSuccess
        };
    }
}
EmailConfirmationComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-auth-firebaseui-email-confirmation',
                template: "<ng-container *ngTemplateOutlet=\"verifyEmailTemplate; context: verifyEmailContext\"></ng-container>\n<ng-template #defaultVerifyEmail let-email=\"email\" let-goBackURL=\"goBackURL\"\n             let-sendNewVerificationEmailText=\"sendNewVerificationEmailText\"\n             let-signOutText=\"signOutText\"\n             let-verifyEmailConfirmationText=\"verifyEmailConfirmationText\" let-verifyEmailGoBackText=\"verifyEmailGoBackText\"\n             let-verifyEmailTitleText=\"verifyEmailTitleText\">\n  <mat-card class=\"verify-email\">\n    <mat-card-content fxLayout=\"column\" fxLayoutAlign=\"center center\">\n      <mat-icon>email</mat-icon>\n      <p class=\"title\" fxLayout=\"column\" fxLayoutAlign=\"center center\">\n        <span class=\"mat-subheading-2\">{{ verifyEmailTitleText }}</span>\n        <span class=\"mat-body-2\">{{ email }}</span>\n      </p>\n      <p class=\"subtitle\">{{ verifyEmailConfirmationText }}</p>\n      <mat-progress-bar *ngIf=\"isLoading\" mode=\"indeterminate\"></mat-progress-bar>\n    </mat-card-content>\n    <mat-card-actions fxLayout=\"column\" fxLayoutAlign=\"center center\">\n      <button (click)=\"continue()\" *ngIf=\"goBackURL\" class=\"go-back-button action-button\" mat-stroked-button>\n        {{ verifyEmailGoBackText }}\n      </button>\n      <button (click)=\"sendNewVerificationEmail()\" class=\"send-new-mail-button action-button\"\n              mat-stroked-button>{{ sendNewVerificationEmailText }}</button>\n      <button (click)=\"this.signOut.emit()\" class=\"sign-out-button action-button\" color=\"warn\"\n              mat-stroked-button>{{ signOutText }}</button>\n    </mat-card-actions>\n  </mat-card>\n</ng-template>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".material-icons{font-size:4rem}.verify-email{width:360px}.verify-email .mat-icon{color:#444;height:4rem;width:4rem}.verify-email .title{margin-top:16px}.verify-email .title .mat-subheading-2{margin-bottom:0}.verify-email .subtitle{margin:16px auto;text-align:justify}.verify-email p{-webkit-margin-after:1em;-webkit-margin-before:1em;-webkit-margin-end:0;-webkit-margin-start:0;display:block}.verify-email mat-card-actions{margin-top:1rem;text-align:center}.verify-email mat-card-actions .action-button{width:100%}.verify-email mat-card-actions .action-button+.action-button{margin-top:1rem}"]
            },] }
];
EmailConfirmationComponent.ctorParameters = () => [
    { type: AuthProcessService },
    { type: Router },
    { type: ChangeDetectorRef }
];
EmailConfirmationComponent.propDecorators = {
    email: [{ type: Input }],
    goBackURL: [{ type: Input }],
    verifyEmailTitleText: [{ type: Input }],
    verifyEmailConfirmationText: [{ type: Input }],
    verifyEmailGoBackText: [{ type: Input }],
    sendNewVerificationEmailText: [{ type: Input }],
    signOutText: [{ type: Input }],
    messageOnEmailConfirmationSuccess: [{ type: Input }],
    template: [{ type: Input }],
    signOut: [{ type: Output }],
    defaultTemplate: [{ type: ViewChild, args: ['defaultVerifyEmail', { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwtY29uZmlybWF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1hdXRoLWZpcmViYXNldWkvc3JjL2xpYi9jb21wb25lbnRzL2VtYWlsLWNvbmZpcm1hdGlvbi9lbWFpbC1jb25maXJtYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBR04sU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQVl2RSxNQUFNLG1CQUFtQixHQUFHO0lBQzFCLG9CQUFvQixFQUFFLDhCQUE4QjtJQUNwRCwyQkFBMkIsRUFBRSxzQ0FBc0M7UUFDakUsNkZBQTZGO0lBQy9GLHFCQUFxQixFQUFFLFNBQVM7SUFDaEMsNEJBQTRCLEVBQUUsOEJBQThCO0lBQzVELFdBQVcsRUFBRSxVQUFVO0lBQ3ZCLGlDQUFpQyxFQUFFLG1FQUFtRTtDQUN2RyxDQUFDO0FBUUYsTUFBTSxPQUFPLDBCQUEwQjtJQTBCckMsWUFBbUIsV0FBK0IsRUFBVSxNQUFjLEVBQVUsaUJBQW9DO1FBQXJHLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBWDlHLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBWXZDLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsbUJBQW1CLElBQUksT0FBTyxDQUFDLG1CQUFtQixDQUFDLFlBQVksSUFBSSxJQUFJLEVBQUU7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QUVMLEtBQUs7MENBQ0wsS0FBSztvQ0FDTCxLQUFLOzJDQUNMLEtBQUs7MEJBQ0wsS0FBSztnREFDTCxLQUFLO3VCQUdMLEtBQUs7c0JBRUwsTUFBTTs4QkFTTixTQUFTLFNBQUMsb0JBQW9CLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7QXV0aFByb2Nlc3NTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hdXRoLXByb2Nlc3Muc2VydmljZSc7XG5cbmludGVyZmFjZSBWZXJpZnlFbWFpbENvbnRleHQge1xuICBlbWFpbDogc3RyaW5nO1xuICBnb0JhY2tVUkw6IHN0cmluZztcbiAgdmVyaWZ5RW1haWxUaXRsZVRleHQ6IHN0cmluZztcbiAgdmVyaWZ5RW1haWxDb25maXJtYXRpb25UZXh0OiBzdHJpbmc7XG4gIHZlcmlmeUVtYWlsR29CYWNrVGV4dDogc3RyaW5nO1xuICBtZXNzYWdlT25FbWFpbENvbmZpcm1hdGlvblN1Y2Nlc3M6IHN0cmluZztcbiAgbWVzc2FnZU9uRXJyb3I6IHN0cmluZztcbn1cblxuY29uc3QgZGVmYXVsdFRyYW5zbGF0aW9ucyA9IHtcbiAgdmVyaWZ5RW1haWxUaXRsZVRleHQ6ICdDb25maXJtIHlvdXIgZS1tYWlsIGFkZHJlc3MhJyxcbiAgdmVyaWZ5RW1haWxDb25maXJtYXRpb25UZXh0OiAnQSBjb25maXJtYXRpb24gZS1tYWlsIGhhcyBiZWVuIHNlbnQuJyArXG4gICAgJyBDaGVjayB5b3VyIGluYm94IGFuZCBjbGljayBvbiB0aGUgbGluayBcIkNvbmZpcm0gbXkgZS1tYWlsXCIgdG8gY29uZmlybSB5b3VyIGUtbWFpbCBhZGRyZXNzLicsXG4gIHZlcmlmeUVtYWlsR29CYWNrVGV4dDogJ0dvIGJhY2snLFxuICBzZW5kTmV3VmVyaWZpY2F0aW9uRW1haWxUZXh0OiAnU2VuZCBuZXcgY29uZmlybWF0aW9uIGUtbWFpbCcsXG4gIHNpZ25PdXRUZXh0OiAnU2lnbiBvdXQnLFxuICBtZXNzYWdlT25FbWFpbENvbmZpcm1hdGlvblN1Y2Nlc3M6ICdBIG5ldyBjb25maXJtYXRpb24gZS1tYWlsIGhhcyBiZWVuIHNlbnQuIFBsZWFzZSBjaGVjayB5b3VyIGluYm94LicsXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtYXV0aC1maXJlYmFzZXVpLWVtYWlsLWNvbmZpcm1hdGlvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9lbWFpbC1jb25maXJtYXRpb24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9lbWFpbC1jb25maXJtYXRpb24uY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgRW1haWxDb25maXJtYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KCkgZW1haWw6IHN0cmluZztcbiAgQElucHV0KCkgZ29CYWNrVVJMOiBzdHJpbmc7XG4gIC8vIGkxOG4gdHJhbnNsYXRpb25zIHRvIHVzZSBpbiBkZWZhdWx0IHRlbXBsYXRlXG4gIEBJbnB1dCgpIHZlcmlmeUVtYWlsVGl0bGVUZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHZlcmlmeUVtYWlsQ29uZmlybWF0aW9uVGV4dDogc3RyaW5nO1xuICBASW5wdXQoKSB2ZXJpZnlFbWFpbEdvQmFja1RleHQ6IHN0cmluZztcbiAgQElucHV0KCkgc2VuZE5ld1ZlcmlmaWNhdGlvbkVtYWlsVGV4dDogc3RyaW5nO1xuICBASW5wdXQoKSBzaWduT3V0VGV4dDogc3RyaW5nO1xuICBASW5wdXQoKSBtZXNzYWdlT25FbWFpbENvbmZpcm1hdGlvblN1Y2Nlc3M6IHN0cmluZztcblxuICAvLyBUZW1wbGF0ZSB0byB1c2UgaW4gcGxhY2Ugb2YgZGVmYXVsdCB0ZW1wbGF0ZVxuICBASW5wdXQoKSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAT3V0cHV0KCkgc2lnbk91dCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvLyBGaW5hbCB0ZW1wbGF0ZVxuICB2ZXJpZnlFbWFpbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAvLyBDb250ZXh0IGhhc2ggdG8gdXNlIGZvciB2ZXJpZnlFbWFpbFRlbXBsYXRlLlxuICB2ZXJpZnlFbWFpbENvbnRleHQ6IFZlcmlmeUVtYWlsQ29udGV4dDtcblxuICBpc0xvYWRpbmc6IGJvb2xlYW47XG5cbiAgQFZpZXdDaGlsZCgnZGVmYXVsdFZlcmlmeUVtYWlsJywge3N0YXRpYzogdHJ1ZX0pIGRlZmF1bHRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXV0aFByb2Nlc3M6IEF1dGhQcm9jZXNzU2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy52ZXJpZnlFbWFpbFRlbXBsYXRlICYmIGNoYW5nZXMudmVyaWZ5RW1haWxUZW1wbGF0ZS5jdXJyZW50VmFsdWUgPT0gbnVsbCkge1xuICAgICAgdGhpcy52ZXJpZnlFbWFpbFRlbXBsYXRlID0gdGhpcy5kZWZhdWx0VGVtcGxhdGU7XG4gICAgICBjb25zb2xlLmxvZygnbmdPbkNoYW5nZXMgLSBkZWZhdWx0VGVtcGxhdGU6JywgdGhpcy52ZXJpZnlFbWFpbFRlbXBsYXRlKTtcbiAgICB9XG4gICAgdGhpcy52ZXJpZnlFbWFpbENvbnRleHQgPSB0aGlzLmNyZWF0ZVRlbXBsYXRlQ29udGV4dCgpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnZlcmlmeUVtYWlsVGVtcGxhdGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCduZ09uSW5pdCAtIGRlZmF1bHRUZW1wbGF0ZScpO1xuICAgICAgdGhpcy52ZXJpZnlFbWFpbFRlbXBsYXRlID0gdGhpcy5kZWZhdWx0VGVtcGxhdGU7XG4gICAgfVxuICAgIHRoaXMudmVyaWZ5RW1haWxDb250ZXh0ID0gdGhpcy5jcmVhdGVUZW1wbGF0ZUNvbnRleHQoKTtcbiAgICBjb25zb2xlLmxvZygndmVyaWZ5RW1haWxUZW1wbGF0ZTonLCB0aGlzLnZlcmlmeUVtYWlsVGVtcGxhdGUpO1xuICAgIGNvbnNvbGUubG9nKCd2ZXJpZnlFbWFpbENvbnRleHQ6JywgdGhpcy52ZXJpZnlFbWFpbENvbnRleHQpO1xuICB9XG5cbiAgYXN5bmMgY29udGludWUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuYXV0aFByb2Nlc3MucmVsb2FkVXNlckluZm8oKTtcbiAgICAgIGF3YWl0IHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmdvQmFja1VSTF0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmF1dGhQcm9jZXNzLm5vdGlmeUVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzZW5kTmV3VmVyaWZpY2F0aW9uRW1haWwoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICBhd2FpdCB0aGlzLmF1dGhQcm9jZXNzLnNlbmROZXdWZXJpZmljYXRpb25FbWFpbCgpO1xuICAgICAgdGhpcy5hdXRoUHJvY2Vzcy5zaG93VG9hc3QodGhpcy52ZXJpZnlFbWFpbENvbnRleHQubWVzc2FnZU9uRW1haWxDb25maXJtYXRpb25TdWNjZXNzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5hdXRoUHJvY2Vzcy5ub3RpZnlFcnJvcihlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVGVtcGxhdGVDb250ZXh0KCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVtYWlsOiB0aGlzLmVtYWlsLFxuICAgICAgZ29CYWNrVVJMOiB0aGlzLmdvQmFja1VSTCxcbiAgICAgIHZlcmlmeUVtYWlsVGl0bGVUZXh0OiB0aGlzLnZlcmlmeUVtYWlsVGl0bGVUZXh0IHx8IGRlZmF1bHRUcmFuc2xhdGlvbnMudmVyaWZ5RW1haWxUaXRsZVRleHQsXG4gICAgICB2ZXJpZnlFbWFpbENvbmZpcm1hdGlvblRleHQ6IHRoaXMudmVyaWZ5RW1haWxDb25maXJtYXRpb25UZXh0IHx8IGRlZmF1bHRUcmFuc2xhdGlvbnMudmVyaWZ5RW1haWxDb25maXJtYXRpb25UZXh0LFxuICAgICAgdmVyaWZ5RW1haWxHb0JhY2tUZXh0OiB0aGlzLnZlcmlmeUVtYWlsR29CYWNrVGV4dCB8fCBkZWZhdWx0VHJhbnNsYXRpb25zLnZlcmlmeUVtYWlsR29CYWNrVGV4dCxcbiAgICAgIHNlbmROZXdWZXJpZmljYXRpb25FbWFpbFRleHQ6IHRoaXMuc2VuZE5ld1ZlcmlmaWNhdGlvbkVtYWlsVGV4dCB8fCBkZWZhdWx0VHJhbnNsYXRpb25zLnNlbmROZXdWZXJpZmljYXRpb25FbWFpbFRleHQsXG4gICAgICBzaWduT3V0VGV4dDogdGhpcy5zaWduT3V0VGV4dCB8fCBkZWZhdWx0VHJhbnNsYXRpb25zLnNpZ25PdXRUZXh0LFxuICAgICAgbWVzc2FnZU9uRW1haWxDb25maXJtYXRpb25TdWNjZXNzOiB0aGlzLm1lc3NhZ2VPbkVtYWlsQ29uZmlybWF0aW9uU3VjY2VzcyB8fCBkZWZhdWx0VHJhbnNsYXRpb25zLm1lc3NhZ2VPbkVtYWlsQ29uZmlybWF0aW9uU3VjY2Vzc1xuICAgIH07XG4gIH1cbn1cbiJdfQ==
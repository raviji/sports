import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
export class LegalityDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        // tslint:disable-next-line:variable-name
        this._disableConfirmActionButton = false;
    }
    get disableConfirmActionButton() {
        if (this.data.tosUrl && this.data.privacyPolicyUrl) {
            this._disableConfirmActionButton = !(this.checkTOS && this.checkPrivacyPolicy);
        }
        else if (this.data.tosUrl && !this.data.privacyPolicyUrl) {
            this._disableConfirmActionButton = !this.checkTOS;
        }
        else if (!this.data.tosUrl && this.data.privacyPolicyUrl) {
            this._disableConfirmActionButton = !this.checkPrivacyPolicy;
        }
        return this._disableConfirmActionButton;
    }
    closeDialog() {
        const result = {
            checked: !this.disableConfirmActionButton,
            authProvider: this.data.authProvider
        };
        this.dialogRef.close(result);
    }
}
LegalityDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-auth-firebaseui-legality-dialog',
                template: "<h1 matDialogTitle>Legal requirements</h1>\n\n<mat-dialog-content>\n  <div fxLayout=\"column\" fxLayoutAlign=\"start\">\n    <mat-checkbox *ngIf=\"this.data.tosUrl\" [(ngModel)]=\"checkTOS\">\n      I agree to the\n      <span>&nbsp;</span>\n      <a [href]=\"this.data.tosUrl\"\n         target=\"_blank\">\n        Terms of Service and Conditions\n      </a>\n    </mat-checkbox>\n\n    <mat-checkbox *ngIf=\"this.data.privacyPolicyUrl\"\n                  [(ngModel)]=\"checkPrivacyPolicy\">\n      I have read and agree to the\n      <span>&nbsp;</span>\n      <a [href]=\"this.data.privacyPolicyUrl\"\n         target=\"_blank\">\n        Privacy\n      </a>\n    </mat-checkbox>\n  </div>\n</mat-dialog-content>\n\n<mat-dialog-actions>\n  <button color=\"warn\"\n          id=\"decline-action\"\n          mat-raised-button\n          matDialogClose>Decline\n  </button>\n  <button (click)=\"closeDialog()\"\n          [disabled]=\"disableConfirmActionButton\"\n          color=\"primary\"\n          id=\"confirm-action\"\n          mat-raised-button>Confirm\n  </button>\n</mat-dialog-actions>\n\n",
                styles: ["::ng-deep .mat-checkbox-label{display:flex;flex-wrap:wrap}mat-dialog-content div{margin-top:1.5rem}mat-dialog-actions{margin-top:1rem}"]
            },] }
];
LegalityDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWxpdHktZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1hdXRoLWZpcmViYXNldWkvc3JjL2xpYi9jb21wb25lbnRzL2xlZ2FsaXR5LWRpYWxvZy9sZWdhbGl0eS1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxlQUFlLEVBQUUsWUFBWSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFRdkUsTUFBTSxPQUFPLHVCQUF1QjtJQUtsQyxZQUFtQixTQUFnRCxFQUN2QixJQUEwQjtRQURuRCxjQUFTLEdBQVQsU0FBUyxDQUF1QztRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUd0RSx5Q0FBeUM7UUFDakMsZ0NBQTJCLEdBQUcsS0FBSyxDQUFDO0lBSDVDLENBQUM7SUFLRCxJQUFJLDBCQUEwQjtRQUM1QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDbEQsSUFBSSxDQUFDLDJCQUEyQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQ2hGO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUQsSUFBSSxDQUFDLDJCQUEyQixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNuRDthQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFELElBQUksQ0FBQywyQkFBMkIsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztTQUM3RDtRQUNELE9BQU8sSUFBSSxDQUFDLDJCQUEyQixDQUFDO0lBQzFDLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxNQUFNLEdBQXlCO1lBQ25DLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQywwQkFBMEI7WUFDekMsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtTQUNyQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7O1lBbENGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUNBQXFDO2dCQUMvQyw2bENBQStDOzthQUVoRDs7O1lBUHdCLFlBQVk7NENBY3RCLE1BQU0sU0FBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01BVF9ESUFMT0dfREFUQSwgTWF0RGlhbG9nUmVmfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHtMZWdhbGl0eURpYWxvZ1BhcmFtcywgTGVnYWxpdHlEaWFsb2dSZXN1bHR9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtYXV0aC1maXJlYmFzZXVpLWxlZ2FsaXR5LWRpYWxvZycsXG4gIHRlbXBsYXRlVXJsOiAnLi9sZWdhbGl0eS1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9sZWdhbGl0eS1kaWFsb2cuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBMZWdhbGl0eURpYWxvZ0NvbXBvbmVudCB7XG5cbiAgY2hlY2tUT1M6IGJvb2xlYW47XG4gIGNoZWNrUHJpdmFjeVBvbGljeTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8TGVnYWxpdHlEaWFsb2dDb21wb25lbnQ+LFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9ESUFMT0dfREFUQSkgcHVibGljIGRhdGE6IExlZ2FsaXR5RGlhbG9nUGFyYW1zKSB7XG4gIH1cblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9kaXNhYmxlQ29uZmlybUFjdGlvbkJ1dHRvbiA9IGZhbHNlO1xuXG4gIGdldCBkaXNhYmxlQ29uZmlybUFjdGlvbkJ1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5kYXRhLnRvc1VybCAmJiB0aGlzLmRhdGEucHJpdmFjeVBvbGljeVVybCkge1xuICAgICAgdGhpcy5fZGlzYWJsZUNvbmZpcm1BY3Rpb25CdXR0b24gPSAhKHRoaXMuY2hlY2tUT1MgJiYgdGhpcy5jaGVja1ByaXZhY3lQb2xpY3kpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhLnRvc1VybCAmJiAhdGhpcy5kYXRhLnByaXZhY3lQb2xpY3lVcmwpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVDb25maXJtQWN0aW9uQnV0dG9uID0gIXRoaXMuY2hlY2tUT1M7XG4gICAgfSBlbHNlIGlmICghdGhpcy5kYXRhLnRvc1VybCAmJiB0aGlzLmRhdGEucHJpdmFjeVBvbGljeVVybCkge1xuICAgICAgdGhpcy5fZGlzYWJsZUNvbmZpcm1BY3Rpb25CdXR0b24gPSAhdGhpcy5jaGVja1ByaXZhY3lQb2xpY3k7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlQ29uZmlybUFjdGlvbkJ1dHRvbjtcbiAgfVxuXG4gIGNsb3NlRGlhbG9nKCkge1xuICAgIGNvbnN0IHJlc3VsdDogTGVnYWxpdHlEaWFsb2dSZXN1bHQgPSB7XG4gICAgICBjaGVja2VkOiAhdGhpcy5kaXNhYmxlQ29uZmlybUFjdGlvbkJ1dHRvbixcbiAgICAgIGF1dGhQcm92aWRlcjogdGhpcy5kYXRhLmF1dGhQcm92aWRlclxuICAgIH07XG4gICAgdGhpcy5kaWFsb2dSZWYuY2xvc2UocmVzdWx0KTtcbiAgfVxuXG59XG4iXX0=
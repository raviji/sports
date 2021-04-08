import { MatDialogRef } from '@angular/material/dialog';
import { LegalityDialogParams } from '../../interfaces';
export declare class LegalityDialogComponent {
    dialogRef: MatDialogRef<LegalityDialogComponent>;
    data: LegalityDialogParams;
    checkTOS: boolean;
    checkPrivacyPolicy: boolean;
    constructor(dialogRef: MatDialogRef<LegalityDialogComponent>, data: LegalityDialogParams);
    private _disableConfirmActionButton;
    get disableConfirmActionButton(): boolean;
    closeDialog(): void;
}

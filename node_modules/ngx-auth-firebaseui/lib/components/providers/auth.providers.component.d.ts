import { AuthProcessService, AuthProvider } from '../../services/auth-process.service';
import { LegalityDialogComponent } from '..';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
export declare enum Theme {
    DEFAULT = "default",
    CLASSIC = "classic",
    STROKED = "stroked",
    FAB = "fab",
    MINI_FAB = "mini-fab",
    RAISED = "raised"
}
export declare enum Layout {
    ROW = "row",
    COLUMN = "column"
}
export declare class AuthProvidersComponent {
    authProcess: AuthProcessService;
    dialog: MatDialog;
    theme: Theme;
    layout: string;
    providers: AuthProvider[] | AuthProvider;
    onSuccess: any;
    onError: any;
    tosUrl: string;
    privacyPolicyUrl: string;
    dialogRef: MatDialogRef<LegalityDialogComponent>;
    themes: typeof Theme;
    authProvider: typeof AuthProvider;
    constructor(authProcess: AuthProcessService, dialog: MatDialog);
    processLegalSignUP(authProvider?: AuthProvider): void;
}

import { EventEmitter, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { AuthProcessService } from "../../services/auth-process.service";
export interface LinkMenuItem {
    text: string;
    icon?: string;
    callback?: Function;
}
export declare class NgxAuthFirebaseuiAvatarComponent implements OnInit {
    afa: AngularFireAuth;
    dialog: MatDialog;
    private authProcess;
    layout: "default" | "simple";
    canLogout: boolean;
    links: LinkMenuItem[];
    canViewAccount: boolean;
    canDeleteAccount: boolean;
    canEditAccount: boolean;
    textProfile: string;
    textSignOut: string;
    onSignOut: EventEmitter<void>;
    user: firebase.User;
    user$: Observable<firebase.User | null>;
    displayNameInitials: string | null;
    constructor(afa: AngularFireAuth, dialog: MatDialog, authProcess: AuthProcessService);
    ngOnInit(): void;
    getDisplayNameInitials(displayName: string | null): string | null;
    openProfile(): void;
    signOut(): Promise<void>;
}

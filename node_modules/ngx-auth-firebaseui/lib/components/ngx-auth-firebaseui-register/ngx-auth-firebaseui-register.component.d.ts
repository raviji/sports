import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthProcessService } from '../../services/auth-process.service';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';
import { NgxAuthFirebaseUIConfig } from '../../interfaces';
export declare const confirmPasswordValidator: ValidatorFn;
export declare class NgxAuthFirebaseuiRegisterComponent implements OnInit, OnDestroy {
    private platformId;
    config: NgxAuthFirebaseUIConfig;
    private formBuilder;
    authProcess: AuthProcessService;
    logoUrl: string;
    appearance: MatFormFieldAppearance;
    tosUrl: string;
    privacyPolicyUrl: string;
    titleText: string;
    termsAndConditionsText: string;
    termsAndConditionsLinkText: string;
    privacyPolicyText: string;
    privacyPolicyLinkText: string;
    createAccountButtonText: string;
    alreadyHaveAccountText: string;
    loginButtonText: string;
    nameText: string;
    nameErrorRequiredText: string;
    emailText: string;
    emailErrorRequiredText: string;
    emailErrorPatternText: string;
    passwordText: string;
    passwordErrorRequiredText: string;
    passwordConfirmationText: string;
    passwordConfirmationErrorRequiredText: string;
    passwordErrorMatchText: string;
    passwordErrorMinLengthText: string;
    passwordErrorMaxLengthText: string;
    onSuccess: any;
    onError: any;
    onLoginRequested: EventEmitter<void>;
    onCreateAccountButtonClicked: EventEmitter<void>;
    registerForm: FormGroup;
    onErrorSubscription: Subscription;
    authenticationError: boolean;
    private unsubscribeAll;
    constructor(platformId: Object, config: NgxAuthFirebaseUIConfig, formBuilder: FormBuilder, authProcess: AuthProcessService);
    get color(): string | ThemePalette;
    get colorAccent(): string | ThemePalette;
    ngOnInit(): void;
    /**
     * On destroy
     */
    ngOnDestroy(): void;
    createAccount(): Promise<void>;
}

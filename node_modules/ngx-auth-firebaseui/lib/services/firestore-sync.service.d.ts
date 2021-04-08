import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import firebase from "firebase/app";
export declare const collections: {
    users: string;
};
export declare class FirestoreSyncService {
    afs: AngularFirestore;
    constructor(afs: AngularFirestore);
    getUserDocRefByUID(uid: string): AngularFirestoreDocument<firebase.UserInfo>;
    deleteUserData(uid: string): Promise<any>;
    updateUserData(user: firebase.UserInfo): Promise<any>;
}

import { Injectable } from "@angular/core";
import { AngularFirestore, } from "@angular/fire/firestore";
import * as i0 from "@angular/core";
import * as i1 from "@angular/fire/firestore";
export const collections = {
    users: "users",
};
export class FirestoreSyncService {
    constructor(afs) {
        this.afs = afs;
        // this.afs.firestore.settings({timestampsInSnapshots: true});
    }
    // get timestamp() {
    //     return firebase.firestore.FieldValue.serverTimestamp();
    // }
    getUserDocRefByUID(uid) {
        return this.afs.doc(`${collections.users}/${uid}`);
    }
    deleteUserData(uid) {
        const userRef = this.getUserDocRefByUID(uid);
        return userRef.delete();
    }
    updateUserData(user) {
        // Sets user$ data to firestore on login
        const userRef = this.getUserDocRefByUID(user.uid);
        const data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            providerId: user.providerId,
        };
        return userRef.set(data, { merge: true });
    }
}
FirestoreSyncService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FirestoreSyncService_Factory() { return new FirestoreSyncService(i0.ɵɵinject(i1.AngularFirestore)); }, token: FirestoreSyncService, providedIn: "root" });
FirestoreSyncService.decorators = [
    { type: Injectable, args: [{
                providedIn: "root",
            },] }
];
FirestoreSyncService.ctorParameters = () => [
    { type: AngularFirestore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZXN0b3JlLXN5bmMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1hdXRoLWZpcmViYXNldWkvc3JjL2xpYi9zZXJ2aWNlcy9maXJlc3RvcmUtc3luYy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUNMLGdCQUFnQixHQUVqQixNQUFNLHlCQUF5QixDQUFDOzs7QUFHakMsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHO0lBQ3pCLEtBQUssRUFBRSxPQUFPO0NBQ2YsQ0FBQztBQUtGLE1BQU0sT0FBTyxvQkFBb0I7SUFDL0IsWUFBbUIsR0FBcUI7UUFBckIsUUFBRyxHQUFILEdBQUcsQ0FBa0I7UUFDdEMsOERBQThEO0lBQ2hFLENBQUM7SUFFRCxvQkFBb0I7SUFDcEIsOERBQThEO0lBQzlELElBQUk7SUFFRyxrQkFBa0IsQ0FDdkIsR0FBVztRQUVYLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVNLGNBQWMsQ0FBQyxHQUFXO1FBQy9CLE1BQU0sT0FBTyxHQUFnRCxJQUFJLENBQUMsa0JBQWtCLENBQ2xGLEdBQUcsQ0FDSixDQUFDO1FBQ0YsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLGNBQWMsQ0FBQyxJQUF1QjtRQUMzQyx3Q0FBd0M7UUFDeEMsTUFBTSxPQUFPLEdBQWdELElBQUksQ0FBQyxrQkFBa0IsQ0FDbEYsSUFBSSxDQUFDLEdBQUcsQ0FDVCxDQUFDO1FBQ0YsTUFBTSxJQUFJLEdBQXNCO1lBQzlCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztZQUM3QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDNUIsQ0FBQztRQUNGLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7O1lBdkNGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7O1lBWEMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1xuICBBbmd1bGFyRmlyZXN0b3JlLFxuICBBbmd1bGFyRmlyZXN0b3JlRG9jdW1lbnQsXG59IGZyb20gXCJAYW5ndWxhci9maXJlL2ZpcmVzdG9yZVwiO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gXCJmaXJlYmFzZS9hcHBcIjtcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25zID0ge1xuICB1c2VyczogXCJ1c2Vyc1wiLFxufTtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiBcInJvb3RcIixcbn0pXG5leHBvcnQgY2xhc3MgRmlyZXN0b3JlU3luY1NlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgYWZzOiBBbmd1bGFyRmlyZXN0b3JlKSB7XG4gICAgLy8gdGhpcy5hZnMuZmlyZXN0b3JlLnNldHRpbmdzKHt0aW1lc3RhbXBzSW5TbmFwc2hvdHM6IHRydWV9KTtcbiAgfVxuXG4gIC8vIGdldCB0aW1lc3RhbXAoKSB7XG4gIC8vICAgICByZXR1cm4gZmlyZWJhc2UuZmlyZXN0b3JlLkZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCk7XG4gIC8vIH1cblxuICBwdWJsaWMgZ2V0VXNlckRvY1JlZkJ5VUlEKFxuICAgIHVpZDogc3RyaW5nXG4gICk6IEFuZ3VsYXJGaXJlc3RvcmVEb2N1bWVudDxmaXJlYmFzZS5Vc2VySW5mbz4ge1xuICAgIHJldHVybiB0aGlzLmFmcy5kb2MoYCR7Y29sbGVjdGlvbnMudXNlcnN9LyR7dWlkfWApO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZVVzZXJEYXRhKHVpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCB1c2VyUmVmOiBBbmd1bGFyRmlyZXN0b3JlRG9jdW1lbnQ8ZmlyZWJhc2UuVXNlckluZm8+ID0gdGhpcy5nZXRVc2VyRG9jUmVmQnlVSUQoXG4gICAgICB1aWRcbiAgICApO1xuICAgIHJldHVybiB1c2VyUmVmLmRlbGV0ZSgpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVVzZXJEYXRhKHVzZXI6IGZpcmViYXNlLlVzZXJJbmZvKTogUHJvbWlzZTxhbnk+IHtcbiAgICAvLyBTZXRzIHVzZXIkIGRhdGEgdG8gZmlyZXN0b3JlIG9uIGxvZ2luXG4gICAgY29uc3QgdXNlclJlZjogQW5ndWxhckZpcmVzdG9yZURvY3VtZW50PGZpcmViYXNlLlVzZXJJbmZvPiA9IHRoaXMuZ2V0VXNlckRvY1JlZkJ5VUlEKFxuICAgICAgdXNlci51aWRcbiAgICApO1xuICAgIGNvbnN0IGRhdGE6IGZpcmViYXNlLlVzZXJJbmZvID0ge1xuICAgICAgdWlkOiB1c2VyLnVpZCxcbiAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgZGlzcGxheU5hbWU6IHVzZXIuZGlzcGxheU5hbWUsXG4gICAgICBwaG90b1VSTDogdXNlci5waG90b1VSTCxcbiAgICAgIHBob25lTnVtYmVyOiB1c2VyLnBob25lTnVtYmVyLFxuICAgICAgcHJvdmlkZXJJZDogdXNlci5wcm92aWRlcklkLFxuICAgIH07XG4gICAgcmV0dXJuIHVzZXJSZWYuc2V0KGRhdGEsIHsgbWVyZ2U6IHRydWUgfSk7XG4gIH1cbn1cbiJdfQ==
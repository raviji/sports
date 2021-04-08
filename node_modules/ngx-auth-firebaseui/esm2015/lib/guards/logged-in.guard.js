import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NgxAuthFirebaseUIConfigToken } from '../tokens';
import { AuthProcessService } from '../services/auth-process.service';
import * as i0 from "@angular/core";
import * as i1 from "../tokens/index";
import * as i2 from "@angular/router";
import * as i3 from "../services/auth-process.service";
export class LoggedInGuard {
    constructor(config, router, authProcess) {
        this.config = config;
        this.router = router;
        this.authProcess = authProcess;
    }
    canActivate(route, state) {
        return this.authProcess.afa.user.pipe(map(user => {
            if (user) {
                if (this.config.guardProtectedRoutesUntilEmailIsVerified && !user.emailVerified && !user.isAnonymous) {
                    if (this.config.authGuardFallbackURL) {
                        this.router.navigate([`${this.config.authGuardFallbackURL}`], { queryParams: { redirectUrl: state.url } });
                    }
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if (this.config.authGuardFallbackURL) {
                    this.router.navigate([`/${this.config.authGuardFallbackURL}`], { queryParams: { redirectUrl: state.url } });
                }
                return false;
            }
        }));
    }
}
LoggedInGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function LoggedInGuard_Factory() { return new LoggedInGuard(i0.ɵɵinject(i1.NgxAuthFirebaseUIConfigToken), i0.ɵɵinject(i2.Router), i0.ɵɵinject(i3.AuthProcessService)); }, token: LoggedInGuard, providedIn: "root" });
LoggedInGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
LoggedInGuard.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [NgxAuthFirebaseUIConfigToken,] }] },
    { type: Router },
    { type: AuthProcessService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VkLWluLmd1YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWF1dGgtZmlyZWJhc2V1aS9zcmMvbGliL2d1YXJkcy9sb2dnZWQtaW4uZ3VhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFzQyxNQUFNLEVBQXNCLE1BQU0saUJBQWlCLENBQUM7QUFFakcsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUN2RCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQzs7Ozs7QUFLcEUsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFFVSxNQUErQixFQUMvQixNQUFjLEVBQ2QsV0FBK0I7UUFGL0IsV0FBTSxHQUFOLE1BQU0sQ0FBeUI7UUFDL0IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtJQUV6QyxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQTZCLEVBQUUsS0FBMEI7UUFDbkUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNuQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDVCxJQUFJLElBQUksRUFBRTtnQkFDUixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsd0NBQXdDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDcEcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFO3dCQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsRUFBQyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBQyxFQUFDLENBQUMsQ0FBQztxQkFDeEc7b0JBQ0QsT0FBTyxLQUFLLENBQUM7aUJBQ2Q7cUJBQU07b0JBQ0wsT0FBTyxJQUFJLENBQUM7aUJBQ2I7YUFDRjtpQkFBTTtnQkFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUU7b0JBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUMsRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFDLEVBQUMsQ0FBQyxDQUFDO2lCQUN6RztnQkFDRCxPQUFPLEtBQUssQ0FBQzthQUNkO1FBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7Ozs7WUFoQ0YsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7NENBR0ksTUFBTSxTQUFDLDRCQUE0QjtZQVpLLE1BQU07WUFLM0Msa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBDYW5BY3RpdmF0ZSwgUm91dGVyLCBSb3V0ZXJTdGF0ZVNuYXBzaG90fSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge05neEF1dGhGaXJlYmFzZVVJQ29uZmlnfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7Tmd4QXV0aEZpcmViYXNlVUlDb25maWdUb2tlbn0gZnJvbSAnLi4vdG9rZW5zJztcbmltcG9ydCB7QXV0aFByb2Nlc3NTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9hdXRoLXByb2Nlc3Muc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIExvZ2dlZEluR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTmd4QXV0aEZpcmViYXNlVUlDb25maWdUb2tlbilcbiAgICBwcml2YXRlIGNvbmZpZzogTmd4QXV0aEZpcmViYXNlVUlDb25maWcsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIGF1dGhQcm9jZXNzOiBBdXRoUHJvY2Vzc1NlcnZpY2VcbiAgKSB7XG4gIH1cblxuICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5hdXRoUHJvY2Vzcy5hZmEudXNlci5waXBlKFxuICAgICAgbWFwKHVzZXIgPT4ge1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5ndWFyZFByb3RlY3RlZFJvdXRlc1VudGlsRW1haWxJc1ZlcmlmaWVkICYmICF1c2VyLmVtYWlsVmVyaWZpZWQgJiYgIXVzZXIuaXNBbm9ueW1vdXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5hdXRoR3VhcmRGYWxsYmFja1VSTCkge1xuICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbYCR7dGhpcy5jb25maWcuYXV0aEd1YXJkRmFsbGJhY2tVUkx9YF0sIHtxdWVyeVBhcmFtczoge3JlZGlyZWN0VXJsOiBzdGF0ZS51cmx9fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuYXV0aEd1YXJkRmFsbGJhY2tVUkwpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtgLyR7dGhpcy5jb25maWcuYXV0aEd1YXJkRmFsbGJhY2tVUkx9YF0sIHtxdWVyeVBhcmFtczoge3JlZGlyZWN0VXJsOiBzdGF0ZS51cmx9fSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iXX0=
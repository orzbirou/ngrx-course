import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthStore } from './auth.store';

@Injectable()
export class AuthGuard {

    private authStore = inject(AuthStore);
    private router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        // Signals are synchronous — no need for an Observable chain
        if (!this.authStore.isLoggedIn()) {
            this.router.navigateByUrl('/login');
            return false;
        }
        return true;
    }

}

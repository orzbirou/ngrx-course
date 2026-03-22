import { Component, OnInit, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthStore } from './auth/auth.store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    loading = true;

    // Expose the store so the template can call authStore.isLoggedIn() and authStore.isLoggedOut()
    readonly authStore = inject(AuthStore);

    constructor(private router: Router) {}

    ngOnInit() {
        const userProfile = localStorage.getItem('user');

        if (userProfile) {
            // Restore session from localStorage on app startup
            this.authStore.login(JSON.parse(userProfile));
        }

        this.router.events.subscribe(event => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    logout() {
        // AuthStore.logout() handles both localStorage cleanup and navigation
        this.authStore.logout();
    }

}

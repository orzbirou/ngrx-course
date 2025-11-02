import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { noop, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { AppState } from "./reducers";
import { AuthService } from "./auth/auth.service";
import { login, logout } from "./auth/auth.actions";
import { isLoggedIn, isLoggedOut } from "./auth/auth.selectors";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  standalone: false,
})
export class AppComponent implements OnInit {
  loading = true;
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {

    const user = localStorage.getItem('user');
    if (user) {
      this.store.dispatch(
        login({ user: JSON.parse(user) })
      );
    }

    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut));

    this.router.events.subscribe((event) => {
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
          this.store.dispatch(logout());
          this.router.navigateByUrl("/login");
  }
}

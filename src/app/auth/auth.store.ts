import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User } from './model/user.model';

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.user()),
    isLoggedOut: computed(() => !store.user()),
  })),
  withMethods((store, router = inject(Router)) => ({
    login(user: User): void {
      localStorage.setItem('user', JSON.stringify(user));
      patchState(store, { user });
    },
    logout(): void {
      localStorage.removeItem('user');
      patchState(store, { user: null });
      router.navigateByUrl('/login');
    },
  }))
);

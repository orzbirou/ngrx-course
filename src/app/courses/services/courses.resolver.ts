import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { filter, first } from "rxjs/operators";
import { toObservable } from "@angular/core/rxjs-interop";
import { CoursesStore } from "../store/courses.store";

@Injectable()
export class CoursesResolver {

    private coursesStore = inject(CoursesStore);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // Kick off the load if not yet loaded
        this.coursesStore.loadAll();

        // toObservable() bridges Signal → Observable so the router can await it
        return toObservable(this.coursesStore.loaded).pipe(
            filter(loaded => loaded),
            first()
        );
    }

}
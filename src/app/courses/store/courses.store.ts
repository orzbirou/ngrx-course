import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { CoursesHttpService } from '../services/courses-http.service';

// Extra state beyond the entity collection
interface CoursesState {
  loading: boolean;
  loaded: boolean;
}

const initialState: CoursesState = {
  loading: false,
  loaded: false,
};

export const CoursesStore = signalStore(
  // withEntities<Course>() adds:
  //   - entityMap()  — signal: Record<id, Course>
  //   - entities()   — signal: Course[]  (sorted insertion order)
  //   - ids()        — signal: number[]
  // and utility updaters: setAllEntities, addEntity, updateEntity, removeEntity
  withEntities<Course>(),

  // Our extra state: loading + loaded flags
  withState<CoursesState>(initialState),

  // Derived (computed) signals — equivalent to NgRx selectors
  withComputed((store) => ({
    beginnerCourses: computed(() =>
      store.entities().filter((c) => c.category === 'BEGINNER')
    ),
    advancedCourses: computed(() =>
      store.entities().filter((c) => c.category === 'ADVANCED')
    ),
    promoTotal: computed(() =>
      store.entities().filter((c) => c.promo).length
    ),
  })),

  // Methods replace the NgRx reducer (state changes) + effects (HTTP + side effects)
  withMethods((store, http = inject(CoursesHttpService)) => ({
    // Called by the resolver to prefetch courses
    loadAll(): void {
      if (store.loaded()) {
        return; // Guard: don't reload if already loaded
      }
      patchState(store, { loading: true });
      http.findAllCourses().subscribe((courses) => {
        // setAllEntities replaces the entire entity collection at once
        patchState(store, setAllEntities(courses), {
          loading: false,
          loaded: true,
        });
      });
    },

    // Optimistic update: patch state immediately, then confirm with server
    updateCourse(course: Course): void {
      patchState(store, updateEntity({ id: course.id, changes: course }));
      http.saveCourse(course.id, course).subscribe();
    },

    // Non-optimistic delete: wait for server confirmation before removing from state
    deleteCourse(course: Course): void {
      http.deleteCourse(course.id).subscribe(() => {
        patchState(store, removeEntity(course.id));
      });
    },

    // Returns Observable so the dialog can react (close) when the new course arrives
    addCourse(courseData: Partial<Course>): Observable<Course> {
      return http.createCourse(courseData).pipe(
        tap((newCourse) => patchState(store, addEntity(newCourse)))
      );
    },
  }))
);

import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { addEntities, withEntities } from '@ngrx/signals/entities';
import { Lesson } from '../model/lesson';
import { CoursesHttpService } from '../services/courses-http.service';

interface LessonsState {
  loading: boolean;
}

const initialState: LessonsState = {
  loading: false,
};

export const LessonsStore = signalStore(
  // withEntities<Lesson>() gives us entities(), entityMap(), ids() as signals
  // plus addEntities, setAllEntities, removeEntity etc. as updaters
  withEntities<Lesson>(),

  withState<LessonsState>(initialState),

  withMethods((store, http = inject(CoursesHttpService)) => ({
    loadPage(courseId: number, pageNumber: number): void {
      patchState(store, { loading: true });

      http.findLessons(courseId, pageNumber).subscribe((lessons) => {
        // addEntities merges new lessons into the existing collection
        // (avoids duplicates since entity map uses id as key)
        patchState(store, addEntities(lessons), { loading: false });
      });
    },
  }))
);

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Course } from "../model/course";
import { MatDialog } from "@angular/material/dialog";
import { EditCourseDialogComponent } from "../edit-course-dialog/edit-course-dialog.component";
import { defaultDialogConfig } from '../shared/default-dialog-config';
import { CoursesStore } from '../store/courses.store';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
    
})
export class CoursesCardListComponent {

    @Input()
    courses: Course[];

    @Output()
    courseChanged = new EventEmitter();

    private dialog = inject(MatDialog);
    private coursesStore = inject(CoursesStore);

    editCourse(course:Course) {

        const dialogConfig = defaultDialogConfig();

        dialogConfig.data = {
          dialogTitle:"Edit Course",
          course,
          mode: 'update'
        };

        this.dialog.open(EditCourseDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => this.courseChanged.emit());

    }

  onDeleteCourse(course: Course) {
    this.coursesStore.deleteCourse(course);
  }

}










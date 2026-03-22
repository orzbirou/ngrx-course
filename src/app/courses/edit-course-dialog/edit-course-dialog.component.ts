import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CoursesStore } from '../store/courses.store';

@Component({
  selector: 'course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
  
})
export class EditCourseDialogComponent {

  form: UntypedFormGroup;

  dialogTitle: string;

  course: Course;

  mode: 'create' | 'update';

  private coursesStore = inject(CoursesStore);

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;

    const formControls = {
      description: ['', Validators.required],
      category: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: ['', []]
    };

    if (this.mode == 'update') {
      this.form = this.fb.group(formControls);
      this.form.patchValue({...data.course});
    }
    else if (this.mode == 'create') {
      this.form = this.fb.group({
        ...formControls,
        url: ['', Validators.required],
        iconUrl: ['', Validators.required]
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {

    const course: Course = {
      ...this.course,
      ...this.form.value
    };

    if (this.mode == 'update') {
      // updateCourse is optimistic: state updates immediately, HTTP confirms in background
      this.coursesStore.updateCourse(course);
      this.dialogRef.close();
    }

    if (this.mode == 'create') {
      // addCourse returns an Observable so we can close the dialog after the server responds
      this.coursesStore.addCourse(course).subscribe(newCourse => {
        console.log('new course:', newCourse);
        this.dialogRef.close();
      });
    }

  }

}

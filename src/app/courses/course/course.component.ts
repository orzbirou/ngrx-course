import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { CoursesStore } from "../store/courses.store";
import { LessonsStore } from "../store/lessons.store";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Provide LessonsStore here (not at module level) so each navigation to a
  // course route creates a fresh lessons state — no stale lessons from other courses
  providers: [LessonsStore]
})
export class CourseComponent implements OnInit {

  private coursesStore = inject(CoursesStore);
  readonly lessonsStore = inject(LessonsStore);
  private route = inject(ActivatedRoute);

  private courseUrl = this.route.snapshot.paramMap.get("courseUrl");

  // Derived signal: look up the current course from the store by URL
  readonly course = computed(() =>
    this.coursesStore.entities().find(c => c.url === this.courseUrl)
  );

  // Derived signal: filter lessons belonging to this course
  readonly courseLessons = computed(() => {
    const c = this.course();
    if (!c) return [];
    return this.lessonsStore.entities().filter(l => l.courseId === c.id);
  });

  displayedColumns = ["seqNo", "description", "duration"];
  nextPage = 0;

  ngOnInit() {
    const course = this.course();
    if (course) {
      this.loadLessonsPage(course);
    }
  }

  loadLessonsPage(course: Course) {
    this.lessonsStore.loadPage(course.id, this.nextPage);
    this.nextPage += 1;
  }
}


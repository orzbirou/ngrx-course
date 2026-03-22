import { Component, OnInit, inject } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {tap} from "rxjs/operators";
import {noop} from "rxjs";
import {Router} from "@angular/router";
import { AuthStore } from '../auth.store';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: UntypedFormGroup;

  constructor(
      private fb:UntypedFormBuilder,
      private auth: AuthService,
      private router:Router) {

      this.form = fb.group({
          email: ['test@angular-university.io', [Validators.required]],
          password: ['test', [Validators.required]]
      });

  }

  ngOnInit() {

  }

  login() {

      const val = this.form.value;

      this.auth.login(val.email, val.password)
          .pipe(
              tap(user => {

                  console.log(user);

                  inject(AuthStore).login(user);

                  this.router.navigateByUrl('/courses');

              })
          )
          .subscribe(
              noop,
              () => alert('Login Failed')
          );



  }

}


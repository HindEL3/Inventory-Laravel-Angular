import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {LaravelErrorExtractorService} from "../../../services/laravel-error-extractor.service";
import {ToastrService} from "ngx-toastr";
import {GenericErrorHandlerService} from "../../../services/generic-error-handler.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loadingForm = true;

  passwordType = 'password';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: GenericErrorHandlerService) {
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.router.navigate(['/']).then();
    }

    this.initForm();
  }

  initForm() {
    this.loadingForm = true;
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.loadingForm = false;
  }

  handleSubmitLoginForm() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.authService.logUserIn(res.token);
        this.router.navigate(['/']).then();
      },
      error: (err) => {

        this.errorHandler.handleError(err);

      }
    });
  }

  showPassword() {
    this.passwordType = 'text';
  }

  hidePassword() {
    this.passwordType = 'password';
  }
}

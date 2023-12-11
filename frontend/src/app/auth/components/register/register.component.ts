import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GenericErrorHandlerService} from "../../../services/generic-error-handler.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  passwordType: string = 'password';
  loadingForm: boolean = true;

  constructor(private authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private errorHandler: GenericErrorHandlerService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loadingForm = true;
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.loadingForm = false;
  }

  handleRegisterFormSubmit() {
    console.log(this.registerForm.value);

    this.authService.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.toastr.success('You have registered successfully');
        this.router.navigate(['/login']).then();
      },
      error: (err: any) => {
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

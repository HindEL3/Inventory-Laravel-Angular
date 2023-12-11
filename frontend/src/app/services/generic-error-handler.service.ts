import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {LaravelErrorExtractorService} from './laravel-error-extractor.service';

@Injectable({
  providedIn: 'root'
})
export class GenericErrorHandlerService {

  constructor(
    private toastr: ToastrService
  ) {
  }

  handleError(error: any, defaultMessage: string = 'An error occurred') {
    let errorMessages = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(error);

    if (errorMessages.length > 0) {
      errorMessages.forEach((errorMessage) => {
        this.toastr.error(errorMessage);
      });
    } else if (error.error.error) {
      console.log('Got here');
      console.log(error);
      this.toastr.error(error.error.error);
    } else if (error.message) {
      console.log('Got here');
      console.log(error);
      this.toastr.error(error.error.error);
    } else {
      this.toastr.error(defaultMessage);
    }
  }
}

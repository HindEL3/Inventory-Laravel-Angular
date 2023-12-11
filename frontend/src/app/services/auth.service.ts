import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable, ReplaySubject} from "rxjs";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;

  loggedInUser: ReplaySubject<User> = new ReplaySubject<User>(1);

  constructor(private http: HttpClient) {
  }

  register(formData: FormData) {
    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  login(data: FormData): Observable<{ token: string }> {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }

  logout() {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('loggedInUser');
    this.loggedInUser.next(AuthService.blankUser());
  }

  static blankUser(): User {
    return ({} as any) as User;
  }

  fetchLoggedInUserDetails(): Observable<any> {
    return new Observable<any>(observer => {
      this.http.get<User>(`${this.apiUrl}/user`).subscribe({
        next: (res) => {
          this.loggedInUser.next(res);
          this.storeUserDetails(res);
          observer.next(res);
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  logUserIn(bearerToken: string) {
    localStorage.setItem('bearerToken', bearerToken);
    // Fetch the details of the logged-in user
    this.fetchLoggedInUserDetails().subscribe({
      next: () => {

      }
    });
  }

  loggedInUserSubscribe() {
    if (this.isUserDetailsStored() && this.getToken() !== null) {
      this.loggedInUser.next(this.getLoggedInUserDetails());
      return this.loggedInUser;
    }

    if (this.getToken()) {
      this.fetchLoggedInUserDetails().subscribe();
    }
    return this.loggedInUser;
  }

  isUserDetailsStored() {
    return localStorage.getItem('loggedInUser') !== null;
  }

  getLoggedInUserDetails() {
    return JSON.parse(localStorage.getItem('loggedInUser') as string);
  }

  storeUserDetails(user: User) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('bearerToken');
  }
}

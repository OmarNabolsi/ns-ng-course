import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject, of } from "rxjs";
import { alert } from "tns-core-modules/ui/dialogs";
import { User } from "./user.model";
import { RouterExtensions } from "nativescript-angular/router";
import {
  setString,
  getString,
  hasKey,
  remove
} from "tns-core-modules/application-settings";
import { ChallengeService } from "../challenges/challenge.service";

const FIREBASE_API_KEY = "AIzaSyCvp1S_6Q6WVmQvAkJ5m7S6X8Yxbb4lyH4";
interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private _user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: number;

  constructor(private http: HttpClient, private router: RouterExtensions) {}

  get user() {
    return this._user.asObservable();
  }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${FIREBASE_API_KEY}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(errorRes => {
          this.handleError(errorRes.error.error.message);
          return throwError(errorRes);
        }),
        tap(resData => {
          if (resData && resData.idToken) {
            this.handleLogin(
              resData.email,
              resData.idToken,
              resData.localId,
              parseInt(resData.expiresIn)
            );
          }
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${FIREBASE_API_KEY}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(errorRes => {
          this.handleError(errorRes.error.error.message);
          return throwError(errorRes);
        }),
        tap(resData => {
          if (resData && resData.idToken) {
            this.handleLogin(
              resData.email,
              resData.idToken,
              resData.localId,
              parseInt(resData.expiresIn)
            );
          }
        })
      );
  }

  logout() {
    this._user.next(null);
    remove("userData");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(["/auth"], { clearHistory: true });
  }

  autoLogin() {
    if (!hasKey("userData")) {
      return of(false);
    }
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(getString("userData"));
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.isAuth) {
      this._user.next(loadedUser);
      this.autoLogout(loadedUser.timeToExpiry);
      return of(true);
    }
    return of(false);
  }

  autoLogout(expiryDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expiryDuration);
  }

  private handleLogin(
    email: string,
    token: string,
    userId: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    setString("userData", JSON.stringify(user));
    this.autoLogout(user.timeToExpiry);
    this._user.next(user);
  }

  private handleError(errorMessage: string) {
    switch (errorMessage) {
      case "EMAIL_EXISTS":
        alert("This email address exists already!");
        break;
      case "INVALID_PASSWORD":
        alert("Your password is invalid!");
        break;
      case "IEMAIL_NOT_FOUND":
        alert("The email address is not valid!");
        break;
      default:
        alert("Authentication failed, check your credentials.");
    }
  }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {User} from '../model/User';
import {post} from 'selenium-webdriver/http';

export interface UserDetails {
  _id: string;
  userName: string;
  userEmail: string;
  userPassword: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class BackendApisService {

  static apiBaseUrl = 'http://localhost:3000/api';

  private token: string;

  public pageLimit = 3;

  constructor(private http: HttpClient, private route: Router) {
  }

  saveToken(token: string) {
    localStorage.setItem('usertoken', token);
    this.token = token;
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('usertoken');
    }
    return this.token;
  }

  getUserPayload(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }


  isLoggedIn() {
    const user = this.getUserPayload();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }


  addNewUser(postData) {
    return this.http.post(BackendApisService.apiBaseUrl + `/users`, postData);
  }

  userLogin(postData) {
    return this.http.post(BackendApisService.apiBaseUrl + `/users/login`, postData);
  }

  userProfile() {
    return this.http.get(BackendApisService.apiBaseUrl + `/users/profile`, {
      headers: {Authorization: ` ${this.getToken()}`}
    });
  }


  userForgetPassword(postData) {
    return this.http.post(BackendApisService.apiBaseUrl + `/users/forget-password`, postData);

  }

  userResetPassword(postData) {
    return this.http.post(BackendApisService.apiBaseUrl + `/users/reset-password`, postData);

  }


  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('usertoken');
    this.route.navigateByUrl('/');
  }


  createNewTodo(postData) {
    return this.http.post(BackendApisService.apiBaseUrl + `/todos`, postData, {
      headers: {Authorization: ` ${this.getToken()}`}
    });
  }

  getAllTodo(pageNo, sort) {
    const page = this.pageLimit * pageNo;
    return this.http.get(BackendApisService.apiBaseUrl + `/todos?skip=${page}&limit=${this.pageLimit}&sort=${sort}`, {
      headers: {Authorization: ` ${this.getToken()}`}
    });
  }

  getSearchTask(todotask, pageNo, sort) {
    const page = this.pageLimit * pageNo;
    return this.http.get(BackendApisService.apiBaseUrl + `/todos/search?todotask=${todotask}&skip=${page}&limit=${this.pageLimit}&sort=${sort}`, {
      headers: {Authorization: ` ${this.getToken()}`}
    });
  }


  getTodoById(id) {
    return this.http.get(BackendApisService.apiBaseUrl + `/todos/` + id, {
      headers: {Authorization: ` ${this.getToken()}`}
    });
  }

  updateTodo(id, postData) {
    return this.http.put(BackendApisService.apiBaseUrl + `/todos/` + id, postData, {
      headers: {Authorization: ` ${this.getToken()}`}
    });

  }

  deleteTodo(id) {
    return this.http.delete(BackendApisService.apiBaseUrl + `/todos/` + id, {
      headers: {Authorization: ` ${this.getToken()}`}
    });
  }


}

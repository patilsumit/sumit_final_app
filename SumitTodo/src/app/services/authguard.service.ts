import {Injectable} from '@angular/core';
import {BackendApisService} from './backend-apis.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private apiServices: BackendApisService, private route: Router) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (!this.apiServices.isLoggedIn()) {
      this.route.navigateByUrl('/login');
      this.apiServices.logout();
      return false;
    }
    return true;
  }

}

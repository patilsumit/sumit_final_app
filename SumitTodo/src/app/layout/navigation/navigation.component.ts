import {Component, OnInit} from '@angular/core';
import {BackendApisService, UserDetails} from '../../services/backend-apis.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  details: UserDetails;

  constructor(public apiServices: BackendApisService) {
  }

  ngOnInit() {
  }

  //
  // getProfile() {
  //   this.apiServices.userProfile().subscribe(
  //     (user: any) => {
  //       this.details = user.response;
  //       console.log(this.details.userName);
  //     },
  //     err => {
  //       console.error(err);
  //     }
  //   );
  // }
}



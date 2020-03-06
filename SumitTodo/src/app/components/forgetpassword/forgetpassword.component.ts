import {Component, OnInit} from '@angular/core';
import {BackendApisService} from '../../services/backend-apis.service';
import {User} from '../../model/User';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  user: User = {
    userEmail: ''
  };

  showSucessMessage: string;
  serverErrorMessages: boolean;
  constructor(private apiServices: BackendApisService) {
  }

  ngOnInit() {
  }


  userForgetPassword() {


    this.apiServices.userForgetPassword(this.user).subscribe((response: any) => {
      this.showSucessMessage = 'Reset Link Sent your Registered Email Successfully';
    }, error => {
      this.serverErrorMessages = error.error.response;
      setTimeout(() => this.serverErrorMessages = false, 4000);
    });
  }


}

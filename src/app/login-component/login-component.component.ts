import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { LoginsvService } from '../services/loginsv.service';
import { IloginAt } from '../models/login-request.modules';
import { HttpHeaders } from '@angular/common/http';
import ValidateForm from '../helper/validationform';
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
  providers: [MessageService]
})
export class LoginComponentComponent {
  model: IloginAt;
  showPassword: boolean = false; 
  showHeaderFooter: boolean = false;
  constructor(

    private loginsvService: LoginsvService,
    private fb: FormBuilder,
    private router: Router, 
    private messageService: MessageService,
  ) {
    this.model = {
      Email: '',
      Password: ''
    };
  }
  login() {
    const formData = new FormData();
    formData.append('email', this.model.Email);
    formData.append('password', this.model.Password);
    this.loginsvService.loginAu(formData).subscribe({
      next: (response: any) => {
        if (response.isSuccess == true) {
          const headers = response.token;
          this.loginsvService.setToken(headers);
          this.loginsvService.getUser().subscribe({
            next: (rs: any) => {
              localStorage.setItem('userId', rs.id);
            }
          });
          this.router.navigateByUrl('/home');
        } else {
          this.messageService.add({ severity: 'error', summary: response.message, detail: '' });
        }
      },
      error: (err) => {
        console.log(err);
      },

    });
  }
logout(){
    this.loginsvService.logout();
  }
}





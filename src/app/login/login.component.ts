import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  constructor(private router: Router) { }

  onSubmit() {
    if (this.loginData.username === 'medico' && this.loginData.password === 'password123') {
      this.router.navigate(['/pacientes']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
}

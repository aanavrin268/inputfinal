import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService} from '../auth.service'; // Importa AuthService
import { Location } from '@angular/common'; // Importa Location


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss' ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;


  constructor(private router: Router, private fb: FormBuilder,
              private authService: AuthService, private location: Location) { 

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    /*
    if(this.authService.isAuthenticated()){
      console.log("el usuario esta loggeado");
      //this.router.navigate(['/home']); 
      this.router.navigate(['/home'], { replaceUrl: true });
      localStorage.setItem('userSession', JSON.stringify({ loggedIn: true, userType: 'profesor' }));



    }else {
      console.log("NOOO  esta loggeado");
      //Sczxc
    }

    */

    this.checkUserSession();



    window.addEventListener('storage', this.handleStorageChange.bind(this));

  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));

    
  }



  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (data) => {
          //time
          //const loginTime = new Date().getTime();
          //localStorage.setItem('loginTime', loginTime.toString());

          const credentials = {user: data.user, status: true};


          this.authService.storeUser(credentials);

          localStorage.setItem('loged', JSON.stringify(true));
          this.checkUserSession(); // Verifica inmediatamente después de hacer login
          
          //this.router.navigate(['/home'], { replaceUrl: true });

          //this.router.navigate(['/home']);
          //this.location.replaceState('/home'); // Evita volver al login

        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Datos incorrectos, por favor verifica e intenta nuevamente.',
          });
        }
      });



      
    }
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === 'userSession') {
      const sessionData = JSON.parse(event.newValue || '{}');
      if (sessionData.loggedIn === false) {
        // Cierra la sesión en la pestaña actual
        localStorage.setItem('userSession', JSON.stringify({ loggedIn: false }));
        this.router.navigate(['/login']); // O redirigir a donde necesites
      } else {
        this.router.navigate(['/home']);
      }
    }
  }



  checkUserSession() {
    const stored = localStorage.getItem('loged');
    if (stored) {
      const valor = JSON.parse(stored);
      if (valor === true) {
        localStorage.setItem('userSession', JSON.stringify({ loggedIn: true }));
        this.router.navigate(['/home']);
      }
    }
  }
  

  openRegister() {
    this.router.navigate(['/register']);
  }
}

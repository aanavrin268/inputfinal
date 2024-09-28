import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterUserService } from '../register-user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] // Asegúrate de que sea styleUrls
})
export class RegisterComponent implements OnInit, OnDestroy {
  public userForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: RegisterUserService, private router: Router,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));

  }

  ngOnInit(): void {

    this.checkUserSession();


    this.userForm = this.fb.group({
      name: ['', Validators.required],
      tipo: ['', [Validators.required, this.tipoValidator]], // Corrige aquí
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });


    window.addEventListener('storage', this.handleStorageChange.bind(this));


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


  autoLogin(email:any, password: any){


    this.authService.login(email, password).subscribe({
      next: (data) => {
        //time
        const loginTime = new Date().getTime();
        localStorage.setItem('loginTime', loginTime.toString());

        localStorage.setItem('loged', JSON.stringify(true));
        this.checkUserSession(); // Verifica inmediatamente después de ha

        //this.authService.storeUser(data.user);
        //this.router.navigate(['/home']);
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

  onSubmit() {
    if (this.userForm.valid) {
      const usuario = this.userForm.value;
      console.log('Formulario enviado', usuario);
  
      this.userService.crearUsuario(usuario).subscribe(
        (respuesta) => {
          console.log('Usuario creado:', respuesta);
  
          // Mostrar Swal con loading
          Swal.fire({
            title: 'Registro Éxitoso',
            text: 'Redirigiendo al home...',
            icon: 'success',
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
  
          setTimeout(() => {
            const credentials = {user: respuesta, status: true};

            this.authService.storeUser(credentials);
            this.autoLogin(this.userForm.value.email, this.userForm.value.password);
            Swal.close(); 
          }, 500);
        },
        (error) => {
          console.error('Error al crear usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al Registrarse',
            text: 'Inténtalo más tarde, o contacta a soporte.'
          });
        }
      );
    } else {
      console.log('Formulario inválido');
      const tipoControl = this.userForm.get('tipo');
      if (tipoControl && tipoControl.hasError('tipoInvalido')) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El tipo debe ser "estudiante" o "profesor".'
        });
      }
    }
  }
  

  tipoValidator(control: AbstractControl): { [key: string]: any } | null {
    const validTipos = ['estudiante', 'profesor'];
    return validTipos.includes(control.value) ? null : { tipoInvalido: true };
  }
}

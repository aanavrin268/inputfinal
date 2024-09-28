import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SessionService } from '../../auth/session.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy{
  isMenuOpen = false;

  public isLogged: any;
  public isLoggedIn: any;


  constructor(private authService: AuthService, private sessionService: SessionService,
      private router: Router
  ) {}
  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));

  }

   ngOnInit(){




    this.checkUserSession();
    window.addEventListener('storage', this.handleStorageChange.bind(this));


    /*
    this.isLogged = this.authService.isAuthenticated();

    if(this.isLogged){
      this.isLoggedIn = this.isLogged;
    }else {
      this.isLoggedIn = this.isLogged;

    }

    */

    /*
    await this.checkAuthStatus(); // Verifica el estado de autenticación al iniciar
    console.log("navbar says Initial value:", this.isLoggedIn);

    if (this.isLoggedIn) {
      this.sessionService.startSessionTimerP(); // Iniciar el temporizador si el usuario está autenticado
    }

    */
  }

  checkUserSession() {
    const stored = localStorage.getItem('loged');
    if (stored) {
      const valor = JSON.parse(stored);
      if (valor === true) {
        localStorage.setItem('userSession', JSON.stringify({ loggedIn: true }));
        //this.router.navigate(['/error404']);
        this.isLoggedIn = true;
      }else {
        this.isLoggedIn = false;

      }
    }
  }


  logoutEnd(){
    localStorage.setItem('userSession', JSON.stringify({ loggedIn: false }));
    localStorage.removeItem('loged'); // Eliminar también el estado de "loged"
    this.router.navigate(['/login']); // Redirige a la página de contacto

    //Emitir el evento de cierre de sesión en el almacenamiento
    window.dispatchEvent(new Event('storage'));
  }

  async checkAuthStatus(): Promise<void> {
    this.isLoggedIn = await this.authService.isAuthenticated2(); // Asegúrate de que este método devuelva una promesa
    console.log("authService says, logged: ", this.isLoggedIn);
  }


  handleStorageChange(event: StorageEvent) {
    if (event.key === 'userSession') {
      const sessionData = JSON.parse(event.newValue || '{}');
      if (sessionData.loggedIn === false) {
        this.router.navigate(['/login']); // Redirigir si se cierra sesión en otra pestaña
      }
    }
  }



  logout(): void {
    this.authService.logout(); // Llama al método de cierre de sesión
    //this.sessionService.logout();
    //this.checkAuthStatus(); // Actualiza el estado
  }




  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}

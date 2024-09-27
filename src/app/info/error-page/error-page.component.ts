import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit, OnDestroy {
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Escuchar cambios en localStorage
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }

  logout() {
    // Actualiza el estado de la sesión en localStorage
    localStorage.setItem('userSession', JSON.stringify({ loggedIn: false }));
    localStorage.removeItem('loged'); // Eliminar también el estado de "loged"
    this.router.navigate(['/contacto']); // Redirige a la página de contacto

    // Emitir el evento de cierre de sesión en el almacenamiento
    window.dispatchEvent(new Event('storage'));
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === 'userSession') {
      const sessionData = JSON.parse(event.newValue || '{}');
      if (sessionData.loggedIn === false) {
        this.router.navigate(['/contacto']); // Redirigir si se cierra sesión en otra pestaña
      }
    }
  }
}

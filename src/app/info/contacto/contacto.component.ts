import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit, OnDestroy {
  contact = {
    name: '',
    email: '',
    message: ''
  };

  color = 'black'; // Color inicial

  constructor(private router: Router) {}

  ngOnInit() {
    // Comprobar el color inicial
    const storedColor = localStorage.getItem('textColor');
    if (storedColor) {
      this.color = storedColor;
    }

    // Comprobar la disponibilidad inicial
    this.checkAvailability();
    this.checkUserSession();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }

  login() {
    localStorage.setItem('loged', JSON.stringify(true));
    this.checkUserSession(); // Verifica inmediatamente después de hacer login
  }

  cambio() {
    this.color = 'red'; // Cambia el color a rojo
    localStorage.setItem('textColor', this.color); // Guardar color en localStorage
    localStorage.setItem('disponible', JSON.stringify(true)); // Guarda 'true' como string
    this.checkAvailability(); // Comprobar disponibilidad al cambiar
  }

  volverColor() {
    this.color = 'black'; // Cambia el color a negro
    localStorage.setItem('textColor', this.color); // Guardar color en localStorage
    localStorage.removeItem('disponible'); // Eliminar disponibilidad
    this.checkAvailability(); // Comprobar disponibilidad al volver
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === 'userSession') {
      const sessionData = JSON.parse(event.newValue || '{}');
      if (sessionData.loggedIn === false) {
        // Cierra la sesión en la pestaña actual
        localStorage.setItem('userSession', JSON.stringify({ loggedIn: false }));
        this.router.navigate(['/login']); // O redirigir a donde necesites
      } else {
        this.router.navigate(['/error404']);
      }
    }
  }

  checkUserSession() {
    const stored = localStorage.getItem('loged');
    if (stored) {
      const valor = JSON.parse(stored);
      if (valor === true) {
        localStorage.setItem('userSession', JSON.stringify({ loggedIn: true }));
        this.router.navigate(['/error404']);
      }
    }
  }

  checkAvailability() {
    const storedValue = localStorage.getItem('disponible');
    if (storedValue) {
      const isAvailable = JSON.parse(storedValue);
      console.log(isAvailable ? "ESTA DISPONIBLE EL USER" : "NO ESTA DISPONIBLE EL USER");
    } else {
      console.log("NO ESTA DISPONIBLE EL USER");
    }
  }
}

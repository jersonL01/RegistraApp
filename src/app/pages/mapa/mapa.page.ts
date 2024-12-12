import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';  // Importa Leaflet
import { Geolocation } from '@capacitor/geolocation'; // Importa Geolocation de Capacitor
import { Platform } from '@ionic/angular'; // Para detectar la plataforma
import { MensajesService } from 'src/app/services/mensaje.service';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  map: any;

  constructor(private platform: Platform,
    private mensajes: MensajesService
  ) {}

  async ngOnInit() {
    // Asegurarse de que la plataforma esté lista antes de cargar el mapa
    await this.platform.ready();
    this.loadMap();
  }

  
  async loadMap() {
    try {
      // Solicita la ubicación actual del usuario
      const position = await Geolocation.getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Inicializa el mapa y establece la vista en la ubicación del usuario
      this.map = L.map('mapId').setView([latitude, longitude], 18);

      // Añade una capa de mapa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Agrega un marcador en la ubicación del usuario
      const marker = L.marker([latitude, longitude]).addTo(this.map)
        .bindPopup('Estás aquí')
        .openPopup();

      // Añadir un círculo con radio de 10 metros alrededor del usuario
      const circle = L.circle([latitude, longitude], {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.3,
        radius: 10 // Radio en metros
      }).addTo(this.map);

    } catch (error) {
      this.mensajes.mensaje('Activa la Ubicación', 'error', 'Error!');
       
    }
  }

}

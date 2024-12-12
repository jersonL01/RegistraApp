import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/usuarios'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.page.html',
  styleUrls: ['./perfiles.page.scss'],
})
export class PerfilesPage implements OnInit {
  usuarios: Usuario[] = []; // Array para almacenar los usuarios

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.firestore.collection<Usuario>('usuarios').valueChanges().subscribe(usuarios => {
      this.usuarios = usuarios;
      console.log('Usuarios obtenidos:', this.usuarios);
    });
  }

}

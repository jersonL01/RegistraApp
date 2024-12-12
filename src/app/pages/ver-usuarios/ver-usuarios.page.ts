import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-usuarios',
  templateUrl: './ver-usuarios.page.html',
  styleUrls: ['./ver-usuarios.page.scss'],
})
export class VerUsuariosPage implements OnInit {

  usuarios: any[]= [];

  constructor( private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit() {
    this.config();
  }

  async config() {
    // Obtener la lista de usuarios
    this.firestore.collection('usuarios').valueChanges().subscribe(aux => {
      this.usuarios = aux;
    });
  }


  editarUser(uid: string){
    this.router.navigate(['/edit-user', uid]);
  }

}

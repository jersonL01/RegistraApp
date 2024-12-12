import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  asistencia = [
    {nombre:'Juan', apellido:'Perez', porcentaje:'70%', imagen:'assets/img/alumno1.jfif' },
    {nombre:'Maria', apellido:'Gomez', porcentaje:'80%', imagen:'assets/img/alumno2.jpg' },
    {nombre:'Carlos', apellido:'Lopez', porcentaje:'90%', imagen:'assets/img/alumno3.jpg' },
    {nombre:'Ana', apellido:'Rodriguez', porcentaje:'100%', imagen:'assets/img/alumno4.png' },
    {nombre:'Pedro', apellido:'Martinez', porcentaje:'70%', imagen:'assets/img/alumno5.jfif' },
    {nombre:'Laura', apellido:'Garcia', porcentaje:'65%', imagen:'assets/img/alumno6.jpg' },
    {nombre:'Jose', apellido:'Fernandez', porcentaje:'20%', imagen:'assets/img/alumno7.jfif' },
    {nombre:'Sofia', apellido:'Diaz', porcentaje:'50%', imagen:'assets/img/alumno8.jpeg' },
      
  ]

  constructor() { }

  ngOnInit() {
  }

}

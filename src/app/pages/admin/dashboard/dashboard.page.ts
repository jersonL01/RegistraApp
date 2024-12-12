import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  
  constructor( private menu: MenuController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
   ) { }

  ngOnInit() {
    this.menu.enable(true);
  }

  
}

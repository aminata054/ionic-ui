import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: string = '';
  user: User | undefined ;
  name: string = '';
  firstname: string = '';
  

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      if (user) {
        this.name = user.name || '';
        this.firstname = user.firstname || '';
      }
    });

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  async signout() {
    const alert = await this.alertCtrl.create({
      header: "Déconnexion",
      message: "Voulez-vous vraiment vous déconnecter ?",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log("Bouton d'annulation cliqué")
          }
        },
        {
          text: 'Se déconnecter',
        handler: async () => {
          this.authService.signOut().then(() => {
            setTimeout(() => {
              this.router.navigateByUrl('/login');
            }, 100); // Add a 100ms delay
          });
        }
      }
      ]
    });
    await alert.present();

  }
}
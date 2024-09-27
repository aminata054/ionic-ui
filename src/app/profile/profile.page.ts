import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { User } from '../models/user'; 
import { AlertController } from '@ionic/angular'; 
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: string = '';
  user: User | undefined;
  name: string = '';
  firstname: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertCtrl: AlertController
  ) {}

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

  // Gère la déconnexion de l'utilisateur avec une alerte de confirmation
  async signout() {
    const alert = await this.alertCtrl.create({
      header: "Déconnexion",
      message: "Voulez-vous vraiment vous déconnecter ?",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log("Bouton d'annulation cliqué");
          }
        },
        {
          text: 'Se déconnecter',
          handler: async () => {
            this.authService.signOut().then(() => {
              this.router.navigateByUrl('/login');
            });
          }
        }
      ]
    });
    await alert.present();
  }
}

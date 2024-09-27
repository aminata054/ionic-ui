import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  userId: string = '';
  user: User | undefined;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user; // Assigne les informations utilisateur récupérées
    });
  }
}

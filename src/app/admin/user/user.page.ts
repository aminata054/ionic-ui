import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  administrators: User[] | undefined;
  clients: User[] | undefined;
  selectedSegment: string = 'client'; 



  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.administrators = users.filter((user) => user.isAdmin);
      this.clients = users.filter((user) => !user.isAdmin);
    });
  }


}

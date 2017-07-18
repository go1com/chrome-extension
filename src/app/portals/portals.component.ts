import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../modules/membership/services/user.service';

@Component({
  selector: 'app-portals',
  templateUrl: './portals.component.html',
  styleUrls: ['./portals.component.css']
})

export class PortalsComponent implements OnInit {
  private portals: Array<any>;
  private activeInstance: string;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      user => {
        if (user.accounts) {
          this.portals = user.accounts.map(
            account => {
              return account.instance;
            }
          );

          this.activeInstance = localStorage.getItem('activeInstance');
        }
      }
    );
  }

  switchPortal(portal: any) {
    this.userService.switchPortal(portal);
    this.router.navigate(['/']);
  }

}

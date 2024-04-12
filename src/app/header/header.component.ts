import { Component, OnDestroy } from '@angular/core';
import { LoginsvService } from '../services/loginsv.service';
import { Router } from '@angular/router';
import { postListModel ,Notification} from '../models/post.modules';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  loggedInUser: string | null = null;
  postId: number;
  notifications: Notification[] = []; // Use the Notification interface here
  postList: postListModel[] = [];
  post: postListModel;
  isAdmin: boolean = false;
  isNotificationDropdownOpen: boolean = false; // Variable to control the dropdown visibility
  private updateSubscription: Subscription | undefined; // Subscription for polling updates

  constructor(
    private loginsvService: LoginsvService,
    private router: Router
  ) {
    this.loggedInUser = this.loginsvService.getLoggedInUser();
    this.postId = 0;
    this.post = new postListModel();

    // Start polling updates
    this.startPolling();
  }

  ngOnDestroy(): void {
    // Unsubscribe from polling updates when the component is destroyed
    this.stopPolling();
  }

  private startPolling(): void {
    // Poll for updates every 5 seconds (adjust as needed)
    this.updateSubscription = interval(5000).subscribe(() => {
      this.getNotifications();
    });
  }

  private stopPolling(): void {
    // Unsubscribe from polling updates
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  getNotifications(): void {
    this.loginsvService.getNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
      });
      this.toggleNotificationDropdown(); 
  }

  logout() {
    this.loginsvService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen; // Toggle the dropdown visibility
  }
}

import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component,OnDestroy,AfterViewInit, OnInit} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification-service/notification.service';


/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  notifications: any;
  unreadCount = 0;
  showDropdown = false;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    public menuItems: MenuItems,
    private notificationService: NotificationService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications: any) => {
        console.log(notifications);
        this.notificationService.addNotificationToBell(notifications);
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter((n) => !n.readStatus).length;
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target || !(event.target as Element).closest('.notification-bell')) {
        this.showDropdown = false;
      }
    });


  setInterval(() => {
    this.notificationService.getNotifications().subscribe({
      next: (notifications: any) => {
        this.notificationService.addRealTimeNotificationToBell(notifications);
      },
      error: (error) => {
        console.log(error);
      }
    });
}, 5000);

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {}

  goToCart(){
    this.router.navigate(['/pages/cart-page']);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead() {
    this.notifications.forEach((notification: any) => {
      if (!notification.read) {
        this.notificationService.markAsRead(notification.id);
      }
    });
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}

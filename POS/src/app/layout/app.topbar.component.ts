import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    menu: MenuItem[] = [];

    @ViewChild('searchinput') searchInput!: ElementRef;

    @ViewChild('menubutton') menuButton!: ElementRef;

    searchActive: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {}

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    activateSearch() {
        this.searchActive = true;
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 100);
    }

    deactivateSearch() {
        this.searchActive = false;
    }

    removeTab(event: MouseEvent, item: MenuItem, index: number) {
        this.layoutService.onTabClose(item, index);
        event.preventDefault();
    }

    get layoutTheme(): string {
        return this.layoutService.config().layoutTheme;
    }

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    get logo(): string {
        const path = 'assets/layout/images/logo-';
        const logo = (this.layoutTheme === 'primaryColor'  && !(this.layoutService.config().theme  == "yellow")) ? 'light.png' : (this.colorScheme === 'light' ? 'dark.png' : 'light.png');
        return path + logo;
    }

    get tabs(): MenuItem[] {
        return this.layoutService.tabs;
    }

    onSignOut(): void {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}

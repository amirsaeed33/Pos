import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { UserDto } from 'src/app/demo/api/user-management';
import { UserService } from 'src/app/demo/service/user.service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './profilelist.component.html',
    providers: [MessageService]
})
export class ProfileListComponent implements OnInit {

    users: UserDto[] = [];
    loading = false;
    totalRecords = 0;

    constructor(
        private userService: UserService,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        this.userService.getAll({
            skipCount: 0,
            maxResultCount: 1000
        })
            .then((result) => {
                this.users = result.items;
                this.totalRecords = result.totalCount;
                this.loading = false;
            })
            .catch((error) => {
                this.loading = false;
                const errorMessage = error?.message || 'Failed to load users. Please try again.';
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: errorMessage 
                });
            });
    }

    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    navigateToCreateUser() {
        this.router.navigate(['profile/create']);
    }

    onEditUser(user: UserDto) {
        this.router.navigate(['profile/edit', user.id]);
    }

    onDeleteUser(user: UserDto) {
        if (confirm(`Are you sure you want to delete user ${user.userName}?`)) {
            this.userService.delete(user.id)
                .then(() => {
                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'User deleted successfully' 
                    });
                    this.loadUsers();
                })
                .catch((error) => {
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Failed to delete user' 
                    });
                });
        }
    }

    onToggleActive(user: UserDto) {
        const action = user.isActive ? this.userService.deactivate(user.id) : this.userService.activate(user.id);
        action
            .then(() => {
                user.isActive = !user.isActive;
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` 
                });
            })
            .catch((error) => {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to update user status' 
                });
            });
    }

    getRoleNames(user: UserDto): string {
        if (user.roleNames && user.roleNames.length > 0) {
            return user.roleNames.join(', ');
        }
        return 'No roles';
    }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/demo/service/user.service';
import { RoleDto } from 'src/app/demo/api/user-management';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './profilecreate.component.html',
    providers: [MessageService]
})
export class ProfileCreateComponent implements OnInit { 

    userForm: FormGroup;
    roles: RoleDto[] = [];
    loading = false;
    selectedRoles: string[] = [];

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.userForm = this.fb.group({
            userName: ['', [Validators.required]],
            name: ['', [Validators.required]],
            surname: ['', [Validators.required]],
            emailAddress: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            isActive: [true],
            roleNames: [[]]
        });
    }

    ngOnInit() {
        this.loadRoles();
    }

    loadRoles() {
        this.userService.getRoles()
            .then((roles) => {
                this.roles = roles;
            })
            .catch((error) => {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to load roles' 
                });
            });
    }

    onSubmit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const formValue = this.userForm.value;
        formValue.roleNames = this.selectedRoles;

        this.userService.create(formValue)
            .then(() => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'User created successfully' 
                });
                this.router.navigate(['profile/list']);
            })
            .catch((error) => {
                this.loading = false;
                const errorMessage = error?.error?.error?.message || error?.message || 'Failed to create user';
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: errorMessage 
                });
            });
    }

    onCancel() {
        this.router.navigate(['profile/list']);
    }
    
}
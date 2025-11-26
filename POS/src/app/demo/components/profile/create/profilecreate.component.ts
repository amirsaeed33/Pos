import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/demo/service/user.service';
import { RoleDto, UserDto } from 'src/app/demo/api/user-management';
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
    isEditMode = false;
    userId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {
        this.userForm = this.fb.group({
            userName: ['', [Validators.required]],
            name: ['', [Validators.required]],
            surname: ['', [Validators.required]],
            emailAddress: ['', [Validators.required, Validators.email]],
            password: [''],
            isActive: [true],
            roleNames: [[]]
        });
    }

    ngOnInit() {
        this.loadRoles();
        
        // Check if we're in edit mode
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.userId = +params['id'];
                this.loadUser(this.userId);
            } else {
                // In create mode, password is required
                this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
                this.userForm.get('password')?.updateValueAndValidity();
            }
        });
    }

    loadUser(id: number) {
        this.loading = true;
        this.userService.get(id)
            .then((user) => {
                this.userForm.patchValue({
                    userName: user.userName,
                    name: user.name,
                    surname: user.surname,
                    emailAddress: user.emailAddress,
                    isActive: user.isActive,
                    roleNames: user.roleNames || []
                });
                this.selectedRoles = user.roleNames || [];
                this.loading = false;
            })
            .catch((error) => {
                this.loading = false;
                const errorMessage = error?.message || 'Failed to load user';
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: errorMessage 
                });
                this.router.navigate(['profile/list']);
            });
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

        if (this.isEditMode && this.userId) {
            // Update existing user
            formValue.id = this.userId;
            // Remove password if not provided in edit mode
            if (!formValue.password || formValue.password.trim() === '') {
                delete formValue.password;
            }
            
            this.userService.update(formValue)
                .then(() => {
                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'User updated successfully' 
                    });
                    this.router.navigate(['profile/list']);
                })
                .catch((error) => {
                    this.loading = false;
                    const errorMessage = error?.message || 'Failed to update user';
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: errorMessage 
                    });
                });
        } else {
            // Create new user
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
                    const errorMessage = error?.message || 'Failed to create user';
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: errorMessage 
                    });
                });
        }
    }

    onCancel() {
        this.router.navigate(['profile/list']);
    }
    
}
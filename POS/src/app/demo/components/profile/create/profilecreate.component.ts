import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/demo/service/user.service';
import { FileUploadService } from 'src/app/demo/service/file-upload.service';
import { RoleDto, UserDto } from 'src/app/demo/api/user-management';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

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
    profilePictureUrl: string | null = null;
    profilePictureFile: File | null = null;
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private fileUploadService: FileUploadService,
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
            roleNames: [[]],
            profilePictureUrl: ['']
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
        // First ensure roles are loaded, then load user
        this.userService.getRoles()
            .then((roles) => {
                this.roles = roles;
                // Now load the user
                return this.userService.get(id);
            })
            .then((user) => {
                this.userForm.patchValue({
                    userName: user.userName,
                    name: user.name,
                    surname: user.surname,
                    emailAddress: user.emailAddress,
                    isActive: user.isActive,
                    roleNames: user.roleNames || [],
                    profilePictureUrl: user.profilePictureUrl || ''
                });
                
                // Set profile picture URL for display (construct full URL if relative path)
                if (user.profilePictureUrl) {
                    // If it's already a full URL, use it; otherwise construct from base URL
                    if (user.profilePictureUrl.startsWith('http://') || user.profilePictureUrl.startsWith('https://')) {
                        this.profilePictureUrl = user.profilePictureUrl;
                    } else {
                        // It's a relative path, construct full URL
                        this.profilePictureUrl = `${environment.apiUrl}${user.profilePictureUrl.startsWith('/') ? '' : '/'}${user.profilePictureUrl}`;
                    }
                } else {
                    this.profilePictureUrl = null;
                }
                
                // Map roleNames to match the role options
                // Backend returns normalized role names (e.g., "ADMIN"), but we need regular names for multiSelect
                if (user.roleNames && Array.isArray(user.roleNames) && user.roleNames.length > 0 && this.roles.length > 0) {
                    this.selectedRoles = user.roleNames
                        .map((roleName: string) => {
                            if (!roleName) return null;
                            // Try to find role by normalized name first, then by regular name
                            const role = this.roles.find(r => 
                                (r.normalizedName && r.normalizedName.toLowerCase() === roleName.toLowerCase()) ||
                                (r.name && r.name.toLowerCase() === roleName.toLowerCase())
                            );
                            // Return the role name (not normalized) for multiSelect
                            return role ? role.name : null;
                        })
                        .filter((r: string | null) => r !== null && r !== undefined) as string[];
                } else {
                    this.selectedRoles = [];
                }
                
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
        
        // Handle profile picture - if a new file is selected, upload it first
        if (this.profilePictureFile) {
            this.fileUploadService.uploadProfilePicture(this.profilePictureFile)
                .then((url: string) => {
                    formValue.profilePictureUrl = url;
                    this.submitForm(formValue);
                })
                .catch((error) => {
                    this.loading = false;
                    const errorMessage = error?.message || 'Failed to upload profile picture';
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: errorMessage
                    });
                });
        } else {
            // If no new file, keep existing profilePictureUrl (extract relative path if full URL)
            if (this.profilePictureUrl) {
                // If it's a full URL, extract the relative path
                if (this.profilePictureUrl.startsWith(environment.apiUrl)) {
                    formValue.profilePictureUrl = this.profilePictureUrl.replace(environment.apiUrl, '');
                } else {
                    formValue.profilePictureUrl = this.profilePictureUrl;
                }
            } else {
                formValue.profilePictureUrl = null;
            }
            this.submitForm(formValue);
        }
    }

    private submitForm(formValue: any): void {
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

    onProfilePictureClick(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelect(event: any): void {
        const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
        if (file) {
            // Validate file type
            if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Invalid File', 
                    detail: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' 
                });
                // Reset file input
                if (this.fileInput) {
                    this.fileInput.nativeElement.value = '';
                }
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'File Too Large', 
                    detail: 'Profile picture must be less than 5MB' 
                });
                // Reset file input
                if (this.fileInput) {
                    this.fileInput.nativeElement.value = '';
                }
                return;
            }
            
            this.profilePictureFile = file;
            
            // Preview the image
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.profilePictureUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onFileRemove(): void {
        this.profilePictureFile = null;
        this.profilePictureUrl = null;
        this.userForm.patchValue({ profilePictureUrl: '' });
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        if (img) {
            img.src = 'assets/layout/images/avatar.png';
        }
    }


    onCancel() {
        this.router.navigate(['profile/list']);
    }
    
}
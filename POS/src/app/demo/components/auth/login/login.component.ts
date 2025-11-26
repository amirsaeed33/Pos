import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
	templateUrl: './login.component.html',
	providers: [MessageService]
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	loading = false;

	constructor(
		private layoutService: LayoutService,
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private messageService: MessageService
	) {
		this.loginForm = this.fb.group({
			userNameOrEmailAddress: ['', [Validators.required]],
			password: ['', [Validators.required]],
			rememberClient: [false]
		});
	}

	ngOnInit(): void {
		// If already authenticated, redirect to dashboard
		if (this.authService.isAuthenticated()) {
			this.router.navigate(['/']);
		}
	}

	get filledInput(): boolean {
		return this.layoutService.config().inputStyle === 'filled';
	}

	onSubmit(): void {
		if (this.loginForm.invalid) {
			this.loginForm.markAllAsTouched();
			return;
		}

		this.loading = true;
		const model = this.loginForm.value;

		this.authService.authenticate(model)
			.then(() => {
				this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful' });
				this.router.navigate(['/']);
			})
			.catch((error) => {
				this.loading = false;
				const errorMessage = error?.error?.error?.message || error?.message || 'Login failed. Please check your credentials.';
				this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
			});
	}
}

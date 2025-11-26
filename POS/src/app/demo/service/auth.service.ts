import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticateModel, AuthenticateResultModel } from '../api/auth';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/TokenAuth`;

    constructor(private http: HttpClient) { }

    authenticate(model: AuthenticateModel): Promise<AuthenticateResultModel> {
        return this.http.post<any>(`${this.apiUrl}/Authenticate`, model)
            .toPromise()
            .then((res: any) => {
                if (!res) {
                    throw new Error('No response from server');
                }
                
                // ABP Framework wraps responses in a result property
                // Check if this is an error response from ABP Framework
                if (res.error || !res.success) {
                    const errorMessage = res.error?.message || 
                                       res.error?.details || 
                                       'Authentication failed';
                    throw new Error(errorMessage);
                }
                
                // Extract the actual data from the result property (ABP Framework wrapper)
                const result = res.result || res;
                
                // Handle both camelCase and PascalCase property names
                const accessToken = result.accessToken || result.AccessToken;
                const encryptedAccessToken = result.encryptedAccessToken || result.EncryptedAccessToken;
                const userId = result.userId !== undefined ? result.userId : result.UserId;
                const expireInSeconds = result.expireInSeconds !== undefined ? result.expireInSeconds : result.ExpireInSeconds;
                
                if (!accessToken) {
                    throw new Error('Invalid response: access token not found. Please check your credentials.');
                }
                
                // Store token in localStorage
                localStorage.setItem('accessToken', accessToken);
                if (encryptedAccessToken) {
                    localStorage.setItem('encryptedAccessToken', encryptedAccessToken);
                }
                if (userId != null && userId !== undefined) {
                    localStorage.setItem('userId', userId.toString());
                }
                if (expireInSeconds != null && expireInSeconds !== undefined) {
                    localStorage.setItem('expireInSeconds', expireInSeconds.toString());
                }
                
                return {
                    accessToken: accessToken,
                    encryptedAccessToken: encryptedAccessToken || '',
                    expireInSeconds: expireInSeconds || 0,
                    userId: userId || 0
                } as AuthenticateResultModel;
            })
            .catch((error: any) => {
                // Handle HTTP errors - ABP Framework error structure
                if (error?.error) {
                    const abpError = error.error;
                    // ABP error structure: { error: { message: "...", details: "..." } }
                    const errorMessage = abpError.error?.message || 
                                       abpError.message || 
                                       abpError.details ||
                                       error.message || 
                                       'Login failed. Please check your credentials.';
                    throw new Error(errorMessage);
                }
                
                // If it's already an Error object, rethrow it
                if (error instanceof Error) {
                    throw error;
                }
                
                throw new Error(error?.message || 'Login failed. Please check your credentials.');
            }) as Promise<AuthenticateResultModel>;
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('encryptedAccessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('expireInSeconds');
        localStorage.removeItem('userInfo');
    }

    setUserInfo(userInfo: any): void {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    getUserInfo(): any {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }
}


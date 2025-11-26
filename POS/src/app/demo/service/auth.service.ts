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
                    console.error('No response from server');
                    throw new Error('No response from server');
                }
                
                // Log the full response for debugging
                console.log('Full auth response:', JSON.stringify(res, null, 2));
                console.log('Response keys:', Object.keys(res));
                
                // Check if this is an error response from ABP Framework
                if (res.error) {
                    const errorMessage = res.error.message || res.error.details || 'Authentication failed';
                    console.error('ABP Error response:', res.error);
                    throw new Error(errorMessage);
                }
                
                // Handle both camelCase and PascalCase property names from backend
                // ABP Framework typically uses PascalCase in JSON responses
                // Try all possible property name variations
                const accessToken = res.accessToken || 
                                  res.AccessToken || 
                                  res.access_token || 
                                  res.access_token;
                
                const encryptedAccessToken = res.encryptedAccessToken || 
                                           res.EncryptedAccessToken || 
                                           res.encrypted_access_token;
                
                const userId = res.userId !== undefined ? res.userId : 
                              res.UserId !== undefined ? res.UserId : 
                              res.user_id;
                
                const expireInSeconds = res.expireInSeconds !== undefined ? res.expireInSeconds : 
                                      res.ExpireInSeconds !== undefined ? res.ExpireInSeconds : 
                                      res.expire_in_seconds;
                
                if (!accessToken) {
                    console.error('Response structure:', JSON.stringify(res, null, 2));
                    console.error('Available properties:', Object.keys(res));
                    
                    // Check for common error patterns
                    if (res.message) {
                        throw new Error(res.message);
                    }
                    if (res.error?.message) {
                        throw new Error(res.error.message);
                    }
                    
                    throw new Error('Invalid response: access token not found. Please check your credentials and ensure the backend is running.');
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
                console.error('Authentication error:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                
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
    }
}


import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) { }

  async register(credentials: any) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      return user;
    } catch (e) {
      return null;
    }
  }

  async login(credentials: any) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      return user;
    } catch (e) {
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }

}

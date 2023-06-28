import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  hide = true;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  constructor(private fb: FormBuilder,private loadingController: LoadingController,private alertController: AlertController,private authService: AuthService,private router: Router) {

   }

  ngOnInit() {
    
  }

  async login(){
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create();
      await loading.present();
  
      const user = await this.authService.login(this.loginForm.value);
      await loading.dismiss();
  
      if (user) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        this.showAlert('Contraseña o email incorrectos!', 'Intenta de nuevo!');
      }
    }
  }

  async showAlert(header: any, message: any) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}

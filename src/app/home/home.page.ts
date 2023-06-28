import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { estudiante } from './estudiante';
import { EstudiantesService } from '../services/estudiantes.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from './create/create.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  estudiantes: estudiante[] = [];

  constructor(private authService: AuthService,
    private estudianteService: EstudiantesService,
    private loadingController: LoadingController,
    public dialog: MatDialog,
    private alertController: AlertController,
    private router: Router) {

  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  ngOnInit(): void {
    this.getTodosEstudiantes();
  }

  async getTodosEstudiantes() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.estudianteService.getEstudiantes().subscribe({
      next: async result => {
        this.estudiantes = result;
        await loading.dismiss();
      },
      error: async e => {
        console.log(e);
        await loading.dismiss();
      }
    })
  }

  createStudent() {
    const newProduct = this.dialog.open(CreateComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: '50%',
      minWidth: '300px'
    });
    newProduct.afterClosed().subscribe(response => {
      if (response) this.getTodosEstudiantes();
    })
  }

  updateStudent(estudent: estudiante) {
    const newProduct = this.dialog.open(CreateComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: '50%',
      minWidth: '300px',
      data: estudent
    });
    newProduct.afterClosed().subscribe(response => {
      if (response) this.getTodosEstudiantes();
    })
  }

  async deleteStudent(id:any){
    const loading = await this.loadingController.create();
    await loading.present();
    this.estudianteService.deleteStudent(id).then(
      async () => {
        this.showAlert('Estudiante eliminado', 'Exitosamente!!');
        await loading.dismiss();
        this.getTodosEstudiantes();
      }
    ).catch(async e => { await loading.dismiss(); console.log(e); this.showAlert('Hubo un error', 'Fracaso!!'); });
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

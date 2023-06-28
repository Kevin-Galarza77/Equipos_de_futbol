import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { estudiante } from '../estudiante';
import { AlertController, LoadingController } from '@ionic/angular';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

  section: boolean = true;

  user: estudiante = {
    nombres: '',
    apellidos: '',
    notas: {
      nota_1: 0,
      nota_2: 0,
      nota_3: 0,
      nota_4: 0,
      nota_5: 0,
      total: 0,
    }
  }

  id: string = '';

  constructor(private estudianteService: EstudiantesService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public dialogref: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.user = data;
      this.section = false;
      this.id = data.id;
    }
  }

  ngOnInit() { }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.section) {
        const loading = await this.loadingController.create();
        await loading.present();
        this.user.notas.total = (this.user.notas.nota_1 * 0.20 + this.user.notas.nota_2 * 0.20 + this.user.notas.nota_3 * 0.20 + this.user.notas.nota_4 * 0.10 + this.user.notas.nota_5 * 0.30);
        this.dialogref.close(true);
        this.estudianteService.createEstudiante(this.user).then(
          async () => {
            this.showAlert('Estudiante creado', 'Exitosamente!!');
            await loading.dismiss();
          }
        ).catch(async e => { await loading.dismiss(); console.log(e); this.showAlert('Hubo un error', 'Fracaso!!'); });
      } else {
        const loading = await this.loadingController.create();
        await loading.present();
        this.user.notas.total = (this.user.notas.nota_1 * 0.20 + this.user.notas.nota_2 * 0.20 + this.user.notas.nota_3 * 0.20 + this.user.notas.nota_4 * 0.10 + this.user.notas.nota_5 * 0.30);
        this.dialogref.close(true);
        this.estudianteService.updateEstudiante(this.id, this.user).then(
          async () => {
            this.showAlert('Estudiante actualizado', 'Exitosamente!!');
            await loading.dismiss();
          }
        ).catch(async e => { await loading.dismiss(); console.log(e); this.showAlert('Hubo un error', 'Fracaso!!'); });
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

import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { estudiante, soccerTeam } from '../soccerTeam';
import { AlertController, LoadingController } from '@ionic/angular';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SoccerTeamService } from 'src/app/services/soccer-team.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

  section: boolean = true;

  soccerTeam: soccerTeam = {
    id: '',
    name: '',
    country: '',
    year_fundation: '',
    name_stadium: '',
    tittles: 0,
    shieldTeam: ''
  }

  id: string = '';

  constructor(private soccerTeamService:SoccerTeamService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public dialogref: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.soccerTeam = data;
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
        this.dialogref.close(true);
        this.soccerTeamService.createSoccerTeam(this.soccerTeam).then(
          async () => {
            this.showAlert('Exito!!', 'El equipo de futbol a sido registrado.');
            await loading.dismiss();
          }
        ).catch(async e => { await loading.dismiss(); console.log(e); this.showAlert('Error', 'Se ha producido un error') });
      } else {
        const loading = await this.loadingController.create();
        this.dialogref.close(true);
        this.soccerTeamService.updateSoccerTeam(this.id, this.soccerTeam).then(
          async () => {
            await loading.present();
            this.showAlert('Exito!!', 'El equipo de futbol a sido actulizado.');
            await loading.dismiss();
          }
        ).catch(async e => { await loading.dismiss(); console.log(e); this.showAlert('Error', 'Se ha producido un error') });
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { soccerTeam } from './soccerTeam';
import { AlertController, LoadingController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from './create/create.component';
import { SoccerTeamService } from '../services/soccer-team.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  soccerTeams: soccerTeam[] = [];

  constructor(private authService: AuthService,
    private soccerTeamService: SoccerTeamService,
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
    this.getAllSoccerTeams();
  }

  async getAllSoccerTeams() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.soccerTeamService.getSoccerTeams().subscribe({
      next: async result => {
        this.soccerTeams = result;
        await loading.dismiss();
      },
      error: async e => {
        console.log(e);
        await loading.dismiss();
      }
    })
  }

  createSoccerTeam() {
    const SoccerTeam = this.dialog.open(CreateComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: '50%',
      minWidth: '300px'
    });
    SoccerTeam.afterClosed().subscribe(response => {
      if (response) this.getAllSoccerTeams();
    })
  }

  updateSoccerTeam(soccerTeam: soccerTeam) {
    const SoccerTeam = this.dialog.open(CreateComponent, {
      height: 'auto',
      maxHeight: '95vh',
      width: '50%',
      minWidth: '300px',
      data: soccerTeam
    });
    SoccerTeam.afterClosed().subscribe(response => {
      if (response) this.getAllSoccerTeams();
    })
  }

  async deleteSoccerTeam(id: any) {

    const confirmed = await this.showConfirmation('Alerta', '¿Estás seguro de eliminar este Equipo de Fútbol?');

    if (confirmed) {
      const loading = await this.loadingController.create();
      await loading.present();
      this.soccerTeamService.deleteSoccerTeam(id).then(
        async () => {
          this.showAlert('Exito!!', 'El equipo de futbol a sido eliminado.');
          await loading.dismiss();
          this.getAllSoccerTeams();
        }
      ).catch(async e => { await loading.dismiss(); console.log(e); this.showAlert('Hubo un error', 'Fracaso!!'); });
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

  async showConfirmation(header: any, message: any): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false); // Resuelve la promesa con valor false (cancelado)
            }
          },
          {
            text: 'Aceptar',
            handler: () => {
              resolve(true); // Resuelve la promesa con valor true (aceptado)
            }
          }
        ]
      });

      await alert.present();
    });
  }


}

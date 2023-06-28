import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { soccerTeam } from '../soccerTeam';
import { AlertController, LoadingController } from '@ionic/angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SoccerTeamService } from 'src/app/services/soccer-team.service';
import { getDownloadURL, ref, Storage, uploadBytes, uploadString } from '@angular/fire/storage';
import { doc, setDoc } from '@angular/fire/firestore';

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
  file!: File;

  constructor(private soccerTeamService: SoccerTeamService,
    private alertController: AlertController,
    private storage: Storage,
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
          async (result) => {
            await loading.dismiss();
            await this.uploadImage(this.file, result.id);
            this.showAlert('Exito!!', 'El equipo de futbol a sido registrado.');
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

  onFileSelected(event: any) {
    this.file = event;
  }

  async sendImage(file: any, id: any) {
    await this.uploadImage(file, id);
  }

  async uploadImage(file: File, id: any) {
    console.log(file);
    const path = `images/${id}/team.webp`;
    const storageRef = ref(this.storage, path);

    try {
      const base64String = await this.readFileAsBase64(file);
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      await uploadBytes(storageRef, byteArray);
      const imageUrl = await getDownloadURL(storageRef);
      console.log('subido!!');
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const encodedString = base64String.replace(/^data:(.*,)?/, '');
        resolve(encodedString);
      };
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo.'));
      };
      reader.readAsDataURL(file);
    });
  }



}

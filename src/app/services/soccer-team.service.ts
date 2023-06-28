import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { soccerTeam } from '../home/soccerTeam';

@Injectable({
  providedIn: 'root'
})
export class SoccerTeamService {

  item$!: Observable<any[]>;
  collection_name: string = 'soccer_team';

  constructor(private firestore: Firestore) {
    this.updateData();
  }

  updateData() {
    const document = collection(this.firestore, this.collection_name);
    this.item$ = collectionData(document, { idField: 'id' });
  }

  getSoccerTeams() {
    this.updateData();
    return this.item$;
  }

  createSoccerTeam(soccer_team: soccerTeam) {
    const document: any = collection(this.firestore, this.collection_name);
    return setDoc(doc(document), soccer_team);
  }

  updateSoccerTeam(soccer_team_id: string, soccer_team: any): Promise<void> {
    const document = doc(this.firestore, this.collection_name, soccer_team_id);
    return updateDoc(document, soccer_team);
  }

  deleteSoccerTeam(soccer_team_id: string) {
    const estudianteDoc = doc(this.firestore, this.collection_name, soccer_team_id);
    return deleteDoc(estudianteDoc);
  }


}

import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { estudiante } from '../home/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  item$: Observable<any[]>;

  constructor(private firestore: Firestore) {
    const estudianteCollection = collection(this.firestore, 'estudiantes'); // Obtener la referencia a la colección "cars"
    this.item$ = collectionData(estudianteCollection, { idField: 'id' }); // Obtener un Observable de los documentos con el campo "id" incluido
  }

  getEstudiantes() {
    return this.item$;
  }

  createEstudiante(estudiante: estudiante): Promise<void> {
    const estudianteCollection: any = collection(this.firestore, 'estudiantes');
    return setDoc(doc(estudianteCollection), estudiante);
  }

  updateEstudiante(estudiante_id: string, estudiante: any): Promise<void> {
    const estudianteDoc = doc(this.firestore, 'estudiantes', estudiante_id);
    return updateDoc(estudianteDoc, estudiante);
  }

  deleteStudent(id: string): Promise<void> {
    const estudianteDoc = doc(this.firestore, 'estudiantes', id);
    return deleteDoc(estudianteDoc);
  }

}

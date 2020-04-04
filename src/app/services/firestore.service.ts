import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Enheter } from '../models/result';
import { Store } from '../models/store';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) {

   }

   saveStore(store: Store)
   {
     console.log('save store')
     console.log(store)
    return this.firestore.collection(environment.firestoreStorePath).doc(store.organisasjonsnummer).set(store);
   }
   getRegisteredStores() {
    return this.firestore.collection(environment.firestoreStorePath).snapshotChanges();

  }
  getById(id:string)
  {
    return this.firestore.collection(environment.firestoreStorePath).doc(id).ref.get();
    
  }

}

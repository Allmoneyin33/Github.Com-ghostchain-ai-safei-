import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/errors';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';

export interface SquadMember {
  agentId: string;
  role: string;
  position: { x: number; y: number };
  status: 'active' | 'standby' | 'deploying';
}

export interface Squad {
  id?: string;
  name: string;
  objective: string;
  members: SquadMember[];
  formation: 'phalanx' | 'swarm' | 'wedge';
  isDeployed: boolean;
  createdAt: any;
}

export const squadService = {
  async createSquad(squad: OmetricSquad) {
    const path = 'squads';
    try {
      return await addDoc(collection(db, path), {
        ...squad,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  async deploySquad(squadId: string) {
    const path = 'squads';
    try {
      const squadRef = doc(db, path, squadId);
      return await updateDoc(squadRef, {
        isDeployed: true,
        'members.status': 'active'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  subscribeToSquads(callback: (squads: Squad[]) => void) {
    const path = 'squads';
    const q = query(collection(db, path));
    return onSnapshot(q, 
      (snapshot) => {
        const squads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Squad));
        callback(squads);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
      }
    );
  }
};

type OmetricSquad = Omit<Squad, 'id' | 'createdAt'>;

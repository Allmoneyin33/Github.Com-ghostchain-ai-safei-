import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/errors';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

export interface KnowledgeDoc {
  docId?: string;
  fileName: string;
  source: 'email' | 'drive' | 'local' | 'download';
  status: 'pending' | 'indexing' | 'cached';
  size?: number;
  createdAt: any;
}

export const knowledgeService = {
  async registerDocument(doc: Omit<KnowledgeDoc, 'docId' | 'createdAt'>) {
    const path = 'knowledge_base';
    try {
      return await addDoc(collection(db, path), {
        ...doc,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  subscribeToKnowledge(callback: (docs: KnowledgeDoc[]) => void) {
    const path = 'knowledge_base';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ 
          docId: doc.id, 
          ...doc.data() 
        } as KnowledgeDoc));
        callback(docs);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
      }
    );
  }
};

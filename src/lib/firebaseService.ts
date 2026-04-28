import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError } from './firebase';
import { Violation } from '../types';

// Asset Service
export const AssetService = {
  async uploadAsset(assetData: { name: string; type: string; size: string }) {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    const path = 'assets';
    try {
      const docRef = await addDoc(collection(db, path), {
        name: assetData.name,
        type: assetData.type,
        status: 'Processing',
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', path);
    }
  },

  async getMyAssets() {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const path = 'assets';
    try {
      const q = query(
        collection(db, path), 
        where('ownerId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      // Client-side sort to avoid requiring a composite index
      return docs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
    } catch (error) {
      handleFirestoreError(error, 'list', path);
    }
  }
};

// Violation Service
export const ViolationService = {
  async getViolations() {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const path = 'violations';
    try {
      const q = query(
        collection(db, path), 
        where('ownerId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() as any
      }));
      
      // Client-side sort
      docs.sort((a, b) => {
        const timeA = a.detectedOn?.toMillis ? a.detectedOn.toMillis() : 0;
        const timeB = b.detectedOn?.toMillis ? b.detectedOn.toMillis() : 0;
        return timeB - timeA;
      });

      return docs.map(doc => ({
        ...doc,
        detectedOn: doc.detectedOn?.toDate ? doc.detectedOn.toDate().toLocaleDateString() : 'Unknown'
      })) as unknown as Violation[];
    } catch (error) {
      handleFirestoreError(error, 'list', path);
    }
  },

  async updateViolationStatus(violationId: string, status: string) {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const path = `violations/${violationId}`;
    try {
      const docRef = doc(db, 'violations', violationId);
      await updateDoc(docRef, { status });
    } catch (error) {
      handleFirestoreError(error, 'update', path);
    }
  }
};

// Legal Notice Service
export const LegalNoticeService = {
  async createNotice(noticeData: any) {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const path = 'legal_notices';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...noticeData,
        status: 'Draft',
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', path);
    }
  }
};

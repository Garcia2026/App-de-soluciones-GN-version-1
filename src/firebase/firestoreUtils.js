import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    serverTimestamp, 
    collection, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    limit 
  } from 'firebase/firestore';
  import { getFirebaseDb } from '../firebase.js';
  
  // Guardar datos financieros diarios
  export const saveFinancialData = async (financialData) => {
    try {
      const db = await getFirebaseDb();
      if (!db) throw new Error('Firebase no está disponible');
      
      // Crear un documento con la fecha actual como ID
      const today = new Date().toISOString().split('T')[0];
      const docRef = doc(db, 'financial_records', 'default_user', 'daily_records', today);
  
      // Guardar o actualizar datos
      await setDoc(docRef, {
        ...financialData,
        createdAt: serverTimestamp(),
        userId: 'default_user'
      }, { merge: true });
  
      console.log('Datos guardados exitosamente');
      return true;
    } catch (error) {
      console.error('Error al guardar datos:', error);
      return false;
    }
  };
  
  // Obtener datos financieros de un día específico
  export const getDailyFinancialData = async (date) => {
    try {
      const db = await getFirebaseDb();
      if (!db) throw new Error('Firebase no está disponible');
      
      const docRef = doc(db, 'financial_records', 'default_user', 'daily_records', date);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No se encontraron datos para esta fecha');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return null;
    }
  };
  
  // Obtener historial de registros financieros
  export const getFinancialHistory = async (limitNum = 30) => {
    try {
      const db = await getFirebaseDb();
      if (!db) throw new Error('Firebase no está disponible');
      
      const recordsRef = collection(db, 'financial_records', 'default_user', 'daily_records');
      const q = query(
        recordsRef, 
        orderBy('createdAt', 'desc'), 
        limit(limitNum)
      );
  
      const querySnapshot = await getDocs(q);
      const records = [];
  
      querySnapshot.forEach((doc) => {
        records.push({
          id: doc.id,
          ...doc.data()
        });
      });
  
      return records;
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  };
  
  // Actualizar un registro existente
  export const updateFinancialRecord = async (date, updatedData) => {
    try {
      const db = await getFirebaseDb();
      if (!db) throw new Error('Firebase no está disponible');
      
      const docRef = doc(db, 'financial_records', 'default_user', 'daily_records', date);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
  
      console.log('Registro actualizado exitosamente');
      return true;
    } catch (error) {
      console.error('Error al actualizar registro:', error);
      return false;
    }
  };
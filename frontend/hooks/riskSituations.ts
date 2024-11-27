import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { RiskSituation } from '@/constants/Risk/types';

export const useRiskSituations = () => {
  const [riskSituations, setRiskSituations] = useState<RiskSituation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'riskSituations'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const situations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as RiskSituation[];
        setRiskSituations(situations);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching risk situations: ", err);
        setError("Error al cargar las situaciones de riesgo");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { riskSituations, isLoading, error };
};
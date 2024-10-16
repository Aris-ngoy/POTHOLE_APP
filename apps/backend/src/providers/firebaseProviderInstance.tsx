'use client';

import React from 'react'
import { getAuth } from 'firebase/auth'; 
import { getDatabase } from 'firebase/database';
import { AuthProvider, DatabaseProvider, useFirebaseApp } from 'reactfire';

export default function FirebaseProviderInstance({ children } : { children: React.ReactNode}) {

  const app = useFirebaseApp(); 
  const database = getDatabase(app);
  const auth = getAuth(app);

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        {children}
      </DatabaseProvider>
    </AuthProvider>
  )
}

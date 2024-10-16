'use client';
import { firebaseConfig } from '@/lib/utils';
import React from 'react'
import { FirebaseAppProvider } from 'reactfire';

export default function FirebaseProviders({ children } : { children: React.ReactNode}) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        {children}
    </FirebaseAppProvider>
  )
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const firebaseConfig = {
  apiKey: "AIzaSyB9W3M8tTU1NFi_YJsZnokXn2HZMW4O3yU",
  authDomain: "potholes-e2266.firebaseapp.com",
  databaseURL: "https://potholes-e2266-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "potholes-e2266",
  storageBucket: "potholes-e2266.appspot.com",
  messagingSenderId: "561237591168",
  appId: "1:561237591168:web:25939ca6e6c588387d5265",
  measurementId: "G-SF1LH9944W"
};
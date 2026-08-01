import { createContext, useContext } from "react";
import { useLocations } from "../hooks/useLocations"; // Hook GPS yang sudah canggih

const LocationContext = createContext();

export function LocationProvider({ children }) {
  // Menjalankan mesin GPS di tingkat teratas
  const locationState = useLocations();

  return (
    <LocationContext.Provider value={locationState}>
      {children}
    </LocationContext.Provider>
  );
}

// Fungsi ini yang akan dipanggil oleh halaman-halaman Anda
export function useGlobalLocation() {
  return useContext(LocationContext);
}

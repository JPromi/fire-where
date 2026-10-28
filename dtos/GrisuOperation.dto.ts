export type GrisuOperation = {
  EinsatzID: string | null;
  Status: number | null;
  Alarmstufe: string | null;
  Meldebild: string | null;
  Lat: number | null;
  Lng: number | null;
  Accuracy: string | null;
  Nummer1: string | null;
  Nummer2: string | null;
  Nummer3: string | null;
  Plz: string | null;
  Strasse: string | null;
  Ort: string | null;
  Abschnitt: string | null;
  Objekt: string | null;
  ObjektId: string | null;
  Bemerkung: string | null;
  EinsatzErzeugt: string | null;
  Melder: string | null;
  MelderTelefon: string | null;
  EinsatzNummer: string | null;
  Dispositionen: {
    Name: string | null;
    EldisId: number | null;
    IsEigenalarmiert: boolean | null;
    DispoTime: string | null;
    AlarmTime: string | null;
    AusTime: string | null;
    EinTime: string | null;
    IsBackup: boolean | null;
  }[];
  Rsvp: {
    Yes: number;
    No: number;
  }
};

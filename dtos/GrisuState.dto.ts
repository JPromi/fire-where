import { GrisuOperation } from "./GrisuOperation.dto";

export class GrisuState {
  CurrentState: string | null = null; // "data" | "waiting" // error
  Token: string | null = null;

  EinsatzData: GrisuOperation[] = []; // History and active

  Config: {
    Modules: {
      War: {
        Name: string | null;
      }[];
      Peace: {
        Name: string | null;
      }[];
    };
    HomeAddress: string | null;
    ShowBaz: boolean | null;
  } | null = null; // Config response

  Infos: any = null; // Infos response
  
  Errors: {
    ErrorCode: number | null;
    ErrorMsg: string | null;
    IsCritical: boolean | null;
  } | null = null; // Errors response
}

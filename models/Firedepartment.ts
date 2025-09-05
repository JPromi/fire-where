export type Firedepartment = {
    uuid: string;
    name: string | null;
    atFireDepartmentId: string | null;
    isVolunteer: boolean;
    address: {
      street: string | null;
      zipCode: string | null;
      city: string | null;
      federalState: string | null;
      country: string | null;
    };
    contact: {
      website: string | null;
    }
}
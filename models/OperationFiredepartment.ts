export type OperationUnit = {
  firedepartment?: {
    uuid?: string;
    name?: string;
    atFireDepartmentId?: string;
    isVolunteer: boolean;
  };
  dispoTime?: string;
  outTime?: string;
  inTime?: string;
  alarmTime?: string;
}
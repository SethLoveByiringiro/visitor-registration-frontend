export interface Visitor {
  id: number;
  names: string;
  idNumber: string;
  phone: string;
  purpose: string;
  arrivalTime: string;
  departureTime: string | null;
  visitDate: string;
  departmentToVisit: string;
}

export interface Patient {
  id: number;
  friendly_id: number;
  name: string;
  birth_date: string;
  gender: string;
  cpf: string;
  rg: string;

  email: string;
  phone_number: string;
  emergency_contact: string;

  zip_code: string;
  street: string;
  address_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;

  created_at: string;
  is_active: boolean;
}
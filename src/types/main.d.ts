interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}

interface User {
  name: string | null;
  email: string | null;
}

interface Match {
  match: string
}

interface Auth {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
}
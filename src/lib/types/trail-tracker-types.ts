export interface Session {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userid: User["_id"] | string;
  token: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: string;
}

export interface Candidate {
  firstName: string;
  lastName: string;
  office: string;
  _id: string;
}

export interface Category {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userid: User["_id"] | string;
  // img: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trails: Trail[];
  // difficultyLevel: string;
  // candidate: Candidate | string;
  // donor: User | string;
  // lat: number;
  // lng: number;
}

export interface Trail {
  title: string;
  description: string;
  location: string;
  lattitude: number;
  longitude: number;
  distance: number;
  _id: string;
  // category: Category | any;
  // user: User | string;
  categoryid: Category["_id"] | string;
  img?: string[];
  // userid: User["_id"] | string;
}
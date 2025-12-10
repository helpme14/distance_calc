export type Coordinate = {
  lat: number;
  lng: number;
  label?: string;
};

export type Destination = Coordinate & {
  id: string;
  label: string;
};

export type MatrixResult = {
  distances: number[];
  durations: number[];
};

export type RouteGeometry = {
  coordinates: Array<[number, number]>;
};

export type MapMode = "origin" | "destination";

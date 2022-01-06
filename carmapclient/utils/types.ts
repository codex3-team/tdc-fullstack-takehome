export type Coordinates = {latitude: number; longitude: number};

export type Car = {
  id: String;
  location: Coordinates;
  destination: Coordinates;
  distanceToDestination: number;
};

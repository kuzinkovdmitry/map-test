export interface ITree {
  id: string;
  name: string;
  children?: ITree[];
  coordinates?: number[];
  selected?: boolean;
}


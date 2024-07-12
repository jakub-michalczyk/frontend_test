export interface IData {
  id: number;
  content: string;
}

export interface BlockContext {
  $implicit: { key: string; title: string };
}

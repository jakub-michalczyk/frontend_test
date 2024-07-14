export interface IModal {
  message: string | undefined;
  title: string | undefined;
  error: boolean | undefined;
}

export interface IEditedModal {
  id: number | null;
  content: string;
}

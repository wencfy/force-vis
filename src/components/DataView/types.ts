export interface DataViewState<T extends ViewData> {
  status: 'idle' | 'loading' | 'failed';
  values: Array<T>;
}

export interface ViewData {
  uid: string;
  name: string;
  tags: Array<string>;
  lastModified?: number;
  url?: string;
  blob?: Blob;
  data?: any;
}

export interface ListViewData {
  status: 'idle' | 'loading' | 'failed';
  values: Array<Array<any>>;
}
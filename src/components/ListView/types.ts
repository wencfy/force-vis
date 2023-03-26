export interface ListState<T> {
  status: 'idle' | 'loading' | 'failed';
  values: Array<T>;
}


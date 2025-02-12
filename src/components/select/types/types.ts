export type PrimitiveType = string | number | null;

export type Option<T> = {
  label: string;
  value: T;
};

export type SelectEventType<T> = {
  target: {
    value: T;
  };
};

export enum ExperimentalActionTypes {
  ADD_NUMBER = 'ADD_NUMBER',
  MULTIPLY = 'MULTIPLY',
}

export interface ExperimentalAction<T> {
  type: ExperimentalActionTypes;
  payload: T;
}

export function addNumber(num: number): ExperimentalAction<number> {
  return {
    type: ExperimentalActionTypes.ADD_NUMBER,
    payload: num
  };
}

export function multiplyNumber(num: number): ExperimentalAction<number> {
  return {
    type: ExperimentalActionTypes.MULTIPLY,
    payload: num
  };
}

import {createRef} from 'react';

const navigationRef = createRef();

const helperNavigate = (name: string, params: any = undefined) => {
  if (navigationRef.current) {
    params
      ? navigationRef.current?.navigate(name, params)
      : navigationRef.current?.navigate(name);
  }
};

export {helperNavigate, navigationRef};
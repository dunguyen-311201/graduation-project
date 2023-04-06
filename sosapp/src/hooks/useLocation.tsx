import {create} from 'zustand';

export const useLocation = create(set => {
  location: {
    a: 1;
  }, 
  setLocation: (a: number) => {},
});

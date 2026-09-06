import { create } from "zustand";
export const useAuth = create<any>((set:any)=> ({
  user:null, token:null,
  setAuth:(user:any, token:string)=> set({user,token}),
  logout:()=> set({user:null, token:null})
}));

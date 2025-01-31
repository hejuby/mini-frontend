import { useMutation } from '@tanstack/react-query';
import {
  getEmailValidation,
  postFindPassword,
  postLogIn,
  postSignUp,
} from '../api/request.ts';

export function useValidateEmail() {
  return useMutation({
    mutationFn: getEmailValidation,
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: postLogIn,
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: postSignUp,
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useFindPassword() {
  return useMutation({
    mutationFn: postFindPassword,
    onError: (error) => {
      console.error(error);
    },
  });
}

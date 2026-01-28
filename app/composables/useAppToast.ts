import { TOAST } from "~/types/constants";

type ToastPayload = {
  title: string;
  description?: string;
  duration?: number;
};

export const useAppToast = () => {
  const toast = useToast();

  const success = ({ title, description, duration }: ToastPayload) => {
    toast.add({
      title,
      description,
      color: "success",
      duration: duration ?? TOAST.DURATION.SUCCESS,
      icon: TOAST.ICONS.SUCCESS,
    });
  };
  const warning = ({ title, description, duration }: ToastPayload) => {
    toast.add({
      title,
      description,
      color: "warning",
      duration: duration ?? TOAST.DURATION.WARNING,
      icon: TOAST.ICONS.WARNING,
    });
  };
  const error = ({ title, description, duration }: ToastPayload) => {
    toast.add({
      title,
      description,
      color: "error",
      duration: duration ?? TOAST.DURATION.ERROR,
      icon: TOAST.ICONS.ERROR,
    });
  };
  return {
    success,
    warning,
    error,
  };
};

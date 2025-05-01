import { toast } from "vue-sonner";
import type { NotifyOptions } from "../types/notify";

// 🟢 Duración global por defecto (2.5 segundos)
const DEFAULT_DURATION = 2500;

const commonStyle = {
  fontWeight: "600",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  padding: "clamp(12px, 4vw, 16px) clamp(16px, 5vw, 24px)", // responsive padding
  fontSize: "clamp(0.875rem, 2vw, 1rem)", // 14px–16px responsive
  maxWidth: "90vw", // previene desbordes en móviles
};

export function notifySuccess({
  title,
  description,
  duration = DEFAULT_DURATION,
}: NotifyOptions) {
  toast.success(title, {
    description,
    duration,
    position: "top-right",
    closeButton: true,
    style: {
      ...commonStyle,
      background: "#dcfce7", // green-100
      color: "#166534", // green-800
    },
  });
}

export function notifyError({
  title,
  description,
  duration = DEFAULT_DURATION,
}: NotifyOptions) {
  toast.error(title, {
    description,
    duration,
    position: "top-right",
    closeButton: true,
    style: {
      ...commonStyle,
      background: "#fee2e2", // red-100
      color: "#7f1d1d", // red-900
    },
  });
}

export function notifyWarning({
  title,
  description,
  duration = DEFAULT_DURATION,
}: NotifyOptions) {
  toast.warning(title, {
    description,
    duration,
    position: "top-right",
    closeButton: true,
    style: {
      ...commonStyle,
      background: "#fef9c3", // yellow-100
      color: "#78350f", // amber-900
    },
  });
}

export function notifyInfo({
  title,
  description,
  duration = DEFAULT_DURATION,
}: NotifyOptions) {
  toast(title, {
    description,
    duration,
    position: "top-right",
    closeButton: true,
    style: {
      ...commonStyle,
      background: "#dbeafe", // blue-100
      color: "#1e3a8a", // blue-900
    },
  });
}

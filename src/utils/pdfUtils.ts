import { notifyError } from "./notify";

export function validatePDF(file: File): boolean {
  if (file.type !== "application/pdf") {
    notifyError({
      title: "Archivo inválido",
      description: "Solo se permiten archivos PDF.",
    });
    return false;
  }

  if (file.size > 2 * 1024 * 1024) {
    notifyError({
      title: "Archivo muy grande",
      description: "El archivo no puede superar los 2MB.",
    });
    return false;
  }

  return true;
}

export function getPDFBlobURL(file: File): string {
  return URL.createObjectURL(file);
}

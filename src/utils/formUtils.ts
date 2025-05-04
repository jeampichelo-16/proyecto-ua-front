import type { Ref } from "vue";

// Compara los valores actuales contra los originales para saber si hubo cambios
export function detectChanges<T extends object>(
  current: T,
  original: T
): boolean {
  return Object.keys(current).some((key) => {
    const curVal = current[key as keyof T];
    const oriVal = original[key as keyof T];
    return curVal !== oriVal;
  });
}

// Detectar cambios en los campos de un formulario y construir un FormData con los campos modificados
export function buildUpdatedFormData<T extends object>(
  current: T,
  original: T
): FormData {
  const formData = new FormData();

  Object.keys(current).forEach((key) => {
    const curVal = current[key as keyof T];
    const oriVal = original[key as keyof T];

    if (curVal instanceof File) {
      formData.append(key, curVal);
    } else if (curVal !== oriVal && curVal !== null) {
      formData.append(key, String(curVal));
    }
  });

  return formData;
}

// Detectar cambios en los campos de un formulario y construir un FormData con todos los campos
export function buildCreateFormData<T extends object>(data: T): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      formData.append(key, val instanceof File ? val : String(val));
    }
  });

  return formData;
}

// Funcion para resetear formulario
export function resetForm<T extends object>(form: Ref<T>, initialValues: T) {
  form.value = { ...initialValues };
}

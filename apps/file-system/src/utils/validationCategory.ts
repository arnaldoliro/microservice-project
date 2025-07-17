export default function isMimeTypeValidForCategory(mime: string, categoria: string): boolean {
  const types: Record<string, string[]> = {
    documento: ['application/pdf'],
    imagem: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    planilha: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    apresentação: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    outros: ['*'],
  };

  const key = categoria.toLowerCase();
  const validTypes = types[key];

  return validTypes?.includes('*') || validTypes?.includes(mime);
}

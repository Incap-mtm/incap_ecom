export function getFamily(name: string): string {
  if (!name) return '';
  const idx = name.lastIndexOf(' - ');
  return (idx === -1 ? name : name.substring(0, idx)).trim();
}

export function getPresentation(name: string): string {
  if (!name) return '';
  const idx = name.lastIndexOf(' - ');
  return idx === -1 ? '' : name.substring(idx + 3).trim();
}

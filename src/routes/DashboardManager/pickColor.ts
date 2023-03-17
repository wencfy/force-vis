function hashCode(str: string) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export default function pickColor(str: string, id: number) {
  const saturation = id ? 30 : 70;
  // Note the last value here is now 50% instead of 80%
  return `hsl(${hashCode(str) % 360}, 60%, ${saturation}%)`;
}
// export function fileName(bytes: number): string {
//   const units = ["Bytes", "KB", "MB", "GB"];

//   if (!bytes) return "n/a";

//   const index = Math.floor(Math.log2(bytes) / 10);
  
//   return index === 0
//     ? `${bytes} ${units[index]}`
//     : `${(bytes / (1024 ** index)).toFixed(1)} ${units[index]}`;
// }

export function fileName(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB"];

  if (bytes === 0) {
    return "n/a";
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  if (i == 0) {
    return bytes + " " + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
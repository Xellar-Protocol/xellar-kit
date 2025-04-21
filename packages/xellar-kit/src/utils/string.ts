export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}····${address.slice(-4)}`;
};

export function decodeJWT(token: string) {
  const base64Url = token?.split('.')[1] ?? '';
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

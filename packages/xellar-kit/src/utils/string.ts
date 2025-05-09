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

export const formatRateAmount = (rateAmount: number): string => {
  if (rateAmount < 1) {
    const temp = rateAmount.toString().split('.');
    if (temp.length > 1) {
      const formatted = `${temp[0]}.${temp[1]?.substring(0, 2) ?? ''}`;
      return formatted;
    }
    // Fallback, perhaps unecessary
    return rateAmount.toString();
  } else if (rateAmount >= 1 && rateAmount < 1000) {
    return rateAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    return rateAmount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
};

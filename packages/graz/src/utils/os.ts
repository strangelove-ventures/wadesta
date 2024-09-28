export const isMobile = () => {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent;

    // Check for common mobile devices by examining user agent strings
    if (/android/i.test(userAgent)) {
      return true;
    }

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return true;
    }

    return false;
  }

  return false;
};

export const isAndroid = () => {
  return isMobile() && navigator.userAgent.toLowerCase().includes("android");
};

export const isIos = () => {
  return (
    isMobile() &&
    (navigator.userAgent.toLowerCase().includes("iphone") || navigator.userAgent.toLowerCase().includes("ipad"))
  );
};

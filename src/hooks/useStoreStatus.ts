import { useState, useEffect } from "react";

interface StoreStatus {
  isOpen: boolean;
  label: string;
}

function checkIsOpen(openTime: string, closeTime: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (closeMinutes <= openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function useStoreStatus(
  openTime: string,
  closeTime: string,
): StoreStatus {
  const [isOpen, setIsOpen] = useState<boolean>(() =>
    checkIsOpen(openTime, closeTime),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen(checkIsOpen(openTime, closeTime));
    }, 30_000);

    return () => clearInterval(interval);
  }, [openTime, closeTime]);

  const label = isOpen
    ? `Delivery abierto · hasta las ${closeTime}`
    : `Delivery cerrado · abre a las ${openTime} · Retiro 24hs`;

  return { isOpen, label };
}

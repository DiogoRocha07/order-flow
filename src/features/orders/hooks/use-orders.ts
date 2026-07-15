import { useCallback, useEffect, useState } from "react";
import {
  fetchOrders,
  fetchOrdersStats,
} from "@/features/orders/services/orders-api";
import type { Order, OrderStats } from "@/features/orders/types/order";

type RefetchOrdersOptions = {
  showLoading?: boolean;
};

type useOrdersResult = {
  orders: Order[];
  stats: OrderStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: (options?: RefetchOrdersOptions) => Promise<void>;
};

type OrdersData = {
  orders: Order[];
  stats: OrderStats;
};

async function requestOrdersData(): Promise<OrdersData> {
  const [ordersData, statsData] = await Promise.all([
    fetchOrders(),
    fetchOrdersStats(),
  ]);

  return {
    orders: ordersData.orders,
    stats: statsData,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
}

export function useOrders(): useOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    void requestOrdersData()
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setOrders(data.orders);
        setStats(data.stats);
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return;
        }

        setError(getErrorMessage(error));
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const refetch = useCallback(
    async (options: RefetchOrdersOptions = {}): Promise<void> => {
      const { showLoading = true } = options;

      if (showLoading) {
        setIsLoading(true);
      }

      setError(null);

      try {
        const data = await requestOrdersData();

        setOrders(data.orders);
        setStats(data.stats);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  return {
    orders,
    stats,
    isLoading,
    error,
    refetch,
  };
}

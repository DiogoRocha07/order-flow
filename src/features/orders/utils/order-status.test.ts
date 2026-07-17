import { ORDER_STATUSES } from "@/features/orders/types/order";
import { isOrderStatus } from "@/features/orders/utils/order-status";

describe("isOrderStatus", () => {
  it.each(ORDER_STATUSES)(
    'retorna true para o status válido "%s"',
    (status) => {
      expect(isOrderStatus(status)).toBe(true);
    },
  );

  it.each(["all", "shipped", "PENDING", ""])(
    'retorna false para o status inválido "%s"',
    (status) => {
      expect(isOrderStatus(status)).toBe(false);
    },
  );
});

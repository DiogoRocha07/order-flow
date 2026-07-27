import { ORDER_STATUSES } from "@/features/orders/types/order";
import {
  getOrderStatusLabel,
  isOrderStatus,
} from "@/features/orders/utils/order-status";

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

describe("getOrderStatusLabel", () => {
  it.each([
    ["pending", "Pendente"],
    ["preparing", "Em preparação"],
    ["completed", "Concluído"],
    ["cancelled", "Cancelado"],
  ] as const)(
    'retorna o rótulo "%s" corretamente',
    (status, expectedLabel) => {
      expect(getOrderStatusLabel(status)).toBe(
        expectedLabel,
      );
    },
  );
});
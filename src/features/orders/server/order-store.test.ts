/**
 * @jest-environment node
 */

import { INITIAL_ORDERS } from "@/features/orders/data/orders";
import type { OrderStatus } from "@/features/orders/types/order";

type OrderStore = typeof import("@/features/orders/server/order-store");

async function loadOrderStore(): Promise<OrderStore> {
  jest.resetModules();

  return import("@/features/orders/server/order-store");
}

function getDifferentStatus(currentStatus: OrderStatus): OrderStatus {
  return currentStatus === "completed" ? "pending" : "completed";
}

describe("order-store", () => {
  it("retorna os pedidos iniciais", async () => {
    const { getOrders } = await loadOrderStore();

    const orders = getOrders();

    expect(orders).toEqual(INITIAL_ORDERS);
    expect(orders).not.toBe(INITIAL_ORDERS);
  });

  it("retorna cópias dos pedidos para impedir mutações externas", async () => {
    const { getOrders } = await loadOrderStore();

    const firstResult = getOrders();
    const originalCustomerName = firstResult[0].customerName;

    firstResult[0].customerName = "Cliente alterado pelo consumidor";

    const secondResult = getOrders();

    expect(secondResult).not.toBe(firstResult);
    expect(secondResult[0]).not.toBe(firstResult[0]);

    expect(secondResult[0].customerName).toBe(originalCustomerName);
  });

  it("encontra um pedido pelo ID e retorna uma cópia", async () => {
    const { findOrderById } = await loadOrderStore();

    const targetOrder = INITIAL_ORDERS[0];

    const foundOrder = findOrderById(targetOrder.id);

    foundOrder!.customerName = "Nome alterado externamente";

    expect(findOrderById(targetOrder.id)?.customerName).toBe(
      targetOrder.customerName,
    );
  });

  it("retorna undefined quando o pedido não existe", async () => {
    const { findOrderById } = await loadOrderStore();

    expect(findOrderById("ORD-INEXISTENTE")).toBeUndefined();
  });

  it("atualiza o status e mantém os demais dados intactos", async () => {
    const { findOrderById, getOrders, updateOrderStatus } =
      await loadOrderStore();

    const ordersBeforeUpdate = getOrders();
    const targetOrder = ordersBeforeUpdate[0];

    const newStatus = getDifferentStatus(targetOrder.status);

    const updatedOrder = updateOrderStatus(targetOrder.id, newStatus);

    expect(updatedOrder).toEqual({
      ...targetOrder,
      status: newStatus,
    });

    expect(findOrderById(targetOrder.id)).toEqual({
      ...targetOrder,
      status: newStatus,
    });

    const ordersAfterUpdate = getOrders();

    expect(
      ordersAfterUpdate.filter((order) => order.id !== targetOrder.id),
    ).toEqual(
      ordersBeforeUpdate.filter((order) => order.id !== targetOrder.id),
    );
  });

  it("retorna uma cópia do pedido atualizado", async () => {
    const { findOrderById, updateOrderStatus } = await loadOrderStore();

    const targetOrder = INITIAL_ORDERS[0];

    const newStatus = getDifferentStatus(targetOrder.status);

    const updatedOrder = updateOrderStatus(targetOrder.id, newStatus);

    expect(updatedOrder).toBeDefined();

    updatedOrder!.customerName = "Nome alterado externamente";

    expect(findOrderById(targetOrder.id)?.customerName).toBe(
      targetOrder.customerName,
    );
  });

  it("não altera o armazenamento quando o pedido não existe", async () => {
    const { getOrders, updateOrderStatus } = await loadOrderStore();

    const ordersBeforeUpdate = getOrders();

    const result = updateOrderStatus("ORD-INEXISTENTE", "completed");

    expect(result).toBeUndefined();
    expect(getOrders()).toEqual(ordersBeforeUpdate);
  });
});

import { render, screen } from "@testing-library/react";
import useEvent, { userEvent } from "@testing-library/user-event";

import { OrderTable } from "@/features/orders/components/order-table";
import type { Order } from "@/features/orders/types/order";

const onStatusChange = jest.fn();

const orders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "João Silva",
    total: 150,
    status: "pending",
    createdAt: "2026-07-01T10:00:00.000Z",
    itemCount: 2,
  },
  {
    id: "ORD-1002",
    customerName: "Maria Souza",
    total: 300,
    status: "completed",
    createdAt: "2026-07-02T15:00:00.000Z",
    itemCount: 5,
  },
];

describe("OrderTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza todos os pedidos", () => {
    render(
      <OrderTable
        orders={orders}
        updatingOrderId={null}
        onStatusChange={onStatusChange}
      />,
    );

    expect(screen.getByText("ORD-1001")).toBeInTheDocument();
    expect(screen.getByText("ORD-1002")).toBeInTheDocument();

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
  });

  it("renderiza valores, datas e quantidades de itens", () => {
    render(
      <OrderTable
        orders={orders}
        updatingOrderId={null}
        onStatusChange={onStatusChange}
      />,
    );

    expect(screen.getByText("01/07/2026")).toBeInTheDocument();
    expect(screen.getByText("02/07/2026")).toBeInTheDocument();

    expect(screen.getByText("2 itens")).toBeInTheDocument();
    expect(screen.getByText("5 itens")).toBeInTheDocument();

    expect(screen.getByText("R$ 150,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 300,00")).toBeInTheDocument();
  });

  it("renderiza um select para cada pedido", () => {
    render(
      <OrderTable
        orders={orders}
        updatingOrderId={null}
        onStatusChange={onStatusChange}
      />,
    );

    expect(
      screen.getByRole("combobox", {
        name: /ORD-1001/i,
      }),
    ).toBeInTheDocument();
  });

  it("chama onStatusChange quando o usuário altera o status", async () => {
    const user = userEvent.setup();

    render(
      <OrderTable
        orders={orders}
        updatingOrderId={null}
        onStatusChange={async (id, status) => {
          onStatusChange(id, status);
        }}
      />,
    );

    const select = screen.getByRole("combobox", {
      name: /ORD-1001/i,
    });

    await user.selectOptions(select, "completed");

    expect(onStatusChange).toHaveBeenCalledWith("ORD-1001", "completed");
  });

  it("mostra o indicador de atualização apenas para o pedido informado", () => {
    render(
      <OrderTable
        orders={orders}
        updatingOrderId={"ORD-1002"}
        onStatusChange={onStatusChange}
      />,
    );

    expect(screen.getByText("Atualizando...")).toBeInTheDocument();
  });
});

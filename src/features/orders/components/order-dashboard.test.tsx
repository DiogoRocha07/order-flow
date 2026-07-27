import { render, screen } from "@testing-library/react";

import { OrderDashboard } from "@/features/orders/components/order-dashboard";
import type { OrderStats } from "@/features/orders/types/order";

const stats: OrderStats = {
  totalOrders: 12,
  pendingOrders: 3,
  preparingOrders: 4,
  completedOrders: 5,
  totalValue: 1234.56,
};

describe("OrderDashboard", () => {
  it("exibe os indicadores disponíveis no dashboard", () => {
    render(<OrderDashboard stats={stats} />);

    expect(screen.getByText("Total de pedidos")).toBeInTheDocument();

    expect(screen.getByText("Pendentes")).toBeInTheDocument();

    expect(screen.getByText("Em preparação")).toBeInTheDocument();

    expect(screen.getByText("Concluídos")).toBeInTheDocument();

    expect(screen.getByText("Valor total")).toBeInTheDocument();
  });

  it("exibe os valores recebidos pelas estatísticas", () => {
    render(<OrderDashboard stats={stats} />);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("R$ 1.234,56")).toBeInTheDocument();
  });
});

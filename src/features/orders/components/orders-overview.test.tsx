import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrdersOverview } from "@/features/orders/components/orders-overview";
import { useOrderFilters } from "@/features/orders/hooks/use-order-filters";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status";
import type {
  Order,
  OrderFiltersState,
  OrderStats,
} from "@/features/orders/types/order";

jest.mock("@/features/orders/hooks/use-orders", () => ({
  useOrders: jest.fn(),
}));

jest.mock("@/features/orders/hooks/use-order-filters", () => ({
  useOrderFilters: jest.fn(),
}));

jest.mock("@/features/orders/hooks/use-update-order-status", () => ({
  useUpdateOrderStatus: jest.fn(),
}));

const mockedUseOrders = jest.mocked(useOrders);
const mockedUseOrderFilters = jest.mocked(useOrderFilters);
const mockedUseUpdateOrderStatus = jest.mocked(useUpdateOrderStatus);

const orders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Ana Souza",
    total: 150,
    status: "pending",
    createdAt: "2026-07-01T10:00:00.000Z",
    itemCount: 2,
  },
];

const stats: OrderStats = {
  totalOrders: 1,
  pendingOrders: 1,
  preparingOrders: 0,
  completedOrders: 0,
  totalValue: 150,
};

const emptyStats: OrderStats = {
  totalOrders: 0,
  pendingOrders: 0,
  preparingOrders: 0,
  completedOrders: 0,
  totalValue: 0,
};

const initialFilters: OrderFiltersState = {
  customerName: "",
  status: "all",
  startDate: "",
  endDate: "",
};

const refetch = jest.fn(async (): Promise<void> => {});
const updateFilter = jest.fn();
const clearFilters = jest.fn();
const updateStatus = jest.fn();
const clearFeedback = jest.fn();

function mockDefaultHooks() {
  mockedUseOrders.mockReturnValue({
    orders,
    stats,
    isLoading: false,
    error: null,
    refetch,
  });

  mockedUseOrderFilters.mockReturnValue({
    filters: initialFilters,
    filteredOrders: orders,
    hasActiveFilters: false,
    updateFilter,
    clearFilters,
  });

  mockedUseUpdateOrderStatus.mockReturnValue({
    updatingOrderId: null,
    updateError: null,
    successMessage: null,
    updateStatus,
    clearFeedback,
  });
}

describe("OrdersOverview", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockDefaultHooks();
  });

  it("exibe o estado de carregamento", () => {
    mockedUseOrders.mockReturnValue({
      orders: [],
      stats: null,
      isLoading: true,
      error: null,
      refetch,
    });

    render(<OrdersOverview />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando pedidos");
  });

  it("exibe o erro de carregamento e permite tentar novamente", async () => {
    const user = userEvent.setup();

    mockedUseOrders.mockReturnValue({
      orders: [],
      stats: null,
      isLoading: false,
      error: "O servidor não respondeu.",
      refetch,
    });

    render(<OrdersOverview />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Não foi possível carregar os pedidos.",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("O servidor não respondeu.")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Tentar novamente",
      }),
    );

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("exibe um erro quando as estatísticas não estão disponíveis", async () => {
    const user = userEvent.setup();

    mockedUseOrders.mockReturnValue({
      orders,
      stats: null,
      isLoading: false,
      error: null,
      refetch,
    });

    render(<OrdersOverview />);

    expect(
      screen.getByRole("heading", {
        name: "Os dados do dashboard estão indisponíveis.",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "As estatísticas dos pedidos não foram retornadas corretamente.",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Tentar novamente",
      }),
    );

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("exibe o estado vazio quando não existem pedidos cadastrados", () => {
    mockedUseOrders.mockReturnValue({
      orders: [],
      stats: emptyStats,
      isLoading: false,
      error: null,
      refetch,
    });

    mockedUseOrderFilters.mockReturnValue({
      filters: initialFilters,
      filteredOrders: [],
      hasActiveFilters: false,
      updateFilter,
      clearFilters,
    });

    render(<OrdersOverview />);

    expect(
      screen.getByRole("heading", {
        name: "Nenhum pedido cadastrado",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ainda não existem pedidos disponíveis para exibição."),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("region", {
        name: "Filtros",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Limpar filtros",
      }),
    ).not.toBeInTheDocument();
  });

  it("exibe o estado vazio dos filtros e permite limpá-los", async () => {
    const user = userEvent.setup();

    mockedUseOrderFilters.mockReturnValue({
      filters: {
        ...initialFilters,
        customerName: "Cliente inexistente",
      },
      filteredOrders: [],
      hasActiveFilters: true,
      updateFilter,
      clearFilters,
    });

    render(<OrdersOverview />);

    expect(
      screen.getByRole("region", {
        name: "Filtros",
      }),
    ).toBeInTheDocument();

    const emptyStateTitle = screen.getByRole("heading", {
      name: "Nenhum pedido encontrado",
    });

    expect(
      screen.getByText(
        "Nenhum pedido corresponde aos filtros selecionados. Altere ou limpe os filtros para visualizar outros resultados.",
      ),
    ).toBeInTheDocument();

    const emptyState = emptyStateTitle.closest("div");

    expect(emptyState).not.toBeNull();

    await user.click(
      within(emptyState!).getByRole("button", {
        name: "Limpar filtros",
      }),
    );

    expect(clearFilters).toHaveBeenCalledTimes(1);
  });

  it("renderiza dashboard, filtros e tabela quando od dados estão disponíveis", () => {
    render(<OrdersOverview />);

    expect(screen.getByText("Total de pedidos")).toBeInTheDocument();

    expect(
      screen.getByRole("region", {
        name: "Filtros",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("table", {
        name: "Lista de pedidos da loja",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("ORD-1001")).toBeInTheDocument();
    expect(screen.getByText("Ana Souza")).toBeInTheDocument();
  });

  it("encaminha a alteração de status para o hook", async () => {
    const user = userEvent.setup();

    render(<OrdersOverview />);

    const statusSelect = screen.getByRole("combobox", {
      name: "Alterar status do pedido ORD-1001",
    });

    await user.selectOptions(statusSelect, "completed");

    expect(updateStatus).toHaveBeenCalledTimes(1);

    expect(updateStatus).toHaveBeenCalledWith("ORD-1001", "completed");
  });

  it("exibe o pedido em atualização e desabilita o seletor", () => {
    mockedUseUpdateOrderStatus.mockReturnValue({
      updatingOrderId: "ORD-1001",
      updateError: null,
      successMessage: null,
      updateStatus,
      clearFeedback,
    });

    render(<OrdersOverview />);

    expect(screen.getByRole("status")).toHaveTextContent("Atualizando...");

    expect(
      screen.getByRole("combobox", {
        name: "Alterar status do pedido ORD-1001",
      }),
    ).toBeDisabled();
  });

  it("exibe a mensagem de sucesso e permite fechá-la", async () => {
    const user = userEvent.setup();

    mockedUseUpdateOrderStatus.mockReturnValue({
      updatingOrderId: null,
      updateError: null,
      successMessage: "Status do pedido ORD-1001 atualizado para Concluído.",
      updateStatus,
      clearFeedback,
    });

    render(<OrdersOverview />);

    const successFeedback = screen.getByRole("status");

    expect(successFeedback).toHaveTextContent(
      "Status do pedido ORD-1001 atualizado para Concluído.",
    );

    await user.click(
      within(successFeedback).getByRole("button", {
        name: "Fechar",
      }),
    );

    expect(clearFeedback).toHaveBeenCalledTimes(1);
  });

  it("exibe o erro de atualização e permite fechá-lo", async () => {
    const user = userEvent.setup();

    mockedUseUpdateOrderStatus.mockReturnValue({
      updatingOrderId: null,
      updateError: "O servidor rejeitou a atualização.",
      successMessage: null,
      updateStatus,
      clearFeedback,
    });

    render(<OrdersOverview />);

    const updateAlert = screen.getByRole("alert");

    expect(updateAlert).toHaveTextContent("Não foi possível alterar o status.");

    expect(updateAlert).toHaveTextContent("O servidor rejeitou a atualização.");

    await user.click(
      within(updateAlert).getByRole("button", {
        name: "Fechar",
      }),
    );
  });

  it("configura um recarregamento silencioso após a atualização do status", async () => {
    render(<OrdersOverview />);

    expect(mockedUseUpdateOrderStatus).toHaveBeenCalledTimes(1);

    const hookOptions = mockedUseUpdateOrderStatus.mock.calls[0][0];

    await hookOptions.onUpdated();

    expect(refetch).toHaveBeenCalledWith({
      showLoading: false,
    });
  });
});

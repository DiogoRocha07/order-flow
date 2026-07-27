import type { ComponentProps } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderFilters } from "@/features/orders/components/order-filters";
import {
  ORDER_STATUSES,
  type OrderFiltersState,
} from "@/features/orders/types/order";

type OrderFiltersProps = ComponentProps<typeof OrderFilters>;

const initialFilters: OrderFiltersState = {
  customerName: "",
  status: "all",
  startDate: "",
  endDate: "",
};

function renderOrderFilters(overrides: Partial<OrderFiltersProps> = {}) {
  const props: OrderFiltersProps = {
    filters: initialFilters,
    hasActiveFilters: false,
    onFilterChange: jest.fn(),
    onClearFilters: jest.fn(),
    ...overrides,
  };

  render(<OrderFilters {...props} />);

  return props;
}

describe("OrderFilters", () => {
  it("renderiza os valores atuais dos filtros", () => {
    renderOrderFilters({
      filters: {
        customerName: "Ana",
        status: "completed",
        startDate: "2026-07-01",
        endDate: "2026-07-31",
      },
    });

    expect(
      screen.getByRole("region", {
        name: "Filtros",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("searchbox", {
        name: "Cliente",
      }),
    ).toHaveValue("Ana");

    expect(
      screen.getByRole("combobox", {
        name: "Status",
      }),
    ).toHaveValue("completed");

    expect(screen.getByLabelText("Data inicial")).toHaveValue("2026-07-01");

    expect(screen.getByLabelText("Data final")).toHaveValue("2026-07-31");
  });

  it("renderiza todas as opções de status", () => {
    renderOrderFilters();

    const statusSelect = screen.getByRole("combobox", {
      name: "Status",
    });

    const options = within(statusSelect).getAllByRole("option");

    expect(options).toHaveLength(ORDER_STATUSES.length + 1);

    expect(
      within(statusSelect).getByRole("option", {
        name: "Todos os status",
      }),
    ).toHaveValue("all");
  });

  it("informa a alteração do nome do cliente", () => {
    const onFilterChange = jest.fn();

    renderOrderFilters({
      onFilterChange,
    });

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Cliente",
      }),
      {
        target: {
          value: "Maria",
        },
      },
    );

    expect(onFilterChange).toHaveBeenCalledTimes(1);

    expect(onFilterChange).toHaveBeenCalledWith("customerName", "Maria");
  });

  it("informa a alteração do status", async () => {
    const user = userEvent.setup();
    const onFilterChange = jest.fn();

    renderOrderFilters({
      onFilterChange,
    });

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Status",
      }),
      "preparing",
    );

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith("status", "preparing");
  });

  it("informa as alterações das datas", () => {
    const onFilterChange = jest.fn();

    renderOrderFilters({ onFilterChange });

    fireEvent.change(screen.getByLabelText("Data inicial"), {
      target: {
        value: "2026-07-05",
      },
    });

    fireEvent.change(screen.getByLabelText("Data final"), {
      target: {
        value: "2026-07-20",
      },
    });

    expect(onFilterChange).toHaveBeenNthCalledWith(
      1,
      "startDate",
      "2026-07-05",
    );

    expect(onFilterChange).toHaveBeenNthCalledWith(2, "endDate", "2026-07-20");
  });

  it("limita as datas de acordo com o período selecionado", () => {
    renderOrderFilters({
      filters: {
        customerName: "",
        status: "all",
        startDate: "2026-07-05",
        endDate: "2026-07-20",
      },
    });

    expect(screen.getByLabelText("Data inicial")).toHaveAttribute(
      "max",
      "2026-07-20",
    );

    expect(screen.getByLabelText("Data final")).toHaveAttribute(
      "min",
      "2026-07-05",
    );
  });

  it("mantém o botão de limpeza desabilitado sem filtros ativos", () => {
    renderOrderFilters({
      hasActiveFilters: false,
    });

    expect(
      screen.getByRole("button", {
        name: "Limpar filtros",
      }),
    ).toBeDisabled();
  });

  it("chama onClearFilters quando o botão está habilidado", async () => {
    const user = userEvent.setup();
    const onClearFilters = jest.fn();

    renderOrderFilters({
      hasActiveFilters: true,
      onClearFilters,
    });

    const clearButton = screen.getByRole("button", {
      name: "Limpar filtros",
    });

    expect(clearButton).toBeEnabled();

    await user.click(clearButton);

    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmptyState } from "@/features/orders/components/ui/empty-state";

describe("EmptyState", () => {
  it("renderiza o título e a descrição", () => {
    render(
      <EmptyState
        title="Nenhum pedido encontrado."
        description="Ainda não existem pedidos cadastrados."
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Nenhum pedido encontrado.",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ainda não existem pedidos cadastrados."),
    ).toBeInTheDocument();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renderiza a ação e chama onAction", async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();

    render(
      <EmptyState
        title="Nenhum resultado encontrado."
        description="Altere ou remova os filtros atuais."
        actionLabel="Limpar filtros"
        onAction={onAction}
      />,
    );

    const actionButton = screen.getByRole("button", {
      name: "Limpar filtros",
    });

    await user.click(actionButton);

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("não renderiza a ação quando apenas actionLabel é informado", () => {
    render(
      <EmptyState
        title="Nenhum resultado encontrado."
        description="Altere os filtros."
        actionLabel="Limpar filtros"
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("não renderiza a ação quando apenas onAction é informado", () => {
    render(
      <EmptyState
        title="Nenhum resultado encontrado."
        description="Altere os filtros."
        onAction={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorState } from "@/features/orders/components/ui/error-state";

describe("ErrorState", () => {
  it("renderiza o título padrão e a mensagem de erro", () => {
    render(<ErrorState message="O servidor não respondeu." />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Não foi possível carregar os dados.",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("O servidor não respondeu.")).toBeInTheDocument();
  });

  it("não renderiza o botão quando onRetry não é informado", () => {
    render(<ErrorState message="O servidor não respondeu." />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renderiza valores personalizados e chama onRetry", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();

    render(
      <ErrorState
        title="Falha ao carregar pedidos."
        message="Tente novamente em alguns instantes."
        retryLabel="Recarregar pedidos"
        onRetry={onRetry}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Falha ao carregar pedidos.",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Tente novamente em alguns instantes."),
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Recarregar pedidos",
    });

    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("utiliza o texto padrão do botão quando onRetry é informado", () => {
    render(<ErrorState message="Erro ao carregar." onRetry={jest.fn()} />);

    expect(
      screen.getByRole("button", {
        name: "Tentar novamente",
      }),
    ).toBeInTheDocument();
  });
});

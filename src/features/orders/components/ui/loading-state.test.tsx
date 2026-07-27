import { render, screen } from "@testing-library/react";
import { LoadingState } from "@/features/orders/components/ui/loading-state";

describe("LoadingState", () => {
  it("renderiza a mensagem padrão em uma região de status", () => {
    render(<LoadingState />);

    const status = screen.getByRole("status");

    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-live", "polite");

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("renderiza uma mensagem personalizada", () => {
    render(<LoadingState message="Carregando pedidos..." />);

    expect(screen.getByText("Carregando pedidos...")).toBeInTheDocument();

    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });
});

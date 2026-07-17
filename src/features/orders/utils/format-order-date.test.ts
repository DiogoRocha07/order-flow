import { formatOrderDate } from "@/features/orders/utils/format-order-date";

describe("formatOrderDate", () => {
  it("formata uma data ISO no padrão brasileiro", () => {
    const result = formatOrderDate("2026-07-10T18:45:00.000Z");

    expect(result).toBe("10/07/2026");
  });

  it("mantém a data em UTC sem deslocar para o dia anterior", () => {
    const result = formatOrderDate("2026-07-01T01:00:00.000Z");

    expect(result).toBe("01/07/2026");
  });

  it("formatar uma data sem horário", () => {
    const result = formatOrderDate("2026-07-15");

    expect(result).toBe("15/07/2026");
  });

  it("retornar uma mensagem controlada para uma data inválida", () => {
    const result = formatOrderDate("data-inexistente");

    expect(result).toBe("Data inválida");
  });
});

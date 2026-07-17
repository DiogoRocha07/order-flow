import { formatCurrency } from "@/features/orders/utils/format-currency";

function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, " ");
}

describe("formatCurrency", () => {
  it("formatar um valor no padrão monetário brasileiro", () => {
    const result = formatCurrency(1234.56);

    expect(normalizeSpaces(result)).toBe("R$ 1.234,56");
  });

  it("formatar o valor zero com duas casas decimais", () => {
    const result = formatCurrency(0);

    expect(normalizeSpaces(result)).toBe("R$ 0,00");
  });

  it("formatar valores negativos", () => {
    const result = formatCurrency(-50.5);

    expect(normalizeSpaces(result)).toBe("-R$ 50,50");
  });
});

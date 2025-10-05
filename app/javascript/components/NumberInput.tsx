import * as React from "react";

type Props = {
  children: (inputValueProps: {
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    inputMode: "numeric" | "decimal";
  }) => React.ReactElement;
  onChange: (newValue: null | number) => void;
  value: null | number;
  decimal?: boolean;
};

export const NumberInput = ({ children, onChange, value, decimal }: Props) => {
  const [rawInput, setRawInput] = React.useState(value != null ? value.toString() : "");

  React.useEffect(() => {
    const stringValue = value != null ? value.toString() : "";
    if (stringValue !== rawInput && !rawInput.endsWith(".")) {
      setRawInput(stringValue);
    }
  }, [value]);

  return children({
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
      let numericString = evt.target.value.replace(decimal ? /[^\d.]/u : /\D/gu, "");

      if (decimal) {
        const parts = numericString.split(".");
        if (parts.length > 2) {
          numericString = parts[0] + "." + parts.slice(1).join("");
        }
      }

      setRawInput(numericString);

      if (numericString === "") {
        onChange(null);
        return;
      }

      let value: number;

      if (decimal) {
        if (numericString.startsWith(".")) {
          value = parseFloat("0" + numericString);
        } else if (numericString.endsWith(".")) {
          value = parseFloat(numericString + "0");
        } else {
          value = parseFloat(numericString);
        }
      } else {
        value = parseInt(numericString, 10);
      }

      onChange(isNaN(value) ? null : value);
    },
    value: rawInput,
    inputMode: decimal ? "decimal" : "numeric",
  });
};

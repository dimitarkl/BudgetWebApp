"use client";

import { useContext, useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listenToUserPreference, savePreference } from "@/api/expenses";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { isError } from "@/lib/errorCheck";
import { ErrorContext } from "../contexts/ErrorContext";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "BGN", symbol: "лв" },
];

export default function CurrencySelector() {
  const [currency, setCurrency] = useState(currencies[0]);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const errorContext = useContext(ErrorContext);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await listenToUserPreference();
        if (isError(response)) {
          console.log("Error fetching user preference:" + response.message);
          return errorContext?.setError("Error fetching user preference");
        }
        const preferredCurrency = currencies.find((c) => c.code === response);
        if (preferredCurrency) setCurrency(preferredCurrency);
        else errorContext?.setError("Error fetching user preference");
      } catch (error) {
        if (
          (error as Error).message === "Missing or insufficient permissions."
        ) {
          if (user) savePreference(user.uid, currencies[0].code);
        } else errorContext?.setError("Error fetching user preference");
      }
    };

    fetchCurrency();
  }, [currencies, user]);

  const handleCurrencyChange = async (newCurrency: {
    code: string;
    symbol: string;
  }) => {
    setCurrency(newCurrency);
    if (user) {
      const response = await savePreference(user.uid, newCurrency.code);
      if (isError(response)) {
        console.log("User Not Found" + response.message);
        return errorContext?.setError("User Not Found");
      } else navigate(0);
    } else {
      errorContext?.setError("User Not Found");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          {currency.code}
          <ChevronDown className=" h-3 w-3 " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => handleCurrencyChange(item)}
            className="flex items-center justify-between"
          >
            <span>
              {item.symbol} {item.code}
            </span>
            {currency.code === item.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

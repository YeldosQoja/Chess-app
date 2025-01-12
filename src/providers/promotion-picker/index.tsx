import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { PieceType } from "@/models";
import { PromotionPicker } from "./PromotionPicker";

type Props = {
  color: "white" | "black";
};

const PromotionPickerContext = createContext<{
  open: boolean;
  show: (_: { onSelect: (promotion: PieceType) => void }) => void;
}>({
  open: false,
  show: () => {},
});

export const usePromotionPicker = () => {
  const value = useContext(PromotionPickerContext);
  return value;
};

export const PromotionPickerProvider = ({
  color,
  children,
}: PropsWithChildren<Props>) => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    onSelect: (_: PieceType) => void;
  }>({
    open: false,
    onSelect: () => {},
  });

  const { open, onSelect } = dialog;

  const show = useCallback(
    ({ onSelect }: { onSelect: (_: PieceType) => void }) => {
      setDialog({ open: true, onSelect });
    },
    [],
  );
  return (
    <PromotionPickerContext.Provider value={{ open, show }}>
      {children}
      <PromotionPicker open={open} color={color} onSelect={onSelect} />
    </PromotionPickerContext.Provider>
  );
};

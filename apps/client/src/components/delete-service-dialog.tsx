import { useEffect, useState } from "react";
import { t } from "i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

export interface DeleteServiceItem {
  id: string;
  name: string;
}

interface DeleteServiceDialogProps {
  service: DeleteServiceItem | null;
  deleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteServiceDialog({
  service,
  deleting = false,
  onOpenChange,
  onConfirm,
}: DeleteServiceDialogProps) {
  const [confirmName, setConfirmName] = useState("");

  useEffect(() => {
    if (!service) {
      setConfirmName("");
    }
  }, [service]);

  const handleConfirm = async () => {
    if (!service) return;
    await onConfirm(service.id);
  };

  const isConfirmDisabled = deleting || confirmName !== service?.name;

  return (
    <AlertDialog
      open={service !== null}
      onOpenChange={(open) => {
        if (!open) {
          setConfirmName("");
          onOpenChange(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("service.deleteService.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("service.deleteService.description", {
              name: service?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Field>
          <FieldLabel>{t("service.deleteService.confirmLabel")}</FieldLabel>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={service?.name}
          />
          <FieldDescription>
            {t("service.deleteService.confirmHint", { name: service?.name })}
          </FieldDescription>
        </Field>

        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            {deleting ? t("common.deleting") : t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

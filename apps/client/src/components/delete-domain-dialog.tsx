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

export interface DeleteDomainItem {
  id: string;
  host: string;
}

interface DeleteDomainDialogProps {
  domain: DeleteDomainItem | null;
  deleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteDomainDialog({
  domain,
  deleting = false,
  onOpenChange,
  onConfirm,
}: DeleteDomainDialogProps) {
  const [confirmHost, setConfirmHost] = useState("");

  useEffect(() => {
    if (!domain) {
      setConfirmHost("");
    }
  }, [domain]);

  const handleConfirm = async () => {
    if (!domain) return;
    await onConfirm(domain.id);
  };

  const isConfirmDisabled = deleting || confirmHost !== domain?.host;

  return (
    <AlertDialog
      open={domain !== null}
      onOpenChange={(open) => {
        if (!open) {
          setConfirmHost("");
          onOpenChange(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("domain.deleteDomain.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("domain.deleteDomain.description", {
              host: domain?.host,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Field>
          <FieldLabel>{t("domain.deleteDomain.confirmLabel")}</FieldLabel>
          <Input
            value={confirmHost}
            onChange={(e) => setConfirmHost(e.target.value)}
            placeholder={domain?.host}
          />
          <FieldDescription>
            {t("domain.deleteDomain.confirmHint", { host: domain?.host })}
          </FieldDescription>
        </Field>

        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction disabled={isConfirmDisabled} onClick={handleConfirm}>
            {deleting ? t("common.deleting") : t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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

export interface DeleteClusterItem {
  id: string;
  name: string;
}

interface DeleteClusterDialogProps {
  cluster: DeleteClusterItem | null;
  deleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteClusterDialog({
  cluster,
  deleting = false,
  onOpenChange,
  onConfirm,
}: DeleteClusterDialogProps) {
  const [confirmName, setConfirmName] = useState("");

  useEffect(() => {
    if (!cluster) {
      setConfirmName("");
    }
  }, [cluster]);

  const handleConfirm = async () => {
    if (!cluster) return;
    await onConfirm(cluster.id);
  };

  const isConfirmDisabled = deleting || confirmName !== cluster?.name;

  return (
    <AlertDialog
      open={cluster !== null}
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
            {t("cluster.deleteCluster.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("cluster.deleteCluster.description", {
              name: cluster?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Field>
          <FieldLabel>{t("cluster.deleteCluster.confirmLabel")}</FieldLabel>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={cluster?.name}
          />
          <FieldDescription>
            {t("cluster.deleteCluster.confirmHint", { name: cluster?.name })}
          </FieldDescription>
        </Field>

        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? t("common.deleting") : t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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

export interface DeleteWorkspaceItem {
  id: string;
  name: string;
}

interface DeleteWorkspaceDialogProps {
  workspace: DeleteWorkspaceItem | null;
  deleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteWorkspaceDialog({
  workspace,
  deleting = false,
  onOpenChange,
  onConfirm,
}: DeleteWorkspaceDialogProps) {
  const [confirmName, setConfirmName] = useState("");

  useEffect(() => {
    if (!workspace) {
      setConfirmName("");
    }
  }, [workspace]);

  const handleConfirm = async () => {
    if (!workspace) return;
    await onConfirm();
  };

  const isConfirmDisabled = deleting || confirmName !== workspace?.name;

  return (
    <AlertDialog
      open={workspace !== null}
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
            {t("workspace.deleteWorkspace.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("workspace.deleteWorkspace.description", {
              name: workspace?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Field>
          <FieldLabel>{t("workspace.deleteWorkspace.confirmLabel")}</FieldLabel>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={workspace?.name}
          />
          <FieldDescription>
            {t("workspace.deleteWorkspace.confirmHint", {
              name: workspace?.name,
            })}
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

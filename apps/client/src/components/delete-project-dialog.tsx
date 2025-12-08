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

export interface DeleteProjectItem {
  id: string;
  name: string;
}

interface DeleteProjectDialogProps {
  project: DeleteProjectItem | null;
  deleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteProjectDialog({
  project,
  deleting = false,
  onOpenChange,
  onConfirm,
}: DeleteProjectDialogProps) {
  const [confirmName, setConfirmName] = useState("");

  useEffect(() => {
    if (!project) {
      setConfirmName("");
    }
  }, [project]);

  const handleConfirm = async () => {
    if (!project) return;
    await onConfirm(project.id);
  };

  const isConfirmDisabled = deleting || confirmName !== project?.name;

  return (
    <AlertDialog
      open={project !== null}
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
            {t("project.deleteProject.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("project.deleteProject.description", {
              name: project?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Field>
          <FieldLabel>{t("project.deleteProject.confirmLabel")}</FieldLabel>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={project?.name}
          />
          <FieldDescription>
            {t("project.deleteProject.confirmHint", { name: project?.name })}
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

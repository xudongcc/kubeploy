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

export interface DeleteVolumeItem {
  id: string;
  name: string;
}

interface DeleteVolumeDialogProps {
  volume: DeleteVolumeItem | null;
  deleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteVolumeDialog({
  volume,
  deleting = false,
  onOpenChange,
  onConfirm,
}: DeleteVolumeDialogProps) {
  const [confirmName, setConfirmName] = useState("");

  useEffect(() => {
    if (!volume) {
      setConfirmName("");
    }
  }, [volume]);

  const handleConfirm = async () => {
    if (!volume) return;
    await onConfirm(volume.id);
  };

  const isConfirmDisabled = deleting || confirmName !== volume?.name;

  return (
    <AlertDialog
      open={volume !== null}
      onOpenChange={(open) => {
        if (!open) {
          setConfirmName("");
          onOpenChange(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("volume.deleteVolume.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("volume.deleteVolume.description", {
              name: volume?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Field>
          <FieldLabel>{t("volume.deleteVolume.confirmLabel")}</FieldLabel>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={volume?.name}
          />
          <FieldDescription>
            {t("volume.deleteVolume.confirmHint", { name: volume?.name })}
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

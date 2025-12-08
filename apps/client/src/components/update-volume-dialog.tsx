import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { CircleX } from "lucide-react";
import { t } from "i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export interface VolumeItem {
  id: string;
  name: string;
  size: number;
  mountPath?: string | null;
}

interface UpdateVolumeDialogProps {
  volume: VolumeItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    id: string,
    values: {
      name: string;
      size: number;
      mountPath: string | null;
    },
  ) => Promise<void>;
}

export function UpdateVolumeDialog({
  volume,
  onOpenChange,
  onSubmit,
}: UpdateVolumeDialogProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      size: 1,
      mountPath: "",
    },
    onSubmit: async ({ value }) => {
      if (!volume) return;

      await onSubmit(volume.id, {
        name: value.name.trim(),
        size: value.size,
        mountPath: value.mountPath.trim() || null,
      });
      form.reset();
    },
  });

  useEffect(() => {
    if (volume) {
      form.setFieldValue("name", volume.name);
      form.setFieldValue("size", volume.size);
      form.setFieldValue("mountPath", volume.mountPath || "");
    }
  }, [volume]);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={volume !== null} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("volume.updateVolume.title")}</DialogTitle>
            <DialogDescription>
              {t("volume.updateVolume.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? t("volume.form.name.required") : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="edit-name">
                    {t("volume.form.name.label")}
                  </FieldLabel>
                  <Input
                    id="edit-name"
                    placeholder={t("volume.form.name.placeholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field
              name="size"
              validators={{
                onChange: ({ value }) =>
                  value <= 0 ? t("volume.form.size.required") : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="edit-size">
                    {t("volume.form.size.label")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="edit-size"
                      type="number"
                      min={1}
                      placeholder="1"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(parseInt(e.target.value, 10) || 0)
                      }
                      onBlur={field.handleBlur}
                    />
                    <InputGroupAddon align="inline-end">GB</InputGroupAddon>
                  </InputGroup>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="mountPath">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="edit-mountPath">
                    {t("volume.form.mountPath.label")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="edit-mountPath"
                      placeholder={t("volume.form.mountPath.placeholder")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.value && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Clear"
                          onClick={() => field.handleChange("")}
                        >
                          <CircleX />
                        </InputGroupButton>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </Field>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? t("common.saving") : t("common.save")}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

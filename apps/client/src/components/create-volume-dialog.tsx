import { useForm } from "@tanstack/react-form";
import { t } from "i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface CreateVolumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    name: string;
    size: number;
    mountPath?: string;
  }) => Promise<void>;
  trigger?: React.ReactNode;
}

export function CreateVolumeDialog({
  open,
  onOpenChange,
  onSubmit,
  trigger,
}: CreateVolumeDialogProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      size: 1,
      mountPath: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name.trim(),
        size: value.size,
        mountPath: value.mountPath.trim() || undefined,
      });
      form.reset();
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("volume.createVolume.title")}</DialogTitle>
            <DialogDescription>
              {t("volume.createVolume.description")}
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
                  <FieldLabel htmlFor="name">
                    {t("volume.form.name.label")}
                  </FieldLabel>
                  <Input
                    id="name"
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
                  <FieldLabel htmlFor="size">
                    {t("volume.form.size.label")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="size"
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
                  <FieldLabel htmlFor="mountPath">
                    {t("volume.form.mountPath.label")}
                  </FieldLabel>
                  <Input
                    id="mountPath"
                    placeholder={t("volume.form.mountPath.placeholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
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
                  {isSubmitting ? t("common.creating") : t("common.create")}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

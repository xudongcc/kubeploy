import { ReactNode } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    host: string;
    path: string;
    servicePort: number;
  }) => Promise<void>;
  ports: number[];
  trigger?: ReactNode;
}

export function CreateDomainDialog({
  open,
  onOpenChange,
  onSubmit,
  ports,
  trigger,
}: CreateDomainDialogProps) {
  const form = useForm({
    defaultValues: {
      host: "",
      path: "/",
      servicePort: ports[0]?.toString() ?? "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        host: value.host.trim(),
        path: value.path.trim() || "/",
        servicePort: parseInt(value.servicePort, 10),
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
            <DialogTitle>{t("domain.createDomain.title")}</DialogTitle>
            <DialogDescription>
              {t("domain.createDomain.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.Field
              name="host"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? t("domain.form.host.required") : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="host">
                    {t("domain.form.host.label")}
                  </FieldLabel>
                  <Input
                    id="host"
                    placeholder={t("domain.form.host.placeholder")}
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

            <form.Field name="path">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="path">
                    {t("domain.form.path.label")}
                  </FieldLabel>
                  <Input
                    id="path"
                    placeholder={t("domain.form.path.placeholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="servicePort"
              validators={{
                onChange: ({ value }) =>
                  !value ? t("domain.form.port.required") : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="servicePort">
                    {t("domain.form.port.label")}
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("domain.form.port.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {ports.map((port) => (
                        <SelectItem key={port} value={port.toString()}>
                          {port}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
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

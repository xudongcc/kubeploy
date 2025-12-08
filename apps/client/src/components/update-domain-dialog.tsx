import { useEffect } from "react";
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

export interface DomainItem {
  id: string;
  host: string;
  path: string;
  servicePort: number;
}

interface UpdateDomainDialogProps {
  domain: DomainItem | null;
  ports: number[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    id: string,
    values: {
      host: string;
      path: string;
      servicePort: number;
    },
  ) => Promise<void>;
}

export function UpdateDomainDialog({
  domain,
  ports,
  onOpenChange,
  onSubmit,
}: UpdateDomainDialogProps) {
  const form = useForm({
    defaultValues: {
      host: "",
      path: "/",
      servicePort: "",
    },
    onSubmit: async ({ value }) => {
      if (!domain) return;

      await onSubmit(domain.id, {
        host: value.host.trim(),
        path: value.path.trim() || "/",
        servicePort: parseInt(value.servicePort, 10),
      });
      form.reset();
    },
  });

  useEffect(() => {
    if (domain) {
      form.setFieldValue("host", domain.host);
      form.setFieldValue("path", domain.path);
      form.setFieldValue("servicePort", domain.servicePort.toString());
    }
  }, [domain]);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={domain !== null} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("domain.updateDomain.title")}</DialogTitle>
            <DialogDescription>
              {t("domain.updateDomain.description")}
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
                  <FieldLabel htmlFor="edit-host">
                    {t("domain.form.host.label")}
                  </FieldLabel>
                  <Input
                    id="edit-host"
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
                  <FieldLabel htmlFor="edit-path">
                    {t("domain.form.path.label")}
                  </FieldLabel>
                  <Input
                    id="edit-path"
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
                  <FieldLabel htmlFor="edit-servicePort">
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

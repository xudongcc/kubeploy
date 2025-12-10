import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { graphql } from "@/gql";

const CREATE_SERVICE_MUTATION = graphql(`
  mutation CreateServiceDialog($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      name
    }
  }
`);

interface CreateServiceDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (serviceId: string) => void;
}

export function CreateServiceDialog({
  projectId,
  open,
  onOpenChange,
  onSuccess,
}: CreateServiceDialogProps) {
  const { t } = useTranslation();

  const [createService] = useMutation(CREATE_SERVICE_MUTATION);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      const { data } = await createService({
        variables: {
          input: {
            name: value.name.trim(),
            description: value.description.trim() || undefined,
            projectId,
          },
        },
      });

      if (data?.createService.id) {
        form.reset();
        onOpenChange(false);
        onSuccess?.(data.createService.id);
      }
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("createService.title")}</DialogTitle>
            <DialogDescription>
              {t("createService.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) {
                    return t("createService.form.name.required");
                  }

                  if (value.length < 1 || value.length > 63) {
                    return t("createService.form.name.invalid");
                  }

                  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(value)) {
                    return t("createService.form.name.invalid");
                  }

                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="name">
                    {t("createService.form.name.label")}
                  </FieldLabel>
                  <Input
                    id="name"
                    placeholder={t("createService.form.name.placeholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldDescription>
                    {t("createService.form.name.hint")}
                  </FieldDescription>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="description">
                    {t("createService.form.description.label")}
                  </FieldLabel>
                  <Textarea
                    id="description"
                    placeholder={t(
                      "createService.form.description.placeholder",
                    )}
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

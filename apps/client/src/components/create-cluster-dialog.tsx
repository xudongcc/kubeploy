import { ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { t } from "i18next";
import { HelpCircle } from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface CreateClusterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    name: string;
    server: string;
    certificateAuthorityData: string;
    token: string;
  }) => Promise<void>;
  trigger?: ReactNode;
}

export function CreateClusterDialog({
  open,
  onOpenChange,
  onSubmit,
  trigger,
}: CreateClusterDialogProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      server: "",
      certificateAuthorityData: "",
      token: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name.trim(),
        server: value.server.trim(),
        certificateAuthorityData: value.certificateAuthorityData.trim(),
        token: value.token.trim(),
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
      <DialogContent className="max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("cluster.createCluster.title")}</DialogTitle>
            <DialogDescription>
              {t("cluster.createCluster.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value.trim()
                    ? t("cluster.form.name.required")
                    : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="name">
                    {t("cluster.form.name.label")}
                  </FieldLabel>
                  <Input
                    id="name"
                    placeholder={t("cluster.form.name.placeholder")}
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
              name="server"
              validators={{
                onChange: ({ value }) =>
                  !value.trim()
                    ? t("cluster.form.server.required")
                    : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="server">
                    {t("cluster.form.server.label")}
                  </FieldLabel>
                  <Input
                    id="server"
                    placeholder={t("cluster.form.server.placeholder")}
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
              name="certificateAuthorityData"
              validators={{
                onChange: ({ value }) =>
                  !value.trim()
                    ? t("cluster.form.certificateAuthorityData.required")
                    : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="certificateAuthorityData">
                    {t("cluster.form.certificateAuthorityData.label")}
                  </FieldLabel>
                  <Textarea
                    id="certificateAuthorityData"
                    placeholder={t(
                      "cluster.form.certificateAuthorityData.placeholder",
                    )}
                    className="field-sizing-fixed overflow-x-auto font-mono whitespace-pre"
                    rows={4}
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
              name="token"
              validators={{
                onChange: ({ value }) =>
                  !value.trim()
                    ? t("cluster.form.token.required")
                    : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <div className="flex items-center gap-1">
                    <FieldLabel htmlFor="token">
                      {t("cluster.form.token.label")}
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[520px]" side="right">
                        <div className="space-y-3">
                          <h4 className="font-medium">
                            {t("cluster.form.token.help.title")}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {t("cluster.form.token.help.description")}
                          </p>
                          <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                            {`# Create service account
kubectl create serviceaccount kubeploy -n kube-system

# Bind cluster-admin role
kubectl create clusterrolebinding kubeploy-admin \\
  --clusterrole=cluster-admin \\
  --serviceaccount=kube-system:kubeploy

# Create token
kubectl create token kubeploy -n kube-system --duration=8760h`}
                          </pre>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Textarea
                    id="token"
                    placeholder={t("cluster.form.token.placeholder")}
                    className="field-sizing-fixed overflow-x-auto font-mono whitespace-pre"
                    rows={4}
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

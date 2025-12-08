import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";

import { Page } from "@/components/page";
import { DataTable } from "@/components/turboost-ui/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { graphql } from "@/gql";
import { DomainOrderField, OrderDirection } from "@/gql/graphql";
import { createConnectionSchema } from "@/utils/create-connection-schema";

const GET_DOMAINS_QUERY = graphql(`
  query GetDomains(
    $serviceId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $orderBy: DomainOrder
  ) {
    service(id: $serviceId) {
      domains(
        after: $after
        before: $before
        first: $first
        last: $last
        orderBy: $orderBy
      ) {
        edges {
          node {
            id
            ...DomainItem @unmask
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }

  fragment DomainItem on Domain {
    id
    host
    path
    servicePort
    createdAt
  }
`);

const domainConnectionSchema = createConnectionSchema({
  pageSize: 20,
  orderField: DomainOrderField,
  defaultOrderField: DomainOrderField.CREATED_AT,
  defaultOrderDirection: OrderDirection.DESC,
});

const CREATE_DOMAIN_MUTATION = graphql(`
  mutation CreateDomain($input: CreateDomainInput!) {
    createDomain(input: $input) {
      id
      ...DomainItem
    }
  }
`);

const REMOVE_DOMAIN_MUTATION = graphql(`
  mutation RemoveDomain($id: ID!) {
    removeDomain(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId/domains",
)({
  component: RouteComponent,
  validateSearch: zodValidator(domainConnectionSchema),
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const { service } = Route.useRouteContext();
  const search = Route.useSearch();

  const [open, setOpen] = useState(false);
  const [deletingDomainId, setDeletingDomainId] = useState<string | null>(null);

  const { data, refetch } = useQuery(GET_DOMAINS_QUERY, {
    variables: { serviceId, ...search },
  });

  const [createDomain] = useMutation(CREATE_DOMAIN_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const [removeDomain, { loading: removing }] = useMutation(
    REMOVE_DOMAIN_MUTATION,
    {
      update(cache, result) {
        if (result.data?.removeDomain) {
          cache.evict({ id: cache.identify(result.data.removeDomain) });
          cache.gc();
        }
      },
    },
  );

  const form = useForm({
    defaultValues: {
      host: "",
      path: "/",
      servicePort: service?.ports?.[0]?.toString() ?? "",
    },
    onSubmit: async ({ value }) => {
      await createDomain({
        variables: {
          input: {
            serviceId,
            host: value.host.trim(),
            path: value.path.trim() || "/",
            servicePort: parseInt(value.servicePort, 10),
          },
        },
      });

      setOpen(false);
      form.reset();
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  const handleDelete = async (domainId: string) => {
    await removeDomain({
      variables: { id: domainId },
    });
    setDeletingDomainId(null);
  };

  const domains = data?.service?.domains?.edges.map((edge) => edge.node) || [];
  const ports = service?.ports ?? [];

  return (
    <Page
      title="Domains"
      description="Manage your service domains."
      actions={
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button disabled={ports.length === 0}>Add Domain</Button>
          </DialogTrigger>
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>Add Domain</DialogTitle>
                <DialogDescription>
                  Add a new domain to your service.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <form.Field
                  name="host"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? "Host is required" : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="host">Host</FieldLabel>
                      <Input
                        id="host"
                        placeholder="example.com"
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
                      <FieldLabel htmlFor="path">Path</FieldLabel>
                      <Input
                        id="path"
                        placeholder="/"
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
                      !value ? "Port is required" : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="servicePort">Port</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a port" />
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
                  Cancel
                </Button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Domain"}
                    </Button>
                  )}
                </form.Subscribe>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {ports.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          No ports configured for this service. Please add a port in the service
          settings first.
        </div>
      ) : (
        <DataTable
          columns={[
            {
              accessorKey: "host",
              header: "Host",
              cell: ({ row }) => {
                const url = `https://${row.original.host}${row.original.path}`;
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {row.original.host}
                  </a>
                );
              },
            },
            {
              accessorKey: "path",
              header: "Path",
            },
            {
              accessorKey: "servicePort",
              header: "Port",
            },
            {
              accessorKey: "createdAt",
              header: "Created Date",
              cell: ({ row }) => {
                return dayjs(row.original.createdAt).format(
                  "YYYY-MM-DD HH:mm:ss",
                );
              },
            },
            {
              id: "actions",
              header: "",
              cell: ({ row }) => {
                return (
                  <AlertDialog
                    open={deletingDomainId === row.original.id}
                    onOpenChange={(open) =>
                      setDeletingDomainId(open ? row.original.id : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Domain</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the domain{" "}
                          <strong>{row.original.host}</strong>? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={removing}
                          onClick={() => handleDelete(row.original.id)}
                        >
                          {removing ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                );
              },
            },
          ]}
          data={domains}
        />
      )}
    </Page>
  );
}

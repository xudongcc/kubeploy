import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Page } from "@/components/page";
import { DataTable } from "@/components/turboost-ui/data-table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  OrderDirection,
  WorkspaceMemberInviteStatus,
  WorkspaceMemberOrderField,
  WorkspaceMemberRole,
} from "@/gql/graphql";
import { createConnectionSchema } from "@/utils/create-connection-schema";

const GET_WORKSPACE_MEMBERS_QUERY = graphql(`
  query GetWorkspaceMembers(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $orderBy: WorkspaceMemberOrder
    $query: String
  ) {
    workspaceMembers(
      after: $after
      before: $before
      first: $first
      last: $last
      orderBy: $orderBy
      query: $query
    ) {
      edges {
        node {
          id
          ...WorkspaceMemberItem @unmask
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

  fragment WorkspaceMemberItem on WorkspaceMember {
    id
    name
    email
    role
    inviteStatus
    createdAt
    user {
      id
      name
      email
    }
  }
`);

const CREATE_WORKSPACE_INVITE_MUTATION = graphql(`
  mutation CreateWorkspaceInvite($input: CreateWorkspaceInviteInput!) {
    createWorkspaceInvite(input: $input) {
      id
    }
  }
`);

const UPDATE_WORKSPACE_MEMBER_MUTATION = graphql(`
  mutation UpdateWorkspaceMember(
    $id: ID!
    $input: UpdateWorkspaceMemberInput!
  ) {
    updateWorkspaceMember(id: $id, input: $input) {
      id
      role
    }
  }
`);

const REMOVE_WORKSPACE_MEMBER_MUTATION = graphql(`
  mutation RemoveWorkspaceMember($id: ID!) {
    removeWorkspaceMember(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/members/",
)({
  component: RouteComponent,
  validateSearch: zodValidator(
    createConnectionSchema({
      pageSize: 20,
      orderField: WorkspaceMemberOrderField,
      defaultOrderField: WorkspaceMemberOrderField.CREATED_AT,
      defaultOrderDirection: OrderDirection.DESC,
    }),
  ),
  beforeLoad: ({
    context: {
      i18n: { t },
    },
  }) => {
    return {
      title: t("members.title"),
    };
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();

  const [inviteOpen, setInviteOpen] = useState(false);

  const { data, refetch } = useQuery(GET_WORKSPACE_MEMBERS_QUERY, {
    variables: {
      ...search,
    },
  });

  const members = data?.workspaceMembers.edges.map((edge) => edge.node) ?? [];

  const [createWorkspaceInvite] = useMutation(CREATE_WORKSPACE_INVITE_MUTATION);
  const [updateWorkspaceMember] = useMutation(UPDATE_WORKSPACE_MEMBER_MUTATION);
  const [removeWorkspaceMember] = useMutation(REMOVE_WORKSPACE_MEMBER_MUTATION);

  const inviteForm = useForm({
    defaultValues: {
      email: "",
      role: WorkspaceMemberRole.MEMBER as WorkspaceMemberRole,
    },
    onSubmit: async ({ value }) => {
      await createWorkspaceInvite({
        variables: {
          input: {
            email: value.email.trim(),
            role: value.role,
          },
        },
      });
      setInviteOpen(false);
      inviteForm.reset();
      refetch();
    },
  });

  const handleInviteOpenChange = (isOpen: boolean) => {
    setInviteOpen(isOpen);
    if (!isOpen) {
      inviteForm.reset();
    }
  };

  const handleRoleChange = async (
    memberId: string,
    role: WorkspaceMemberRole,
  ) => {
    await updateWorkspaceMember({
      variables: {
        id: memberId,
        input: { role },
      },
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeWorkspaceMember({
      variables: { id: memberId },
      update(cache, result) {
        if (result.data?.removeWorkspaceMember) {
          cache.evict({
            id: cache.identify(result.data.removeWorkspaceMember),
          });
          cache.gc();
        }
      },
    });
  };

  const getRoleLabel = (role: WorkspaceMemberRole) => {
    switch (role) {
      case WorkspaceMemberRole.OWNER:
        return t("members.roles.owner");
      case WorkspaceMemberRole.ADMIN:
        return t("members.roles.admin");
      case WorkspaceMemberRole.MEMBER:
        return t("members.roles.member");
      default:
        return role;
    }
  };

  const getStatusLabel = (
    status: WorkspaceMemberInviteStatus | null | undefined,
  ) => {
    if (!status) return null;
    switch (status) {
      case WorkspaceMemberInviteStatus.PENDING:
        return t("members.status.pending");
      case WorkspaceMemberInviteStatus.ACCEPTED:
        return t("members.status.accepted");
      case WorkspaceMemberInviteStatus.EXPIRED:
        return t("members.status.expired");
      default:
        return status;
    }
  };

  return (
    <Page
      title={t("members.title")}
      description={t("members.description")}
      actions={
        <Dialog open={inviteOpen} onOpenChange={handleInviteOpenChange}>
          <DialogTrigger asChild>
            <Button>{t("members.invite.button")}</Button>
          </DialogTrigger>
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                inviteForm.handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>{t("members.invite.title")}</DialogTitle>
                <DialogDescription>
                  {t("members.invite.description")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <inviteForm.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? t("members.form.email.required") : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="email">{t("members.form.email.label")}</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("members.form.email.placeholder")}
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
                </inviteForm.Field>

                <inviteForm.Field name="role">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="role">{t("members.form.role.label")}</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as WorkspaceMemberRole)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("members.form.role.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={WorkspaceMemberRole.MEMBER}>
                            {t("members.roles.member")}
                          </SelectItem>
                          <SelectItem value={WorkspaceMemberRole.ADMIN}>
                            {t("members.roles.admin")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </inviteForm.Field>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleInviteOpenChange(false)}
                >
                  {t("common.cancel")}
                </Button>
                <inviteForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? t("members.invite.sending") : t("members.invite.submit")}
                    </Button>
                  )}
                </inviteForm.Subscribe>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: t("members.table.name"),
            cell: ({ row }) => {
              const member = row.original;
              return (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {member.user?.name ?? member.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {member.user?.email ?? member.email}
                  </span>
                </div>
              );
            },
          },
          {
            accessorKey: "role",
            header: t("members.table.role"),
            cell: ({ row }) => {
              const member = row.original;
              if (member.role === WorkspaceMemberRole.OWNER) {
                return (
                  <span className="text-muted-foreground">
                    {getRoleLabel(member.role)}
                  </span>
                );
              }
              return (
                <Select
                  value={member.role}
                  onValueChange={(value) =>
                    handleRoleChange(member.id, value as WorkspaceMemberRole)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={WorkspaceMemberRole.MEMBER}>
                      {t("members.roles.member")}
                    </SelectItem>
                    <SelectItem value={WorkspaceMemberRole.ADMIN}>
                      {t("members.roles.admin")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              );
            },
          },
          {
            accessorKey: "inviteStatus",
            header: t("members.table.status"),
            cell: ({ row }) => {
              const status = row.original.inviteStatus;
              if (!status)
                return <span className="text-muted-foreground">{t("members.status.active")}</span>;
              return (
                <span
                  className={
                    status === WorkspaceMemberInviteStatus.PENDING
                      ? "text-yellow-600"
                      : status === WorkspaceMemberInviteStatus.EXPIRED
                        ? "text-red-600"
                        : "text-green-600"
                  }
                >
                  {getStatusLabel(status)}
                </span>
              );
            },
          },
          {
            accessorKey: "createdAt",
            header: t("members.table.joined"),
            cell: ({ row }) => {
              return dayjs(row.original.createdAt).format("YYYY-MM-DD");
            },
          },
          {
            id: "actions",
            cell: ({ row }) => {
              const member = row.original;
              if (member.role === WorkspaceMemberRole.OWNER) {
                return null;
              }
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      {t("members.remove")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          },
        ]}
        data={members}
      />
    </Page>
  );
}

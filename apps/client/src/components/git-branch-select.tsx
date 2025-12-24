import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Check, ChevronsUpDown, GitBranchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { graphql } from "@/gql";
import { cn } from "@/lib/utils";

const GET_GIT_BRANCHES_QUERY = graphql(`
  query GetGitBranchesForSelect(
    $gitProviderId: ID!
    $owner: String!
    $repo: String!
  ) {
    gitProvider(id: $gitProviderId) {
      id
      repository(owner: $owner, repo: $repo) {
        id
        branches
      }
    }
  }
`);

interface GitBranchSelectProps {
  gitProviderId: string;
  owner: string;
  repo: string;
  value?: string;
  onChange?: (branchName: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export function GitBranchSelect({
  gitProviderId,
  owner,
  repo,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled = false,
}: GitBranchSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data, loading } = useQuery(GET_GIT_BRANCHES_QUERY, {
    variables: {
      gitProviderId,
      owner,
      repo,
    },
    skip: !gitProviderId || !owner || !repo,
    fetchPolicy: "cache-and-network",
  });

  const branches = data?.gitProvider?.repository?.branches ?? [];
  const filteredBranches = query
    ? branches.filter((branch) =>
        branch.toLowerCase().includes(query.toLowerCase()),
      )
    : branches;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || (loading && branches.length === 0)}
        >
          <span className="flex items-center gap-2 truncate">
            {value ? (
              <>
                <GitBranchIcon className="h-3 w-3" />
                <span className="truncate">{value}</span>
              </>
            ) : (
              placeholder ?? t("service.source.form.branch.placeholder")
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder ?? t("service.source.form.branch.searchPlaceholder")}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? t("common.loading") : t("service.source.form.branch.noResults")}
            </CommandEmpty>
            <CommandGroup>
              {filteredBranches.map((branch) => (
                <CommandItem
                  key={branch}
                  value={branch}
                  onSelect={() => {
                    onChange?.(branch);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2 truncate">
                    <GitBranchIcon className="h-3 w-3" />
                    <span className="truncate">{branch}</span>
                  </span>
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === branch ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

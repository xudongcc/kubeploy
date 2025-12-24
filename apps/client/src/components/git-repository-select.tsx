import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Check, ChevronsUpDown } from "lucide-react";
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

const GET_GIT_REPOSITORIES_QUERY = graphql(`
  query GetGitRepositoriesForSelect(
    $gitProviderId: ID!
    $page: Int
    $perPage: Int
    $search: String
  ) {
    gitProvider(id: $gitProviderId) {
      id
      repositories(page: $page, perPage: $perPage, search: $search) {
        id
        name
        fullName
        owner
        defaultBranch
        htmlUrl
      }
    }
  }
`);

export interface GitRepository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
  htmlUrl: string;
}

interface GitRepositorySelectProps {
  gitProviderId: string;
  value?: GitRepository | null;
  onChange?: (repo: GitRepository) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export function GitRepositorySelect({
  gitProviderId,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled = false,
}: GitRepositorySelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, loading } = useQuery(GET_GIT_REPOSITORIES_QUERY, {
    variables: {
      gitProviderId,
      perPage: 30,
      search: debouncedQuery || undefined,
    },
    skip: !gitProviderId,
    fetchPolicy: "cache-and-network",
  });

  const repositories = data?.gitProvider?.repositories ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || (loading && repositories.length === 0)}
        >
          <span className="truncate">
            {value ? value.fullName : (placeholder ?? t("service.source.form.repository.placeholder"))}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder ?? t("service.source.form.repository.searchPlaceholder")}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? t("common.loading") : t("service.source.form.repository.noResults")}
            </CommandEmpty>
            <CommandGroup>
              {repositories.map((repo) => (
                <CommandItem
                  key={repo.id}
                  value={repo.fullName}
                  onSelect={() => {
                    onChange?.({
                      id: repo.id,
                      name: repo.name,
                      fullName: repo.fullName,
                      owner: repo.owner,
                      defaultBranch: repo.defaultBranch,
                      htmlUrl: repo.htmlUrl,
                    });
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <span className="truncate">{repo.fullName}</span>
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value?.id === repo.id ? "opacity-100" : "opacity-0",
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

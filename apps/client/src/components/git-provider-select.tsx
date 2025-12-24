import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Check, ChevronsUpDown } from "lucide-react";

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

const GET_GIT_PROVIDERS_QUERY = graphql(`
  query GetGitProvidersForSelect($query: String) {
    gitProviders(query: $query, first: 20) {
      edges {
        node {
          id
          name
          type
        }
      }
    }
  }
`);

interface GitProviderSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function GitProviderSelect({
  value,
  onChange,
  placeholder = "Select provider...",
}: GitProviderSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, loading } = useQuery(GET_GIT_PROVIDERS_QUERY, {
    variables: {
      query: debouncedQuery || undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const providers =
    data?.gitProviders?.edges?.map((edge) => edge.node) ?? [];
  const selectedProvider = providers.find((provider) => provider.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading && providers.length === 0}
        >
          {selectedProvider ? selectedProvider.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search provider..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No provider found.</CommandEmpty>
            <CommandGroup>
              {providers.map((provider) => (
                <CommandItem
                  key={provider.id}
                  value={provider.name}
                  onSelect={() => {
                    onChange?.(provider.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <span className="truncate">{provider.name}</span>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === provider.id ? "opacity-100" : "opacity-0",
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

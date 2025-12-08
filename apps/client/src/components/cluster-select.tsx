import { useState } from "react";
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
import { useParams } from "@tanstack/react-router";

const GET_CLUSTERS_QUERY = graphql(`
  query GetClustersForSelect($workspaceId: ID!) {
    workspace(id: $workspaceId) {
      clusters(first: 20) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`);

interface ClusterSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function ClusterSelect({
  value,
  onChange,
  placeholder = "Select cluster...",
}: ClusterSelectProps) {
  const [open, setOpen] = useState(false);

  const workspaceId = useParams({
    from: "/_authenticated/workspaces/$workspaceId",
    select: (params) => params.workspaceId,
  });

  const { data } = useQuery(GET_CLUSTERS_QUERY, {
    variables: {
      workspaceId: workspaceId,
    },
  });

  const clusters =
    data?.workspace?.clusters?.edges.map((edge) => edge.node) || [];
  const selectedCluster = clusters.find((cluster) => cluster.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCluster ? selectedCluster.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search cluster..." />
          <CommandList>
            <CommandEmpty>No cluster found.</CommandEmpty>
            <CommandGroup>
              {clusters.map((cluster) => (
                <CommandItem
                  key={cluster.id}
                  value={cluster.name}
                  onSelect={() => {
                    onChange?.(cluster.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <span className="truncate">{cluster.name}</span>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === cluster.id ? "opacity-100" : "opacity-0",
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

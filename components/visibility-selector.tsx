"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { Check, ChevronDownIcon, GlobeIcon, LockIcon } from "lucide-react";

export type VisibilityType = "private" | "public";

export type Visibility = {
  id: VisibilityType;
  label: string;
  description: string;
  icon: ReactNode;
};

const visibilities: Array<{
  id: VisibilityType;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    id: "private",
    label: "Private",
    description: "Only you can access this quiz",
    icon: <LockIcon />,
  },
  {
    id: "public",
    label: "Public",
    description: "Anyone with the link can access this quiz",
    icon: <GlobeIcon />,
  },
];

export function VisibilitySelector({
  quizId,
  className,
  initialVisibilityId,
  isReadonly,
}: {
  quizId: string;
  initialVisibilityId: VisibilityType;
  isReadonly: boolean;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>();

  const updateVisibility = async (newVisibility: Visibility) => {
    try {
      const response = await fetch("/api/quiz", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "visibility",
          quizId,
          visibility: newVisibility.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  useEffect(() => {
    const initialVisibility = visibilities.find(
      (visibility) => visibility.id === initialVisibilityId,
    );
    setVisibility(initialVisibility);
  }, [initialVisibilityId]);

  if (isReadonly) {
    return (
      <Button
        variant="outline"
        className="md:flex md:px-2 md:h-[34px] bg-[#E8F4FC] rounded-xl"
      >
        {visibility?.icon}
        {visibility?.label}
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground bg-[#E8F4FC] rounded-xl",
          className,
        )}
      >
        <Button variant="outline" className="md:flex md:px-2 md:h-[34px]">
          {visibility?.icon}
          {visibility?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-[300px] bg-[#E8F4FC] rounded-xl"
      >
        {visibilities.map((hvisibility) => (
          <DropdownMenuItem
            key={hvisibility.id}
            onSelect={async () => {
              setVisibility(hvisibility);
              setOpen(false);
              await updateVisibility(hvisibility);
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={hvisibility.id === visibility?.id}
          >
            <div className="flex flex-col gap-1 items-start">
              {hvisibility.label}
              {hvisibility.description && (
                <div className="text-xs text-muted-foreground">
                  {hvisibility.description}
                </div>
              )}
            </div>
            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <Check />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

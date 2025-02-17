"use client";

import { ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { Check, ChevronDownIcon, GlobeIcon, LockIcon } from "lucide-react";
import { useQuizVisibility } from "@/hooks/use-quiz-visibility";

export type VisibilityType = "private" | "public";

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
  selectedVisibilityType,
}: {
  quizId: string;
  selectedVisibilityType: VisibilityType;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

  const { visibilityType, setVisibilityType } = useQuizVisibility({
    quizId,
    initialVisibility: selectedVisibilityType,
  });

  const selectedVisibility = useMemo(
    () => visibilities.find((visibility) => visibility.id === visibilityType),
    [visibilityType],
  );

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
          {selectedVisibility?.icon}
          {selectedVisibility?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-[300px] bg-[#E8F4FC] rounded-xl"
      >
        {visibilities.map((visibility) => (
          <DropdownMenuItem
            key={visibility.id}
            onSelect={() => {
              setVisibilityType(visibility.id);
              setOpen(false);
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={visibility.id === visibilityType}
          >
            <div className="flex flex-col gap-1 items-start">
              {visibility.label}
              {visibility.description && (
                <div className="text-xs text-muted-foreground">
                  {visibility.description}
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

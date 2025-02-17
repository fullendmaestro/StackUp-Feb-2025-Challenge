"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  Music,
  LogOut,
  User,
  PlusIcon,
  MoreHorizontalIcon,
  ShareIcon,
  LockIcon,
  Check,
  GlobeIcon,
  TrashIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VisibilitySelector, VisibilityType } from "./visibility-selector";

const quizzes = [
  { id: 1, name: "Basic Arithmetic" },
  { id: 2, name: "Algebra Fundamentals" },
  { id: 3, name: "Geometry Basics" },
  { id: 4, name: "Trigonometry 101" },
  { id: 5, name: "Statistics Intro" },
];

export function Header({
  selectedVisibilityType,
  quizId,
  isReadonly,
}: {
  selectedVisibilityType: VisibilityType;
  quizId: string;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMusicOn, setIsMusicOn] = useState(true);

  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
    // TODO: Implement actual music toggling logic
  };

  return (
    <header className="top-0 z-50 w-full absolute border-b bg-[#E8F4FC]/95 backdrop-blur supports-[backdrop-filter]:bg-[#E8F4FC]/60">
      <div className="container flex h-16 items-center justify-between mx-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/QUIZY-logo.svg" alt="logo" width={100} height={60} />
          <VisibilitySelector
            quizId={quizId}
            selectedVisibilityType={selectedVisibilityType}
            className="order-1 md:order-3 bg-[#E8F4FC]"
          />
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0 bg-[#E8F4FC] rounded-xl"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
          >
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Button>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="rounded-xl bg-[#E8F4FC]">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-lg font-semibold mb-4">
                  Available Quizzes
                </h2>
                <ul className="space-y-2">
                  {quizzes.map((quiz) => (
                    <li key={quiz.id} className="flex justify-between">
                      <Link
                        href={`/quiz/${quiz.id}`}
                        className="text-blue-600 hover:underline "
                      >
                        {quiz.name}
                      </Link>
                      <DropdownMenu modal={true}>
                        <DropdownMenuTrigger asChild>
                          <MoreHorizontalIcon />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          side="bottom"
                          align="end"
                          className="rounded-xl bg-[#E8F4FC]"
                        >
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer">
                              <ShareIcon />
                              <span>Share</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="rounded-xl bg-[#E8F4FC]">
                                <DropdownMenuItem
                                  className="cursor-pointer flex-row justify-between"
                                  onClick={() => {
                                    // setVisibilityType("private");
                                  }}
                                >
                                  <div className="flex flex-row gap-2 items-center">
                                    <LockIcon size={12} />
                                    <span>Private</span>
                                  </div>
                                  {selectedVisibilityType === "private" ? (
                                    <Check />
                                  ) : null}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer flex-row justify-between"
                                  onClick={() => {
                                    // setVisibilityType("public");
                                  }}
                                >
                                  <div className="flex flex-row gap-2 items-center">
                                    <GlobeIcon />
                                    <span>Public</span>
                                  </div>
                                  {selectedVisibilityType === "public" ? (
                                    <Check />
                                  ) : null}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
                            onSelect={
                              () => 3
                              // onDelete(chat.id)
                            }
                          >
                            <TrashIcon />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      <span>John Doe</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#E8F4FC] rounded-xl"
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleMusic}>
                      <Music className="mr-2 h-4 w-4" />
                      <span>
                        {isMusicOn ? "Turn Off Music" : "Turn On Music"}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

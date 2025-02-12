"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu, Music, LogOut, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const quizzes = [
  { id: 1, name: "Basic Arithmetic" },
  { id: 2, name: "Algebra Fundamentals" },
  { id: 3, name: "Geometry Basics" },
  { id: 4, name: "Trigonometry 101" },
  { id: 5, name: "Statistics Intro" },
];

export function Header() {
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
          <Image
            src="https://qgame3ccfcbtygae.public.blob.vercel-storage.com/QUIZY-logo%20(2)-BFbyUywBHJ3n9zIycKkWQPsntrHIbx.svg"
            alt="logo"
            width={100}
            height={60}
          />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-lg font-semibold mb-4">
                  Available Quizzes
                </h2>
                <ul className="space-y-2">
                  {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                      <Link
                        href={`/quiz/${quiz.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {quiz.name}
                      </Link>
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
                  <DropdownMenuContent align="end">
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

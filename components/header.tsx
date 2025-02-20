import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useState, useEffect } from "react";
import {
  Menu,
  Music,
  LogOut,
  User as UserIcon,
  PlusIcon,
  MoreHorizontalIcon,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VisibilitySelector, VisibilityType } from "./visibility-selector";

export function Header({
  selectedVisibilityType,
  quizId,
  isReadonly,
  user,
  isMusicOn,
  onToggleMusic,
}: {
  selectedVisibilityType: VisibilityType;
  quizId: string;
  isReadonly: boolean;
  user: User | undefined;
  isMusicOn: boolean;
  onToggleMusic: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [quizzes, setQuizzes] = useState<Array<{ id: string; name: string }>>(
    [],
  );

  const toggleMusic = () => {
    onToggleMusic();
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quiz?id=${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId),
      );
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();
        const mappedQuizzes = data.map((quiz: any) => ({
          id: quiz.id,
          name: quiz.title,
        }));
        setQuizzes(mappedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <header className="top-0 z-50 w-full absolute border-b bg-[#E8F4FC]/95 backdrop-blur supports-[backdrop-filter]:bg-[#E8F4FC]/60">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-4xl px-4">
        <div className="flex items-center space-x-4 order-1 md:order-3">
          <Button
            variant="outline"
            className="md:px-2 px-2 md:h-fit bg-[#E8F4FC] rounded-xl"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
          >
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Button>
          <VisibilitySelector
            quizId={quizId}
            initialVisibilityId={selectedVisibilityType}
            isReadonly={isReadonly}
            className="bg-[#E8F4FC]"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="rounded-xl bg-[#E8F4FC]">
            <div className="flex flex-col h-full">
              <div className="flex-grow flex flex-col">
                <h2 className="text-lg font-semibold mb-4 h-8">
                  Available Quizzes
                </h2>
                <ul className="space-y-2 flex-grow overflow-y-auto h-1">
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
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          side="bottom"
                          align="end"
                          className="rounded-xl bg-[#E8F4FC]"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
                            onSelect={() => deleteQuiz(quiz.id)}
                          >
                            <TrashIcon className="h-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
                <div className="h-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span className="truncate">{user?.email}</span>
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <button
                          type="button"
                          className="w-full cursor-pointer"
                          onClick={() => {
                            signOut({
                              redirectTo: "/",
                            });
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                        {/* <span>Log out</span> */}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

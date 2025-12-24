import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";
import { auth } from "@clerk/nextjs/server";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  Menu,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import ModeToggle from "./ui/mode-toggle";
import { CheckUser } from "@/lib/checkUser";

export default async function Header() {
  await CheckUser();
  const { userId } = await auth();

  return (
    <header className="w-full border-b border-white/10 dark:border-white/10 backdrop-blur-md sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo1.png"
              alt="Karero AI Coach Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <h1 className="text-black dark:text-white font-semibold text-lg tracking-tight leading-none">
              Karero AI
            </h1>
          </Link>

          <SignedOut>
            <div className="hidden md:flex items-center gap-6 ml-6 mt-1 text-[17px] font-medium">
              <Link href="/#home" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
              <Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground">Testimonials</Link>
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
              <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
            </div>
          </SignedOut>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            <SignedOut>
              <SignUpButton>
                <Button variant="primary" className="rounded-full px-6 py-2">Sign Up</Button>
              </SignUpButton>
            </SignedOut>

            <SignedOut>
              <SignInButton>
                <Button variant="primary" className="rounded-full px-6 py-2">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline" className="items-center gap-2 whitespace-nowrap cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" /> Industry Insights
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2 cursor-pointer">
                    <StarsIcon className="h-4 w-4" />
                    Growth Tools
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/resume" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="h-4 w-4" /> Build Resume
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/ai-cover-letter" className="flex items-center gap-2 cursor-pointer">
                      <PenBox className="h-4 w-4" /> Cover Letter
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/interview" className="flex items-center gap-2 cursor-pointer">
                      <GraduationCap className="h-4 w-4" /> Interview Prep
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "shadow-xl",
                    userPreviewMainIdentifier: "font-semibold",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="w-7 h-7 text-black dark:text-white" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72 bg-background">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 ml-4 flex flex-col gap-3">
          <ModeToggle />

          <SignedOut>
            <Link href="/#home" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
            <Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground">Testimonials</Link>
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
            <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>

            <SignUpButton>
              <Button variant="primary" className="w-full mt-2">Sign Up</Button>
            </SignUpButton>

            <SignInButton>
              <Button variant="primary" className="w-full mt-2">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button className="w-full flex items-center gap-2 cursor-pointer">
                <LayoutDashboard className="h-4 w-4" /> Industry Insights
              </Button>
            </Link>

            <div className="flex flex-col gap-3 mt-4">
              <Link href="/resume" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                <FileText className="h-4 w-4" /> Build Resume
              </Link>

              <Link href="/ai-cover-letter" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                <PenBox className="h-4 w-4" /> Cover Letter
              </Link>

              <Link href="/interview" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                <GraduationCap className="h-4 w-4" /> Interview Prep
              </Link>
            </div>

            <div className="mt-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
}

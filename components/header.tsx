import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 dark:border-white/10 backdrop-blur-md sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-5">

        {/* LEFT: Logo + Nav Items */}
        <div className="flex items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo1.png"
              alt="Karero AI Coach Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />

            {/* Brand Name */}
            <h1 className="text-black dark:text-white font-semibold text-lg tracking-tight leading-none">
              Karero AI
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 ml-6">
            <Link
              href="/home"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition"
            >
              Home
            </Link>

            <Link
              href="/pricing"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition"
            >
              Pricing
            </Link>

            <Link
              href="/features"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition"
            >
              Features
            </Link>

            <Link
              href="/about"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition"
            >
              About
            </Link>
          </div>
        </div>

        {/* RIGHT: Buttons + Clerk */}
        <div className="flex items-center gap-4">

          {/* Sign Up + Sign In */}
          <div className="hidden md:flex items-center gap-3 mr-4">
            <Button
              variant="primary"
              className="text-gray-300 hover:text-white px-6 py-2 rounded-full"
            >
              Sign Up
            </Button>

            <SignedOut>
              <SignInButton>
                <Button
                  variant="primary"
                  className="rounded-full px-6 py-2"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Growth Tools + Dashboard + User */}
          <div className="flex items-center gap-4">
            <SignedIn>

              {/* Dashboard */}
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Industry Insights
                </Button>

                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </Link>

              {/* Growth Tools Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2 whitespace-nowrap">
                    <StarsIcon className="h-4 w-4" />
                    <span className="hidden md:block">Growth Tools</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/resume" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Build Resume
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/ai-cover-letter" className="flex items-center gap-2">
                      <PenBox className="h-4 w-4" />
                      Cover Letter
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/interview" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Interview Prep
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>

            {/* User Button */}
            <SignedIn>
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
        </div>
      </nav>
    </header>
  );
}

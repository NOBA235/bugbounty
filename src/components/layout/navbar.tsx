"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bug, Flame, Trophy, User, Crosshair } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrCreateUser } from "@/lib/storage";
import type { UserStats } from "@/types/user";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserStats | null>(null);
  useEffect(() => { setUser(getOrCreateUser()); }, [pathname]);
  if (pathname === "/" || pathname.startsWith("/hunt")) return null;
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0a0a0b]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Bug className="h-5 w-5 text-violet-400" />
            <span>bugbounty<span className="text-violet-400">.ai</span></span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { href: "/dashboard", label: "Hunt", icon: Crosshair },
              { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
              { href: "/profile", label: "Profile", icon: User },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${pathname.startsWith(href) ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}>
                <Icon className="h-4 w-4" />{label}
              </Link>
            ))}
          </nav>
        </div>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden font-mono text-violet-400 sm:inline">{user.xp.toLocaleString()} XP</span>
            {user.streak > 0 && (
              <span className="flex items-center gap-1 text-amber-400"><Flame className="h-4 w-4" />{user.streak}x</span>
            )}
            <Link href="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">
              {user.username.slice(0, 2).toUpperCase()}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

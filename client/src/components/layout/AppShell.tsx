import { BookOpen, Bookmark, FilePenLine, Files, Search, Tags } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Posts", to: "/posts", icon: Files },
  { label: "Search", to: "/posts/search", icon: Search },
  { label: "Drafts", to: "/posts/drafts", icon: FilePenLine },
  { label: "Bookmarks", to: "/posts/bookmarks", icon: Bookmark },
  { label: "Categories", to: "/categories", icon: Tags },
];

export const AppShell = () => (
  <div className="min-h-screen bg-background">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-white p-5 lg:block">
      <NavLink className="mb-8 flex items-center gap-3" to="/">
        <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary text-white">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-xl font-bold text-foreground">Journal</span>
      </NavLink>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive && "bg-primary-soft text-primary",
              )
            }
            key={item.to}
            to={item.to}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>

    <div className="lg:pl-72">
      <header className="sticky top-0 z-20 border-b border-border bg-white/90 px-5 py-4 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <NavLink className="flex items-center gap-3" to="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary text-white">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold text-foreground">Journal</span>
          </NavLink>
          <Button asChild size="sm">
            <NavLink to="/posts/new">New post</NavLink>
          </Button>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-[14px] px-3 py-2 text-sm font-semibold text-muted-foreground",
                  isActive && "bg-primary-soft text-primary",
                )
              }
              key={item.to}
              to={item.to}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Outlet />
    </div>
  </div>
);

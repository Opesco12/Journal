import { ArrowRight, BookOpen, Clock3, Edit3, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const featuredPosts = [
  {
    title: "Build a calmer writing ritual",
    excerpt: "Turn half-formed notes into polished essays with a flow that keeps ideas moving.",
    category: "Writing",
    readTime: "4 min read",
  },
  {
    title: "Designing a useful archive",
    excerpt: "Organize posts by intent, not clutter, so readers find what matters faster.",
    category: "Publishing",
    readTime: "6 min read",
  },
  {
    title: "Keep your drafts alive",
    excerpt: "A lightweight system for saving fragments, references, and working titles.",
    category: "Workflow",
    readTime: "5 min read",
  },
];

const features = [
  {
    icon: Edit3,
    title: "Write without friction",
    description: "Compose, revise, and prepare posts in a focused publishing workspace.",
  },
  {
    icon: Search,
    title: "Make ideas findable",
    description: "Categories, search, and clean metadata keep every article within reach.",
  },
  {
    icon: Sparkles,
    title: "Publish with polish",
    description: "A refined reading experience keeps the focus on the story and the writer.",
  },
];

const HomePage = () => (
  <main className="min-h-screen overflow-hidden bg-background">
    <header className="border-b border-border/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link className="flex items-center gap-3" to="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary text-white shadow-[0_10px_26px_rgba(37,99,235,0.24)]">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">Journal</span>
        </Link>

        <div className="hidden items-center gap-9 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/posts">Posts</Link>
          <a href="#features">Features</a>
          <Link to="/categories">Categories</Link>
          <a href="#latest">Preview</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild className="hidden sm:inline-flex" variant="ghost" size="sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </nav>
    </header>

    <section className="relative border-b border-border/80 bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(#e8f1ff_1px,transparent_1px),linear-gradient(90deg,#e8f1ff_1px,transparent_1px)] bg-[size:72px_72px] opacity-60" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-24">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Modern publishing
          </div>
          <h1 className="text-balance text-5xl font-bold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            A clean home for thoughtful writing.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground lg:mx-0">
            Journal gives writers a calm place to publish ideas, grow an audience, and keep every article beautifully organized.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild size="lg">
              <Link to="/signup">
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/posts">View posts</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute -inset-4 rounded-[32px] bg-primary/10 blur-2xl" />
          <Card className="relative overflow-hidden rounded-[30px] border-primary/20 shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
            <div className="h-48 bg-primary-soft sm:h-64">
              <img
                alt="Desk workspace for writing"
                className="h-full w-full object-cover"
                src={heroImage}
              />
            </div>
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">Featured draft</p>
                  <h2 className="mt-2 text-2xl font-bold text-foreground">How small notes become strong essays</h2>
                </div>
                <span className="hidden rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary sm:inline-flex">
                  Editorial
                </span>
              </div>
              <p className="leading-7 text-muted-foreground">
                Shape drafts, collect references, and publish articles with a reading experience that feels considered from the first line.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {["42 articles", "8 categories", "12 drafts"].map((item) => (
                  <div className="rounded-[18px] border border-border bg-muted/70 p-4 text-sm font-semibold text-foreground" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8" id="features">
      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <Card className="rounded-[24px]" key={feature.title}>
            <CardContent className="p-6">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary-soft text-primary">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{feature.title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section className="bg-[#111827] px-5 py-20 text-white sm:px-8" id="latest">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">From the blog</p>
          <h2 className="mt-4 text-4xl font-bold tracking-normal sm:text-5xl">Latest articles</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            A preview of the writing experience readers will meet inside Journal.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <article className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6" key={post.title}>
              <div className="mb-8 h-48 rounded-[18px] bg-[linear-gradient(135deg,#1d4ed8,#111827_60%,#020617)]" />
              <div className="mb-4 flex items-center gap-3 text-sm text-slate-400">
                <span className="rounded-full bg-white/8 px-3 py-1 font-semibold text-slate-200">{post.category}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-2xl font-bold leading-tight">{post.title}</h3>
              <p className="mt-4 leading-7 text-slate-400">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-20 sm:px-8" id="newsletter">
      <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[28px] border border-border bg-white p-8 text-center shadow-sm sm:p-12">
        <h2 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">Start publishing with a cleaner rhythm.</h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Create an account and turn your first idea into a published article.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/signup">Create account</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </section>
  </main>
);

export default HomePage;

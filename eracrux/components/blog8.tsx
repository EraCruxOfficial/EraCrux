import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
  tags?: string[];
}

interface Blog8Props {
  heading?: string;
  description?: string;
  posts?: Post[];
}

const Blog8 = ({
  heading = "Our Blogs",
  description = "Explore our latest blog posts on data analytics, tools, and insights to support local small businesses.",
  posts = [
    {
      id: "post-1",
      title:
        "Top Data Analytics Tools to Master in 2025",
      summary:
        "In today's fast-paced world, data analytics is at the forefront of decision-making processes, helping businesses drive growth and innovation. With 2025 on the horizon, it's crucial to stay updated on the top data analytics tools that can revolutionize your approach to supporting local small businesses. Whether you're a business owner, a data analyst, or someone keen to learn about the latest tools in data analytics, this comprehensive guide will give you the insights you need.",
      label: "Analytics",
      author: "Lakshita Gupta",
      published: "15 July 2025",
      url: "https://eracrux.hashnode.dev/top-data-analytics-tools-to-master-in-2025",
      image: "/googledash.png",
      tags: ["Tools", "Analytics", "Data Science"],
    },
    {
      id: "post-2",
      title: "Introduction to Data Analytics- A Beginner's Guide",
      summary: "Welcome to the world of data analytics, an exciting field that transforms raw data into actionable insights. In today's fast-paced digital era, data analytics has become an indispensable tool for businesses, governments, and individuals alike. Whether you're a budding entrepreneur or a seasoned professional, understanding data analytics can empower you to make informed decisions, enhance performance, and drive success. This guide will walk you through the essentials of data analytics, offering practical tips and real world examples, while emphasizing the significance of supporting local small businesses.",
      label: "Beginner's Guide",
      author: "Rashi Gupta",
      published: "22 June 2025",
      url: "https://eracrux.hashnode.dev/introduction-to-data-analytics-a-beginners-guide",
      image: "/blog1.png",
      tags: ["Beginner's Guide", "Data Analytics"],
    },
  ],
}: Blog8Props) => {
  return (
    <section className="relative z-20 max-w-7xl pb-10 lg:pb-40 mx-auto px-4 sm:px-6 lg:px-8" style={{fontFamily:'Poppins, sans-serif'}}>
      <div className="container flex flex-col items-center gap-16">
        <div className="text-center">
          <h2 className="mx-auto mb-6 text-3xl font-semibold text-pretty md:text-4xl lg:max-w-3xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg" style={{fontFamily:'Inter, sans-serif'}}>
            {description}
          </p>
        </div>

        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
            >
              <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                <div className="sm:col-span-5">
                  <div className="mb-4 md:mb-6">
                    <div className="flex flex-wrap gap-3 text-xs tracking-wider text-muted-foreground uppercase md:gap-5 lg:gap-6">
                      {post.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                    <a
                      href={post.url}
                      target="_blank"
                      className="hover:underline"
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-4 text-muted-foreground md:mt-5" style={{fontFamily:'Inter, sans-serif'}}>
                    {post.summary.split(" ").length > 40
                      ? post.summary.split(" ").slice(0, 40).join(" ") + "..."
                      : post.summary}
                  </p>
                  <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                    <span className="text-muted-foreground">{post.author}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {post.published}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center space-x-2 md:mt-8">
                    <a
                      href={post.url}
                      target="_blank"
                      className="inline-flex items-center font-semibold hover:underline md:text-base"
                    >
                      <span>Read more</span>
                      <ArrowRight className="ml-2 size-4 transition-transform" />
                    </a>
                  </div>
                </div>
                <div className="order-first sm:order-last sm:col-span-5">
                  <a href={post.url} target="_blank" className="block">
                    <div className="aspect-16/9 overflow-clip rounded-lg border border-border">
                      <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog8 };

"use client";

import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post-card";
import { PostSkeleton } from "@/components/post-skeleton";
import { Post } from "@/lib/types";

const filters = ["all", "pending", "approved", "declined"] as const;

export function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = activeFilter !== "all" ? `?status=${activeFilter}` : "";
    const res = await fetch(`/api/posts${params}`);
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [activeFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div>
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-6">
        <TabsList className="bg-gray-100">
          {filters.map((f) => (
            <TabsTrigger key={f} value={f} className="capitalize">
              {f}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No posts found</p>
          <p className="text-sm mt-1">
            Head to <a href="/generate" className="text-blue-600 underline">Generate</a> to create some posts
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
          ))}
        </div>
      )}
    </div>
  );
}

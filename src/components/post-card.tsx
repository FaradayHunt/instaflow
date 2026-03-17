"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  approved: "bg-green-500/15 text-green-600 border-green-500/30",
  declined: "bg-red-500/15 text-red-600 border-red-500/30",
};

export function PostCard({
  post,
  onUpdate,
}: {
  post: Post;
  onUpdate: () => void;
}) {
  const [declining, setDeclining] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    await fetch(`/api/posts/${post.id}/approve`, { method: "POST" });
    setLoading(false);
    onUpdate();
  }

  async function handleDeclineSubmit() {
    if (!comment.trim()) return;
    setLoading(true);
    await fetch(`/api/posts/${post.id}/decline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    setLoading(false);
    setDeclining(false);
    setComment("");
    onUpdate();
  }

  const isDeclined = post.status === "declined";

  return (
    <Card className={`border rounded-2xl shadow-sm transition-shadow overflow-hidden ${isDeclined ? "bg-gray-50 opacity-70" : "bg-white hover:shadow-md"} border-gray-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-medium">
            {post.topic}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${statusColors[post.status]}`}
            >
              {post.status}
            </Badge>
            {post.version > 1 && (
              <Badge variant="secondary" className="text-xs">
                v{post.version}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
        {isDeclined && post.decline_comment && (
          <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs text-red-600 font-medium mb-1">Feedback:</p>
            <p className="text-xs text-red-700">{post.decline_comment}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex flex-col gap-3">
        {isDeclined ? (
          <p className="text-xs text-gray-400 w-full text-center py-1">
            Declined — awaiting rewrite
          </p>
        ) : declining ? (
          <div className="w-full space-y-2">
            <Textarea
              placeholder="What should be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-sm"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleDeclineSubmit}
                disabled={loading || !comment.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "Saving..." : "Submit"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setDeclining(false);
                  setComment("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={loading || post.status === "approved"}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              {loading ? "..." : "✅ Approve"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeclining(true)}
              disabled={loading}
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              ❌ Decline
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

import React from 'react';
import { Sparkles, Heart, MessageCircle, Share2 } from 'lucide-react';

export default function PostCard({ post }: { post: any; key?: React.Key }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900">{post.username}</h3>
          <p className="text-xs text-zinc-500">{new Date(post.created_at).toLocaleString()}</p>
        </div>
        {post.vibe && (
          <div className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
            <Sparkles size={12} /> {post.vibe}
          </div>
        )}
      </div>
      
      <p className="text-zinc-800 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
      
      <div className="flex items-center gap-6 pt-4 border-t border-zinc-100 text-zinc-500">
        <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
          <Heart size={18} /> <span className="text-sm font-medium">Like</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors">
          <MessageCircle size={18} /> <span className="text-sm font-medium">Comment</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors ml-auto">
          <Share2 size={18} /> <span className="text-sm font-medium">Share</span>
        </button>
      </div>
    </div>
  );
}

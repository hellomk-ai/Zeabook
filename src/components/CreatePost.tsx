import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

export default function CreatePost({ user, onPostCreated }: { user: any, onPostCreated: (post: any) => void }) {
  const [content, setContent] = useState('');
  const [vibe, setVibe] = useState('');
  const [isCheckingVibe, setIsCheckingVibe] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleVibeCheck = async () => {
    if (!content.trim()) return;
    setIsCheckingVibe(true);
    try {
      const res = await fetch('/api/ai/vibe-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setVibe(data.vibe);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingVibe(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content, vibe }),
      });
      const data = await res.json();
      onPostCreated(data);
      setContent('');
      setVibe('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 mb-6">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none bg-transparent border-none focus:ring-0 text-lg placeholder:text-zinc-400 min-h-[100px]"
          />
          
          {vibe && (
            <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
              <Sparkles size={14} /> AI Vibe: {vibe}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <button
              onClick={handleVibeCheck}
              disabled={isCheckingVibe || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
            >
              {isCheckingVibe ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              AI Vibe Check
            </button>
            
            <button
              onClick={handlePost}
              disabled={isPosting || !content.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {isPosting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

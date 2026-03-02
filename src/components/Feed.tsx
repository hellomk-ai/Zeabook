import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { Loader2, LogOut } from 'lucide-react';

export default function Feed({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">zeabook</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-600">Hi, {user.username}</span>
            <button
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <CreatePost user={user} onPostCreated={handlePostCreated} />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 bg-white rounded-2xl border border-zinc-100 shadow-sm">
            <p className="text-lg font-medium mb-2">No posts yet</p>
            <p className="text-sm">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

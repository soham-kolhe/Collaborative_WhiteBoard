import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBoards, createBoard, deleteBoard } from '../api/boards';
import { clearSession } from '../api/auth';
import type { Board, AppUser } from '../types';

interface DashboardProps {
  user: AppUser;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadBoards = useCallback(async () => {
    try {
      const data = await fetchBoards();
      setBoards(data);
    } catch {
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBoards(); }, [loadBoards]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const board = await createBoard(newName.trim());
      setBoards((prev) => [board, ...prev]);
      setNewName('');
      setShowCreate(false);
      navigate(`/board/${board.boardId}`);
    } catch {
      setError('Failed to create board');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (boardId: string) => {
    if (!window.confirm('Delete this board? This cannot be undone.')) return;
    setDeletingId(boardId);
    try {
      await deleteBoard(boardId);
      setBoards((prev) => prev.filter((b) => b.boardId !== boardId));
    } catch {
      setError('Failed to delete board');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background warm humanistic blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-rose-400/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
              </svg>
            </div>
            <span className="text-slate-900 font-bold text-lg tracking-tight">CollabBoard</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-500 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold uppercase">
                {user.userName[0]}
              </div>
              <span className="text-slate-700 text-sm font-medium">{user.userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 w-20 h-10 text-red-500 border border-slate-500 hover:text-red-500 text-sm rounded-xl hover:bg-slate-100 transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Title + Create button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.userName} 👋</h2>
            <p className="text-slate-500 text-sm mt-1">You have {boards.length} board{boards.length !== 1 ? 's' : ''} in your workspace.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowJoin(true); setShowCreate(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              Join Board
            </button>
            <button
              onClick={() => { setShowCreate(true); setShowJoin(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white font-medium rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Board
            </button>
          </div>
        </div>

        {/* Create Board Form */}
        {showCreate && (
          <div className="mb-8 bg-white border border-slate-400 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
            {/* Header Section */}
            <div className="gap-3 mb-6">
              <h3 className="text-slate-900 font-bold text-lg">Create New Board</h3>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
              {/* Floating-style Input */}
              <div className="flex-1 relative group">
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Board name (e.g. Sprint Planning)"
                  className="w-full bg-slate-50 border border-slate-400 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-slate-600 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="flex-1 sm:flex-none px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                >
                  {creating ? 'Creating…' : 'Create Board'}
                </button>

                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setNewName(''); }}
                  className="px-6 py-3.5 text-slate-500 hover:text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Join Board Form */}
        {showJoin && (
          <div className="mb-8 bg-white border border-slate-300 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
            <h3 className="text-slate-900 font-semibold mb-4">Join Existing Board</h3>
            <form onSubmit={(e) => { e.preventDefault(); if (joinId.trim()) navigate(`/board/${joinId.trim()}`); }} className="flex gap-3">
              <input
                autoFocus
                type="text"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                placeholder="Paste Room ID here..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
              />
              <button
                type="submit"
                disabled={!joinId.trim()}
                className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Join Board
              </button>
              <button
                type="button"
                onClick={() => { setShowJoin(false); setJoinId(''); }}
                className="px-4 py-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm shadow-sm">
            {error}
          </div>
        )}

        {/* Board Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm mb-4">No boards yet. Create your first board!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-medium rounded-xl transition-all"
            >
              Create Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boards.map((board) => (
              <div
                key={board._id}
                className="group bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1"
                onClick={() => navigate(`/board/${board.boardId}`)}
              >
                {/* Board preview placeholder */}
                <div className="h-28 rounded-xl bg-slate-900 border border-slate-800 mb-5 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate text-lg tracking-tight">{board.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Created {new Date(board.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(board.boardId);
                      }}
                      title="Copy Room ID"
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(board.boardId); }}
                      disabled={deletingId === board.boardId}
                      title="Delete board"
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

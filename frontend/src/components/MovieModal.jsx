import { useState, useEffect } from "react";
import { getMovieDetails } from "../services/api";

export default function MovieModal({ movieId, onClose, isInWatchlist, onToggleWatchlist }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    setError(false);
    getMovieDetails(movieId)
      .then((data) => { setMovie(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [movieId]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function formatRuntime(mins) {
    if (!mins) return "N/A";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl chat-scroll"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

        {/* ── Close button ─ */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── Loading ─ */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-80 gap-4">
            <div className="loading-spinner" />
            <p className="text-xs text-slate-500">Loading movie details...</p>
          </div>
        )}

        {/* ── Error ─ */}
        {error && (
          <div className="flex flex-col items-center justify-center h-80 text-slate-400 gap-3">
            <span className="text-5xl">😕</span>
            <p>Failed to load movie details</p>
            <button onClick={onClose} className="text-indigo-400 hover:text-indigo-300 cursor-pointer text-sm">
              Go back
            </button>
          </div>
        )}

        {/* ── Movie Content ─ */}
        {movie && !loading && !error && (
          <>
            {/* Hero / Backdrop */}
            <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden rounded-t-2xl">
              {movie.backdrop ? (
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.75) saturate(1.2)" }}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: "linear-gradient(135deg, #1e1b4b, #4c1d95, #1e1b4b)" }}
                />
              )}
              {/* 3D Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(6,8,20,1) 0%, rgba(6,8,20,0.5) 50%, rgba(0,0,0,0.2) 100%)",
                }}
              />

              {/* Floating poster + title */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end gap-4">
                {movie.poster && (
                  <div
                    className="hidden sm:block flex-shrink-0"
                    style={{
                      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      transform: "perspective(500px) rotateY(-4deg)",
                    }}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-20 h-28 object-cover block"
                    />
                  </div>
                )}
                <div>
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "Outfit, sans-serif", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
                  >
                    {movie.title}
                  </h2>
                  {movie.tagline && (
                    <p className="text-xs sm:text-sm text-slate-400 italic">"{movie.tagline}"</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Details body ─ */}
            <div className="p-5 sm:p-6" style={{ background: "rgba(6,8,20,0.97)" }}>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="rating-badge flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full">
                  ★ {movie.rating.toFixed(1)}
                </span>
                <span className="text-slate-500 text-xs">{movie.year}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 text-xs">{formatRuntime(movie.runtime)}</span>
                {movie.genres.length > 0 && (
                  <>
                    <span className="text-slate-600">·</span>
                    <div className="flex flex-wrap gap-1.5">
                      {movie.genres.map((g) => (
                        <span
                          key={g}
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: "rgba(99,102,241,0.12)",
                            border: "1px solid rgba(99,102,241,0.25)",
                            color: "#a5b4fc",
                          }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Watchlist button */}
              <button
                onClick={() => onToggleWatchlist(movie)}
                className="mb-5 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                style={isInWatchlist ? {
                  background: "linear-gradient(135deg, #4338ca, #6366f1)",
                  boxShadow: "0 4px 20px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                } : {
                  background: "rgba(15,20,40,0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                }}
              >
                <span>{isInWatchlist ? "★" : "☆"}</span>
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>

              {/* Overview */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">{movie.overview}</p>

              {/* Crew */}
              {movie.crew && movie.crew.length > 0 && (
                <div className="mb-6">
                  <h3
                    className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3"
                  >
                    Crew
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {movie.crew.map((c, i) => (
                      <div
                        key={`${c.id}-${i}`}
                        className="text-xs px-3 py-1.5 rounded-full"
                        style={{
                          background: "rgba(15,20,40,0.5)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span className="text-white font-medium">{c.name}</span>
                        <span className="text-slate-500 ml-1">· {c.job}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer */}
              {movie.videos && movie.videos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
                    {movie.videos[0].type === "Teaser" ? "Teaser" : "Trailer"}
                  </h3>
                  <div
                    className="relative rounded-xl overflow-hidden aspect-video"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
                  >
                    <iframe
                      src={movie.videos[0].url}
                      title={movie.videos[0].name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Cast */}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
                    Cast
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {movie.cast.map((c) => (
                      <div key={c.id} className="text-center group cursor-pointer">
                        {c.profile ? (
                          <div
                            className="rounded-xl overflow-hidden mb-1.5 transition-all duration-300"
                            style={{
                              border: "1px solid rgba(255,255,255,0.07)",
                              transform: "perspective(300px) rotateY(0deg)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "perspective(300px) rotateY(8deg) scale(1.04)";
                              e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                              e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "perspective(300px) rotateY(0deg) scale(1)";
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <img
                              src={c.profile}
                              alt={c.name}
                              loading="lazy"
                              className="w-full aspect-[2/3] object-cover block"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-full aspect-[2/3] rounded-xl flex items-center justify-center text-slate-500 text-xl mb-1.5"
                            style={{ background: "rgba(15,20,40,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
                          >
                            👤
                          </div>
                        )}
                        <p className="text-[10px] text-white truncate font-medium">{c.name}</p>
                        <p className="text-[9px] text-slate-500 truncate">{c.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

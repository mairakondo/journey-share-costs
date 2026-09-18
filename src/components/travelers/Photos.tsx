import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  GalleryHorizontal,
  Instagram,
  Play,
  Plus,
  Share2,
} from "lucide-react";

import { PhotoAssign } from "@/components/travelers/PhotoAssign";
import { PhotoImport } from "@/components/travelers/PhotoImport";
import { PhotoLightbox } from "@/components/travelers/PhotoLightbox";
import type { Photo, Stop } from "@/lib/types";
import { groupPhotosByStop } from "@/lib/trip-utils";

export function Photos({
  stops,
  photos,
  onUploadPhoto,
  onAssignPhoto,
  onDeletePhoto,
  onImported,
  tripLocked = false,
  tripLoading = false,
}: {
  stops: Stop[];
  photos: Photo[];
  onUploadPhoto: (file: File, day: number) => Promise<{ id: string }>;
  onAssignPhoto: (photoId: string, stopId: string | null, day: number) => void;
  onDeletePhoto: (photoId: string) => void;
  onImported?: (ids: string[]) => void;
  tripLocked?: boolean;
  tripLoading?: boolean;
}) {
  const [assigning, setAssigning] = useState<Photo | null>(null);
  const [viewing, setViewing] = useState<Photo | null>(null);
  const [importing, setImporting] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const [shareFormat, setShareFormat] = useState<"carousel" | "story">("carousel");
  const [shareStep, setShareStep] = useState<"select" | "building" | "preview" | "done">("select");
  const [shareSelected, setShareSelected] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [slide, setSlide] = useState(0);
  const days = Array.from(new Set(photos.map((p) => p.day))).sort((a, b) => a - b);

  const maxPhotos = shareFormat === "carousel" ? 9 : 6;
  const selectedPhotos = photos.filter((p) => shareSelected.includes(p.id));
  const carouselPhotos = selectedPhotos.slice(0, 9);
  const storyPhotos = selectedPhotos.slice(0, 6);

  const enterShare = () => {
    setShareFormat("carousel");
    setShareSelected(photos.slice(0, 9).map((p) => p.id));
    setShareStep("select");
    setShareMode(true);
  };
  const exitShare = () => {
    setShareMode(false);
    setShareSelected([]);
    setShareStep("select");
  };

  const toggleSelect = (id: string) =>
    setShareSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxPhotos) return prev;
      return [...prev, id];
    });

  const build = () => {
    setShareStep("building");
    setProgress(0);
    let i = 0;
    const tick = setInterval(() => {
      i += 8;
      setProgress(Math.min(i, 100));
      if (i >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          setSlide(0);
          setShareStep("preview");
        }, 350);
      }
    }, 90);
  };

  useEffect(() => {
    if (
      !shareMode ||
      shareStep !== "preview" ||
      shareFormat !== "story" ||
      storyPhotos.length === 0
    )
      return;
    const tick = setInterval(() => setSlide((s) => (s + 1) % storyPhotos.length), 1400);
    return () => clearInterval(tick);
  }, [shareMode, shareStep, shareFormat, storyPhotos.length]);

  useEffect(() => {
    if (!shareMode || shareStep !== "select") return;
    setShareSelected((prev) =>
      prev.filter((id) => photos.some((p) => p.id === id)).slice(0, maxPhotos),
    );
  }, [shareFormat]); // eslint-disable-line react-hooks/exhaustive-deps

  if (tripLocked) {
    return (
      <div className="empty-day mt-7">
        <p className="mb-3">Sign in to see and share this trip's photos.</p>
        <Link to="/sign-in" className="primary-action">
          Sign in
        </Link>
      </div>
    );
  }

  if (tripLoading) {
    return <p className="empty-day mt-7">Loading your photos…</p>;
  }

  return (
    <>
      <div className="section-heading photo-heading">
        <div>
          <p className="eyebrow">{shareMode ? "Share to Instagram" : "Shared memories"}</p>
          <h2>{shareMode ? "Select photos to share" : "Photo timeline"}</h2>
        </div>
        <div className="heading-actions">
          {shareMode && shareStep === "select" ? (
            <>
              <button className="cancel-link" onClick={exitShare}>
                Cancel
              </button>
            </>
          ) : !shareMode ? (
            <>
              <button className="scan-chip-ink" onClick={enterShare}>
                <Share2 size={16} /> Share
              </button>
              <button className="scan-chip" onClick={() => setImporting(true)}>
                <Plus size={16} /> Add
              </button>
            </>
          ) : null}
        </div>
      </div>

      {!shareMode && (
        <p className="gesture-hint">
          Photos are matched to itinerary activities by place, date and time. Tap a photo to view
          it, or move it to another activity.
        </p>
      )}
      {shareMode && shareStep === "select" && (
        <p className="gesture-hint">
          Tap the photos you want to share — up to {maxPhotos} for a{" "}
          {shareFormat === "carousel" ? "carousel" : "story"}. {shareSelected.length} selected.
        </p>
      )}

      {importing && (
        <PhotoImport
          onClose={() => setImporting(false)}
          onUploadPhoto={onUploadPhoto}
          onFinished={(ids) => onImported?.(ids)}
        />
      )}

      {shareMode && shareStep === "building" && (
        <div className="match-progress">
          <div className="match-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="gesture-hint">
            {shareFormat === "carousel"
              ? "Ordering your photos into a swipeable carousel…"
              : "Sequencing clips, adding captions and music…"}{" "}
            {progress}%
          </p>
        </div>
      )}

      {shareMode && shareStep === "preview" && (
        <>
          {shareFormat === "carousel" ? (
            <div className="ig-carousel">
              <div className="ig-carousel-stage">
                {carouselPhotos[slide] && (
                  <img
                    key={carouselPhotos[slide].id}
                    src={carouselPhotos[slide].src}
                    alt={`${carouselPhotos[slide].place} memory`}
                  />
                )}
                {slide > 0 && (
                  <button
                    className="ig-carousel-nav prev"
                    aria-label="Previous photo"
                    onClick={() => setSlide((s) => s - 1)}
                  >
                    <ChevronLeft size={22} />
                  </button>
                )}
                {slide < carouselPhotos.length - 1 && (
                  <button
                    className="ig-carousel-nav next"
                    aria-label="Next photo"
                    onClick={() => setSlide((s) => s + 1)}
                  >
                    <ChevronRight size={22} />
                  </button>
                )}
                <span className="ig-carousel-count">
                  {slide + 1}/{carouselPhotos.length}
                </span>
              </div>
              <div className="ig-carousel-dots">
                {carouselPhotos.map((p, i) => (
                  <i key={p.id} className={i === slide ? "on" : ""} onClick={() => setSlide(i)} />
                ))}
              </div>
              <div className="ig-carousel-caption">
                <p className="eyebrow">Tokyo escape</p>
                <b>{carouselPhotos[slide]?.place}</b>
                <small>
                  Day {(carouselPhotos[slide]?.day ?? 0) + 1} · {carouselPhotos[slide]?.time}
                </small>
              </div>
            </div>
          ) : (
            <div className="ig-story">
              <div className="ig-story-bars">
                {storyPhotos.map((p, i) => (
                  <i key={p.id} className={i <= slide ? "on" : ""} />
                ))}
              </div>
              {storyPhotos[slide] && (
                <img src={storyPhotos[slide].src} alt={`${storyPhotos[slide].place} memory`} />
              )}
              <div className="ig-story-caption">
                <p className="eyebrow">Tokyo escape</p>
                <b>{storyPhotos[slide]?.place}</b>
                <small>
                  <Play size={12} /> Day {(storyPhotos[slide]?.day ?? 0) + 1} ·{" "}
                  {storyPhotos[slide]?.time}
                </small>
              </div>
            </div>
          )}

          <div className="share-bar">
            <button className="money-action" onClick={() => setShareStep("done")}>
              <Instagram size={17} />{" "}
              {shareFormat === "carousel" ? "Share as post" : "Share to stories"}
            </button>
            <button className="cancel-text" onClick={exitShare}>
              Cancel
            </button>
          </div>
        </>
      )}

      {shareMode && shareStep === "done" && (
        <>
          <div className="share-done">
            <Check size={26} />
          </div>
          <p className="gesture-hint">
            Your {shareFormat === "carousel" ? "photo carousel" : "story video"} was handed to
            Instagram with the caption “Tokyo escape · 5 days, 5 friends”. Everyone on the trip gets
            a copy in the shared album.
          </p>
          <button className="money-action mt-4" onClick={exitShare}>
            <Check size={17} /> Done
          </button>
        </>
      )}

      {(!shareMode || shareStep === "select") && (
        <section className="photo-days">
          {days.map((day) => {
            const dayPhotos = photos.filter((p) => p.day === day);
            const groups = groupPhotosByStop(dayPhotos, stops);
            return (
              <article key={day}>
                <div className="photo-day-title static">
                  <span>
                    <b>Day {day + 1}</b>
                    <small>
                      {groups.filter((g) => g.stop).length} activities · {dayPhotos.length} photos
                    </small>
                  </span>
                </div>
                {groups.map((group) => (
                  <div className="activity-cluster" key={group.stop?.id ?? "unmatched"}>
                    <div className="photo-grid">
                      {group.photos.map((photo) => {
                        const on = shareMode && shareSelected.includes(photo.id);
                        const disabled = shareMode && !on && shareSelected.length >= maxPhotos;
                        return (
                          <button
                            key={photo.id}
                            type="button"
                            className={
                              shareMode ? (on ? "photo-tile selected" : "photo-tile") : "photo-tile"
                            }
                            disabled={disabled}
                            aria-pressed={on}
                            onClick={() => (shareMode ? toggleSelect(photo.id) : setViewing(photo))}
                          >
                            <img
                              src={photo.src}
                              alt={`${photo.place} memory`}
                              width={1280}
                              height={800}
                              loading="lazy"
                            />
                            <small className="photo-meta">{photo.time}</small>
                            {photo.stopId && (
                              <i className="manual-badge">
                                <Check size={12} />
                              </i>
                            )}
                            {shareMode && on && (
                              <i className="photo-select-check">
                                <Check size={13} />
                              </i>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </article>
            );
          })}
        </section>
      )}

      {shareMode && shareStep === "select" && (
        <div className="share-bar">
          <div className="share-formats">
            <button
              type="button"
              className={shareFormat === "carousel" ? "share-format on" : "share-format"}
              aria-pressed={shareFormat === "carousel"}
              onClick={() => setShareFormat("carousel")}
            >
              <GalleryHorizontal size={18} />
              <b>Carousel</b>
              <small>Up to 9 photos</small>
            </button>
            <button
              type="button"
              className={shareFormat === "story" ? "share-format on" : "share-format"}
              aria-pressed={shareFormat === "story"}
              onClick={() => setShareFormat("story")}
            >
              <Film size={18} />
              <b>Story</b>
              <small>Up to 6 photos</small>
            </button>
          </div>
          <button className="money-action" disabled={selectedPhotos.length === 0} onClick={build}>
            <Instagram size={17} /> Build {shareFormat} · {selectedPhotos.length}
          </button>
        </div>
      )}

      {viewing && (
        <PhotoLightbox
          photo={viewing}
          photos={photos}
          stops={stops}
          onClose={() => setViewing(null)}
          onPrev={(p) => setViewing(p)}
          onNext={(p) => setViewing(p)}
          onMove={() => {
            setAssigning(viewing);
            setViewing(null);
          }}
          onDelete={() => {
            onDeletePhoto(viewing.id);
            setViewing(null);
          }}
        />
      )}
      {assigning && (
        <PhotoAssign
          photo={assigning}
          stops={stops}
          onClose={() => setAssigning(null)}
          onAssign={(stopId) => {
            const day = stopId
              ? (stops.find((s) => s.id === stopId)?.day ?? assigning.day)
              : assigning.day;
            onAssignPhoto(assigning.id, stopId, day);
            setAssigning(null);
          }}
        />
      )}
    </>
  );
}

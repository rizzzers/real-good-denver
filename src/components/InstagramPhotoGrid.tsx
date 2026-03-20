import React from 'react';

interface Props {
  postIds: string[];
}

const InstagramPhotoGrid = ({ postIds }: Props) => {
  return (
    <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      {postIds.map((id) => (
        <a
          key={id}
          href={`https://www.instagram.com/p/${id}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden border border-border/40 bg-muted aspect-square relative group"
        >
          <iframe
            src={`https://www.instagram.com/p/${id}/embed/`}
            className="w-full border-0 pointer-events-none"
            style={{ height: '100%', minHeight: 400, transform: 'scale(1.02)', transformOrigin: 'top center' }}
            allowTransparency
            scrolling="no"
            loading="lazy"
            title={`Instagram post ${id}`}
          />
          <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/5 transition-colors" />
        </a>
      ))}
    </div>
  );
};

export default InstagramPhotoGrid;

'use client';
import React from 'react';
import CheckoutButton from './CheckoutButton'; // 👈 import the button

export default function HomePage() {
  const liveChannels = [
    {
      title: 'NTV Telugu Live',
      youtubeUrl: 'http://www.yupptv.com/yupptvnew/channels/ntv/live/embed',
    },
    {
      title: 'TV9 Telugu Live',
      youtubeUrl: 'http://www.yupptv.com/yupptvnew/channels/tv9-news/live/embed',
    },
    {
      title: 'Sakshi TV Live',
      youtubeUrl: 'https://www.youtube.com/embed/live_stream?channel=UCQ_FATLW83q-4xJ2fsi8qAw',
    },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>📺 Live Telugu News Channels</h1>

      {/* Video grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {liveChannels.map((chan, idx) => (
          <div key={idx} style={{
            position: 'relative',
            paddingTop: '56.25%',
            backgroundColor: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <iframe
              src={chan.youtubeUrl}
              title={chan.title}
              frameBorder="0"
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              background: 'rgba(255,255,255,0.8)',
              padding: '8px 12px'
            }}>
              <h2 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{chan.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Stripe Button 👇 */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        {/* </CheckoutButton > */}
      </div>
    </div>
  );
}

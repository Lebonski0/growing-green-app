'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

interface Plant {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  bestPractices?: string[];
  whenToPlant?: string;
  howToStart?: string;
  careLevel?: string;
  tags: string[];
  imageQuery?: string;
}

interface Partner {
  name: string;
  location: string;
  imageQuery: string;
}

interface RecommendResponse {
  plants: Plant[];
  partner: Partner;
}

export default function PlantDetailScreen() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [plant, setPlant] = useState<Plant | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('greenGardenResults');
    if (!stored) {
      // No results in storage — go back to start
      setNotFound(true);
      return;
    }

    try {
      const data: RecommendResponse = JSON.parse(stored);
      const foundPlant = data.plants.find(p => p.id === id) || null;

      if (foundPlant) {
        // Ensure bestPractices always has content
        if (!foundPlant.bestPractices || foundPlant.bestPractices.length === 0) {
          foundPlant.bestPractices = [
            'Water deeply but infrequently to encourage strong root growth.',
            'Ensure proper drainage to prevent root rot.',
            'Prune dead foliage in late winter before new growth starts.',
          ];
        }
        setPlant(foundPlant);
        setPartner(data.partner || null);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Error parsing stored plants', err);
      setNotFound(true);
    }
  }, [id]);

  // Not found — redirect back to results
  if (notFound) {
    return (
      <>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: "url('/assets/gradient-1.png')", backgroundSize: 'cover', zIndex: 0 }} />
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ fontFamily: 'var(--font-charon), Georgia, serif', fontSize: '20px', color: '#052107', marginBottom: '12px' }}>
            Plant not found
          </h2>
          <p style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '14px', color: 'rgba(5,33,7,0.7)', marginBottom: '24px' }}>
            Your session may have expired.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              background: '#37613A', color: 'white',
              fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 700, fontSize: '14px',
              borderRadius: '9999px', padding: '12px 32px', border: 'none', cursor: 'pointer',
            }}
          >
            Start Over
          </button>
        </div>
      </>
    );
  }

  // Loading
  if (!plant) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundImage: "url('/assets/gradient-1.png')", backgroundSize: 'cover' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <p style={{ fontFamily: 'var(--font-charon), Georgia, serif', fontSize: '20px', color: '#052107' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const imageUrl = `https://source.unsplash.com/featured/800x450?${encodeURIComponent(plant.imageQuery || 'garden plant')}&sig=${plant.id}`;
  const partnerImageUrl = partner
    ? `https://source.unsplash.com/featured/300x300?${encodeURIComponent(partner.imageQuery || 'garden nursery')}&sig=partner`
    : `https://source.unsplash.com/featured/300x300?garden nursery&sig=partner`;

  return (
    <>
      {/* Background */}
      <div
        style={{
          position: 'fixed', inset: 0,
          backgroundImage: "url('/assets/gradient-1.png')",
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        }}
      />

      {/* Main Container */}
      <div
        style={{
          position: 'fixed', inset: 0,
          display: 'flex', flexDirection: 'column',
          maxWidth: '430px', margin: '0 auto', zIndex: 2,
        }}
      >
        {/* HEADER: Back Button */}
        <div style={{ padding: '24px 20px 0', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'transparent', border: 'none', padding: '8px',
              marginLeft: '-8px', cursor: 'pointer', display: 'flex',
              minHeight: '44px', alignItems: 'center',
            }}
          >
            <Image src="/assets/Arrow left.svg" alt="Back" width={28} height={28} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div
          style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 48px' }}
          className="no-scrollbar"
        >
          {/* Main Image */}
          <div style={{
            width: '100%', height: '220px', background: '#D3DED5',
            borderRadius: '16px', marginBottom: '20px',
            overflow: 'hidden', position: 'relative',
          }}>
            <Image
              src={imageUrl}
              alt={plant.name}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>

          {/* All tags */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {plant.tags.map((tag, i) => (
              <span key={i} style={{
                background: '#D3DED5', color: '#052107',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 400, fontSize: '10px',
                padding: '4px 12px', borderRadius: '9999px',
              }}>
                {tag}
              </span>
            ))}
            {plant.careLevel && (
              <span style={{
                background: '#37613A', color: 'white',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700, fontSize: '10px',
                padding: '4px 12px', borderRadius: '9999px',
              }}>
                {plant.careLevel}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-charon), Georgia, serif',
            fontWeight: 700, fontSize: '28px', color: '#052107', marginBottom: '4px',
          }}>
            {plant.name}
          </h1>

          {/* Scientific name */}
          {plant.scientificName && (
            <p style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontStyle: 'italic', fontSize: '13px',
              color: 'rgba(5,33,7,0.55)', marginBottom: '16px',
            }}>
              {plant.scientificName}
            </p>
          )}

          {/* When / How meta row */}
          {(plant.whenToPlant || plant.howToStart) && (
            <div style={{
              display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap',
            }}>
              {plant.whenToPlant && (
                <div style={{
                  background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)', borderRadius: '10px',
                  padding: '8px 14px', flex: 1, minWidth: '100px',
                }}>
                  <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '10px', color: '#37613A', fontWeight: 700, marginBottom: '2px' }}>
                    WHEN TO PLANT
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '13px', color: '#052107', fontWeight: 400 }}>
                    {plant.whenToPlant}
                  </div>
                </div>
              )}
              {plant.howToStart && (
                <div style={{
                  background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)', borderRadius: '10px',
                  padding: '8px 14px', flex: 1, minWidth: '100px',
                }}>
                  <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '10px', color: '#37613A', fontWeight: 700, marginBottom: '2px' }}>
                    HOW TO START
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '13px', color: '#052107', fontWeight: 400 }}>
                    {plant.howToStart}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontWeight: 400, fontSize: '14px', color: '#052107',
            lineHeight: 1.6, marginBottom: '28px',
          }}>
            {plant.description}
          </p>

          {/* Best Practices */}
          <h2 style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontWeight: 700, fontSize: '16px', color: '#052107', marginBottom: '14px',
          }}>
            Best Practices
          </h2>
          <ol style={{
            listStyleType: 'decimal', paddingLeft: '20px',
            margin: 0, marginBottom: '32px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {plant.bestPractices?.map((practice, idx) => (
              <li key={idx} style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 400, fontSize: '14px', color: '#052107',
                lineHeight: 1.5, paddingLeft: '6px',
              }}>
                {practice}
              </li>
            ))}
          </ol>

          {/* Partner Card */}
          <div style={{
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px', border: '1.5px solid rgba(255,255,255,0.8)',
            padding: '12px', display: 'flex', gap: '14px', alignItems: 'center',
          }}>
            <div style={{
              width: '76px', height: '76px', background: '#D3DED5',
              borderRadius: '12px', flexShrink: 0,
              overflow: 'hidden', position: 'relative',
            }}>
              <Image
                src={partnerImageUrl}
                alt="Nursery"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700, fontSize: '10px', color: '#37613A',
                textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px',
              }}>
                Material / Resource
              </span>
              <h3 style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700, fontSize: '15px', color: '#052107',
                marginBottom: '3px', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {partner?.name || 'Local Nursery Partner'}
              </h3>
              <p style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 400, fontSize: '11px', color: '#37613A',
                marginBottom: '10px',
              }}>
                📍 {partner?.location || 'Check your nearest garden center'}
              </p>
              <button style={{
                background: 'transparent', border: '1.5px solid #052107',
                color: '#052107',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700, fontSize: '12px',
                padding: '6px 18px', borderRadius: '9999px',
                cursor: 'pointer', minHeight: '36px',
              }}>
                View
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

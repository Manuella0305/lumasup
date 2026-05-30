'use client'

import Link from 'next/link'
import { IconHome, IconPlayerPlay, IconCompass, IconUser, IconHeart, IconMessageCircle, IconShare } from '@tabler/icons-react'

const ACCENT = '#E8501A'

const NAV = [
  { href: '/',         icon: IconHome,       label: 'Accueil' },
  { href: '/feed',     icon: IconPlayerPlay, label: 'Feed' },
  { href: '/explorer', icon: IconCompass,    label: 'Explorer' },
  { href: '/profil',   icon: IconUser,       label: 'Profil' },
]

const VIDEOS = [
  {
    id: 1,
    ecole: 'UCAC-ICAM',
    ville: 'Douala',
    type: 'Grande école',
    titre: 'Visite du campus UCAC-ICAM',
    description: 'Ingénierie · 5 ans · Concours',
    likes: 284,
    commentaires: 42,
    tag: 'Grande école · Douala',
  },
  {
    id: 2,
    ecole: 'Université de Yaoundé I',
    ville: 'Yaoundé',
    type: 'Université',
    titre: 'Journée portes ouvertes UYI',
    description: 'Sciences · Informatique · Ingénierie',
    likes: 156,
    commentaires: 28,
    tag: 'Université · Yaoundé',
  },
  {
    id: 3,
    ecole: 'ESP Dakar',
    ville: 'Dakar',
    type: 'Grande école',
    titre: 'Les formations à l\'ESP Dakar',
    description: 'Ingénierie · DUT · DIC',
    likes: 312,
    commentaires: 67,
    tag: 'Grande école · Dakar',
  },
]

export default function Feed() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Titre */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', padding: '16px', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontWeight: '600', fontSize: '16px' }}>Découverte</p>
      </div>

      {/* Videos simulées */}
      <div style={{ paddingTop: '0', paddingBottom: '72px' }}>
        {VIDEOS.map((video, index) => (
          <div key={video.id} style={{ height: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: index % 2 === 0 ? '#111' : '#1a1a1a' }}>

            {/* Icône play au centre */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <IconPlayerPlay size={48} color="rgba(255,255,255,0.2)" />
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '8px' }}>{video.titre}</p>
            </div>

            {/* Actions droite */}
            <div style={{ position: 'absolute', right: '12px', bottom: '100px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <IconHeart size={28} color="#fff" />
                <p style={{ fontSize: '11px', color: '#fff', marginTop: '4px' }}>{video.likes}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <IconMessageCircle size={28} color="#fff" />
                <p style={{ fontSize: '11px', color: '#fff', marginTop: '4px' }}>{video.commentaires}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <IconShare size={28} color="#fff" />
                <p style={{ fontSize: '11px', color: '#fff', marginTop: '4px' }}>Partager</p>
              </div>
            </div>

            {/* Infos bas gauche */}
            <div style={{ padding: '0 16px 16px' }}>
              <span style={{ fontSize: '10px', background: ACCENT, color: '#fff', padding: '2px 8px', borderRadius: '3px', fontWeight: '600' }}>
                {video.tag}
              </span>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '6px 0 4px' }}>{video.titre}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{video.description}</p>
            </div>

          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: 'rgba(0,0,0,0.8)', borderTop: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', zIndex: 100 }}>
        {NAV.map((item) => {
          const Icon = item.icon
          const active = item.href === '/feed'
          return (
            <Link key={item.href} href={item.href} style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '10px 0 8px' }}>
              <Icon size={22} color={active ? ACCENT : 'rgba(255,255,255,0.6)'} style={{ display: 'block', margin: '0 auto' }} />
              <span style={{ fontSize: '10px', color: active ? ACCENT : 'rgba(255,255,255,0.6)', fontWeight: active ? '600' : '400', display: 'block', marginTop: '2px' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

    </div>
  )
}

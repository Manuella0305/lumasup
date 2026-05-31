'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  IconHome, IconPlayerPlay, IconCompass, IconUser,
  IconHeart, IconBell, IconSettings, IconChevronRight,
  IconPlus, IconX, IconSchool
} from '@tabler/icons-react'

const ACCENT = '#E8501A'
const NAV = [
  { href: '/',         icon: IconHome,       label: 'Accueil' },
  { href: '/feed',     icon: IconPlayerPlay, label: 'Feed' },
  { href: '/explorer', icon: IconCompass,    label: 'Explorer' },
  { href: '/profil',   icon: IconUser,       label: 'Profil' },
]

const router = useRouter()
const [user, setUser] = useState<any>(null)

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => setUser(data.user))
  supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })
}, [])

const DOMAINES_DISPO = ['ingenierie', 'informatique', 'business', 'sante', 'droit', 'agriculture', 'sciences', 'lettres']
const PAYS_DISPO = ['Cameroun', 'France', 'Sénégal', 'Côte d\'Ivoire', 'Maroc', 'Belgique', 'Canada']

export default function Profil() {
  const [domaines, setDomaines] = useState<string[]>(['ingenierie', 'informatique'])
  const [pays, setPays] = useState<string[]>(['Cameroun', 'France'])
  const [showDomainesPicker, setShowDomainesPicker] = useState(false)
  const [showPaysPicker, setShowPaysPicker] = useState(false)

  const toggleDomaine = (d: string) => {
    setDomaines(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }
  const togglePays = (p: string) => {
    setPays(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header fixe */}
      <div style={{ flexShrink: 0, background: '#fff', borderBottom: '0.5px solid #e5e5e5', padding: '16px' }}>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>Mon profil</p>
      </div>

      {/* Contenu scrollable */}
      <div className="scroll-container" style={{ flex: 1, overflowY: 'auto', paddingBottom: '72px' }}>

        {/* Avatar + infos */}
        <div style={{ padding: '24px 16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '0.5px solid #f0f0f0' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: user ? ACCENT : '#f5f0eb', border: '0.5px solid #e8e0d8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {user?.user_metadata?.avatar_url
              ? <img src={user.user_metadata.avatar_url} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
              : <IconUser size={28} color={user ? '#fff' : '#888'} />
            }
          </div>
          <div style={{ flex: 1 }}>
            {user ? (
              <>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#111', margin: '0 0 3px' }}>
                  {user.user_metadata?.full_name ?? user.email?.split('@')[0]}
                </p>
                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{user.email}</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#111', margin: '0 0 4px' }}>Non connecté</p>
                <button
                  onClick={() => router.push('/connexion')}
                  style={{ fontSize: '12px', color: '#fff', background: ACCENT, border: 'none', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Se connecter
                </button>
              </>
            )}
          </div>
          {user && (
            <button
              onClick={async () => { await supabase.auth.signOut(); setUser(null) }}
              style={{ fontSize: '11px', color: '#999', background: '#f5f5f5', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
            >
              Déconnexion
            </button>
          )}
        </div>

        {/* Préférences */}
        <div style={{ padding: '20px 16px', borderBottom: '0.5px solid #f0f0f0' }}>
          <p style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
            Mes préférences
          </p>

          {/* Domaines */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', color: '#444', fontWeight: '500', margin: '0 0 10px' }}>Domaines d'intérêt</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', alignItems: 'center' }}>
              {domaines.map(d => (
                <span key={d} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', background: '#f5f0eb', color: '#444', padding: '5px 10px', borderRadius: '4px', border: '0.5px solid #e8e0d8' }}>
                  {d}
                  <button onClick={() => toggleDomaine(d)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <IconX size={11} color="#999" />
                  </button>
                </span>
              ))}
              {domaines.length < DOMAINES_DISPO.length && (
                <button
                  onClick={() => setShowDomainesPicker(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: ACCENT, background: 'none', border: `1px solid ${ACCENT}`, padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <IconPlus size={12} /> Ajouter
                </button>
              )}
            </div>
          </div>

          {/* Pays */}
          <div>
            <p style={{ fontSize: '13px', color: '#444', fontWeight: '500', margin: '0 0 10px' }}>Pays cibles</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', alignItems: 'center' }}>
              {pays.map(p => (
                <span key={p} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', background: '#f5f0eb', color: '#444', padding: '5px 10px', borderRadius: '4px', border: '0.5px solid #e8e0d8' }}>
                  {p}
                  <button onClick={() => togglePays(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <IconX size={11} color="#999" />
                  </button>
                </span>
              ))}
              {pays.length < PAYS_DISPO.length && (
                <button
                  onClick={() => setShowPaysPicker(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: ACCENT, background: 'none', border: `1px solid ${ACCENT}`, padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <IconPlus size={12} /> Ajouter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ padding: '8px 0' }}>
          {[
            { icon: IconHeart,    label: 'Écoles sauvegardées',  sub: 'Bientôt disponible' },
            { icon: IconBell,     label: 'Notifications',         sub: 'Alertes concours et bourses' },
            { icon: IconSchool,   label: 'Mes candidatures',      sub: 'Bientôt disponible' },
            { icon: IconSettings, label: 'Paramètres',            sub: '' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '0.5px solid #f5f5f5' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color="#666" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: '#111', margin: 0 }}>{label}</p>
                {sub && <p style={{ fontSize: '11px', color: '#bbb', margin: '2px 0 0' }}>{sub}</p>}
              </div>
              <IconChevronRight size={15} color="#ddd" />
            </div>
          ))}
        </div>

        {/* Version */}
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#ddd', padding: '24px 0 8px' }}>Luma · version 0.1</p>
      </div>

      {/* Picker domaines */}
      {showDomainesPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '480px', borderRadius: '12px 12px 0 0', padding: '20px 16px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>Domaines d'intérêt</p>
              <button onClick={() => setShowDomainesPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <IconX size={20} color="#111" />
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {DOMAINES_DISPO.map(d => (
                <button key={d} onClick={() => toggleDomaine(d)}
                  style={{ padding: '8px 14px', borderRadius: '4px', border: `1px solid ${domaines.includes(d) ? ACCENT : '#e5e5e5'}`, background: domaines.includes(d) ? ACCENT : '#fff', color: domaines.includes(d) ? '#fff' : '#555', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                  {d}
                </button>
              ))}
            </div>
            <button onClick={() => setShowDomainesPicker(false)}
              style={{ marginTop: '20px', width: '100%', padding: '13px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Confirmer
            </button>
          </div>
        </div>
      )}

      {/* Picker pays */}
      {showPaysPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '480px', borderRadius: '12px 12px 0 0', padding: '20px 16px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>Pays cibles</p>
              <button onClick={() => setShowPaysPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <IconX size={20} color="#111" />
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PAYS_DISPO.map(p => (
                <button key={p} onClick={() => togglePays(p)}
                  style={{ padding: '8px 14px', borderRadius: '4px', border: `1px solid ${pays.includes(p) ? ACCENT : '#e5e5e5'}`, background: pays.includes(p) ? ACCENT : '#fff', color: pays.includes(p) ? '#fff' : '#555', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPaysPicker(false)}
              style={{ marginTop: '20px', width: '100%', padding: '13px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Confirmer
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: '#fff', borderTop: '0.5px solid #e5e5e5', display: 'flex', zIndex: 100 }}>
        {NAV.map(item => {
          const Icon = item.icon
          const active = item.href === '/profil'
          return (
            <Link key={item.href} href={item.href} style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '10px 0 8px' }}>
              <Icon size={22} color={active ? ACCENT : '#999'} style={{ display: 'block', margin: '0 auto' }} />
              <span style={{ fontSize: '10px', color: active ? ACCENT : '#999', fontWeight: active ? '600' : '400', display: 'block', marginTop: '2px' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
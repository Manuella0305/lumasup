'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  IconHome, IconPlayerPlay, IconCompass, IconUser,
  IconArrowLeft, IconAdjustmentsHorizontal, IconX,
  IconCalendar, IconChevronRight
} from '@tabler/icons-react'

const ACCENT = '#E8501A'

const NAV = [
  { href: '/',         icon: IconHome,       label: 'Accueil' },
  { href: '/feed',     icon: IconPlayerPlay, label: 'Feed' },
  { href: '/explorer', icon: IconCompass,    label: 'Explorer' },
  { href: '/profil',   icon: IconUser,       label: 'Profil' },
]

const TAG: Record<string, { bg: string; color: string; label: string }> = {
  concours:      { bg: '#FEE9E2', color: '#B33A10', label: 'Concours' },
  bourse:        { bg: '#E2F5EC', color: '#0F6E45', label: 'Bourse' },
  porte_ouverte: { bg: '#E2EEF5', color: '#0F4E6E', label: 'Portes ouvertes' },
  evenement:     { bg: '#F5F0E8', color: '#7A6030', label: 'Événement' },
}

const TYPES = ['concours', 'bourse', 'porte_ouverte', 'evenement']
const PAYS_DISPO = ['Cameroun', 'Sénégal', "Côte d'Ivoire", 'Maroc', 'Burkina Faso', 'France']

export default function Opportunites() {
  const router = useRouter()
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [filtrees, setFiltrees] = useState<any[]>([])
  const [showFiltres, setShowFiltres] = useState(false)
  const [typeFiltre, setTypeFiltre] = useState<string | null>(null)
  const [paysFiltre, setPaysFiltre] = useState<string | null>(null)
  const [onglet, setOnglet] = useState<'a_venir' | 'passes'>('a_venir')

  useEffect(() => {
    supabase
      .from('opportunites')
      .select('*, ecoles(nom, slug)')
      .eq('actif', true)
      .order('date_limite', { ascending: true })
      .then(({ data }) => {
        setOpportunites(data ?? [])
      })
  }, [])

  useEffect(() => {
    const now = new Date()
    let result = opportunites.filter(op => {
      if (onglet === 'a_venir') {
        return !op.date_limite || new Date(op.date_limite) >= now
      } else {
        return op.date_limite && new Date(op.date_limite) < now
      }
    })
    if (typeFiltre) result = result.filter(op => op.type === typeFiltre)
    if (paysFiltre) result = result.filter(op => op.pays === paysFiltre)
    setFiltrees(result)
  }, [opportunites, typeFiltre, paysFiltre, onglet])

  const nbFiltres = [typeFiltre, paysFiltre].filter(Boolean).length

  const jRestants = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime()
    const j = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (j <= 0) return 'Expiré'
    if (j === 1) return 'Demain'
    if (j <= 7) return `${j} jours`
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* HEADER FIXE */}
      <div style={{ flexShrink: 0, background: '#fff', borderBottom: '0.5px solid #e5e5e5' }}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <IconArrowLeft size={22} color="#111" />
            </button>
            <p style={{ fontSize: '17px', fontWeight: '600', color: '#111', margin: 0 }}>Opportunités</p>
          </div>
          <button
            onClick={() => setShowFiltres(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: nbFiltres > 0 ? ACCENT : '#f5f5f5', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', color: nbFiltres > 0 ? '#fff' : '#555', fontSize: '13px', fontWeight: '500' }}
          >
            <IconAdjustmentsHorizontal size={15} />
            Filtres {nbFiltres > 0 ? `(${nbFiltres})` : ''}
          </button>
        </div>

        {/* Tabs à venir / passés */}
        <div style={{ display: 'flex' }}>
          {([
            { key: 'a_venir', label: 'À venir' },
            { key: 'passes',  label: 'Passés' },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setOnglet(t.key)}
              style={{ flex: 1, padding: '11px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: onglet === t.key ? '600' : '400', color: onglet === t.key ? ACCENT : '#999', borderBottom: onglet === t.key ? `2px solid ${ACCENT}` : '2px solid transparent', cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Filtres types rapides */}
        <div style={{ display: 'flex', gap: '6px', padding: '10px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button
            onClick={() => setTypeFiltre(null)}
            style={{ flexShrink: 0, padding: '5px 12px', borderRadius: '20px', border: `1px solid ${!typeFiltre ? ACCENT : '#e5e5e5'}`, background: !typeFiltre ? ACCENT : '#fff', color: !typeFiltre ? '#fff' : '#666', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}
          >
            Tout
          </button>
          {TYPES.map(type => {
            const t = TAG[type]
            const active = typeFiltre === type
            return (
              <button key={type} onClick={() => setTypeFiltre(active ? null : type)}
                style={{ flexShrink: 0, padding: '5px 12px', borderRadius: '20px', border: `1px solid ${active ? t.color : '#e5e5e5'}`, background: active ? t.bg : '#fff', color: active ? t.color : '#666', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}>
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* LISTE scrollable */}
      <div className="scroll-container" style={{ flex: 1, overflowY: 'auto', background: '#f7f7f7', padding: '10px 12px', paddingBottom: '84px' }}>
        {filtrees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 16px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ marginBottom: '16px' }}>
              <circle cx="40" cy="40" r="36" fill="#f5f5f5"/>
              <rect x="26" y="24" width="28" height="36" rx="3" fill="#e0e0e0"/>
              <rect x="30" y="30" width="14" height="2" rx="1" fill="#bbb"/>
              <rect x="30" y="36" width="10" height="2" rx="1" fill="#bbb"/>
              <rect x="30" y="42" width="12" height="2" rx="1" fill="#bbb"/>
              <circle cx="54" cy="54" r="10" fill="#fdf2ee" stroke="#E8501A44" strokeWidth="1.5"/>
              <path d="M54 50v5M54 56v1" stroke="#E8501A88" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#ccc', margin: '0 0 6px' }}>Aucune opportunité</p>
            <p style={{ fontSize: '12px', color: '#ddd', margin: 0 }}>Essaie de modifier les filtres</p>
          </div>
        ) : filtrees.map(op => {
          const t = TAG[op.type] ?? { bg: '#f5f5f5', color: '#555', label: op.type }
          const urgent = op.date_limite && Math.ceil((new Date(op.date_limite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 7
          return (
            <div key={op.id} style={{ background: '#fff', borderRadius: '10px', padding: '14px', marginBottom: '8px', border: urgent && onglet === 'a_venir' ? `1px solid ${t.color}22` : '0.5px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: '600', background: t.bg, color: t.color, padding: '4px 9px', borderRadius: '4px' }}>
                  {t.label}
                </span>
                {op.date_limite && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconCalendar size={12} color={urgent && onglet === 'a_venir' ? ACCENT : '#bbb'} />
                    <span style={{ fontSize: '11px', color: urgent && onglet === 'a_venir' ? ACCENT : '#bbb', fontWeight: urgent && onglet === 'a_venir' ? '600' : '400' }}>
                      {jRestants(op.date_limite)}
                    </span>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px', lineHeight: 1.3 }}>{op.intitule}</p>

              {op.description && (
                <p style={{ fontSize: '12px', color: '#777', margin: '0 0 10px', lineHeight: 1.6 }}>{op.description}</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {op.pays && (
                    <span style={{ fontSize: '10px', color: '#888', background: '#f5f5f5', padding: '2px 7px', borderRadius: '3px' }}>
                      {op.pays}
                    </span>
                  )}
                  {op.ville && (
                    <span style={{ fontSize: '10px', color: '#888', background: '#f5f5f5', padding: '2px 7px', borderRadius: '3px' }}>
                      {op.ville}
                    </span>
                  )}
                  {op.ecoles?.nom && (
                    <Link href={`/ecoles/${op.ecoles.slug}`} style={{ textDecoration: 'none' }}>
                      <span style={{ fontSize: '10px', color: ACCENT, background: '#fdf2ee', padding: '2px 7px', borderRadius: '3px' }}>
                        {op.ecoles.nom.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </Link>
                  )}
                </div>
                {op.lien_source && (
                  <a href={op.lien_source} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: ACCENT, textDecoration: 'none', fontWeight: '600' }}>
                    Source <IconChevronRight size={11} />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* PANEL FILTRES */}
      {showFiltres && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '480px', borderRadius: '12px 12px 0 0', padding: '20px 16px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Filtres</p>
              <button onClick={() => setShowFiltres(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <IconX size={20} color="#111" />
              </button>
            </div>

            <p style={{ fontSize: '11px', color: '#999', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {TYPES.map(type => {
                const t = TAG[type]
                const active = typeFiltre === type
                return (
                  <button key={type} onClick={() => setTypeFiltre(active ? null : type)}
                    style={{ padding: '8px 14px', borderRadius: '4px', border: `1px solid ${active ? t.color : '#e5e5e5'}`, background: active ? t.bg : '#fff', color: active ? t.color : '#555', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                    {t.label}
                  </button>
                )
              })}
            </div>

            <p style={{ fontSize: '11px', color: '#999', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pays</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {PAYS_DISPO.map(p => (
                <button key={p} onClick={() => setPaysFiltre(paysFiltre === p ? null : p)}
                  style={{ padding: '8px 14px', borderRadius: '4px', border: `1px solid ${paysFiltre === p ? ACCENT : '#e5e5e5'}`, background: paysFiltre === p ? ACCENT : '#fff', color: paysFiltre === p ? '#fff' : '#555', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setTypeFiltre(null); setPaysFiltre(null) }}
                style={{ flex: 1, padding: '13px', background: '#f5f5f5', color: '#555', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Réinitialiser
              </button>
              <button onClick={() => setShowFiltres(false)}
                style={{ flex: 2, padding: '13px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: '#fff', borderTop: '0.5px solid #e5e5e5', display: 'flex', zIndex: 100 }}>
        {NAV.map(item => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '10px 0 8px' }}>
              <Icon size={22} color="#999" style={{ display: 'block', margin: '0 auto' }} />
              <span style={{ fontSize: '10px', color: '#999', fontWeight: '400', display: 'block', marginTop: '2px' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
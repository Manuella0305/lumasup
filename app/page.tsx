'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconHome, IconPlayerPlay, IconCompass, IconSchool, IconUser,
  IconBell, IconChevronRight
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

export default function Accueil() {
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [ecoles, setEcoles] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: ops }, { data: ecs }] = await Promise.all([
        supabase.from('opportunites').select('*').eq('actif', true).order('date_limite', { ascending: true }).limit(6),
        supabase.from('ecoles').select('*').eq('verifie', true).order('created_at', { ascending: false }).limit(4)
      ])
      setOpportunites(ops ?? [])
      setEcoles(ecs ?? [])
    }
    fetchData()
  }, [])

  return (
    <div style={{ paddingBottom: '72px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f7f7f7', minHeight: '100vh' }}>

      {/* HEADER avec illustration */}
      <div style={{ background: ACCENT, padding: '20px 16px 0', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>

        {/* Cercles déco */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', top: '40px', right: '60px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Top bar */}
        <div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', margin: '0 0 3px' }}>
            {new Date().getHours() < 12 ? 'Bonne matinée' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonne soirée'} 👋
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px', margin: 0 }}>Luma</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
            {opportunites.length > 0 ? `${opportunites.length} opportunités disponibles` : 'Découvre les écoles d\'Afrique'}
          </p>
        </div>

        {/* Illustration étudiants SVG */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: '-10px' }}>
          <svg width="220" height="120" viewBox="0 0 220 120" fill="none">
            {/* Étudiant 1 - gauche */}
            <g transform="translate(20, 10)">
              {/* Corps */}
              <rect x="20" y="45" width="22" height="35" rx="4" fill="rgba(255,255,255,0.25)" />
              {/* Tête */}
              <circle cx="31" cy="36" r="12" fill="rgba(255,255,255,0.3)" />
              {/* Cheveux */}
              <path d="M19 34 Q31 20 43 34" fill="rgba(255,255,255,0.15)" />
              {/* Livre */}
              <rect x="10" y="58" width="18" height="14" rx="2" fill="rgba(255,255,255,0.2)" />
              <line x1="19" y1="58" x2="19" y2="72" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              {/* Jambes */}
              <rect x="21" y="78" width="8" height="30" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="33" y="78" width="8" height="30" rx="3" fill="rgba(255,255,255,0.2)" />
            </g>

            {/* Étudiant 2 - milieu (plus grand) */}
            <g transform="translate(75, 0)">
              {/* Corps */}
              <rect x="18" y="42" width="26" height="42" rx="4" fill="rgba(255,255,255,0.3)" />
              {/* Tête */}
              <circle cx="31" cy="31" r="14" fill="rgba(255,255,255,0.35)" />
              {/* Cheveux naturels */}
              <path d="M17 29 Q31 12 45 29 Q45 20 31 17 Q17 20 17 29Z" fill="rgba(255,255,255,0.2)" />
              {/* Sac à dos */}
              <rect x="44" y="46" width="14" height="20" rx="3" fill="rgba(255,255,255,0.2)" />
              <rect x="46" y="44" width="2" height="24" rx="1" fill="rgba(255,255,255,0.15)" />
              {/* Jambes */}
              <rect x="19" y="82" width="10" height="28" rx="3" fill="rgba(255,255,255,0.25)" />
              <rect x="33" y="82" width="10" height="28" rx="3" fill="rgba(255,255,255,0.25)" />
            </g>

            {/* Étudiant 3 - droite */}
            <g transform="translate(145, 15)">
              {/* Corps */}
              <rect x="18" y="44" width="22" height="36" rx="4" fill="rgba(255,255,255,0.22)" />
              {/* Tête */}
              <circle cx="29" cy="35" r="12" fill="rgba(255,255,255,0.28)" />
              {/* Cheveux */}
              <path d="M17 33 Q29 18 41 33 L41 28 Q29 14 17 28Z" fill="rgba(255,255,255,0.18)" />
              {/* Téléphone */}
              <rect x="40" y="55" width="10" height="16" rx="2" fill="rgba(255,255,255,0.2)" />
              {/* Jambes */}
              <rect x="19" y="78" width="8" height="27" rx="3" fill="rgba(255,255,255,0.18)" />
              <rect x="31" y="78" width="8" height="27" rx="3" fill="rgba(255,255,255,0.18)" />
            </g>

            {/* Sol */}
            <ellipse cx="110" cy="113" rx="100" ry="6" fill="rgba(0,0,0,0.1)" />

            {/* Étoiles déco */}
            <circle cx="15" cy="15" r="2" fill="rgba(255,255,255,0.3)" />
            <circle cx="200" cy="20" r="1.5" fill="rgba(255,255,255,0.25)" />
            <circle cx="185" cy="8" r="1" fill="rgba(255,255,255,0.2)" />
          </svg>
        </div>
      </div>

      {/* Stats rapides */}
      <div style={{ background: '#fff', margin: '0 0 8px', padding: '14px 16px', display: 'flex' }}>
        {[
          { label: 'Établissements', value: '27+' },
          { label: 'Pays couverts', value: '5' },
          { label: 'Formations', value: '35+' },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '0.5px solid #f0f0f0' : 'none' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0 0 2px' }}>{s.value}</p>
            <p style={{ fontSize: '10px', color: '#bbb', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Opportunités — carrousel horizontal */}
      <div style={{ background: '#fff', margin: '0 0 8px', padding: '16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 16px' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0 }}>Opportunités du moment</p>
          <Link href="/opportunites" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ fontSize: '12px', color: ACCENT }}>Voir tout</span>
            <IconChevronRight size={13} color={ACCENT} />
          </Link>
        </div>

        {opportunites.length === 0 ? (
          <div style={{ display: 'flex', gap: '10px', padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ flexShrink: 0, width: '200px', height: '200px', background: '#f5f5f5', borderRadius: '10px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', padding: '0 16px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {opportunites.map(op => {
              const t = TAG[op.type] ?? { bg: '#f5f5f5', color: '#555', label: op.type }
              return (
                <div key={op.id} style={{ flexShrink: 0, width: '200px', border: '0.5px solid #f0f0f0', borderRadius: '10px', padding: '14px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '600', background: t.bg, color: t.color, padding: '3px 8px', borderRadius: '3px' }}>
                      {t.label}
                    </span>
                    {op.date_limite && (
                      <span style={{ fontSize: '10px', color: '#bbb' }}>
                        {new Date(op.date_limite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 4px', lineHeight: 1.3 }}>{op.intitule}</p>
                  <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>{op.ville ?? op.pays}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Écoles récentes */}
      <div style={{ background: '#fff', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0 }}>Écoles récentes</p>
          <Link href="/explorer?vue=liste" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ fontSize: '12px', color: ACCENT }}>Voir tout</span>
            <IconChevronRight size={13} color={ACCENT} />
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ecoles.length === 0 ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{ height: '56px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '6px' }} />
            ))
          ) : ecoles.map(ecole => (
            <Link key={ecole.id} href={`/ecoles/${ecole.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid #f5f5f5' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5f0eb', border: '0.5px solid #e8e0d8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconSchool size={18} color="#aaa" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ecole.nom}
                  </p>
                  <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>{ecole.ville} · {ecole.pays}</p>
                </div>
                <IconChevronRight size={14} color="#ddd" style={{ flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: '#fff', borderTop: '0.5px solid #e5e5e5', display: 'flex', zIndex: 100 }}>
        {NAV.map(item => {
          const Icon = item.icon
          const active = item.href === '/'
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

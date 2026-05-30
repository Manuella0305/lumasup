'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  IconArrowLeft, IconMapPin, IconPhone, IconMail,
  IconCheck, IconChevronRight, IconCalendar,
  IconPlayerPlay, IconExternalLink
} from '@tabler/icons-react'

const ACCENT = '#E8501A'

const TAG: Record<string, { bg: string; color: string; label: string }> = {
  concours:      { bg: '#FEE9E2', color: '#B33A10', label: 'Concours' },
  bourse:        { bg: '#E2F5EC', color: '#0F6E45', label: 'Bourse' },
  porte_ouverte: { bg: '#E2EEF5', color: '#0F4E6E', label: 'Portes ouvertes' },
  evenement:     { bg: '#F5F0E8', color: '#7A6030', label: 'Événement' },
}

const VIDEOS_FICTIVES = [
  { id: 1, titre: 'Visite du campus', duree: '2:34' },
  { id: 2, titre: 'Témoignage étudiant', duree: '1:48' },
  { id: 3, titre: 'Journée portes ouvertes', duree: '3:12' },
]

const COVER_COLORS: Record<string, string[]> = {
  universite:       ['#1a1a2e', '#16213e'],
  grande_ecole:     ['#0d1b2a', '#1b263b'],
  institut:         ['#1a0a00', '#3d1a00'],
  centre_formation: ['#0a1628', '#1e3a5f'],
}

export default function EcolePage() {
  const { slug } = useParams()
  const router = useRouter()
  const [ecole, setEcole] = useState<any>(null)
  const [formations, setFormations] = useState<any[]>([])
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [onglet, setOnglet] = useState<'apropos' | 'formations' | 'opportunites'>('apropos')

  useEffect(() => {
    const fetchData = async () => {
      const { data: ecoleData } = await supabase
        .from('ecoles').select('*').eq('slug', slug).single()
      if (!ecoleData) return
      setEcole(ecoleData)
      const [{ data: f }, { data: o }] = await Promise.all([
        supabase.from('formations').select('*').eq('ecole_id', ecoleData.id),
        supabase.from('opportunites').select('*').eq('ecole_id', ecoleData.id).eq('actif', true)
      ])
      setFormations(f ?? [])
      setOpportunites(o ?? [])
    }
    fetchData()
  }, [slug])

  if (!ecole) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #f0f0f0', borderTopColor: ACCENT, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const colors = COVER_COLORS[ecole.type] ?? ['#1a1a1a', '#2d2d2d']

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f7f7f7', minHeight: '100vh' }}>

      {/* COUVERTURE */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 60%, #E8501A22 100%)` }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(232,80,26,0.15)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', top: '30px', left: '40%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(232,80,26,0.1)', filter: 'blur(25px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }} />

        <button
        onClick={() => router.push('/explorer?vue=liste')}
        style={{ position: 'absolute', top: '16px', left: '16px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: '0.5px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
        >
        <IconArrowLeft size={18} color="#fff" />
        </button>

        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '500' }}>
            {ecole.type.replace('_', ' ')} · {ecole.statut}
          </p>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0, lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {ecole.nom}
          </h1>
        </div>
      </div>

      {/* INFOS */}
      <div style={{ background: '#fff', padding: '16px', borderBottom: '0.5px solid #f0f0f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconMapPin size={14} color="#ccc" />
            <span style={{ fontSize: '13px', color: '#555' }}>{ecole.ville}, {ecole.pays}</span>
          </div>
          {ecole.telephone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconPhone size={14} color="#ccc" />
              <span style={{ fontSize: '13px', color: '#555' }}>{ecole.telephone}</span>
            </div>
          )}
          {ecole.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconMail size={14} color="#ccc" />
              <span style={{ fontSize: '13px', color: '#555' }}>{ecole.email}</span>
            </div>
          )}
          {ecole.verifie && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconCheck size={13} color={ACCENT} />
              <span style={{ fontSize: '12px', color: ACCENT, fontWeight: '500' }}>Informations vérifiées par Luma</span>
            </div>
          )}
        </div>

        {ecole.site_web && (
          <a href={ecole.site_web} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: ACCENT, borderRadius: '8px' }}>
              <IconExternalLink size={16} color="#fff" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Visiter le site officiel</span>
            </div>
          </a>
        )}
      </div>

      {/* ONGLETS */}
      <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '0.5px solid #e5e5e5', zIndex: 30 }}>
        <div style={{ display: 'flex' }}>
          {([
            { key: 'apropos',      label: 'À propos' },
            { key: 'formations',   label: `Formations (${formations.length})` },
            { key: 'opportunites', label: `Opportunités (${opportunites.length})` },
          ] as const).map(o => (
            <button key={o.key} onClick={() => setOnglet(o.key)}
              style={{ flex: 1, padding: '13px 4px', border: 'none', background: 'transparent', fontSize: '11px', fontWeight: onglet === o.key ? '600' : '400', color: onglet === o.key ? ACCENT : '#999', borderBottom: onglet === o.key ? `2px solid ${ACCENT}` : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* A PROPOS */}
      {onglet === 'apropos' && (
        <div>
          <div style={{ background: '#fff', margin: '8px 0 0', padding: '20px 16px' }}>
            <p style={{ fontSize: '11px', color: '#bbb', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Présentation</p>
            <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.8, margin: 0 }}>
              {ecole.nom} est un établissement d'enseignement supérieur {ecole.statut === 'public' ? 'public' : 'privé'} situé à {ecole.ville}, {ecole.pays}.
              {formations.length > 0 ? ` Il propose ${formations.length} formation${formations.length > 1 ? 's' : ''} dans différentes filières académiques.` : ' Il propose des formations dans différentes filières académiques.'}
              {ecole.verifie ? " Ses informations ont été vérifiées et validées par l'équipe Luma." : ''}
            </p>
          </div>

          <div style={{ background: '#fff', margin: '8px 0 0', padding: '20px 0' }}>
            <p style={{ fontSize: '11px', color: '#bbb', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px', padding: '0 16px' }}>
              Vidéos du campus
            </p>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 16px 8px', scrollbarWidth: 'none' }}>
              {VIDEOS_FICTIVES.map(v => (
                <div key={v.id} style={{ flexShrink: 0, width: '200px', borderRadius: '10px', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
                  <div style={{ height: '115px', position: 'relative', cursor: 'pointer', background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(232,80,26,0.2)', filter: 'blur(20px)' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                        <IconPlayerPlay size={18} color="#fff" />
                      </div>
                    </div>
                    <span style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '10px', color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px' }}>{v.duree}</span>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#222', margin: '0 0 2px' }}>{v.titre}</p>
                    <p style={{ fontSize: '10px', color: '#bbb', margin: 0 }}>{ecole.ville}</p>
                  </div>
                </div>
              ))}
              <div style={{ flexShrink: 0, width: '100px', borderRadius: '10px', border: '1px dashed #e5e5e5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '155px', gap: '8px', background: '#fafafa' }}>
                <IconPlayerPlay size={18} color="#ddd" />
                <p style={{ fontSize: '10px', color: '#ccc', textAlign: 'center', padding: '0 8px', margin: 0, lineHeight: 1.4 }}>Bientôt plus</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMATIONS */}
      {onglet === 'formations' && (
        <div style={{ margin: '8px 0 0' }}>
          {formations.length === 0 ? (
            <div style={{ background: '#fff', padding: '48px 16px', textAlign: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ marginBottom: '16px' }}>
                <circle cx="40" cy="40" r="36" fill="#f5f5f5"/>
                <rect x="24" y="28" width="32" height="24" rx="3" fill="#e0e0e0"/>
                <rect x="28" y="32" width="10" height="2" rx="1" fill="#bbb"/>
                <rect x="28" y="36" width="16" height="2" rx="1" fill="#bbb"/>
                <rect x="28" y="40" width="12" height="2" rx="1" fill="#bbb"/>
                <circle cx="52" cy="52" r="10" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1.5"/>
                <path d="M49 52h6M52 49v6" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#ccc', margin: '0 0 6px' }}>Aucune formation</p>
              <p style={{ fontSize: '12px', color: '#ddd', margin: 0 }}>Les formations seront bientôt ajoutées</p>
            </div>
          ) : formations.map((f) => (
            <div key={f.id} style={{ background: '#fff', marginBottom: '2px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0, flex: 1, paddingRight: '8px', lineHeight: 1.4 }}>
                  {f.intitule}
                </p>
                {f.concours && (
                  <span style={{ fontSize: '10px', background: '#FEE9E2', color: '#B33A10', padding: '3px 8px', borderRadius: '4px', fontWeight: '600', flexShrink: 0 }}>
                    Concours
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: f.frais_min || f.conditions ? '12px' : '0' }}>
                {f.domaine && <span style={{ fontSize: '10px', color: '#666', background: '#f5f5f5', padding: '3px 8px', borderRadius: '4px' }}>{f.domaine}</span>}
                {f.duree_annees && <span style={{ fontSize: '10px', color: '#666', background: '#f5f5f5', padding: '3px 8px', borderRadius: '4px' }}>{f.duree_annees} an{f.duree_annees > 1 ? 's' : ''}</span>}
                {f.diplome && <span style={{ fontSize: '10px', color: '#666', background: '#f5f5f5', padding: '3px 8px', borderRadius: '4px' }}>{f.diplome.toUpperCase()}</span>}
                {f.niveau_entree && <span style={{ fontSize: '10px', color: '#666', background: '#f5f5f5', padding: '3px 8px', borderRadius: '4px' }}>Bac {f.niveau_entree.replace('bac', '').trim()}</span>}
              </div>
              {(f.frais_min || f.frais_max) && (
                <div style={{ background: '#fdf2ee', borderRadius: '8px', padding: '12px 14px', marginBottom: f.conditions ? '10px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>Frais annuels</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: ACCENT }}>
                    {f.frais_min ? `${f.frais_min.toLocaleString()} FCFA` : ''}
                    {f.frais_min && f.frais_max ? ' – ' : ''}
                    {f.frais_max ? `${f.frais_max.toLocaleString()} FCFA` : ''}
                  </span>
                </div>
              )}
              {f.conditions && (
                <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: 1.6, borderLeft: '2px solid #f0f0f0', paddingLeft: '10px' }}>
                  {f.conditions}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* OPPORTUNITES */}
      {onglet === 'opportunites' && (
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '2px' }}>
          {opportunites.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '4px', padding: '48px 16px', textAlign: 'center', marginTop: '8px' }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ marginBottom: '16px' }}>
                <circle cx="40" cy="40" r="36" fill="#f5f5f5"/>
                <rect x="28" y="24" width="24" height="32" rx="3" fill="#e0e0e0"/>
                <rect x="32" y="30" width="12" height="2" rx="1" fill="#bbb"/>
                <rect x="32" y="35" width="8" height="2" rx="1" fill="#bbb"/>
                <rect x="32" y="40" width="10" height="2" rx="1" fill="#bbb"/>
                <circle cx="52" cy="52" r="10" fill="#fdf2ee" stroke="#E8501A44" strokeWidth="1.5"/>
                <path d="M52 48v5M52 54v1" stroke="#E8501A88" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#ccc', margin: '0 0 6px' }}>Aucune opportunité</p>
              <p style={{ fontSize: '12px', color: '#ddd', margin: 0 }}>Concours et bourses bientôt disponibles</p>
            </div>
          ) : opportunites.map(op => {
            const t = TAG[op.type] ?? { bg: '#f5f5f5', color: '#555', label: op.type }
            return (
              <div key={op.id} style={{ background: '#fff', borderRadius: '4px', padding: '14px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '600', background: t.bg, color: t.color, padding: '4px 9px', borderRadius: '4px' }}>
                    {t.label}
                  </span>
                  {op.date_limite && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconCalendar size={12} color="#bbb" />
                      <span style={{ fontSize: '11px', color: '#bbb' }}>
                        {new Date(op.date_limite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 6px' }}>{op.intitule}</p>
                {op.description && (
                  <p style={{ fontSize: '13px', color: '#666', margin: '0 0 12px', lineHeight: 1.6 }}>{op.description}</p>
                )}
                {op.lien_source && (
                  <a href={op.lien_source} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: ACCENT, textDecoration: 'none', fontWeight: '600' }}>
                    Voir la source <IconChevronRight size={12} />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

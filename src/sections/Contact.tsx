import { lazy, Suspense, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowDownToLine, Mail, MapPin, Phone } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
const ContactObject = lazy(() => import('../three/ContactObject'))
import TodoBadge from '../components/TodoBadge'
import { contact } from '../lib/content'
import { useLanguage } from '../i18n/LanguageContext'
import Magnetic from '../components/Magnetic'

export default function Contact() {
  const { content } = useLanguage()
  const c = content.sections.contact
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const subject = encodeURIComponent(`Portfolio — ${name || 'Contact'}`)
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`)
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-white/10 py-24 md:py-36">
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-crimson/10 blur-[120px]" />
      <div className="section-shell relative">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} note={c.intro} />

        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr]">
          <div data-reveal>
            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              <a href={`mailto:${contact.email}`} className="group bg-ink p-7 transition-colors hover:bg-ink-800">
                <Mail className="h-4 w-4 text-crimson" />
                <p className="mt-5 text-[10px] uppercase tracking-editorial text-bone-dim">{c.email}</p>
                <p className="mt-2 break-all text-sm text-bone group-hover:text-crimson">{contact.email}</p>
              </a>
              <a href={contact.phoneHref} className="group bg-ink p-7 transition-colors hover:bg-ink-800">
                <Phone className="h-4 w-4 text-crimson" />
                <p className="mt-5 text-[10px] uppercase tracking-editorial text-bone-dim">{c.phone}</p>
                <p className="mt-2 text-sm text-bone group-hover:text-crimson">{contact.phone}</p>
              </a>
              <div className="bg-ink p-7 sm:col-span-2">
                <MapPin className="h-4 w-4 text-crimson" />
                <p className="mt-5 text-[10px] uppercase tracking-editorial text-bone-dim">{c.location}</p>
                <p className="mt-2 text-sm text-bone">{contact.location}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href={contact.cv}
                  download
                  className="inline-flex items-center gap-3 rounded-full border border-crimson px-6 py-3.5 text-[10px] font-bold uppercase tracking-editorial text-crimson transition-colors hover:bg-crimson hover:text-white"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  {c.download}
                </a>
              </Magnetic>
            </div>

            <div className="mt-12 border-t border-white/10 pt-7">
              <p className="eyebrow">{c.socialTitle} <TodoBadge /></p>
              <p className="mt-3 text-xs leading-relaxed text-bone-dim">{c.socialNote}</p>
              <p className="mt-8 font-display text-2xl uppercase text-bone">{c.beyond}</p>
              <p className="mt-2 text-xs text-bone-dim">{c.beyondDetail}</p>
            </div>
          </div>

          <div className="relative" data-reveal>
            <div className="absolute -inset-6 hidden h-[420px] lg:block">
              <Suspense fallback={null}>
                <ContactObject />
              </Suspense>
            </div>
            <form onSubmit={submit} className="relative border border-white/15 bg-ink/80 p-7 backdrop-blur-sm md:p-10">
              <div className="mb-8 flex items-center justify-between">
                <span className="eyebrow">Message</span>
                <span className="h-px w-16 bg-crimson" />
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-editorial text-bone-dim">{c.formName}</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-bone outline-none transition-colors focus:border-crimson"
                  placeholder={c.formName}
                />
              </label>
              <label className="mt-6 block">
                <span className="text-[10px] uppercase tracking-editorial text-bone-dim">{c.formEmail}</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-bone outline-none transition-colors focus:border-crimson"
                  placeholder={c.formEmail}
                />
              </label>
              <label className="mt-6 block">
                <span className="text-[10px] uppercase tracking-editorial text-bone-dim">{c.formMessage}</span>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 w-full resize-none border-b border-white/20 bg-transparent py-3 text-sm text-bone outline-none transition-colors focus:border-crimson"
                  placeholder={c.formMessage}
                />
              </label>
              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-crimson py-4 text-[11px] font-bold uppercase tracking-editorial text-white transition-colors hover:bg-crimson-bright"
              >
                {c.formSend}
              </button>
              <p className="mt-4 text-center text-[10px] text-bone-dim/70">{c.formNote}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

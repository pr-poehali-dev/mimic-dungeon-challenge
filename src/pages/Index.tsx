import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MimicDemo from '@/components/MimicDemo';

const HERO_IMG = 'https://cdn.poehali.dev/projects/5a116655-f8cf-45eb-9c57-19c955c1f9cd/files/21b95f27-5ee2-409a-b9dd-e3afe94594cb.jpg';

const materials = [
  { name: 'Металл', icon: 'Cog', color: 'text-slate-300', glow: 'shadow-[0_0_30px_rgba(203,213,225,0.25)]', desc: 'Прочность и тяжёлый урон. Дороже в энергии.' },
  { name: 'Древесина', icon: 'TreePine', color: 'text-amber-500', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]', desc: 'Дёшево, гибко, хорошо для маскировки.' },
  { name: 'Ткань', icon: 'Wind', color: 'text-teal-400', glow: 'shadow-[0_0_30px_rgba(45,212,191,0.25)]', desc: 'Лёгкость и скорость передвижения между комнатами.' },
];

const mechanics = [
  { icon: 'Boxes', title: 'Вселение в объекты', text: 'Ты — мимик. Прячься в любом предмете и переселяйся в соседний, оставаясь незаметным для героев.' },
  { icon: 'Palette', title: 'Сборка из пикселей', text: 'Подходи к объектам и забирай их материалы. Собирай тело из металла, дерева и ткани под свои задачи.' },
  { icon: 'Zap', title: 'Энергия из побед', text: 'Чем сложнее существо, тем больше энергии. Сильные материалы требуют побед над сильными монстрами.' },
  { icon: 'Swords', title: 'Сила по расстоянию', text: 'Чем дальше от точки спавна — тем опаснее монстры. Глубина подземелья = риск и награда.' },
];

const Index = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <div className="min-h-screen grain overflow-x-hidden">
      {demoOpen && <MimicDemo onClose={() => setDemoOpen(false)} />}
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-display font-bold text-xl tracking-[0.3em] text-primary text-glow-teal">
            <Icon name="Hexagon" size={22} className="text-primary" />
            MIMIC
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-muted-foreground font-display">
            <a href="#mechanics" className="hover:text-foreground transition-colors">Механика</a>
            <a href="#materials" className="hover:text-foreground transition-colors">Материалы</a>
            <a href="#modes" className="hover:text-foreground transition-colors">Режимы</a>
          </nav>
          <Button onClick={() => setDemoOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-display uppercase tracking-wider">
            Играть
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-secondary/40 text-secondary text-xs uppercase tracking-[0.2em] font-display">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-glow" />
              Процедурное подземелье · Co-op &amp; PvP
            </div>
            <h1 className="font-display font-bold leading-[0.95] text-5xl md:text-7xl uppercase tracking-tight">
              Стань тем,<br />
              что <span className="text-primary text-glow-teal">прячется</span><br />
              в тенях
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Ты — мимик. Притворяйся объектами, собирай тело по пикселям, поглощай материалы и переписывай правила подземелья.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setDemoOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-display uppercase tracking-wider text-base h-12 px-8">
                <Icon name="Play" size={18} className="mr-2" /> Начать охоту
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted font-display uppercase tracking-wider text-base h-12 px-8">
                <Icon name="BookOpen" size={18} className="mr-2" /> Лор
              </Button>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" />
            <img
              src={HERO_IMG}
              alt="Мимик в подземелье"
              className="relative rounded-2xl border border-border/60 shadow-2xl shadow-primary/10 w-full object-cover aspect-square"
            />
          </div>
        </div>
      </section>

      {/* MECHANICS */}
      <section id="mechanics" className="py-24 border-t border-border/40">
        <div className="container">
          <div className="max-w-xl mb-14">
            <span className="font-display uppercase tracking-[0.3em] text-secondary text-sm">Механика</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase mt-3">Каждый объект — это маска</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mechanics.map((m, i) => (
              <div
                key={m.title}
                className="group p-6 rounded-xl bg-card border border-border/60 hover:border-primary/60 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon name={m.icon} size={24} className="text-primary" />
                </div>
                <h3 className="font-display uppercase tracking-wide text-lg mb-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MATERIALS */}
      <section id="materials" className="py-24 border-t border-border/40">
        <div className="container">
          <div className="max-w-xl mb-14">
            <span className="font-display uppercase tracking-[0.3em] text-secondary text-sm">Материалы</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase mt-3">Из чего ты состоишь</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {materials.map((mat, i) => (
              <div
                key={mat.name}
                className={`relative p-8 rounded-2xl bg-card border border-border/60 ${mat.glow} hover:scale-[1.02] transition-transform duration-300 animate-fade-in`}
                style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
              >
                <Icon name={mat.icon} size={48} className={`${mat.color} mb-6`} />
                <h3 className="font-display uppercase text-2xl tracking-wide mb-2">{mat.name}</h3>
                <p className="text-muted-foreground">{mat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODES */}
      <section id="modes" className="py-24 border-t border-border/40">
        <div className="container grid md:grid-cols-2 gap-6">
          <div className="p-10 rounded-2xl bg-gradient-to-br from-primary/15 to-card border border-primary/30">
            <Icon name="Users" size={40} className="text-primary mb-6" />
            <h3 className="font-display uppercase text-3xl tracking-wide mb-3">Кампания</h3>
            <p className="text-muted-foreground mb-6">Команда героев блуждает по комнатам. Выживай, эволюционируй и обустраивай тайник с запасными телами.</p>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-display uppercase tracking-wider">
              Подробнее
            </Button>
          </div>
          <div className="p-10 rounded-2xl bg-gradient-to-br from-secondary/15 to-card border border-secondary/30">
            <Icon name="Swords" size={40} className="text-secondary mb-6" />
            <h3 className="font-display uppercase text-3xl tracking-wide mb-3">Мультиплеер</h3>
            <p className="text-muted-foreground mb-6">Воруй чужие тела и части, пока хозяин далеко. Создавай красоту из пикселей и строй живой открытый мир.</p>
            <Button variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10 font-display uppercase tracking-wider">
              Подробнее
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-t border-border/40">
        <div className="container text-center max-w-2xl">
          <h2 className="font-display font-bold text-4xl md:text-6xl uppercase leading-tight">
            Подземелье <span className="text-secondary text-glow-amber">ждёт</span> своего хищника
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">Ранний доступ скоро. Оставь след в тенях первым.</p>
          <Button size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 font-display uppercase tracking-wider text-base h-14 px-10">
            <Icon name="Mail" size={18} className="mr-2" /> Получить доступ
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display tracking-[0.3em] text-foreground">
            <Icon name="Hexagon" size={18} className="text-primary" /> MIMIC
          </div>
          <span>© 2026 — Создано в глубинах подземелья</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
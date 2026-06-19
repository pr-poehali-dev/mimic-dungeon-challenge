import { useState, useMemo, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface MimicDemoProps {
  onClose: () => void;
}

type MaterialKey = 'metal' | 'wood' | 'cloth';

interface Room {
  id: number;
  x: number;
  y: number;
  dist: number;
  monster: { hp: number; max: number; power: number; material: MaterialKey } | null;
}

const GRID = 4;
const SPAWN = 0; // top-left room index

const MATERIALS: Record<MaterialKey, { name: string; icon: string; color: string }> = {
  metal: { name: 'Металл', icon: 'Cog', color: 'text-slate-300' },
  wood: { name: 'Древесина', icon: 'TreePine', color: 'text-amber-500' },
  cloth: { name: 'Ткань', icon: 'Wind', color: 'text-teal-400' },
};

const MAT_KEYS: MaterialKey[] = ['metal', 'wood', 'cloth'];

function buildRooms(): Room[] {
  return Array.from({ length: GRID * GRID }, (_, id) => {
    const x = id % GRID;
    const y = Math.floor(id / GRID);
    const dist = x + y; // distance from spawn (0,0)
    const hasMonster = id !== SPAWN && Math.random() > 0.25;
    return {
      id,
      x,
      y,
      dist,
      monster: hasMonster
        ? {
            max: 20 + dist * 18,
            hp: 20 + dist * 18,
            power: 4 + dist * 3,
            material: MAT_KEYS[Math.floor(Math.random() * 3)],
          }
        : null,
    };
  });
}

const MimicDemo = ({ onClose }: MimicDemoProps) => {
  const [rooms, setRooms] = useState<Room[]>(() => buildRooms());
  const [pos, setPos] = useState(SPAWN);
  const [hp, setHp] = useState(100);
  const [energy, setEnergy] = useState(0);
  const [collected, setCollected] = useState<Record<MaterialKey, number>>({ metal: 0, wood: 0, cloth: 0 });
  const [log, setLog] = useState<string[]>(['Ты вселился в сундук у точки спавна.']);
  const [over, setOver] = useState(false);

  const pushLog = useCallback((msg: string) => {
    setLog((l) => [msg, ...l].slice(0, 5));
  }, []);

  const neighbors = useMemo(() => {
    const cur = rooms[pos];
    return rooms
      .filter((r) => Math.abs(r.x - cur.x) + Math.abs(r.y - cur.y) === 1)
      .map((r) => r.id);
  }, [pos, rooms]);

  const move = (to: number) => {
    if (over || !neighbors.includes(to)) return;
    setPos(to);
    const r = rooms[to];
    pushLog(r.monster ? `Комната ${to + 1}: затаился монстр (${MATERIALS[r.monster.material].name}).` : `Комната ${to + 1}: пусто и тихо.`);
  };

  const attack = () => {
    if (over) return;
    const r = rooms[pos];
    if (!r.monster) {
      pushLog('Здесь некого бить.');
      return;
    }
    const newRooms = [...rooms];
    const m = { ...r.monster };
    const dmg = 12 + collected.metal * 5;
    m.hp -= dmg;
    pushLog(`Удар на ${dmg}! Монстр отвечает на ${m.power}.`);

    const newHp = Math.max(0, hp - m.power);
    setHp(newHp);

    if (m.hp <= 0) {
      const gain = 10 + r.dist * 8;
      setEnergy((e) => e + gain);
      setCollected((c) => ({ ...c, [m.material]: c[m.material] + 1 }));
      pushLog(`Победа! +${gain} энергии, +1 ${MATERIALS[m.material].name}.`);
      newRooms[pos] = { ...r, monster: null };
    } else {
      newRooms[pos] = { ...r, monster: m };
    }
    setRooms(newRooms);

    if (newHp <= 0) {
      setOver(true);
      pushLog('Твоё тело разрушено. Охота окончена.');
    }
  };

  const restart = () => {
    setRooms(buildRooms());
    setPos(SPAWN);
    setHp(100);
    setEnergy(0);
    setCollected({ metal: 0, wood: 0, cloth: 0 });
    setLog(['Новое подземелье сгенерировано.']);
    setOver(false);
  };

  const monstersLeft = rooms.filter((r) => r.monster).length;
  const won = monstersLeft === 0;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card p-6 md:p-8 grain">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Закрыть"
        >
          <Icon name="X" size={24} />
        </button>

        <div className="flex items-center gap-2 font-display font-bold text-xl tracking-[0.3em] text-primary text-glow-teal mb-6">
          <Icon name="Hexagon" size={20} /> MIMIC · ДЕМО
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-8">
          {/* Dungeon grid */}
          <div>
            <div className="grid grid-cols-4 gap-2 w-fit mx-auto">
              {rooms.map((r) => {
                const isHere = r.id === pos;
                const isNeighbor = neighbors.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => move(r.id)}
                    disabled={over || (!isNeighbor && !isHere)}
                    className={[
                      'relative w-16 h-16 rounded-lg border flex items-center justify-center transition-all',
                      isHere ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(45,212,191,0.4)]' : 'border-border bg-muted/40',
                      isNeighbor && !over ? 'hover:border-primary/70 cursor-pointer ring-1 ring-primary/30' : '',
                      !isNeighbor && !isHere ? 'opacity-60' : '',
                    ].join(' ')}
                  >
                    {r.id === SPAWN && <span className="absolute top-1 left-1.5 text-[9px] uppercase tracking-wider text-secondary font-display">spawn</span>}
                    {isHere ? (
                      <Icon name="Box" size={26} className="text-primary" />
                    ) : r.monster ? (
                      <Icon name="Ghost" size={22} className={MATERIALS[r.monster.material].color} />
                    ) : (
                      <Icon name="Dot" size={20} className="text-muted-foreground/40" />
                    )}
                    {r.monster && !isHere && (
                      <span className="absolute -bottom-1 text-[9px] text-destructive font-display">{r.monster.power}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Тыкай по соседним комнатам, чтобы переселиться. Дальше от spawn — сильнее монстры.
            </p>
          </div>

          {/* Panel */}
          <div className="flex flex-col gap-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 border border-border p-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-display mb-1">
                  <Icon name="Heart" size={14} className="text-destructive" /> Прочность
                </div>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                  <div className="h-full bg-destructive transition-all" style={{ width: `${hp}%` }} />
                </div>
                <span className="text-sm font-display">{hp}/100</span>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border p-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-display mb-1">
                  <Icon name="Zap" size={14} className="text-secondary" /> Энергия
                </div>
                <span className="text-2xl font-display font-bold text-secondary text-glow-amber">{energy}</span>
              </div>
            </div>

            {/* Materials */}
            <div className="rounded-lg bg-muted/40 border border-border p-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-display mb-2">Собранные материалы</div>
              <div className="flex gap-4">
                {MAT_KEYS.map((k) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <Icon name={MATERIALS[k].icon} size={18} className={MATERIALS[k].color} />
                    <span className="font-display text-lg">{collected[k]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            {!over && !won && (
              <Button
                onClick={attack}
                disabled={!rooms[pos].monster}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display uppercase tracking-wider h-12"
              >
                <Icon name="Swords" size={18} className="mr-2" />
                {rooms[pos].monster ? 'Атаковать' : 'Монстров нет'}
              </Button>
            )}

            {(over || won) && (
              <div className={`rounded-lg p-4 text-center border ${won ? 'border-primary/50 bg-primary/10' : 'border-destructive/50 bg-destructive/10'}`}>
                <div className="font-display uppercase text-xl mb-1">{won ? 'Подземелье зачищено!' : 'Тело разрушено'}</div>
                <p className="text-sm text-muted-foreground mb-3">Накоплено энергии: {energy}</p>
                <Button onClick={restart} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-display uppercase tracking-wider">
                  <Icon name="RotateCcw" size={16} className="mr-2" /> Заново
                </Button>
              </div>
            )}

            {/* Log */}
            <div className="rounded-lg bg-background/60 border border-border p-3 text-sm space-y-1 min-h-[110px]">
              {log.map((line, i) => (
                <div key={i} className={i === 0 ? 'text-foreground' : 'text-muted-foreground/60'}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MimicDemo;

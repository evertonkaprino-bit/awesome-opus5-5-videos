import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
	C,
	Caption,
	Candle,
	Defs,
	Grain,
	H,
	Jitter,
	Marble,
	Pool,
	Puppet,
	Vignette,
	W,
	armPoints,
	ArmOnly,
	lerp,
	rnd,
	stepTo,
	useStep,
} from './lib';

const Frame: React.FC<{step: number; children: React.ReactNode; grain?: number; vig?: number; jit?: number}> = ({
	step,
	children,
	grain = 0.22,
	vig = 0.85,
	jit = 1.6,
}) => (
	<AbsoluteFill style={{backgroundColor: '#050607'}}>
		<Jitter step={step} amt={jit}>
			{children}
		</Jitter>
		<Vignette strength={vig} />
		<Grain step={step} amount={grain} />
	</AbsoluteFill>
);

const Wallpaper: React.FC<{x: number; y: number; w: number; h: number; step: number; a?: string; b?: string}> = ({
	x,
	y,
	w,
	h,
	step,
	a = '#6E6553',
	b = '#5E5646',
}) => {
	const stripes = [];
	const sw = 34;
	for (let i = 0; i * sw < w; i++) {
		stripes.push(<rect key={i} x={x + i * sw} y={y} width={sw / 2} height={h} fill={i % 2 ? a : b} />);
	}
	return (
		<g filter="url(#rough)">
			<rect x={x} y={y} width={w} height={h} fill={a} />
			{stripes}
			{/* papel descascando */}
			<path
				d={`M ${x + w * 0.62} ${y + h * 0.18} q 40 10 60 60 q -30 -6 -46 18 q -10 -40 -14 -78 Z`}
				fill="#3E382D"
				opacity={0.85}
			/>
			<path d={`M ${x + w * 0.15} ${y + h * 0.7} q 30 -20 70 -6 q -24 20 -70 6 Z`} fill="#3A342A" opacity={0.8} />
		</g>
	);
};

// ============ CENA 1 — HOOK: o olho (0–3 s) ============
export const S1: React.FC = () => {
	const {f, step} = useStep();
	const lit = f >= 6;
	const rot = f < 28 ? 0 : f < 44 ? 125 : 245;
	const look = f < 44 ? 0.5 : 0;
	const tremble = f >= 28 ? Math.sin(step * 2.1) * Math.max(0, 14 - (f - 28) * 0.5) : 0;
	return (
		<Frame step={step} vig={0.9}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<Defs seed={step} />
				<ellipse cx={560} cy={980} rx={980} ry={1150} fill="url(#porcG)" filter="url(#porc)" />
				<path
					d="M 60 260 L 140 360 L 110 430 L 190 520 L 160 600 L 240 690 L 215 760"
					fill="none"
					stroke="#2B2620"
					strokeWidth={7}
					strokeLinejoin="bevel"
				/>
				<path d="M -40 1530 C 300 1500, 700 1520, 1120 1470" fill="none" stroke="#A3977F" strokeWidth={3} opacity={0.6} />
				<g transform="translate(570 1010)">
					<Marble r={370} rot={rot} lookX={look} lookY={-0.2} glint={lit ? 1 : 0.15} />
				</g>
				<line
					x1={-20}
					y1={1560 + tremble}
					x2={1100}
					y2={420 - tremble}
					stroke={C.crimson}
					strokeWidth={12}
					strokeLinecap="round"
				/>
			</svg>
			<AbsoluteFill style={{backgroundColor: '#020304', opacity: lit ? 0.18 + rnd(step) * 0.06 : 0.78}} />
			<Pool x={420} y={700} r={900} dark={0.55} warm={lit ? 0.3 : 0.05} />
			<Caption text="ele conserta tudo que quebra…" start={14} f={f} />
		</Frame>
	);
};

// ============ CENA 2 — O sótão e a casa de bonecas (3–10 s) ============
export const S2: React.FC = () => {
	const {f, step} = useStep();
	const zoom = stepTo(f, 0, 160, 1, 1.12, 20);
	const sew = Math.sin(step * 0.9);
	const armR: [number, number] = [-40 - sew * 22, -50 - sew * 20];
	const puppetX = 470;
	const puppetY = 1650;
	const s = 0.42;
	const hand = armPoints(58, -328, armR[0], armR[1]);
	const hx = puppetX + hand.hx * s;
	const hy = puppetY + hand.hy * s;
	const rain = Array.from({length: 70}, (_, i) => {
		const x0 = 350 + rnd(i) * 380;
		const yy = ((rnd(i + 99) * 380 + step * 26 * (0.7 + rnd(i + 5))) % 380) + 150;
		const dx = x0 - 540;
		const dy = yy - 340;
		if (dx * dx + dy * dy > 185 * 185) return null;
		return <line key={i} x1={x0} y1={yy} x2={x0 - 3} y2={yy + 26} stroke="#A9C2CA" strokeWidth={2} opacity={0.45} />;
	});
	const motes = Array.from({length: 26}, (_, i) => (
		<circle
			key={i}
			cx={300 + rnd(i * 3) * 480 + Math.sin(step * 0.2 + i) * 12}
			cy={1150 + rnd(i * 7) * 480 - ((step * 1.5 + i * 20) % 140)}
			r={2 + rnd(i) * 2.5}
			fill="#FFE2B0"
			opacity={0.35}
		/>
	));
	return (
		<Frame step={step}>
			<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '540px 1450px'}}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
					<Defs seed={step} />
					<rect width={W} height={H} fill="#11171A" />
					<rect y={1700} width={W} height={220} fill="#1A1510" />
					{[0, 1, 2, 3, 4, 5].map((i) => (
						<line key={i} x1={0} y1={1730 + i * 34} x2={W} y2={1730 + i * 34} stroke="#0C0A08" strokeWidth={3} />
					))}
					{/* janela redonda com chuva */}
					<circle cx={540} cy={340} r={200} fill="#2C4650" />
					<circle cx={540} cy={340} r={200} fill="none" stroke="#2A2118" strokeWidth={26} />
					{rain}
					<line x1={540} y1={140} x2={540} y2={540} stroke="#2A2118" strokeWidth={14} />
					<line x1={340} y1={340} x2={740} y2={340} stroke="#2A2118" strokeWidth={14} />
					<polygon points="400,470 680,470 900,1720 180,1720" fill="#5E8A99" opacity={0.07} />
					{/* casa de bonecas */}
					<g filter="url(#rough)">
						<polygon points="170,880 540,600 910,880" fill={C.wood} />
						<polygon points="230,860 540,640 850,860" fill="#1A1410" />
						<rect x={170} y={870} width={740} height={830} fill={C.wood} />
					</g>
					{/* cômodos de cima (escuros) */}
					<rect x={205} y={905} width={325} height={350} fill="#15120F" />
					<rect x={550} y={905} width={325} height={350} fill="#15120F" />
					<g opacity={0.55}>
						<circle cx={330} cy={1150} r={26} fill="#7E7666" />
						<path d="M 300 1250 L 312 1176 L 348 1176 L 360 1250 Z" fill="#4C4438" />
						<rect x={640} y={1140} width={60} height={8} fill="#3A3024" />
						<rect x={646} y={1148} width={6} height={100} fill="#3A3024" />
						<rect x={690} y={1148} width={6} height={100} fill="#3A3024" />
					</g>
					<circle cx={540} cy={790} r={34} fill="#0C0A08" stroke="#3A2E22" strokeWidth={6} />
					{/* cômodo iluminado */}
					<Wallpaper x={205} y={1280} w={670} h={400} step={step} />
					<g transform={`translate(${puppetX} ${puppetY}) scale(${s})`}>
						<Puppet armR={armR} armL={[25, 30]} thread={null} />
					</g>
					<path
						d={`M ${puppetX} ${puppetY - 285 * s} Q ${(puppetX + hx) / 2} ${hy + 30} ${hx} ${hy}`}
						fill="none"
						stroke={C.crimson}
						strokeWidth={2.4}
					/>
					<line x1={hx} y1={hy} x2={565} y2={1598} stroke={C.crimson} strokeWidth={2} />
					{/* mesinha + boneca quebrada */}
					<rect x={360} y={1600} width={380} height={18} fill="#3B2C1E" />
					<rect x={380} y={1618} width={12} height={62} fill="#2E2217" />
					<rect x={708} y={1618} width={12} height={62} fill="#2E2217" />
					<ellipse cx={560} cy={1588} rx={44} ry={12} fill="#6C6152" />
					<circle cx={598} cy={1584} r={15} fill="url(#porcG)" />
					<path d="M 590 1578 l 10 8" stroke="#2B2620" strokeWidth={2} />
					<Candle x={680} y={1600} s={0.55} step={step} />
					{/* moldura frontal da casa */}
					<rect x={170} y={1265} width={740} height={18} fill="#3E3022" />
					<rect x={170} y={870} width={740} height={830} fill="none" stroke="#2C2117" strokeWidth={34} />
					<line x1={540} y1={890} x2={540} y2={1270} stroke="#2C2117" strokeWidth={22} />
					{motes}
				</svg>
			</AbsoluteFill>
			<Pool x={690 * zoom - 540 * (zoom - 1)} y={1530} r={520} dark={0.82} warm={0.32 + rnd(step) * 0.08} />
			<AbsoluteFill
				style={{background: 'radial-gradient(circle 260px at 540px 340px, rgba(110,160,180,0.18), rgba(0,0,0,0) 70%)'}}
			/>
		</Frame>
	);
};

// ============ CENA 3 — O conserto (10–16 s) ============
const Doll: React.FC<{x: number; y: number; turn: number; s?: number}> = ({x, y, turn, s = 1}) => {
	const a = (turn * Math.PI) / 180;
	const off = -Math.sin(a) * 44;
	const sq = Math.max(0.25, Math.cos(a));
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<path d="M -150 30 Q -60 -10 40 10 L 60 60 L -160 70 Z" fill="#5E3E3A" filter="url(#rough)" />
			<path d="M -150 30 Q -60 -10 40 10" fill="none" stroke="#3E2624" strokeWidth={4} />
			<g transform="translate(110 0)">
				<path d="M -70 -30 Q -40 -95 30 -88 Q 90 -60 78 10" fill="#2E241C" />
				<ellipse cx={0} cy={0} rx={74} ry={80} fill="url(#porcG)" filter="url(#porc)" />
				<g transform={`translate(${off} 0) scale(${sq} 1)`}>
					<circle cx={-24} cy={-10} r={12} fill="#1C2A30" />
					<circle cx={24} cy={-10} r={12} fill="#1C2A30" />
					<circle cx={-28} cy={-14} r={3.5} fill="#FFF" opacity={0.8} />
					<circle cx={20} cy={-14} r={3.5} fill="#FFF" opacity={0.8} />
					<path d="M -10 28 Q 0 33 10 28" stroke="#8E3B36" strokeWidth={4} fill="none" />
				</g>
				{/* bochecha costurada */}
				<path d="M -50 10 L -20 40" stroke="#2B2620" strokeWidth={2.5} />
				{[0, 1, 2, 3].map((i) => (
					<g key={i} stroke={C.crimson} strokeWidth={3}>
						<line x1={-52 + i * 9} y1={20 + i * 8} x2={-38 + i * 9} y2={12 + i * 8} />
					</g>
				))}
			</g>
		</g>
	);
};

export const S3: React.FC = () => {
	const {f, step} = useStep();
	const pull = f < 60 ? Math.sin(step * 0.8) : 0;
	const lower = stepTo(f, 62, 86, 0, 1, 4);
	const armL: [number, number] = [
		lerp(lower, 0, 1, 8 + pull * 7, 28),
		lerp(lower, 0, 1, -6 + pull * 12, 12),
	];
	const turn = stepTo(f, 90, 132, 72, 0, 6);
	const px = 630;
	const py = 1990;
	const s = 2.4;
	const hand = armPoints(-58, -328, armL[0], armL[1]);
	const hx = px + hand.hx * s;
	const hy = py + hand.hy * s;
	const dollX = 330;
	const dollY = 1665;
	const cheek = {x: dollX + 110 - 40, y: dollY + 20};
	return (
		<Frame step={step}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<Defs seed={step} />
				<Wallpaper x={0} y={0} w={W} h={1560} step={step} />
				<Candle x={150} y={1560} s={1.1} step={step} />
				<g transform={`translate(${px} ${py}) scale(${s})`}>
					<Puppet armL={[0, 0]} armR={[-20, -30]} thread={null} />
				</g>
				<rect x={0} y={1560} width={W} height={360} fill="#3A2A1C" filter="url(#rough)" />
				<rect x={0} y={1560} width={W} height={14} fill="#55402C" />
				<Doll x={dollX} y={dollY} turn={turn} />
				<g transform={`translate(${px} ${py}) scale(${s})`}>
					<g opacity={1}>
						{/* só o braço que costura, por cima da mesa */}
						<ArmOnly a1={armL[0]} a2={armL[1]} />
					</g>
				</g>
				<path
					d={`M ${px} ${py - 285 * s} Q ${(px + hx) / 2} ${hy + 60} ${hx} ${hy}`}
					fill="none"
					stroke={C.crimson}
					strokeWidth={4}
				/>
				{f < 60 && <line x1={hx} y1={hy} x2={cheek.x} y2={cheek.y} stroke={C.crimson} strokeWidth={3} />}
				{f >= 60 && f < 66 && (
					<line x1={cheek.x} y1={cheek.y} x2={cheek.x + 40} y2={cheek.y - 30} stroke={C.crimson} strokeWidth={3} />
				)}
			</svg>
			<Pool x={190} y={1440} r={900} dark={0.78} warm={0.3 + rnd(step) * 0.07} />
		</Frame>
	);
};

// ============ CENA 4 — A virada: a rachadura (16–23 s) ============
export const S4: React.FC = () => {
	const {f, step} = useStep();
	const crack = f < 28 ? 0.3 : f < 32 ? 0.6 : 0.68;
	const chipY = f >= 28 ? Math.min(900, ((f - 28) / 2) ** 2 * 6) : 0;
	const raise = stepTo(f, 50, 110, 0, 1, 8);
	const armL: [number, number] = [lerp(raise, 0, 1, 14, 200), lerp(raise, 0, 1, 4, -32)];
	const tilt = stepTo(f, 120, 150, 0, -6, 2);
	const s = 3.0;
	const flick = 0.22 + rnd(step * 1.3) * 0.16 + (rnd(step * 0.7) > 0.85 ? -0.12 : 0);
	return (
		<Frame step={step}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<Defs seed={step} />
				<rect width={W} height={H} fill="#0F1517" />
				<g transform={`translate(540 ${880 + 470 * s}) scale(${s})`}>
					<Puppet crack={crack} tilt={tilt} armL={armL} armsFront lookX={0.1} />
				</g>
				{f >= 28 && chipY < 900 && (
					<polygon
						points="0,0 14,6 4,16"
						fill={C.porcelainHi}
						transform={`translate(${540 - 72 * s} ${880 + (470 - 500) * s + chipY}) rotate(${f * 9})`}
					/>
				)}
			</svg>
			<Pool x={160} y={820} r={1000} dark={0.72} warm={flick} />
			<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0) 45%, rgba(20,50,60,0.35) 100%)'}} />
		</Frame>
	);
};

// ============ CENA 5 — O corredor (23–31 s) ============
const VP = {x: 540, y: 800};
const proj = (X: number, Y: number, z: number) => ({x: VP.x + X / z, y: VP.y + Y / z});
const FLOOR = 1120;
const CEIL = -800;

const Door: React.FC<{side: -1 | 1; z: number}> = ({side, z}) => {
	const X = side * 540;
	const z2 = z + 0.55;
	const top = FLOOR - 1250;
	const p = [proj(X, FLOOR, z), proj(X, top, z), proj(X, top, z2), proj(X, FLOOR, z2)];
	const pts = p.map((q) => `${q.x},${q.y}`).join(' ');
	const k = proj(X, FLOOR - 600, z2 - 0.1);
	return (
		<g>
			<polygon points={pts} fill="#2C2118" stroke="#4A3A28" strokeWidth={Math.max(1, 8 / z)} />
			<circle cx={k.x} cy={k.y} r={Math.max(1.2, 10 / z)} fill="#8A7445" />
		</g>
	);
};

export const S5: React.FC = () => {
	const {f, step} = useStep();
	// caminha, para para espiar, caminha de novo
	const zAt = (t: number) => {
		if (t < 40) return lerp(t, 0, 40, 1.25, 1.9);
		if (t < 60) return 1.9;
		if (t < 100) return lerp(t, 60, 100, 1.9, 2.9);
		if (t < 120) return 2.9;
		return lerp(t, 120, 180, 2.9, 4.6);
	};
	const walking = (t: number) => !((t >= 40 && t < 60) || (t >= 100 && t < 120) || t >= 180);
	const z = zAt(f);
	const zd = zAt(Math.max(0, f - 8));
	const k = 1.55;
	const bob = walking(f) ? (step % 2 ? -6 : 0) : 0;
	const legSwing = walking(f) ? (step % 2 ? 9 : -9) : 0;
	const base = proj(0, FLOOR, z);
	const sc = k / z;
	const turnHead = !walking(f) && f < 180 ? (f < 60 ? -10 : 10) : 0;
	const sbase = proj(520, FLOOR, zd);
	const ssc = (k * 1.45) / zd;
	const dolly = stepTo(f, 0, 190, 1, 1.07, 24);
	const doors: React.ReactNode[] = [];
	for (let i = 0; i < 9; i++) {
		const zz = 1.4 + i * 1.15;
		doors.push(<Door key={`l${i}`} side={-1} z={zz} />, <Door key={`r${i}`} side={1} z={zz + 0.4} />);
	}
	const far = 14;
	const fl = [proj(-540, FLOOR, far), proj(540, FLOOR, far), proj(540, CEIL, far), proj(-540, CEIL, far)];
	const chest = {x: base.x, y: base.y + (-285 + bob) * sc};
	const candlePos = proj(-70, FLOOR - 330, z);
	return (
		<Frame step={step}>
			<AbsoluteFill style={{transform: `scale(${dolly})`, transformOrigin: '540px 800px'}}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
					<Defs seed={step} />
					<rect width={W} height={H} fill="#141210" />
					{/* paredes */}
					<polygon points={`0,0 ${fl[3].x},${fl[3].y} ${fl[0].x},${fl[0].y} 0,${H}`} fill="#4A4236" />
					<polygon points={`${W},0 ${fl[2].x},${fl[2].y} ${fl[1].x},${fl[1].y} ${W},${H}`} fill="#433B30" />
					<polygon points={`0,${H} ${fl[0].x},${fl[0].y} ${fl[1].x},${fl[1].y} ${W},${H}`} fill="#2A2018" />
					<polygon points={`0,0 ${fl[3].x},${fl[3].y} ${fl[2].x},${fl[2].y} ${W},0`} fill="#191612" />
					{/* listras de damasco convergindo */}
					{Array.from({length: 14}, (_, i) => {
						const zz = 1 + i * 0.9;
						const a = proj(-540, CEIL, zz);
						const b = proj(-540, FLOOR, zz);
						const c = proj(540, CEIL, zz + 0.3);
						const d = proj(540, FLOOR, zz + 0.3);
						return (
							<g key={i} stroke="#3A3329" strokeWidth={Math.max(1, 10 / zz)}>
								<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
								<line x1={c.x} y1={c.y} x2={d.x} y2={d.y} />
							</g>
						);
					})}
					{/* tábuas do chão */}
					{[-400, -240, -80, 80, 240, 400].map((X) => {
						const a = proj(X, FLOOR, 1);
						const b = proj(X, FLOOR, far);
						return <line key={X} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#1A130D" strokeWidth={3} />;
					})}
					{doors}
					<polygon points={fl.map((q) => `${q.x},${q.y}`).join(' ')} fill="#050505" />
					{/* sombra atrasada na parede */}
					<g
						transform={`translate(${sbase.x - 30 / zd} ${sbase.y}) scale(${ssc * 0.55} ${ssc}) skewY(-8)`}
						filter="url(#silh)"
						opacity={0.6}
					>
						<Puppet view="back" legSwing={0} />
					</g>
					{/* fio arrastando até a câmera */}
					<path
						d={`M ${chest.x} ${chest.y + 60 * sc} C ${chest.x + 30} ${base.y + 40}, ${540} ${1700}, ${560} ${H + 20}`}
						fill="none"
						stroke={C.crimson}
						strokeWidth={4}
					/>
					<g transform={`translate(${base.x} ${base.y + bob * sc}) scale(${sc})`}>
						<Puppet view="back" tilt={turnHead} legSwing={legSwing} armL={[150, 20]} />
					</g>
					<Candle x={candlePos.x} y={candlePos.y} s={0.5 / z} step={step} />
				</svg>
			</AbsoluteFill>
			<Pool x={candlePos.x} y={candlePos.y - 40 / z} r={560} dark={0.7} warm={0.28 + rnd(step) * 0.06} />
		</Frame>
	);
};

// ============ CENA 6 — Clímax: a janela verde (31–39 s) ============
export const S6: React.FC = () => {
	const {f, step} = useStep();
	const tilt = stepTo(f, 30, 90, 0, 9, 4);
	const rot = f < 104 ? 20 : f < 124 ? 140 : 260;
	const lookX = f < 104 ? 0.6 : f < 124 ? 0.25 : 0;
	const fog = f >= 140 ? Math.min(0.28, (f - 140) * 0.008) : 0;
	const push = stepTo(f, 0, 190, 1, 1.1, 24);
	const s = 2.3;
	const cx = 540;
	const cy = 1000 + 470 * s;
	return (
		<Frame step={step} vig={0.92}>
			<AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '540px 900px'}}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
					<Defs seed={step} />
					<rect width={W} height={H} fill="#0C0F0B" />
					<g style={{filter: 'grayscale(1) sepia(0.6) hue-rotate(45deg) saturate(1.6) contrast(1.35) brightness(0.85)'}}>
						<rect x={150} y={420} width={780} height={1100} fill="#0B0D0A" />
						<g transform={`translate(${cx} ${cy}) scale(${s})`}>
							<Puppet tilt={tilt} pupilL={rot} pupilR={-rot} lookX={lookX} crack={0.68} thread={null} armL={[160, 30]} armR={[-160, -30]} />
						</g>
					</g>
					{/* mãos espalmadas no vidro */}
					{[
						[290, 1250, -1],
						[790, 1250, 1],
					].map(([x, y, sd], i) => (
						<g key={i} transform={`translate(${x} ${y}) scale(${sd} 1)`} opacity={0.85}>
							<ellipse cx={0} cy={0} rx={34} ry={42} fill="#4A5A44" />
							{[-30, -10, 10, 30].map((a, j) => (
								<line
									key={j}
									x1={0}
									y1={-20}
									x2={Math.sin((a * Math.PI) / 180) * 95}
									y2={-20 - Math.cos((a * Math.PI) / 180) * 95}
									stroke="#7E8C72"
									strokeWidth={8}
									strokeLinecap="round"
								/>
							))}
						</g>
					))}
					{/* fio — a única cor que sobrevive */}
					<path d={`M ${cx} ${cy - 285 * s} C ${cx + 40} ${cy - 200 * s}, ${cx + 90} 1600, ${cx + 60} 1700`} fill="none" stroke={C.crimson} strokeWidth={6} />
					<ellipse cx={cx} cy={cy - 405 * s} rx={110} ry={50} fill="#DDE6D8" opacity={fog} filter="url(#soft)" />
					{/* vidro: reflexos e poeira */}
					<polygon points="200,460 300,460 160,1400 150,1300" fill="#CFE0C8" opacity={0.06} />
					<polygon points="640,460 700,460 520,1480 470,1480" fill="#CFE0C8" opacity={0.05} />
					{Array.from({length: 40}, (_, i) => (
						<circle key={i} cx={170 + rnd(i * 5) * 740} cy={440 + rnd(i * 9) * 1060} r={1 + rnd(i) * 2} fill="#D9E3CF" opacity={0.25} />
					))}
					{/* moldura e travessas da janela */}
					<g filter="url(#rough)">
						<rect x={0} y={0} width={W} height={420} fill="#232A20" />
						<rect x={0} y={1520} width={W} height={400} fill="#232A20" />
						<rect x={0} y={420} width={150} height={1100} fill="#232A20" />
						<rect x={930} y={420} width={150} height={1100} fill="#232A20" />
						{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
							<line key={i} x1={0} y1={60 + i * 120} x2={W} y2={60 + i * 120} stroke="#151A13" strokeWidth={4} opacity={i * 120 < 420 ? 1 : 0} />
						))}
						<rect x={150} y={420} width={780} height={1100} fill="none" stroke="#3A4434" strokeWidth={40} />
						<rect x={528} y={420} width={24} height={1100} fill="#3A4434" />
						<rect x={150} y={958} width={780} height={24} fill="#3A4434" />
						<path d="M 150 700 l 30 20 l -10 30 l 26 18" stroke="#121510" strokeWidth={5} fill="none" />
					</g>
				</svg>
			</AbsoluteFill>
			<AbsoluteFill
				style={{background: 'linear-gradient(0deg, rgba(110,139,90,0.35) 0%, rgba(110,139,90,0.05) 55%, rgba(0,0,0,0.5) 100%)', mixBlendMode: 'screen'}}
			/>
		</Frame>
	);
};

// ============ CENA 7 — Escuro (39–44 s) ============
export const S7: React.FC = () => {
	const {f, step} = useStep();
	const flash = (at: number, len: number) => f >= at && f < at + len;
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<Defs seed={step} />
				{f < 30 && (
					<path
						d={`M 540 1200 C ${520 + f} ${1100 - f * 2}, ${580 - f} ${1000 - f * 3}, ${540 + f * 0.6} ${880 - f * 4}`}
						stroke="#8A8F92"
						strokeWidth={6}
						fill="none"
						opacity={0.5 - f / 60}
						filter="url(#soft)"
					/>
				)}
				{flash(34, 4) && (
					<path d="M -40 1400 C 300 900, 700 1300, 1120 500" stroke={C.crimson} strokeWidth={18} fill="none" />
				)}
				{flash(52, 4) && (
					<g>
						<line x1={120} y1={1700} x2={900} y2={300} stroke="#B9C2C5" strokeWidth={20} strokeLinecap="round" />
						<ellipse cx={170} cy={1610} rx={14} ry={34} fill="none" stroke="#DDE2E4" strokeWidth={6} transform="rotate(30 170 1610)" />
					</g>
				)}
				{flash(70, 4) && (
					<g stroke="#6F6A60" strokeWidth={14} strokeLinecap="round">
						{[-28, -10, 8, 26].map((a, i) => (
							<line
								key={i}
								x1={540}
								y1={1950}
								x2={540 + Math.sin((a * Math.PI) / 180) * 700}
								y2={1950 - Math.cos((a * Math.PI) / 180) * (900 + i * 40)}
							/>
						))}
					</g>
				)}
				{flash(88, 2) && <path d="M 1120 1500 C 700 1100, 400 1500, -40 700" stroke={C.crimson} strokeWidth={14} fill="none" />}
				{flash(104, 6) && (
					<g>
						<g transform="translate(420 900)">
							<Marble r={90} rot={0} />
						</g>
						<g transform="translate(680 920)">
							<Marble r={58} rot={90} />
						</g>
					</g>
				)}
			</svg>
			<Grain step={step} amount={0.28} />
		</AbsoluteFill>
	);
};

// ============ CENA 8 — O retorno (44–52 s) ============
export const S8: React.FC = () => {
	const {f, step} = useStep();
	const lit = f >= 20;
	const flare = f >= 20 && f < 34 ? 1 - (f - 20) / 14 : 0;
	const tilt = stepTo(f, 90, 100, 0, 3, 1);
	const smile = stepTo(f, 120, 130, 0, 0.5, 1);
	const s = 4.6;
	return (
		<Frame step={step} vig={0.9}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<Defs seed={step} />
				<rect width={W} height={H} fill="#050505" />
				<g transform={`translate(540 ${1010 + 470 * s}) scale(${s})`}>
					<Puppet crack={0.78} stitched tilt={tilt} smile={smile} pupilL={260} pupilR={-260} glint={lit ? 1 : 0} />
				</g>
			</svg>
			<AbsoluteFill
				style={{
					background: `linear-gradient(0deg, rgba(255,170,80,${lit ? 0.32 + rnd(step) * 0.08 : 0}) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)`,
					mixBlendMode: 'screen',
				}}
			/>
			<AbsoluteFill style={{backgroundColor: '#000', opacity: lit ? 0.12 : 0.96}} />
			<AbsoluteFill style={{background: 'radial-gradient(circle 700px at 540px 1900px, rgba(255,220,160,1), rgba(255,200,120,0) 70%)', opacity: flare}} />
		</Frame>
	);
};

// ============ CENA 9 — O gancho: a agulha (52–58 s) ============
export const S9: React.FC = () => {
	const {f, step} = useStep();
	const near = stepTo(f, 8, 80, 1, 2.6, 10);
	const s = 1.75;
	const px = 540;
	const py = 860 + 470 * s;
	return (
		<Frame step={step}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<Defs seed={step} />
				<rect width={W} height={H} fill="#070809" />
				<g style={{filter: 'blur(5px)'}}>
					<g transform={`translate(${px} ${py}) scale(${s})`}>
						<Puppet crack={0.78} stitched tilt={-4} smile={0.5} pupilL={260} pupilR={-260} armL={[150, -40]} armR={[-150, 40]} armsFront />
					</g>
				</g>
				<g transform={`translate(540 980) scale(${near}) translate(-540 -980)`}>
					<polygon points="560,1500 576,1500 548,980 540,960" fill="#A9B2B5" />
					<polygon points="566,1500 576,1500 548,980" fill="#E3E8EA" opacity={0.6} />
					<ellipse cx={568} cy={1470} rx={5} ry={16} fill="#070809" />
					<path d={`M 568 1470 C 640 1520, 600 1700, 700 1900`} stroke={C.crimson} strokeWidth={4} fill="none" />
					<circle cx={541} cy={962} r={4 + near} fill="#FFFFFF" opacity={0.7} />
				</g>
			</svg>
			<Pool x={260} y={900} r={1000} dark={0.6} warm={0.25 + rnd(step) * 0.06} />
			<Caption text="Sua vez." start={88} f={f} y={300} size={92} />
			<Caption text="segue pra ver quem ele conserta depois" start={112} f={f} y={470} size={46} />
		</Frame>
	);
};

// ============ CENA 10 — Loop (58–60 s) ============
export const S10: React.FC = () => {
	const {f, step} = useStep();
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{f >= 40 && (
				<AbsoluteFill style={{opacity: 0.22}}>
					<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
						<Defs seed={step} />
						<g transform="translate(570 1010)">
							<Marble r={370} rot={0} lookX={0.5} lookY={-0.2} glint={0.15} />
						</g>
					</svg>
				</AbsoluteFill>
			)}
			<Grain step={step} amount={0.25} />
		</AbsoluteFill>
	);
};

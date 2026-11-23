import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

// ---------- Paleta (guia de estilo) ----------
export const C = {
	graphite: '#2B2F36',
	petrol: '#4A5A5E',
	paper: '#8C8270',
	candle: '#C9B48A',
	crimson: '#B3122E',
	sick: '#6E8B5A',
	porcelainHi: '#F1EADB',
	porcelainLo: '#BFB39C',
	felt: '#3E4044',
	feltDark: '#2A2C30',
	brass: '#A8874A',
	wood: '#4A3A2A',
};

export const W = 1080;
export const H = 1920;

// ---------- Tempo em "dois" (12 fps dentro de 24 fps) ----------
export const useStep = () => {
	const raw = useCurrentFrame();
	const f = raw - (raw % 2);
	return {f, step: f / 2};
};

// Pseudo-aleatório determinístico
export const rnd = (n: number) => {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

// Interpolação "quantizada" — anda em degraus, como boneco reposicionado à mão
export const stepTo = (f: number, f0: number, f1: number, a: number, b: number, steps = 6) => {
	if (f <= f0) return a;
	if (f >= f1) return b;
	const t = (f - f0) / (f1 - f0);
	const q = Math.round(t * steps) / steps;
	return a + (b - a) * q;
};

export const lerp = (f: number, f0: number, f1: number, a: number, b: number) => {
	if (f <= f0) return a;
	if (f >= f1) return b;
	return a + ((f - f0) / (f1 - f0)) * (b - a);
};

// ---------- Filtros SVG compartilhados (textura muda a cada passo = "boil") ----------
export const Defs: React.FC<{seed: number; id?: string}> = ({seed, id = ''}) => (
	<defs>
		<filter id={`felt${id}`} x="-10%" y="-10%" width="120%" height="120%">
			<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={1} seed={seed} result="wob" />
			<feDisplacementMap in="SourceGraphic" in2="wob" scale="5" result="rough" />
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed + 7} result="n" />
			<feColorMatrix
				in="n"
				type="matrix"
				values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"
				result="g"
			/>
			<feBlend in="g" in2="rough" mode="multiply" result="tex" />
			<feComposite in="tex" in2="rough" operator="in" />
		</filter>
		<filter id={`porc${id}`} x="-10%" y="-10%" width="120%" height="120%">
			<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={1} seed={seed} result="wob" />
			<feDisplacementMap in="SourceGraphic" in2="wob" scale="2.5" result="rough" />
			<feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves={1} seed={seed + 3} result="n" />
			<feColorMatrix
				in="n"
				type="matrix"
				values="0 0 0 0 0.85  0 0 0 0 0.8  0 0 0 0 0.72  0 0 0 0.18 0"
				result="g"
			/>
			<feComposite in="g" in2="rough" operator="in" result="speck" />
			<feBlend in="speck" in2="rough" mode="multiply" />
		</filter>
		<filter id={`rough${id}`}>
			<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={1} seed={seed} result="wob" />
			<feDisplacementMap in="SourceGraphic" in2="wob" scale="4" />
		</filter>
		<filter id={`silh${id}`}>
			<feFlood floodColor="#050607" result="k" />
			<feComposite in="k" in2="SourceGraphic" operator="in" />
			<feGaussianBlur stdDeviation="3" />
		</filter>
		<filter id={`soft${id}`}>
			<feGaussianBlur stdDeviation="18" />
		</filter>
		<radialGradient id={`porcG${id}`} cx="40%" cy="35%" r="70%">
			<stop offset="0%" stopColor={C.porcelainHi} />
			<stop offset="70%" stopColor="#DCD2BF" />
			<stop offset="100%" stopColor={C.porcelainLo} />
		</radialGradient>
		<radialGradient id={`marbleG${id}`} cx="40%" cy="35%" r="65%">
			<stop offset="0%" stopColor="#9DB0AA" />
			<stop offset="45%" stopColor="#5E6F6A" />
			<stop offset="85%" stopColor="#26302D" />
			<stop offset="100%" stopColor="#0F1412" />
		</radialGradient>
		<linearGradient id={`brassG${id}`} x1="0" x2="1" y1="0" y2="0">
			<stop offset="0%" stopColor="#5E4A26" />
			<stop offset="45%" stopColor="#C4A35F" />
			<stop offset="100%" stopColor="#5A4422" />
		</linearGradient>
		<pattern id={`knit${id}`} width="10" height="9" patternUnits="userSpaceOnUse">
			<rect width="10" height="9" fill="#B7A786" />
			<path d="M0 0 L5 7 L10 0" fill="none" stroke="#8E7F60" strokeWidth="1.6" />
		</pattern>
		<pattern id={`dimple${id}`} width="9" height="9" patternUnits="userSpaceOnUse">
			<circle cx="4.5" cy="4.5" r="2" fill="#4A3A1C" opacity="0.55" />
		</pattern>
	</defs>
);

// Espiral da pupila (bolinha de gude)
const spiralPath = (r: number) => {
	let d = '';
	for (let i = 0; i <= 80; i++) {
		const t = i / 80;
		const a = t * Math.PI * 5;
		const rr = r * 0.12 + t * r * 0.8;
		const x = Math.cos(a) * rr;
		const y = Math.sin(a) * rr;
		d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ` L${x.toFixed(1)} ${y.toFixed(1)}`;
	}
	return d;
};

export const Marble: React.FC<{
	r: number;
	rot: number;
	lookX?: number;
	lookY?: number;
	glint?: number;
	id?: string;
}> = ({r, rot, lookX = 0, lookY = 0, glint = 1, id = ''}) => (
	<g>
		<circle r={r * 1.08} fill="#1A1714" opacity={0.6} />
		<circle r={r} fill={`url(#marbleG${id})`} />
		<g transform={`translate(${lookX * r * 0.25} ${lookY * r * 0.25}) rotate(${rot})`}>
			<path d={spiralPath(r * 0.7)} fill="none" stroke="#0A0C0B" strokeWidth={Math.max(1.5, r * 0.07)} strokeLinecap="round" />
			<circle r={r * 0.16} fill="#050606" />
		</g>
		<ellipse cx={-r * 0.35} cy={-r * 0.42} rx={r * 0.28} ry={r * 0.16} fill="#FFFFFF" opacity={0.55 * glint} transform={`rotate(-30 ${-r * 0.35} ${-r * 0.42})`} />
		<circle cx={r * 0.3} cy={-r * 0.25} r={r * 0.07} fill="#FFD9A0" opacity={0.9 * glint} />
	</g>
);

// Trajeto da rachadura (coordenadas locais do boneco)
export const CRACK = 'M -52 -548 L -44 -532 L -54 -519 L -66 -508 L -76 -492 L -72 -474 L -80 -458 L -70 -442 L -76 -426';
const CRACK_PTS: [number, number][] = [
	[-52, -548], [-44, -532], [-54, -519], [-66, -508], [-76, -492], [-72, -474], [-80, -458], [-70, -442], [-76, -426],
];

export const armPoints = (sx: number, sy: number, a1: number, a2: number, L = 100) => {
	const r1 = (a1 * Math.PI) / 180;
	const r2 = ((a1 + a2) * Math.PI) / 180;
	const ex = sx + Math.sin(r1) * L;
	const ey = sy + Math.cos(r1) * L;
	const hx = ex + Math.sin(r2) * L;
	const hy = ey + Math.cos(r2) * L;
	return {ex, ey, hx, hy, dir: a1 + a2};
};

export const Arm: React.FC<{sx: number; sy: number; a1: number; a2: number; id: string}> = ({sx, sy, a1, a2, id}) => {
	const p = armPoints(sx, sy, a1, a2);
	const fingers = [-22, -8, 6, 20].map((o, i) => {
		const a = ((p.dir + o) * Math.PI) / 180;
		const len = 34 + (i === 1 || i === 2 ? 6 : 0);
		return (
			<line
				key={i}
				x1={p.hx}
				y1={p.hy}
				x2={p.hx + Math.sin(a) * len}
				y2={p.hy + Math.cos(a) * len}
				stroke="#6F6A60"
				strokeWidth={3.2}
				strokeLinecap="round"
			/>
		);
	});
	return (
		<g>
			<g filter={`url(#felt${id})`}>
				<line x1={sx} y1={sy} x2={p.ex} y2={p.ey} stroke={C.felt} strokeWidth={15} strokeLinecap="round" />
				<line x1={p.ex} y1={p.ey} x2={p.hx} y2={p.hy} stroke={C.felt} strokeWidth={12} strokeLinecap="round" />
			</g>
			<circle cx={p.ex} cy={p.ey} r={8} fill="#6A645A" stroke="#2A2620" strokeWidth={2} />
			<circle cx={p.hx} cy={p.hy} r={6} fill="#6A645A" stroke="#2A2620" strokeWidth={2} />
			{fingers}
		</g>
	);
};

export type PuppetProps = {
	view?: 'front' | 'back';
	tilt?: number;
	pupilL?: number;
	pupilR?: number;
	lookX?: number;
	lookY?: number;
	glint?: number;
	crack?: number;
	stitched?: boolean;
	smile?: number;
	armL?: [number, number];
	armR?: [number, number];
	armsFront?: boolean;
	legSwing?: number;
	thread?: string | null;
	needleOnBack?: boolean;
	id?: string;
};

// O Alinhavo — boneco de ~600 unidades de altura, pés em y=0
export const Puppet: React.FC<PuppetProps> = ({
	view = 'front',
	tilt = 0,
	pupilL = 0,
	pupilR = 0,
	lookX = 0,
	lookY = 0,
	glint = 1,
	crack = 0.3,
	stitched = false,
	smile = 0,
	armL = [12, 6],
	armR = [-12, -6],
	armsFront = false,
	legSwing = 0,
	thread = 'M 0 -285 C 30 -180, 90 -60, 120 0 L 400 6',
	needleOnBack,
	id = '',
}) => {
	const showNeedle = needleOnBack ?? view === 'back';
	const arms = (
		<>
			<Arm sx={-58} sy={-328} a1={armL[0]} a2={armL[1]} id={id} />
			<Arm sx={58} sy={-328} a1={armR[0]} a2={armR[1]} id={id} />
		</>
	);
	const crackLen = Math.max(0, Math.min(1, crack));
	const nPts = Math.max(2, Math.round(crackLen * (CRACK_PTS.length - 1)) + 1);
	const stitches = stitched
		? CRACK_PTS.slice(0, nPts).map(([x, y], i) => (
				<g key={i} stroke={C.crimson} strokeWidth={3.4} strokeLinecap="round">
					<line x1={x - 9} y1={y - 5} x2={x + 9} y2={y + 5} />
					<line x1={x - 9} y1={y + 5} x2={x + 9} y2={y - 5} />
				</g>
			))
		: null;
	const back = view === 'back';
	return (
		<g>
			{/* agulha nas costas */}
			{showNeedle && (
				<g>
					<line x1={-70} y1={-110} x2={80} y2={-430} stroke="#9AA3A6" strokeWidth={back ? 7 : 5} strokeLinecap="round" />
					<ellipse cx={80} cy={-430} rx={4} ry={9} fill="none" stroke="#C8CED0" strokeWidth={2} transform="rotate(25 80 -430)" />
				</g>
			)}
			{/* pernas */}
			<g filter={`url(#felt${id})`}>
				<line x1={-20} y1={-175} x2={-24 - legSwing} y2={-4} stroke={C.feltDark} strokeWidth={17} strokeLinecap="round" />
				<line x1={20} y1={-175} x2={24 + legSwing} y2={-4} stroke={C.feltDark} strokeWidth={17} strokeLinecap="round" />
			</g>
			<circle cx={-22 - legSwing / 2} cy={-88} r={8} fill="#5C574E" />
			<circle cx={22 + legSwing / 2} cy={-88} r={8} fill="#5C574E" />
			<ellipse cx={-28 - legSwing} cy={-2} rx={16} ry={7} fill="#1E1F22" />
			<ellipse cx={28 + legSwing} cy={-2} rx={16} ry={7} fill="#1E1F22" />
			{!armsFront && arms}
			{/* tronco de feltro */}
			<path d="M -60 -338 Q 0 -350 60 -338 L 46 -172 Q 0 -160 -46 -172 Z" fill={C.felt} filter={`url(#felt${id})`} />
			<path d="M -60 -338 Q 0 -350 60 -338" fill="none" stroke="#1C1D20" strokeWidth={2} strokeDasharray="5 5" />
			{/* avental de tricô */}
			{!back ? (
				<g filter={`url(#rough${id})`}>
					<path d="M -40 -300 L 40 -300 L 50 -168 L -50 -168 Z" fill={`url(#knit${id})`} />
					<rect x={-30} y={-240} width={60} height={34} fill="#A6966F" stroke="#6F6246" strokeWidth={2} />
					{[-20, -6, 8, 20].map((x, i) => (
						<g key={i}>
							<line x1={x} y1={-240} x2={x + (i % 2 ? 3 : -3)} y2={-262} stroke="#B9BFC2" strokeWidth={1.6} />
							<circle cx={x + (i % 2 ? 3 : -3)} cy={-263} r={3} fill={i === 2 ? C.crimson : '#D9D2C0'} />
						</g>
					))}
				</g>
			) : (
				<g stroke="#8E7F60" strokeWidth={4} fill="none">
					<path d="M -46 -250 Q 0 -238 46 -250" />
					<path d="M -6 -246 q -14 18 -4 30 M 6 -246 q 14 18 4 30" />
				</g>
			)}
			{/* pescoço */}
			<rect x={-9} y={-376} width={18} height={44} fill={C.feltDark} filter={`url(#felt${id})`} />
			{armsFront && arms}
			{/* cabeça */}
			<g transform={`rotate(${tilt} 0 -380)`}>
				<ellipse cx={0} cy={-470} rx={92} ry={100} fill={`url(#porcG${id})`} filter={`url(#porc${id})`} />
				{!back && (
					<>
						<path d="M -88 -452 C -40 -442, 40 -448, 90 -458" fill="none" stroke="#9E927C" strokeWidth={1.4} opacity={0.7} />
						<path
							d={CRACK}
							fill="none"
							stroke="#2B2620"
							strokeWidth={3}
							strokeLinejoin="bevel"
							pathLength={1}
							strokeDasharray={`${crackLen} 1`}
						/>
						{stitches}
						<g transform="translate(-38 -480)">
							<Marble r={33} rot={pupilL} lookX={lookX} lookY={lookY} glint={glint} id={id} />
						</g>
						<g transform="translate(37 -472)">
							<Marble r={21} rot={pupilR} lookX={lookX} lookY={lookY} glint={glint} id={id} />
						</g>
						<path
							d={`M -18 -410 Q 0 ${-402 + smile * 6} 18 ${-412 - smile * 3}`}
							fill="none"
							stroke="#5A3A30"
							strokeWidth={3}
							strokeLinecap="round"
						/>
						<ellipse cx={-55} cy={-430} rx={14} ry={7} fill="#C9877A" opacity={0.18} />
						<ellipse cx={55} cy={-430} rx={14} ry={7} fill="#C9877A" opacity={0.18} />
					</>
				)}
				{back && <path d="M -60 -420 Q 0 -400 60 -420" fill="none" stroke="#A89C86" strokeWidth={2} opacity={0.6} />}
				{/* dedal-chapéu torto */}
				<g transform="rotate(-13 8 -566)">
					<path d="M -30 -560 L 44 -560 L 36 -622 Q 7 -636 -22 -622 Z" fill={`url(#brassG${id})`} />
					<path d="M -30 -560 L 44 -560 L 36 -622 Q 7 -636 -22 -622 Z" fill={`url(#dimple${id})`} />
					<rect x={-34} y={-566} width={82} height={10} rx={4} fill="#7A6232" />
					<path d="M 12 -618 l 8 10" stroke="#3A2C12" strokeWidth={3} />
				</g>
			</g>
			{/* fio vermelho saindo do peito */}
			{thread && !back && (
				<path d={thread} fill="none" stroke={C.crimson} strokeWidth={3.6} strokeLinecap="round" />
			)}
			{!back && <circle cx={0} cy={-285} r={4} fill="#7A0C1E" />}
		</g>
	);
};

// ---------- Vela ----------
export const Candle: React.FC<{x: number; y: number; s?: number; step: number; lit?: boolean}> = ({x, y, s = 1, step, lit = true}) => {
	const fl = 0.85 + rnd(step * 3.1) * 0.3;
	const sway = (rnd(step * 1.7) - 0.5) * 6;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			{lit && <circle cx={0} cy={-120} r={150 * fl} fill="#FFB65C" opacity={0.12} filter="url(#soft)" />}
			<rect x={-16} y={-90} width={32} height={90} rx={4} fill="#D8CDB0" />
			<path d="M -16 -84 q 6 22 0 30 M 10 -86 q 5 14 0 20" stroke="#E9E0C8" strokeWidth={5} fill="none" />
			<ellipse cx={0} cy={0} rx={30} ry={7} fill="#5E5446" />
			<line x1={0} y1={-90} x2={0} y2={-102} stroke="#1B1713" strokeWidth={2.4} />
			{lit && (
				<g transform={`translate(0 -102) scale(${0.9 + (fl - 0.85)} ${fl}) skewX(${sway})`}>
					<path d="M 0 0 C -12 -10, -9 -32, 0 -52 C 9 -32, 12 -10, 0 0 Z" fill="#FFCC7A" />
					<path d="M 0 -4 C -5 -10, -4 -22, 0 -32 C 4 -22, 5 -10, 0 -4 Z" fill="#FFF3D6" />
				</g>
			)}
		</g>
	);
};

// ---------- Camadas de acabamento ----------
export const Grain: React.FC<{step: number; amount?: number}> = ({step, amount = 0.22}) => (
	<AbsoluteFill style={{mixBlendMode: 'overlay', opacity: amount, pointerEvents: 'none'}}>
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
			<filter id="grainF">
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={step % 97} />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width={W} height={H} filter="url(#grainF)" />
		</svg>
	</AbsoluteFill>
);

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.85}) => (
	<AbsoluteFill
		style={{
			background: `radial-gradient(ellipse 70% 55% at 50% 48%, rgba(0,0,0,0) 40%, rgba(3,5,7,${strength}) 100%)`,
			pointerEvents: 'none',
		}}
	/>
);

// Luz pontual: escurece tudo longe da fonte de luz
export const Pool: React.FC<{x: number; y: number; r?: number; dark?: number; warm?: number; color?: string}> = ({
	x,
	y,
	r = 700,
	dark = 0.8,
	warm = 0.25,
	color = '255,178,92',
}) => (
	<>
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(${color},${warm}) 0%, rgba(${color},0) 70%)`,
				mixBlendMode: 'screen',
			}}
		/>
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle ${r * 1.3}px at ${x}px ${y}px, rgba(4,7,10,0) 35%, rgba(4,7,10,${dark}) 100%)`,
			}}
		/>
	</>
);

// Legenda com "máquina de escrever" em degraus
export const Caption: React.FC<{text: string; start: number; f: number; y?: number; size?: number; end?: number}> = ({
	text,
	start,
	f,
	y = 330,
	size = 66,
	end = 99999,
}) => {
	if (f < start || f > end) return null;
	const n = Math.min(text.length, Math.floor((f - start) / 2) + 1);
	return (
		<AbsoluteFill style={{alignItems: 'center', pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					top: y,
					width: 860,
					textAlign: 'center',
					fontFamily: '"DejaVu Serif", serif',
					fontStyle: 'italic',
					fontSize: size,
					lineHeight: 1.2,
					color: '#EDE4CC',
					textShadow: '0 0 18px rgba(0,0,0,0.95), 0 3px 6px rgba(0,0,0,0.9)',
					letterSpacing: 1,
				}}
			>
				{text.slice(0, n)}
			</div>
		</AbsoluteFill>
	);
};

// Tremido de stop-motion: o cenário inteiro "assenta" um pouco diferente a cada quadro
export const Jitter: React.FC<{step: number; amt?: number; children: React.ReactNode}> = ({step, amt = 1.6, children}) => {
	const dx = (rnd(step * 2.3) - 0.5) * 2 * amt;
	const dy = (rnd(step * 4.1) - 0.5) * 2 * amt;
	const fl = 1 + (rnd(step * 5.7) - 0.5) * 0.05;
	return (
		<AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px)`, filter: `brightness(${fl})`}}>{children}</AbsoluteFill>
	);
};

export const ArmOnly: React.FC<{a1: number; a2: number; id?: string}> = ({a1, a2, id = ''}) => (
	<Arm sx={-58} sy={-328} a1={a1} a2={a2} id={id} />
);

import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, staticFile} from 'remotion';
import {S1, S2, S3, S4, S5, S6, S7, S8, S9, S10} from './scenes';

// Roteiro (24 fps): duração de cada corte em frames
export const SCENES: [React.FC, number][] = [
	[S1, 72], // 0–3 s   hook
	[S2, 168], // 3–10 s  sótão
	[S3, 144], // 10–16 s conserto
	[S4, 168], // 16–23 s virada
	[S5, 192], // 23–31 s corredor
	[S6, 192], // 31–39 s clímax
	[S7, 120], // 39–44 s escuro
	[S8, 192], // 44–52 s retorno
	[S9, 144], // 52–58 s gancho
	[S10, 48], // 58–60 s loop
];

const Alinhavo: React.FC<{withAudio: boolean}> = ({withAudio}) => {
	let from = 0;
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{SCENES.map(([Comp, d], i) => {
				const el = (
					<Sequence key={i} from={from} durationInFrames={d} name={`Cena ${i + 1}`}>
						<Comp />
					</Sequence>
				);
				from += d;
				return el;
			})}
			{withAudio && <Audio src={staticFile('audio.wav')} />}
		</AbsoluteFill>
	);
};

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="Alinhavo" component={Alinhavo} durationInFrames={1440} fps={24} width={1080} height={1920} defaultProps={{withAudio: true}} />
		<Composition id="AlinhavoMudo" component={Alinhavo} durationInFrames={1440} fps={24} width={1080} height={1920} defaultProps={{withAudio: false}} />
	</>
);

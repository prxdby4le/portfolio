import React, { useEffect, useRef } from 'react';

// Lightweight WebGL animated gradient (no heavy allocations)
// Falls back to CSS gradient if WebGL not available.
export default function BackgroundCanvas(){
	const ref = useRef(null);

	useEffect(()=>{
		const canvas = ref.current; if(!canvas) return;
		const gl = canvas.getContext('webgl', { premultipliedAlpha:false, antialias:false });
		let raf; let start = performance.now();
		let disposed = false;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		const resize = () => {
			const w = window.innerWidth; const h = window.innerHeight;
			canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w+'px'; canvas.style.height = h+'px';
			if(gl) gl.viewport(0,0,canvas.width, canvas.height);
		};
		resize();
		window.addEventListener('resize', resize);

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if(!gl){
			canvas.style.background = 'radial-gradient(circle at 30% 30%, #1b1f2b,#0e1117)';
			return () => window.removeEventListener('resize', resize);
		}

		// Shader sources
		const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;
		const frag = `precision mediump float; uniform float t; uniform vec2 r; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3; 
			void main(){
				vec2 uv = gl_FragCoord.xy / r.xy; uv.x *= r.x/r.y; 
				float a = t*0.035; // even slower
				// gentler layered waves
				float n = 0.0;
				n += sin(uv.x*1.15 + a) * 0.22;
				n += sin(uv.y*1.45 - a*1.2) * 0.18;
				n += sin((uv.x+uv.y)*1.2 + a*0.6) * 0.14;
				n += sin(length(uv-0.5)*3.2 - a*1.6) * 0.14;
				n = n*0.5 + 0.5;
				// base neutral to soften overall saturation
				vec3 base = vec3(0.08,0.09,0.11);
				vec3 blend1 = mix(c1, c2, smoothstep(0.25,0.75,n));
				vec3 blend2 = mix(blend1, c3, 0.18 + 0.18*sin(a*0.6));
				vec3 col = mix(base, blend2, 0.55); // pull toward base (desaturate)
				float vig = smoothstep(0.96,0.45, length(uv-0.5));
				col *= vig;
				// slight tonal flattening
				col = mix(col, vec3(dot(col, vec3(0.333))), 0.08);
				gl_FragColor = vec4(col, 1.0);
			}`;

		const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
		const program = gl.createProgram();
		gl.attachShader(program, compile(gl.VERTEX_SHADER, vert));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
		gl.linkProgram(program);
		gl.useProgram(program);

		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(program, 'p');
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

		const uTime = gl.getUniformLocation(program,'t');
		const uRes = gl.getUniformLocation(program,'r');
		const uC1 = gl.getUniformLocation(program,'c1');
		const uC2 = gl.getUniformLocation(program,'c2');
		const uC3 = gl.getUniformLocation(program,'c3');

		const getThemeColors = () => {
			const neon = document.documentElement.getAttribute('data-theme') === 'neon';
			if(neon) return [ [0.20,0.38,0.78], [0.28,0.70,0.85], [0.78,0.42,0.70] ]; // softened neon
			return [ [0.95,0.55,0.25], [0.90,0.42,0.72], [0.28,0.72,0.90] ]; // softer default
		};

		const render = (now) => {
			if(disposed) return;
			const t = (now - start) / 1000;
			gl.uniform1f(uTime, prefersReduced ? 0.0 : t);
			gl.uniform2f(uRes, canvas.width, canvas.height);
			const [c1,c2,c3] = getThemeColors();
			gl.uniform3fv(uC1, c1); gl.uniform3fv(uC2, c2); gl.uniform3fv(uC3, c3);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			raf = requestAnimationFrame(render);
		};
		raf = requestAnimationFrame(render);

		const themeObserver = new MutationObserver(()=>{ /* colors auto pick next frame */ });
		themeObserver.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });

		return () => { disposed = true; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); themeObserver.disconnect(); };
	},[]);

	return <canvas ref={ref} style={{ position:'fixed', inset:0, width:'100%', height:'100%', zIndex:-1, background:'#0e1117' }} />;
}

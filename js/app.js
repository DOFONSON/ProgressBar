'use strict';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function createProgress() {
    const NS = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'progress__svg');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Прогресс');

    const track = document.createElementNS(NS, 'circle');
    track.setAttribute('class', 'progress__track');
    track.setAttribute('cx', '60');
    track.setAttribute('cy', '60');
    track.setAttribute('r', String(RADIUS));

    const value = document.createElementNS(NS, 'circle');
    value.setAttribute('class', 'progress__value');
    value.setAttribute('cx', '60');
    value.setAttribute('cy', '60');
    value.setAttribute('r', String(RADIUS));
    value.setAttribute('stroke-dasharray', String(CIRCUMFERENCE));
    value.setAttribute('stroke-dashoffset', String(CIRCUMFERENCE));

    svg.append(track, value);

    return { svg, valueCircle: value };
}

function setProgress(circle, percent) {
    const clamped = Math.min(100, Math.max(0, percent));
    const offset = CIRCUMFERENCE * (1 - clamped / 100);
    circle.setAttribute('stroke-dashoffset', String(offset));
}

const root = document.getElementById('progress-root');
const valueInput = document.getElementById('value-input');

const { svg, valueCircle } = createProgress();

const progressEl = document.createElement('div');
progressEl.className = 'progress';
progressEl.append(svg);
root.append(progressEl);

setProgress(valueCircle, Number(valueInput.value) || 0);

valueInput.addEventListener('input', () => {
    const val = Number(valueInput.value);
    if (Number.isFinite(val)) {
        setProgress(valueCircle, val);
    }
});
const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_VALUE = 0;
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export class Progress {
  #container;
  #root;
  #circle;
  #value = DEFAULT_VALUE;
  #animated = false;
  #hidden = false;

  constructor(container, options = {}) {

    this.#container = container;
    this.#createMarkup();

    this.setValue(options.value ?? DEFAULT_VALUE);
    this.setAnimated(options.animated ?? false);
    this.setHidden(options.hidden ?? false);
  }

  #createMarkup() {
    this.#root = document.createElement('div');
    this.#root.className = 'progress';
    this.#root.setAttribute('role', 'progressbar');
    this.#root.setAttribute('aria-valuemin', String(MIN_VALUE));
    this.#root.setAttribute('aria-valuemax', String(MAX_VALUE));

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'progress__svg');
    svg.setAttribute('viewBox', '0 0 160 160');
    svg.setAttribute('aria-hidden', 'true');

    const track = document.createElementNS(SVG_NS, 'circle');
    track.setAttribute('class', 'progress__track');
    track.setAttribute('cx', '80');
    track.setAttribute('cy', '80');
    track.setAttribute('r', String(RADIUS));

    this.#circle = document.createElementNS(SVG_NS, 'circle');
    this.#circle.setAttribute('class', 'progress__value');
    this.#circle.setAttribute('cx', '80');
    this.#circle.setAttribute('cy', '80');
    this.#circle.setAttribute('r', String(RADIUS));
    this.#circle.style.strokeDasharray = String(CIRCUMFERENCE);
    this.#circle.style.strokeDashoffset = String(CIRCUMFERENCE);

    svg.append(track, this.#circle);
    this.#root.append(svg);
    this.#container.append(this.#root);
  }

  #normalizeValue(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return DEFAULT_VALUE;
    }

    return Math.min(MAX_VALUE, Math.max(MIN_VALUE, numericValue));
  }

  setValue(value) {
    this.#value = this.#normalizeValue(value);
    const offset = CIRCUMFERENCE * (1 - this.#value / MAX_VALUE);

    this.#circle.style.strokeDashoffset = String(offset);
    this.#root.setAttribute('aria-valuenow', String(this.#value));

    return this;
  }

  setAnimated(isAnimated) {
    this.#animated = Boolean(isAnimated);
    this.#root.classList.toggle(
      'progress--animation-paused',
      !this.#animated
    );

    return this;
  }

  setHidden(isHidden) {
    this.#hidden = Boolean(isHidden);
    this.#root.classList.toggle('progress--hidden', this.#hidden);
    this.#root.setAttribute('aria-hidden', String(this.#hidden));
    return this;
  }

  getValue() {
    return this.#value;
  }

  getState() {
    return {
      value: this.#value,
      animated: this.#animated,
      hidden: this.#hidden,
    };
  }

  destroy() {
    this.#root.remove();
    this.#root = null;
    this.#circle = null;
    this.#container = null;
  }
}

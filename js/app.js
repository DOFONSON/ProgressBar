import { Progress } from './progress.js';

const valueInput = document.querySelector('#value-input');
const animateInput = document.querySelector('#animate-input');
const hideInput = document.querySelector('#hide-input');
const progressRoot = document.querySelector('#progress-root');
const controls = document.querySelector('#controls');

const progress = new Progress(progressRoot, {
    value: Number(valueInput.value),
    animated: animateInput.checked,
    hidden: hideInput.checked,
});

function updateValue() {
    const rawValue = valueInput.value.trim();

    if (rawValue === '') {
        valueInput.setCustomValidity('Введите число от 0 до 100');
        return;
    }

    const value = Number(rawValue);
    const isValid = Number.isFinite(value) && value >= 0 && value <= 100;

    valueInput.setCustomValidity(
        isValid ? '' : 'Введите число от 0 до 100'
    );

    if (isValid) {
        progress.setValue(value);
    }
}

valueInput.addEventListener('input', updateValue);

valueInput.addEventListener('blur', () => {
    const value = progress.getValue();
    valueInput.value = String(value);
    valueInput.setCustomValidity('');
});

valueInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        updateValue();
        valueInput.blur();
    }
});

animateInput.addEventListener('change', () => {
    progress.setAnimated(animateInput.checked);
});

hideInput.addEventListener('change', () => {
    progress.setHidden(hideInput.checked);
});

window.progress = progress;
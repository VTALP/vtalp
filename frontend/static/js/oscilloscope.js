// Stage 3 oscilloscope behaviour.
// This script keeps the Stage 2 waveform engine, then adds a CH1 probe and
// ground reference system so learners must complete a real measurement path.
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("scopeCanvas");
    const context = canvas.getContext("2d");
    const instrument = document.getElementById("scopeInstrument");
    const powerButton = document.getElementById("scopePowerButton");
    const screenStatus = document.getElementById("screenStatus");
    const sourceCards = document.querySelectorAll(".signal-source-card");
    const sourceObjectGrid = document.querySelector(".source-object-grid");
    const autoConnectionLines = document.getElementById("autoConnectionLines");
    const selectedSourceName = document.getElementById("selectedSourceName");
    const selectedSourceDescription = document.getElementById("selectedSourceDescription");
    const selectedSignalExplanation = document.getElementById("selectedSignalExplanation");
    const didYouKnowText = document.getElementById("didYouKnowText");
    const currentStepText = document.getElementById("currentStepText");
    const waveformTypeControl = document.getElementById("waveformTypeControl");
    const frequencyControl = document.getElementById("frequencyControl");
    const amplitudeControl = document.getElementById("amplitudeControl");
    const timeDivControl = document.getElementById("timeDivControl");
    const voltDivControl = document.getElementById("voltDivControl");
    const dutyCycleGroup = document.getElementById("dutyCycleGroup");
    const dutyCycleControl = document.getElementById("dutyCycleControl");
    const dutyCycleValue = document.getElementById("dutyCycleValue");
    const audioControlGroup = document.getElementById("audioControlGroup");
    const audioPlayButton = document.getElementById("audioPlayButton");
    const audioVolumeControl = document.getElementById("audioVolumeControl");
    const audioVolumeValue = document.getElementById("audioVolumeValue");
    const noiseLevelGroup = document.getElementById("noiseLevelGroup");
    const noiseLevelControl = document.getElementById("noiseLevelControl");
    const noiseLevelValue = document.getElementById("noiseLevelValue");
    const frequencyValue = document.getElementById("frequencyValue");
    const amplitudeValue = document.getElementById("amplitudeValue");
    const displayPowerStatus = document.getElementById("displayPowerStatus");
    const displayActiveSource = document.getElementById("displayActiveSource");
    const displayCh1Status = document.getElementById("displayCh1Status");
    const displayGroundStatus = document.getElementById("displayGroundStatus");
    const displayTriggerStatus = document.getElementById("displayTriggerStatus");
    const displayScaleStatus = document.getElementById("displayScaleStatus");
    const readoutSource = document.getElementById("readoutSource");
    const readoutFrequency = document.getElementById("readoutFrequency");
    const readoutAmplitude = document.getElementById("readoutAmplitude");
    const readoutPeriod = document.getElementById("readoutPeriod");
    const readoutVpp = document.getElementById("readoutVpp");
    const readoutTimeDiv = document.getElementById("readoutTimeDiv");
    const readoutVoltDiv = document.getElementById("readoutVoltDiv");
    const readoutNoiseLevel = document.getElementById("readoutNoiseLevel");
    const readoutWaveform = document.getElementById("readoutWaveform");
    const probeTools = document.querySelectorAll(".probe-tool");
    const ch1InputPort = document.getElementById("ch1InputPort");
    const groundReferencePort = document.getElementById("groundReferencePort");
    const probeStatusText = document.getElementById("probeStatusText");
    const probeFeedbackText = document.getElementById("probeFeedbackText");
    const resetScopeButton = document.getElementById("resetScopeButton");

    const scopeState = {
        powered: false,
        source: null,
        waveform: "Sine",
        frequency: 5,
        amplitude: 2,
        timeDivMs: 1,
        voltDiv: 1,
        dutyCycle: 50,
        audioPlaying: false,
        audioVolume: "Medium",
        audioFeedbackMessage: "",
        noiseLevel: "Medium",
        noisePhase: 0,
        sensorPhase: 0,
        activeProbe: "ch1",
        ch1Source: null,
        groundSource: null,
        autoConnected: false,
        confirmingSourceSwitch: false,
        lastConnectionMessage: "Connect CH1 probe to a signal source.",
    };

    let confirmationTimer = null;
    let audioContext = null;
    let audioOscillator = null;
    let audioGain = null;
    const renderState = {
        frequency: scopeState.frequency,
        amplitude: scopeState.amplitude,
        timeDivMs: scopeState.timeDivMs,
        voltDiv: scopeState.voltDiv,
        scrollTime: 0,
        lastFrameTime: null,
        transition: null,
    };

    const sourceDescriptions = {
        "Function Generator": "Manual source: choose sine, square, or triangle and adjust frequency and amplitude.",
        "AC Source": "AC Source selected. The scope displays a fixed 50 Hz sine wave like a low-voltage mains practice signal.",
        "PWM Generator": "PWM Generator selected. The scope displays a square pulse train; duty cycle changes the pulse width.",
        "Sensor Signal": "Sensor Signal selected. The scope displays a slowly changing analogue signal similar to light or temperature sensor output.",
        "Audio Signal": "An audio signal is an electrical waveform that can be heard as sound. Higher frequency produces a higher pitch, while lower frequency produces a lower pitch.",
        "Noisy Signal": "Noise is unwanted electrical disturbance added to a signal. On an oscilloscope, noise appears as rough or unstable waveform edges.",
    };

    const sourceTips = {
        "Function Generator": "The Function Generator lets engineers create test signals for electronic circuits.",
        "AC Source": "Most countries use 50 Hz AC mains, while others use 60 Hz.",
        "PWM Generator": "PWM is widely used for LED dimming and motor speed control.",
        "Sensor Signal": "Real sensors produce changing analog voltages based on physical conditions.",
        "Audio Signal": "Every sound can be represented as an electrical waveform.",
        "Noisy Signal": "Electrical noise can affect communication systems and electronic measurements.",
    };

    const audioSupportedSources = new Set([
        "Function Generator",
        "Audio Signal",
        "PWM Generator",
        "Noisy Signal",
    ]);

    powerButton.addEventListener("click", () => {
        const nextPowerState = !scopeState.powered;
        scopeState.powered = nextPowerState;

        if (!nextPowerState) {
            disconnectProbes("Oscilloscope turned off. Signal source is Not Connected.");
        }

        updateInterface();
    });

    sourceCards.forEach((card) => {
        card.addEventListener("click", () => {
            selectSource(card.dataset.source);
        });
    });

    probeTools.forEach((tool) => {
        tool.addEventListener("click", () => {
            scopeState.activeProbe = tool.dataset.probe;
            updateProbeVisuals();
        });
    });

    sourceObjectGrid.addEventListener("click", (event) => {
        const removeButton = event.target.closest(".remove-source-button");
        if (removeButton) {
            removeSelectedSource();
            return;
        }

        const autoConnectButton = event.target.closest(".auto-connect-button");
        if (autoConnectButton) {
            const sourceName = autoConnectButton.dataset.autoSource;
            if (hasCompleteConnection() && scopeState.ch1Source === sourceName) {
                disconnectSource(sourceName);
                return;
            }

            connectSourceAutomatically(sourceName);
            return;
        }

        const point = event.target.closest(".connection-point");
        if (point) {
            connectProbeToPoint(point.dataset.source, point.dataset.point);
            return;
        }

        const sourceObject = event.target.closest(".source-object");
        if (!sourceObject) {
            return;
        }

        const sourceName = sourceObject.dataset.sourceObject;
        selectSource(sourceName);
    });

    waveformTypeControl.addEventListener("change", () => {
        scopeState.waveform = waveformTypeControl.value;
        updateInterface();
    });

    frequencyControl.addEventListener("input", () => {
        scopeState.frequency = Number(frequencyControl.value);
        updateInterface();
    });

    amplitudeControl.addEventListener("input", () => {
        scopeState.amplitude = Number(amplitudeControl.value);
        updateInterface();
    });

    timeDivControl.addEventListener("change", () => {
        scopeState.timeDivMs = parseTimeDiv(timeDivControl.value);
        updateInterface();
    });

    voltDivControl.addEventListener("change", () => {
        scopeState.voltDiv = parseVoltDiv(voltDivControl.value);
        updateInterface();
    });

    dutyCycleControl.addEventListener("change", () => {
        scopeState.dutyCycle = Number(dutyCycleControl.value);
        updateInterface();
    });

    audioPlayButton.addEventListener("click", () => {
        if (scopeState.audioPlaying) {
            stopAudioTone();
            return;
        }

        startAudioTone();
    });

    audioVolumeControl.addEventListener("change", () => {
        scopeState.audioVolume = audioVolumeControl.value;
        syncAudioTone();
        updateInterface();
    });

    noiseLevelControl.addEventListener("change", () => {
        scopeState.noiseLevel = noiseLevelControl.value;
        updateInterface();
    });

    resetScopeButton.addEventListener("click", () => {
        resetOscilloscope();
    });

    function selectSource(sourceName) {
        const previousSource = scopeState.source;
        const previousSignal = getSignalSnapshot(true);

        if (previousSource !== sourceName) {
            disconnectProbes(`Selected ${sourceName}. Probes are not connected.`);
            resetSourceSettings(sourceName);
        }

        scopeState.source = sourceName;

        if (!audioSupportedSources.has(sourceName)) {
            stopAudioTone(false);
            scopeState.audioFeedbackMessage = "";
        }

        if (sourceName === "Function Generator" && previousSource === sourceName) {
            scopeState.waveform = waveformTypeControl.value;
            scopeState.frequency = clamp(Number(frequencyControl.value), 1, 100);
            scopeState.amplitude = Number(amplitudeControl.value);
        }

        if (sourceName === "AC Source") {
            scopeState.waveform = "Sine";
            scopeState.frequency = 50;
            scopeState.amplitude = 2;
        }

        if (sourceName === "PWM Generator") {
            scopeState.waveform = "Square";
            scopeState.frequency = 10;
            scopeState.amplitude = 3;
            scopeState.dutyCycle = Number(dutyCycleControl.value);
        }

        if (sourceName === "Sensor Signal") {
            scopeState.waveform = "Sensor";
            scopeState.frequency = 2;
            scopeState.amplitude = 2;
        }

        if (sourceName === "Audio Signal") {
            scopeState.waveform = "Sine";
            scopeState.frequency = previousSource === "Audio Signal"
                ? clamp(Number(frequencyControl.value), 100, 1000)
                : 440;
            scopeState.amplitude = Number(amplitudeControl.value);
        }

        if (sourceName === "Noisy Signal") {
            scopeState.waveform = "Noisy Sine";
            scopeState.frequency = previousSource === "Noisy Signal"
                ? clamp(Number(frequencyControl.value), 1, 100)
                : 12;
            scopeState.amplitude = Number(amplitudeControl.value);
            scopeState.noiseLevel = noiseLevelControl.value;
        }

        if (previousSource !== sourceName) {
            beginSignalTransition(previousSignal);
        }

        updateInterface();
    }

    function removeSelectedSource() {
        stopAudioTone(false);
        disconnectProbes("Source removed. Select a signal source to begin.");
        scopeState.source = null;
        resetSourceSettings(null);
        renderState.transition = null;
        renderState.scrollTime = 0;
        updateInterface();
    }

    function resetSourceSettings(sourceName) {
        scopeState.waveform = "Sine";
        scopeState.frequency = 5;
        scopeState.amplitude = 2;
        scopeState.dutyCycle = 50;
        scopeState.audioPlaying = false;
        scopeState.audioVolume = "Medium";
        scopeState.audioFeedbackMessage = "";
        scopeState.noiseLevel = "Medium";

        if (sourceName === "AC Source") {
            scopeState.frequency = 50;
        }

        if (sourceName === "PWM Generator") {
            scopeState.waveform = "Square";
            scopeState.frequency = 10;
            scopeState.amplitude = 3;
        }

        if (sourceName === "Sensor Signal") {
            scopeState.waveform = "Sensor";
            scopeState.frequency = 2;
        }

        if (sourceName === "Audio Signal") {
            scopeState.frequency = 440;
        }

        if (sourceName === "Noisy Signal") {
            scopeState.waveform = "Noisy Sine";
            scopeState.frequency = 12;
        }
    }

    function resetOscilloscope() {
        stopAudioTone(false);
        scopeState.powered = false;
        scopeState.source = null;
        scopeState.waveform = "Sine";
        scopeState.frequency = 5;
        scopeState.amplitude = 2;
        scopeState.timeDivMs = 1;
        scopeState.voltDiv = 1;
        scopeState.dutyCycle = 50;
        scopeState.audioPlaying = false;
        scopeState.audioVolume = "Medium";
        scopeState.audioFeedbackMessage = "";
        scopeState.noiseLevel = "Medium";
        scopeState.activeProbe = "ch1";
        scopeState.ch1Source = null;
        scopeState.groundSource = null;
        scopeState.autoConnected = false;
        scopeState.confirmingSourceSwitch = false;
        scopeState.lastConnectionMessage = "Oscilloscope reset. Select a signal source to begin.";
        renderState.frequency = scopeState.frequency;
        renderState.amplitude = scopeState.amplitude;
        renderState.timeDivMs = scopeState.timeDivMs;
        renderState.voltDiv = scopeState.voltDiv;
        renderState.scrollTime = 0;
        renderState.transition = null;
        updateInterface();
    }

    // Probe logic: CH1 must land on a signal point and ground must land on the
    // matching reference point. The connected source then drives the waveform.
    function connectProbeToPoint(sourceName, pointType) {
        if (!canConnectSignalSource()) {
            updateInterface();
            return;
        }

        if (scopeState.activeProbe === "ch1" && pointType === "signal") {
            scopeState.ch1Source = sourceName;
            scopeState.autoConnected = false;
            scopeState.lastConnectionMessage = "CH1 probe connected. Connect the ground clip to complete the reference.";
            selectSource(sourceName);
            return;
        }

        if (scopeState.activeProbe === "ground" && pointType === "ground") {
            scopeState.groundSource = sourceName;
            scopeState.autoConnected = false;
            scopeState.lastConnectionMessage = "Ground clip connected. Connect CH1 probe to the signal output.";
            selectSource(sourceName);
            return;
        }

        scopeState.lastConnectionMessage = scopeState.activeProbe === "ch1"
            ? "CH1 probe must connect to a signal output point."
            : "Ground clip must connect to a ground reference point.";
        updateInterface();
    }

    // Primary workflow: one click connects CH1 to Signal OUT and ground clip
    // to Ground. Manual connection remains available for learning the path.
    function connectSourceAutomatically(sourceName) {
        if (!canConnectSignalSource()) {
            updateInterface();
            return;
        }

        scopeState.ch1Source = sourceName;
        scopeState.groundSource = sourceName;
        scopeState.activeProbe = "ch1";
        scopeState.autoConnected = true;
        scopeState.confirmingSourceSwitch = false;
        scopeState.lastConnectionMessage = `✓ ${sourceName} connected successfully.`;
        selectSource(sourceName);
    }

    function disconnectSource(sourceName = scopeState.source) {
        disconnectProbes(`${sourceName} disconnected. Connect CH1 and Ground to view the waveform.`);
        selectSource(sourceName);
    }

    function disconnectProbes(message = "Not connected. Connect CH1 and Ground to view the waveform.") {
        if (confirmationTimer) {
            window.clearTimeout(confirmationTimer);
            confirmationTimer = null;
        }

        stopAudioTone(false);
        scopeState.ch1Source = null;
        scopeState.groundSource = null;
        scopeState.autoConnected = false;
        scopeState.confirmingSourceSwitch = false;
        scopeState.lastConnectionMessage = message;
    }

    function canConnectSignalSource() {
        if (scopeState.powered) {
            return true;
        }

        disconnectProbes("Please turn on the oscilloscope before connecting a signal source.");
        return false;
    }

    function hasCompleteConnection() {
        return Boolean(scopeState.ch1Source && scopeState.groundSource && scopeState.ch1Source === scopeState.groundSource);
    }

    function hasPartialConnection() {
        return Boolean(scopeState.ch1Source || scopeState.groundSource);
    }

    function canPlayAudio() {
        return scopeState.powered && audioSupportedSources.has(scopeState.source) && hasCompleteConnection();
    }

    // Web Audio is started only after the learner clicks Play Tone. The gain is
    // intentionally conservative so the lab remains safe and comfortable.
    async function startAudioTone() {
        if (!canPlayAudio()) {
            scopeState.audioFeedbackMessage = `${scopeState.source} sound is available after power and probe connection.`;
            updateInterface();
            return;
        }

        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextConstructor) {
            scopeState.audioFeedbackMessage = "This browser does not support Web Audio playback.";
            updateInterface();
            return;
        }

        try {
            if (!audioContext) {
                audioContext = new AudioContextConstructor();
            }

            await resumeAudioContext();

            stopAudioTone(false);
            audioOscillator = audioContext.createOscillator();
            audioGain = audioContext.createGain();
            audioOscillator.type = getAudioOscillatorType();
            audioOscillator.frequency.setValueAtTime(getAudioFrequency(), audioContext.currentTime);
            audioGain.gain.setValueAtTime(getAudioGainValue(), audioContext.currentTime);
            audioOscillator.connect(audioGain);
            audioGain.connect(audioContext.destination);
            audioOscillator.start();
            scopeState.audioPlaying = true;
            scopeState.audioFeedbackMessage = "Sound playing. Change frequency and amplitude to compare what you hear with the trace.";
            updateInterface();
        } catch (error) {
            scopeState.audioPlaying = false;
            scopeState.audioFeedbackMessage = "Sound could not start. Click Play again after interacting with the page.";
            updateInterface();
        }
    }

    function stopAudioTone(shouldUpdate = true) {
        if (audioOscillator) {
            audioOscillator.stop();
            audioOscillator.disconnect();
            audioOscillator = null;
        }

        if (audioGain) {
            audioGain.disconnect();
            audioGain = null;
        }

        scopeState.audioPlaying = false;

        if (audioSupportedSources.has(scopeState.source) && shouldUpdate) {
            scopeState.audioFeedbackMessage = "Sound paused.";
        }

        if (shouldUpdate) {
            updateInterface();
        }
    }

    async function resumeAudioContext() {
        if (!audioContext || audioContext.state !== "suspended") {
            return;
        }

        await Promise.race([
            audioContext.resume(),
            new Promise((resolve) => window.setTimeout(resolve, 250)),
        ]);
    }

    function syncAudioTone() {
        if (!scopeState.audioPlaying) {
            return;
        }

        if (!canPlayAudio()) {
            stopAudioTone(false);
            return;
        }

        if (audioOscillator && audioGain) {
            audioOscillator.type = getAudioOscillatorType();
            audioOscillator.frequency.setTargetAtTime(getAudioFrequency(), audioContext.currentTime, 0.02);
            audioGain.gain.setTargetAtTime(getAudioGainValue(), audioContext.currentTime, 0.02);
        }
    }

    function getAudioOscillatorType() {
        if (scopeState.source === "PWM Generator") {
            return "square";
        }

        if (scopeState.source === "Function Generator" && scopeState.waveform === "Square") {
            return "square";
        }

        if (scopeState.source === "Function Generator" && scopeState.waveform === "Triangle") {
            return "triangle";
        }

        if (scopeState.source === "Noisy Signal") {
            return "sawtooth";
        }

        return "sine";
    }

    function getAudioFrequency() {
        if (scopeState.source === "Audio Signal") {
            return clamp(scopeState.frequency, 100, 1000);
        }

        return clamp(120 + (scopeState.frequency * 9), 120, 1200);
    }

    function getAudioGainValue() {
        const volumeLevels = {
            Low: 0.03,
            Medium: 0.06,
            High: 0.1,
        };
        const amplitudeFactor = clamp(scopeState.amplitude / 5, 0.2, 1);
        return volumeLevels[scopeState.audioVolume] * amplitudeFactor;
    }

    function drawWaveform() {
        if (!scopeState.powered) {
            drawPowerOffScreen();
            return;
        }

        if (!hasCompleteConnection()) {
            drawNoSignalScreen();
            return;
        }

        drawGrid();
        const transitionProgress = getTransitionProgress();

        if (renderState.transition) {
            drawSignalTrace(renderState.transition.from, 1 - transitionProgress);
        }

        drawSignalTrace(getSignalSnapshot(true), renderState.transition ? transitionProgress : 1);
    }

    function drawSignalTrace(signal, opacity) {
        if (opacity <= 0) {
            return;
        }

        const centreY = canvas.height / 2;
        // Volt/Div sets vertical scale. A smaller value means each volt uses
        // more screen pixels, so the waveform appears taller.
        const pixelsPerVolt = getPixelsPerVolt(true);
        // Time/Div sets the full horizontal time window. A smaller value shows
        // less time across the screen, making waveform details easier to see.
        const visibleTimeSeconds = getVisibleTimeSeconds(true);

        context.strokeStyle = "#5eead4";
        context.globalAlpha = opacity;
        context.lineWidth = signal.waveform === "Square" ? 2.6 : 3.2;
        context.shadowBlur = 18 * opacity;
        context.shadowColor = "#2dd4bf";
        context.beginPath();

        for (let x = 0; x <= canvas.width; x += 2) {
            // Subtracting scrollTime moves the trace from left to right,
            // similar to a live digital oscilloscope sweep.
            const time = (x / canvas.width) * visibleTimeSeconds - renderState.scrollTime;
            const voltage = getSignalVoltageFor(signal, time);
            const y = clamp(centreY - voltage * pixelsPerVolt, 8, canvas.height - 8);

            if (x === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }

        context.stroke();
        context.shadowBlur = 0;
        context.globalAlpha = 1;
    }

    function getSignalVoltageFor(signal, time) {
        if (signal.source === "Sensor Signal") {
            // A sensor trace is intentionally not a clean function-generator
            // waveform. It combines slow drift, small ripple, and deterministic
            // pseudo-noise so it feels like a real analogue sensor output.
            const drift = Math.sin((time * 1.1) + signal.sensorPhase) * 0.5;
            const warmupCurve = Math.sin((time * 0.23) + signal.sensorPhase * 0.7) * 0.32;
            const ripple = Math.sin((time * 28) + signal.sensorPhase * 1.6) * 0.09;
            const noise = pseudoNoise(time + signal.sensorPhase) * 0.07;
            return (drift + warmupCurve + ripple + noise) * signal.amplitude;
        }

        if (signal.source === "Audio Signal") {
            return Math.sin(time * signal.frequency * Math.PI * 2) * signal.amplitude;
        }

        if (signal.source === "Noisy Signal") {
            // A noisy signal starts with a normal sine wave, then adds
            // deterministic random-looking disturbance so the trace appears
            // rough without becoming unreadable for beginners.
            const cleanSignal = Math.sin(time * signal.frequency * Math.PI * 2) * signal.amplitude;
            const noiseAmount = getNoiseAmount(signal);
            const randomNoise = pseudoNoise((time * 38) + signal.noisePhase) * noiseAmount;
            const highFrequencyRipple = Math.sin((time * signal.frequency * 15) + signal.noisePhase) * noiseAmount * 0.35;
            return cleanSignal + randomNoise + highFrequencyRipple;
        }

        const phase = ((time * signal.frequency) % 1 + 1) % 1;

        if (signal.waveform === "Square") {
            const dutyRatio = signal.source === "PWM Generator" ? signal.dutyCycle / 100 : 0.5;
            return phase < dutyRatio ? signal.amplitude : -signal.amplitude;
        }

        if (signal.waveform === "Triangle") {
            return (1 - 4 * Math.abs(phase - 0.5)) * signal.amplitude;
        }

        return Math.sin(phase * Math.PI * 2) * signal.amplitude;
    }

    function drawGrid() {
        context.fillStyle = "#02070d";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const majorColumns = 10;
        const majorRows = 8;
        const minorPerMajor = 5;
        const majorX = canvas.width / majorColumns;
        const majorY = canvas.height / majorRows;
        const minorX = majorX / minorPerMajor;
        const minorY = majorY / minorPerMajor;

        drawGridLines(minorX, minorY, "rgba(45, 212, 191, 0.09)", 1);
        drawGridLines(majorX, majorY, "rgba(45, 212, 191, 0.24)", 1.25);

        // Center reference lines behave like a real scope graticule reference:
        // horizontal is 0 V and vertical marks the screen time center.
        context.strokeStyle = "rgba(250, 204, 21, 0.48)";
        context.lineWidth = 1.6;
        context.setLineDash([8, 8]);
        context.beginPath();
        context.moveTo(0, canvas.height / 2);
        context.lineTo(canvas.width, canvas.height / 2);
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();
        context.setLineDash([]);

        context.fillStyle = "rgba(125, 211, 252, 0.9)";
        context.font = "bold 14px Arial";
        context.fillText("Voltage", 18, 24);
        context.fillText("Horizontal Axis: Time", canvas.width / 2 - 72, canvas.height - 18);

        context.save();
        context.translate(18, canvas.height / 2 + 78);
        context.rotate(-Math.PI / 2);
        context.fillStyle = "rgba(226, 232, 240, 0.62)";
        context.font = "12px Arial";
        context.fillText("Vertical Axis: Voltage", 0, 0);
        context.restore();

        context.fillStyle = "rgba(226, 232, 240, 0.78)";
        context.font = "bold 13px Arial";
        context.fillText("CH1", 18, 46);
        context.fillText("0 V reference", 18, canvas.height / 2 - 8);
        context.fillText(`${formatTimeDiv(scopeState.timeDivMs)}   ${formatVoltDiv(scopeState.voltDiv)}`, canvas.width - 190, canvas.height - 44);
    }

    function drawGridLines(stepX, stepY, strokeStyle, lineWidth) {
        context.strokeStyle = strokeStyle;
        context.lineWidth = lineWidth;

        for (let x = 0; x <= canvas.width; x += stepX) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
        }

        for (let y = 0; y <= canvas.height; y += stepY) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
        }
    }

    function drawNoSignalScreen() {
        drawGrid();
        context.fillStyle = "rgba(2, 6, 23, 0.72)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(226, 232, 240, 0.82)";
        context.font = "26px Arial";
        context.fillText("NO SIGNAL", canvas.width / 2 - 74, canvas.height / 2);
    }

    function drawPowerOffScreen() {
        context.fillStyle = "#01040a";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(148, 163, 184, 0.28)";
        context.font = "20px Arial";
        context.fillText("POWER OFF", canvas.width / 2 - 56, canvas.height / 2);
    }

    function updateInterface() {
        updateControlLocks();
        syncControlsFromState();
        syncAudioSafety();
        updatePowerVisuals();
        updateSourcePreview();
        updateProbeVisuals();
        updateReadouts();
        updateLearningAssistant();
        drawWaveform();
    }

    function syncControlsFromState() {
        waveformTypeControl.value = scopeState.waveform === "Sensor" || scopeState.waveform === "Noisy Sine"
            ? "Sine"
            : scopeState.waveform;
        frequencyControl.value = String(scopeState.frequency);
        amplitudeControl.value = String(scopeState.amplitude);
        timeDivControl.value = formatTimeDiv(scopeState.timeDivMs);
        voltDivControl.value = formatVoltDiv(scopeState.voltDiv);
        dutyCycleControl.value = String(scopeState.dutyCycle);
        audioVolumeControl.value = scopeState.audioVolume;
        noiseLevelControl.value = scopeState.noiseLevel;
    }

    function updateControlLocks() {
        const waveformLocked = scopeState.source !== "Function Generator";
        const frequencyLocked = scopeState.source === "AC Source" || scopeState.source === "Sensor Signal";
        const dutyVisible = scopeState.source === "PWM Generator";
        const audioVisible = audioSupportedSources.has(scopeState.source);
        const noiseVisible = scopeState.source === "Noisy Signal";

        if (scopeState.source === "Audio Signal") {
            frequencyControl.min = "100";
            frequencyControl.max = "1000";
            frequencyControl.step = "10";
        } else {
            frequencyControl.min = "1";
            frequencyControl.max = "100";
            frequencyControl.step = "1";
        }

        waveformTypeControl.disabled = waveformLocked;
        frequencyControl.disabled = frequencyLocked;
        dutyCycleGroup.classList.toggle("visible", dutyVisible);
        audioControlGroup.classList.toggle("visible", audioVisible);
        noiseLevelGroup.classList.toggle("visible", noiseVisible);

        waveformTypeControl.closest(".scope-control").classList.toggle("locked", waveformLocked);
        frequencyControl.closest(".scope-control").classList.toggle("locked", frequencyLocked);
    }

    function syncAudioSafety() {
        if (scopeState.audioPlaying && !canPlayAudio()) {
            stopAudioTone(false);
        }

        syncAudioTone();
        audioPlayButton.textContent = scopeState.audioPlaying ? "Pause" : "Play";
        audioPlayButton.classList.toggle("playing", scopeState.audioPlaying);
        audioPlayButton.disabled = !canPlayAudio();
        audioVolumeValue.textContent = scopeState.audioVolume;
    }

    function updatePowerVisuals() {
        instrument.classList.toggle("powered", scopeState.powered);
        powerButton.classList.toggle("on", scopeState.powered);
        powerButton.setAttribute("aria-pressed", String(scopeState.powered));
        powerButton.textContent = scopeState.powered ? "On" : "Power";

        if (!scopeState.powered) {
            screenStatus.textContent = "Power off - no signal displayed";
            displayTriggerStatus.textContent = "Auto";
            return;
        }

        if (!scopeState.source) {
            screenStatus.textContent = "NO SOURCE";
            displayTriggerStatus.textContent = "Auto - Waiting";
            return;
        }

        if (!hasCompleteConnection()) {
            screenStatus.textContent = "NO SIGNAL";
            displayTriggerStatus.textContent = "Auto - Waiting";
            return;
        }

        screenStatus.textContent = `${scopeState.source} active`;
        displayTriggerStatus.textContent = "Auto - Locked";
    }

    function updateSourcePreview() {
        sourceCards.forEach((card) => {
            const isActive = card.dataset.source === scopeState.source;
            card.classList.toggle("active", isActive);
            card.setAttribute("aria-pressed", String(isActive));
        });

        if (!scopeState.source) {
            selectedSourceName.textContent = "No source selected";
            selectedSourceDescription.textContent = "Select a signal source from the Signal Sources panel to begin.";
            selectedSignalExplanation.textContent = "No signal source selected.";
            didYouKnowText.textContent = "Choose a source, turn on the oscilloscope, then connect CH1 and ground.";
            renderSourceWorkspace();
            return;
        }

        selectedSourceName.textContent = scopeState.source;
        selectedSourceDescription.textContent = getSourceDetail();
        selectedSignalExplanation.textContent = `${scopeState.source}: ${getWaveformLabel()} signal.`;
        didYouKnowText.textContent = sourceTips[scopeState.source];
        renderSourceWorkspace();
    }

    function renderSourceWorkspace() {
        sourceObjectGrid.innerHTML = scopeState.source
            ? getWorkspaceSourceMarkup(scopeState.source)
            : `<div class="empty-source-workspace">Select a signal source from the Signal Sources panel to begin.</div>`;
    }

    function getWorkspaceSourceMarkup(sourceName) {
        const sourceInfo = getWorkspaceSourceInfo(sourceName);
        const metaItems = sourceInfo.meta
            .map((item) => `<span class="source-meta-item">${item}</span>`)
            .join("");

        return `
            <article class="source-object active" data-source-object="${sourceName}">
                <button class="remove-source-button" type="button" aria-label="Remove ${sourceInfo.title}">Remove</button>
                <h3>${sourceInfo.title}</h3>
                <p>${sourceInfo.description}</p>
                <div class="source-terminal-row" aria-label="${sourceInfo.title} terminals">
                    <span class="source-terminal signal-terminal">${sourceInfo.signalTerminal}</span>
                    <span class="source-terminal ground-terminal">${sourceInfo.groundTerminal}</span>
                </div>
                <div class="source-object-meta">
                    ${metaItems}
                </div>
                <button class="auto-connect-button" type="button" data-auto-source="${sourceName}">
                    Connect
                </button>
                <div class="connection-point-row">
                    <button class="connection-point signal-point" type="button" data-source="${sourceName}" data-point="signal">
                        ${sourceInfo.signalButton}
                    </button>
                    <button class="connection-point ground-point" type="button" data-source="${sourceName}" data-point="ground">
                        ${sourceInfo.groundButton}
                    </button>
                </div>
            </article>
        `;
    }

    function getWorkspaceSourceInfo(sourceName) {
        if (sourceName === "AC Source") {
            return {
                title: "AC Source",
                description: "Fixed low-voltage AC practice signal.",
                signalTerminal: "OUT",
                groundTerminal: "GND",
                signalButton: "Live Signal",
                groundButton: "Reference",
                meta: ["Waveform: Sine", "Frequency: 50 Hz", `Amplitude: ${scopeState.amplitude.toFixed(1)} V`],
            };
        }

        if (sourceName === "PWM Generator") {
            return {
                title: "PWM Generator",
                description: "Pulse signal with adjustable duty cycle.",
                signalTerminal: "OUT",
                groundTerminal: "GND",
                signalButton: "PWM OUT",
                groundButton: "Ground",
                meta: [`Duty Cycle: ${scopeState.dutyCycle}%`, `Frequency: ${scopeState.frequency} Hz`, `Amplitude: ${scopeState.amplitude.toFixed(1)} V`],
            };
        }

        if (sourceName === "Sensor Signal") {
            return {
                title: "Sensor Signal",
                description: "Changing analogue output similar to a simple sensor.",
                signalTerminal: "OUT",
                groundTerminal: "GND",
                signalButton: "Sensor OUT",
                groundButton: "Ground",
                meta: ["Signal: Analogue", `Frequency: ${scopeState.frequency} Hz`, `Amplitude: ${scopeState.amplitude.toFixed(1)} V`],
            };
        }

        if (sourceName === "Audio Signal") {
            return {
                title: "Audio Signal",
                description: "Audible tone displayed as a sine waveform.",
                signalTerminal: "OUT",
                groundTerminal: "GND",
                signalButton: "Audio OUT",
                groundButton: "Ground",
                meta: [`Volume: ${scopeState.audioVolume}`, `Frequency: ${scopeState.frequency} Hz`],
            };
        }

        if (sourceName === "Noisy Signal") {
            return {
                title: "Noisy Signal",
                description: "Sine signal with visible electrical interference.",
                signalTerminal: "OUT",
                groundTerminal: "GND",
                signalButton: "Noisy OUT",
                groundButton: "Ground",
                meta: [`Noise Level: ${scopeState.noiseLevel}`],
            };
        }

        return {
            title: "Function Generator",
            description: "Adjustable practice waveform.",
            signalTerminal: "OUT",
            groundTerminal: "GND",
            signalButton: "Signal OUT",
            groundButton: "Ground",
            meta: [`Waveform: ${scopeState.waveform}`, `Frequency: ${scopeState.frequency} Hz`, `Amplitude: ${scopeState.amplitude.toFixed(1)} V`],
        };
    }

    function updateLearningAssistant() {
        if (!currentStepText) {
            return;
        }

        if (!scopeState.powered) {
            currentStepText.textContent = "Power on the oscilloscope.";
            return;
        }

        if (!scopeState.source) {
            currentStepText.textContent = "Select a signal source.";
            return;
        }

        if (!scopeState.ch1Source) {
            currentStepText.textContent = "Connect CH1 to a signal output.";
            return;
        }

        if (!scopeState.groundSource) {
            currentStepText.textContent = "Connect the ground clip.";
            return;
        }

        if (scopeState.ch1Source !== scopeState.groundSource) {
            currentStepText.textContent = "Use the same source for CH1 and ground.";
            return;
        }

        currentStepText.textContent = "Adjust the signal controls and observe the waveform.";
    }

    function updateProbeVisuals() {
        const complete = hasCompleteConnection();
        const partial = hasPartialConnection() && !complete;
        const sourceObjects = sourceObjectGrid.querySelectorAll(".source-object");
        const autoConnectButtons = sourceObjectGrid.querySelectorAll(".auto-connect-button");
        const connectionPoints = sourceObjectGrid.querySelectorAll(".connection-point");

        probeTools.forEach((tool) => {
            tool.classList.toggle("active", tool.dataset.probe === scopeState.activeProbe);
        });

        ch1InputPort.classList.toggle("connected", Boolean(scopeState.ch1Source));
        ch1InputPort.classList.toggle("warning", !scopeState.ch1Source && Boolean(scopeState.groundSource));
        groundReferencePort.classList.toggle("connected", Boolean(scopeState.groundSource));
        groundReferencePort.classList.toggle("warning", !scopeState.groundSource && Boolean(scopeState.ch1Source));
        autoConnectionLines.classList.toggle("visible", complete);

        sourceObjects.forEach((sourceObject) => {
            const sourceName = sourceObject.dataset.sourceObject;
            sourceObject.classList.toggle("active", sourceName === scopeState.source);
            sourceObject.classList.toggle("connected", complete && sourceName === scopeState.ch1Source);
            sourceObject.classList.toggle("warning", partial && (sourceName === scopeState.ch1Source || sourceName === scopeState.groundSource));
        });

        autoConnectButtons.forEach((button) => {
            const isConnectedSource = complete && button.dataset.autoSource === scopeState.ch1Source;
            button.textContent = isConnectedSource ? "Disconnect" : "Connect";
            button.setAttribute("aria-pressed", String(isConnectedSource));
        });

        connectionPoints.forEach((point) => {
            const isCh1Point = point.dataset.source === scopeState.ch1Source && point.dataset.point === "signal";
            const isGroundPoint = point.dataset.source === scopeState.groundSource && point.dataset.point === "ground";
            point.classList.toggle("connected", isCh1Point || isGroundPoint);
            point.classList.toggle("warning", partial && (isCh1Point || isGroundPoint));
        });

        probeStatusText.textContent = `CH1 probe: ${scopeState.ch1Source || "not connected"}. Ground clip: ${scopeState.groundSource || "not connected"}.`;
        probeFeedbackText.textContent = getProbeFeedback();
    }

    function updateReadouts() {
        frequencyValue.textContent = scopeState.source === "AC Source"
            ? "50 Hz (Locked)"
            : formatFrequency(scopeState.frequency);
        amplitudeValue.textContent = `${scopeState.amplitude.toFixed(1)} V`;
        dutyCycleValue.textContent = `${scopeState.dutyCycle}%`;
        audioVolumeValue.textContent = scopeState.audioVolume;
        noiseLevelValue.textContent = scopeState.noiseLevel;
        displayPowerStatus.textContent = scopeState.powered ? "On" : "Off";
        displayActiveSource.textContent = scopeState.source || "--";
        displayCh1Status.textContent = scopeState.ch1Source ? "Connected" : "Not Connected";
        displayGroundStatus.textContent = scopeState.groundSource ? "Connected" : "Not Connected";
        displayScaleStatus.textContent = `Time/Div: ${formatTimeDiv(scopeState.timeDivMs)} | Volt/Div: ${formatVoltDiv(scopeState.voltDiv)}`;
        readoutTimeDiv.textContent = formatTimeDiv(scopeState.timeDivMs);
        readoutVoltDiv.textContent = formatVoltDiv(scopeState.voltDiv);

        if (!scopeState.powered || !scopeState.source || !hasCompleteConnection()) {
            readoutSource.textContent = "--";
            readoutFrequency.textContent = "--";
            readoutAmplitude.textContent = "--";
            readoutPeriod.textContent = "--";
            readoutVpp.textContent = "--";
            readoutNoiseLevel.textContent = "--";
            readoutWaveform.textContent = "--";
            return;
        }

        readoutSource.textContent = scopeState.source;
        readoutFrequency.textContent = scopeState.source === "AC Source"
            ? "50 Hz (Locked)"
            : formatFrequency(scopeState.frequency);
        readoutAmplitude.textContent = `${scopeState.amplitude.toFixed(2)} V`;
        readoutPeriod.textContent = formatPeriod(scopeState.frequency);
        readoutVpp.textContent = `${(scopeState.amplitude * 2).toFixed(2)} V`;
        readoutNoiseLevel.textContent = scopeState.source === "Noisy Signal" ? scopeState.noiseLevel : "--";
        readoutWaveform.textContent = getWaveformLabel();
    }

    function getProbeFeedback() {
        if (!scopeState.source) {
            return scopeState.lastConnectionMessage;
        }

        if (audioSupportedSources.has(scopeState.source) && scopeState.audioFeedbackMessage) {
            return scopeState.audioFeedbackMessage;
        }

        if (hasCompleteConnection()) {
            if (scopeState.confirmingSourceSwitch) {
                return scopeState.lastConnectionMessage;
            }

            if (scopeState.autoConnected) {
                return `✓ ${scopeState.source} connected successfully. CH1 is on Signal OUT and Ground Clip is on Ground.`;
            }

            return `✓ ${scopeState.source} connected successfully. CH1 is measuring voltage against the ground reference.`;
        }

        if (scopeState.ch1Source && scopeState.groundSource && scopeState.ch1Source !== scopeState.groundSource) {
            return "Connect CH1 and ground to the same signal source to complete the measurement.";
        }

        if (scopeState.ch1Source && !scopeState.groundSource) {
            return "Connect ground clip to complete the measurement reference.";
        }

        if (!scopeState.ch1Source && scopeState.groundSource) {
            return "Connect CH1 probe to the signal output.";
        }

        return scopeState.lastConnectionMessage;
    }

    function getSourceDetail() {
        if (!scopeState.source) {
            return "Select a signal source from the Signal Sources panel to begin.";
        }

        if (scopeState.source === "AC Source") {
            return "Fixed 50 Hz sine wave. Use Time/Div and Volt/Div to inspect the trace.";
        }

        if (scopeState.source === "PWM Generator") {
            return `Square PWM signal at ${scopeState.dutyCycle}% duty cycle. Change duty cycle to widen or narrow the pulse.`;
        }

        if (scopeState.source === "Sensor Signal") {
            return "Slowly changing analogue waveform that mimics light or temperature sensor output.";
        }

        if (scopeState.source === "Audio Signal") {
            return "Audible sine tone shown as a waveform. Click Play Tone to hear how frequency changes pitch.";
        }

        if (scopeState.source === "Noisy Signal") {
            return `${scopeState.noiseLevel} noise added to a sine wave. Compare the rough trace against a clean sine wave.`;
        }

        return "Manual function generator source. Waveform, frequency, and amplitude controls are active.";
    }

    function getWaveformLabel() {
        if (scopeState.source === "PWM Generator") {
            return `PWM Square (${scopeState.dutyCycle}% Duty)`;
        }

        if (scopeState.source === "Sensor Signal") {
            return "Analogue Sensor";
        }

        if (scopeState.source === "Audio Signal") {
            return "Sine";
        }

        if (scopeState.source === "Noisy Signal") {
            return "Noisy Sine";
        }

        return scopeState.waveform;
    }

    function parseTimeDiv(value) {
        return Number(value.replace(" ms/div", ""));
    }

    function parseVoltDiv(value) {
        return Number(value.replace(" V/div", ""));
    }

    function formatTimeDiv(value) {
        return `${value} ms/div`;
    }

    function formatVoltDiv(value) {
        return `${value} V/div`;
    }

    function formatPeriod(frequency) {
        const periodSeconds = 1 / frequency;
        const periodMs = periodSeconds * 1000;
        return periodMs >= 1 ? `${periodMs.toFixed(2)} ms` : `${(periodMs * 1000).toFixed(2)} us`;
    }

    function formatFrequency(frequency) {
        if (frequency >= 1000) {
            return `${(frequency / 1000).toFixed(2)} kHz`;
        }

        if (frequency >= 100) {
            return `${frequency.toFixed(0)} Hz`;
        }

        return `${frequency.toFixed(2)} Hz`;
    }

    function getVisibleTimeSeconds(useSmoothed = false) {
        const timeDiv = useSmoothed ? renderState.timeDivMs : scopeState.timeDivMs;
        return (timeDiv / 1000) * 10;
    }

    function getPixelsPerVolt(useSmoothed = false) {
        const voltDiv = useSmoothed ? renderState.voltDiv : scopeState.voltDiv;
        return (canvas.height / 8) / voltDiv;
    }

    function getNoiseAmount(signal = scopeState) {
        const levels = {
            Low: 0.12,
            Medium: 0.32,
            High: 0.62,
        };
        return levels[signal.noiseLevel] * signal.amplitude;
    }

    function getSignalSnapshot(useSmoothed = false) {
        return {
            source: scopeState.source,
            waveform: scopeState.waveform,
            frequency: useSmoothed ? renderState.frequency : scopeState.frequency,
            amplitude: useSmoothed ? renderState.amplitude : scopeState.amplitude,
            dutyCycle: scopeState.dutyCycle,
            noiseLevel: scopeState.noiseLevel,
            noisePhase: scopeState.noisePhase,
            sensorPhase: scopeState.sensorPhase,
        };
    }

    function beginSignalTransition(previousSignal) {
        renderState.transition = {
            from: previousSignal,
            elapsed: 0,
            duration: 0.45,
        };
    }

    function getTransitionProgress() {
        if (!renderState.transition) {
            return 1;
        }

        const rawProgress = clamp(renderState.transition.elapsed / renderState.transition.duration, 0, 1);
        return rawProgress * rawProgress * (3 - 2 * rawProgress);
    }

    function updateRenderState(deltaSeconds) {
        const fastEase = 1 - Math.exp(-deltaSeconds * 9);
        const scaleEase = 1 - Math.exp(-deltaSeconds * 6);

        renderState.frequency += (scopeState.frequency - renderState.frequency) * fastEase;
        renderState.amplitude += (scopeState.amplitude - renderState.amplitude) * fastEase;
        renderState.timeDivMs += (scopeState.timeDivMs - renderState.timeDivMs) * scaleEase;
        renderState.voltDiv += (scopeState.voltDiv - renderState.voltDiv) * scaleEase;

        if (renderState.transition) {
            renderState.transition.elapsed += deltaSeconds;
            if (renderState.transition.elapsed >= renderState.transition.duration) {
                renderState.transition = null;
            }
        }
    }

    function getSweepSpeed() {
        const visibleTime = getVisibleTimeSeconds(true);
        const cyclesOnScreen = Math.max(renderState.frequency * visibleTime, 0.1);
        return clamp(visibleTime * cyclesOnScreen * 1.25, visibleTime * 0.35, visibleTime * 3.5);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function pseudoNoise(value) {
        return Math.sin(value * 127.1) * Math.cos(value * 311.7);
    }

    function animateWaveform(timestamp) {
        if (renderState.lastFrameTime === null) {
            renderState.lastFrameTime = timestamp;
        }

        const deltaSeconds = Math.min((timestamp - renderState.lastFrameTime) / 1000, 0.05);
        renderState.lastFrameTime = timestamp;
        updateRenderState(deltaSeconds);

        if (scopeState.powered && hasCompleteConnection()) {
            renderState.scrollTime += getSweepSpeed() * deltaSeconds;
            scopeState.sensorPhase += deltaSeconds * 1.1;
            scopeState.noisePhase += deltaSeconds * 8;
        }

        drawWaveform();
        window.requestAnimationFrame(animateWaveform);
    }

    updateInterface();
    window.requestAnimationFrame(animateWaveform);

    window.addEventListener("beforeunload", () => {
        stopAudioTone(false);
    });
});

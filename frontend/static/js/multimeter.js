// Stage 4 DMM lab script.
// The selector, probe ports, and draggable probes remain active. This stage
// adds selectable test objects, valid test points, and realistic readings.
document.addEventListener("DOMContentLoaded", () => {
    const selectorLabels = document.querySelectorAll(".range-label");
    const rotaryKnob = document.getElementById("rotaryKnob");
    const objectCards = document.querySelectorAll(".object-card");
    const meterPorts = document.querySelectorAll(".meter-port");
    const draggableProbes = document.querySelectorAll(".draggable-probe");
    const workbench = document.getElementById("objectWorkbench");
    const workbenchObject = document.getElementById("workbenchObject");
    const measureButton = document.getElementById("measureButton");
    const selectedObjectName = document.getElementById("selectedObjectName");
    const measurementExplanation = document.getElementById("measurementExplanation");
    const resultFeedback = document.getElementById("resultFeedback");
    const feedbackReading = document.getElementById("feedbackReading");
    const feedbackSetup = document.getElementById("feedbackSetup");
    const modeExplanation = document.getElementById("modeExplanation");
    const safetyWarning = document.getElementById("safetyWarning");
    const display = document.querySelector(".meter-display");
    const displayMode = document.getElementById("displayMode");
    const displayValue = document.getElementById("displayValue");
    const displayUnit = document.getElementById("displayUnit");
    const selectedProbeStatus = document.getElementById("selectedProbeStatus");
    const blackProbePortStatus = document.getElementById("blackProbePortStatus");
    const redProbePortStatus = document.getElementById("redProbePortStatus");
    const blackProbeTipStatus = document.getElementById("blackProbeTipStatus");
    const redProbeTipStatus = document.getElementById("redProbeTipStatus");
    const assistantToggles = document.querySelectorAll(".assistant-toggle");
    const guideStepLabel = document.getElementById("guideStepLabel");
    const guideInstruction = document.getElementById("guideInstruction");
    const guidePrevButton = document.getElementById("guidePrevButton");
    const guideNextButton = document.getElementById("guideNextButton");

    const dmmState = {
        activeMode: "off",
        activeRange: "OFF",
        activeRangeId: "off",
        selectedObjectId: null,
        selectedObject: null,
        selectedProbe: "black",
        redProbePort: null,
        blackProbePort: null,
        redProbePosition: null,
        blackProbePosition: null,
        redProbeConnection: null,
        blackProbeConnection: null,
    };
    const workbenchState = {
        components: [],
        activeComponentId: null,
        nextComponentId: 1,
    };
    const defaultComponentPositions = [
        { x: 28, y: 42 },
        { x: 55, y: 42 },
        { x: 75, y: 58 },
        { x: 38, y: 66 },
        { x: 62, y: 72 },
        { x: 22, y: 66 },
    ];
    const guideSteps = [
        "Select the correct meter range.",
        "Connect the black probe to COM.",
        "Connect the red probe to the correct input port.",
        "Place both probe tips on the selected component, then press Measure.",
    ];
    let currentGuideStep = 0;
    const probeSnapDistance = 20;
    const probeHomeAnchors = {
        black: { x: 18, y: 78 },
        red: { x: 58, y: 78 },
    };

    // Each object defines its terminal points and the teaching text used after
    // measurement. This keeps later additions modular.
    const measurementObjects = {
        battery: {
            name: "9V Battery",
            visualClass: "battery-body",
            bodyText: "9V",
            points: [
                { id: "positive", label: "+", name: "positive terminal" },
                { id: "negative", label: "-", name: "negative terminal" },
            ],
            intro: "Use the battery to practice low-voltage DC measurement.",
        },
        resistor: {
            name: "220 Ohm Resistor",
            visualClass: "resistor-body",
            bodyText: "220Ω",
            points: [
                { id: "left", label: "L", name: "left lead" },
                { id: "right", label: "R", name: "right lead" },
            ],
            intro: "Use the resistor to practice choosing a resistance range.",
        },
        goodFuse: {
            name: "Good Fuse",
            visualClass: "fuse-body",
            bodyText: "FUSE",
            points: [
                { id: "left", label: "L", name: "left terminal" },
                { id: "right", label: "R", name: "right terminal" },
            ],
            intro: "A good fuse should have a complete path and trigger continuity.",
        },
        blownFuse: {
            name: "Blown Fuse",
            visualClass: "fuse-body blown-body",
            bodyText: "FUSE",
            points: [
                { id: "left", label: "L", name: "left terminal" },
                { id: "right", label: "R", name: "right terminal" },
            ],
            intro: "A blown fuse has an open internal path, so continuity should fail.",
        },
        closedWire: {
            name: "Closed Wire",
            visualClass: "wire-body",
            bodyText: "",
            points: [
                { id: "left", label: "L", name: "left end" },
                { id: "right", label: "R", name: "right end" },
            ],
            intro: "A closed wire should behave like a very low-resistance path.",
        },
        openWire: {
            name: "Open Wire",
            visualClass: "wire-body open-wire-body",
            bodyText: "",
            points: [
                { id: "left", label: "L", name: "left end" },
                { id: "right", label: "R", name: "right end" },
            ],
            intro: "An open wire contains a break, so the meter should show OL.",
        },
        "ac-outlet": {
            id: "ac-outlet",
            name: "AC Outlet",
            type: "acVoltage",
            expectedMode: "AC voltage",
            recommendedRange: "AC 750V",
            value: "around 230V AC",
            visualClass: "outlet-body",
            bodyText: "AC",
            points: [
                { id: "live", label: "L", name: "live terminal" },
                { id: "neutral", label: "N", name: "neutral terminal" },
            ],
            intro: "Use the AC outlet to practice high-range AC voltage measurement between live and neutral terminals.",
        },
        "lamp-circuit": {
            id: "lamp-circuit",
            name: "Lamp Circuit",
            type: "dcCurrent",
            expectedMode: "DC current",
            recommendedRange: "DC 10A",
            value: "around 0.90A",
            requiresSeriesConnection: true,
            visualClass: "lamp-circuit-body",
            bodyText: "LAMP",
            points: [
                { id: "series-in", label: "IN", name: "series input point" },
                { id: "series-out", label: "OUT", name: "series output point" },
            ],
            intro: "Use the lamp circuit to practice current measurement by placing the meter in series with the circuit.",
        },
    };

    const objectNameMap = {
        "9V Battery": "battery",
        "220 Ohm Resistor": "resistor",
        "Good Fuse": "goodFuse",
        "Blown Fuse": "blownFuse",
        "Closed Wire": "closedWire",
        "Open Wire": "openWire",
        "AC Outlet": "ac-outlet",
        "Lamp Circuit": "lamp-circuit",
    };

    // Selector positions are ordered clockwise around the meter face. Each
    // position controls the knob angle, display readiness text, and guidance.
    const selectorPositions = [
        {
            id: "off",
            mode: "off",
            range: "OFF",
            angle: 0,
            display: { mode: "", value: "OFF", unit: "" },
            explanation: "The meter is switched off. No measurement can be taken until a range is selected.",
            measurement: "Select a range on the rotary selector before connecting probes or choosing a measurement task.",
            warning: "Meter is OFF. Select a safe range before connecting probes.",
            warningLevel: "safe",
        },
        {
            id: "continuity",
            mode: "continuity",
            range: "Continuity",
            angle: 42,
            display: { mode: "BEEP", value: "READY", unit: "" },
            explanation: "Continuity mode checks whether a circuit path is complete. If the path is closed, the meter produces a beep.",
            measurement: "Connect black probe to COM and red probe to VΩmA. Use only on unpowered paths such as fuses and wires.",
            warning: "Continuity should only be used on unpowered circuits.",
            warningLevel: "warning",
        },
        {
            id: "r200",
            mode: "resistance",
            range: "200Ω",
            angle: 78,
            display: { mode: "Ω", value: "READY", unit: "" },
            explanation: "Use 200Ω range for low-value resistors below 200 ohms. If the value is higher than the selected range, the display may show OL.",
            measurement: "Connect black probe to COM and red probe to VΩmA. Use this range only on unpowered low-resistance components.",
            warning: "Resistance ranges must only be used on unpowered circuits.",
            warningLevel: "warning",
        },
        {
            id: "r2k",
            mode: "resistance",
            range: "2kΩ",
            angle: 112,
            display: { mode: "Ω", value: "READY", unit: "" },
            explanation: "Use 2kΩ range for resistors up to about 2,000 ohms. It is useful for many common beginner circuit resistors.",
            measurement: "Connect black probe to COM and red probe to VΩmA. This is a good range for components like 220Ω and 1kΩ resistors.",
            warning: "Remove power before measuring resistance to protect the meter and avoid false readings.",
            warningLevel: "warning",
        },
        {
            id: "r20k",
            mode: "resistance",
            range: "20kΩ",
            angle: 146,
            display: { mode: "Ω", value: "READY", unit: "" },
            explanation: "Use 20kΩ range for medium-value resistors and sensor circuits whose resistance is below 20,000 ohms.",
            measurement: "Connect black probe to COM and red probe to VΩmA. Choose this when lower resistance ranges would show OL.",
            warning: "Resistance testing requires an unpowered circuit.",
            warningLevel: "warning",
        },
        {
            id: "r200k",
            mode: "resistance",
            range: "200kΩ",
            angle: 180,
            display: { mode: "Ω", value: "READY", unit: "" },
            explanation: "Use 200kΩ range for higher-value resistors below 200,000 ohms.",
            measurement: "Connect black probe to COM and red probe to VΩmA before checking a high-value unpowered component.",
            warning: "Never measure resistance across a live power source.",
            warningLevel: "warning",
        },
        {
            id: "r2m",
            mode: "resistance",
            range: "2MΩ",
            angle: 214,
            display: { mode: "Ω", value: "READY", unit: "" },
            explanation: "Use 2MΩ range for very high resistance values up to about 2 megaohms.",
            measurement: "Connect black probe to COM and red probe to VΩmA. Use this range for high resistance and leakage checks.",
            warning: "High-resistance measurements still require the circuit to be unpowered.",
            warningLevel: "warning",
        },
        {
            id: "dc20",
            mode: "dc_voltage",
            range: "DC 20V",
            angle: 248,
            display: { mode: "V DC", value: "READY", unit: "" },
            explanation: "Use DC 20V range for low-voltage DC sources such as a 9V battery.",
            measurement: "Connect black probe to COM and red probe to VΩmA. Place red on positive terminal and black on negative terminal.",
            warning: "Start with a higher voltage range if you are unsure of the source voltage.",
            warningLevel: "safe",
        },
        {
            id: "dc200",
            mode: "dc_voltage",
            range: "DC 200V",
            angle: 282,
            display: { mode: "V DC", value: "READY", unit: "" },
            explanation: "Use DC 200V range for larger DC voltages when the expected value may be above 20V but below 200V.",
            measurement: "Connect black probe to COM and red probe to VΩmA. Start here for unknown DC sources before moving lower.",
            warning: "Start with the higher range when the voltage is unknown.",
            warningLevel: "safe",
        },
        {
            id: "ac200",
            mode: "ac_voltage",
            range: "AC 200V",
            angle: 316,
            display: { mode: "V AC", value: "READY", unit: "" },
            explanation: "Use AC 200V range for lower AC voltages below 200 volts.",
            measurement: "Connect black probe to COM and red probe to VΩmA. AC voltage requires extra caution around exposed conductors.",
            warning: "AC voltage requires extra caution. Avoid touching metal probe tips.",
            warningLevel: "danger",
        },
        {
            id: "ac750",
            mode: "ac_voltage",
            range: "AC 750V",
            angle: 338,
            display: { mode: "V AC", value: "READY", unit: "" },
            explanation: "Use AC 750V range for high-voltage AC sources such as household outlets.",
            measurement: "Connect black probe to COM and red probe to VΩmA. Use this high range for mains-level AC practice.",
            warning: "High-voltage AC can be dangerous. Use insulated probes and proper supervision.",
            warningLevel: "danger",
        },
        {
            id: "dc10a",
            mode: "dc_current",
            range: "DC 10A",
            angle: 200,
            display: { mode: "A DC", value: "READY", unit: "" },
            explanation: "Use DC 10A range for measuring higher current. The red probe must be connected to the 10A port and the meter must be placed in series with the circuit.",
            measurement: "Connect black probe to COM and red probe to 10A. Current measurement requires series connection.",
            warning: "Current must be measured in series. Use the 10A port and never place the meter directly across a power source.",
            warningLevel: "danger",
        },
    ];

    const selectorMap = selectorPositions.reduce((map, position) => {
        map[position.id] = position;
        return map;
    }, {});

    objectCards.forEach((card) => {
        card.addEventListener("click", () => {
            const objectId = objectNameMap[card.dataset.object];
            setActiveElement(objectCards, card);
            addWorkbenchComponent(card.dataset.object, objectId);
        });
    });

    assistantToggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            expandAssistantSection(toggle.dataset.assistantSection);
        });
    });

    guidePrevButton?.addEventListener("click", () => {
        currentGuideStep = Math.max(0, currentGuideStep - 1);
        updateGuidePanel();
    });

    guideNextButton?.addEventListener("click", () => {
        currentGuideStep = Math.min(guideSteps.length - 1, currentGuideStep + 1);
        updateGuidePanel();
    });

    selectorLabels.forEach((label) => {
        label.addEventListener("click", () => {
            selectRange(label.dataset.selector);
        });
    });

    rotaryKnob.addEventListener("click", () => {
        const currentIndex = selectorPositions.findIndex((position) => position.id === dmmState.activeRangeId);
        const nextIndex = (currentIndex + 1) % selectorPositions.length;
        selectRange(selectorPositions[nextIndex].id);
    });

    draggableProbes.forEach((probe) => {
        probe.addEventListener("click", () => {
            selectProbe(probe.dataset.probe);
        });

        probe.addEventListener("dragstart", (event) => {
            selectProbe(probe.dataset.probe);
            event.dataTransfer.setData("text/plain", probe.dataset.probe);
        });

        probe.addEventListener("pointerdown", (event) => {
            if (!probe.classList.contains("bench-probe")) {
                return;
            }

            selectProbe(probe.dataset.probe);
            startProbeDrag(event, probe);
        });
    });

    // Clicking a target point places whichever probe is currently selected.
    workbenchObject.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-component]");
        if (removeButton) {
            removeWorkbenchComponent(removeButton.dataset.removeComponent);
            return;
        }

        const component = event.target.closest("[data-component-id]");
        if (component && component.dataset.componentId !== workbenchState.activeComponentId) {
            selectPlacedComponent(component.dataset.componentId);
        }

        const point = event.target.closest("[data-test-point]");

        if (!point) {
            return;
        }

        snapProbeToTerminal(dmmState.selectedProbe, getTerminalSnap(point));
    });

    measureButton.addEventListener("click", measureSelectedObject);

    // Probe connection logic: click or drop the selected probe onto a port.
    // Black is accepted only on COM. Red may connect to VΩmA or 10A, then the
    // active selector decides whether that red-port choice is correct.
    meterPorts.forEach((port) => {
        port.addEventListener("click", () => {
            connectSelectedProbeToPort(port.dataset.port);
        });

        port.addEventListener("dragover", (event) => {
            event.preventDefault();
            port.classList.add("active");
        });

        port.addEventListener("dragleave", () => {
            port.classList.remove("active");
        });

        port.addEventListener("drop", (event) => {
            event.preventDefault();
            port.classList.remove("active");
            const probe = event.dataTransfer.getData("text/plain") || dmmState.selectedProbe;
            selectProbe(probe);
            connectSelectedProbeToPort(port.dataset.port);
        });
    });

    workbenchObject.addEventListener("pointerdown", (event) => {
        const component = event.target.closest("[data-component-id]");

        if (!component || event.target.closest("button")) {
            return;
        }

        startComponentDrag(event, component);
    });

    function addWorkbenchComponent(label, objectId) {
        const selectedObject = measurementObjects[objectId];
        const position = defaultComponentPositions[0];
        const component = {
            uid: `component-${workbenchState.nextComponentId}`,
            objectId,
            name: selectedObject?.name || label,
            visualClass: selectedObject?.visualClass || getPlaceholderVisualClass(label),
            bodyText: selectedObject?.bodyText || getPlaceholderBodyText(label),
            points: selectedObject?.points || [],
            intro: selectedObject?.intro || `${label} is available for circuit layout practice. Measurement support can be added later without changing the workbench layout.`,
            x: position.x,
            y: position.y,
            measurable: Boolean(selectedObject),
        };

        workbenchState.components = [];
        workbenchState.activeComponentId = null;
        clearProbeConnection("red");
        clearProbeConnection("black");
        resetWorkspaceMeasurementState("Component selected");

        workbenchState.nextComponentId += 1;
        workbenchState.components.push(component);
        selectPlacedComponent(component.uid);
    }

    function selectPlacedComponent(componentUid) {
        const component = workbenchState.components.find((item) => item.uid === componentUid);

        if (!component) {
            return;
        }

        workbenchState.activeComponentId = component.uid;
        if (!component.measurable) {
            dmmState.selectedObjectId = null;
            dmmState.selectedObject = component.name;
            selectedObjectName.textContent = component.name;
            measurementExplanation.textContent = "Arrange this component in the workspace for circuit practice.";
            resultFeedback.textContent = `${component.name} added to the workspace.`;
            feedbackReading.textContent = "Not available";
            feedbackSetup.textContent = "Practice component";
            clearProbeConnection("red");
            clearProbeConnection("black");
            renderSelectedObject();
            updateDisplay(selectorMap[dmmState.activeRangeId].display);
            updateProbeStatus();
            updateGuidePanel();
            publishDmmState("state-change");
            return;
        }

        selectObject(component.objectId, component.uid);
    }

    function selectObject(objectId, componentUid = workbenchState.activeComponentId) {
        const selectedObject = measurementObjects[objectId];

        dmmState.selectedObjectId = objectId;
        dmmState.selectedObject = selectedObject.name;
        preserveProbeConnectionsForComponent(componentUid);
        workbenchState.activeComponentId = componentUid;

        selectedObjectName.textContent = selectedObject.name;
        measurementExplanation.textContent = getObjectSetupInstruction(selectedObject);
        resultFeedback.textContent = `${selectedObject.name} selected. Place both probes on its test points.`;
        feedbackReading.textContent = "No reading yet";
        feedbackSetup.textContent = "Object selected";

        renderSelectedObject();
        updateAttachedProbePositions();
        updateDisplay(selectorMap[dmmState.activeRangeId].display);
        updateTestPointHighlights();
        updateProbeStatus();
        updateGuidePanel();
        publishDmmState("state-change");
    }

    function renderSelectedObject() {
        if (!workbenchState.components.length) {
            workbenchObject.innerHTML = `<div class="empty-workbench">Select a component from the Component Tray to begin.</div>`;
            return;
        }

        workbenchObject.innerHTML = workbenchState.components.map((component) => {
            const isActive = component.uid === workbenchState.activeComponentId;
            return `
                <article class="placed-component ${isActive ? "active" : ""}" data-component-id="${component.uid}" style="--component-x: ${component.x}%; --component-y: ${component.y}%;" aria-label="${component.name}">
                    <button class="remove-component-button" type="button" data-remove-component="${component.uid}" aria-label="Remove ${component.name}">Remove</button>
                    <div class="object-visual" aria-label="${component.name} measurement points">
                        ${component.points[0] ? createPointMarkup(component.points[0]) : ""}
                        <span class="object-body ${component.visualClass}">${component.bodyText}</span>
                        ${component.points[1] ? createPointMarkup(component.points[1]) : ""}
                    </div>
                    <strong>${component.name}</strong>
                </article>
            `;
        }).join("");
    }

    function createPointMarkup(point) {
        return `<button class="measurement-point point-${point.id}" type="button" data-test-point="${point.id}" title="${point.name}">${point.label}</button>`;
    }

    function removeWorkbenchComponent(componentUid) {
        const removingActive = workbenchState.activeComponentId === componentUid;
        workbenchState.components = workbenchState.components.filter((component) => component.uid !== componentUid);

        if (removingActive) {
            const nextComponent = workbenchState.components[workbenchState.components.length - 1];
            workbenchState.activeComponentId = nextComponent?.uid || null;
            clearProbeConnection("red");
            clearProbeConnection("black");

            if (nextComponent) {
                selectPlacedComponent(nextComponent.uid);
                return;
            }

            selectedObjectName.textContent = "No component selected";
            dmmState.selectedObjectId = null;
            dmmState.selectedObject = null;
            measurementExplanation.textContent = "Select a component to begin.";
            resultFeedback.textContent = "Workspace cleared. Add a component from the library to continue.";
            feedbackReading.textContent = "No reading yet";
            feedbackSetup.textContent = "Waiting for component";
            objectCards.forEach((card) => card.classList.remove("active"));
            renderSelectedObject();
            updateDisplay(selectorMap[dmmState.activeRangeId].display);
            updateProbeStatus();
            publishDmmState("state-change");
            return;
        }

        disconnectProbesFromComponent(componentUid);
        renderSelectedObject();
        updateAttachedProbePositions();
        updateTestPointHighlights();
        publishDmmState("state-change");
    }

    function startComponentDrag(event, componentElement) {
        event.preventDefault();
        const componentUid = componentElement.dataset.componentId;
        selectPlacedComponent(componentUid);
        const dragElement = workbenchObject.querySelector(`[data-component-id="${componentUid}"]`) || componentElement;

        try {
            dragElement.setPointerCapture(event.pointerId);
        } catch {
            // Some automation and touch surfaces do not keep capture after the selection re-render.
        }

        const moveComponent = (moveEvent) => {
            placeComponentAtPointer(componentUid, moveEvent.clientX, moveEvent.clientY);
        };

        const stopDrag = (upEvent) => {
            try {
                dragElement.releasePointerCapture(upEvent.pointerId);
            } catch {
                // Capture may not have been acquired on every input surface.
            }
            document.removeEventListener("pointermove", moveComponent);
            document.removeEventListener("pointerup", stopDrag);
        };

        document.addEventListener("pointermove", moveComponent);
        document.addEventListener("pointerup", stopDrag, { once: true });
        placeComponentAtPointer(componentUid, event.clientX, event.clientY);
    }

    function placeComponentAtPointer(componentUid, clientX, clientY) {
        const rect = workbenchObject.getBoundingClientRect();
        const component = workbenchState.components.find((item) => item.uid === componentUid);

        if (!component) {
            return;
        }

        component.x = clamp(((clientX - rect.left) / rect.width) * 100, 12, 88);
        component.y = clamp(((clientY - rect.top) / rect.height) * 100, 16, 84);
        const element = workbenchObject.querySelector(`[data-component-id="${componentUid}"]`);
        element?.style.setProperty("--component-x", `${component.x}%`);
        element?.style.setProperty("--component-y", `${component.y}%`);
        updateAttachedProbePositions();
    }

    function getPlaceholderVisualClass(label) {
        const key = label.toLowerCase();

        if (key.includes("led")) return "led-body";
        if (key.includes("switch")) return "switch-body";
        if (key.includes("capacitor")) return "capacitor-body";
        if (key.includes("diode")) return "diode-body";
        if (key.includes("transistor")) return "transistor-body";
        return "component-placeholder-body";
    }

    function getPlaceholderBodyText(label) {
        const words = label.split(/\s+/);
        return words.map((word) => word.charAt(0)).join("").slice(0, 3).toUpperCase();
    }

    function selectRange(positionId) {
        const selectedPosition = selectorMap[positionId];

        if (!selectedPosition) {
            return;
        }

        dmmState.activeRangeId = selectedPosition.id;
        dmmState.activeMode = selectedPosition.mode;
        dmmState.activeRange = selectedPosition.range;

        updateSelectorHighlight(selectedPosition.id);
        updateKnobRotation(selectedPosition.angle);
        updateDisplay(selectedPosition.display);
        updateLearningPanel(selectedPosition);
        validateProbePorts();
        if (selectedPosition.id === "off") {
            currentGuideStep = 0;
            updateGuidePanel();
        } else {
            advanceGuideTo(1);
        }
        publishDmmState("range-change");
    }

    function selectProbe(probeName) {
        dmmState.selectedProbe = probeName;
        draggableProbes.forEach((probe) => {
            probe.classList.toggle("active", probe.dataset.probe === probeName);
        });
        updateProbeStatus();
    }

    function connectSelectedProbeToPort(portName) {
        if (dmmState.selectedProbe === "black") {
            if (portName !== "COM") {
                setWarning("Black probe must be connected to COM.", "danger");
                resultFeedback.textContent = "Wrong port. The black probe is only valid in COM.";
                feedbackSetup.textContent = "Wrong black port";
                return;
            }

            dmmState.blackProbePort = "COM";
        }

        if (dmmState.selectedProbe === "red") {
            if (portName === "COM") {
                setWarning("Wrong port. The red probe should not be connected to COM.", "danger");
                resultFeedback.textContent = "Wrong port. Connect the red probe to VΩmA or 10A depending on the measurement.";
                feedbackSetup.textContent = "Wrong red port";
                return;
            }

            dmmState.redProbePort = portName;
        }

        resultFeedback.textContent = `${capitalize(dmmState.selectedProbe)} probe connected to ${portName}.`;
        feedbackSetup.textContent = "Probe port updated";
        validateProbePorts();
        updateProbeStatus();
        if (dmmState.blackProbePort === "COM" && dmmState.redProbePort === getExpectedRedPort()) {
            advanceGuideTo(3);
        } else if (dmmState.blackProbePort === "COM") {
            advanceGuideTo(2);
        }
        publishDmmState("state-change");
    }

    function validateProbePorts() {
        const expectedRedPort = getExpectedRedPort();
        let message = selectorMap[dmmState.activeRangeId]?.warning || "";
        let level = selectorMap[dmmState.activeRangeId]?.warningLevel || "safe";

        meterPorts.forEach((port) => {
            port.classList.remove("valid-port", "correct-port", "wrong-port");
        });

        if (dmmState.activeMode !== "off") {
            markPort("COM", "valid-port");
            markPort(expectedRedPort, "valid-port");
        }

        if (dmmState.blackProbePort === "COM") {
            markPort("COM", "correct-port");
        } else if (dmmState.activeMode !== "off") {
            message = "Black probe must be connected to COM.";
            level = "danger";
        }

        if (dmmState.redProbePort) {
            if (dmmState.redProbePort === expectedRedPort) {
                markPort(dmmState.redProbePort, "correct-port");
            } else {
                markPort(dmmState.redProbePort, "wrong-port");

                if (dmmState.activeMode === "dc_current") {
                    message = "Wrong port. For current measurement, move the red probe to 10A.";
                } else if (dmmState.activeMode !== "off") {
                    message = "Wrong port. For voltage, resistance, and continuity, connect the red probe to VΩmA.";
                }

                level = "danger";
            }
        } else if (dmmState.activeMode !== "off") {
            message = `Connect the red probe to ${expectedRedPort}.`;
            level = level === "danger" ? "danger" : "warning";
        }

        setWarning(message, level);
        updateProbeStatus();
    }

    function measureSelectedObject() {
        const activeComponent = getActiveWorkbenchComponent();

        if (!activeComponent || !activeComponent.measurable) {
            showFeedback({
                reading: "Not available",
                setup: "Practice component",
                message: activeComponent
                    ? `${activeComponent.name} is available for layout practice. Measurement support can be added later.`
                    : "Add a measurable component to the workspace before pressing Measure.",
                displayState: selectorMap[dmmState.activeRangeId].display,
            });
            publishDmmState("measurement");
            return;
        }

        const validation = validateMeasurementSetup();

        if (!validation.ok) {
            showFeedback({
                reading: "No reading",
                setup: "Setup incomplete",
                message: validation.message,
                displayState: selectorMap[dmmState.activeRangeId].display,
            });
            return;
        }

        const result = calculateMeasurement();
        showFeedback(result);

        if (result.success) {
            measurementExplanation.textContent = result.guide || "Measurement complete. Compare the display with your probe placement.";
        }

        if (result.beep) {
            playContinuityBeep();
        }

        publishDmmState("measurement", result);
    }

    function getActiveWorkbenchComponent() {
        return workbenchState.components.find((component) => component.uid === workbenchState.activeComponentId) || null;
    }

    function validateMeasurementSetup() {
        if (dmmState.activeMode === "off") {
            return { ok: false, message: "Select a measurement range before pressing Measure." };
        }

        if (dmmState.blackProbePort !== "COM") {
            return { ok: false, message: "Black probe must be connected to COM before measuring." };
        }

        if (dmmState.redProbePort !== getExpectedRedPort()) {
            if (dmmState.selectedObjectId === "lamp-circuit") {
                return { ok: false, message: "Current must be measured in series. Use the 10A port and DC 10A range." };
            }

            return { ok: false, message: `For ${dmmState.activeRange}, connect the red probe to ${getExpectedRedPort()}.` };
        }

        if (!dmmState.redProbePosition || !dmmState.blackProbePosition) {
            return { ok: false, message: "Place both probe tips on the selected object's test points." };
        }

        if (!dmmState.redProbeConnection || !dmmState.blackProbeConnection) {
            return { ok: false, message: "Snap each probe tip onto a valid component terminal before measuring." };
        }

        if (
            dmmState.redProbeConnection.componentId !== workbenchState.activeComponentId
            || dmmState.blackProbeConnection.componentId !== workbenchState.activeComponentId
        ) {
            return { ok: false, message: "Place both probes on the selected component before measuring." };
        }

        if (dmmState.redProbePosition === dmmState.blackProbePosition) {
            return { ok: false, message: "Place the probes on two different points to complete the measurement path." };
        }

        return { ok: true };
    }

    // Measurement logic maps the selected object, range, ports, and probe
    // placement to realistic beginner-lab readings.
    function calculateMeasurement() {
        const objectId = dmmState.selectedObjectId;

        if (objectId === "battery") {
            return measureBattery();
        }

        if (objectId === "resistor") {
            return measureResistor();
        }

        if (["goodFuse", "blownFuse", "closedWire", "openWire"].includes(objectId)) {
            return measureContinuityObject(objectId);
        }

        if (objectId === "ac-outlet") {
            return measureAcOutlet();
        }

        if (objectId === "lamp-circuit") {
            return measureLampCircuit();
        }

        return {
            reading: "Not available",
            setup: "Unsupported object",
            message: "This object is not connected to a measurement exercise yet.",
            displayState: { mode: "", value: "OL", unit: "" },
        };
    }

    function measureAcOutlet() {
        if (dmmState.activeRangeId !== "ac750") {
            return {
                reading: "No valid reading",
                setup: "Wrong mode or range",
                message: "Use AC voltage mode and a high range such as AC 750V for household outlet simulation.",
                displayState: { mode: "ERR", value: "OL", unit: "" },
            };
        }

        if (!probesAreAcrossPoints("live", "neutral")) {
            return {
                reading: "No valid reading",
                setup: "Wrong probe placement",
                message: "Place the probes across the live and neutral terminals to measure outlet voltage.",
                displayState: { mode: "V AC", value: "ERR", unit: "" },
            };
        }

        const voltage = Math.round(220 + Math.random() * 20);

        return {
            success: true,
            reading: `${voltage} V AC`,
            setup: "Correct setup",
            message: "Correct setup. AC outlet voltage measured successfully.",
            displayState: { mode: "V AC", value: String(voltage), unit: "V" },
            learning: `The AC outlet measured ${voltage} V on the AC 750V range. A high AC range is used for household outlet simulation because the expected voltage is much higher than small battery circuits.`,
        };
    }

    function measureLampCircuit() {
        if (dmmState.activeRangeId !== "dc10a" || dmmState.redProbePort !== "10A") {
            return {
                reading: "No valid reading",
                setup: "Wrong current setup",
                message: "Current must be measured in series. Use the 10A port and DC 10A range.",
                displayState: { mode: "ERR", value: "OL", unit: "" },
            };
        }

        if (!probesAreAcrossPoints("series-in", "series-out")) {
            return {
                reading: "No valid reading",
                setup: "Series connection required",
                message: "Current must be measured in series. Place the probes on the series input and output points of the lamp circuit.",
                displayState: { mode: "A DC", value: "ERR", unit: "" },
            };
        }

        const current = (0.88 + Math.random() * 0.05).toFixed(2);

        return {
            success: true,
            reading: `${current} A`,
            setup: "Correct series setup",
            message: "Correct setup. Lamp circuit current measured in series.",
            displayState: { mode: "A DC", value: current, unit: "A" },
            learning: `The lamp circuit measured about ${current} A on the DC 10A range. Current measurements require the meter to become part of the circuit path, so the red probe uses the 10A port and the probes are placed in series.`,
        };
    }

    function measureBattery() {
        if (dmmState.activeRangeId !== "dc20") {
            return {
                reading: "No valid reading",
                setup: "Wrong mode",
                message: "Wrong mode selected. Use DC 20V for a 9V battery.",
                displayState: { mode: "ERR", value: "OL", unit: "" },
            };
        }

        const correctPolarity = dmmState.redProbePosition === "positive" && dmmState.blackProbePosition === "negative";
        const reversedPolarity = dmmState.redProbePosition === "negative" && dmmState.blackProbePosition === "positive";

        if (!correctPolarity && !reversedPolarity) {
            return {
                reading: "No valid reading",
                setup: "Wrong probe placement",
                message: "Place the red probe on the positive terminal and the black probe on the negative terminal.",
                displayState: { mode: "V DC", value: "ERR", unit: "" },
            };
        }

        const voltage = (8.9 + Math.random() * 0.3).toFixed(2);

        if (reversedPolarity) {
            return {
                success: true,
                reading: `-${voltage} V`,
                setup: "Reversed polarity",
                message: "The probes are reversed. The meter is displaying a negative voltage because the polarity is opposite.",
                displayState: { mode: "V DC", value: `-${voltage}`, unit: "V" },
                guide: "Reverse the probes to show the same voltage as a positive value.",
            };
        }

        return {
            success: true,
            reading: `${voltage} V`,
            setup: "Correct setup",
            message: "Correct setup. Battery voltage measured successfully.",
            displayState: { mode: "V DC", value: voltage, unit: "V" },
            guide: "DC voltage depends on polarity: red on positive gives a positive reading.",
            learning: `The 9V battery produced ${voltage} V on the DC 20V range. This range is suitable because the expected voltage is below 20V, and the red probe is on positive while black is the reference point.`,
        };
    }

    function measureResistor() {
        if (dmmState.activeMode !== "resistance") {
            return {
                reading: "No valid reading",
                setup: "Wrong mode",
                message: "Wrong mode selected. Use a resistance range to measure the 220Ω resistor.",
                displayState: { mode: "ERR", value: "OL", unit: "" },
            };
        }

        if (!probesAreAcrossTwoLeads()) {
            return {
                reading: "No valid reading",
                setup: "Wrong probe placement",
                message: "Place the probes on opposite resistor leads to complete the resistance path.",
                displayState: { mode: "Ω", value: "ERR", unit: "" },
            };
        }

        if (dmmState.activeRangeId === "r200") {
            return {
                reading: "OL",
                setup: "Incorrect range",
                message: "Incorrect range selected. The 200Ω range is too low for a 220Ω resistor, so the meter shows OL.",
                displayState: { mode: "Ω", value: "OL", unit: "" },
            };
        }

        if (dmmState.activeRangeId !== "r2k") {
            return {
                reading: "No valid reading",
                setup: "Use 2kΩ range",
                message: "For this lab task, select the 2kΩ range to measure the 220Ω resistor accurately.",
                displayState: { mode: "Ω", value: "READY", unit: "" },
            };
        }

        return {
            success: true,
            reading: "220 Ω",
            setup: "Correct setup",
            message: "Correct setup. The resistor measured 220Ω on the 2kΩ range.",
            displayState: { mode: "Ω", value: "220", unit: "Ω" },
            learning: "The 220Ω resistor fits safely inside the 2kΩ range. Resistance is measured on unpowered components, with the probes placed across both leads.",
        };
    }

    function measureContinuityObject(objectId) {
        if (dmmState.activeRangeId !== "continuity") {
            return {
                reading: "No valid reading",
                setup: "Wrong mode",
                message: "Wrong mode selected. Use Continuity mode for fuses and wires.",
                displayState: { mode: "ERR", value: "OL", unit: "" },
            };
        }

        if (!probesAreAcrossTwoLeads()) {
            return {
                reading: "No valid reading",
                setup: "Wrong probe placement",
                message: "Place the probes on opposite ends so the meter can test the whole path.",
                displayState: { mode: "BEEP", value: "READY", unit: "" },
            };
        }

        const continuityResults = {
            goodFuse: {
                reading: "0.1 Ω",
                value: "0.1",
                beep: true,
                message: "Continuity detected. The good fuse has a complete conductive path.",
                learning: "A good fuse reads very low resistance because current can pass through it. The continuity beep confirms the path is closed.",
            },
            blownFuse: {
                reading: "OL",
                value: "OL",
                beep: false,
                message: "No continuity. The blown fuse is open internally.",
                learning: "A blown fuse shows OL because the internal conductor is broken. In real troubleshooting, this means the fuse should be replaced.",
            },
            closedWire: {
                reading: "0.0 Ω",
                value: "0.0",
                beep: true,
                message: "Continuity detected. The closed wire forms a complete path.",
                learning: "A closed wire should read almost zero ohms. The beep confirms both ends are electrically connected.",
            },
            openWire: {
                reading: "OL",
                value: "OL",
                beep: false,
                message: "No continuity. The open wire has a break in the path.",
                learning: "An open wire shows OL because the circuit path is broken. This is a common way to locate cable faults.",
            },
        };
        const result = continuityResults[objectId];

        return {
            success: true,
            beep: result.beep,
            reading: result.beep ? `${result.reading} + BEEP` : result.reading,
            setup: result.beep ? "Continuity detected" : "Open circuit detected",
            message: result.message,
            displayState: { mode: result.beep ? "BEEP" : "Ω", value: result.value, unit: result.value === "OL" ? "" : "Ω" },
            learning: result.learning,
        };
    }

    function probesAreAcrossTwoLeads() {
        const positions = [dmmState.redProbePosition, dmmState.blackProbePosition];
        return positions.includes("left") && positions.includes("right");
    }

    function probesAreAcrossPoints(firstPoint, secondPoint) {
        const positions = [dmmState.redProbePosition, dmmState.blackProbePosition];
        return positions.includes(firstPoint) && positions.includes(secondPoint);
    }

    function showFeedback(result) {
        feedbackReading.textContent = result.reading;
        feedbackSetup.textContent = result.setup;
        resultFeedback.textContent = result.message;

        if (result.displayState) {
            updateDisplay(result.displayState);
        }
    }

    function publishDmmState(eventName, result = null) {
        const snapshot = {
            activeMode: dmmState.activeMode,
            activeRange: dmmState.activeRange,
            activeRangeId: dmmState.activeRangeId,
            selectedObjectId: dmmState.selectedObjectId,
            selectedObject: dmmState.selectedObject,
            redProbePort: dmmState.redProbePort,
            blackProbePort: dmmState.blackProbePort,
            redProbePosition: dmmState.redProbePosition,
            blackProbePosition: dmmState.blackProbePosition,
            redProbeConnection: dmmState.redProbeConnection,
            blackProbeConnection: dmmState.blackProbeConnection,
            components: workbenchState.components.map((component) => ({
                uid: component.uid,
                name: component.name,
                objectId: component.objectId,
                x: component.x,
                y: component.y,
                measurable: component.measurable,
            })),
            activeComponentId: workbenchState.activeComponentId,
            reading: feedbackReading.textContent,
            setup: feedbackSetup.textContent,
            result,
        };

        window.vtalpDmmState = snapshot;
        document.dispatchEvent(new CustomEvent(`dmm:${eventName}`, { detail: snapshot }));
    }

    function markPort(portName, className) {
        const port = [...meterPorts].find((item) => item.dataset.port === portName);
        port?.classList.add(className);
    }

    function getExpectedRedPort() {
        return dmmState.activeMode === "dc_current" ? "10A" : "VΩmA";
    }

    function startProbeDrag(event, probeElement) {
        event.preventDefault();
        probeElement.setPointerCapture(event.pointerId);
        probeElement.classList.add("dragging");
        selectProbe(probeElement.dataset.probe);
        const startX = event.clientX;
        const startY = event.clientY;
        let hasMoved = false;

        const moveProbe = (moveEvent) => {
            if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 3) {
                hasMoved = true;
            }

            if (!hasMoved) {
                return;
            }

            moveProbeAtPointer(probeElement, moveEvent.clientX, moveEvent.clientY);
        };

        const stopDrag = (upEvent) => {
            probeElement.releasePointerCapture(upEvent.pointerId);
            probeElement.removeEventListener("pointermove", moveProbe);
            probeElement.removeEventListener("pointerup", stopDrag);
            probeElement.classList.remove("dragging");
            if (hasMoved) {
                finishProbeDrag(probeElement, upEvent.clientX, upEvent.clientY);
            } else {
                updateAttachedProbePositions();
            }
        };

        probeElement.addEventListener("pointermove", moveProbe);
        probeElement.addEventListener("pointerup", stopDrag);
    }

    function moveProbeAtPointer(probeElement, clientX, clientY) {
        const rect = workbench.getBoundingClientRect();
        const x = clamp(((clientX - rect.left) / rect.width) * 100, 6, 88);
        const y = clamp(((clientY - rect.top) / rect.height) * 100, 24, 88);

        probeElement.style.setProperty("--probe-x", `${x}%`);
        probeElement.style.setProperty("--probe-y", `${y}%`);
        setProbeAngle(probeElement, x, y);
    }

    function finishProbeDrag(probeElement, clientX, clientY) {
        const probeName = probeElement.dataset.probe;
        const snap = detectProbePlacement(clientX, clientY);

        if (snap) {
            snapProbeToTerminal(probeName, snap);
            return;
        }

        clearProbeConnection(probeName);
        clearMeasurementReading(`${capitalize(probeName)} probe disconnected. Snap the tip onto a valid terminal to measure.`);
        updateProbeStatus();
        updateTestPointHighlights();
        publishDmmState("state-change");
    }

    function snapProbeToTerminal(probeName, snap) {
        if (!snap) {
            return;
        }

        if (snap.componentId !== workbenchState.activeComponentId) {
            selectPlacedComponent(snap.componentId);
            snap = getTerminalSnap(findTerminalElement(snap.componentId, snap.pointId));
        }

        if (!snap) {
            clearProbeConnection(probeName);
            return;
        }

        setProbePlacement(probeName, snap.pointId, snap.componentId);
        setProbeCoordinates(getBenchProbeElement(probeName), snap.xPercent, snap.yPercent);
        pulseTerminal(snap.pointElement);
    }

    function setProbePlacement(probeName, placement, componentId = workbenchState.activeComponentId) {
        const connection = placement ? { componentId, pointId: placement } : null;

        if (probeName === "red") {
            dmmState.redProbePosition = placement;
            dmmState.redProbeConnection = connection;
        } else {
            dmmState.blackProbePosition = placement;
            dmmState.blackProbeConnection = connection;
        }

        feedbackReading.textContent = "No reading yet";
        feedbackSetup.textContent = dmmState.redProbePosition && dmmState.blackProbePosition
            ? "Probes snapped"
            : "Probe snapped";
        resultFeedback.textContent = `${capitalize(probeName)} probe snapped to ${getProbeConnectionLabel(probeName)}.`;
        updateDisplay(selectorMap[dmmState.activeRangeId].display);
        updateTestPointHighlights();
        updateProbeStatus();
        if (dmmState.redProbePosition && dmmState.blackProbePosition) {
            advanceGuideTo(3);
        }
        publishDmmState("state-change");
    }

    function detectProbePlacement(clientX, clientY) {
        const points = [...workbenchObject.querySelectorAll("[data-test-point]")];
        let nearest = null;

        for (const point of points) {
            const rect = point.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.hypot(clientX - centerX, clientY - centerY);

            if (distance <= probeSnapDistance && (!nearest || distance < nearest.distance)) {
                nearest = { ...getTerminalSnap(point), distance };
            }
        }

        return nearest;
    }

    function getTerminalSnap(pointElement) {
        if (!pointElement) {
            return null;
        }

        const component = pointElement.closest("[data-component-id]");
        const rect = pointElement.getBoundingClientRect();
        const workbenchRect = workbench.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        return {
            componentId: component?.dataset.componentId || null,
            pointId: pointElement.dataset.testPoint,
            pointElement,
            xPercent: ((centerX - workbenchRect.left) / workbenchRect.width) * 100,
            yPercent: ((centerY - workbenchRect.top) / workbenchRect.height) * 100,
        };
    }

    function findTerminalElement(componentId, pointId) {
        if (!componentId || !pointId) {
            return null;
        }

        return workbenchObject.querySelector(`[data-component-id="${componentId}"] [data-test-point="${pointId}"]`);
    }

    function setProbeCoordinates(probeElement, xPercent, yPercent) {
        if (!probeElement) {
            return;
        }

        const x = clamp(xPercent, 3, 96);
        const y = clamp(yPercent, 8, 94);
        probeElement.style.setProperty("--probe-x", `${x}%`);
        probeElement.style.setProperty("--probe-y", `${y}%`);
        setProbeAngle(probeElement, x, y);
    }

    function getBenchProbeElement(probeName) {
        return workbench.querySelector(`.bench-${probeName}-probe`);
    }

    function setProbeAngle(probeElement, xPercent, yPercent) {
        const home = probeHomeAnchors[probeElement.dataset.probe] || { x: 50, y: 92 };
        const angle = Math.atan2(yPercent - home.y, xPercent - home.x) * (180 / Math.PI);
        probeElement.style.setProperty("--probe-angle", `${angle}deg`);
    }

    function updateAttachedProbePositions() {
        ["black", "red"].forEach((probeName) => {
            const connection = getProbeConnection(probeName);
            const terminal = findTerminalElement(connection?.componentId, connection?.pointId);
            const snap = getTerminalSnap(terminal);

            if (snap) {
                setProbeCoordinates(getBenchProbeElement(probeName), snap.xPercent, snap.yPercent);
            }
        });
    }

    function getProbeConnection(probeName) {
        return probeName === "red" ? dmmState.redProbeConnection : dmmState.blackProbeConnection;
    }

    function clearProbeConnection(probeName) {
        if (probeName === "red") {
            dmmState.redProbePosition = null;
            dmmState.redProbeConnection = null;
        } else {
            dmmState.blackProbePosition = null;
            dmmState.blackProbeConnection = null;
        }
    }

    function disconnectProbesFromComponent(componentId) {
        let disconnected = false;

        ["black", "red"].forEach((probeName) => {
            if (getProbeConnection(probeName)?.componentId === componentId) {
                clearProbeConnection(probeName);
                disconnected = true;
            }
        });

        if (disconnected) {
            clearMeasurementReading("Probe disconnected. Snap both tips onto valid terminals to measure.");
            updateProbeStatus();
        }
    }

    function preserveProbeConnectionsForComponent(componentId) {
        ["black", "red"].forEach((probeName) => {
            const connection = getProbeConnection(probeName);
            if (connection?.componentId === componentId) {
                setProbePlacement(probeName, connection.pointId, connection.componentId);
            } else {
                clearProbeConnection(probeName);
            }
        });
    }

    function pulseTerminal(pointElement) {
        pointElement?.classList.remove("snap-success");
        requestAnimationFrame(() => {
            pointElement?.classList.add("snap-success");
            window.setTimeout(() => pointElement?.classList.remove("snap-success"), 420);
        });
    }

    function clearMeasurementReading(message) {
        feedbackReading.textContent = "No reading yet";
        feedbackSetup.textContent = "Probe disconnected";
        resultFeedback.textContent = message;
        updateDisplay(selectorMap[dmmState.activeRangeId].display);
    }

    function resetWorkspaceMeasurementState(setupText = "Waiting for component") {
        feedbackReading.textContent = "No reading yet";
        feedbackSetup.textContent = setupText;
        resultFeedback.textContent = "Choose a component to start your measurement practice.";
        updateDisplay(selectorMap[dmmState.activeRangeId].display);
        updateProbeStatus();
        updateTestPointHighlights();
    }

    function updateTestPointHighlights() {
        workbenchObject.querySelectorAll("[data-component-id]").forEach((component) => {
            component.querySelectorAll("[data-test-point]").forEach((point) => {
                const componentId = component.dataset.componentId;
                point.classList.toggle(
                    "probe-contact-red",
                    dmmState.redProbeConnection?.componentId === componentId
                        && dmmState.redProbeConnection?.pointId === point.dataset.testPoint
                );
                point.classList.toggle(
                    "probe-contact-black",
                    dmmState.blackProbeConnection?.componentId === componentId
                        && dmmState.blackProbeConnection?.pointId === point.dataset.testPoint
                );
            });
        });
    }

    function updateSelectorHighlight(positionId) {
        selectorLabels.forEach((label) => {
            const isActive = label.dataset.selector === positionId;
            label.classList.toggle("active", isActive);
            label.setAttribute("aria-pressed", String(isActive));
        });
    }

    function updateKnobRotation(angle) {
        rotaryKnob.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }

    function updateDisplay(displayState) {
        displayMode.textContent = displayState.mode;
        displayValue.textContent = displayState.value;
        displayUnit.textContent = displayState.unit;
        display.classList.remove("pulse");

        window.requestAnimationFrame(() => {
            display.classList.add("pulse");
        });
    }

    function updateLearningPanel(selectedPosition) {
        modeExplanation.textContent = getCompactModeText(selectedPosition);
        measurementExplanation.textContent = guideSteps[currentGuideStep];
        resultFeedback.textContent = `${selectedPosition.range} selected. ${getModeConnectionInstruction()}`;
        feedbackSetup.textContent = "Range selected";
        feedbackReading.textContent = selectedPosition.id === "off" ? "No reading yet" : "Ready";
    }

    function getCompactModeText(selectedPosition) {
        if (selectedPosition.id === "off") {
            return "Meter is OFF.";
        }

        return `${selectedPosition.range}: ${getModeConnectionInstruction()}`;
    }

    function expandAssistantSection(sectionName) {
        assistantToggles.forEach((toggle) => {
            const isActive = toggle.dataset.assistantSection === sectionName;
            const item = toggle.closest(".assistant-item");
            const panel = item?.querySelector(".assistant-panel");

            item?.classList.toggle("active", isActive);
            toggle.setAttribute("aria-expanded", String(isActive));
            toggle.querySelector("span").textContent = `${isActive ? "▼" : "▶"} ${getAssistantSectionLabel(toggle.dataset.assistantSection)}`;

            if (panel) {
                panel.hidden = !isActive;
            }
        });
    }

    function getAssistantSectionLabel(sectionName) {
        const labels = {
            mode: "Selected Mode",
            safety: "Safety Tips",
            guide: "Step-by-Step Guide",
        };

        return labels[sectionName] || "Details";
    }

    function advanceGuideTo(stepIndex) {
        currentGuideStep = Math.max(currentGuideStep, stepIndex);
        updateGuidePanel();
    }

    function updateGuidePanel() {
        if (!guideStepLabel || !guideInstruction) {
            return;
        }

        const activeStep = guideSteps[currentGuideStep] || guideSteps[0];
        guideStepLabel.textContent = `Step ${currentGuideStep + 1} of ${guideSteps.length}`;
        guideInstruction.textContent = activeStep;

        if (guidePrevButton) {
            guidePrevButton.disabled = currentGuideStep === 0;
        }

        if (guideNextButton) {
            guideNextButton.disabled = currentGuideStep === guideSteps.length - 1;
        }
    }

    function updateProbeStatus() {
        selectedProbeStatus.textContent = `${capitalize(dmmState.selectedProbe)} probe`;
        blackProbePortStatus.textContent = dmmState.blackProbePort
            ? `connected to ${dmmState.blackProbePort}`
            : "not connected";
        redProbePortStatus.textContent = dmmState.redProbePort
            ? `connected to ${dmmState.redProbePort}`
            : "not connected";
        blackProbeTipStatus.textContent = dmmState.blackProbePosition
            ? getProbeConnectionLabel("black")
            : "not placed";
        redProbeTipStatus.textContent = dmmState.redProbePosition
            ? getProbeConnectionLabel("red")
            : "not placed";
    }

    function setWarning(message, level) {
        safetyWarning.textContent = message;
        safetyWarning.classList.remove("warning", "danger");

        if (level !== "safe") {
            safetyWarning.classList.add(level);
        }
    }

    function setActiveElement(elements, activeElement) {
        elements.forEach((element) => element.classList.remove("active"));
        activeElement.classList.add("active");
    }

    function getModeConnectionInstruction() {
        if (dmmState.activeMode === "dc_current") {
            return "Connect black probe to COM and red probe to 10A. Current measurement requires series connection.";
        }

        if (dmmState.activeMode === "off") {
            return "Select a meter range before connecting probes.";
        }

        if (dmmState.activeMode === "resistance" || dmmState.activeMode === "continuity") {
            return "Connect black probe to COM and red probe to VΩmA. Use only on unpowered components.";
        }

        return "Connect black probe to COM and red probe to VΩmA. Place the red tip on the positive point and black tip on the reference point.";
    }

    function getObjectSetupInstruction(selectedObject) {
        if (selectedObject.id === "ac-outlet") {
            return "Use AC 750V, keep black in COM and red in VΩmA, then place the probes on live and neutral.";
        }

        if (selectedObject.id === "lamp-circuit") {
            return "Use DC 10A, connect the red probe to 10A, and place the meter in series using the series input and output points.";
        }

        return getModeConnectionInstruction();
    }

    function getPointName(pointId) {
        const selectedObject = measurementObjects[dmmState.selectedObjectId];
        const point = selectedObject?.points.find((item) => item.id === pointId);
        return point?.name || pointId;
    }

    function getProbeConnectionLabel(probeName) {
        const connection = getProbeConnection(probeName);
        if (!connection) {
            return "not placed";
        }

        const component = workbenchState.components.find((item) => item.uid === connection.componentId);
        const object = measurementObjects[component?.objectId];
        const point = object?.points.find((item) => item.id === connection.pointId)
            || component?.points.find((item) => item.id === connection.pointId);
        const pointName = point?.name || connection.pointId;

        return component ? `${component.name} ${pointName}` : pointName;
    }

    function playContinuityBeep() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gain.gain.setValueAtTime(0.08, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.18);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.18);
    }

    function capitalize(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    selectRange("off");
    selectProbe("black");
    expandAssistantSection("mode");
    selectedObjectName.textContent = "No component selected";
    measurementExplanation.textContent = "Choose a component, place both probes, then press Measure.";
    resetWorkspaceMeasurementState();
    renderSelectedObject();
    updateGuidePanel();
    publishDmmState("ready");
});

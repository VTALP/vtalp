// Arduino Lab foundation plus guided lessons, wiring, code upload, and simulation.
document.addEventListener("DOMContentLoaded", () => {
    const deviceButtons = document.querySelectorAll("[data-device]");
    const projectButtons = document.querySelectorAll("[data-project]");
    const selectedDeviceLayer = document.getElementById("selectedDeviceLayer");
    const modeOptions = document.querySelectorAll(".mode-option");
    const coachMessage = document.getElementById("labCoachMessage");
    const coachDetails = document.getElementById("labCoachDetails");
    const coachCard = document.getElementById("coachCard");
    const wiringCard = document.getElementById("wiringCard");
    const labControlsPanel = document.getElementById("labControlsPanel");
    const usbCard = document.getElementById("usbCard");
    const simulationCard = document.getElementById("simulationCard");
    const outputCard = document.getElementById("outputCard");
    const workspaceControlsCard = document.getElementById("workspaceControlsCard");
    const freeBuildHelpCard = document.getElementById("freeBuildHelpCard");
    const freeBuildWireStatus = document.getElementById("freeBuildWireStatus");
    const freeBuildSaveStatus = document.getElementById("freeBuildSaveStatus");
    const saveFreeBuildButton = document.getElementById("saveFreeBuildButton");
    const loadFreeBuildButton = document.getElementById("loadFreeBuildButton");
    const clearFreeBuildButton = document.getElementById("clearFreeBuildButton");
    const backToLessonsActionButton = document.getElementById("backToLessonsActionButton");
    const clearFreeBuildDialog = document.getElementById("clearFreeBuildDialog");
    const confirmClearFreeBuildButton = document.getElementById("confirmClearFreeBuildButton");
    const cancelClearFreeBuildButton = document.getElementById("cancelClearFreeBuildButton");
    const resetWorkspaceButton = document.getElementById("resetWorkspaceButton");
    const clearWorkbenchButton = document.getElementById("clearWorkbenchButton");
    const guidedProjectLibrary = document.getElementById("guidedProjectLibrary");
    const freeBuildDeviceLibrary = document.getElementById("freeBuildDeviceLibrary");
    const backToLessonsButton = document.getElementById("backToLessonsButton");
    const leaveFreeBuildDialog = document.getElementById("leaveFreeBuildDialog");
    const saveAndLeaveFreeBuildButton = document.getElementById("saveAndLeaveFreeBuildButton");
    const confirmLeaveFreeBuildButton = document.getElementById("confirmLeaveFreeBuildButton");
    const cancelLeaveFreeBuildButton = document.getElementById("cancelLeaveFreeBuildButton");
    const lessonComponentSummary = document.getElementById("lessonComponentSummary");
    const lessonComponentList = document.getElementById("lessonComponentList");
    const boardIntroButtons = document.querySelectorAll("[data-board-intro]");
    const freeBuildTab = document.getElementById("freeBuildTab");
    const outputTabs = document.querySelectorAll("[data-output-tab]");
    const libraryPanelTitle = document.getElementById("libraryPanelTitle");
    const wireLayer = document.getElementById("wireLayer");
    const arduinoBoard = document.querySelector(".arduino-uno-board");
    const boardTooltip = document.getElementById("boardTooltip");
    const boardResetButton = document.querySelector("[data-board-part='reset']");
    const boardUsbPort = document.querySelector("[data-board-part='usb']");
    const builtInLed = document.querySelector("[data-built-in-led='pin-13']");
    const wiringStepText = document.getElementById("wiringStepText");
    const wiringStepList = document.getElementById("wiringStepList");
    const completedStepCount = document.getElementById("completedStepCount");
    const remainingStepCount = document.getElementById("remainingStepCount");
    const completeBoardIntroButton = document.getElementById("completeBoardIntroButton");
    const lessonCompletePanel = document.getElementById("lessonCompletePanel");
    const completedLessonTitle = document.getElementById("completedLessonTitle");
    const completedLessonConcepts = document.getElementById("completedLessonConcepts");
    const startNextLessonButton = document.getElementById("startNextLessonButton");
    const clearCompletedWorkspaceButton = document.getElementById("clearCompletedWorkspaceButton");
    const stayHereButton = document.getElementById("stayHereButton");
    const resetWiringButton = document.getElementById("resetWiringButton");
    const guidedClearWorkspaceButton = document.getElementById("guidedClearWorkspaceButton");
    const workspaceEmptyMessage = document.getElementById("workspaceEmptyMessage");
    const connectUsbButton = document.getElementById("connectUsbButton");
    const simulationStatus = document.getElementById("simulationStatus");
    const usbStatus = document.getElementById("usbStatus");
    const usbCable = document.getElementById("usbCable");
    const codeStudioCard = document.getElementById("codeStudioCard");
    const sketchSelect = document.getElementById("sketchSelect");
    const codeEditor = document.getElementById("codeEditor");
    const resetCodeButton = document.getElementById("resetCodeButton");
    const codeStudioMessage = document.getElementById("codeStudioMessage");
    const uploadCodeButton = document.getElementById("uploadCodeButton");
    const codeStatusSketch = document.getElementById("codeStatusSketch");
    const codeStatusEdited = document.getElementById("codeStatusEdited");
    const codeStatusCompile = document.getElementById("codeStatusCompile");
    const codeStatusUpload = document.getElementById("codeStatusUpload");
    const codeStatusBehavior = document.getElementById("codeStatusBehavior");
    const startSimulationButton = document.getElementById("startSimulationButton");
    const stopSimulationButton = document.getElementById("stopSimulationButton");
    const workspaceStopSimulationButton = document.getElementById("workspaceStopSimulationButton");
    const resetSimulationButton = document.getElementById("resetSimulationButton");
    const statusCurrentSketch = document.getElementById("statusCurrentSketch");
    const statusActivePin = document.getElementById("statusActivePin");
    const statusPinState = document.getElementById("statusPinState");
    const statusLedState = document.getElementById("statusLedState");
    const statusButtonState = document.getElementById("statusButtonState");
    const statusBuzzerState = document.getElementById("statusBuzzerState");
    const statusToneFrequency = document.getElementById("statusToneFrequency");
    const statusLightLevel = document.getElementById("statusLightLevel");
    const statusTemperature = document.getElementById("statusTemperature");
    const statusAnalogValue = document.getElementById("statusAnalogValue");
    const statusDistance = document.getElementById("statusDistance");
    const statusEchoDuration = document.getElementById("statusEchoDuration");
    const statusServoAngle = document.getElementById("statusServoAngle");
    const statusPwmSignal = document.getElementById("statusPwmSignal");
    const statusServoPower = document.getElementById("statusServoPower");
    const statusServoGround = document.getElementById("statusServoGround");
    const statusVoltage = document.getElementById("statusVoltage");
    const virtualButtonControl = document.getElementById("virtualButtonControl");
    const potentiometerControlPanel = document.getElementById("potentiometerControlPanel");
    const potentiometerControl = document.getElementById("potentiometerControl");
    const potentiometerValueLabel = document.getElementById("potentiometerValueLabel");
    const potentiometerVoltageLabel = document.getElementById("potentiometerVoltageLabel");
    const buzzerControlPanel = document.getElementById("buzzerControlPanel");
    const buzzerFrequencyControl = document.getElementById("buzzerFrequencyControl");
    const buzzerFrequencyLabel = document.getElementById("buzzerFrequencyLabel");
    const ldrControlPanel = document.getElementById("ldrControlPanel");
    const ldrLightControl = document.getElementById("ldrLightControl");
    const ldrLightLabel = document.getElementById("ldrLightLabel");
    const temperatureControlPanel = document.getElementById("temperatureControlPanel");
    const temperatureControl = document.getElementById("temperatureControl");
    const temperatureValueLabel = document.getElementById("temperatureValueLabel");
    const temperatureVoltageLabel = document.getElementById("temperatureVoltageLabel");
    const ultrasonicControlPanel = document.getElementById("ultrasonicControlPanel");
    const ultrasonicDistanceControl = document.getElementById("ultrasonicDistanceControl");
    const ultrasonicDistanceLabel = document.getElementById("ultrasonicDistanceLabel");
    const ultrasonicEchoLabel = document.getElementById("ultrasonicEchoLabel");
    const servoControlPanel = document.getElementById("servoControlPanel");
    const servoAngleControl = document.getElementById("servoAngleControl");
    const servoAngleValue = document.getElementById("servoAngleValue");
    const viewServoPwmButton = document.getElementById("viewServoPwmButton");
    const servoPwmMessage = document.getElementById("servoPwmMessage");
    const serialMonitorOutput = document.getElementById("serialMonitorOutput");
    const clearSerialButton = document.getElementById("clearSerialButton");
    const selectedDevices = new Set();
    const breadboardComponentPositions = new Map();
    const freeBuildStorageKey = "vtalpArduinoFreeBuildWorkspace";

    let activeProject = null;
    let selectedPin = null;
    let selectedFreeBuildPoint = null;
    let currentStepIndex = 0;
    let completedConnections = [];
    let manualConnections = [];
    let usbConnected = false;
    let uploadTimer = null;
    let uploadedSketch = null;
    let uploadedBehavior = null;
    let simulationTimer = null;
    let buttonReadTimer = null;
    let servoTimer = null;
    let potentiometerTimer = null;
    let buzzerTimer = null;
    let ldrTimer = null;
    let temperatureTimer = null;
    let ultrasonicTimer = null;
    let audioContext = null;
    let buzzerOscillator = null;
    let buzzerGain = null;
    let blinkDelay = 1000;
    let blinkPinHigh = false;
    let buttonPressed = false;
    let buzzerOn = false;
    let buzzerFrequency = 1000;
    let buzzerPattern = { onDelay: 1000, offDelay: 1000 };
    let potentiometerValue = 0;
    let ldrLevelIndex = 1;
    let ldrAnalogValue = 512;
    let temperatureC = 25;
    let temperatureAnalogValue = 51;
    let temperatureVoltage = 0.25;
    let ultrasonicDistance = 50;
    let ultrasonicEchoDuration = 2941;
    let servoAngle = 0;
    let servoStepIndex = 0;
    let servoSequence = [
        { angle: 0, delay: 1000 },
        { angle: 90, delay: 1000 },
        { angle: 180, delay: 1000 },
    ];
    let simulationRunning = false;
    let activeSimulation = null;
    let editorEdited = false;
    let lastCompileStatus = "Not Compiled";
    let lastUploadStatus = "Not Uploaded";
    let detectedBehavior = "None";
    let activeLessonKey = null;
    let boardIntroCompleted = false;
    let lessonObserved = false;
    let meetBoardStepIndex = 0;
    let freeBuildDirty = false;
    let activeComponentDrag = null;
    let activeComponentResize = null;

    const defaultCoachText = "Connect USB to program the Arduino.";
    const lessonOrder = ["meet-board", "blink-led", "read-push-button", "read-potentiometer", "buzzer-tone"];
    const lessonCompletionText = {
        "meet-board": {
            title: "Meet the Board",
            concepts: ["USB connection", "Digital pins", "Analog pins", "Power and GND"],
        },
        "blink-led": {
            title: "Blink an LED",
            concepts: ["Digital Output", "Pin 13", "LED polarity", "Current limiting resistor"],
        },
        "read-push-button": {
            title: "Read a Push Button",
            concepts: ["Digital Input", "Pin 2", "Button states", "Ground reference"],
        },
        "read-potentiometer": {
            title: "Control LED Brightness",
            concepts: ["Analog Input", "A0", "Variable resistance", "Output control"],
        },
        "buzzer-tone": {
            title: "Play a Tone",
            concepts: ["Sound Output", "Pin 8", "Tone frequency", "Buzzer polarity"],
        },
    };
    const lessonExpectedBehavior = {
        "blink-led": "blink-led",
        "read-push-button": "read-button",
        "read-potentiometer": "read-potentiometer",
        "buzzer-tone": "buzzer-tone",
    };
    const lessonRunLabels = {
        "blink-led": "Observe LED blinking",
        "read-push-button": "Observe button readings",
        "read-potentiometer": "Observe changing values",
        "buzzer-tone": "Observe the buzzer tone",
    };
    const meetBoardSequence = [
        "usb",
        "reset",
        "digital-pins",
        "analog-pins",
        "power-pins",
        "built-in-led",
    ];
    const boardPartInfo = {
        usb: {
            title: "USB Port",
            type: "Power and Programming",
            uses: ["Connect USB", "Upload sketches", "Serial monitor"],
        },
        reset: {
            title: "Reset Button",
            type: "Board Control",
            uses: ["Restart sketch", "Clear outputs", "Return to current step"],
        },
        "digital-pins": {
            title: "Digital Pins 0-13",
            type: "Digital Input / Output",
            uses: ["Blink LED", "Read buttons", "Drive buzzers"],
        },
        "analog-pins": {
            title: "Analog Pins A0-A5",
            type: "Analog Input",
            uses: ["Read sensors", "Read potentiometers", "Measure changing voltage"],
        },
        "power-pins": {
            title: "Power Pins",
            type: "Power Reference",
            uses: ["3.3V", "5V", "GND", "Vin"],
        },
        "built-in-led": {
            title: "Built-in LED",
            type: "Digital Output on Pin 13",
            uses: ["Blink LED", "Quick output test", "Pin 13 projects"],
        },
    };
    const behaviorComponentLabels = {
        "blink-led": "LED",
        "read-button": "Push Button",
        "servo-sweep": "Servo Motor",
        "read-potentiometer": "Potentiometer",
        "buzzer-tone": "Buzzer",
        "read-ldr": "LDR Light Sensor",
        "read-temperature": "Temperature Sensor",
        "read-ultrasonic": "Ultrasonic Sensor",
    };

    function recordArduinoLabEvent(event, detail = "") {
        // Progress tracking is intentionally fire-and-forget so a temporary
        // network/session issue never blocks the educational simulation.
        fetch("/progress/api/simulation/arduino/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event, detail }),
        }).catch(() => {});
    }

    function recordArduinoSimulationRun() {
        const detail = behaviorComponentLabels[uploadedBehavior] || getCurrentSimulationLabel();
        recordArduinoLabEvent("simulation_run", detail);
        recordArduinoLabEvent("component_tested", detail);
    }

    const deviceInfo = {
        "arduino-uno": {
            name: "Arduino Uno",
            visual: "arduino-uno",
            coach: "The Arduino Uno is the main controller board. It reads inputs, runs instructions, and controls output devices.",
            description: "Main microcontroller board for beginner embedded systems labs.",
        },
        led: {
            name: "LED",
            visual: "led",
            coach: "An LED is an output device. Arduino can turn it ON or OFF using a digital pin.",
            description: "Light output component used for status indicators and Blink labs.",
            purpose: "An output device used to produce light.",
            connections: "Anode and cathode.",
            uses: "Blinking, status indicators, and simple output feedback.",
            terminals: [
                { id: "anode", label: "Anode +" },
                { id: "cathode", label: "Cathode -" },
            ],
        },
        resistor: {
            name: "220 Ohm Resistor",
            visual: "resistor",
            coach: "A resistor limits current so components such as LEDs are protected.",
            description: "Current-limiting component commonly used with LEDs.",
            purpose: "Limits current to protect components.",
            connections: "Two non-polarized leads.",
            uses: "LED protection and voltage/current control.",
            terminals: [
                { id: "left", label: "Lead 1" },
                { id: "right", label: "Lead 2" },
            ],
        },
        buzzer: {
            name: "Buzzer",
            visual: "buzzer",
            coach: "A buzzer is an output device. Arduino can switch it to produce beeps or simple tones.",
            description: "Sound output component for alerts and notification experiments.",
            purpose: "An output device used to produce sound.",
            connections: "Positive signal pin and negative or GND pin.",
            uses: "Alerts, simple tones, alarms, and notifications.",
            terminals: [
                { id: "positive", label: "+" },
                { id: "negative", label: "-" },
            ],
        },
        "servo-motor": {
            name: "Servo Motor",
            visual: "servo-motor",
            coach: "A servo motor rotates to specific angles using a control signal.",
            description: "Position-controlled motor for robotics and movement labs.",
            purpose: "Moves to a controlled angle.",
            connections: "Signal, 5V power, and GND.",
            uses: "Robotics, arms, doors, and angle control projects.",
            terminals: [
                { id: "signal", label: "Signal" },
                { id: "power", label: "5V" },
                { id: "ground", label: "GND" },
            ],
        },
        "push-button": {
            name: "Push Button",
            visual: "push-button",
            coach: "A push button is an input device. Arduino can read whether it is pressed or released.",
            description: "Digital input component for learning HIGH and LOW states.",
            purpose: "An input device used to detect a press.",
            connections: "Two switch terminals, usually one side to a pin and one side to GND or power.",
            uses: "Menu buttons, start/stop controls, and user input.",
            terminals: [
                { id: "signal", label: "Signal" },
                { id: "ground", label: "GND" },
            ],
        },
        potentiometer: {
            name: "Potentiometer",
            visual: "potentiometer",
            coach: "A potentiometer gives variable analog values, usually between 0 and 1023.",
            description: "Adjustable analog input used for control knobs and sensor practice.",
            purpose: "Produces an adjustable analog voltage.",
            connections: "5V, GND, and middle signal pin.",
            uses: "Volume controls, dimmers, and adjustable sensor inputs.",
            terminals: [
                { id: "left", label: "GND" },
                { id: "middle", label: "Signal" },
                { id: "right", label: "5V" },
            ],
        },
        ldr: {
            name: "LDR",
            visual: "ldr",
            coach: "An LDR is a light sensor. Arduino can read changing light levels as analog values.",
            description: "Light-dependent resistor for brightness and day/night sensing.",
            purpose: "Senses light intensity.",
            connections: "Two leads, usually used in a voltage divider with a resistor.",
            uses: "Automatic lights, brightness sensing, and day/night detection.",
            terminals: [
                { id: "power", label: "5V side" },
                { id: "signal", label: "A1 side" },
                { id: "ground", label: "Divider GND" },
            ],
        },
        "temperature-sensor": {
            name: "Temperature Sensor",
            visual: "temperature-sensor",
            coach: "A temperature sensor provides a changing signal that represents heat or room temperature.",
            description: "Analog input device for environmental monitoring labs.",
            purpose: "Measures temperature.",
            connections: "VCC, signal, and GND.",
            uses: "Weather stations, fan control, and room monitoring.",
            terminals: [
                { id: "vcc", label: "VCC" },
                { id: "signal", label: "Signal" },
                { id: "ground", label: "GND" },
            ],
        },
        "ultrasonic-sensor": {
            name: "Ultrasonic Sensor",
            visual: "ultrasonic-sensor",
            coach: "An ultrasonic sensor measures distance by sending a sound pulse and listening for its echo.",
            description: "Distance input module often used in obstacle detection projects.",
            purpose: "Measures distance without contact.",
            connections: "VCC, Trig, Echo, and GND.",
            uses: "Obstacle detection, parking aids, and distance measurement.",
            terminals: [
                { id: "vcc", label: "VCC" },
                { id: "trig", label: "Trig" },
                { id: "echo", label: "Echo" },
                { id: "ground", label: "GND" },
            ],
        },
        breadboard: {
            name: "Breadboard",
            visual: "breadboard",
            coach: "A breadboard is used to build circuits without soldering.",
            description: "Temporary circuit-building board used for safe prototyping.",
            purpose: "Holds components and jumper wires for temporary circuits.",
            connections: "Rows and rails that internally connect groups of holes.",
            uses: "Prototyping circuits before permanent soldering.",
            terminals: [],
        },
    };

    const wiringSteps = {
        "blink-led": [
            step("D13", "resistor", "left", "Connect D13 to one resistor lead.", "yellow", "D13 is the digital output that will later blink HIGH and LOW."),
            step("D13", "led", "anode", "Connect the output path to the LED anode.", "yellow", "The LED anode is the positive side and receives the output signal through the resistor."),
            step("GND", "led", "cathode", "Connect the LED cathode to GND.", "black", "Ground completes the circuit so current has a return path."),
        ],
        "read-push-button": [
            step("D2", "push-button", "signal", "Connect D2 to the button signal side.", "blue", "D2 reads whether the button input is HIGH or LOW."),
            step("GND", "push-button", "ground", "Connect the other button side to GND.", "black", "With pull-up input, pressing the button connects D2 to ground."),
        ],
        "button-led-control": [
            step("D2", "push-button", "signal", "Connect D2 to the button signal side.", "blue", "D2 reads the button state."),
            step("GND", "push-button", "ground", "Connect the button ground side.", "black", "Ground provides the reference for the button input."),
            step("D13", "resistor", "left", "Connect D13 to the LED resistor.", "yellow", "D13 will act as the output pin for the LED."),
            step("D13", "led", "anode", "Connect the output path to the LED anode.", "yellow", "The LED turns on when the output path is HIGH."),
            step("GND", "led", "cathode", "Connect the LED cathode to GND.", "black", "The LED circuit needs a complete return path."),
        ],
        "read-potentiometer": [
            step("GND", "potentiometer", "left", "Connect the left potentiometer pin to GND.", "black", "This provides the low end of the voltage divider."),
            step("A0", "potentiometer", "middle", "Connect the middle pin to A0.", "green", "A0 reads the changing voltage from the wiper."),
            step("5V", "potentiometer", "right", "Connect the right pin to 5V.", "red", "5V provides the high end of the voltage divider."),
        ],
        "rotate-servo": [
            step("D9", "servo-motor", "signal", "Connect D9 to the servo signal wire.", "orange", "D9 supports PWM-style control signals used by servos."),
            step("5V", "servo-motor", "power", "Connect the servo power wire to 5V.", "red", "The servo needs 5V power to move."),
            step("GND", "servo-motor", "ground", "Connect the servo ground wire to GND.", "black", "Signal and power need a shared ground reference."),
        ],
        "buzzer-tone": [
            step("D8", "buzzer", "positive", "Connect D8 to the buzzer positive pin.", "yellow", "D8 will switch or pulse the buzzer signal."),
            step("GND", "buzzer", "negative", "Connect the buzzer negative pin to GND.", "black", "Ground completes the buzzer circuit."),
        ],
        "measure-light": [
            step("5V", "ldr", "power", "Connect one LDR side to 5V.", "red", "The LDR needs a voltage source for the divider."),
            step("A1", "ldr", "signal", "Connect the sensing point to A1.", "green", "A1 reads the changing light-dependent voltage."),
            step("GND", "ldr", "ground", "Connect the divider ground path.", "black", "The resistor divider needs ground to create a readable voltage."),
        ],
        "measure-temperature": [
            step("5V", "temperature-sensor", "vcc", "Connect temperature sensor VCC to 5V.", "red", "The sensor needs 5V power to produce a voltage signal."),
            step("A2", "temperature-sensor", "signal", "Connect the signal pin to A2.", "green", "A2 reads the voltage that represents temperature."),
            step("GND", "temperature-sensor", "ground", "Connect the sensor GND to Arduino GND.", "black", "Ground completes the sensor circuit and provides a reference."),
        ],
        "measure-distance": [
            step("5V", "ultrasonic-sensor", "vcc", "Connect VCC to 5V.", "red", "The ultrasonic module needs 5V power."),
            step("D7", "ultrasonic-sensor", "trig", "Connect D7 to Trig.", "blue", "Trig sends the sound pulse command."),
            step("D6", "ultrasonic-sensor", "echo", "Connect D6 to Echo.", "green", "Echo returns the timing signal after the pulse reflects back."),
            step("GND", "ultrasonic-sensor", "ground", "Connect GND to complete the module power.", "black", "Ground is the common reference for the module and Arduino."),
        ],
    };

    const starterSketches = {
        "blink-led": `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,
        "read-button": `void setup() {
  pinMode(2, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int buttonState = digitalRead(2);
  Serial.println(buttonState);
  delay(500);
}`,
        "read-potentiometer": `void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  int sensorValue = analogRead(A0);
  int value = map(sensorValue, 0, 1023, 0, 255);
  analogWrite(9, value);
}`,
        "read-ldr": `void setup() {
  Serial.begin(9600);
}

void loop() {
  int lightValue = analogRead(A1);
  Serial.println(lightValue);
  delay(500);
}`,
        "read-temperature": `void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(A2);
  float voltage = sensorValue * (5.0 / 1023.0);
  float temperatureC = voltage * 100;
  Serial.println(temperatureC);
  delay(500);
}`,
        "read-ultrasonic": `const int trigPin = 7;
const int echoPin = 6;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;

  Serial.println(distance);
  delay(500);
}`,
        "buzzer-tone": `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  tone(8, 1000);
  delay(1000);
  noTone(8);
  delay(1000);
}`,
        "servo-sweep": `#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9);
}

void loop() {
  myServo.write(0);
  delay(1000);
  myServo.write(90);
  delay(1000);
  myServo.write(180);
  delay(1000);
}`,
        "blank-sketch": `void setup() {

}

void loop() {

}`,
    };

    const projectInfo = {
        "blink-led": {
            name: "Blink an LED",
            goal: "Learn Digital Output.",
            objective: "Understand HIGH and LOW signals.",
            components: ["breadboard", "led", "resistor"],
        },
        "read-push-button": {
            name: "Read a Push Button",
            goal: "Learn Digital Input.",
            objective: "Understand pressed and released button states.",
            components: ["breadboard", "push-button"],
        },
        "button-led-control": {
            name: "Control an LED with a Button",
            goal: "Combine Digital Input and Output.",
            objective: "Use a button decision to control an LED output.",
            components: ["push-button", "led", "resistor"],
        },
        "read-potentiometer": {
            name: "Control LED Brightness",
            goal: "Learn Analog Input.",
            objective: "Use a knob reading to control output brightness.",
            components: ["breadboard", "led", "resistor", "potentiometer"],
        },
        "rotate-servo": {
            name: "Rotate a Servo",
            goal: "Learn Servo Position Control.",
            objective: "Understand how a control signal sets a servo angle.",
            components: ["servo-motor"],
        },
        "buzzer-tone": {
            name: "Play a Tone",
            goal: "Learn Sound Output.",
            objective: "Understand that a pin can create simple tones.",
            components: ["breadboard", "buzzer"],
        },
        "measure-light": {
            name: "Measure Light with an LDR",
            goal: "Learn Light Sensing.",
            objective: "Understand how brightness can become an analog reading.",
            components: ["ldr", "resistor"],
        },
        "measure-temperature": {
            name: "Measure Temperature",
            goal: "Learn Temperature Monitoring.",
            objective: "Understand how heat can become a voltage and an analog reading.",
            components: ["temperature-sensor"],
        },
        "measure-distance": {
            name: "Measure Distance with an Ultrasonic Sensor",
            goal: "Learn Distance Sensing.",
            objective: "Understand trigger and echo based measurement preparation.",
            components: ["ultrasonic-sensor"],
        },
    };

    // Guided project IDs and starter sketch IDs are intentionally separate so
    // future projects can reuse the same sketch pattern without duplicating code.
    const projectSketchMap = {
        "blink-led": "blink-led",
        "read-push-button": "read-button",
        "read-potentiometer": "read-potentiometer",
        "measure-light": "read-ldr",
        "measure-temperature": "read-temperature",
        "measure-distance": "read-ultrasonic",
        "buzzer-tone": "buzzer-tone",
        "rotate-servo": "servo-sweep",
    };

    const breadboardDefaultPositions = {
        led: { x: 70, y: 66 },
        resistor: { x: 218, y: 80 },
        "push-button": { x: 182, y: 130 },
        potentiometer: { x: 306, y: 196 },
        buzzer: { x: 194, y: 124 },
    };

    const breadboardSnap = {
        left: 54,
        top: 64,
        width: 392,
        height: 270,
        column: 28,
        row: 26,
    };

    function step(pin, device, terminal, instruction, color, reason) {
        return { pin, device, terminal, instruction, color, reason };
    }

    function currentMode() {
        return document.querySelector("input[name='learning-mode']:checked")?.value || "guided";
    }

    function setCoach(message, detailHtml = "<p>Choose a Guided Lab project or switch to Free Build to select devices manually.</p>") {
        if (coachMessage) {
            coachMessage.textContent = message;
        }

        if (coachDetails) {
            coachDetails.innerHTML = detailHtml;
        }
    }

    function setWorkspaceMessage(primary, secondary = "") {
        if (!workspaceEmptyMessage) {
            return;
        }

        workspaceEmptyMessage.innerHTML = secondary
            ? `${primary}<small>${secondary}</small>`
            : primary;
    }

    function syncModePanels() {
        const isFree = currentMode() === "free";
        if (backToLessonsButton) {
            backToLessonsButton.hidden = !isFree;
        }
        if (!isFree && leaveFreeBuildDialog) {
            leaveFreeBuildDialog.hidden = true;
        }
        if (!isFree && clearFreeBuildDialog) {
            clearFreeBuildDialog.hidden = true;
        }
        if (coachCard) {
            coachCard.hidden = isFree;
        }
        if (wiringCard) {
            wiringCard.hidden = isFree;
        }
        if (freeBuildHelpCard) {
            freeBuildHelpCard.hidden = !isFree;
        }
        updateFreeBuildWireStatus();
        updateFreeBuildSaveStatus();
        syncLessonComponentSummary();
        syncProgressivePanels();
    }

    function freeBuildHasWorkspace() {
        return selectedDevices.size > 0 || manualConnections.length > 0;
    }

    function returnToLessonsFromFreeBuild() {
        if (leaveFreeBuildDialog) {
            leaveFreeBuildDialog.hidden = true;
        }
        setModeValue("guided");
        applyMode("guided");
    }

    function requestReturnToLessons() {
        if (currentMode() !== "free") {
            returnToLessonsFromFreeBuild();
            return;
        }

        if (freeBuildDirty) {
            if (leaveFreeBuildDialog) {
                leaveFreeBuildDialog.hidden = false;
            }
            return;
        }

        returnToLessonsFromFreeBuild();
    }

    function hasSavedFreeBuild() {
        try {
            return Boolean(window.localStorage.getItem(freeBuildStorageKey));
        } catch (error) {
            return false;
        }
    }

    function setFreeBuildDirty(isDirty = true) {
        if (currentMode() !== "free") {
            return;
        }

        freeBuildDirty = Boolean(isDirty);
        updateFreeBuildSaveStatus();
    }

    function updateFreeBuildSaveStatus(message = "") {
        if (!freeBuildSaveStatus) {
            return;
        }

        freeBuildSaveStatus.classList.remove("saved", "unsaved");
        if (message) {
            freeBuildSaveStatus.textContent = message;
            return;
        }

        if (freeBuildDirty) {
            freeBuildSaveStatus.textContent = "Unsaved Changes";
            freeBuildSaveStatus.classList.add("unsaved");
            return;
        }

        if (hasSavedFreeBuild()) {
            freeBuildSaveStatus.textContent = "Saved";
            freeBuildSaveStatus.classList.add("saved");
            return;
        }

        freeBuildSaveStatus.textContent = "No Saved Build";
    }

    function endpointFromPoint(point) {
        if (point.type === "pin") {
            return { type: "pin", name: point.name };
        }

        return {
            type: "terminal",
            device: point.device,
            terminal: point.terminal,
        };
    }

    function endpointElement(endpoint) {
        if (!endpoint) {
            return null;
        }

        if (endpoint.type === "pin") {
            return document.querySelector(`[data-pin="${endpoint.name}"]`);
        }

        return findTerminal(endpoint.device, endpoint.terminal);
    }

    function freeBuildSnapshot() {
        return {
            version: 1,
            savedAt: new Date().toISOString(),
            components: Array.from(selectedDevices),
            componentPositions: Array.from(breadboardComponentPositions.entries()).map(([device, position]) => ({
                device,
                x: position.x,
                y: position.y,
                scale: Number(position.scale || 1),
            })),
            connections: manualConnections.map((connection) => ({
                from: connection.fromPoint || null,
                to: connection.toPoint || null,
                fromLabel: connection.from,
                toLabel: connection.to,
            })),
            usbConnected,
            sketch: sketchSelect?.value || "blank-sketch",
            code: codeEditor?.value || "",
            serialOutput: serialMonitorOutput?.textContent || "Serial output will appear here.",
            output: {
                pin: statusActivePin?.textContent || "None",
                mode: statusCurrentSketch?.textContent || "None",
                state: statusPinState?.textContent || "N/A",
                led: statusLedState?.textContent || "OFF",
                button: statusButtonState?.textContent || "N/A",
                buzzer: statusBuzzerState?.textContent || "N/A",
                tone: statusToneFrequency?.textContent || "N/A",
                analog: statusAnalogValue?.textContent || "N/A",
                voltage: statusVoltage?.textContent || "N/A",
            },
        };
    }

    function saveFreeBuildWorkspace({ silent = false } = {}) {
        if (currentMode() !== "free") {
            return false;
        }

        try {
            window.localStorage.setItem(freeBuildStorageKey, JSON.stringify(freeBuildSnapshot()));
            freeBuildDirty = false;
            updateFreeBuildSaveStatus();
            if (!silent) {
                setCoach("Free Build saved.", "<p>You can load this workspace later from Free Build.</p>");
            }
            return true;
        } catch (error) {
            updateFreeBuildSaveStatus("Save Failed");
            setCoach("Save failed.", "<p>Your browser could not save this Free Build workspace.</p>");
            return false;
        }
    }

    function restoreFreeBuildOutput(snapshot) {
        if (statusActivePin) statusActivePin.textContent = snapshot.output?.pin || "None";
        if (statusCurrentSketch) statusCurrentSketch.textContent = snapshot.output?.mode || "None";
        if (statusPinState) statusPinState.textContent = snapshot.output?.state || "N/A";
        if (statusLedState) statusLedState.textContent = snapshot.output?.led || "OFF";
        if (statusButtonState) statusButtonState.textContent = snapshot.output?.button || "N/A";
        if (statusBuzzerState) statusBuzzerState.textContent = snapshot.output?.buzzer || "N/A";
        if (statusToneFrequency) statusToneFrequency.textContent = snapshot.output?.tone || "N/A";
        if (statusAnalogValue) statusAnalogValue.textContent = snapshot.output?.analog || "N/A";
        if (statusVoltage) statusVoltage.textContent = snapshot.output?.voltage || "N/A";
        if (serialMonitorOutput) {
            serialMonitorOutput.textContent = snapshot.serialOutput || "Serial output will appear here.";
        }
    }

    function redrawFreeBuildConnections(connections = []) {
        clearWireLayer();
        manualConnections = [];

        connections.forEach((connection) => {
            const fromElement = endpointElement(connection.from);
            const toElement = endpointElement(connection.to);
            if (!fromElement || !toElement) {
                return;
            }

            drawWire(fromElement, toElement, "green");
            fromElement.classList.add("connected-target");
            toElement.classList.add("connected-target");
            manualConnections.push({
                from: connection.fromLabel || pointLabel({ ...connection.from, element: fromElement }),
                to: connection.toLabel || pointLabel({ ...connection.to, element: toElement }),
                fromPoint: connection.from,
                toPoint: connection.to,
            });
        });

        updateFreeBuildWireStatus();
    }

    function loadSavedFreeBuildWorkspace() {
        if (currentMode() !== "free") {
            return;
        }

        let snapshot = null;
        try {
            snapshot = JSON.parse(window.localStorage.getItem(freeBuildStorageKey) || "null");
        } catch (error) {
            snapshot = null;
        }

        if (!snapshot) {
            updateFreeBuildSaveStatus("No Saved Build");
            setCoach("No saved build.", "<p>Save a Free Build workspace before loading.</p>");
            return;
        }

        selectedDevices.clear();
        breadboardComponentPositions.clear();
        (snapshot.components || []).forEach((deviceKey) => {
            if (deviceInfo[deviceKey]) {
                selectedDevices.add(deviceKey);
            }
        });
        (snapshot.componentPositions || []).forEach((position) => {
            if (position?.device && typeof position.x === "number" && typeof position.y === "number") {
                const snapped = snapBreadboardPosition(position.device, position);
                setBreadboardPosition(position.device, { ...snapped, scale: Number(position.scale || 1) });
            }
        });
        renderSelectedDevices();
        syncDeviceHighlights();

        if (sketchSelect && snapshot.sketch) {
            sketchSelect.value = snapshot.sketch;
        }
        if (codeEditor && typeof snapshot.code === "string") {
            codeEditor.value = snapshot.code;
            editorEdited = true;
            detectedBehavior = detectBehavior(codeEditor.value).label;
        }

        usbConnected = Boolean(snapshot.usbConnected);
        if (usbCable) {
            usbCable.hidden = !usbConnected;
        }
        syncUsbVisual();
        updateStatusPill(usbStatus, usbConnected ? "USB Connected" : "Not Connected", !usbConnected);
        if (connectUsbButton) {
            connectUsbButton.textContent = usbConnected ? "USB Connected" : "Connect USB";
            connectUsbButton.classList.toggle("connected", usbConnected);
            connectUsbButton.disabled = usbConnected;
        }

        restoreFreeBuildOutput(snapshot);
        redrawFreeBuildConnections(snapshot.connections || []);
        freeBuildDirty = false;
        updateCodeStatusPanel();
        updateSimulationControls();
        updateFreeBuildSaveStatus("Saved");
        setCoach("Saved build loaded.", "<p>Your Free Build components, wires, code, and USB state were restored.</p>");
    }

    function clearFreeBuildWorkspace({ skipConfirmation = false } = {}) {
        if (currentMode() !== "free") {
            return;
        }

        if (!skipConfirmation) {
            if (clearFreeBuildDialog) {
                clearFreeBuildDialog.hidden = false;
            }
            return;
        }

        if (clearFreeBuildDialog) {
            clearFreeBuildDialog.hidden = true;
        }
        selectedDevices.clear();
        breadboardComponentPositions.clear();
        manualConnections = [];
        renderSelectedDevices();
        clearWiringState();
        clearFreeBuildSelection();
        resetOutputPanelToEmpty();
        syncDeviceHighlights();
        updateFreeBuildWireStatus();
        updateSimulationControls();
        setFreeBuildDirty(true);
        setCoach("Free Build cleared.", "<p>The sandbox is empty and ready for new parts.</p>");
    }

    function syncLessonComponentSummary() {
        if (!lessonComponentSummary || !lessonComponentList) {
            return;
        }

        const shouldShow = currentMode() === "guided"
            && Boolean(activeProject)
            && Boolean(projectInfo[activeProject]?.components?.length);

        lessonComponentSummary.hidden = !shouldShow;
        lessonComponentList.innerHTML = "";

        if (!shouldShow) {
            return;
        }

        projectInfo[activeProject].components.forEach((deviceKey) => {
            const item = document.createElement("li");
            item.textContent = deviceInfo[deviceKey]?.name || deviceKey;
            lessonComponentList.appendChild(item);
        });
    }

    function syncProgressivePanels() {
        const isFree = currentMode() === "free";
        const hasLesson = Boolean(activeLessonKey);
        const isMeetBoard = activeLessonKey === "meet-board";
        const wiringComplete = isGuidedWiringComplete();
        const expectedBehavior = expectedBehaviorForLesson();
        const uploadedForLesson = Boolean(expectedBehavior && uploadedBehavior === expectedBehavior);
        const lessonComplete = isMeetBoard
            ? boardIntroCompleted
            : Boolean(activeProject && lessonObserved && uploadedForLesson);

        if (labControlsPanel) {
            labControlsPanel.dataset.stage = isFree
                ? "free-build"
                : !hasLesson
                    ? "welcome"
                    : lessonComplete
                        ? "complete"
                        : isMeetBoard
                            ? "board-tour"
                            : !wiringComplete
                                ? "wiring"
                                : !usbConnected
                                    ? "usb"
                                    : !uploadedForLesson
                                        ? "upload"
                                        : "run";
        }

        if (coachCard) {
            coachCard.hidden = isFree ? true : false;
        }
        if (wiringCard) {
            wiringCard.hidden = isFree || !hasLesson;
        }
        if (usbCard) {
            usbCard.hidden = !isFree && (!activeProject || !wiringComplete || lessonComplete);
        }
        if (codeStudioCard) {
            codeStudioCard.hidden = isFree ? false : !(isCodeLesson() && usbConnected && !lessonComplete);
        }
        if (simulationCard) {
            simulationCard.hidden = !isFree && (!activeProject || !uploadedForLesson || lessonComplete);
        }
        if (outputCard) {
            outputCard.hidden = !isFree && !lessonObserved;
        }
        if (freeBuildHelpCard) {
            freeBuildHelpCard.hidden = !isFree;
        }
        if (workspaceControlsCard) {
            workspaceControlsCard.hidden = !isFree;
        }
        if (guidedClearWorkspaceButton) {
            guidedClearWorkspaceButton.hidden = isFree || !hasLesson || (!selectedDevices.size && !lessonComplete);
        }
    }

    function selectBoardIntro() {
        setWorkspaceMessage("Select a lesson to begin.");
        activeLessonKey = "meet-board";
        boardIntroCompleted = false;
        lessonObserved = false;
        meetBoardStepIndex = 0;
        activeProject = null;
        selectedDevices.clear();
        breadboardComponentPositions.clear();
        clearWiringState();
        resetOutputPanelToEmpty();
        renderSelectedDevices();
        syncDeviceHighlights();
        syncProjectHighlights();
        boardIntroButtons.forEach((button) => button.classList.add("active"));
        if (libraryPanelTitle) {
            libraryPanelTitle.textContent = "Arduino Lessons";
        }
        syncModePanels();
        updateMeetBoardHighlight();
        renderLessonTasks();
        updateCodeStudioState("Meet the Board does not need code.");
    }

    function setInitialLessonState() {
        activeProject = null;
        activeLessonKey = null;
        boardIntroCompleted = false;
        lessonObserved = false;
        meetBoardStepIndex = 0;
        selectedPin = null;
        currentStepIndex = 0;
        completedConnections = [];
        manualConnections = [];
        selectedDevices.clear();
        breadboardComponentPositions.clear();
        clearWireLayer();
        clearHighlights();
        clearFreeBuildSelection();
        resetUsbStatus();
        resetOutputPanelToEmpty();
        renderSelectedDevices();
        syncDeviceHighlights();
        syncProjectHighlights();
        clearBoardIntroHighlight();
        setModeValue("guided");

        if (guidedProjectLibrary) {
            guidedProjectLibrary.hidden = false;
        }

        if (freeBuildDeviceLibrary) {
            freeBuildDeviceLibrary.hidden = true;
        }

        if (libraryPanelTitle) {
            libraryPanelTitle.textContent = "Arduino Lessons";
        }

        freeBuildTab?.classList.remove("active");
        syncModePanels();
        renderLessonTasks();
        updateCodeStudioState("Choose a lesson before using Code Studio.");
        updateSimulationControls();
        setCoach(
            "Choose a lesson from the left panel to start learning.",
            "<p>Select a lesson when you are ready.</p>",
        );
    }

    function clearBoardIntroHighlight() {
        boardIntroButtons.forEach((button) => button.classList.remove("active"));
    }

    function setModeValue(mode) {
        const input = document.querySelector(`input[name='learning-mode'][value='${mode}']`);
        if (input) {
            input.checked = true;
        }
        modeOptions.forEach((option) => {
            option.classList.toggle("active", option.querySelector("input")?.value === mode);
        });
    }

    function normalizePinLabel(label) {
        return label.replace("~", "").trim();
    }

    function pinType(pinName) {
        if (/^D\d+$/.test(pinName)) {
            return pinName === "D13" ? "Digital Output" : "Digital Input / Output";
        }
        if (/^A\d+$/.test(pinName)) {
            return "Analog Input";
        }
        if (pinName === "3.3V" || pinName === "5V") {
            return "Power Output";
        }
        if (pinName === "GND") {
            return "Ground Reference";
        }
        if (pinName === "VIN") {
            return "External Power Input";
        }
        return "Board Pin";
    }

    function pinUses(pinName) {
        if (pinName === "D13") {
            return ["Blink LED", "Digital Output", "LED projects"];
        }
        if (pinName === "D2") {
            return ["Read Push Button", "Digital Input", "Switch projects"];
        }
        if (pinName === "D8") {
            return ["Play a Tone", "Buzzer projects", "Digital Output"];
        }
        if (pinName === "A0") {
            return ["Potentiometer input", "Sensor readings", "Analog values"];
        }
        if (pinName === "5V" || pinName === "3.3V") {
            return ["Power sensors", "Power small modules", "Reference voltage"];
        }
        if (pinName === "GND") {
            return ["Complete circuits", "Common reference", "Return path"];
        }
        if (pinName === "VIN") {
            return ["External power", "Bench supply input", "Battery projects"];
        }
        return ["Beginner projects", "Wiring practice", "Arduino experiments"];
    }

    function currentPinState(pinName) {
        if (pinName === "D13") {
            return blinkPinHigh ? "HIGH" : "LOW";
        }
        if (pinName === "D2" && (activeSimulation === "read-button" || uploadedBehavior === "read-button")) {
            return buttonPressed ? "LOW" : "HIGH";
        }
        if (pinName === "D8" && (activeSimulation === "buzzer-tone" || uploadedBehavior === "buzzer-tone")) {
            return buzzerOn ? "HIGH" : "LOW";
        }
        if (pinName === "A0" && (activeSimulation === "read-potentiometer" || uploadedBehavior === "read-potentiometer")) {
            return `${potentiometerValue}`;
        }
        return "LOW";
    }

    function compactTooltipHtml(title, rows = []) {
        const rowHtml = rows
            .filter((row) => row.value)
            .map((row) => `<p><strong>${row.label}:</strong> ${row.value}</p>`)
            .join("");
        return `<strong>${title}</strong>${rowHtml}`;
    }

    function showBoardTooltip(target, html) {
        if (!boardTooltip || !arduinoBoard) {
            return;
        }

        const boardRect = arduinoBoard.getBoundingClientRect();
        const rect = target.getBoundingClientRect();
        boardTooltip.innerHTML = html;
        boardTooltip.hidden = false;
        boardTooltip.style.left = `${Math.min(Math.max(rect.left - boardRect.left + rect.width / 2, 130), boardRect.width - 130)}px`;
        boardTooltip.style.top = `${Math.max(rect.top - boardRect.top - 12, 16)}px`;
    }

    function hideBoardTooltip() {
        if (boardTooltip) {
            boardTooltip.hidden = true;
        }
    }

    function tooltipForPin(pinName) {
        return compactTooltipHtml(`Pin ${pinName}`, [
            { label: "Type", value: pinType(pinName) },
            { label: "Current State", value: currentPinState(pinName) },
            { label: "Common Uses", value: pinUses(pinName).join(", ") },
        ]);
    }

    function tooltipForBoardPart(partKey) {
        const info = boardPartInfo[partKey];
        if (!info) {
            return "";
        }

        const state = partKey === "usb"
            ? (usbConnected ? "Connected" : "Disconnected")
            : partKey === "built-in-led"
                ? (blinkPinHigh ? "ON" : "OFF")
                : null;

        return compactTooltipHtml(info.title, [
            { label: "Type", value: info.type },
            { label: "Current State", value: state },
            { label: "Common Uses", value: info.uses.join(", ") },
        ]);
    }

    function updateMeetBoardHighlight() {
        document.querySelectorAll("[data-board-part]").forEach((part) => {
            part.classList.remove("meet-board-active", "meet-board-complete");
        });

        if (activeLessonKey !== "meet-board" || boardIntroCompleted) {
            return;
        }

        meetBoardSequence.forEach((partKey, index) => {
            document.querySelectorAll(`[data-board-part="${partKey}"]`).forEach((part) => {
                part.classList.toggle("meet-board-complete", index < meetBoardStepIndex);
                part.classList.toggle("meet-board-active", index === meetBoardStepIndex);
            });
        });
    }

    function advanceMeetBoardStep(partKey) {
        if (activeLessonKey !== "meet-board" || boardIntroCompleted) {
            return;
        }

        const expectedPart = meetBoardSequence[meetBoardStepIndex];
        if (partKey !== expectedPart) {
            setCoach(`Find ${boardPartInfo[expectedPart]?.title || "the highlighted part"} first.`, "");
            return;
        }

        const selectedInfo = boardPartInfo[partKey];
        meetBoardStepIndex += 1;
        if (meetBoardStepIndex >= meetBoardSequence.length) {
            boardIntroCompleted = true;
        }
        updateMeetBoardHighlight();
        renderLessonTasks();
        if (selectedInfo) {
            setCoach(selectedInfo.title, `<p>${selectedInfo.type}. ${selectedInfo.uses[0]}.</p>`);
        }
    }

    function setupBoardParts() {
        document.querySelectorAll("[data-board-part]").forEach((part) => {
            if (part.dataset.pin) {
                return;
            }

            const partKey = part.dataset.boardPart;
            part.tabIndex = part.tabIndex >= 0 ? part.tabIndex : 0;
            part.setAttribute("role", partKey === "reset" ? "button" : "button");
            part.addEventListener("mouseenter", () => showBoardTooltip(part, tooltipForBoardPart(partKey)));
            part.addEventListener("focus", () => showBoardTooltip(part, tooltipForBoardPart(partKey)));
            part.addEventListener("mouseleave", hideBoardTooltip);
            part.addEventListener("blur", hideBoardTooltip);
            part.addEventListener("click", (event) => {
                event.stopPropagation();
                if (partKey === "reset") {
                    resetFromBoardButton();
                    return;
                }
                advanceMeetBoardStep(partKey);
            });
            if (partKey === "digital-pins" || partKey === "analog-pins" || partKey === "power-pins") {
                part.addEventListener("click", (event) => {
                    if (activeLessonKey !== "meet-board" || boardIntroCompleted) {
                        return;
                    }
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    advanceMeetBoardStep(partKey);
                }, true);
            }
            part.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    part.click();
                }
            });
        });
    }

    function setupBoardPins() {
        document.querySelectorAll(".pin-row span").forEach((pin) => {
            const pinName = normalizePinLabel(pin.textContent);
            pin.dataset.pin = pinName;
            pin.dataset.boardPart = pinName.startsWith("D")
                ? "digital-pins"
                : pinName.startsWith("A")
                    ? "analog-pins"
                    : "power-pins";
            pin.tabIndex = 0;
            pin.setAttribute("role", "button");
            pin.setAttribute("aria-label", `Arduino pin ${pinName}`);
            pin.addEventListener("mouseenter", () => showBoardTooltip(pin, tooltipForPin(pinName)));
            pin.addEventListener("focus", () => showBoardTooltip(pin, tooltipForPin(pinName)));
            pin.addEventListener("mouseleave", hideBoardTooltip);
            pin.addEventListener("blur", hideBoardTooltip);
            pin.addEventListener("click", () => {
                handlePinSelect(pinName, pin);
                advanceMeetBoardStep(pin.dataset.boardPart);
            });
            pin.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handlePinSelect(pinName, pin);
                    advanceMeetBoardStep(pin.dataset.boardPart);
                }
            });
        });
    }

    function showComponentInfo(deviceKey) {
        const info = deviceInfo[deviceKey];

        if (!info) {
            return;
        }

        setCoach(`Selected Component: ${info.name}`, `
            <p><strong>Purpose:</strong> ${info.purpose || info.description}</p>
            <p><strong>Connections:</strong> ${info.connections || "Connection details will be introduced in the wiring stage."}</p>
            <p><strong>Typical Use:</strong> ${info.uses || info.description}</p>
        `);
    }

    function syncDeviceHighlights() {
        deviceButtons.forEach((button) => {
            const isArduino = button.dataset.device === "arduino-uno";
            button.classList.toggle("active", isArduino || selectedDevices.has(button.dataset.device));
        });
    }

    function syncProjectHighlights() {
        projectButtons.forEach((button) => {
            button.classList.toggle("active", button.dataset.project === activeProject);
        });
    }

    function createTerminalButton(deviceKey, terminal) {
        const button = document.createElement("button");
        button.className = "component-terminal";
        button.type = "button";
        button.textContent = terminal.label;
        button.dataset.device = deviceKey;
        button.dataset.terminal = terminal.id;
        button.setAttribute("aria-label", `${deviceInfo[deviceKey].name} ${terminal.label} terminal`);
        button.addEventListener("click", () => handleTerminalSelect(deviceKey, terminal.id, button));
        button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleTerminalSelect(deviceKey, terminal.id, button);
            }
        });
        return button;
    }

    function draggableBreadboardDevice(deviceKey) {
        return ["led", "resistor", "push-button", "potentiometer", "buzzer"].includes(deviceKey);
    }

    function getBreadboardPosition(deviceKey) {
        const current = breadboardComponentPositions.get(deviceKey);
        if (current) {
            return { ...current };
        }

        return { ...(breadboardDefaultPositions[deviceKey] || { x: 150, y: 130 }) };
    }

    function setBreadboardPosition(deviceKey, position) {
        const current = breadboardComponentPositions.get(deviceKey) || {};
        breadboardComponentPositions.set(deviceKey, {
            x: Math.round(position.x),
            y: Math.round(position.y),
            scale: Number(position.scale || current.scale || 1),
        });
    }

    function componentBounds(deviceKey, position) {
        const sizes = {
            led: { width: 116, height: 124 },
            resistor: { width: 164, height: 88 },
            "push-button": { width: 118, height: 118 },
            potentiometer: { width: 126, height: 126 },
            buzzer: { width: 120, height: 120 },
        };
        const size = sizes[deviceKey] || { width: 120, height: 100 };
        const scale = Number(position.scale || breadboardComponentPositions.get(deviceKey)?.scale || 1);
        return {
            left: position.x,
            top: position.y,
            right: position.x + size.width * scale,
            bottom: position.y + size.height * scale,
            width: size.width * scale,
            height: size.height * scale,
        };
    }

    function boundsOverlap(a, b, gap = 12) {
        return !(a.right + gap <= b.left || b.right + gap <= a.left || a.bottom + gap <= b.top || b.bottom + gap <= a.top);
    }

    function snapBreadboardPosition(deviceKey, rawPosition) {
        const bounds = componentBounds(deviceKey, { x: 0, y: 0 });
        const maxX = breadboardSnap.left + breadboardSnap.width - bounds.width;
        const maxY = breadboardSnap.top + breadboardSnap.height - bounds.height;
        const snapped = {
            x: breadboardSnap.left + Math.round((rawPosition.x - breadboardSnap.left) / breadboardSnap.column) * breadboardSnap.column,
            y: breadboardSnap.top + Math.round((rawPosition.y - breadboardSnap.top) / breadboardSnap.row) * breadboardSnap.row,
        };

        return {
            x: Math.max(breadboardSnap.left, Math.min(maxX, snapped.x)),
            y: Math.max(breadboardSnap.top, Math.min(maxY, snapped.y)),
        };
    }

    function validBreadboardPlacement(deviceKey, position) {
        const currentBounds = componentBounds(deviceKey, position);
        return Array.from(breadboardComponentPositions.entries()).every(([otherDevice, otherPosition]) => {
            if (otherDevice === deviceKey || !selectedDevices.has(otherDevice)) {
                return true;
            }

            return !boundsOverlap(currentBounds, componentBounds(otherDevice, otherPosition));
        });
    }

    function firstOpenBreadboardPosition(deviceKey) {
        const preferred = snapBreadboardPosition(deviceKey, getBreadboardPosition(deviceKey));
        if (validBreadboardPlacement(deviceKey, preferred)) {
            return preferred;
        }

        for (let y = breadboardSnap.top; y <= breadboardSnap.top + breadboardSnap.height; y += breadboardSnap.row) {
            for (let x = breadboardSnap.left; x <= breadboardSnap.left + breadboardSnap.width; x += breadboardSnap.column) {
                const candidate = snapBreadboardPosition(deviceKey, { x, y });
                if (validBreadboardPlacement(deviceKey, candidate)) {
                    return candidate;
                }
            }
        }

        return preferred;
    }

    function placeBreadboardCard(card, deviceKey) {
        const position = getBreadboardPosition(deviceKey);
        card.style.left = `${position.x}px`;
        card.style.top = `${position.y}px`;
        card.style.setProperty("--component-scale", String(position.scale || 1));
        card.dataset.breadboardX = String(position.x);
        card.dataset.breadboardY = String(position.y);
        card.dataset.componentScale = String(position.scale || 1);
    }

    function redrawWiresForCurrentLayout() {
        clearWireLayer();

        completedConnections.forEach((connection, index) => {
            const pinElement = document.querySelector(`[data-pin="${connection.pin}"]`);
            const terminalElement = findTerminal(connection.device, connection.terminal);
            if (pinElement && terminalElement) {
                drawWire(pinElement, terminalElement, connection.color, index);
            }
        });

        manualConnections.forEach((connection, index) => {
            const fromElement = endpointElement(connection.fromPoint);
            const toElement = endpointElement(connection.toPoint);
            if (fromElement && toElement) {
                drawWire(fromElement, toElement, "green", index);
            }
        });
    }

    function updateBreadboardDragFeedback(zone, candidate, valid) {
        zone.querySelectorAll(".breadboard-holes i").forEach((hole) => {
            hole.classList.toggle("snap-preview", valid);
            hole.classList.toggle("snap-invalid", !valid);
        });
        zone.style.setProperty("--snap-x", `${candidate.x}px`);
        zone.style.setProperty("--snap-y", `${candidate.y}px`);
    }

    function startBreadboardDrag(event, card, deviceKey) {
        if (!draggableBreadboardDevice(deviceKey) || event.button !== 0) {
            return;
        }

        if (event.target.closest(".component-terminal, .remove-device-button, .component-resize-handle")) {
            return;
        }

        const zone = card.closest(".lesson-breadboard-zone");
        if (!zone) {
            return;
        }

        const zoneRect = zone.getBoundingClientRect();
        const startPosition = getBreadboardPosition(deviceKey);
        const cardRect = card.getBoundingClientRect();
        activeComponentDrag = {
            card,
            deviceKey,
            zone,
            zoneRect,
            startPosition,
            offsetX: event.clientX - cardRect.left,
            offsetY: event.clientY - cardRect.top,
        };
        card.classList.add("dragging");
        zone.classList.add("dragging-component");
        card.setPointerCapture?.(event.pointerId);
        event.preventDefault();
    }

    function moveBreadboardDrag(event) {
        if (!activeComponentDrag) {
            return;
        }

        const { card, deviceKey, zoneRect, offsetX, offsetY, zone } = activeComponentDrag;
        const rawPosition = {
            x: event.clientX - zoneRect.left - offsetX,
            y: event.clientY - zoneRect.top - offsetY,
        };
        const candidate = snapBreadboardPosition(deviceKey, rawPosition);
        const valid = validBreadboardPlacement(deviceKey, candidate);
        card.style.left = `${candidate.x}px`;
        card.style.top = `${candidate.y}px`;
        card.classList.toggle("invalid-drop", !valid);
        updateBreadboardDragFeedback(zone, candidate, valid);
        redrawWiresForCurrentLayout();
    }

    function endBreadboardDrag(event) {
        if (!activeComponentDrag) {
            return;
        }

        const { card, deviceKey, startPosition, zone } = activeComponentDrag;
        const candidate = {
            x: Number(card.style.left.replace("px", "")),
            y: Number(card.style.top.replace("px", "")),
        };
        const valid = validBreadboardPlacement(deviceKey, candidate);
        const finalPosition = valid ? candidate : startPosition;

        setBreadboardPosition(deviceKey, finalPosition);
        placeBreadboardCard(card, deviceKey);
        card.classList.remove("dragging", "invalid-drop");
        zone.classList.remove("dragging-component");
        zone.querySelectorAll(".breadboard-holes i").forEach((hole) => {
            hole.classList.remove("snap-preview", "snap-invalid");
        });
        card.releasePointerCapture?.(event.pointerId);
        activeComponentDrag = null;
        redrawWiresForCurrentLayout();

        if (!valid) {
            markTemporaryError(card);
            setCoach("Choose an open breadboard area.", "<p>Components cannot overlap. Try another row or column.</p>");
            return;
        }

        setFreeBuildDirty(currentMode() === "free" || freeBuildDirty);
    }

    function startComponentResize(event, card, deviceKey) {
        if (!draggableBreadboardDevice(deviceKey) || event.button !== 0) {
            return;
        }

        const current = getBreadboardPosition(deviceKey);
        activeComponentResize = {
            card,
            deviceKey,
            handle: event.currentTarget,
            startX: event.clientX,
            startY: event.clientY,
            startScale: Number(current.scale || 1),
            startPosition: current,
        };
        card.classList.add("resizing");
        event.currentTarget.setPointerCapture?.(event.pointerId);
        event.preventDefault();
        event.stopPropagation();
    }

    function moveComponentResize(event) {
        if (!activeComponentResize) {
            return;
        }

        const { card, deviceKey, startScale, startX, startY, startPosition } = activeComponentResize;
        const delta = Math.max(event.clientX - startX, event.clientY - startY);
        const nextScale = Math.max(0.72, Math.min(1.35, startScale + delta / 180));
        const nextPosition = { ...startPosition, scale: Number(nextScale.toFixed(2)) };
        const valid = validBreadboardPlacement(deviceKey, nextPosition);
        card.style.setProperty("--component-scale", String(nextPosition.scale));
        card.dataset.componentScale = String(nextPosition.scale);
        card.classList.toggle("invalid-drop", !valid);
        redrawWiresForCurrentLayout();
    }

    function endComponentResize(event) {
        if (!activeComponentResize) {
            return;
        }

        const { card, deviceKey, handle, startPosition } = activeComponentResize;
        const nextScale = Number(card.dataset.componentScale || startPosition.scale || 1);
        const nextPosition = { ...startPosition, scale: nextScale };
        const finalPosition = validBreadboardPlacement(deviceKey, nextPosition) ? nextPosition : startPosition;
        setBreadboardPosition(deviceKey, finalPosition);
        placeBreadboardCard(card, deviceKey);
        card.classList.remove("resizing", "invalid-drop");
        handle?.releasePointerCapture?.(event.pointerId);
        activeComponentResize = null;
        redrawWiresForCurrentLayout();
        setFreeBuildDirty(currentMode() === "free" || freeBuildDirty);
    }

    function createDeviceCard(deviceKey) {
        const info = deviceInfo[deviceKey];
        const card = document.createElement("article");
        const componentButton = document.createElement("button");
        const visual = document.createElement("span");
        const label = document.createElement("span");
        const terminalList = document.createElement("div");
        const removeButton = document.createElement("button");
        const resizeHandle = document.createElement("button");

        card.className = "bench-component";
        card.dataset.selectedDevice = deviceKey;
        if (draggableBreadboardDevice(deviceKey)) {
            card.dataset.draggableComponent = "true";
            card.addEventListener("pointerdown", (event) => startBreadboardDrag(event, card, deviceKey));
            card.addEventListener("pointermove", moveBreadboardDrag);
            card.addEventListener("pointerup", endBreadboardDrag);
            card.addEventListener("pointercancel", endBreadboardDrag);
        }

        componentButton.className = "bench-component-button";
        componentButton.type = "button";
        componentButton.setAttribute("aria-label", `Select ${info.name} information`);
        componentButton.addEventListener("click", () => showComponentInfo(deviceKey));

        visual.className = `device-visual visual-${info.visual}`;
        visual.setAttribute("aria-hidden", "true");

        label.className = "bench-component-label";
        label.textContent = info.name;

        terminalList.className = "component-terminal-list";
        (info.terminals || []).forEach((terminal) => {
            terminalList.appendChild(createTerminalButton(deviceKey, terminal));
        });

        removeButton.className = "remove-device-button";
        removeButton.type = "button";
        removeButton.textContent = "×";
        removeButton.setAttribute("aria-label", `Remove ${info.name} from workspace`);
        removeButton.addEventListener("click", () => {
            selectedDevices.delete(deviceKey);
            breadboardComponentPositions.delete(deviceKey);
            renderSelectedDevices();
            clearWiringState();
            syncDeviceHighlights();
            setFreeBuildDirty(true);
            if (activeProject && projectInfo[activeProject]?.components.includes(deviceKey)) {
                setCoach(`${info.name} removed.`, "<p>This component is required for this project. Add it again to continue.</p>");
                return;
            }

            setCoach(`${info.name} removed from the workspace.`, "<p>The Arduino Uno remains visible.</p>");
        });

        resizeHandle.className = "component-resize-handle";
        resizeHandle.type = "button";
        resizeHandle.textContent = "↘";
        resizeHandle.setAttribute("aria-label", `Resize ${info.name}`);
        resizeHandle.addEventListener("pointerdown", (event) => startComponentResize(event, card, deviceKey));
        resizeHandle.addEventListener("pointermove", moveComponentResize);
        resizeHandle.addEventListener("pointerup", endComponentResize);
        resizeHandle.addEventListener("pointercancel", endComponentResize);

        componentButton.append(visual, label);
        card.append(removeButton, componentButton, terminalList);
        if (draggableBreadboardDevice(deviceKey)) {
            card.appendChild(resizeHandle);
        }

        return card;
    }

    function createBreadboardSurface() {
        const surface = document.createElement("article");
        const title = document.createElement("span");
        const rails = document.createElement("div");
        const holes = document.createElement("div");
        const terminalList = document.createElement("div");

        surface.className = "lesson-breadboard-surface";
        surface.dataset.selectedDevice = "breadboard";

        title.className = "breadboard-title";
        title.textContent = "Breadboard";

        rails.className = "breadboard-rails";
        rails.innerHTML = "<span>+</span><span>-</span>";

        holes.className = "breadboard-holes";
        for (let row = 0; row < 10; row += 1) {
            for (let column = 0; column < 18; column += 1) {
                const hole = document.createElement("i");
                hole.setAttribute("aria-hidden", "true");
                holes.appendChild(hole);
            }
        }

        terminalList.className = "breadboard-terminal-list";
        [
            { id: "power-rail", label: "+ Rail" },
            { id: "ground-rail", label: "- Rail" },
            { id: "row-a", label: "Row A" },
            { id: "row-b", label: "Row B" },
            { id: "row-c", label: "Row C" },
            { id: "row-d", label: "Row D" },
            { id: "row-e", label: "Row E" },
        ].forEach((terminal) => {
            terminalList.appendChild(createTerminalButton("breadboard", terminal));
        });

        surface.append(title, rails, holes, terminalList);
        return surface;
    }

    function renderSelectedDevices() {
        if (!selectedDeviceLayer) {
            return;
        }

        selectedDeviceLayer.innerHTML = "";
        selectedDeviceLayer.hidden = selectedDevices.size === 0;
        selectedDeviceLayer.closest(".workspace-stage")?.classList.toggle("has-selected-devices", selectedDevices.size > 0);

        if (selectedDevices.has("breadboard")) {
            const breadboardZone = document.createElement("section");
            breadboardZone.className = "lesson-breadboard-zone";
            breadboardZone.setAttribute("aria-label", "Lesson breadboard wiring area");
            breadboardZone.appendChild(createBreadboardSurface());

            selectedDevices.forEach((deviceKey) => {
                if (deviceKey === "breadboard") {
                    return;
                }
                const card = createDeviceCard(deviceKey);
                card.classList.add("on-breadboard");
                if (!breadboardComponentPositions.has(deviceKey)) {
                    setBreadboardPosition(deviceKey, firstOpenBreadboardPosition(deviceKey));
                }
                placeBreadboardCard(card, deviceKey);
                breadboardZone.appendChild(card);
            });

            selectedDeviceLayer.appendChild(breadboardZone);
            window.requestAnimationFrame(redrawWiresForCurrentLayout);
            return;
        }

        selectedDevices.forEach((deviceKey) => {
            selectedDeviceLayer.appendChild(createDeviceCard(deviceKey));
        });
    }

    function selectProject(projectKey) {
        const project = projectInfo[projectKey];

        if (!project) {
            return;
        }

        setWorkspaceMessage("Select a lesson to begin.");
        activeProject = projectKey;
        activeLessonKey = projectKey;
        boardIntroCompleted = false;
        lessonObserved = false;
        clearBoardIntroHighlight();
        setModeValue("guided");
        if (guidedProjectLibrary) {
            guidedProjectLibrary.hidden = false;
        }
        if (freeBuildDeviceLibrary) {
            freeBuildDeviceLibrary.hidden = true;
        }
        freeBuildTab?.classList.remove("active");
        selectedDevices.clear();
        breadboardComponentPositions.clear();
        project.components.forEach((deviceKey) => selectedDevices.add(deviceKey));
        renderSelectedDevices();
        syncDeviceHighlights();
        syncProjectHighlights();
        const sketchKey = projectSketchMap[projectKey];
        if (sketchSelect && sketchKey && starterSketches[sketchKey]) {
            sketchSelect.value = sketchKey;
            loadStarterCode(false);
        }
        startGuidedWiring(projectKey);
        syncModePanels();
        updateCodeStudioState();
    }

    function selectDevice(deviceKey) {
        const info = deviceInfo[deviceKey];

        if (!info || currentMode() !== "free") {
            return;
        }

        activeProject = null;
        syncProjectHighlights();

        if (deviceKey === "arduino-uno") {
            setCoach(info.coach, "<p>The Arduino Uno stays in the workspace as the main controller.</p>");
            syncDeviceHighlights();
            return;
        }

        selectedDevices.add(deviceKey);
        renderSelectedDevices();
        syncDeviceHighlights();
        updateFreeBuildWireStatus();
        updateUsbAvailability();
        updateCodeStudioState();
        updateSimulationControls();
        setFreeBuildDirty(true);
        setCoach(info.coach, `<p>${info.description}</p>`);
    }

    function startGuidedWiring(projectKey) {
        selectedPin = null;
        currentStepIndex = 0;
        completedConnections = [];
        clearWireLayer();
        resetUsbStatus();
        updateWiringUi();
        highlightCurrentTargets();
    }

    function clearWiringState() {
        selectedPin = null;
        clearFreeBuildSelection();
        currentStepIndex = 0;
        completedConnections = [];
        manualConnections = [];
        clearWireLayer();
        clearHighlights();
        resetUsbStatus();
        updateWiringUi();
        updateFreeBuildWireStatus();
    }

    function getSteps() {
        return activeProject ? wiringSteps[activeProject] || [] : [];
    }

    function getCurrentStep() {
        return getSteps()[currentStepIndex];
    }

    function getLessonTitle(lessonKey = activeLessonKey) {
        return lessonCompletionText[lessonKey]?.title || projectInfo[lessonKey]?.name || "Arduino Lesson";
    }

    function expectedBehaviorForLesson(lessonKey = activeLessonKey) {
        return lessonExpectedBehavior[lessonKey] || null;
    }

    function currentLessonTasks() {
        if (activeLessonKey === "meet-board") {
            const activePart = boardPartInfo[meetBoardSequence[meetBoardStepIndex]];
            return [
                {
                    label: boardIntroCompleted
                        ? "Board tour complete."
                        : `Tour stop ${meetBoardStepIndex + 1} of ${meetBoardSequence.length}: ${activePart?.title || "Arduino board part"}.`,
                    complete: boardIntroCompleted,
                    coach: boardIntroCompleted
                        ? "Meet the Board is complete."
                        : `${activePart?.title || "Board part"}: ${activePart?.type || "Arduino feature"}. ${activePart?.uses?.[0] || "Review this part before continuing."}.`,
                },
            ];
        }

        if (!activeProject) {
            return [];
        }

        const tasks = getSteps().map((item, index) => ({
            label: item.instruction,
            complete: index < completedConnections.length,
            coach: item.instruction,
        }));
        const expectedBehavior = expectedBehaviorForLesson();
        const expectedSketchName = sketchLabel(projectSketchMap[activeProject] || expectedBehavior || "blink-led");

        tasks.push(
            {
                label: "Connect USB",
                complete: usbConnected,
                coach: "Connect the USB cable.",
            },
            {
                label: `Upload ${expectedSketchName}`,
                complete: Boolean(expectedBehavior && uploadedBehavior === expectedBehavior),
                coach: usbConnected ? `Upload ${expectedSketchName}.` : "Connect USB before uploading.",
            },
            {
                label: "Run Simulation",
                complete: lessonObserved,
                coach: uploadedBehavior === expectedBehavior ? "Run the simulation." : `Upload ${expectedSketchName} before running.`,
            },
            {
                label: lessonRunLabels[activeProject] || "Observe the output",
                complete: lessonObserved,
                coach: lessonObserved ? "Lesson complete." : "Observe the output.",
            },
        );

        return tasks;
    }

    function firstIncompleteTask(tasks) {
        return tasks.find((task) => !task.complete) || null;
    }

    function renderLessonCompletion(complete) {
        if (!lessonCompletePanel) {
            return;
        }

        lessonCompletePanel.hidden = !complete;
        if (!complete) {
            return;
        }

        const completion = lessonCompletionText[activeLessonKey];
        if (completedLessonTitle) {
            completedLessonTitle.textContent = completion?.title || getLessonTitle();
        }

        if (completedLessonConcepts) {
            completedLessonConcepts.innerHTML = "";
            (completion?.concepts || []).forEach((concept) => {
                const item = document.createElement("li");
                item.textContent = concept;
                completedLessonConcepts.appendChild(item);
            });
        }
    }

    function renderLessonTasks() {
        if (currentMode() !== "guided" || !activeLessonKey) {
            renderLessonCompletion(false);
            if (completeBoardIntroButton) {
                completeBoardIntroButton.hidden = true;
            }
            if (wiringStepText) {
                wiringStepText.textContent = "No lesson selected.";
            }
            if (completedStepCount) {
                completedStepCount.textContent = "0 completed";
            }
            if (remainingStepCount) {
                remainingStepCount.textContent = "0 remaining";
            }
            if (wiringStepList) {
                wiringStepList.innerHTML = "";
            }
            syncProgressivePanels();
            return false;
        }

        const tasks = currentLessonTasks();
        const activeTask = firstIncompleteTask(tasks);
        const completedCount = tasks.filter((task) => task.complete).length;
        const remainingCount = Math.max(tasks.length - completedCount, 0);
        const lessonComplete = tasks.length > 0 && remainingCount === 0;

        if (wiringStepText) {
            wiringStepText.textContent = lessonComplete ? "Lesson Complete" : (activeTask?.label || "Choose a lesson.");
        }

        if (completedStepCount) {
            completedStepCount.textContent = `${completedCount} completed`;
        }

        if (remainingStepCount) {
            remainingStepCount.textContent = `${remainingCount} remaining`;
        }

        if (wiringStepList) {
            wiringStepList.innerHTML = "";
            let reachedActive = false;
            tasks.forEach((task) => {
                const listItem = document.createElement("li");
                listItem.textContent = task.label;
                const isActive = !task.complete && !reachedActive;
                if (isActive) {
                    reachedActive = true;
                }
                listItem.classList.toggle("complete", task.complete);
                listItem.classList.toggle("active", isActive);
                listItem.classList.toggle("locked", !task.complete && !isActive);
                wiringStepList.appendChild(listItem);
            });
        }

        if (completeBoardIntroButton) {
            completeBoardIntroButton.hidden = activeLessonKey !== "meet-board" || boardIntroCompleted;
            completeBoardIntroButton.textContent = meetBoardStepIndex >= meetBoardSequence.length - 1
                ? "Complete Board Tour"
                : "Next Board Part";
        }

        updateMeetBoardHighlight();
        renderLessonCompletion(lessonComplete);

        if (lessonComplete) {
            setCoach("Lesson complete.", `<p>${getLessonTitle()} is complete.</p>`);
        } else if (activeTask) {
            setCoach(activeTask.coach || activeTask.label, "");
        }

        syncProgressivePanels();
        return true;
    }

    function completeBoardIntroLesson() {
        if (activeLessonKey !== "meet-board") {
            return;
        }

        meetBoardStepIndex += 1;
        if (meetBoardStepIndex >= meetBoardSequence.length) {
            boardIntroCompleted = true;
        }

        updateMeetBoardHighlight();
        renderLessonTasks();
    }

    function replayActiveLesson() {
        if (activeLessonKey === "meet-board") {
            selectBoardIntro();
            return;
        }

        if (activeProject) {
            selectProject(activeProject);
        }
    }

    function goToNextLesson() {
        const index = lessonOrder.indexOf(activeLessonKey);
        const nextLesson = lessonOrder[index + 1];

        if (!nextLesson) {
            setModeValue("free");
            applyMode("free");
            return;
        }

        if (nextLesson === "meet-board") {
            selectBoardIntro();
            return;
        }

        selectProject(nextLesson);
    }

    function cleanupCompletedLessonWorkspace({ keepLessonSelection = false, afterCleanup = null } = {}) {
        if (currentMode() === "free") {
            return;
        }

        const previousLesson = activeLessonKey;
        selectedDeviceLayer?.classList.add("workspace-cleaning");
        wireLayer?.classList.add("workspace-cleaning");

        window.setTimeout(() => {
            selectedDeviceLayer?.classList.remove("workspace-cleaning");
            wireLayer?.classList.remove("workspace-cleaning");

            selectedPin = null;
            currentStepIndex = 0;
            completedConnections = [];
            manualConnections = [];
            boardIntroCompleted = false;
            lessonObserved = false;
            meetBoardStepIndex = 0;
            selectedDevices.clear();
            breadboardComponentPositions.clear();
            clearWireLayer();
            clearHighlights();
            clearFreeBuildSelection();
            document.querySelectorAll(".connected-target").forEach((element) => {
                element.classList.remove("connected-target");
            });
            resetUsbStatus();
            resetOutputPanelToEmpty();
            clearSerialMonitor();
            renderSelectedDevices();
            updateMeetBoardHighlight();

            if (!keepLessonSelection) {
                activeProject = null;
                activeLessonKey = null;
                clearBoardIntroHighlight();
                syncProjectHighlights();
            } else {
                activeLessonKey = previousLesson;
            }

            syncDeviceHighlights();
            syncLessonComponentSummary();
            renderLessonTasks();
            setWorkspaceMessage("Workspace cleared. Select a lesson to continue.");
            setCoach("Workspace Cleared", keepLessonSelection
                ? "<p>The selected lesson is back at step one. Select the lesson again to rebuild the circuit.</p>"
                : "<p>Select a lesson to continue.</p>");
            if (typeof afterCleanup === "function") {
                afterCleanup();
            }
            window.setTimeout(() => {
                if (!activeLessonKey && currentMode() === "guided") {
                    setCoach("Choose a lesson from the left panel to start learning.", "<p>Select a lesson when you are ready.</p>");
                }
            }, 1200);
        }, 220);
    }

    function clearGuidedWorkspace() {
        cleanupCompletedLessonWorkspace({ keepLessonSelection: Boolean(activeLessonKey) });
    }

    function startNextLessonFromCompletion() {
        if (currentMode() === "free") {
            return;
        }

        const index = lessonOrder.indexOf(activeLessonKey);
        const nextLesson = lessonOrder[index + 1];
        cleanupCompletedLessonWorkspace({
            afterCleanup: () => {
                if (!nextLesson) {
                    setModeValue("free");
                    applyMode("free");
                    return;
                }

                if (nextLesson === "meet-board") {
                    selectBoardIntro();
                    return;
                }

                selectProject(nextLesson);
            },
        });
    }

    function stayOnCompletedLesson() {
        renderLessonCompletion(false);
        setCoach("Completed circuit preserved.", "<p>You can inspect the circuit or clear the workspace when ready.</p>");
    }

    function markLessonObservedIfRunning() {
        if (currentMode() !== "guided" || !activeProject || !simulationRunning) {
            return;
        }

        const expectedBehavior = expectedBehaviorForLesson();
        if (expectedBehavior && activeSimulation === expectedBehavior) {
            lessonObserved = true;
            renderLessonTasks();
        }
    }

    function pwmFromAnalog(value) {
        return Math.round(Math.max(0, Math.min(Number(value) || 0, 1023)) / 1023 * 255);
    }

    function appendSerialLineOnce(value) {
        if (!serialMonitorOutput || serialMonitorOutput.textContent.endsWith(`${value}\n`)) {
            return;
        }

        appendSerialValue(value);
    }

    function updateBuiltInLedState(isOn) {
        if (!builtInLed) {
            return;
        }

        builtInLed.classList.toggle("built-in-led-on", Boolean(isOn));
        builtInLed.setAttribute("aria-label", `Built-in LED on Pin 13 is ${isOn ? "ON" : "OFF"}`);
    }

    function syncUsbVisual() {
        boardUsbPort?.classList.toggle("usb-connected", usbConnected);
        if (usbCable) {
            usbCable.classList.toggle("plugged-in", usbConnected);
        }
    }

    function lessonPinHint(expectedPin) {
        if (expectedPin === "D13") {
            return "This lesson uses Digital Pin 13.";
        }
        if (expectedPin === "D2") {
            return "This lesson uses Digital Pin 2.";
        }
        if (expectedPin === "D8") {
            return "This lesson uses Digital Pin 8.";
        }
        if (expectedPin === "A0") {
            return "This lesson uses Analog Pin A0.";
        }
        if (expectedPin === "GND") {
            return "This step needs GND to complete the circuit.";
        }
        if (expectedPin === "5V") {
            return "This step needs the 5V power pin.";
        }
        return `This step uses ${expectedPin}.`;
    }

    function lessonTerminalHint(stepItem) {
        if (stepItem.pin === "GND" || stepItem.terminal === "ground" || stepItem.terminal === "negative" || stepItem.terminal === "cathode") {
            return "Ground must connect to GND.";
        }
        if (stepItem.device === "resistor") {
            return "The resistor protects the LED from too much current.";
        }
        if (stepItem.device === "led" && stepItem.terminal === "anode") {
            return "The LED anode is the positive side.";
        }
        if (stepItem.device === "potentiometer" && stepItem.terminal === "middle") {
            return "The middle pin sends the changing signal.";
        }
        return stepItem.reason;
    }

    function handlePinSelect(pinName, pinElement) {
        if (handleFreeBuildPoint({ type: "pin", name: pinName, element: pinElement })) {
            return;
        }

        const currentStep = getCurrentStep();

        if (!currentStep || currentMode() !== "guided") {
            return;
        }

        if (pinName !== currentStep.pin) {
            selectedPin = null;
            markTemporaryError(pinElement);
            setCoach(lessonPinHint(currentStep.pin), `<p>${currentStep.instruction}</p>`);
            return;
        }

        selectedPin = { name: pinName, element: pinElement };
        clearSelectedPinHighlights();
        pinElement.classList.add("selected-wiring-target");
        setCoach(`Selected ${pinName}.`, `<p>Now click the <strong>${terminalLabel(currentStep.device, currentStep.terminal)}</strong> terminal on ${deviceInfo[currentStep.device].name}.</p>`);
    }

    function handleTerminalSelect(deviceKey, terminalId, terminalElement) {
        if (handleFreeBuildPoint({ type: "terminal", device: deviceKey, terminal: terminalId, element: terminalElement })) {
            return;
        }

        const currentStep = getCurrentStep();

        if (!currentStep || currentMode() !== "guided") {
            showComponentInfo(deviceKey);
            return;
        }

        if (!selectedPin) {
            setCoach("Select the Arduino pin first.", `<p>${currentStep.instruction}</p>`);
            return;
        }

        const isCorrect = selectedPin.name === currentStep.pin
            && deviceKey === currentStep.device
            && terminalId === currentStep.terminal;

        if (!isCorrect) {
            markTemporaryError(terminalElement);
            setCoach(lessonTerminalHint(currentStep), `<p>Try: ${currentStep.instruction}</p>`);
            return;
        }

        completeStep(selectedPin.element, terminalElement, currentStep);
    }

    function completeStep(pinElement, terminalElement, currentStep) {
        drawWire(pinElement, terminalElement, currentStep.color);
        pinElement.classList.add("connected-target");
        terminalElement.classList.add("connected-target");
        completedConnections.push(currentStep);
        currentStepIndex += 1;
        selectedPin = null;
        clearSelectedPinHighlights();
        updateWiringUi();

        const nextStep = getCurrentStep();
        if (nextStep) {
            highlightCurrentTargets();
            setCoach("Connection added.", `<p><strong>Next:</strong> ${nextStep.instruction}</p><p>${nextStep.reason}</p>`);
            return;
        }

        clearHighlights();
        updateStatusPill(simulationStatus, "Circuit Ready", false);
        updateUsbAvailability();
        setCoach("Circuit Ready.", "<p>All required wires are connected. You can now connect USB power for the next stage.</p>");
    }

    function drawWire(pinElement, terminalElement, colorName, explicitWireIndex = null) {
        if (!wireLayer) {
            return;
        }

        const stageRect = wireLayer.closest(".workspace-stage").getBoundingClientRect();
        const start = centerOf(pinElement, stageRect);
        const end = centerOf(terminalElement, stageRect);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const wireIndex = explicitWireIndex ?? (currentMode() === "free" ? manualConnections.length : completedConnections.length);
        const laneOffset = (wireIndex % 4) * 18 - 27;
        const midX = Math.round((start.x + end.x) / 2);
        const startY = Math.round(start.y + laneOffset);
        const endY = Math.round(end.y + laneOffset);
        const curve = `M ${start.x} ${start.y} C ${midX} ${startY}, ${midX} ${endY}, ${end.x} ${end.y}`;

        path.setAttribute("d", curve);
        path.setAttribute("class", `connection-wire wire-${colorName}`);
        path.dataset.wireIndex = String(wireIndex);
        wireLayer.appendChild(path);
    }

    function centerOf(element, containerRect) {
        const rect = element.getBoundingClientRect();
        return {
            x: Math.round(rect.left + rect.width / 2 - containerRect.left),
            y: Math.round(rect.top + rect.height / 2 - containerRect.top),
        };
    }

    function updateWiringUi() {
        if (renderLessonTasks()) {
            return;
        }

        const steps = getSteps();
        const remaining = Math.max(steps.length - completedConnections.length, 0);
        const currentStep = getCurrentStep();

        if (wiringStepText) {
            wiringStepText.textContent = currentStep
                ? `Current Step: ${currentStep.instruction}`
                : steps.length && remaining === 0
                    ? "Circuit Ready. All guided wiring steps are complete."
                    : "Select a Guided Lab project to begin wiring.";
        }

        if (completedStepCount) {
            completedStepCount.textContent = `${completedConnections.length} completed`;
        }

        if (remainingStepCount) {
            remainingStepCount.textContent = `${remaining} remaining`;
        }

        if (wiringStepList) {
            wiringStepList.innerHTML = "";
            steps.forEach((item, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = item.instruction;
                listItem.classList.toggle("complete", index < completedConnections.length);
                listItem.classList.toggle("active", index === currentStepIndex);
                wiringStepList.appendChild(listItem);
            });
        }
    }

    function highlightCurrentTargets() {
        clearHighlights();
        const currentStep = getCurrentStep();

        if (!currentStep) {
            return;
        }

        document.querySelectorAll(`[data-pin="${currentStep.pin}"]`).forEach((pin) => {
            pin.classList.add("active-wiring-target");
        });

        const terminal = findTerminal(currentStep.device, currentStep.terminal);
        terminal?.classList.add("active-wiring-target");
    }

    function clearHighlights() {
        document.querySelectorAll(".active-wiring-target, .selected-wiring-target, .temporary-error").forEach((element) => {
            element.classList.remove("active-wiring-target", "selected-wiring-target", "temporary-error");
        });
    }

    function clearSelectedPinHighlights() {
        document.querySelectorAll(".selected-wiring-target").forEach((element) => {
            element.classList.remove("selected-wiring-target");
        });
    }

    function markTemporaryError(element) {
        element.classList.add("temporary-error");
        window.setTimeout(() => element.classList.remove("temporary-error"), 700);
    }

    function findTerminal(deviceKey, terminalId) {
        return document.querySelector(`[data-device="${deviceKey}"][data-terminal="${terminalId}"]`);
    }

    function terminalLabel(deviceKey, terminalId) {
        return deviceInfo[deviceKey]?.terminals?.find((terminal) => terminal.id === terminalId)?.label || terminalId;
    }

    function pointLabel(point) {
        if (point.type === "pin") {
            return point.name;
        }

        if (point.device === "breadboard") {
            return `Breadboard ${point.terminal}`;
        }

        return `${deviceInfo[point.device]?.name || point.device} ${terminalLabel(point.device, point.terminal)}`;
    }

    function updateFreeBuildWireStatus(message = "") {
        if (!freeBuildWireStatus) {
            return;
        }

        if (message) {
            freeBuildWireStatus.textContent = message;
            return;
        }

        freeBuildWireStatus.textContent = manualConnections.length
            ? `${manualConnections.length} manual wire${manualConnections.length === 1 ? "" : "s"} placed.`
            : "No manual wires yet.";
    }

    function clearFreeBuildSelection() {
        selectedFreeBuildPoint = null;
        document.querySelectorAll(".selected-free-build-target").forEach((element) => {
            element.classList.remove("selected-free-build-target");
        });
    }

    function handleFreeBuildPoint(point) {
        if (currentMode() !== "free") {
            return false;
        }

        if (!selectedFreeBuildPoint) {
            selectedFreeBuildPoint = point;
            point.element.classList.add("selected-free-build-target");
            updateFreeBuildWireStatus(`Selected ${pointLabel(point)}. Choose another point.`);
            return true;
        }

        if (selectedFreeBuildPoint.element === point.element) {
            clearFreeBuildSelection();
            updateFreeBuildWireStatus();
            return true;
        }

        drawWire(selectedFreeBuildPoint.element, point.element, "green");
        selectedFreeBuildPoint.element.classList.add("connected-target");
        point.element.classList.add("connected-target");
        manualConnections.push({ from: pointLabel(selectedFreeBuildPoint), to: pointLabel(point) });
        manualConnections[manualConnections.length - 1].fromPoint = endpointFromPoint(selectedFreeBuildPoint);
        manualConnections[manualConnections.length - 1].toPoint = endpointFromPoint(point);
        clearFreeBuildSelection();
        updateFreeBuildWireStatus();
        updateSimulationControls();
        setFreeBuildDirty(true);
        return true;
    }

    function clearWireLayer() {
        if (wireLayer) {
            wireLayer.innerHTML = "";
        }
    }

    function updateStatusPill(element, text, muted = true) {
        if (!element) {
            return;
        }

        element.textContent = text;
        element.classList.toggle("muted", muted);
    }

    function resetUsbStatus() {
        usbConnected = false;
        uploadedSketch = null;
        resetAllSimulations("Not Running", false);
        uploadedBehavior = null;
        lastCompileStatus = "Not Compiled";
        lastUploadStatus = "Not Uploaded";
        detectedBehavior = detectBehavior(codeEditor?.value || "").label;
        updateStatusPill(usbStatus, "Not Connected", true);
        updateStatusPill(simulationStatus, "Not Running", true);
        if (usbCable) {
            usbCable.hidden = true;
        }
        syncUsbVisual();
        if (connectUsbButton) {
            connectUsbButton.disabled = true;
            connectUsbButton.textContent = "Connect USB";
            connectUsbButton.classList.remove("ready");
            connectUsbButton.classList.remove("connected");
        }
        updateUsbAvailability();
        updateCodeStudioState();
        updateSimulationControls();
    }

    function updateUsbAvailability() {
        if (!connectUsbButton || usbConnected) {
            return;
        }

        const ready = currentMode() === "free"
            || (activeProject && getSteps().length > 0 && completedConnections.length === getSteps().length);

        connectUsbButton.disabled = !ready;
        connectUsbButton.classList.toggle("ready", Boolean(ready));
    }

    function isCodeLesson() {
        return Boolean(activeProject && lessonExpectedBehavior[activeProject]);
    }

    function isGuidedWiringComplete() {
        return Boolean(activeProject && getSteps().length > 0 && completedConnections.length === getSteps().length);
    }

    function canUploadCode() {
        if (currentMode() === "guided") {
            return isCodeLesson() && isGuidedWiringComplete() && usbConnected;
        }

        return usbConnected;
    }

    function updateCodeStudioState(message = "Connect USB before uploading code.") {
        const shouldShowCodeStudio = currentMode() !== "guided" || isCodeLesson();

        if (codeStudioCard) {
            codeStudioCard.hidden = !shouldShowCodeStudio;
        }

        if (!shouldShowCodeStudio) {
            updateCodeStatusPanel();
            syncProgressivePanels();
            return;
        }

        const uploadReady = canUploadCode();

        if (sketchSelect) {
            sketchSelect.disabled = !uploadReady;
        }

        if (codeEditor) {
            codeEditor.disabled = !uploadReady;
        }

        if (resetCodeButton) {
            resetCodeButton.disabled = !uploadReady;
        }

        if (uploadCodeButton) {
            uploadCodeButton.disabled = !uploadReady;
        }

        if (codeStudioCard) {
            codeStudioCard.classList.toggle("disabled", !uploadReady && currentMode() === "guided");
            codeStudioCard.setAttribute("aria-disabled", String(!uploadReady));
        }

        if (codeStudioMessage) {
            if (uploadReady) {
                codeStudioMessage.textContent = "Review the starter sketch, then upload.";
            } else if (currentMode() === "guided" && isCodeLesson() && !isGuidedWiringComplete()) {
                codeStudioMessage.textContent = "Complete wiring before editing or uploading code.";
            } else {
                codeStudioMessage.textContent = usbConnected ? "Choose a starter sketch." : message;
            }
        }

        updateCodeStatusPanel();
        syncProgressivePanels();
    }

    function loadStarterCode(markEdited = false) {
        if (!codeEditor || !sketchSelect) {
            return;
        }

        codeEditor.value = starterSketches[sketchSelect.value] || starterSketches["blank-sketch"];
        editorEdited = markEdited;
        lastCompileStatus = "Not Compiled";
        lastUploadStatus = "Not Uploaded";
        detectedBehavior = detectBehavior(codeEditor.value).label;
        uploadedSketch = null;
        uploadedBehavior = null;
        updateCodeStatusPanel();
        updateSimulationControls();
    }

    function markCodeEdited() {
        editorEdited = codeEditor.value !== (starterSketches[sketchSelect.value] || "");
        lastCompileStatus = "Not Compiled";
        lastUploadStatus = "Not Uploaded";
        detectedBehavior = detectBehavior(codeEditor.value).label;
        uploadedSketch = null;
        uploadedBehavior = null;
        updateCodeStatusPanel();
        updateSimulationControls();
    }

    function updateCodeStatusPanel() {
        if (codeStatusSketch) {
            codeStatusSketch.textContent = currentMode() === "guided" && !activeLessonKey
                ? "None"
                : sketchLabel(sketchSelect?.value || "blink-led");
        }

        if (codeStatusEdited) {
            codeStatusEdited.textContent = editorEdited ? "Edited" : "Unedited";
        }

        if (codeStatusCompile) {
            codeStatusCompile.textContent = lastCompileStatus;
        }

        if (codeStatusUpload) {
            codeStatusUpload.textContent = lastUploadStatus;
        }

        if (codeStatusBehavior) {
            codeStatusBehavior.textContent = currentMode() === "guided" && !activeLessonKey
                ? "None"
                : detectedBehavior;
        }
    }

    function validateSketch(code) {
        const trimmed = code.trim();

        if (!trimmed) {
            return "The code editor is empty. Add setup() and loop() before uploading.";
        }

        if (!/void\s+setup\s*\(\s*\)\s*\{/.test(trimmed)) {
            return "Your sketch needs a setup() function.";
        }

        if (!/void\s+loop\s*\(\s*\)\s*\{/.test(trimmed)) {
            return "Your sketch needs a loop() function.";
        }

        const lines = trimmed.split(/\r?\n/);
        const statementPattern = /\b(pinMode|digitalWrite|delay|digitalRead|analogRead|analogWrite|tone|noTone|Serial\.begin|Serial\.println|attach|servo\.write|myServo\.write)\s*\(/;

        for (const line of lines) {
            const cleanLine = line.trim();
            const codeOnly = cleanLine.replace(/\/\/.*$/, "").trim();
            if (statementPattern.test(codeOnly) && !codeOnly.endsWith(";")) {
                return "Check for a missing semicolon.";
            }
        }

        const pinPattern = /\b(?:pinMode|digitalWrite|digitalRead)\s*\(\s*(\d+)/g;
        let match = pinPattern.exec(trimmed);
        while (match) {
            const pin = Number(match[1]);
            if (pin < 0 || pin > 13) {
                return `Pin ${pin} is not supported in this beginner simulator. Use D0 to D13.`;
            }
            match = pinPattern.exec(trimmed);
        }

        return "";
    }

    function detectBehavior(code) {
        const compact = code.replace(/\s+/g, " ");
        const hasBlink = /pinMode\s*\(\s*13\s*,\s*OUTPUT\s*\)/.test(compact)
            && /digitalWrite\s*\(\s*13\s*,\s*HIGH\s*\)/.test(compact)
            && /digitalWrite\s*\(\s*13\s*,\s*LOW\s*\)/.test(compact)
            && /delay\s*\(\s*\d+\s*\)/.test(compact);

        if (hasBlink) {
            return { key: "blink-led", label: "Blink LED on D13" };
        }

        const hasButton = /pinMode\s*\(\s*2\s*,\s*INPUT_PULLUP\s*\)/.test(compact)
            && /digitalRead\s*\(\s*2\s*\)/.test(compact);

        if (hasButton) {
            return { key: "read-button", label: "Read Button on D2" };
        }

        const hasPotentiometer = /analogRead\s*\(\s*A0\s*\)/.test(compact)
            && (/analogWrite\s*\(\s*9\s*,/.test(compact) || /Serial\.println\s*\(/.test(compact));

        if (hasPotentiometer) {
            return { key: "read-potentiometer", label: "Potentiometer on A0" };
        }

        const hasLdr = /analogRead\s*\(\s*A1\s*\)/.test(compact)
            && /Serial\.println\s*\(/.test(compact);

        if (hasLdr) {
            return { key: "read-ldr", label: "LDR Light Sensor on A1" };
        }

        const hasTemperature = /analogRead\s*\(\s*A2\s*\)/.test(compact)
            && /Serial\.println\s*\(/.test(compact);

        if (hasTemperature) {
            return { key: "read-temperature", label: "Temperature Sensor on A2" };
        }

        const hasNamedUltrasonic = /(?:const\s+int\s+)?trigPin\s*=\s*7/.test(compact)
            && /(?:const\s+int\s+)?echoPin\s*=\s*6/.test(compact)
            && /pulseIn\s*\(/.test(compact);
        const hasDirectUltrasonic = /digitalWrite\s*\(\s*7\s*,/.test(compact)
            && /pulseIn\s*\(\s*6\s*,/.test(compact);

        if (hasNamedUltrasonic || hasDirectUltrasonic) {
            return { key: "read-ultrasonic", label: "Ultrasonic Sensor on D7/D6" };
        }

        const hasBuzzerTone = /tone\s*\(\s*8\s*,/.test(compact) && /noTone\s*\(\s*8\s*\)/.test(compact);
        const hasBuzzerOutput = /pinMode\s*\(\s*8\s*,\s*OUTPUT\s*\)/.test(compact);

        if (hasBuzzerTone || hasBuzzerOutput) {
            return { key: "buzzer-tone", label: "Buzzer on D8" };
        }

        const hasServo = /#include\s*<Servo\.h>/.test(code)
            && /\bServo\b/.test(code)
            && /\.attach\s*\(\s*9\s*\)/.test(compact)
            && /\.write\s*\(\s*\d+\s*\)/.test(compact);

        if (hasServo) {
            return { key: "servo-sweep", label: "Servo Motor on D9" };
        }

        return { key: "custom", label: "Custom Code" };
    }

    function connectUsb() {
        updateUsbAvailability();
        if (connectUsbButton?.disabled) {
            setCoach("Wire the circuit first.", "<p>Complete the current wiring task before connecting USB.</p>");
            return;
        }

        usbConnected = true;
        if (uploadTimer) {
            window.clearTimeout(uploadTimer);
            uploadTimer = null;
        }

        if (usbCable) {
            usbCable.hidden = false;
        }
        syncUsbVisual();

        if (connectUsbButton) {
            connectUsbButton.textContent = "USB Connected";
            connectUsbButton.classList.add("connected");
            connectUsbButton.disabled = true;
        }

        updateStatusPill(usbStatus, "USB Connected", false);
        updateCodeStudioState("Choose a starter sketch.");
        updateSimulationControls();
        recordArduinoLabEvent("usb_connected", "USB connected");
        renderLessonTasks();
        setFreeBuildDirty(true);
    }

    function uploadSketch() {
        if (currentMode() === "guided" && !isCodeLesson()) {
            setCoach("No code needed here.", "<p>Meet the Board is about learning the Arduino parts.</p>");
            return;
        }

        if (currentMode() === "guided" && !isGuidedWiringComplete()) {
            updateCodeStudioState("Complete wiring before uploading code.");
            setCoach("Wire the circuit first.", "<p>Complete all wiring steps before uploading code.</p>");
            return;
        }

        if (!usbConnected) {
            updateCodeStudioState("Connect USB before uploading code.");
            setCoach("Connect USB to program the Arduino.", "<p>Connect USB before uploading code.</p>");
            return;
        }

        if (uploadTimer) {
            window.clearTimeout(uploadTimer);
        }

        const code = codeEditor?.value || "";
        const validationError = validateSketch(code);

        if (validationError) {
            uploadedSketch = null;
            uploadedBehavior = null;
            lastCompileStatus = "Error";
            lastUploadStatus = "Not Uploaded";
            detectedBehavior = detectBehavior(code).label;
            codeStudioMessage.textContent = validationError;
            updateCodeStatusPanel();
            updateSimulationControls();
            setCoach("Code needs a small fix.", `<p>${validationError}</p>`);
            return;
        }

        const behavior = detectBehavior(code);
        const expectedBehavior = expectedBehaviorForLesson();
        if (currentMode() === "guided" && expectedBehavior && behavior.key !== expectedBehavior) {
            uploadedSketch = null;
            uploadedBehavior = null;
            lastCompileStatus = "Not Compiled";
            lastUploadStatus = "Not Uploaded";
            detectedBehavior = behavior.label;
            codeStudioMessage.textContent = `This lesson needs ${sketchLabel(projectSketchMap[activeProject])}.`;
            updateCodeStatusPanel();
            updateSimulationControls();
            setCoach("Use the lesson sketch.", `<p>This lesson needs ${sketchLabel(projectSketchMap[activeProject])} before it can run.</p>`);
            return;
        }

        uploadCodeButton.disabled = true;
        uploadedSketch = null;
        uploadedBehavior = null;
        detectedBehavior = behavior.label;
        lastCompileStatus = "Compiling...";
        lastUploadStatus = "Waiting";
        updateCodeStatusPanel();
        updateSimulationControls();
        codeStudioMessage.textContent = "Compiling...";
        setCoach("Compiling code...", "<p>The simulator is checking your Arduino sketch for supported beginner patterns.</p>");

        uploadTimer = window.setTimeout(() => {
            lastCompileStatus = "Compiled";
            lastUploadStatus = "Uploading...";
            updateCodeStatusPanel();
            codeStudioMessage.textContent = "Uploading...";
            setCoach("Uploading code...", "<p>Please wait while the selected sketch is sent to the Arduino.</p>");
            uploadTimer = window.setTimeout(() => {
                codeStudioMessage.textContent = "Upload Complete";
                lastUploadStatus = "Upload Complete";
                updateCodeStatusPanel();
                uploadTimer = window.setTimeout(() => {
                    uploadedSketch = sketchSelect.value;
                    uploadedBehavior = behavior.key;
                    codeStudioMessage.textContent = "Ready to Run";
                    lastUploadStatus = "Ready to Run";
                    uploadCodeButton.disabled = false;
                    updateCodeStatusPanel();
                    updateSimulationControls();
                    recordArduinoLabEvent("code_uploaded", behavior.label);
                    renderLessonTasks();
                }, 700);
            }, 700);
        }, 700);
    }

    function isBlinkSimulationReady() {
        const hasLedContext = activeProject === "blink-led" || selectedDevices.has("led");
        if (currentMode() === "free") {
            return usbConnected && uploadedBehavior === "blink-led" && selectedDevices.has("led") && hasFreeBuildWiring();
        }
        return usbConnected && uploadedBehavior === "blink-led" && hasLedContext;
    }

    function isCircuitComplete(projectKey) {
        const steps = wiringSteps[projectKey] || [];
        return activeProject === projectKey && steps.length > 0 && completedConnections.length === steps.length;
    }

    function hasFreeBuildWiring() {
        return currentMode() === "free" && manualConnections.length > 0;
    }

    function isButtonSimulationReady() {
        if (currentMode() === "free") {
            return usbConnected
                && uploadedBehavior === "read-button"
                && selectedDevices.has("push-button")
                && hasFreeBuildWiring();
        }

        return usbConnected
            && uploadedBehavior === "read-button"
            && selectedDevices.has("push-button")
            && isCircuitComplete("read-push-button");
    }

    function isServoSimulationReady() {
        return usbConnected
            && uploadedBehavior === "servo-sweep"
            && selectedDevices.has("servo-motor")
            && isCircuitComplete("rotate-servo");
    }

    function isPotentiometerSimulationReady() {
        if (currentMode() === "free") {
            return usbConnected
                && uploadedBehavior === "read-potentiometer"
                && selectedDevices.has("potentiometer")
                && hasFreeBuildWiring();
        }

        return usbConnected
            && uploadedBehavior === "read-potentiometer"
            && selectedDevices.has("potentiometer")
            && isCircuitComplete("read-potentiometer");
    }

    function isBuzzerSimulationReady() {
        if (currentMode() === "free") {
            return usbConnected
                && uploadedBehavior === "buzzer-tone"
                && selectedDevices.has("buzzer")
                && hasFreeBuildWiring();
        }

        return usbConnected
            && uploadedBehavior === "buzzer-tone"
            && selectedDevices.has("buzzer")
            && isCircuitComplete("buzzer-tone");
    }

    function isLdrSimulationReady() {
        return usbConnected
            && uploadedBehavior === "read-ldr"
            && selectedDevices.has("ldr")
            && isCircuitComplete("measure-light");
    }

    function isTemperatureSimulationReady() {
        return usbConnected
            && uploadedBehavior === "read-temperature"
            && selectedDevices.has("temperature-sensor")
            && isCircuitComplete("measure-temperature");
    }

    function isUltrasonicSimulationReady() {
        return usbConnected
            && uploadedBehavior === "read-ultrasonic"
            && selectedDevices.has("ultrasonic-sensor")
            && isCircuitComplete("measure-distance");
    }

    function isSimulationReadyForBehavior(behaviorKey) {
        if (behaviorKey === "blink-led") {
            return isBlinkSimulationReady();
        }
        if (behaviorKey === "read-button") {
            return isButtonSimulationReady();
        }
        if (behaviorKey === "servo-sweep") {
            return isServoSimulationReady();
        }
        if (behaviorKey === "read-potentiometer") {
            return isPotentiometerSimulationReady();
        }
        if (behaviorKey === "buzzer-tone") {
            return isBuzzerSimulationReady();
        }
        if (behaviorKey === "read-ldr") {
            return isLdrSimulationReady();
        }
        if (behaviorKey === "read-temperature") {
            return isTemperatureSimulationReady();
        }
        if (behaviorKey === "read-ultrasonic") {
            return isUltrasonicSimulationReady();
        }
        return false;
    }

    function updateSimulationControls() {
        const expectedBehavior = currentMode() === "guided" ? expectedBehaviorForLesson() : null;
        const ready = expectedBehavior
            ? isSimulationReadyForBehavior(expectedBehavior)
            : isBlinkSimulationReady()
            || isButtonSimulationReady()
            || isServoSimulationReady()
            || isPotentiometerSimulationReady()
            || isBuzzerSimulationReady()
            || isLdrSimulationReady()
            || isTemperatureSimulationReady()
            || isUltrasonicSimulationReady();

        if (startSimulationButton) {
            startSimulationButton.disabled = !ready || simulationRunning;
        }

        if (stopSimulationButton) {
            stopSimulationButton.disabled = !simulationRunning;
        }

        if (workspaceStopSimulationButton) {
            workspaceStopSimulationButton.disabled = !simulationRunning;
        }

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = currentSketchStatusLabel();
        }

        if (virtualButtonControl) {
            const canPressButton = activeSimulation === "read-button" && simulationRunning;
            virtualButtonControl.disabled = !canPressButton;
            virtualButtonControl.hidden = uploadedBehavior !== "read-button" && activeSimulation !== "read-button";
        }

        if (servoControlPanel) {
            const shouldShowServo = uploadedBehavior === "servo-sweep" || activeSimulation === "servo-sweep";
            servoControlPanel.hidden = !shouldShowServo;
        }

        if (servoAngleControl) {
            servoAngleControl.disabled = !(uploadedBehavior === "servo-sweep" && isServoSimulationReady());
        }

        if (potentiometerControlPanel) {
            const shouldShowPotentiometer = activeSimulation === "read-potentiometer";
            potentiometerControlPanel.hidden = !shouldShowPotentiometer;
        }

        if (potentiometerControl) {
            potentiometerControl.disabled = !(uploadedBehavior === "read-potentiometer" && isPotentiometerSimulationReady());
        }

        if (buzzerControlPanel) {
            const shouldShowBuzzer = activeSimulation === "buzzer-tone";
            buzzerControlPanel.hidden = !shouldShowBuzzer;
        }

        if (buzzerFrequencyControl) {
            buzzerFrequencyControl.disabled = !(uploadedBehavior === "buzzer-tone" && isBuzzerSimulationReady());
        }

        if (ldrControlPanel) {
            const shouldShowLdr = uploadedBehavior === "read-ldr" || activeSimulation === "read-ldr";
            ldrControlPanel.hidden = !shouldShowLdr;
        }

        if (ldrLightControl) {
            ldrLightControl.disabled = !(uploadedBehavior === "read-ldr" && isLdrSimulationReady());
        }

        if (temperatureControlPanel) {
            const shouldShowTemperature = uploadedBehavior === "read-temperature" || activeSimulation === "read-temperature";
            temperatureControlPanel.hidden = !shouldShowTemperature;
        }

        if (temperatureControl) {
            temperatureControl.disabled = !(uploadedBehavior === "read-temperature" && isTemperatureSimulationReady());
        }

        if (ultrasonicControlPanel) {
            const shouldShowUltrasonic = uploadedBehavior === "read-ultrasonic" || activeSimulation === "read-ultrasonic";
            ultrasonicControlPanel.hidden = !shouldShowUltrasonic;
        }

        if (ultrasonicDistanceControl) {
            ultrasonicDistanceControl.disabled = !(uploadedBehavior === "read-ultrasonic" && isUltrasonicSimulationReady());
        }

        syncProgressivePanels();
    }

    function sketchLabel(sketchKey) {
        return {
            "blink-led": "Blink LED",
            "read-button": "Read Button",
            "read-potentiometer": "Control LED Brightness",
            "read-ldr": "Read LDR",
            "read-temperature": "Read Temperature",
            "read-ultrasonic": "Read Ultrasonic Distance",
            "buzzer-tone": "Buzzer Tone",
            "servo-sweep": "Servo Sweep",
            "blank-sketch": "Blank Sketch",
        }[sketchKey] || "None";
    }

    function currentSketchStatusLabel() {
        if (activeSimulation === "read-potentiometer" || uploadedBehavior === "read-potentiometer") {
            return "Control LED Brightness";
        }

        if (activeSimulation === "read-ldr" || uploadedBehavior === "read-ldr") {
            return "Read LDR";
        }

        if (activeSimulation === "read-temperature" || uploadedBehavior === "read-temperature") {
            return "Temperature Sensor";
        }

        if (activeSimulation === "read-ultrasonic" || uploadedBehavior === "read-ultrasonic") {
            return "Ultrasonic Distance";
        }

        if (activeSimulation === "buzzer-tone" || uploadedBehavior === "buzzer-tone") {
            return "Buzzer Tone";
        }

        if (activeSimulation === "servo-sweep" || uploadedBehavior === "servo-sweep") {
            return "Servo Sweep";
        }

        if (activeSimulation === "read-button" || uploadedBehavior === "read-button") {
            return "Read Button on D2";
        }

        return uploadedBehavior ? detectedBehavior : "None";
    }

    function extractBlinkDelay() {
        const code = codeEditor?.value || starterSketches["blink-led"];
        const match = code.match(/delay\((\d+)\)/);
        return match ? Number(match[1]) : 1000;
    }

    function startBlinkSimulation() {
        if (!isBlinkSimulationReady()) {
            setCoach("Blink simulation is not ready.", "<p>Connect USB, upload the Blink LED sketch, and keep the LED project active.</p>");
            updateSimulationControls();
            return;
        }

        window.clearInterval(simulationTimer);
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        buttonReadTimer = null;
        servoTimer = null;
        potentiometerTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        blinkDelay = extractBlinkDelay();
        simulationRunning = true;
        activeSimulation = "blink-led";
        recordArduinoSimulationRun();
        clearButtonVisuals();
        clearServoVisuals();
        clearPotentiometerVisuals();
        clearBuzzerVisuals();
        clearLdrVisuals();
        clearTemperatureVisuals();
        clearUltrasonicVisuals();
        clearSerialMonitor();
        updateStatusPill(simulationStatus, "Running", false);
        setBlinkState(true);
        simulationTimer = window.setInterval(() => {
            setBlinkState(!blinkPinHigh);
        }, blinkDelay);
        updateSimulationControls();
    }

    function stopBlinkSimulation() {
        if (!simulationRunning) {
            return;
        }

        window.clearInterval(simulationTimer);
        simulationTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        updateStatusPill(simulationStatus, "Stopped", false);
        setCoach("Simulation stopped.", "<p>The last pin and LED state are frozen on screen.</p>");
        updateSimulationControls();
    }

    function resetBlinkSimulation(statusText = "Ready", updateCoach = true) {
        window.clearInterval(simulationTimer);
        simulationTimer = null;
        simulationRunning = false;
        if (activeSimulation === "blink-led") {
            activeSimulation = null;
        }
        setBlinkState(false, false);
        clearSerialMonitor();
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>D13 is LOW, the LED is OFF, and the simulation is ready.</p>");
        }

        updateSimulationControls();
    }

    function setBlinkState(isHigh, updateCoach = true) {
        blinkPinHigh = isHigh;

        document.querySelectorAll('[data-pin="D13"]').forEach((pin) => {
            pin.classList.toggle("simulation-high", isHigh);
        });

        document.querySelectorAll('.bench-component[data-selected-device="led"] .visual-led').forEach((led) => {
            led.classList.toggle("led-on", isHigh);
        });
        updateBuiltInLedState(isHigh);

        document.querySelectorAll(".connection-wire").forEach((wire) => {
            wire.classList.toggle("current-flow", isHigh);
        });

        if (statusActivePin) {
            statusActivePin.textContent = "D13";
        }

        if (statusPinState) {
            statusPinState.textContent = isHigh ? "OUTPUT HIGH" : "OUTPUT LOW";
        }

        if (statusLedState) {
            statusLedState.textContent = isHigh ? "ON" : "OFF";
        }

        if (statusButtonState) {
            statusButtonState.textContent = "N/A";
        }

        if (statusBuzzerState) {
            statusBuzzerState.textContent = "N/A";
        }

        if (statusToneFrequency) {
            statusToneFrequency.textContent = "N/A";
        }

        if (statusVoltage) {
            statusVoltage.textContent = isHigh ? "~5V" : "0V";
        }

        if (activeSimulation === "blink-led") {
            appendSerialValue(isHigh ? "LED ON" : "LED OFF");
        }

        if (!updateCoach) {
            return;
        }

        setCoach(
            isHigh ? "D13 is HIGH." : "D13 is LOW.",
            isHigh
                ? "<p>D13 is HIGH, so the Arduino outputs about 5V and the LED turns ON.</p>"
                : "<p>D13 is LOW, so the output is 0V and the LED turns OFF.</p>"
        );
    }

    function startButtonSimulation() {
        if (!isButtonSimulationReady()) {
            setCoach("Button simulation is not ready.", "<p>Connect USB, upload the Read Button sketch, and complete the D2 to Push Button wiring.</p>");
            updateSimulationControls();
            return;
        }

        window.clearInterval(simulationTimer);
        simulationTimer = null;
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        servoTimer = null;
        potentiometerTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        activeSimulation = "read-button";
        simulationRunning = true;
        recordArduinoSimulationRun();
        clearBlinkVisuals();
        clearServoVisuals();
        clearPotentiometerVisuals();
        clearBuzzerVisuals();
        clearLdrVisuals();
        clearTemperatureVisuals();
        clearUltrasonicVisuals();
        clearSerialMonitor();
        updateStatusPill(simulationStatus, "Running", false);
        setButtonState(false);
        appendSerialValue("1");
        buttonReadTimer = window.setInterval(() => {
            appendSerialValue(buttonPressed ? "0" : "1");
        }, 500);
        updateSimulationControls();
    }

    function stopButtonSimulation() {
        if (!simulationRunning) {
            return;
        }

        window.clearInterval(buttonReadTimer);
        buttonReadTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        updateStatusPill(simulationStatus, "Stopped", false);
        setCoach("Simulation stopped.", "<p>Serial readings are paused. The current button state remains visible.</p>");
        updateSimulationControls();
    }

    function resetButtonSimulation(statusText = "Ready", updateCoach = true) {
        window.clearInterval(buttonReadTimer);
        buttonReadTimer = null;
        simulationRunning = false;
        if (activeSimulation === "read-button") {
            activeSimulation = null;
        }
        setButtonState(false, false);
        clearSerialMonitor();
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>The button is released, D2 reads HIGH, and the serial monitor is clear.</p>");
        }

        updateSimulationControls();
    }

    function setButtonState(isPressed, updateCoach = true) {
        buttonPressed = isPressed;

        document.querySelectorAll('[data-pin="D2"]').forEach((pin) => {
            pin.classList.toggle("simulation-input", activeSimulation === "read-button");
            pin.classList.toggle("simulation-low", isPressed);
        });

        document.querySelectorAll('.bench-component[data-selected-device="push-button"] .visual-push-button').forEach((button) => {
            button.classList.toggle("button-pressed", isPressed);
        });

        if (virtualButtonControl) {
            virtualButtonControl.classList.toggle("pressed", isPressed);
            virtualButtonControl.textContent = isPressed ? "Release Virtual Button" : "Press Virtual Button";
            virtualButtonControl.setAttribute("aria-pressed", String(isPressed));
        }

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = "Read Button on D2";
        }

        if (statusActivePin) {
            statusActivePin.textContent = "D2";
        }

        if (statusPinState) {
            statusPinState.textContent = isPressed ? "INPUT LOW" : "INPUT HIGH";
        }

        if (statusLedState) {
            statusLedState.textContent = "N/A";
        }

        if (statusButtonState) {
            statusButtonState.textContent = isPressed ? "Pressed" : "Released";
        }

        if (statusBuzzerState) {
            statusBuzzerState.textContent = "N/A";
        }

        if (statusToneFrequency) {
            statusToneFrequency.textContent = "N/A";
        }

        if (statusVoltage) {
            statusVoltage.textContent = isPressed ? "0V" : "~5V pull-up";
        }

        if (!updateCoach) {
            return;
        }

        setCoach(
            isPressed ? "Button is pressed." : "Button is released.",
            isPressed
                ? "<p>The button is pressed, so D2 reads LOW.</p>"
                : "<p>The button is released, so D2 reads HIGH.</p>"
        );
    }

    function clearBlinkVisuals() {
        blinkPinHigh = false;
        document.querySelectorAll('[data-pin="D13"]').forEach((pin) => {
            pin.classList.remove("simulation-high");
        });
        document.querySelectorAll('.bench-component[data-selected-device="led"] .visual-led').forEach((led) => {
            led.classList.remove("led-on");
        });
        updateBuiltInLedState(false);
        document.querySelectorAll(".connection-wire").forEach((wire) => {
            wire.classList.remove("current-flow");
        });
    }

    function clearButtonVisuals() {
        buttonPressed = false;
        document.querySelectorAll('[data-pin="D2"]').forEach((pin) => {
            pin.classList.remove("simulation-input", "simulation-low");
        });
        document.querySelectorAll('.bench-component[data-selected-device="push-button"] .visual-push-button').forEach((button) => {
            button.classList.remove("button-pressed");
        });
        if (virtualButtonControl) {
            virtualButtonControl.classList.remove("pressed");
            virtualButtonControl.textContent = "Press Virtual Button";
            virtualButtonControl.setAttribute("aria-pressed", "false");
        }
    }

    function startPotentiometerSimulation() {
        if (!isPotentiometerSimulationReady()) {
            setCoach("Potentiometer simulation is not ready.", "<p>Connect USB, upload the Read Potentiometer sketch, and complete GND, A0, and 5V wiring.</p>");
            updateSimulationControls();
            return;
        }

        window.clearInterval(simulationTimer);
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        simulationTimer = null;
        buttonReadTimer = null;
        servoTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        activeSimulation = "read-potentiometer";
        simulationRunning = true;
        recordArduinoSimulationRun();
        clearBlinkVisuals();
        clearButtonVisuals();
        clearServoVisuals();
        clearBuzzerVisuals();
        clearLdrVisuals();
        clearTemperatureVisuals();
        clearUltrasonicVisuals();
        clearSerialMonitor();
        updateStatusPill(simulationStatus, "Running", false);
        setPotentiometerValue(Number(potentiometerControl?.value || 0));
        appendSerialValue(`A0 ${potentiometerValue} / PWM ${pwmFromAnalog(potentiometerValue)}`);
        potentiometerTimer = window.setInterval(() => {
            appendSerialLineOnce(`A0 ${potentiometerValue} / PWM ${pwmFromAnalog(potentiometerValue)}`);
        }, 500);
        updateSimulationControls();
    }

    function stopPotentiometerSimulation() {
        if (!simulationRunning) {
            return;
        }

        window.clearInterval(potentiometerTimer);
        potentiometerTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        updateStatusPill(simulationStatus, "Stopped", false);
        setCoach("Simulation stopped.", "<p>Serial analog readings are paused. The potentiometer value remains visible.</p>");
        updateSimulationControls();
    }

    function resetPotentiometerSimulation(statusText = "Ready", updateCoach = true) {
        window.clearInterval(potentiometerTimer);
        potentiometerTimer = null;
        simulationRunning = false;
        if (activeSimulation === "read-potentiometer") {
            activeSimulation = null;
        }
        setPotentiometerValue(0, false);
        clearSerialMonitor();
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>The potentiometer returned to 0, A0 reads 0, and the serial monitor is clear.</p>");
        }

        updateSimulationControls();
    }

    function setPotentiometerValue(value, updateCoach = true) {
        potentiometerValue = Math.max(0, Math.min(Number(value) || 0, 1023));
        const pwmValue = pwmFromAnalog(potentiometerValue);
        const voltage = potentiometerValue / 1023 * 5;
        const knobAngle = -135 + (potentiometerValue / 1023 * 270);

        document.querySelectorAll('[data-pin="A0"]').forEach((pin) => {
            pin.classList.toggle("simulation-input", activeSimulation === "read-potentiometer" || uploadedBehavior === "read-potentiometer");
        });
        document.querySelectorAll('[data-pin="D9"]').forEach((pin) => {
            pin.classList.toggle("simulation-high", activeSimulation === "read-potentiometer" && pwmValue > 0);
        });

        document.querySelectorAll('.bench-component[data-selected-device="potentiometer"] .visual-potentiometer').forEach((potentiometer) => {
            potentiometer.style.setProperty("--pot-angle", `${knobAngle}deg`);
            potentiometer.classList.toggle("potentiometer-active", activeSimulation === "read-potentiometer");
        });

        document.querySelectorAll('.bench-component[data-selected-device="led"] .visual-led').forEach((led) => {
            led.classList.toggle("led-on", activeSimulation === "read-potentiometer" && pwmValue > 0);
            if (activeSimulation === "read-potentiometer") {
                led.style.setProperty("--led-brightness", String(Math.max(pwmValue / 255, 0.08)));
            } else {
                led.style.removeProperty("--led-brightness");
            }
        });

        if (potentiometerControl) {
            potentiometerControl.value = String(potentiometerValue);
        }

        if (potentiometerValueLabel) {
            potentiometerValueLabel.textContent = String(potentiometerValue);
        }

        if (potentiometerVoltageLabel) {
            potentiometerVoltageLabel.textContent = `${voltage.toFixed(2)}V`;
        }

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = "Analog Input + PWM Output";
        }

        if (statusActivePin) {
            statusActivePin.textContent = "A0 / D9";
        }

        if (statusPinState) {
            statusPinState.textContent = `A0 ${potentiometerValue} / D9 PWM ${pwmValue}`;
        }

        if (statusLedState) {
            statusLedState.textContent = pwmValue > 0 ? `PWM ${pwmValue}` : "OFF";
        }

        if (statusButtonState) {
            statusButtonState.textContent = "N/A";
        }

        if (statusBuzzerState) {
            statusBuzzerState.textContent = "N/A";
        }

        if (statusToneFrequency) {
            statusToneFrequency.textContent = "N/A";
        }

        if (statusAnalogValue) {
            statusAnalogValue.textContent = String(potentiometerValue);
        }

        if (statusServoAngle) {
            statusServoAngle.textContent = "N/A";
        }

        if (statusPwmSignal) {
            statusPwmSignal.textContent = `PWM ${pwmValue}`;
        }

        if (statusServoPower) {
            statusServoPower.textContent = "5V";
        }

        if (statusServoGround) {
            statusServoGround.textContent = "Connected";
        }

        if (statusVoltage) {
            statusVoltage.textContent = `${voltage.toFixed(2)}V`;
        }

        if (!updateCoach) {
            return;
        }

        setCoach(
            `Potentiometer value: ${potentiometerValue}.`,
            "<p>The potentiometer changes analog input on A0.</p>"
        );
    }

    function clearPotentiometerVisuals(resetStatus = true) {
        document.querySelectorAll('[data-pin="A0"]').forEach((pin) => {
            pin.classList.remove("simulation-input");
        });
        document.querySelectorAll('[data-pin="D9"]').forEach((pin) => {
            pin.classList.remove("simulation-high");
        });
        document.querySelectorAll('.bench-component[data-selected-device="potentiometer"] .visual-potentiometer').forEach((potentiometer) => {
            potentiometer.classList.remove("potentiometer-active");
            potentiometer.style.setProperty("--pot-angle", "-135deg");
        });
        document.querySelectorAll('.bench-component[data-selected-device="led"] .visual-led').forEach((led) => {
            led.classList.remove("led-on");
            led.style.removeProperty("--led-brightness");
        });

        if (resetStatus) {
            potentiometerValue = 0;
            if (potentiometerControl) {
                potentiometerControl.value = "0";
            }
            if (potentiometerValueLabel) {
                potentiometerValueLabel.textContent = "0";
            }
            if (potentiometerVoltageLabel) {
                potentiometerVoltageLabel.textContent = "0.00V";
            }
        }
    }

    function extractBuzzerPattern() {
        const code = codeEditor?.value || starterSketches["buzzer-tone"];
        const toneMatch = code.match(/tone\s*\(\s*8\s*,\s*(\d+)/);
        const delayMatches = Array.from(code.matchAll(/delay\s*\(\s*(\d+)\s*\)/g)).map((match) => Number(match[1]));

        return {
            frequency: toneMatch ? Math.max(200, Math.min(Number(toneMatch[1]), 2000)) : 1000,
            onDelay: delayMatches[0] || 1000,
            offDelay: delayMatches[1] || delayMatches[0] || 1000,
        };
    }

    function startBuzzerSimulation() {
        if (!isBuzzerSimulationReady()) {
            setCoach("Buzzer simulation is not ready.", "<p>Connect USB, upload the Buzzer Tone sketch, and complete D8 to positive and GND to negative wiring.</p>");
            updateSimulationControls();
            return;
        }

        window.clearInterval(simulationTimer);
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        simulationTimer = null;
        buttonReadTimer = null;
        servoTimer = null;
        potentiometerTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        activeSimulation = "buzzer-tone";
        simulationRunning = true;
        recordArduinoSimulationRun();
        buzzerPattern = extractBuzzerPattern();
        buzzerFrequency = Number(buzzerFrequencyControl?.value || buzzerPattern.frequency);
        if (buzzerFrequencyControl) {
            buzzerFrequencyControl.value = String(buzzerFrequency);
        }
        clearBlinkVisuals();
        clearButtonVisuals();
        clearServoVisuals();
        clearPotentiometerVisuals();
        clearLdrVisuals();
        clearTemperatureVisuals();
        clearSerialMonitor();
        updateStatusPill(simulationStatus, "Running", false);
        appendSerialValue(`Frequency ${buzzerFrequency} Hz`);
        runBuzzerOnPhase();
        updateSimulationControls();
    }

    function runBuzzerOnPhase() {
        if (!simulationRunning || activeSimulation !== "buzzer-tone") {
            return;
        }

        setBuzzerState(true);
        buzzerTimer = window.setTimeout(runBuzzerOffPhase, buzzerPattern.onDelay);
    }

    function runBuzzerOffPhase() {
        if (!simulationRunning || activeSimulation !== "buzzer-tone") {
            return;
        }

        setBuzzerState(false);
        buzzerTimer = window.setTimeout(runBuzzerOnPhase, buzzerPattern.offDelay);
    }

    function stopBuzzerSimulation() {
        if (!simulationRunning) {
            return;
        }

        window.clearTimeout(buzzerTimer);
        buzzerTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        stopBuzzerTone();
        setBuzzerState(false, false);
        updateStatusPill(simulationStatus, "Stopped", false);
        setCoach("Simulation stopped.", "<p>The buzzer sound is stopped and the output is paused.</p>");
        updateSimulationControls();
    }

    function resetBuzzerSimulation(statusText = "Ready", updateCoach = true) {
        window.clearTimeout(buzzerTimer);
        buzzerTimer = null;
        simulationRunning = false;
        if (activeSimulation === "buzzer-tone") {
            activeSimulation = null;
        }
        stopBuzzerTone();
        setBuzzerState(false, false);
        clearSerialMonitor();
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>The buzzer is OFF and the tone output is inactive.</p>");
        }

        updateSimulationControls();
    }

    function ensureAudioContext() {
        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextConstructor) {
            setCoach("Audio is not available.", "<p>This browser does not support the Web Audio API needed for buzzer sound.</p>");
            return null;
        }

        if (!audioContext) {
            audioContext = new AudioContextConstructor();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        return audioContext;
    }

    function startBuzzerTone() {
        const context = ensureAudioContext();
        if (!context || buzzerOscillator) {
            return;
        }

        buzzerOscillator = context.createOscillator();
        buzzerGain = context.createGain();
        buzzerOscillator.type = "square";
        buzzerOscillator.frequency.value = buzzerFrequency;
        buzzerGain.gain.value = 0.045;
        buzzerOscillator.connect(buzzerGain);
        buzzerGain.connect(context.destination);
        buzzerOscillator.start();
    }

    function stopBuzzerTone() {
        if (buzzerOscillator) {
            buzzerOscillator.stop();
            buzzerOscillator.disconnect();
            buzzerOscillator = null;
        }

        if (buzzerGain) {
            buzzerGain.disconnect();
            buzzerGain = null;
        }
    }

    function setBuzzerFrequency(frequency) {
        buzzerFrequency = Math.max(200, Math.min(Number(frequency) || 1000, 2000));

        if (buzzerFrequencyControl) {
            buzzerFrequencyControl.value = String(buzzerFrequency);
        }

        if (buzzerFrequencyLabel) {
            buzzerFrequencyLabel.textContent = `${buzzerFrequency} Hz`;
        }

        if (statusToneFrequency) {
            statusToneFrequency.textContent = `${buzzerFrequency} Hz`;
        }

        if (statusPinState && activeSimulation === "buzzer-tone") {
            statusPinState.textContent = buzzerOn ? `TONE ${buzzerFrequency} Hz` : "LOW / Silent";
        }

        if (buzzerOscillator) {
            buzzerOscillator.frequency.value = buzzerFrequency;
        }

        if (activeSimulation === "buzzer-tone" && simulationRunning) {
            appendSerialLineOnce(`Frequency ${buzzerFrequency} Hz`);
            setCoach("Frequency changed.", "<p>Higher frequency creates a higher pitch.</p>");
        }
    }

    function setBuzzerState(isOn, updateCoach = true) {
        buzzerOn = isOn;
        setBuzzerFrequency(buzzerFrequency);

        document.querySelectorAll('[data-pin="D8"]').forEach((pin) => {
            pin.classList.toggle("simulation-high", activeSimulation === "buzzer-tone" && isOn);
        });

        document.querySelectorAll('.bench-component[data-selected-device="buzzer"] .visual-buzzer').forEach((buzzer) => {
            buzzer.classList.toggle("buzzer-on", isOn);
        });

        if (isOn) {
            startBuzzerTone();
        } else {
            stopBuzzerTone();
        }

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = "Buzzer Tone";
        }

        if (statusActivePin) {
            statusActivePin.textContent = "D8";
        }

        if (statusPinState) {
            statusPinState.textContent = isOn ? `TONE ${buzzerFrequency} Hz` : "LOW / Silent";
        }

        if (statusLedState) {
            statusLedState.textContent = "N/A";
        }

        if (statusButtonState) {
            statusButtonState.textContent = "N/A";
        }

        if (statusBuzzerState) {
            statusBuzzerState.textContent = isOn ? "ON" : "OFF";
        }

        if (statusAnalogValue) {
            statusAnalogValue.textContent = "N/A";
        }

        if (statusServoAngle) {
            statusServoAngle.textContent = "N/A";
        }

        if (statusPwmSignal) {
            statusPwmSignal.textContent = "Inactive";
        }

        if (statusServoPower) {
            statusServoPower.textContent = "N/A";
        }

        if (statusServoGround) {
            statusServoGround.textContent = "Connected";
        }

        if (statusVoltage) {
            statusVoltage.textContent = isOn ? "~5V signal" : "0V";
        }

        if (!updateCoach) {
            return;
        }

        setCoach(
            isOn ? "Buzzer is ON." : "Buzzer is OFF.",
            "<p>Higher frequency creates a higher pitch.</p>"
        );
    }

    function clearBuzzerVisuals(resetStatus = true) {
        stopBuzzerTone();
        buzzerOn = false;
        document.querySelectorAll('[data-pin="D8"]').forEach((pin) => {
            pin.classList.remove("simulation-high");
        });
        document.querySelectorAll('.bench-component[data-selected-device="buzzer"] .visual-buzzer').forEach((buzzer) => {
            buzzer.classList.remove("buzzer-on");
        });

        if (resetStatus) {
            buzzerFrequency = 1000;
            if (buzzerFrequencyControl) {
                buzzerFrequencyControl.value = "1000";
            }
            if (buzzerFrequencyLabel) {
                buzzerFrequencyLabel.textContent = "1000 Hz";
            }
        }
    }

    function lightLevelFromIndex(index) {
        return [
            { label: "Dark", value: 0 },
            { label: "Medium", value: 512 },
            { label: "Bright", value: 1023 },
        ][Math.max(0, Math.min(Number(index) || 0, 2))];
    }

    function startLdrSimulation() {
        if (!isLdrSimulationReady()) {
            setCoach("LDR simulation is not ready.", "<p>Connect USB, upload the Read LDR sketch, and complete the 5V, A1, and GND divider wiring.</p>");
            updateSimulationControls();
            return;
        }

        window.clearInterval(simulationTimer);
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        simulationTimer = null;
        buttonReadTimer = null;
        servoTimer = null;
        potentiometerTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        activeSimulation = "read-ldr";
        simulationRunning = true;
        recordArduinoSimulationRun();
        clearBlinkVisuals();
        clearButtonVisuals();
        clearServoVisuals();
        clearPotentiometerVisuals();
        clearBuzzerVisuals();
        clearLdrVisuals();
        clearTemperatureVisuals();
        clearUltrasonicVisuals();
        clearSerialMonitor();
        updateStatusPill(simulationStatus, "Running", false);
        setLdrLightLevel(Number(ldrLightControl?.value || 1));
        appendSerialValue(String(ldrAnalogValue));
        ldrTimer = window.setInterval(() => {
            appendSerialValue(String(ldrAnalogValue));
        }, 500);
        updateSimulationControls();
    }

    function stopLdrSimulation() {
        if (!simulationRunning) {
            return;
        }

        window.clearInterval(ldrTimer);
        ldrTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        updateStatusPill(simulationStatus, "Stopped", false);
        setCoach("Simulation stopped.", "<p>Serial light readings are paused. The current light level remains visible.</p>");
        updateSimulationControls();
    }

    function resetLdrSimulation(statusText = "Ready", updateCoach = true) {
        window.clearInterval(ldrTimer);
        ldrTimer = null;
        simulationRunning = false;
        if (activeSimulation === "read-ldr") {
            activeSimulation = null;
        }
        setLdrLightLevel(1, false);
        clearSerialMonitor();
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>The light level returned to Medium and the serial monitor is clear.</p>");
        }

        updateSimulationControls();
    }

    function setLdrLightLevel(index, updateCoach = true) {
        ldrLevelIndex = Math.max(0, Math.min(Number(index) || 0, 2));
        const level = lightLevelFromIndex(ldrLevelIndex);
        ldrAnalogValue = level.value;

        document.querySelectorAll('[data-pin="A1"]').forEach((pin) => {
            pin.classList.toggle("simulation-input", activeSimulation === "read-ldr" || uploadedBehavior === "read-ldr");
        });

        document.querySelectorAll('.bench-component[data-selected-device="ldr"] .visual-ldr').forEach((ldr) => {
            ldr.classList.toggle("ldr-active", activeSimulation === "read-ldr");
            ldr.dataset.lightLevel = level.label.toLowerCase();
        });

        if (ldrLightControl) {
            ldrLightControl.value = String(ldrLevelIndex);
        }

        if (ldrLightLabel) {
            ldrLightLabel.textContent = level.label;
        }

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = "Read LDR";
        }

        if (statusActivePin) {
            statusActivePin.textContent = "A1";
        }

        if (statusPinState) {
            statusPinState.textContent = "Analog Input";
        }

        if (statusLedState) {
            statusLedState.textContent = "N/A";
        }

        if (statusButtonState) {
            statusButtonState.textContent = "N/A";
        }

        if (statusBuzzerState) {
            statusBuzzerState.textContent = "N/A";
        }

        if (statusToneFrequency) {
            statusToneFrequency.textContent = "N/A";
        }

        if (statusLightLevel) {
            statusLightLevel.textContent = level.label;
        }

        if (statusAnalogValue) {
            statusAnalogValue.textContent = String(ldrAnalogValue);
        }

        if (statusServoAngle) {
            statusServoAngle.textContent = "N/A";
        }

        if (statusPwmSignal) {
            statusPwmSignal.textContent = "Inactive";
        }

        if (statusServoPower) {
            statusServoPower.textContent = "5V";
        }

        if (statusServoGround) {
            statusServoGround.textContent = "Connected";
        }

        if (statusVoltage) {
            statusVoltage.textContent = "Variable";
        }

        if (!updateCoach) {
            return;
        }

        setCoach(
            `Light level: ${level.label}.`,
            "<p>An LDR changes resistance based on light. Arduino reads the changing voltage through analog pin A1.</p>"
        );
    }

    function clearLdrVisuals(resetStatus = true) {
        document.querySelectorAll('[data-pin="A1"]').forEach((pin) => {
            pin.classList.remove("simulation-input");
        });
        document.querySelectorAll('.bench-component[data-selected-device="ldr"] .visual-ldr').forEach((ldr) => {
            ldr.classList.remove("ldr-active");
            delete ldr.dataset.lightLevel;
        });

        if (resetStatus) {
            ldrLevelIndex = 1;
            ldrAnalogValue = 512;
            if (ldrLightControl) {
                ldrLightControl.value = "1";
            }
            if (ldrLightLabel) {
                ldrLightLabel.textContent = "Medium";
            }
        }
    }

    function startTemperatureSimulation() {
        if (!isTemperatureSimulationReady()) {
            setCoach("Temperature simulation is not ready.", "<p>Connect USB, upload the Temperature Sensor sketch, and complete VCC to 5V, Signal to A2, and GND wiring.</p>");
            updateSimulationControls();
            return;
        }

        window.clearInterval(simulationTimer);
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        simulationTimer = null;
        buttonReadTimer = null;
        servoTimer = null;
        potentiometerTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        activeSimulation = "read-temperature";
        simulationRunning = true;
        recordArduinoSimulationRun();
        clearBlinkVisuals();
        clearButtonVisuals();
        clearServoVisuals();
        clearPotentiometerVisuals();
        clearBuzzerVisuals();
        clearLdrVisuals();
        clearUltrasonicVisuals();
        clearSerialMonitor();
        updateStatusPill(simulationStatus, "Running", false);
        setTemperatureValue(Number(temperatureControl?.value || 25));
        appendSerialValue(temperatureC.toFixed(1));
        temperatureTimer = window.setInterval(() => {
            appendSerialValue(temperatureC.toFixed(1));
        }, 500);
        updateSimulationControls();
    }

    function stopTemperatureSimulation() {
        if (!simulationRunning) {
            return;
        }

        window.clearInterval(temperatureTimer);
        temperatureTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        updateStatusPill(simulationStatus, "Stopped", false);
        setCoach("Simulation stopped.", "<p>Serial temperature readings are paused. The current temperature remains visible.</p>");
        updateSimulationControls();
    }

    function resetTemperatureSimulation(statusText = "Ready", updateCoach = true) {
        window.clearInterval(temperatureTimer);
        temperatureTimer = null;
        simulationRunning = false;
        if (activeSimulation === "read-temperature") {
            activeSimulation = null;
        }
        setTemperatureValue(25, false);
        clearSerialMonitor();
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>The temperature returned to 25°C and the serial monitor is clear.</p>");
        }

        updateSimulationControls();
    }

    function setTemperatureValue(value, updateCoach = true) {
        temperatureC = Math.max(0, Math.min(Number(value) || 0, 100));
        temperatureVoltage = temperatureC / 100;
        temperatureAnalogValue = Math.round(temperatureVoltage / 5 * 1023);

        document.querySelectorAll('[data-pin="A2"]').forEach((pin) => {
            pin.classList.toggle("simulation-input", activeSimulation === "read-temperature" || uploadedBehavior === "read-temperature");
        });

        document.querySelectorAll('.bench-component[data-selected-device="temperature-sensor"] .visual-temperature-sensor').forEach((sensor) => {
            sensor.classList.toggle("temperature-active", activeSimulation === "read-temperature");
            sensor.style.setProperty("--temp-level", `${temperatureC}%`);
        });

        if (temperatureControl) {
            temperatureControl.value = String(temperatureC);
        }

        if (temperatureValueLabel) {
            temperatureValueLabel.textContent = `${temperatureC}°C`;
        }

        if (temperatureVoltageLabel) {
            temperatureVoltageLabel.textContent = `${temperatureVoltage.toFixed(2)}V`;
        }

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = "Temperature Sensor";
        }

        if (statusActivePin) {
            statusActivePin.textContent = "A2";
        }

        if (statusPinState) {
            statusPinState.textContent = "Analog Input";
        }

        if (statusLedState) {
            statusLedState.textContent = "N/A";
        }

        if (statusButtonState) {
            statusButtonState.textContent = "N/A";
        }

        if (statusBuzzerState) {
            statusBuzzerState.textContent = "N/A";
        }

        if (statusToneFrequency) {
            statusToneFrequency.textContent = "N/A";
        }

        if (statusLightLevel) {
            statusLightLevel.textContent = "N/A";
        }

        if (statusTemperature) {
            statusTemperature.textContent = `${temperatureC}°C`;
        }

        if (statusAnalogValue) {
            statusAnalogValue.textContent = String(temperatureAnalogValue);
        }

        if (statusServoAngle) {
            statusServoAngle.textContent = "N/A";
        }

        if (statusPwmSignal) {
            statusPwmSignal.textContent = "Inactive";
        }

        if (statusServoPower) {
            statusServoPower.textContent = "5V";
        }

        if (statusServoGround) {
            statusServoGround.textContent = "Connected";
        }

        if (statusVoltage) {
            statusVoltage.textContent = `${temperatureVoltage.toFixed(2)}V`;
        }

        if (!updateCoach) {
            return;
        }

        setCoach(
            `Temperature: ${temperatureC}°C.`,
            "<p>A temperature sensor converts temperature into voltage. Arduino reads that voltage through analog pin A2 and converts it into a temperature value.</p>"
        );
    }

    function clearTemperatureVisuals(resetStatus = true) {
        document.querySelectorAll('[data-pin="A2"]').forEach((pin) => {
            pin.classList.remove("simulation-input");
        });
        document.querySelectorAll('.bench-component[data-selected-device="temperature-sensor"] .visual-temperature-sensor').forEach((sensor) => {
            sensor.classList.remove("temperature-active");
            sensor.style.setProperty("--temp-level", "25%");
        });

        if (resetStatus) {
            temperatureC = 25;
            temperatureVoltage = 0.25;
            temperatureAnalogValue = 51;
            if (temperatureControl) {
                temperatureControl.value = "25";
            }
            if (temperatureValueLabel) {
                temperatureValueLabel.textContent = "25°C";
            }
            if (temperatureVoltageLabel) {
                temperatureVoltageLabel.textContent = "0.25V";
            }
        }
    }

    function startUltrasonicSimulation() {
        if (!isUltrasonicSimulationReady()) {
            setCoach("Ultrasonic simulation is not ready.", "<p>Connect USB, upload the Ultrasonic Distance sketch, and complete VCC to 5V, TRIG to D7, ECHO to D6, and GND wiring.</p>");
            updateSimulationControls();
            return;
        }

        window.clearInterval(simulationTimer);
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        simulationTimer = null;
        buttonReadTimer = null;
        servoTimer = null;
        potentiometerTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        activeSimulation = "read-ultrasonic";
        simulationRunning = true;
        recordArduinoSimulationRun();
        clearBlinkVisuals();
        clearButtonVisuals();
        clearServoVisuals();
        clearPotentiometerVisuals();
        clearBuzzerVisuals();
        clearLdrVisuals();
        clearTemperatureVisuals();
        clearSerialMonitor();
        updateStatusPill(simulationStatus, "Running", false);
        setUltrasonicDistance(Number(ultrasonicDistanceControl?.value || 50));
        appendSerialValue(String(ultrasonicDistance));
        ultrasonicTimer = window.setInterval(() => {
            appendSerialValue(String(ultrasonicDistance));
        }, 500);
        updateSimulationControls();
    }

    function stopUltrasonicSimulation() {
        if (!simulationRunning) {
            return;
        }

        window.clearInterval(ultrasonicTimer);
        ultrasonicTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        updateStatusPill(simulationStatus, "Stopped", false);
        setCoach("Simulation stopped.", "<p>Serial distance readings are paused. The current distance remains visible.</p>");
        updateSimulationControls();
    }

    function resetUltrasonicSimulation(statusText = "Ready", updateCoach = true) {
        window.clearInterval(ultrasonicTimer);
        ultrasonicTimer = null;
        simulationRunning = false;
        if (activeSimulation === "read-ultrasonic") {
            activeSimulation = null;
        }
        setUltrasonicDistance(50, false);
        clearSerialMonitor();
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>The distance returned to 50cm and the serial monitor is clear.</p>");
        }

        updateSimulationControls();
    }

    function setUltrasonicDistance(value, updateCoach = true) {
        ultrasonicDistance = Math.max(2, Math.min(Math.round(Number(value) || 50), 400));
        ultrasonicEchoDuration = Math.round((ultrasonicDistance * 2) / 0.034);

        document.querySelectorAll('[data-pin="D7"], [data-pin="D6"]').forEach((pin) => {
            pin.classList.toggle("simulation-input", activeSimulation === "read-ultrasonic" || uploadedBehavior === "read-ultrasonic");
        });

        document.querySelectorAll('.bench-component[data-selected-device="ultrasonic-sensor"] .visual-ultrasonic-sensor').forEach((sensor) => {
            sensor.classList.toggle("ultrasonic-active", activeSimulation === "read-ultrasonic");
            sensor.style.setProperty("--distance-level", `${Math.min(100, ultrasonicDistance / 4)}%`);
        });

        if (ultrasonicDistanceControl) {
            ultrasonicDistanceControl.value = String(ultrasonicDistance);
        }

        if (ultrasonicDistanceLabel) {
            ultrasonicDistanceLabel.textContent = `${ultrasonicDistance}cm`;
        }

        if (ultrasonicEchoLabel) {
            ultrasonicEchoLabel.textContent = `${ultrasonicEchoDuration} us`;
        }

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = "Ultrasonic Distance";
        }

        if (statusActivePin) {
            statusActivePin.textContent = "TRIG D7 / ECHO D6";
        }

        if (statusPinState) {
            statusPinState.textContent = "Pulse / Echo";
        }

        if (statusLedState) {
            statusLedState.textContent = "N/A";
        }

        if (statusButtonState) {
            statusButtonState.textContent = "N/A";
        }

        if (statusBuzzerState) {
            statusBuzzerState.textContent = "N/A";
        }

        if (statusToneFrequency) {
            statusToneFrequency.textContent = "N/A";
        }

        if (statusLightLevel) {
            statusLightLevel.textContent = "N/A";
        }

        if (statusTemperature) {
            statusTemperature.textContent = "N/A";
        }

        if (statusAnalogValue) {
            statusAnalogValue.textContent = "N/A";
        }

        if (statusDistance) {
            statusDistance.textContent = `${ultrasonicDistance}cm`;
        }

        if (statusEchoDuration) {
            statusEchoDuration.textContent = `${ultrasonicEchoDuration} us`;
        }

        if (statusServoAngle) {
            statusServoAngle.textContent = "N/A";
        }

        if (statusPwmSignal) {
            statusPwmSignal.textContent = "Inactive";
        }

        if (statusServoPower) {
            statusServoPower.textContent = "5V";
        }

        if (statusServoGround) {
            statusServoGround.textContent = "Connected";
        }

        if (statusVoltage) {
            statusVoltage.textContent = "5V module";
        }

        if (!updateCoach) {
            return;
        }

        setCoach(
            `Distance: ${ultrasonicDistance}cm.`,
            "<p>The ultrasonic sensor sends a sound pulse from TRIG and listens for the echo on ECHO. The Arduino calculates distance from the time delay.</p>"
        );
    }

    function clearUltrasonicVisuals(resetStatus = true) {
        document.querySelectorAll('[data-pin="D7"], [data-pin="D6"]').forEach((pin) => {
            pin.classList.remove("simulation-input");
        });
        document.querySelectorAll('.bench-component[data-selected-device="ultrasonic-sensor"] .visual-ultrasonic-sensor').forEach((sensor) => {
            sensor.classList.remove("ultrasonic-active");
            sensor.style.setProperty("--distance-level", "12.5%");
        });

        if (resetStatus) {
            ultrasonicDistance = 50;
            ultrasonicEchoDuration = 2941;
            if (ultrasonicDistanceControl) {
                ultrasonicDistanceControl.value = "50";
            }
            if (ultrasonicDistanceLabel) {
                ultrasonicDistanceLabel.textContent = "50cm";
            }
            if (ultrasonicEchoLabel) {
                ultrasonicEchoLabel.textContent = "2941 us";
            }
        }
    }

    function extractServoSequence() {
        const code = codeEditor?.value || starterSketches["servo-sweep"];
        const actions = [];
        const actionPattern = /(?:\w+\.)?(write|delay)\s*\(\s*(\d+)\s*\)\s*;/g;
        let currentAngle = null;
        let match = actionPattern.exec(code);

        while (match) {
            const [, action, rawValue] = match;
            const value = Number(rawValue);

            if (action === "write") {
                currentAngle = Math.max(0, Math.min(value, 180));
            }

            if (action === "delay" && currentAngle !== null) {
                actions.push({ angle: currentAngle, delay: value });
                currentAngle = null;
            }

            match = actionPattern.exec(code);
        }

        if (actions.length) {
            return actions;
        }

        return [
            { angle: 0, delay: 1000 },
            { angle: 90, delay: 1000 },
            { angle: 180, delay: 1000 },
        ];
    }

    function startServoSimulation() {
        if (!isServoSimulationReady()) {
            setCoach("Servo simulation is not ready.", "<p>Connect USB, upload the Servo Sweep sketch, and complete Signal to D9, Power to 5V, and Ground to GND.</p>");
            updateSimulationControls();
            return;
        }

        window.clearInterval(simulationTimer);
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        simulationTimer = null;
        buttonReadTimer = null;
        servoTimer = null;
        potentiometerTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        activeSimulation = "servo-sweep";
        simulationRunning = true;
        recordArduinoSimulationRun();
        servoSequence = extractServoSequence();
        servoStepIndex = 0;
        clearBlinkVisuals();
        clearButtonVisuals();
        clearPotentiometerVisuals();
        clearBuzzerVisuals();
        clearLdrVisuals();
        clearTemperatureVisuals();
        clearUltrasonicVisuals();
        updateStatusPill(simulationStatus, "Running", false);
        runServoStep();
        updateSimulationControls();
    }

    function runServoStep() {
        if (!simulationRunning || activeSimulation !== "servo-sweep") {
            return;
        }

        const step = servoSequence[servoStepIndex % servoSequence.length];
        setServoAngle(step.angle);
        servoStepIndex += 1;
        servoTimer = window.setTimeout(runServoStep, step.delay);
    }

    function stopServoSimulation() {
        if (!simulationRunning) {
            return;
        }

        window.clearTimeout(servoTimer);
        servoTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        updateStatusPill(simulationStatus, "Stopped", false);
        setCoach("Simulation stopped.", "<p>The servo is paused at its current angle.</p>");
        updateSimulationControls();
    }

    function resetServoSimulation(statusText = "Ready", updateCoach = true) {
        window.clearTimeout(servoTimer);
        servoTimer = null;
        simulationRunning = false;
        if (activeSimulation === "servo-sweep") {
            activeSimulation = null;
        }
        setServoAngle(0, false);
        clearServoVisuals(false);
        if (statusPwmSignal) {
            statusPwmSignal.textContent = "Inactive";
        }
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>The servo arm returned to 0 degrees and the PWM signal is inactive.</p>");
        }

        updateSimulationControls();
    }

    function setServoAngle(angle, updateCoach = true) {
        servoAngle = Math.max(0, Math.min(Number(angle) || 0, 180));

        document.querySelectorAll('[data-pin="D9"]').forEach((pin) => {
            pin.classList.toggle("simulation-high", activeSimulation === "servo-sweep" || uploadedBehavior === "servo-sweep");
        });

        document.querySelectorAll('.bench-component[data-selected-device="servo-motor"] .visual-servo-motor').forEach((servo) => {
            servo.style.setProperty("--servo-angle", `${servoAngle - 90}deg`);
            servo.classList.toggle("servo-active", activeSimulation === "servo-sweep");
        });

        if (servoAngleControl) {
            servoAngleControl.value = String(servoAngle);
        }

        if (servoAngleValue) {
            servoAngleValue.textContent = `${servoAngle}°`;
        }

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = "Servo Sweep";
        }

        if (statusActivePin) {
            statusActivePin.textContent = "D9";
        }

        if (statusPinState) {
            statusPinState.textContent = "PWM";
        }

        if (statusLedState) {
            statusLedState.textContent = "N/A";
        }

        if (statusButtonState) {
            statusButtonState.textContent = "N/A";
        }

        if (statusBuzzerState) {
            statusBuzzerState.textContent = "N/A";
        }

        if (statusToneFrequency) {
            statusToneFrequency.textContent = "N/A";
        }

        if (statusServoAngle) {
            statusServoAngle.textContent = `${servoAngle}°`;
        }

        if (statusPwmSignal) {
            statusPwmSignal.textContent = activeSimulation === "servo-sweep" ? "Active" : "Ready";
        }

        if (statusServoPower) {
            statusServoPower.textContent = "5V";
        }

        if (statusServoGround) {
            statusServoGround.textContent = "Connected";
        }

        if (statusVoltage) {
            statusVoltage.textContent = "5V";
        }

        if (!updateCoach) {
            return;
        }

        setCoach(
            `Servo angle: ${servoAngle} degrees.`,
            "<p>Servo motors use control pulses to move to specific angles.</p><p>D9 is used because it supports PWM-style control signals.</p><p>The red wire provides 5V, black/brown goes to GND, and signal goes to D9.</p>"
        );
    }

    function clearServoVisuals(resetStatus = true) {
        document.querySelectorAll('[data-pin="D9"]').forEach((pin) => {
            pin.classList.remove("simulation-high");
        });
        document.querySelectorAll('.bench-component[data-selected-device="servo-motor"] .visual-servo-motor').forEach((servo) => {
            servo.classList.remove("servo-active");
            servo.style.setProperty("--servo-angle", "-90deg");
        });

        if (resetStatus) {
            servoAngle = 0;
            if (servoAngleControl) {
                servoAngleControl.value = "0";
            }
            if (servoAngleValue) {
                servoAngleValue.textContent = "0°";
            }
        }

        if (servoPwmMessage) {
            servoPwmMessage.hidden = true;
        }
    }

    function resetAllSimulations(statusText = "Ready", updateCoach = true) {
        window.clearInterval(simulationTimer);
        window.clearInterval(buttonReadTimer);
        window.clearTimeout(servoTimer);
        window.clearInterval(potentiometerTimer);
        window.clearTimeout(buzzerTimer);
        window.clearInterval(ldrTimer);
        window.clearInterval(temperatureTimer);
        window.clearInterval(ultrasonicTimer);
        simulationTimer = null;
        buttonReadTimer = null;
        servoTimer = null;
        potentiometerTimer = null;
        buzzerTimer = null;
        ldrTimer = null;
        temperatureTimer = null;
        ultrasonicTimer = null;
        simulationRunning = false;
        activeSimulation = null;
        clearBlinkVisuals();
        clearButtonVisuals();
        clearServoVisuals();
        clearPotentiometerVisuals();
        clearBuzzerVisuals();
        clearLdrVisuals();
        clearTemperatureVisuals();
        clearUltrasonicVisuals();
        clearSerialMonitor();
        updateStatusPill(simulationStatus, statusText, statusText === "Not Running");

        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = currentSketchStatusLabel();
        }
        if (statusActivePin) {
            statusActivePin.textContent = uploadedBehavior === "read-button"
                ? "D2"
                : uploadedBehavior === "servo-sweep"
                    ? "D9"
                    : uploadedBehavior === "read-potentiometer"
                        ? "A0"
                        : uploadedBehavior === "buzzer-tone"
                            ? "D8"
                            : uploadedBehavior === "read-ldr"
                                ? "A1"
                                : uploadedBehavior === "read-temperature"
                                    ? "A2"
                                    : uploadedBehavior === "read-ultrasonic"
                                        ? "TRIG D7 / ECHO D6"
                                        : "D13";
        }
        if (statusPinState) {
            statusPinState.textContent = uploadedBehavior === "read-button"
                ? "HIGH"
                : uploadedBehavior === "servo-sweep"
                    ? "PWM"
                    : uploadedBehavior === "read-potentiometer"
                        ? "Analog Input"
                        : uploadedBehavior === "buzzer-tone"
                            ? "LOW / Silent"
                            : uploadedBehavior === "read-ldr"
                                ? "Analog Input"
                                : uploadedBehavior === "read-temperature"
                                    ? "Analog Input"
                                    : uploadedBehavior === "read-ultrasonic"
                                        ? "Pulse / Echo"
                                        : "LOW";
        }
        if (statusLedState) {
            statusLedState.textContent = uploadedBehavior === "read-button" ? "N/A" : "OFF";
        }
        if (statusButtonState) {
            statusButtonState.textContent = uploadedBehavior === "read-button" ? "Released" : "N/A";
        }
        if (statusBuzzerState) {
            statusBuzzerState.textContent = uploadedBehavior === "buzzer-tone" ? "OFF" : "N/A";
        }
        if (statusToneFrequency) {
            statusToneFrequency.textContent = uploadedBehavior === "buzzer-tone" ? `${buzzerFrequency} Hz` : "N/A";
        }
        if (statusLightLevel) {
            statusLightLevel.textContent = uploadedBehavior === "read-ldr" ? "Medium" : "N/A";
        }
        if (statusTemperature) {
            statusTemperature.textContent = uploadedBehavior === "read-temperature" ? "25°C" : "N/A";
        }
        if (statusAnalogValue) {
            statusAnalogValue.textContent = uploadedBehavior === "read-potentiometer"
                ? "0"
                : uploadedBehavior === "read-ldr"
                    ? "512"
                    : uploadedBehavior === "read-temperature"
                        ? "51"
                        : "N/A";
        }
        if (statusDistance) {
            statusDistance.textContent = uploadedBehavior === "read-ultrasonic" ? "50cm" : "N/A";
        }
        if (statusEchoDuration) {
            statusEchoDuration.textContent = uploadedBehavior === "read-ultrasonic" ? "2941 us" : "N/A";
        }
        if (statusServoAngle) {
            statusServoAngle.textContent = uploadedBehavior === "servo-sweep" ? "0°" : "N/A";
        }
        if (statusPwmSignal) {
            statusPwmSignal.textContent = uploadedBehavior === "servo-sweep" ? "Ready" : "Inactive";
        }
        if (statusServoPower) {
            statusServoPower.textContent = uploadedBehavior === "servo-sweep" || uploadedBehavior === "read-potentiometer" || uploadedBehavior === "read-ldr" || uploadedBehavior === "read-temperature" || uploadedBehavior === "read-ultrasonic" ? "5V" : "N/A";
        }
        if (statusServoGround) {
            statusServoGround.textContent = uploadedBehavior === "servo-sweep" || uploadedBehavior === "read-potentiometer" || uploadedBehavior === "read-ldr" || uploadedBehavior === "read-temperature" || uploadedBehavior === "read-ultrasonic" ? "Connected" : "N/A";
        }
        if (statusVoltage) {
            statusVoltage.textContent = uploadedBehavior === "read-button"
                ? "~5V pull-up"
                : uploadedBehavior === "servo-sweep"
                    ? "5V"
                    : uploadedBehavior === "read-potentiometer"
                        ? "0.00V"
                        : uploadedBehavior === "buzzer-tone"
                            ? "0V"
                            : uploadedBehavior === "read-ldr"
                                ? "Variable"
                                : uploadedBehavior === "read-temperature"
                                    ? "0.25V"
                                    : uploadedBehavior === "read-ultrasonic"
                                        ? "5V module"
                                        : "0V";
        }

        if (updateCoach) {
            setCoach("Simulation reset.", "<p>The simulator is ready for the uploaded sketch.</p>");
        }

        updateSimulationControls();
    }

    function resetOutputPanelToEmpty() {
        if (statusCurrentSketch) {
            statusCurrentSketch.textContent = "None";
        }
        if (statusActivePin) {
            statusActivePin.textContent = "None";
        }
        if (statusPinState) {
            statusPinState.textContent = "N/A";
        }
        if (statusLedState) {
            statusLedState.textContent = "OFF";
        }
        if (statusButtonState) {
            statusButtonState.textContent = "N/A";
        }
        if (statusBuzzerState) {
            statusBuzzerState.textContent = "N/A";
        }
        if (statusToneFrequency) {
            statusToneFrequency.textContent = "N/A";
        }
        if (statusAnalogValue) {
            statusAnalogValue.textContent = "N/A";
        }
        if (statusVoltage) {
            statusVoltage.textContent = "N/A";
        }
        if (statusLightLevel) {
            statusLightLevel.textContent = "N/A";
        }
        if (statusTemperature) {
            statusTemperature.textContent = "N/A";
        }
        if (statusDistance) {
            statusDistance.textContent = "N/A";
        }
        if (statusEchoDuration) {
            statusEchoDuration.textContent = "N/A";
        }
        if (statusServoAngle) {
            statusServoAngle.textContent = "N/A";
        }
        if (statusPwmSignal) {
            statusPwmSignal.textContent = "Inactive";
        }
        if (statusServoPower) {
            statusServoPower.textContent = "N/A";
        }
        if (statusServoGround) {
            statusServoGround.textContent = "N/A";
        }
        clearSerialMonitor();
    }

    function appendSerialValue(value) {
        if (!serialMonitorOutput) {
            return;
        }

        if (serialMonitorOutput.textContent === "Serial output will appear here.") {
            serialMonitorOutput.textContent = "";
        }

        serialMonitorOutput.textContent += `${value}\n`;
        serialMonitorOutput.scrollTop = serialMonitorOutput.scrollHeight;
    }

    function clearSerialMonitor() {
        if (serialMonitorOutput) {
            serialMonitorOutput.textContent = "Serial output will appear here.";
        }
    }

    function startSimulation() {
        if (uploadedBehavior === "read-button") {
            startButtonSimulation();
            markLessonObservedIfRunning();
            return;
        }

        if (uploadedBehavior === "servo-sweep") {
            startServoSimulation();
            markLessonObservedIfRunning();
            return;
        }

        if (uploadedBehavior === "read-potentiometer") {
            startPotentiometerSimulation();
            markLessonObservedIfRunning();
            return;
        }

        if (uploadedBehavior === "buzzer-tone") {
            startBuzzerSimulation();
            markLessonObservedIfRunning();
            return;
        }

        if (uploadedBehavior === "read-ldr") {
            startLdrSimulation();
            markLessonObservedIfRunning();
            return;
        }

        if (uploadedBehavior === "read-temperature") {
            startTemperatureSimulation();
            markLessonObservedIfRunning();
            return;
        }

        if (uploadedBehavior === "read-ultrasonic") {
            startUltrasonicSimulation();
            markLessonObservedIfRunning();
            return;
        }

        startBlinkSimulation();
        markLessonObservedIfRunning();
    }

    function stopSimulation() {
        if (activeSimulation === "read-button") {
            stopButtonSimulation();
            return;
        }

        if (activeSimulation === "servo-sweep") {
            stopServoSimulation();
            return;
        }

        if (activeSimulation === "read-potentiometer") {
            stopPotentiometerSimulation();
            return;
        }

        if (activeSimulation === "buzzer-tone") {
            stopBuzzerSimulation();
            return;
        }

        if (activeSimulation === "read-ldr") {
            stopLdrSimulation();
            return;
        }

        if (activeSimulation === "read-temperature") {
            stopTemperatureSimulation();
            return;
        }

        if (activeSimulation === "read-ultrasonic") {
            stopUltrasonicSimulation();
            return;
        }

        stopBlinkSimulation();
    }

    function resetSimulation() {
        if (uploadedBehavior === "read-button" || activeSimulation === "read-button") {
            resetButtonSimulation("Ready");
            return;
        }

        if (uploadedBehavior === "servo-sweep" || activeSimulation === "servo-sweep") {
            resetServoSimulation("Ready");
            return;
        }

        if (uploadedBehavior === "read-potentiometer" || activeSimulation === "read-potentiometer") {
            resetPotentiometerSimulation("Ready");
            return;
        }

        if (uploadedBehavior === "buzzer-tone" || activeSimulation === "buzzer-tone") {
            resetBuzzerSimulation("Ready");
            return;
        }

        if (uploadedBehavior === "read-ldr" || activeSimulation === "read-ldr") {
            resetLdrSimulation("Ready");
            return;
        }

        if (uploadedBehavior === "read-temperature" || activeSimulation === "read-temperature") {
            resetTemperatureSimulation("Ready");
            return;
        }

        if (uploadedBehavior === "read-ultrasonic" || activeSimulation === "read-ultrasonic") {
            resetUltrasonicSimulation("Ready");
            return;
        }

        resetBlinkSimulation("Ready");
    }

    function resetFromBoardButton() {
        const shouldAdvanceMeetBoard = activeLessonKey === "meet-board"
            && !boardIntroCompleted
            && meetBoardSequence[meetBoardStepIndex] === "reset";
        resetAllSimulations("Ready", false);
        clearSerialMonitor();
        lessonObserved = false;
        selectedPin = null;
        clearSelectedPinHighlights();
        highlightCurrentTargets();
        if (shouldAdvanceMeetBoard) {
            advanceMeetBoardStep("reset");
            return;
        }

        renderLessonTasks();
        setCoach("Board reset.", "<p>Outputs are LOW and the current lesson step is ready.</p>");
    }

    function resetActiveWiring() {
        if (activeLessonKey === "meet-board") {
            meetBoardStepIndex = 0;
            boardIntroCompleted = false;
            renderLessonTasks();
            setCoach("Meet the Board restarted.", "<p>Start again with the USB port.</p>");
            return;
        }

        if (!activeProject) {
            setCoach("Choose a lesson first.", "<p>Select an Arduino lesson to begin wiring.</p>");
            return;
        }

        selectedPin = null;
        currentStepIndex = 0;
        completedConnections = [];
        lessonObserved = false;
        clearWireLayer();
        clearHighlights();
        document.querySelectorAll(".connected-target").forEach((element) => {
            element.classList.remove("connected-target");
        });
        resetUsbStatus();
        updateWiringUi();
        highlightCurrentTargets();
        setCoach("Wiring reset.", "<p>The selected lesson is still active. Start with the first connection again.</p>");
    }

    function resetWorkspace() {
        activeProject = null;
        selectedDevices.clear();
        breadboardComponentPositions.clear();
        renderSelectedDevices();
        syncDeviceHighlights();
        syncProjectHighlights();
        clearWiringState();
        clearFreeBuildSelection();
        updateFreeBuildWireStatus();
        syncModePanels();
        setCoach(defaultCoachText);
    }

    function clearWorkbench() {
        selectedDevices.clear();
        breadboardComponentPositions.clear();
        renderSelectedDevices();
        clearWiringState();
        syncDeviceHighlights();
        clearFreeBuildSelection();
        updateFreeBuildWireStatus();
        syncModePanels();
        setFreeBuildDirty(true);

        if (activeProject) {
            setCoach("Workspace cleared.", "<p>The current project still needs its required components. Select the project again to add them back and continue.</p>");
            return;
        }

        setCoach("Workspace cleared.", "<p>The Arduino Uno remains visible and ready.</p>");
    }

    function applyMode(mode) {
        const isGuided = mode === "guided";
        freeBuildDirty = false;

        if (guidedProjectLibrary) {
            guidedProjectLibrary.hidden = !isGuided;
        }

        if (freeBuildDeviceLibrary) {
            freeBuildDeviceLibrary.hidden = isGuided;
        }

        if (libraryPanelTitle) {
            libraryPanelTitle.textContent = isGuided ? "Arduino Lessons" : "Free Build Toolbox";
        }

        freeBuildTab?.classList.toggle("active", !isGuided);

        resetWorkspace();
        syncModePanels();
        if (sketchSelect) {
            sketchSelect.value = isGuided ? "blink-led" : "blank-sketch";
            loadStarterCode(false);
        }
        setCoach(isGuided
            ? "Choose a lesson."
            : "Free Build is ready.",
            isGuided
                ? "<p>Pick a lesson, wire the circuit, connect USB, then run the program.</p>"
                : "<p>Add a breadboard and simple components to experiment.</p>");
    }

    projectButtons.forEach((button) => {
        button.addEventListener("click", () => selectProject(button.dataset.project));
    });

    boardIntroButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setModeValue("guided");
            if (guidedProjectLibrary) {
                guidedProjectLibrary.hidden = false;
            }
            if (freeBuildDeviceLibrary) {
                freeBuildDeviceLibrary.hidden = true;
            }
            freeBuildTab?.classList.remove("active");
            selectBoardIntro();
        });
    });

    deviceButtons.forEach((button) => {
        button.addEventListener("click", () => selectDevice(button.dataset.device));
    });

    modeOptions.forEach((option) => {
        const input = option.querySelector("input");

        if (!input) {
            return;
        }

        input.addEventListener("change", () => {
            modeOptions.forEach((item) => item.classList.remove("active"));
            option.classList.add("active");
            applyMode(input.value);
        });
    });

    freeBuildTab?.addEventListener("click", () => {
        setModeValue("free");
        applyMode("free");
    });

    backToLessonsButton?.addEventListener("click", requestReturnToLessons);
    backToLessonsActionButton?.addEventListener("click", requestReturnToLessons);
    saveFreeBuildButton?.addEventListener("click", () => saveFreeBuildWorkspace());
    loadFreeBuildButton?.addEventListener("click", loadSavedFreeBuildWorkspace);
    clearFreeBuildButton?.addEventListener("click", () => clearFreeBuildWorkspace());
    confirmClearFreeBuildButton?.addEventListener("click", () => clearFreeBuildWorkspace({ skipConfirmation: true }));
    cancelClearFreeBuildButton?.addEventListener("click", () => {
        if (clearFreeBuildDialog) {
            clearFreeBuildDialog.hidden = true;
        }
    });
    saveAndLeaveFreeBuildButton?.addEventListener("click", () => {
        if (saveFreeBuildWorkspace({ silent: true })) {
            returnToLessonsFromFreeBuild();
        }
    });
    confirmLeaveFreeBuildButton?.addEventListener("click", returnToLessonsFromFreeBuild);
    cancelLeaveFreeBuildButton?.addEventListener("click", () => {
        if (leaveFreeBuildDialog) {
            leaveFreeBuildDialog.hidden = true;
        }
    });

    outputTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const selectedTab = tab.dataset.outputTab;
            outputTabs.forEach((item) => item.classList.toggle("active", item === tab));
            document.querySelectorAll(".output-pane").forEach((pane) => {
                pane.classList.toggle("active", pane.id === `${selectedTab}OutputPane`);
            });
        });
    });

    connectUsbButton?.addEventListener("click", connectUsb);
    completeBoardIntroButton?.addEventListener("click", completeBoardIntroLesson);
    startNextLessonButton?.addEventListener("click", startNextLessonFromCompletion);
    clearCompletedWorkspaceButton?.addEventListener("click", () => cleanupCompletedLessonWorkspace({ keepLessonSelection: Boolean(activeLessonKey) }));
    guidedClearWorkspaceButton?.addEventListener("click", clearGuidedWorkspace);
    stayHereButton?.addEventListener("click", stayOnCompletedLesson);
    sketchSelect?.addEventListener("change", () => {
        loadStarterCode(false);
        updateSimulationControls();
        renderLessonTasks();
        setFreeBuildDirty(true);
    });
    codeEditor?.addEventListener("input", () => {
        markCodeEdited();
        setFreeBuildDirty(true);
        if (currentMode() === "guided") {
            codeStudioMessage.textContent = "Editing guided code may affect the expected simulation.";
            renderLessonTasks();
        }
    });
    resetCodeButton?.addEventListener("click", () => {
        loadStarterCode(false);
        codeStudioMessage.textContent = "Starter code restored.";
        renderLessonTasks();
    });
    uploadCodeButton?.addEventListener("click", uploadSketch);
    startSimulationButton?.addEventListener("click", startSimulation);
    stopSimulationButton?.addEventListener("click", stopSimulation);
    workspaceStopSimulationButton?.addEventListener("click", stopSimulation);
    resetSimulationButton?.addEventListener("click", resetSimulation);
    virtualButtonControl?.addEventListener("click", () => {
        if (activeSimulation !== "read-button" || !simulationRunning) {
            return;
        }

        setButtonState(!buttonPressed);
        appendSerialValue(buttonPressed ? "0" : "1");
    });
    servoAngleControl?.addEventListener("input", () => {
        if (uploadedBehavior !== "servo-sweep" || !isServoSimulationReady()) {
            return;
        }

        setServoAngle(Number(servoAngleControl.value));
    });
    potentiometerControl?.addEventListener("input", () => {
        if (uploadedBehavior !== "read-potentiometer" || !isPotentiometerSimulationReady()) {
            return;
        }

        setPotentiometerValue(Number(potentiometerControl.value));
        if (activeSimulation === "read-potentiometer" && simulationRunning) {
            appendSerialValue(`A0 ${potentiometerValue} / PWM ${pwmFromAnalog(potentiometerValue)}`);
        }
    });
    buzzerFrequencyControl?.addEventListener("input", () => {
        if (uploadedBehavior !== "buzzer-tone" || !isBuzzerSimulationReady()) {
            return;
        }

        setBuzzerFrequency(Number(buzzerFrequencyControl.value));
    });
    ldrLightControl?.addEventListener("input", () => {
        if (uploadedBehavior !== "read-ldr" || !isLdrSimulationReady()) {
            return;
        }

        setLdrLightLevel(Number(ldrLightControl.value));
        if (activeSimulation === "read-ldr" && simulationRunning) {
            appendSerialValue(String(ldrAnalogValue));
        }
    });
    temperatureControl?.addEventListener("input", () => {
        if (uploadedBehavior !== "read-temperature" || !isTemperatureSimulationReady()) {
            return;
        }

        setTemperatureValue(Number(temperatureControl.value));
        if (activeSimulation === "read-temperature" && simulationRunning) {
            appendSerialValue(temperatureC.toFixed(1));
        }
    });
    ultrasonicDistanceControl?.addEventListener("input", () => {
        if (uploadedBehavior !== "read-ultrasonic" || !isUltrasonicSimulationReady()) {
            return;
        }

        setUltrasonicDistance(Number(ultrasonicDistanceControl.value));
        if (activeSimulation === "read-ultrasonic" && simulationRunning) {
            appendSerialValue(String(ultrasonicDistance));
        }
    });
    viewServoPwmButton?.addEventListener("click", () => {
        if (servoPwmMessage) {
            servoPwmMessage.hidden = false;
        }
        setCoach("Oscilloscope preview coming soon.", "<p>Coming soon: this will open the oscilloscope connected to D9.</p>");
    });
    clearSerialButton?.addEventListener("click", clearSerialMonitor);

    clearWorkbenchButton?.addEventListener("click", clearWorkbench);
    resetWorkspaceButton?.addEventListener("click", resetWorkspace);
    resetWiringButton?.addEventListener("click", resetActiveWiring);
    setupBoardPins();
    setupBoardParts();
    syncDeviceHighlights();
    syncProjectHighlights();
    setInitialLessonState();
});

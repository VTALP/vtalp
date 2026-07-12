document.addEventListener("DOMContentLoaded", () => {
    const tutorialLayout = document.querySelector(".tutorial-layout");

    if (!tutorialLayout) {
        return;
    }

    initializeAnatomyDiagrams();
    initializeTutorialExercises();

    const tutorialSlug = tutorialLayout.dataset.tutorial;
    const storageKey = `vtalp:tutorial:${tutorialSlug}:completed`;
    const pathStorageKey = `vtalp:tutorial:${tutorialSlug}:learningPath`;
    const markCompleteButton = document.getElementById("markCompleteButton");
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");
    const lessonBadge = document.getElementById("lessonBadge");
    const tutorialBadge = document.getElementById("tutorialBadge");
    const progressData = document.getElementById("tutorialProgressData");
    const pathSteps = Array.from(document.querySelectorAll(".path-step"));
    const pathProgressText = document.getElementById("pathProgressText");
    const nextStepText = document.getElementById("nextStepText");
    const continueLearningButton = document.getElementById("continueLearningButton");
    const simulationUrl = tutorialLayout.dataset.simulationUrl;

    function isCompleted() {
        return window.localStorage.getItem(storageKey) === "true";
    }

    function updateProgressDisplay() {
        const completed = isCompleted();
        const pathPercentage = getPathPercentage();
        const percentage = completed ? 100 : pathPercentage;

        progressFill.style.width = `${percentage}%`;
        progressPercent.textContent = `${percentage}%`;
        lessonBadge.textContent = completed ? "Lesson Completed" : "Lesson In Progress";
        tutorialBadge.textContent = completed ? "Tutorial Completed" : "Tutorial In Progress";
        lessonBadge.classList.toggle("completed", completed);
        tutorialBadge.classList.toggle("completed", completed);
        markCompleteButton.textContent = completed ? "Lesson Completed" : "Mark Lesson Completed";

        // Progress tracking preparation: this hidden data hook mirrors the
        // visible badge state so a future dashboard endpoint can persist it.
        if (progressData) {
            progressData.dataset.completed = String(completed);
            progressData.dataset.percent = String(percentage);
        }
    }

    markCompleteButton.addEventListener("click", () => {
        window.localStorage.setItem(storageKey, "true");
        savePathProgress(pathSteps.map((step) => Number(step.dataset.step)));
        updateLearningPathDisplay();
        updateProgressDisplay();
        saveTutorialCompletion();
    });

    function saveTutorialCompletion() {
        fetch(`/progress/api/tutorial/${tutorialSlug}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: true }),
        }).catch(() => {
            // Local completion still works if the network request fails.
        });
    }

    function getCompletedPathSteps() {
        try {
            return JSON.parse(window.localStorage.getItem(pathStorageKey)) || [];
        } catch (error) {
            return [];
        }
    }

    function savePathProgress(completedSteps) {
        window.localStorage.setItem(pathStorageKey, JSON.stringify([...new Set(completedSteps)]));
    }

    function getPathPercentage() {
        if (!pathSteps.length) {
            return 0;
        }

        return Math.round((getCompletedPathSteps().length / pathSteps.length) * 100);
    }

    function updateLearningPathDisplay() {
        if (!pathSteps.length) {
            return;
        }

        const completedSteps = getCompletedPathSteps();
        const nextStep = pathSteps.find((step) => !completedSteps.includes(Number(step.dataset.step)));

        pathSteps.forEach((step) => {
            const isCompletedStep = completedSteps.includes(Number(step.dataset.step));

            step.classList.toggle("completed", isCompletedStep);
            step.classList.toggle("current", step === nextStep);
            step.setAttribute("aria-pressed", String(isCompletedStep));
        });

        if (pathProgressText) {
            pathProgressText.textContent = `${completedSteps.length} of ${pathSteps.length} steps complete`;
        }

        if (nextStepText) {
            nextStepText.textContent = nextStep ? nextStep.innerText.replace(/^\d+\s*/, "") : "Tutorial path completed";
        }

        if (continueLearningButton) {
            continueLearningButton.textContent = nextStep ? "Continue Learning" : "Open Simulation";
        }
    }

    function completePathStep(step) {
        const completedSteps = getCompletedPathSteps();
        const stepNumber = Number(step.dataset.step);

        if (!completedSteps.includes(stepNumber)) {
            completedSteps.push(stepNumber);
            savePathProgress(completedSteps);
        }

        updateLearningPathDisplay();
        updateProgressDisplay();
    }

    function openPathTarget(step) {
        if (step.dataset.target === "simulation") {
            completePathStep(step);
            if (simulationUrl) {
                window.location.href = simulationUrl;
            }
            return;
        }

        const target = document.querySelector(step.dataset.target);

        if (target) {
            completePathStep(step);
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            target.classList.remove("path-highlight");
            window.setTimeout(() => target.classList.add("path-highlight"), 40);
        }
    }

    pathSteps.forEach((step) => {
        step.addEventListener("click", () => openPathTarget(step));
    });

    if (continueLearningButton) {
        continueLearningButton.addEventListener("click", () => {
            const completedSteps = getCompletedPathSteps();
            const nextStep = pathSteps.find((step) => !completedSteps.includes(Number(step.dataset.step)));

            if (nextStep) {
                openPathTarget(nextStep);
            } else if (simulationUrl) {
                window.location.href = simulationUrl;
            }
        });
    }

    updateLearningPathDisplay();
    updateProgressDisplay();
});

function initializeTutorialExercises() {
    const exerciseSection = document.getElementById("tutorialExercises");

    if (!exerciseSection) {
        return;
    }

    const device = exerciseSection.dataset.exerciseDevice || "tutorial";
    const storageKey = `vtalp:tutorial:${device}:exercises`;
    const exercises = Array.from(exerciseSection.querySelectorAll(".exercise-item"));
    const progressText = document.getElementById("exerciseProgressText");
    const progressPercent = document.getElementById("exerciseProgressPercent");
    const progressFill = document.getElementById("exerciseProgressFill");
    const completionBadge = document.getElementById("exerciseCompletionBadge");
    const completedExercises = new Set(readCompletedExercises());

    exercises.forEach((exercise) => {
        const buttons = exercise.querySelectorAll("[data-answer]");
        const feedback = exercise.querySelector(".exercise-feedback");

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const selectedAnswer = button.dataset.answer;
                const correctAnswer = exercise.dataset.correctAnswer;
                const isCorrect = selectedAnswer === correctAnswer;

                buttons.forEach((item) => item.classList.remove("selected", "correct", "incorrect"));
                button.classList.add("selected", isCorrect ? "correct" : "incorrect");

                if (isCorrect) {
                    completedExercises.add(exercise.dataset.exerciseId);
                    exercise.classList.add("completed");
                    feedback.textContent = "Correct. Exercise complete.";
                    feedback.classList.add("correct");
                    feedback.classList.remove("incorrect");
                    saveCompletedExercises();
                    saveExerciseCompletion(exercise.dataset.exerciseId);
                } else {
                    feedback.textContent = "Try again. Revisit the simulation setup and reading.";
                    feedback.classList.add("incorrect");
                    feedback.classList.remove("correct");
                }

                updateExerciseProgress();
            });
        });
    });

    function readCompletedExercises() {
        try {
            return JSON.parse(window.localStorage.getItem(storageKey)) || [];
        } catch (error) {
            return [];
        }
    }

    function saveCompletedExercises() {
        window.localStorage.setItem(storageKey, JSON.stringify([...completedExercises]));
    }

    function updateExerciseProgress() {
        const completedCount = completedExercises.size;
        const percentage = exercises.length ? Math.round((completedCount / exercises.length) * 100) : 0;

        exercises.forEach((exercise) => {
            const isCompleted = completedExercises.has(exercise.dataset.exerciseId);
            exercise.classList.toggle("completed", isCompleted);
            if (isCompleted) {
                const correctButton = exercise.querySelector(`[data-answer="${exercise.dataset.correctAnswer}"]`);
                const feedback = exercise.querySelector(".exercise-feedback");
                correctButton?.classList.add("correct");
                feedback.textContent = "Correct. Exercise complete.";
                feedback.classList.add("correct");
                feedback.classList.remove("incorrect");
            }
        });

        progressText.textContent = `${completedCount}/${exercises.length} complete`;
        progressPercent.textContent = `${percentage}%`;
        progressFill.style.width = `${percentage}%`;
        completionBadge.textContent = percentage === 100
            ? "Tutorial Exercises Completed"
            : "Practice activities in progress";
        completionBadge.classList.toggle("completed", percentage === 100);

        // Client-side practice progress hook for future persistence. These
        // tutorial exercises are intentionally separate from formal assessment scores.
        exerciseSection.dataset.completedCount = String(completedCount);
        exerciseSection.dataset.percent = String(percentage);
    }

    function saveExerciseCompletion(exerciseId) {
        fetch(`/progress/api/exercise/${device}/${exerciseId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: true }),
        }).catch(() => {
            // Local exercise completion still works if the network request fails.
        });
    }

    updateExerciseProgress();
}

function initializeAnatomyDiagrams() {
    const anatomyCards = document.querySelectorAll(".anatomy-card");

    anatomyCards.forEach((card) => {
        const hotspots = card.querySelectorAll(".anatomy-hotspot");
        const titleTarget = card.querySelector("[data-anatomy-title]");
        const purposeTarget = card.querySelector("[data-anatomy-purpose]");
        const usageTarget = card.querySelector("[data-anatomy-usage]");
        const tipTarget = card.querySelector("[data-anatomy-tip]");

        if (!hotspots.length || !titleTarget || !purposeTarget || !usageTarget || !tipTarget) {
            return;
        }

        function activateHotspot(selectedHotspot) {
            hotspots.forEach((hotspot) => {
                hotspot.classList.toggle("active", hotspot === selectedHotspot);
            });

            // Each hotspot stores its own teaching copy so future diagrams can
            // be added without changing the interaction logic.
            titleTarget.textContent = selectedHotspot.dataset.title;
            purposeTarget.innerHTML = `<strong>Function:</strong> ${selectedHotspot.dataset.purpose}`;
            usageTarget.innerHTML = `<strong>Real-world usage:</strong> ${selectedHotspot.dataset.usage}`;
            tipTarget.innerHTML = `<strong>Beginner tip:</strong> ${selectedHotspot.dataset.tip}`;
        }

        hotspots.forEach((hotspot) => {
            hotspot.addEventListener("mouseenter", () => activateHotspot(hotspot));
            hotspot.addEventListener("focus", () => activateHotspot(hotspot));
            hotspot.addEventListener("click", () => activateHotspot(hotspot));
        });

        // Start each tutorial with a useful explanation instead of an empty panel.
        activateHotspot(hotspots[0]);
    });
}

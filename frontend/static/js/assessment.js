document.addEventListener("DOMContentLoaded", () => {
    const assessmentLayout = document.querySelector(".assessment-layout");

    if (!assessmentLayout) {
        return;
    }

    const assessmentSlug = assessmentLayout.dataset.assessment;
    const form = document.getElementById("assessmentForm");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const passMessage = document.getElementById("passMessage");
    const feedbackPanel = document.getElementById("feedbackPanel");
    const retakeButton = document.getElementById("retakeButton");
    const resultData = document.getElementById("assessmentResultData");
    const questions = Array.from(form.querySelectorAll("fieldset"));
    const passingScore = Number(assessmentLayout.dataset.passingScore || 3);

    const assessmentResult = {
        device: assessmentSlug,
        score: 0,
        total: questions.length,
        passed: false,
        submitted: false,
    };

    // Temporary frontend storage: a future Flask endpoint can receive this
    // object and save score, user_id, device, and timestamp into SQLite.
    window.vtalpAssessmentResult = assessmentResult;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        gradeAssessment();
    });

    retakeButton.addEventListener("click", () => {
        form.reset();
        questions.forEach((question) => question.classList.remove("correct", "incorrect"));
        feedbackPanel.classList.remove("visible");
        feedbackPanel.innerHTML = "";
        updateResult(0, false, false);
    });

    function gradeAssessment() {
        let score = 0;
        const feedbackItems = [];

        questions.forEach((question, index) => {
            const correctAnswer = question.dataset.answer;
            const selected = question.querySelector("input[type='radio']:checked");
            const isCorrect = selected?.value === correctAnswer;

            // Score calculation: each question is worth one point. The correct
            // answer is stored in the fieldset's data-answer attribute.
            if (isCorrect) {
                score += 1;
            }

            question.classList.toggle("correct", isCorrect);
            question.classList.toggle("incorrect", !isCorrect);
            feedbackItems.push(
                `<li>Question ${index + 1}: ${isCorrect ? "Correct" : "Review this topic again."}</li>`
            );
        });

        updateResult(score, score >= passingScore, true);
        saveAssessmentResult(score);
        feedbackPanel.innerHTML = `<strong>Immediate Feedback</strong><ul>${feedbackItems.join("")}</ul>`;
        feedbackPanel.classList.add("visible");
    }

    function updateResult(score, passed, submitted) {
        assessmentResult.score = score;
        assessmentResult.passed = passed;
        assessmentResult.submitted = submitted;

        scoreDisplay.textContent = `Score: ${score} / ${assessmentResult.total}`;
        passMessage.classList.remove("pass", "fail");

        if (!submitted) {
            passMessage.textContent = "Submit your answers to see your result.";
        } else if (passed) {
            passMessage.textContent = "Passed. Good work, you are ready to continue practicing.";
            passMessage.classList.add("pass");
        } else {
            passMessage.textContent = "Not yet passed. Review the tutorial and retake the assessment.";
            passMessage.classList.add("fail");
        }

        // Future database integration hook. These data attributes mirror the
        // current score so an API call can later persist them to SQLite.
        resultData.dataset.score = String(score);
        resultData.dataset.total = String(assessmentResult.total);
        resultData.dataset.passed = String(passed);
    }

    function saveAssessmentResult(score) {
        fetch(`/progress/api/assessment/${assessmentSlug}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score, total: assessmentResult.total }),
        }).catch(() => {
            // The visible score remains available even if backend persistence fails.
        });
    }

    updateResult(0, false, false);
});

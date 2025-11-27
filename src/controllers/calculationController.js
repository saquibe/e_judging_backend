// controllers/calculationController.js
import Eposter from "../models/Eposter.js";
import Presentation from "../models/Presentation.js";
import EposterAssessment from "../models/EposterAssessment.js";
import PresentationAssessment from "../models/PresentationAssessment.js";

export const calculateResults = async (req, res) => {
    try {
        const { type } = req.query; // 'eposter', 'presentation', or undefined for both

        let results = [];

        if (!type || type === 'eposter') {
            const eposterResults = await calculateEposterResults();
            results = [...results, ...eposterResults];
        }

        if (!type || type === 'presentation') {
            const presentationResults = await calculatePresentationResults();
            results = [...results, ...presentationResults];
        }

        // Sort by average score (descending)
        results.sort((a, b) => b.averageScore - a.averageScore);

        res.json({
            success: true,
            total: results.length,
            data: results
        });

    } catch (err) {
        console.error('Calculation error:', err);
        res.status(500).json({ 
            success: false,
            message: "Failed to calculate results" 
        });
    }
};

// Calculate ePoster results
const calculateEposterResults = async () => {
    const eposters = await Eposter.find();
    
    const results = await Promise.all(
        eposters.map(async (eposter) => {
            // Get all assessments for this eposter
            const assessments = await EposterAssessment.find({ 
                abstractId: eposter._id 
            });

            if (assessments.length === 0) {
                return {
                    id: eposter._id,
                    abstractNo: eposter.abstractNo,
                    author: eposter.author,
                    title: eposter.title,
                    track: eposter.track,
                    type: 'eposter',
                    totalJudges: 0,
                    averageScore: 0,
                    totalScore: 0,
                    assessments: []
                };
            }

            // Calculate total scores across all judges
            const totalScores = assessments.reduce((acc, assessment) => {
                return {
                    researchTopic: acc.researchTopic + assessment.scores.researchTopic,
                    methods: acc.methods + assessment.scores.methods,
                    results: acc.results + assessment.scores.results,
                    presentation: acc.presentation + assessment.scores.presentation,
                    qa: acc.qa + assessment.scores.qa
                };
            }, { researchTopic: 0, methods: 0, results: 0, presentation: 0, qa: 0 });

            // Calculate averages (divide by number of judges)
            const averageScores = {
                researchTopic: totalScores.researchTopic / assessments.length,
                methods: totalScores.methods / assessments.length,
                results: totalScores.results / assessments.length,
                presentation: totalScores.presentation / assessments.length,
                qa: totalScores.qa / assessments.length
            };

            // Calculate overall average
            const overallAverage = (
                averageScores.researchTopic +
                averageScores.methods +
                averageScores.results +
                averageScores.presentation +
                averageScores.qa
            ) / 5;

            return {
                id: eposter._id,
                abstractNo: eposter.abstractNo,
                author: eposter.author,
                title: eposter.title,
                track: eposter.track,
                type: 'eposter',
                totalJudges: assessments.length,
                averageScore: parseFloat(overallAverage.toFixed(2)),
                totalScore: parseFloat(
                    Object.values(totalScores).reduce((sum, score) => sum + score, 0).toFixed(2)
                ),
                categoryScores: averageScores,
                assessments: assessments.map(a => ({
                    judgeId: a.judgeId,
                    scores: a.scores,
                    comments: a.comments
                }))
            };
        })
    );

    return results;
};

// Calculate Presentation results (similar logic but includes negative marks)
const calculatePresentationResults = async () => {
    const presentations = await Presentation.find();
    
    const results = await Promise.all(
        presentations.map(async (presentation) => {
            const assessments = await PresentationAssessment.find({ 
                abstractId: presentation._id 
            });

            if (assessments.length === 0) {
                return {
                    id: presentation._id,
                    abstractNo: presentation.abstractNo,
                    author: presentation.author,
                    title: presentation.title,
                    track: presentation.track,
                    hall: presentation.hall,
                    type: 'presentation',
                    totalJudges: 0,
                    averageScore: 0,
                    totalScore: 0,
                    assessments: []
                };
            }

            const totalScores = assessments.reduce((acc, assessment) => {
                const negativeMarks = assessment.scores.negativeMarks || 0;
                const totalScore = 
                    assessment.scores.researchTopic +
                    assessment.scores.methods +
                    assessment.scores.results +
                    assessment.scores.presentation +
                    assessment.scores.qa -
                    negativeMarks;

                return {
                    researchTopic: acc.researchTopic + assessment.scores.researchTopic,
                    methods: acc.methods + assessment.scores.methods,
                    results: acc.results + assessment.scores.results,
                    presentation: acc.presentation + assessment.scores.presentation,
                    qa: acc.qa + assessment.scores.qa,
                    negativeMarks: acc.negativeMarks + negativeMarks,
                    total: acc.total + totalScore
                };
            }, { researchTopic: 0, methods: 0, results: 0, presentation: 0, qa: 0, negativeMarks: 0, total: 0 });

            // Calculate averages
            const averageScores = {
                researchTopic: totalScores.researchTopic / assessments.length,
                methods: totalScores.methods / assessments.length,
                results: totalScores.results / assessments.length,
                presentation: totalScores.presentation / assessments.length,
                qa: totalScores.qa / assessments.length,
                negativeMarks: totalScores.negativeMarks / assessments.length
            };

            const overallAverage = totalScores.total / assessments.length;

            return {
                id: presentation._id,
                abstractNo: presentation.abstractNo,
                author: presentation.author,
                title: presentation.title,
                track: presentation.track,
                hall: presentation.hall,
                type: 'presentation',
                totalJudges: assessments.length,
                averageScore: parseFloat(overallAverage.toFixed(2)),
                totalScore: parseFloat(totalScores.total.toFixed(2)),
                categoryScores: averageScores,
                assessments: assessments.map(a => ({
                    judgeId: a.judgeId,
                    scores: a.scores,
                    comments: a.comments
                }))
            };
        })
    );

    return results;
};

// Get detailed results for a single abstract
export const getAbstractResults = async (req, res) => {
    try {
        const { abstractNo } = req.params;
        const { type } = req.query; // 'eposter' or 'presentation'

        let abstract, assessments;

        if (type === 'eposter') {
            abstract = await Eposter.findOne({ abstractNo });
            if (!abstract) return res.status(404).json({ message: "ePoster not found" });
            
            assessments = await EposterAssessment.find({ abstractId: abstract._id })
                .populate('judgeId', 'email');
        } else if (type === 'presentation') {
            abstract = await Presentation.findOne({ abstractNo });
            if (!abstract) return res.status(404).json({ message: "Presentation not found" });
            
            assessments = await PresentationAssessment.find({ abstractId: abstract._id })
                .populate('judgeId', 'email');
        } else {
            return res.status(400).json({ message: "Type parameter required" });
        }

        if (assessments.length === 0) {
            return res.json({
                abstract,
                totalJudges: 0,
                averageScore: 0,
                message: "No assessments yet"
            });
        }

        // Calculate averages (same logic as above)
        const totalScores = assessments.reduce((acc, assessment) => {
            const scores = assessment.scores;
            if (type === 'presentation') {
                const negativeMarks = scores.negativeMarks || 0;
                const total = Object.values(scores).reduce((sum, score) => 
                    typeof score === 'number' ? sum + score : sum, 0) - negativeMarks;
                
                return {
                    researchTopic: acc.researchTopic + scores.researchTopic,
                    methods: acc.methods + scores.methods,
                    results: acc.results + scores.results,
                    presentation: acc.presentation + scores.presentation,
                    qa: acc.qa + scores.qa,
                    negativeMarks: acc.negativeMarks + negativeMarks,
                    total: acc.total + total
                };
            } else {
                return {
                    researchTopic: acc.researchTopic + scores.researchTopic,
                    methods: acc.methods + scores.methods,
                    results: acc.results + scores.results,
                    presentation: acc.presentation + scores.presentation,
                    qa: acc.qa + scores.qa,
                    total: acc.total + Object.values(scores).reduce((sum, score) => sum + score, 0)
                };
            }
        }, { researchTopic: 0, methods: 0, results: 0, presentation: 0, qa: 0, negativeMarks: 0, total: 0 });

        const averageScores = {};
        Object.keys(totalScores).forEach(key => {
            averageScores[key] = parseFloat((totalScores[key] / assessments.length).toFixed(2));
        });

        res.json({
            abstract,
            totalJudges: assessments.length,
            averageScore: averageScores.total,
            categoryAverages: averageScores,
            individualAssessments: assessments
        });

    } catch (err) {
        console.error('Single abstract results error:', err);
        res.status(500).json({ message: "Failed to calculate results" });
    }
};








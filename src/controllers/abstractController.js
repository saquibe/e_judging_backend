import Eposter from "../models/Eposter.js";
import PaperPresentation from "../models/PaperPresentation.js";
import VideoPresentation from "../models/VideoPresentation.js";
import EposterAssessment from "../models/EposterAssessment.js";
import PaperPresentationAssessment from "../models/PaperPresentationAssessment.js";
import VideoPresentationAssessment from "../models/VideoPresentationAssessment.js";

export const getAllAbstracts = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { type, track, hall, sort, search, judged } = req.query;

    // Fetch all abstracts from all types
    const [eposters, paperPresentations, videoPresentations] =
      await Promise.all([
        Eposter.find(),
        PaperPresentation.find(),
        VideoPresentation.find(),
      ]);

    // Fetch assessments by THIS admin for each type
    const [
      myEposterAssessments,
      myPaperPresentationAssessments,
      myVideoPresentationAssessments,
    ] = await Promise.all([
      EposterAssessment.find({ judgeId: adminId }).select("abstractId"),
      PaperPresentationAssessment.find({ judgeId: adminId }).select(
        "abstractId"
      ),
      VideoPresentationAssessment.find({ judgeId: adminId }).select(
        "abstractId"
      ),
    ]);

    // Convert to lookup maps
    const myEposterMap = new Set(
      myEposterAssessments.map((a) => a.abstractId.toString())
    );
    const myPaperPresentationMap = new Set(
      myPaperPresentationAssessments.map((a) => a.abstractId.toString())
    );
    const myVideoPresentationMap = new Set(
      myVideoPresentationAssessments.map((a) => a.abstractId.toString())
    );

    // Merge results
    let merged = [
      ...eposters.map((e) => ({
        id: e._id,
        abstractNo: e.abstractNo,
        author: e.author,
        title: e.title,
        track: e.track,
        hall: e.hall,
        type: "ePoster Presentation",
        isJudged: myEposterMap.has(e._id.toString()),
      })),
      ...paperPresentations.map((p) => ({
        id: p._id,
        abstractNo: p.abstractNo,
        author: p.author,
        title: p.title,
        track: p.track,
        hall: p.hall,
        type: "Paper Presentation",
        isJudged: myPaperPresentationMap.has(p._id.toString()),
      })),
      ...videoPresentations.map((v) => ({
        id: v._id,
        abstractNo: v.abstractNo,
        author: v.author,
        title: v.title,
        track: v.track,
        hall: v.hall,
        type: "Video Presentation",
        isJudged: myVideoPresentationMap.has(v._id.toString()),
      })),
    ];

    // Apply filters
    if (type) merged = merged.filter((i) => i.type === type);
    if (track)
      merged = merged.filter((i) =>
        i.track?.toLowerCase().includes(track.toLowerCase())
      );
    if (hall)
      merged = merged.filter(
        (i) => i.hall?.toLowerCase() === hall.toLowerCase()
      );
    if (judged === "true") merged = merged.filter((i) => i.isJudged === true);
    if (judged === "false") merged = merged.filter((i) => i.isJudged === false);

    if (search) {
      const q = search.toLowerCase();
      merged = merged.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.author.toLowerCase().includes(q) ||
          i.track.toLowerCase().includes(q) ||
          String(i.abstractNo).includes(q)
      );
    }

    // Apply sorting
    if (sort === "asc") merged.sort((a, b) => a.abstractNo - b.abstractNo);
    else if (sort === "desc")
      merged.sort((a, b) => b.abstractNo - a.abstractNo);
    else if (sort === "alpha")
      merged.sort((a, b) => a.title.localeCompare(b.title));
    else merged.sort((a, b) => a.abstractNo - b.abstractNo);

    res.json({
      success: true,
      total: merged.length,
      data: merged,
    });
  } catch (err) {
    console.error("Error fetching abstracts:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch abstracts",
    });
  }
};

const Url = require('../models/Url');
const Visit = require('../models/Visit');

const getAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const url = await Url.findOne({ _id: id, userId });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    const visits = await Visit.find({ urlId: id }).sort({ visitedAt: -1 }).limit(50);

    const totalClicks = url.clickCount;
    const lastVisited = visits.length > 0 ? visits[0].visitedAt : null;

    const recentVisits = visits.map(visit => ({
      visitedAt: visit.visitedAt,
      browser: visit.browser,
      device: visit.device,
      ipAddress: visit.ipAddress
    }));

    const dailyClicks = await Visit.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalClicks,
        lastVisited,
        recentVisits,
        dailyClicks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getPublicStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    const visits = await Visit.find({ urlId: url._id }).sort({ visitedAt: -1 }).limit(20);

    const totalClicks = url.clickCount;
    const lastVisited = visits.length > 0 ? visits[0].visitedAt : null;

    const recentVisits = visits.map(visit => ({
      visitedAt: visit.visitedAt,
      browser: visit.browser,
      device: visit.device
    }));

    res.status(200).json({
      success: true,
      data: {
        totalClicks,
        lastVisited,
        recentVisits
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { getAnalytics, getPublicStats };

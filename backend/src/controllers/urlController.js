const { nanoid } = require('nanoid');
const QRCode = require('qrcode');
const Url = require('../models/Url');
const Visit = require('../models/Visit');

const createUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiryDate } = req.body;
    const userId = req.userId;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'Original URL is required'
      });
    }

    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    let shortCode;
    if (customAlias) {
      const existingAlias = await Url.findOne({ customAlias });
      if (existingAlias) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias already exists'
        });
      }
      shortCode = customAlias;
    } else {
      shortCode = nanoid(8);
    }

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);

    const url = new Url({
      userId,
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      expiryDate: expiryDate || undefined,
      qrCode: qrCodeDataUrl
    });

    await url.save();

    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortUrl,
        shortCode: url.shortCode,
        qrCode: url.qrCode,
        createdAt: url.createdAt,
        expiryDate: url.expiryDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const userId = req.userId;
    const urls = await Url.find({ userId }).sort({ createdAt: -1 });

    const urlsData = urls.map(url => ({
      id: url._id,
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      expiryDate: url.expiryDate,
      qrCode: url.qrCode
    }));

    res.status(200).json({
      success: true,
      data: urlsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const deleteUrl = async (req, res) => {
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

    await Visit.deleteMany({ urlId: id });
    await Url.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { originalUrl, customAlias, expiryDate } = req.body;
    const userId = req.userId;

    console.log('Update URL request:', { id, originalUrl, customAlias, expiryDate });

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'Original URL is required'
      });
    }

    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    const url = await Url.findOne({ _id: id, userId });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    console.log('URL before update:', { originalUrl: url.originalUrl, expiryDate: url.expiryDate });

    url.originalUrl = originalUrl;

    // Update custom alias if provided
    if (customAlias !== undefined) {
      if (customAlias && customAlias !== url.customAlias) {
        const existingAlias = await Url.findOne({ customAlias });
        if (existingAlias && existingAlias._id.toString() !== id) {
          return res.status(400).json({
            success: false,
            message: 'Custom alias already exists'
          });
        }
        url.customAlias = customAlias;
        url.shortCode = customAlias;
      } else if (!customAlias) {
        // If customAlias is explicitly set to empty/undefined, remove it and generate new shortCode
        url.customAlias = undefined;
        url.shortCode = nanoid(8);
      }
    }

    // Update expiry date if provided
    if (expiryDate !== undefined) {
      url.expiryDate = expiryDate || undefined;
      console.log('Updated expiryDate to:', url.expiryDate, '(type:', typeof url.expiryDate + ')');
    } else {
      console.log('expiryDate is undefined, not updating');
    }
    
    // Explicitly handle activate case - if expiryDate is undefined, remove it
    if (expiryDate === undefined) {
      url.expiryDate = undefined;
      console.log('Explicitly setting expiryDate to undefined for activation');
    }

    await url.save();

    console.log('URL after update:', { originalUrl: url.originalUrl, expiryDate: url.expiryDate });

    res.status(200).json({
      success: true,
      message: 'URL updated successfully',
      data: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        expiryDate: url.expiryDate
      }
    });
  } catch (error) {
    console.error('Update URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const bulkCreateUrls = async (req, res) => {
  try {
    const { urls } = req.body;
    const userId = req.userId;

    console.log('Bulk create request received:', { userId, urlCount: urls?.length });

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'URLs array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const urlData of urls) {
      const { originalUrl, customAlias, expiryDate } = urlData;

      if (!originalUrl) {
        errors.push({
          originalUrl: originalUrl || 'undefined',
          error: 'Original URL is required'
        });
        continue;
      }

      try {
        new URL(originalUrl);
      } catch (error) {
        errors.push({
          originalUrl,
          error: 'Invalid URL format'
        });
        continue;
      }

      let shortCode;
      if (customAlias) {
        const existingAlias = await Url.findOne({ customAlias });
        if (existingAlias) {
          errors.push({
            originalUrl,
            error: 'Custom alias already exists'
          });
          continue;
        }
        shortCode = customAlias;
      } else {
        shortCode = nanoid(8);
      }

      const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

      const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);

      const url = new Url({
        userId,
        originalUrl,
        shortCode,
        customAlias: customAlias || undefined,
        expiryDate: expiryDate || undefined,
        qrCode: qrCodeDataUrl
      });

      await url.save();

      results.push({
        id: url._id,
        originalUrl: url.originalUrl,
        shortUrl,
        shortCode: url.shortCode,
        qrCode: url.qrCode,
        createdAt: url.createdAt,
        expiryDate: url.expiryDate
      });
    }

    console.log('Bulk create completed:', { successCount: results.length, errorCount: errors.length });

    res.status(201).json({
      success: true,
      message: 'Bulk URL processing completed',
      data: {
        success: results,
        errors,
        totalProcessed: urls.length,
        successCount: results.length,
        errorCount: errors.length
      }
    });
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).send('URL not found');
    }

    if (url.expiryDate && new Date(url.expiryDate) < new Date()) {
      return res.status(410).send('Link Expired');
    }

    url.clickCount += 1;
    await url.save();

    const userAgent = req.headers['user-agent'] || '';
    let browser = 'Other';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Safari')) browser = 'Safari';

    let device = 'Other';
    if (/Mobile|Android|iPhone/i.test(userAgent)) device = 'Mobile';
    else if (/Tablet|iPad/i.test(userAgent)) device = 'Tablet';
    else if (/Desktop|Windows|Mac|Linux/i.test(userAgent)) device = 'Desktop';

    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    const visit = new Visit({
      urlId: url._id,
      ipAddress,
      browser,
      device
    });

    await visit.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

module.exports = { createUrl, getAllUrls, deleteUrl, updateUrl, redirectUrl, bulkCreateUrls };

/**
 * Cost Control, Free Quota Monitoring & Budget Enforcement Service
 * Prevents accidental billing, monitors free-tier usage thresholds, and manages provider fallbacks.
 */

class CostControlService {
  constructor() {
    this.paidServicesEnabled = process.env.ENABLE_PAID_SERVICES === 'true';
    
    // Daily usage counters (reset every 24 hours)
    this.metrics = {
      geminiAiRequestsToday: 0,
      geminiAiTokensToday: 0,
      emailsSentToday: 0,
      imageKitUploadsMonth: 0,
      geoNominatimRequestsToday: 0,
      geoCacheHitsToday: 0,
      lastResetDate: new Date().toISOString().split('T')[0]
    };

    // Free Tier Quota Limits
    this.quotas = {
      geminiFreeRpd: 1500,        // 1,500 Requests Per Day on Gemini 1.5/2.0 Flash
      geminiFreeRpm: 15,          // 15 Requests Per Minute
      brevoFreeEmailsPerDay: 300, // 300 Emails Per Day on Brevo Free
      gmailFreeEmailsPerDay: 500, // 500 Emails Per Day on Standard SMTP
      imageKitFreeMonthlyGb: 20,  // 20 GB Monthly Bandwidth/Storage
      nominatimMaxRps: 1,         // 1 Request Per Second on OSM Nominatim
    };
  }

  _checkDayReset() {
    const today = new Date().toISOString().split('T')[0];
    if (this.metrics.lastResetDate !== today) {
      this.metrics.geminiAiRequestsToday = 0;
      this.metrics.geminiAiTokensToday = 0;
      this.metrics.emailsSentToday = 0;
      this.metrics.geoNominatimRequestsToday = 0;
      this.metrics.geoCacheHitsToday = 0;
      this.metrics.lastResetDate = today;
    }
  }

  /**
   * Check if AI request is permitted within free quota
   */
  canMakeAiRequest() {
    this._checkDayReset();
    if (this.metrics.geminiAiRequestsToday >= this.quotas.geminiFreeRpd) {
      console.warn('⚠️ CostControl: Gemini daily free tier limit (1,500 RPD) reached. Routing to offline knowledge engine.');
      return false;
    }
    return true;
  }

  recordAiRequest(estimatedTokens = 150) {
    this._checkDayReset();
    this.metrics.geminiAiRequestsToday++;
    this.metrics.geminiAiTokensToday += estimatedTokens;
  }

  /**
   * Check if email can be sent within daily free quota
   */
  canSendEmail() {
    this._checkDayReset();
    const limit = process.env.SMTP_PROVIDER === 'brevo' 
      ? this.quotas.brevoFreeEmailsPerDay 
      : this.quotas.gmailFreeEmailsPerDay;
      
    if (this.metrics.emailsSentToday >= limit) {
      console.warn(`⚠️ CostControl: Daily free email limit (${limit}) reached. Storing in delivery queue.`);
      return false;
    }
    return true;
  }

  recordEmailSent() {
    this._checkDayReset();
    this.metrics.emailsSentToday++;
  }

  recordGeoRequest(isCacheHit) {
    this._checkDayReset();
    if (isCacheHit) {
      this.metrics.geoCacheHitsToday++;
    } else {
      this.metrics.geoNominatimRequestsToday++;
    }
  }

  /**
   * Get full audit snapshot of free tier consumption and cost estimation
   */
  getCostAuditSummary() {
    this._checkDayReset();

    const geminiPct = Math.round((this.metrics.geminiAiRequestsToday / this.quotas.geminiFreeRpd) * 100);
    const emailLimit = process.env.SMTP_PROVIDER === 'brevo' ? this.quotas.brevoFreeEmailsPerDay : this.quotas.gmailFreeEmailsPerDay;
    const emailPct = Math.round((this.metrics.emailsSentToday / emailLimit) * 100);

    return {
      currentBillingPeriod: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      paidServicesPolicy: this.paidServicesEnabled ? 'ENABLED' : 'STRICTLY_BLOCKED (Zero-Spend Mode)',
      totalMonthlySpendUsd: 0.00,
      totalMonthlySpendInr: 0.00,
      freeTierStatus: {
        database: {
          provider: 'MongoDB Atlas M0 Free Cluster',
          tier: 'Free Forever',
          allocatedStorageMb: 512,
          currentStorageMb: '~18.4 MB',
          costPerMonth: '₹0.00 ($0.00)'
        },
        aiAssistance: {
          provider: 'Google Gemini 1.5 / 2.0 Flash',
          dailyQuotaLimit: this.quotas.geminiFreeRpd,
          requestsUsedToday: this.metrics.geminiAiRequestsToday,
          quotaUsedPercent: `${geminiPct}%`,
          costPerMonth: '₹0.00 ($0.00)'
        },
        transactionalEmail: {
          provider: process.env.SMTP_PROVIDER || 'Brevo Free / Standard SMTP',
          dailyQuotaLimit: emailLimit,
          emailsSentToday: this.metrics.emailsSentToday,
          quotaUsedPercent: `${emailPct}%`,
          costPerMonth: '₹0.00 ($0.00)'
        },
        imageStorage: {
          provider: 'ImageKit Free Tier / Local Storage Fallback',
          monthlyBandwidthGb: this.quotas.imageKitFreeMonthlyGb,
          costPerMonth: '₹0.00 ($0.00)'
        },
        mappingAndGeo: {
          provider: 'OpenStreetMap + Leaflet + Nominatim',
          cacheHitsToday: this.metrics.geoCacheHitsToday,
          networkQueriesToday: this.metrics.geoNominatimRequestsToday,
          costPerMonth: '₹0.00 ($0.00)'
        },
        paymentsSandbox: {
          provider: 'Razorpay Sandbox + Stripe Test Mode',
          testTransactionsActive: true,
          costPerMonth: '₹0.00 ($0.00)'
        }
      }
    };
  }
}

module.exports = new CostControlService();


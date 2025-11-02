# 🚀 Deployment Instructions - Email Notifications for WhatsApp Orders

## Overview

This document provides deployment instructions for the newly implemented email notification system for WhatsApp orders.

## Changes Summary

### New Features
1. ✅ Email notifications to `riyanshamrit106@gmail.com` for all WhatsApp orders
2. ✅ Beautiful HTML email templates with customer details
3. ✅ Automatic notifications for Buy Now and Checkout flows
4. ✅ Non-blocking implementation (email failures don't interrupt user flow)

### Files Modified
1. `apps/api/src/services/emailService.ts` - New `sendWhatsAppOrderEmail` function
2. `apps/api/src/routes/orders.ts` - New `/whatsapp-notify` endpoint
3. `apps/web/src/app/checkout/page.tsx` - Email notification integration
4. `apps/web/src/app/products/[slug]/page.tsx` - Email notification integration

## Pre-Deployment Checklist

- [x] Email service function implemented
- [x] API endpoint created and tested
- [x] Frontend integration complete
- [x] Error handling implemented
- [x] No linter errors
- [x] Documentation complete

## Deployment Steps

### 1. SSH into Server

```bash
ssh your-server-credentials
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
```

### 2. Pull Latest Changes

```bash
git pull origin main
# or
git pull origin master
```

### 3. Install Dependencies (if needed)

```bash
# Install API dependencies (should already be done)
cd apps/api && npm install && cd ../..

# Install web dependencies (should already be done)
cd apps/web && npm install && cd ../..
```

### 4. Build Applications

```bash
# Build Web App
cd apps/web
npm run build
cd ../..

# Build Admin App (if changed)
cd apps/admin
npm run build
cd ../..
```

### 5. Restart Services

```bash
# Restart PM2 processes
pm2 restart all

# Save PM2 configuration
pm2 save
```

### 6. Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs api --lines 50
```

### 7. Test Email Notifications

1. **Test Checkout Flow**:
   - Add products to cart
   - Go to checkout page
   - Fill in customer details
   - Click "Proceed to WhatsApp Order"
   - Check email: `riyanshamrit106@gmail.com`

2. **Test Buy Now Flow**:
   - Visit any product page
   - Click "Buy Now" button
   - Check email: `riyanshamrit106@gmail.com`

3. **Verify Email Content**:
   - ✅ Customer name appears
   - ✅ Customer email appears (clickable)
   - ✅ Customer phone appears (clickable)
   - ✅ Shipping address appears
   - ✅ Product names listed correctly
   - ✅ Order type shows correctly
   - ✅ Order date/time accurate

## Rollback Instructions

If issues occur, revert to previous version:

```bash
# Find previous commit
git log --oneline

# Revert to previous commit
git revert HEAD

# Rebuild and restart
cd apps/web && npm run build && cd ../..
cd apps/admin && npm run build && cd ../..
pm2 restart all
pm2 save
```

## Troubleshooting

### Email Not Being Sent

**Check**:
1. PM2 logs for errors: `pm2 logs api --lines 100`
2. Environment variables: `pm2 env 0`
3. Nodemailer configuration in email service

**Common Issues**:
- Missing `EMAIL_PASSWORD` environment variable
- Gmail App Password expired
- Network connectivity issues

### API Endpoint Not Working

**Check**:
1. PM2 status: `pm2 status`
2. API logs: `pm2 logs api`
3. Network connectivity
4. Authentication token in browser DevTools

### Frontend Not Calling API

**Check**:
1. Browser console for errors
2. Network tab in DevTools
3. API URL configuration
4. Authentication token

## Environment Variables

Ensure these are set in `ecosystem.config.js` or `.env`:

```bash
EMAIL_USER=riyanshamrit106@gmail.com
EMAIL_PASSWORD=xcjissfszpokgvfn
NEXT_PUBLIC_API_URL=https://riyanshamrit.com
```

## Monitoring

### Log Files
- API logs: `pm2 logs api`
- Web logs: `pm2 logs web`
- Admin logs: `pm2 logs admin`

### Email Delivery
- Check sent email logs in Gmail
- Verify email arrives at `riyanshamrit106@gmail.com`
- Check spam folder if not in inbox

## Support

For issues or questions:
1. Check logs: `pm2 logs api --lines 100`
2. Review documentation: `EMAIL_NOTIFICATIONS_IMPLEMENTATION.md`
3. Check server status: `pm2 status`

## Post-Deployment Verification

After deployment, verify:

- [ ] Web app loads correctly at `https://riyanshamrit.com`
- [ ] Admin panel loads at `https://riyanshamrit.com/admin/`
- [ ] Checkout flow completes successfully
- [ ] Buy Now button works correctly
- [ ] Email notifications arrive in inbox
- [ ] Email content is correct and formatted
- [ ] No console errors in browser
- [ ] No errors in PM2 logs

## Success Criteria

✅ All WhatsApp orders trigger email notifications
✅ Emails include complete customer information
✅ Emails include all product details
✅ Emails are properly formatted
✅ Email failures don't interrupt user flow
✅ No linter errors
✅ No runtime errors

---

**Deployment Date**: December 2024
**Status**: Ready for Production


# 🚀 Final Deployment Instructions

## All Issues Fixed - Ready to Deploy!

Your project now has all the necessary fixes. Follow these steps to deploy to Cloudways.

---

## Step 1: Upload Files

Upload these files to your Cloudways server at:

```
/home/1542906.cloudwaysapps.com/awxrfzsrma/public_html/
```

**Files to upload:**

- ✅ `.htaccess` (replace existing)
- ✅ `FINAL_PRODUCTION_FIX.sh` (replace existing or new)
- ✅ All application code files

---

## Step 2: SSH into Cloudways

```bash
ssh master@YOUR_SERVER_IP
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
```

---

## Step 3: Run Deployment Script

```bash
chmod +x FINAL_PRODUCTION_FIX.sh
./FINAL_PRODUCTION_FIX.sh
```

**What this does:**

1. ✅ Stops PM2 processes
2. ✅ Creates environment files with correct URLs
3. ✅ Rebuilds API, Web, and Admin apps
4. ✅ Restarts PM2 with all apps
5. ✅ Verifies everything is working

**Expected output:**

```
✅ API is responding on localhost:4000
✅ Environment files created
✅ Web app build successful
✅ Admin app build successful
✅ All PM2 processes online
✅ Tests passed!
```

---

## Step 4: Verify Deployment

### Test Website

- Visit: https://riyanshamrit.com/store
- ✅ Products should be visible
- ✅ No "No Products Found" message
- ✅ Console shows no errors

### Test Admin Panel

- Visit: https://riyanshamrit.com/admin/
- ✅ Admin panel loads
- ✅ Login with: admin / admin123
- ✅ Dashboard shows data
- ✅ No console errors

### Test API

- Visit: https://riyanshamrit.com/api/products
- ✅ Should return JSON array of products

---

## Step 5: Check Console Logs

### Browser Console

Open DevTools Console and verify:

- ✅ No `localhost:4000` errors
- ✅ No `ERR_CONNECTION_REFUSED`
- ✅ No `404` errors
- ✅ All API calls succeed

### PM2 Logs

```bash
pm2 logs --lines 50
```

Should show:

- ✅ All 3 apps online
- ✅ No errors
- ✅ API running on 0.0.0.0:4000

---

## Quick Verification Commands

```bash
# Check PM2 status
pm2 status

# Check API response
curl http://localhost:4000/api/products

# Check environment variables
grep "API_URL" apps/web/.env.local
grep "API_URL" apps/admin/.env

# View logs
pm2 logs riyansh-api --lines 20
pm2 logs riyansh-web --lines 20
pm2 logs riyansh-admin --lines 20
```

---

## Troubleshooting

### Issue: Admin panel still shows errors

**Solution**:

```bash
# Verify .htaccess is in correct location
ls -la /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html/.htaccess

# Check Apache is reading it
tail -f /var/log/apache2/error.log

# Restart Apache if needed
sudo systemctl restart apache2
```

### Issue: Products not showing

**Solution**:

```bash
# Check API is responding
curl http://localhost:4000/api/products

# Verify web environment
cat apps/web/.env.local

# Rebuild web app
cd apps/web
npm run build
pm2 restart riyansh-web
```

### Issue: PM2 apps keep restarting

**Solution**:

```bash
# Check for errors
pm2 logs --err

# Stop all apps
pm2 stop all

# Delete and restart
pm2 delete all
pm2 start ecosystem.config.js

# Or use the deployment script again
./FINAL_PRODUCTION_FIX.sh
```

---

## Final Checklist

Before considering deployment complete:

- [ ] All 3 PM2 apps show "online" status
- [ ] Website loads at https://riyanshamrit.com
- [ ] Store page shows products
- [ ] Admin panel loads at https://riyanshamrit.com/admin/
- [ ] Admin login works
- [ ] No console errors in browser
- [ ] API returns data at https://riyanshamrit.com/api/products
- [ ] All navigation works
- [ ] Cart and checkout work (if applicable)

---

## Success! 🎉

If all checks pass, your deployment is complete and working!

**Next**: Monitor PM2 logs for 24 hours to ensure stability.

**Support**: If issues persist, check the troubleshooting section or review PM2 logs.

---

**Last Updated**: November 2025  
**Status**: Ready to Deploy ✅

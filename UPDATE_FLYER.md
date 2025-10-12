# UPDATE PALM BREEZE FLYER

## Current Flyer
The landing page currently references: `palm-breeze-flyer.jpg`

## To Update with New Flyer:

### Option 1: Via Command Line
```bash
cd wifi-landing-page
cp /path/to/new-flyer.jpg palm-breeze-flyer.jpg
```

### Option 2: Via File Manager
1. Save the new Palm Breeze flyer image
2. Rename it to: `palm-breeze-flyer.jpg`
3. Copy it to the `wifi-landing-page` directory
4. Replace the existing file when prompted

### Option 3: Use Different Filename
If you want to use a different name:
```bash
# Save your new flyer, then update the HTML:
sed -i 's|palm-breeze-flyer.jpg|new-flyer-name.jpg|g' index.html
```

## New Flyer Should Show:
✓ Basic: 7 Mbps - KSh 1500
✓ Budget: 14 Mbps - KSh 2000  
✓ Standard: 20 Mbps - KSh 2500
✓ Classic: 30 Mbps - KSh 3500
✓ Premium: 60 Mbps - KSh 4950
✓ Phone: 0742 22 44 14, 020 78 48 390, 0753 46 28 40
✓ FREE Installation
✓ "From as low as 1500" text

## After Updating:
```bash
# Refresh browser to see new flyer
xdg-open index.html
```

The HTML is already configured to display the correct plans matching your new flyer!

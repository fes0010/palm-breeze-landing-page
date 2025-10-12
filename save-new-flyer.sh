#!/bin/bash
echo "=== Palm Breeze Flyer Update Script ==="
echo ""
echo "Please save the new flyer image and provide its path:"
echo "Example: /home/festus/Downloads/new-palm-breeze-flyer.jpg"
echo ""
read -p "Enter the path to your new flyer: " FLYER_PATH

if [ -f "$FLYER_PATH" ]; then
    cp "$FLYER_PATH" palm-breeze-flyer.jpg
    echo "✓ Flyer updated successfully!"
    echo "Opening browser to preview..."
    xdg-open index.html 2>/dev/null &
else
    echo "✗ File not found. Please check the path and try again."
fi

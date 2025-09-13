#!/bin/bash

# Script to update all page files to use the enhanced universal path fixer

echo "🔧 Updating all page files to use enhanced universal path fixer..."

# Pages directory
PAGES_DIR="/workspaces/STC_IISERTVM/pages"

# List of HTML files to update (excluding backup files)
HTML_FILES=("about.html" "clubs.html" "contact.html" "events.html" "gallery.html" "leadership.html" "anvesha.html")

# Add club pages
CLUB_FILES=("club-ccit.html" "club-cmit.html" "club-compass.html" "club-csit.html" "club-esi.html" "club-exhibita.html" "club-parsec.html" "club-proteus.html" "club-psit.html" "club-qsi.html")

for file in "${HTML_FILES[@]}" "${CLUB_FILES[@]}"; do
    FILE_PATH="$PAGES_DIR/$file"
    if [ -f "$FILE_PATH" ]; then
        echo "Processing $file..."
        
        # Check if the file already has the universal-path-fixer script
        if ! grep -q "universal-path-fixer.js" "$FILE_PATH"; then
            # Add the universal path fixer script after the <head> tag
            sed -i '/<head>/a\    <!-- Universal Path Fixer Script -->\n    <script src="../js/universal-path-fixer.js" onerror="console.warn('"'"'Universal path fixer failed to load'"'"')"></script>' "$FILE_PATH"
            echo "  ✅ Added universal-path-fixer.js to $file"
        else
            echo "  ℹ️  $file already has universal-path-fixer.js"
        fi
        
        # Update navbar container IDs if needed
        if grep -q 'id="navbar"' "$FILE_PATH" && ! grep -q 'id="navbar-container"' "$FILE_PATH"; then
            sed -i 's/id="navbar"/id="navbar-container"/g' "$FILE_PATH"
            echo "  ✅ Updated navbar ID in $file"
        fi
        
        # Add footer container if missing
        if ! grep -q 'footer.*footer-container' "$FILE_PATH"; then
            # Look for closing </main> tag and add footer after it
            if grep -q '</main>' "$FILE_PATH"; then
                sed -i 's|</main>|</main>\n\n    <footer id="footer-container"></footer>|' "$FILE_PATH"
                echo "  ✅ Added footer container to $file"
            fi
        fi
        
    else
        echo "  ⚠️  File $file not found, skipping..."
    fi
done

echo "🎉 All page files have been updated!"
echo ""
echo "The following changes were made:"
echo "1. Added universal-path-fixer.js script to all pages"
echo "2. Updated navbar container IDs to 'navbar-container'"
echo "3. Added footer containers where missing"
echo ""
echo "This should fix:"
echo "- Navbar loading issues in deployment environments"
echo "- Path resolution for reverse proxy deployments"
echo "- Footer visibility across all pages"
#!/bin/bash

echo "🔍 STC Website Path Fixes Verification Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -d "pages" ] || [ ! -d "js" ]; then
    echo -e "${RED}❌ Please run this script from the STC website root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Checking file structure...${NC}"

# Check for key files
files_to_check=(
    "index.html"
    "js/universal-path-fixer.js"
    "footer.html"
    "pages/navbar.html"
    "pages/test-paths.html"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo ""
echo -e "${BLUE}🔧 Checking universal-path-fixer.js integration...${NC}"

# Check if pages have the universal path fixer
page_files=($(find pages -name "*.html" ! -name "*.backup*" ! -name "test-paths.html" | head -5))

for page in "${page_files[@]}"; do
    if grep -q "universal-path-fixer.js" "$page"; then
        echo -e "${GREEN}✅ $page has universal path fixer${NC}"
    else
        echo -e "${YELLOW}⚠️  $page missing universal path fixer${NC}"
    fi
done

echo ""
echo -e "${BLUE}🧭 Checking navbar container IDs...${NC}"

for page in "${page_files[@]}"; do
    if grep -q 'id="navbar-container"' "$page"; then
        echo -e "${GREEN}✅ $page has correct navbar container${NC}"
    elif grep -q 'id="navbar"' "$page"; then
        echo -e "${YELLOW}⚠️  $page uses old navbar ID${NC}"
    else
        echo -e "${RED}❌ $page missing navbar container${NC}"
    fi
done

echo ""
echo -e "${BLUE}👣 Checking footer containers...${NC}"

for page in "${page_files[@]}"; do
    if grep -q 'footer.*footer-container' "$page"; then
        echo -e "${GREEN}✅ $page has footer container${NC}"
    else
        echo -e "${YELLOW}⚠️  $page missing footer container${NC}"
    fi
done

echo ""
echo -e "${BLUE}📝 Checking index.html footer content...${NC}"

if grep -q "IISER Thiruvananthapuram" "index.html" && grep -q "footer-content" "index.html"; then
    echo -e "${GREEN}✅ index.html has complete footer content${NC}"
else
    echo -e "${RED}❌ index.html footer content incomplete${NC}"
fi

echo ""
echo -e "${BLUE}🔗 Testing path resolution logic...${NC}"

# Check if the universal path fixer has the key functions
if grep -q "fixPath" "js/universal-path-fixer.js" && grep -q "loadNavbar" "js/universal-path-fixer.js"; then
    echo -e "${GREEN}✅ universal-path-fixer.js has required functions${NC}"
else
    echo -e "${RED}❌ universal-path-fixer.js missing required functions${NC}"
fi

# Check deployment detection
if grep -q "isSTCDomain" "js/universal-path-fixer.js" && grep -q "students.iisertvm.ac.in" "js/universal-path-fixer.js"; then
    echo -e "${GREEN}✅ STC domain detection implemented${NC}"
else
    echo -e "${RED}❌ STC domain detection missing${NC}"
fi

echo ""
echo -e "${BLUE}🧪 Manual Testing Instructions:${NC}"
echo "1. Open a local server (e.g., python -m http.server 8000)"
echo "2. Visit http://localhost:8000/pages/test-paths.html"
echo "3. Check the console for path fixing logs"
echo "4. Verify navbar loads and links work"
echo "5. Test on actual deployment: https://students.iisertvm.ac.in/stc/"
echo ""

echo -e "${BLUE}📊 Summary:${NC}"
total_files=${#page_files[@]}
files_with_fixer=$(grep -l "universal-path-fixer.js" "${page_files[@]}" 2>/dev/null | wc -l)
files_with_navbar=$(grep -l 'id="navbar-container"' "${page_files[@]}" 2>/dev/null | wc -l)

echo "- Pages checked: $total_files"
echo "- Pages with path fixer: $files_with_fixer"
echo "- Pages with correct navbar container: $files_with_navbar"

if [ "$files_with_fixer" -eq "$total_files" ] && [ "$files_with_navbar" -eq "$total_files" ]; then
    echo -e "${GREEN}🎉 All checks passed! Website should work correctly across all deployments.${NC}"
else
    echo -e "${YELLOW}⚠️  Some issues found. Run fix-navbar-paths.sh to fix remaining issues.${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Deployment URLs to Test:${NC}"
echo "- Local: http://localhost:8000/"
echo "- GitHub Pages: https://coding-club-of-iiser-thiruvananthapuram.github.io/STC_IISERTVM/"
echo "- STC Domain: https://students.iisertvm.ac.in/stc/"
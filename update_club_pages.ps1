# PowerShell script to update all club pages with mobile CSS

$clubPages = Get-ChildItem -Path "$PSScriptRoot\pages\club-*.html"

foreach ($page in $clubPages) {
    $content = Get-Content -Path $page.FullName -Raw
    
    # Check if mobile.css is already included
    if ($content -notmatch '<link rel="stylesheet" href="../css/mobile.css">') {
        # Add mobile.css after navbar.css
        $updatedContent = $content -replace '(<link rel="stylesheet" href="navbar.css">)', "$1`n    <link rel=\"stylesheet\" href=\"../css/mobile.css\">"
        
        # Write the updated content back to the file
        Set-Content -Path $page.FullName -Value $updatedContent
        
        Write-Host "Updated $($page.Name)"
    } else {
        Write-Host "$($page.Name) already has mobile.css"
    }
}

Write-Host "All club pages updated successfully!"
$ErrorActionPreference = 'Stop'
$raw = Get-Content "$PSScriptRoot\china_full.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$cos = [math]::Cos(35 * [math]::PI / 180)
$scale = 10.0
$step = 0.35
$paths = New-Object System.Collections.Generic.List[string]
$names = New-Object System.Collections.Generic.List[string]
$minX = 9999.0; $maxX = -9999.0; $minY = 9999.0; $maxY = -9999.0

function Convert-Ring($ring, $prevX, $prevY) {
  $maxLat = -999.0
  foreach ($pt in $ring) { if ([double]$pt[1] -gt $maxLat) { $maxLat = [double]$pt[1] } }
  if ($maxLat -lt 17.5) { return '' }
  $sb = New-Object System.Text.StringBuilder
  $px = $null; $py = $null
  $first = $true
  foreach ($pt in $ring) {
    $x = ([double]$pt[0] - 73.5) * $cos * $scale
    $y = (53.8 - [double]$pt[1]) * $scale
    if ($x -lt $script:minX) { $script:minX = $x }
    if ($x -gt $script:maxX) { $script:maxX = $x }
    if ($y -lt $script:minY) { $script:minY = $y }
    if ($y -gt $script:maxY) { $script:maxY = $y }
    if ($first) {
      [void]$sb.Append("M$([math]::Round($x,1)) $([math]::Round($y,1))")
      $px = $x; $py = $y; $first = $false
    } else {
      $d = [math]::Abs($x - $px) + [math]::Abs($y - $py)
      if ($d -ge $script:step) {
        [void]$sb.Append("L$([math]::Round($x,1)) $([math]::Round($y,1))")
        $px = $x; $py = $y
      }
    }
  }
  return $sb.ToString()
}

foreach ($f in $raw.features) {
  $name = $f.properties.name
  $geom = $f.geometry
  $d = New-Object System.Text.StringBuilder
  if ($geom.type -eq 'Polygon') {
    foreach ($ring in $geom.coordinates) {
      [void]$d.Append((Convert-Ring $ring))
    }
  } elseif ($geom.type -eq 'MultiPolygon') {
    foreach ($poly in $geom.coordinates) {
      foreach ($ring in $poly) {
        [void]$d.Append((Convert-Ring $ring))
      }
    }
  }
  $paths.Add(('"{0}":"{1}"' -f $name, $d.ToString()))
  $names.Add($name)
}

$w = [math]::Round($maxX - $minX, 1)
$h = [math]::Round($maxY - $minY, 1)
$ox = [math]::Round($minX, 1)
$oy = [math]::Round($minY, 1)
$out = @"
window.CHINA_MAP = {
  viewBox: "0 0 $w $h",
  width: $w,
  height: $h,
  project: function(lon, lat) {
    return [ (lon - 73.5) * 0.8192 * 10 - $ox, (53.8 - lat) * 10 - $oy ];
  },
  provinces: {
"@ + ($paths -join ",`n") + @"
  }
};
"@
$out | Out-File "$PSScriptRoot\china-paths.js" -Encoding UTF8
Write-Output "w=$w h=$h ox=$ox oy=$oy bytes=$((Get-Item "$PSScriptRoot\china-paths.js").Length)"

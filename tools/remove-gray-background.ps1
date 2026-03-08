param(
  [Parameter(Mandatory = $true)]
  [string]$TargetPath
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $TargetPath)) {
  throw "Target file not found: $TargetPath"
}

$directory = Split-Path -Parent $TargetPath
$baseName = [System.IO.Path]::GetFileNameWithoutExtension($TargetPath)
$extension = [System.IO.Path]::GetExtension($TargetPath)
$backupPath = Join-Path $directory ($baseName + ".original" + $extension)
$tempPath = Join-Path $directory ($baseName + ".tmp" + $extension)

if (-not (Test-Path $backupPath)) {
  Copy-Item -Path $TargetPath -Destination $backupPath
}
else {
  Copy-Item -Path $backupPath -Destination $TargetPath -Force
}

$bitmap = New-Object System.Drawing.Bitmap($TargetPath)
$rectangle = New-Object System.Drawing.Rectangle(0, 0, $bitmap.Width, $bitmap.Height)
$bitmapData = $bitmap.LockBits(
  $rectangle,
  [System.Drawing.Imaging.ImageLockMode]::ReadWrite,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)

try {
  $bytes = [Math]::Abs($bitmapData.Stride) * $bitmap.Height
  $buffer = New-Object byte[] $bytes
  [System.Runtime.InteropServices.Marshal]::Copy($bitmapData.Scan0, $buffer, 0, $bytes)

  for ($y = 0; $y -lt $bitmap.Height; $y++) {
    $rowIndex = $y * $bitmapData.Stride

    for ($x = 0; $x -lt $bitmap.Width; $x++) {
      $index = $rowIndex + ($x * 4)

      $blue = [int]$buffer[$index]
      $green = [int]$buffer[$index + 1]
      $red = [int]$buffer[$index + 2]
      $alpha = [int]$buffer[$index + 3]

      $max = [Math]::Max($red, [Math]::Max($green, $blue))
      $min = [Math]::Min($red, [Math]::Min($green, $blue))

      $nearGray = ($max - $min) -le 14
      $midTone = $max -ge 70 -and $max -le 175

      if ($alpha -gt 0 -and $nearGray -and $midTone) {
        $buffer[$index + 3] = 0
      }
    }
  }

  [System.Runtime.InteropServices.Marshal]::Copy($buffer, 0, $bitmapData.Scan0, $bytes)
}
finally {
  $bitmap.UnlockBits($bitmapData)
}

if (Test-Path $tempPath) {
  Remove-Item -Path $tempPath -Force
}

$bitmap.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()

Move-Item -Path $tempPath -Destination $TargetPath -Force

Write-Output "Processed: $TargetPath"

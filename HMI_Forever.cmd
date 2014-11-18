@IF EXIST "%~dp0\node.exe" (
  "forever"  "%~dp0\app.js" %*
) ELSE (
  node  "%~dp0\app.js" %*
)
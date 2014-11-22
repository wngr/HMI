@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\app.js -port=80 -server=live" %*
) ELSE (
  node  "%~dp0\app.js -port=80 -server=live" %*
)